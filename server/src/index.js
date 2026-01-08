import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ===== VALIDATION FUNCTIONS (FIX #5) =====
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) return false;
  if (email.length > 254) return false;
  const [local, domain] = email.split('@');
  if (local.length > 64) return false;
  if (domain.length > 255) return false;
  return true;
};
const validatePassword = (pass) => pass && pass.length >= 8;
const validateName = (name) => name && name.length >= 2 && name.length <= 100;

// ===== INPUT SANITIZATION (FIX #6) =====
const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return str
    .trim()
    .replace(/[<>]/g, '')
    .substring(0, 500);
};

const sanitizeInput = (obj) => {
  if (!obj) return obj;
  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
};

// ===== RATE LIMITING (FIX #12) =====
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login/registration attempts, please try again later',
  skipSuccessfulRequests: true,
});

// ===== MIDDLEWARE =====
app.use(globalLimiter);
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

// ===== ERROR HANDLING (FIX #4) =====
const handleError = (res, error, status = 500) => {
  console.error('[Database Error]', {
    code: error.code,
    message: error.message,
    detail: error.detail,
    timestamp: new Date().toISOString()
  });

  let message = 'An error occurred';
  let clientStatus = status;

  if (error.code === '23505') {
    message = 'This email is already registered';
    clientStatus = 409;
  } else if (error.code === '23503') {
    message = 'Invalid reference: restaurant or user not found';
    clientStatus = 400;
  } else if (error.code === '23502') {
    message = 'Missing required field';
    clientStatus = 400;
  } else if (error.code === '42P01') {
    message = 'Database table not found';
    clientStatus = 500;
  } else if (error.code === '42703') {
    message = 'Database column not found - migration may be needed';
    clientStatus = 500;
  } else if (error.message?.includes('UNIQUE constraint')) {
    message = 'Duplicate entry';
    clientStatus = 409;
  }

  res.status(clientStatus).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { debug: error.message })
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
app.post('/api/auth/register', authLimiter, async (req, res) => {
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
      message: 'User registered successfully',
      token,
      user: result.rows[0]
    });
  } catch (error) {
    handleError(res, error, 400);
  }
});

app.post('/api/auth/login', authLimiter, async (req, res) => {
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
      'SELECT id, name, description, cuisine_type, rating, delivery_time, address, created_at FROM restaurants WHERE is_active = true ORDER BY rating DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    const countResult = await pool.query('SELECT COUNT(*) FROM restaurants WHERE is_active = true');

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

    const menus = menuResult.rows.map(menu => ({
      ...menu,
      items: menu.items ? (typeof menu.items === 'string' ? JSON.parse(menu.items) : menu.items) : []
    }));

    res.json({
      success: true,
      data: {
        ...restaurantResult.rows[0],
        menus
      }
    });
  } catch (error) {
    handleError(res, error);
  }
});

