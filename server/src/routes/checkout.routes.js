import express from 'express';
import Stripe from 'stripe';
import { verifyToken } from '../middleware.js';
import pool from '../db.js';

const router = express.Router();

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-12-18.acacia',
});

/**
 * POST /api/checkout/create-session
 * Creates a Stripe Checkout Session for the cart items
 */
router.post('/create-session', verifyToken, async (req, res) => {
    const { items, deliveryAddress, restaurantId } = req.body;
    const userId = req.userId;

    // Validate request body
    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
            success: false,
            error: 'Cart items are required',
        });
    }

    if (!deliveryAddress || typeof deliveryAddress !== 'string' || deliveryAddress.trim().length === 0) {
        return res.status(400).json({
            success: false,
            error: 'Delivery address is required',
        });
    }

    try {
        // Calculate total server-side (never trust client-side totals)
        const lineItems = items.map((item) => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.name,
                    description: item.description || undefined,
                    images: item.image ? [item.image] : undefined,
                },
                unit_amount: Math.round(item.price * 100), // Stripe expects cents
            },
            quantity: item.quantity,
        }));

        // Calculate total from items
        const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        // Create order in database with pending_payment status
        const orderResult = await pool.query(
            `INSERT INTO orders (user_id, restaurant_id, items, total, delivery_address, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING id`,
            [userId, restaurantId || 1, JSON.stringify(items), total, deliveryAddress.trim(), 'pending_payment']
        );

        const orderId = orderResult.rows[0].id;

        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/confirmation?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
            cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/checkout?cancelled=true`,
            metadata: {
                order_id: orderId.toString(),
                user_id: userId.toString(),
            },
            customer_email: req.userEmail, // If available from JWT
        });

        res.json({
            success: true,
            sessionId: session.id,
            checkoutUrl: session.url,
            orderId: orderId,
        });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create checkout session',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
});

/**
 * GET /api/checkout/session/:sessionId
 * Get the status of a checkout session
 */
router.get('/session/:sessionId', async (req, res) => {
    const { sessionId } = req.params;

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        res.json({
            success: true,
            session: {
                id: session.id,
                status: session.status,
                payment_status: session.payment_status,
                customer_email: session.customer_email,
                amount_total: session.amount_total,
                metadata: session.metadata,
            },
        });
    } catch (error) {
        console.error('Error retrieving session:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve checkout session',
        });
    }
});

export default router;
