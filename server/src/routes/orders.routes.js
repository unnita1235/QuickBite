import express from 'express';
import pool from '../db.js';
import { verifyToken, handleError } from '../middleware.js';

const router = express.Router();

// POST /api/orders
router.post('/', verifyToken, async (req, res) => {
  const { restaurantId, items, totalAmount, deliveryAddress, deliveryNotes } = req.body;
  const userId = req.userId;

  if (!restaurantId || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, error: 'Invalid order data' });
  }
  if (typeof totalAmount !== 'number' || totalAmount <= 0) {
    return res.status(400).json({ success: false, error: 'Invalid amount' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO orders (user_id, restaurant_id, items, total_amount, delivery_address, delivery_notes, status, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING *',
      [userId, restaurantId, JSON.stringify(items), totalAmount, deliveryAddress || null, deliveryNotes || null, 'pending']
    );

    res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    handleError(res, error, 400);
  }
});

// GET /api/orders
router.get('/', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT o.*, r.name as restaurant_name FROM orders o LEFT JOIN restaurants r ON o.restaurant_id = r.id WHERE o.user_id = $1 ORDER BY o.created_at DESC',
      [req.userId]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    handleError(res, error);
  }
});

// GET /api/orders/:id
router.get('/:id', verifyToken, async (req, res) => {
  if (isNaN(parseInt(req.params.id))) {
    return res.status(400).json({ success: false, error: 'Invalid order ID' });
  }

  try {
    const result = await pool.query(
      'SELECT o.*, r.name as restaurant_name FROM orders o LEFT JOIN restaurants r ON o.restaurant_id = r.id WHERE o.id = $1 AND o.user_id = $2',
      [req.params.id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    handleError(res, error);
  }
});

// PUT /api/orders/:id/status
router.put('/:id/status', verifyToken, async (req, res) => {
  if (isNaN(parseInt(req.params.id))) {
    return res.status(400).json({ success: false, error: 'Invalid order ID' });
  }

  const { status } = req.body;
  const orderId = req.params.id;
  const userId = req.userId;

  const validStatuses = ['pending', 'confirmed', 'preparing', 'on_the_way', 'delivered', 'cancelled'];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
    });
  }

  try {
    const verifyResult = await pool.query(
      'SELECT id, status FROM orders WHERE id = $1 AND user_id = $2',
      [orderId, userId]
    );

    if (verifyResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    const currentOrder = verifyResult.rows[0];
    const statusRank = { 'pending': 1, 'confirmed': 2, 'preparing': 3, 'on_the_way': 4, 'delivered': 5, 'cancelled': 6 };

    if (statusRank[status] < statusRank[currentOrder.status] && status !== 'cancelled') {
      return res.status(400).json({
        success: false,
        error: 'Cannot revert order status to previous states'
      });
    }

    const result = await pool.query(
      `UPDATE orders SET status = $1, updated_at = NOW(), completed_at = CASE WHEN $1 IN ('delivered', 'cancelled') THEN NOW() ELSE completed_at END WHERE id = $2 AND user_id = $3 RETURNING *`,
      [status, orderId, userId]
    );

    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      data: result.rows[0]
    });
  } catch (error) {
    handleError(res, error);
  }
});

export default router;
