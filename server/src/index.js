import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/auth.routes.js';
import restaurantRoutes from './routes/restaurants.routes.js';
import orderRoutes from './routes/orders.routes.js';
import userRoutes from './routes/users.routes.js';
import cartRoutes from './routes/cart.routes.js';
import pool from './db.js';
import { sanitizeString } from './validation.js';
import { handleError } from './middleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ===== ENVIRONMENT VALIDATION =====
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

// ===== GLOBAL MIDDLEWARE =====
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(globalLimiter);
app.use(express.json({ limit: '10mb' }));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// ===== HEALTH CHECK =====
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ===== ROUTE MOUNTING =====
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);

// ===== SEARCH ENDPOINT =====
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

// ===== ROOT ENDPOINT =====
app.get('/', (req, res) => res.json({
  success: true,
  message: 'QuickBite Food Delivery API v1.0.0',
  endpoints: {
    health: '/api/health',
    auth: '/api/auth',
    restaurants: '/api/restaurants',
    orders: '/api/orders',
    users: '/api/users',
    cart: '/api/cart',
    search: 'POST /api/search'
  }
}));

// ===== 404 HANDLER =====
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path,
    method: req.method,
    ...(process.env.NODE_ENV === 'development' && {
      availableEndpoints: {
        auth: ['POST /api/auth/register', 'POST /api/auth/login'],
        restaurants: ['GET /api/restaurants', 'GET /api/restaurants/:id', 'POST /api/restaurants'],
        menus: ['GET /api/restaurants/:id/menus', 'POST /api/restaurants/:id/menus', 'PUT /api/restaurants/:restaurantId/menus/:menuId', 'DELETE /api/restaurants/:restaurantId/menus/:menuId'],
        orders: ['POST /api/orders', 'GET /api/orders', 'GET /api/orders/:id', 'PUT /api/orders/:id/status'],
        users: ['GET /api/users/profile', 'PUT /api/users/profile'],
        cart: ['GET /api/cart', 'PUT /api/cart', 'DELETE /api/cart'],
        search: ['POST /api/search']
      }
    })
  });
});

// ===== GLOBAL ERROR HANDLER =====
app.use((err, req, res, next) => {
  console.error('[Application Error]', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, error: 'Invalid token' });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, error: 'Token expired' });
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
const server = app.listen(PORT, () => {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`Backend running on port ${PORT}`);
  console.log(`API: http://localhost:${PORT}/api`);
  console.log(`Health: http://localhost:${PORT}/api/health`);
  console.log(`${'='.repeat(50)}\n`);
});

// ===== GRACEFUL SHUTDOWN =====
const shutdown = async (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);

  server.close(async () => {
    console.log('HTTP server closed.');
    try {
      await pool.end();
      console.log('Database pool closed.');
    } catch (err) {
      console.error('Error closing database pool:', err.message);
    }
    process.exit(0);
  });

  // Force shutdown after 10 seconds if graceful shutdown fails
  setTimeout(() => {
    console.error('Forced shutdown after timeout.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

export default app;
