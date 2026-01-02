import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

pool.on('connect', () => console.log('✅ Connected to PostgreSQL'));
pool.on('error', (err) => console.error('❌ DB Error:', err));

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

app.get('/api/restaurants', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM restaurants ORDER BY rating DESC LIMIT 20');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/restaurants/:id', async (req, res) => {
  try {
    const restaurant = await pool.query('SELECT * FROM restaurants WHERE id = $1', [req.params.id]);
    if (restaurant.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    
    const menu = await pool.query('SELECT * FROM menu_items WHERE restaurant_id = $1', [req.params.id]);
    res.json({ ...restaurant.rows[0], menu: menu.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const hash = require('bcrypt').hashSync(password, 10);
    await pool.query('INSERT INTO users (email, password, name) VALUES ($1, $2, $3)', [email, hash, name]);
    res.status(201).json({ message: 'Registered' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) return res.status(401).json({ error: 'Invalid' });
    
    const bcrypt = require('bcrypt');
    const valid = bcrypt.compareSync(password, user.rows[0].password);
    if (!valid) return res.status(401).json({ error: 'Invalid' });
    
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ userId: user.rows[0].id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.json({ token, user: { id: user.rows[0].id, email: user.rows[0].email, name: user.rows[0].name } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/orders', async (req, res) => {
  const { userId, restaurantId, items, totalAmount } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO orders (user_id, restaurant_id, items, total_amount, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, restaurantId, JSON.stringify(items), totalAmount, 'pending']
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/orders/user/:userId', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC', [req.params.userId]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, email, name FROM users WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.use((req, res) => res.status(404).json({ error: 'Not found' }));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Backend running on port ${PORT}`);
  console.log(`📍 API: http://localhost:${PORT}/api`);
  console.log(`❤️  Health: http://localhost:${PORT}/api/health\n`);
});

export default app;
