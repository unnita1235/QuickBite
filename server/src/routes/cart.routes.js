import express from 'express';
import pool from '../db.js';
import { verifyToken, handleError } from '../middleware.js';

const router = express.Router();

// GET /api/cart - Get authenticated user's cart
router.get('/', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT items, updated_at FROM carts WHERE user_id = $1',
      [req.userId]
    );

    if (result.rows.length === 0) {
      return res.json({
        success: true,
        data: { items: [], updated_at: null }
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    handleError(res, error);
  }
});

// PUT /api/cart - Save/update authenticated user's cart
router.put('/', verifyToken, async (req, res) => {
  const { items } = req.body;

  if (!Array.isArray(items)) {
    return res.status(400).json({
      success: false,
      error: 'Items must be an array'
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO carts (user_id, items, updated_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (user_id)
       DO UPDATE SET items = $2, updated_at = NOW()
       RETURNING items, updated_at`,
      [req.userId, JSON.stringify(items)]
    );

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    handleError(res, error);
  }
});

// DELETE /api/cart - Clear authenticated user's cart
router.delete('/', verifyToken, async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM carts WHERE user_id = $1',
      [req.userId]
    );

    res.json({
      success: true,
      message: 'Cart cleared'
    });
  } catch (error) {
    handleError(res, error);
  }
});

export default router;
