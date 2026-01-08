import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ===== VALIDATION & MIDDLEWARE =====
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePassword = (pass) => pass && pass.length >= 8;
const validateName = (name) => name && name.length >= 2 && name.length <= 100;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later'
});

app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// ===== ENVIRONMENT VALIDATION =====
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

// ===== DATABASE CONNECTION =====
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('connect', () => console.log('✅ Connected to PostgreSQL'));
pool.on('error', (err) => console.error('❌ Unexpected error on idle client', err));

// ===== JWT MIDDLEWARE =====
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'No token provided'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token'
    });
  }
};

// ===== ERROR HANDLING UTILITY =====
const handleError = (res, error, status = 500) => {
  console.error('Error:', error);
  const message = error.code === '23505' ? 'Email already registered' : 'Database error';
  res.status(status).json({
    success: false,
    error: message
  });
};

// ===== HEALTH CHECK =====
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ===== AUTHENTICATION ENDPOINTS =====
app.post('/api/auth/register', async (req, res) => {
  const { email, password, name } = req.body;

  // Validation
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

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: result.rows[0]
    });
  } catch (error) {
    handleError(res, error, 400);
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

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
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    handleError(res, error);
  }
});

// ===== RESTAURANT ENDPOINTS =====
app.get('/api/restaurants', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const offset = (parseInt(req.query.page) || 0) * limit;

    const result = await pool.query(
      'SELECT id, name, description, cuisine_type, rating, delivery_time, address, created_at FROM restaurants ORDER BY rating DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    const countResult = await pool.query('SELECT COUNT(*) FROM restaurants');

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        total: parseInt(countResult.rows[0].count),
        limit,
        offset
      }
    });
  } catch (error) {
    handleError(res, error);
  }
});

app.get('/api/restaurants/:id', async (req, res) => {
  try {
    const restaurantResult = await pool.query(
      'SELECT * FROM restaurants WHERE id = $1',
      [req.params.id]
    );

    if (restaurantResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Restaurant not found' });
    }

    const menuResult = await pool.query(
      'SELECT * FROM menus WHERE restaurant_id = $1',
      [req.params.id]
    );

    res.json({
      success: true,
      data: {
        ...restaurantResult.rows[0],
        menus: menuResult.rows
      }
    });
  } catch (error) {
    handleError(res, error);
  }
});

app.post('/api/restaurants', verifyToken, async (req, res) => {
  const { name, description, cuisine_type, rating, delivery_time, address } = req.body;

  if (!name || !description) {
    return res.status(400).json({ success: false, error: 'Name and description required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO restaurants (name, description, cuisine_type, rating, delivery_time, address, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *',
      [name, description, cuisine_type || 'Other', rating || 4.0, delivery_time || 30, address]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    handleError(res, error, 400);
  }
});

// ===== ORDER ENDPOINTS =====
app.post('/api/orders', verifyToken, async (req, res) => {
  const { restaurantId, items, totalAmount } = req.body;
  const userId = req.userId;

  if (!restaurantId || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, error: 'Invalid order data' });
  }
  if (typeof totalAmount !== 'number' || totalAmount <= 0) {
    return res.status(400).json({ success: false, error: 'Invalid amount' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO orders (user_id, restaurant_id, items, total_amount, status, created_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *',
      [userId, restaurantId, JSON.stringify(items), totalAmount, 'pending']
    );

    res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    handleError(res, error, 400);
  }
});

app.get('/api/orders', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
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

app.get('/api/orders/:id', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
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

// ===== USER ENDPOINTS =====
app.get('/api/users/profile', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, name, created_at FROM users WHERE id = $1',
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

app.put('/api/users/profile', verifyToken, async (req, res) => {
  const { name, email } = req.body;

  if (name && !validateName(name)) {
    return res.status(400).json({ success: false, error: 'Invalid name' });
  }
  if (email && !validateEmail(email)) {
    return res.status(400).json({ success: false, error: 'Invalid email' });
  }

  try {
    const result = await pool.query(
      'UPDATE users SET name = COALESCE($1, name), email = COALESCE($2, email) WHERE id = $3 RETURNING id, email, name',
      [name || null, email || null, req.userId]
    );

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    handleError(res, error);
  }
});

// Root endpoint
app.get('/', (req, res) => res.status(200).json({ success: true, message: 'QuickBite Food Delivery API v1.0.0', endpoints: { health: '/api/health', auth: '/api/auth', restaurants: '/api/restaurants', orders: '/api/orders', users: '/api/users' }, documentation: 'See API_DOCUMENTATION.md for full API details' }));
// ===== SEARCH ENDPOINT =====
app.post('/api/search', async (req, res) => {
  const { query } = req.body;

  if (!query || query.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Search query required'
    });
  }

  try {
    // For now, return all restaurants with basic filtering
    // Later integrate with Gemini API here
    const result = await pool.query(
      'SELECT * FROM restaurants WHERE name ILIKE $1 OR description ILIKE $1 ORDER BY rating DESC LIMIT 10',
      [`%${query}%`]
    );

    res.json({
      success: true,
      results: result.rows
    });
  } catch (error) {
    handleError(res, error);
  }
});

// ===== ERROR HANDLERS =====
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: 'Internal server error'
  });
});

// ===== SERVER START =====
app.listen(PORT, () => {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`🚀 Backend running on port ${PORT}`);
  console.log(`📍 API: http://localhost:${PORT}/api`);
  console.log(`❤️ Health: http://localhost:${PORT}/api/health`);
  console.log(`${'='.repeat(50)}\n`);
});

export default app;