app.post('/api/restaurants', verifyToken, async (req, res) => {
  const { name, description, cuisine_type, rating, delivery_time, address } = sanitizeInput(req.body);

  if (!name || !description) {
    return res.status(400).json({ success: false, error: 'Name and description required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO restaurants (name, description, cuisine_type, rating, delivery_time, address, is_active, created_at) VALUES ($1, $2, $3, $4, $5, $6, true, NOW()) RETURNING *',
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

// ===== MENU ENDPOINTS (FIX #7) =====
app.post('/api/restaurants/:id/menus', verifyToken, async (req, res) => {
  const { name, items } = req.body;
  const restaurantId = req.params.id;

  if (!name || !Array.isArray(items)) {
    return res.status(400).json({
      success: false,
      error: 'Menu name and items array required'
    });
  }

  try {
    const restaurantCheck = await pool.query(
      'SELECT id FROM restaurants WHERE id = $1',
      [restaurantId]
    );

    if (restaurantCheck.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Restaurant not found' });
    }

    const result = await pool.query(
      'INSERT INTO menus (restaurant_id, name, items, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
      [restaurantId, name, JSON.stringify(items)]
    );

    res.status(201).json({
      success: true,
      data: {
        ...result.rows[0],
        items: items
      }
    });
  } catch (error) {
    handleError(res, error, 400);
  }
});

app.get('/api/restaurants/:id/menus', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM menus WHERE restaurant_id = $1 ORDER BY created_at DESC',
      [req.params.id]
    );

    const menus = result.rows.map(menu => ({
      ...menu,
      items: menu.items ? (typeof menu.items === 'string' ? JSON.parse(menu.items) : menu.items) : []
    }));

    res.json({
      success: true,
      data: menus
    });
  } catch (error) {
    handleError(res, error);
  }
});

app.put('/api/restaurants/:restaurantId/menus/:menuId', verifyToken, async (req, res) => {
  const { name, items } = req.body;
  const { restaurantId, menuId } = req.params;

  try {
    const result = await pool.query(
      'UPDATE menus SET name = COALESCE($1, name), items = COALESCE($2, items), updated_at = NOW() WHERE id = $3 AND restaurant_id = $4 RETURNING *',
      [name || null, items ? JSON.stringify(items) : null, menuId, restaurantId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Menu not found' });
    }

    res.json({
      success: true,
      data: {
        ...result.rows[0],
        items: result.rows[0].items ? (typeof result.rows[0].items === 'string' ? JSON.parse(result.rows[0].items) : result.rows[0].items) : []
      }
    });
  } catch (error) {
    handleError(res, error);
  }
});

app.delete('/api/restaurants/:restaurantId/menus/:menuId', verifyToken, async (req, res) => {
  const { restaurantId, menuId } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM menus WHERE id = $1 AND restaurant_id = $2 RETURNING id',
      [menuId, restaurantId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Menu not found' });
    }

    res.json({
      success: true,
      message: 'Menu deleted successfully'
    });
  } catch (error) {
    handleError(res, error);
  }
});

// ===== ORDER ENDPOINTS =====
app.post('/api/orders', verifyToken, async (req, res) => {
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

app.get('/api/orders', verifyToken, async (req, res) => {
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

app.get('/api/orders/:id', verifyToken, async (req, res) => {
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

// ===== ORDER STATUS UPDATE (FIX #2) =====
app.put('/api/orders/:id/status', verifyToken, async (req, res) => {
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

// ===== USER ENDPOINTS (FIX #1) =====
app.get('/api/users/profile', verifyToken, async (req, res) => {
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

app.put('/api/users/profile', verifyToken, async (req, res) => {
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

// ===== ROOT ENDPOINT =====
app.get('/', (req, res) => res.json({
  success: true,
  message: 'QuickBite Food Delivery API v1.0.0',
  endpoints: {
    health: '/api/health',
    auth: '/api/auth',
    restaurants: '/api/restaurants',
    orders: '/api/orders',
    users: '/api/users'
  }
}));

// ===== SEARCH ENDPOINT (FIX #8) =====
app.post('/api/search', async (req, res) => {
  const { query, cuisineType, minRating, maxDeliveryTime, limit = 10, offset = 0 } = req.body;

  if (!query || query.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Search query required'
    });
  }

  const sanitizedQuery = sanitizeString(query);
  const limitValue = Math.min(parseInt(limit) || 10, 100);
  const offsetValue = parseInt(offset) || 0;

  try {
    let sqlQuery = 'SELECT * FROM restaurants WHERE (name ILIKE $1 OR description ILIKE $1 OR cuisine_type ILIKE $1)';
    const params = [`%${sanitizedQuery}%`];
    let paramIndex = 2;

    if (cuisineType) {
      sqlQuery += ` AND cuisine_type ILIKE $${paramIndex}`;
      params.push(`%${cuisineType}%`);
      paramIndex++;
    }

    if (minRating) {
      sqlQuery += ` AND rating >= $${paramIndex}`;
      params.push(minRating);
      paramIndex++;
    }

    if (maxDeliveryTime) {
      sqlQuery += ` AND delivery_time <= $${paramIndex}`;
      params.push(maxDeliveryTime);
      paramIndex++;
    }

    sqlQuery += ` AND is_active = true ORDER BY rating DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limitValue, offsetValue);

    const result = await pool.query(sqlQuery, params);
    const countResult = await pool.query(
      'SELECT COUNT(*) FROM restaurants WHERE (name ILIKE $1 OR description ILIKE $1 OR cuisine_type ILIKE $1) AND is_active = true',
      [`%${sanitizedQuery}%`]
    );

    res.json({
      success: true,
      results: result.rows,
      pagination: {
        total: parseInt(countResult.rows[0].count),
        limit: limitValue,
        offset: offsetValue
      }
    });
  } catch (error) {
    handleError(res, error);
  }
});

// ===== 404 HANDLER (FIX #13) =====
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path,
    method: req.method,
    ...(process.env.NODE_ENV === 'development' && {
      availableEndpoints: {
        auth: ['POST /api/auth/register', 'POST /api/auth/login'],
        restaurants: ['GET /api/restaurants', 'GET /api/restaurants/:id', 'POST /api/search'],
        orders: ['POST /api/orders', 'GET /api/orders', 'GET /api/orders/:id', 'PUT /api/orders/:id/status'],
        users: ['GET /api/users/profile', 'PUT /api/users/profile'],
        menus: ['GET /api/restaurants/:id/menus', 'POST /api/restaurants/:id/menus']
      }
    })
  });
});

// ===== ERROR HANDLER (FIX #13) =====
app.use((err, req, res, next) => {
  console.error('[Application Error]', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: 'Token expired'
    });
  }

  res.status(err.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message,
    ...(process.env.NODE_ENV === 'development' && { debug: err.stack })
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
