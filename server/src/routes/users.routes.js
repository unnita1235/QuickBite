import express from 'express';
import pool from '../db.js';
import { verifyToken, handleError } from '../middleware.js';
import { validateName, validateEmail, sanitizeInput } from '../validation.js';

const router = express.Router();

// GET /api/users/profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, first_name AS name, last_name, phone, created_at FROM users WHERE id = $1',
      [req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    handleError(res, error);
  }
});

// PUT /api/users/profile
router.put('/profile', verifyToken, async (req, res) => {
  const { firstName, lastName, phone, email } = sanitizeInput(req.body);

  if (firstName && !validateName(firstName)) {
    return res.status(400).json({ success: false, error: 'Invalid first name' });
  }
  if (lastName && lastName.length > 100) {
    return res.status(400).json({ success: false, error: 'Last name too long' });
  }
  if (email && !validateEmail(email)) {
    return res.status(400).json({ success: false, error: 'Invalid email' });
  }

  try {
    const result = await pool.query(
      'UPDATE users SET first_name = COALESCE($1, first_name), last_name = COALESCE($2, last_name), phone = COALESCE($3, phone), email = COALESCE($4, email), updated_at = NOW() WHERE id = $5 RETURNING id, email, first_name AS name, last_name, phone, created_at',
      [firstName || null, lastName || null, phone || null, email || null, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    handleError(res, error);
  }
});

export default router;
