import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db.js';
import { handleError } from '../middleware.js';
import { validateEmail, validatePassword, validateName, sanitizeInput } from '../validation.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login/registration attempts, please try again later',
  skipSuccessfulRequests: true,
});

// POST /api/auth/register
router.post('/register', authLimiter, async (req, res) => {
  const { email, password, name } = sanitizeInput(req.body);

  if (!validateEmail(email)) {
    return res.status(400).json({ success: false, error: 'Invalid email format' });
  }
  if (!validatePassword(password)) {
    return res.status(400).json({ success: false, error: 'Password must be at least 8 characters' });
  }
  if (!validateName(name)) {
    return res.status(400).json({ success: false, error: 'Name must be 2-100 characters' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (first_name, email, password_hash, created_at) VALUES ($1, $2, $3, NOW()) RETURNING id, email, first_name AS name',
      [name, email, hashedPassword]
    );

    const user = result.rows[0];
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      data: {
        token,
        user: result.rows[0]
      }
    });
  } catch (error) {
    handleError(res, error, 400);
  }
});

// POST /api/auth/login
router.post('/login', authLimiter, async (req, res) => {
  const { email, password } = sanitizeInput(req.body);

  if (!validateEmail(email) || !password) {
    return res.status(400).json({ success: false, error: 'Invalid credentials' });
  }

  try {
    const result = await pool.query(
      'SELECT id, email, first_name AS name, password_hash FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      }
    });
  } catch (error) {
    handleError(res, error);
  }
});

export default router;
