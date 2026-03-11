import express from 'express';
import pool from '../db.js';
import { verifyToken, handleError } from '../middleware.js';
import { sanitizeInput, sanitizeString } from '../validation.js';

const router = express.Router();

// GET /api/restaurants
router.get('/', async (req, res) => {
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

// GET /api/restaurants/:id
router.get('/:id', async (req, res) => {
  if (isNaN(parseInt(req.params.id))) {
    return res.status(400).json({ success: false, error: 'Invalid restaurant ID' });
  }

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

// POST /api/restaurants
router.post('/', verifyToken, async (req, res) => {
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

// POST /api/restaurants/:id/menus
router.post('/:id/menus', verifyToken, async (req, res) => {
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

// GET /api/restaurants/:id/menus
router.get('/:id/menus', async (req, res) => {
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

// PUT /api/restaurants/:restaurantId/menus/:menuId
router.put('/:restaurantId/menus/:menuId', verifyToken, async (req, res) => {
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

// DELETE /api/restaurants/:restaurantId/menus/:menuId
router.delete('/:restaurantId/menus/:menuId', verifyToken, async (req, res) => {
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

export default router;
