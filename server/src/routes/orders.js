const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

/**
 * POST /api/orders
 * Create a new order
 */
router.post('/', authMiddleware, [
  body('restaurantId').notEmpty().withMessage('Restaurant ID is required'),
  body('items').isArray().withMessage('Items must be an array'),
  body('total').isFloat({ min: 0 }).withMessage('Total must be a positive number'),
  body('deliveryAddress').notEmpty().withMessage('Delivery address is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { restaurantId, items, total, deliveryAddress } = req.body;
  const userId = req.userId;

  try {
    const result = await pool.query(
      `INSERT INTO orders (user_id, restaurant_id, items_json, total, delivery_address, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING id, user_id, restaurant_id, total, status, created_at`,
      [userId, restaurantId, JSON.stringify(items), total, deliveryAddress, 'pending']
    );

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order'
    });
  }
});

/**
 * GET /api/orders
 * Get all orders for the authenticated user
 */
router.get('/', authMiddleware, async (req, res) => {
  const userId = req.userId;

  try {
    const result = await pool.query(
      `SELECT id, restaurant_id, total, status, delivery_address, created_at, updated_at
       FROM orders
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      orders: result.rows
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
});

/**
 * GET /api/orders/:id
 * Get a specific order by ID
 */
router.get('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const result = await pool.query(
      `SELECT id, restaurant_id, items_json, total, status, delivery_address, created_at, updated_at
       FROM orders
       WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      order: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order'
    });
  }
});

/**
 * PATCH /api/orders/:id
 * Update order status
 */
router.patch('/:id', authMiddleware, [
  body('status').isIn(['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled']).withMessage('Invalid status')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { status } = req.body;
  const userId = req.userId;

  try {
    // Verify order belongs to user
    const verifyResult = await pool.query(
      'SELECT id FROM orders WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (verifyResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const updateResult = await pool.query(
      `UPDATE orders
       SET status = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING id, status, updated_at`,
      [status, id]
    );

    res.json({
      success: true,
      message: 'Order status updated',
      order: updateResult.rows[0]
    });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order'
    });
  }
});

module.exports = router;
