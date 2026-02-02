import express from 'express';
import Stripe from 'stripe';
import pool from '../db.js';

const router = express.Router();

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-12-18.acacia',
});

/**
 * POST /api/webhook/stripe
 * Handle Stripe webhook events
 * 
 * IMPORTANT: This route requires raw body (not JSON parsed)
 * The express.raw() middleware must be applied BEFORE express.json()
 */
router.post('/stripe', async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    // In development without webhook secret, just process the event
    if (!webhookSecret) {
        console.warn('STRIPE_WEBHOOK_SECRET not set - skipping signature verification');
        try {
            const event = req.body;
            await handleWebhookEvent(event);
            return res.json({ received: true });
        } catch (error) {
            console.error('Webhook processing error:', error);
            return res.status(400).json({ error: error.message });
        }
    }

    let event;

    try {
        // Verify webhook signature
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).json({ error: `Webhook Error: ${err.message}` });
    }

    // Handle the event
    try {
        await handleWebhookEvent(event);
        res.json({ received: true });
    } catch (error) {
        console.error('Webhook processing error:', error);
        res.status(500).json({ error: 'Webhook processing failed' });
    }
});

/**
 * Handle different Stripe webhook events
 */
async function handleWebhookEvent(event) {
    switch (event.type) {
        case 'checkout.session.completed':
            await handleCheckoutSessionCompleted(event.data.object);
            break;

        case 'checkout.session.expired':
            await handleCheckoutSessionExpired(event.data.object);
            break;

        case 'payment_intent.succeeded':
            console.log('Payment intent succeeded:', event.data.object.id);
            break;

        case 'payment_intent.payment_failed':
            await handlePaymentFailed(event.data.object);
            break;

        default:
            console.log(`Unhandled event type: ${event.type}`);
    }
}

/**
 * Handle successful checkout session completion
 */
async function handleCheckoutSessionCompleted(session) {
    const orderId = session.metadata?.order_id;

    if (!orderId) {
        console.error('No order_id in session metadata');
        return;
    }

    console.log(`Payment completed for order ${orderId}`);

    try {
        // Update order status to confirmed
        const result = await pool.query(
            `UPDATE orders 
       SET status = 'confirmed', 
           stripe_session_id = $1,
           stripe_payment_intent = $2,
           updated_at = NOW()
       WHERE id = $3
       RETURNING id, status`,
            [session.id, session.payment_intent, orderId]
        );

        if (result.rows.length === 0) {
            console.error(`Order ${orderId} not found`);
            return;
        }

        console.log(`Order ${orderId} updated to confirmed`);
    } catch (error) {
        console.error('Error updating order status:', error);
        throw error;
    }
}

/**
 * Handle expired checkout session
 */
async function handleCheckoutSessionExpired(session) {
    const orderId = session.metadata?.order_id;

    if (!orderId) {
        return;
    }

    console.log(`Checkout session expired for order ${orderId}`);

    try {
        await pool.query(
            `UPDATE orders 
       SET status = 'cancelled', 
           updated_at = NOW()
       WHERE id = $1 AND status = 'pending_payment'`,
            [orderId]
        );
    } catch (error) {
        console.error('Error cancelling order:', error);
    }
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(paymentIntent) {
    console.log(`Payment failed for payment intent: ${paymentIntent.id}`);
    // Could update order status or notify user
}

export default router;
