# Backend Deployment Guide - Render.com

**Complete step-by-step guide to deploy QuickBite backend on Render.com**

## STATUS

✅ Frontend: Deployed on Vercel (https://quick-bite-mu.vercel.app)
✅ Backend Code: Ready in `/server` folder  
🚀 NEXT: Deploy on Render.com

## Quick Deployment (5-10 Minutes)

### 1. Prepare Your GitHub

The backend code is already in the `server/` folder:
- `server/package.json` - Dependencies
- `server/.env.example` - Environment template
- `server/README.md` - Full setup guide with all source code

### 2. Create Render Account

1. Go to https://dashboard.render.com
2. Sign up with GitHub (recommended for auto-deployment)
3. Click "New" → "Web Service"

### 3. Create PostgreSQL Database on Render

1. In Render Dashboard: Click "New" → "PostgreSQL"
2. Configure:
   - **Name**: `quickbite-db`
   - **Database**: `quickbite`
   - **Region**: Choose closest to you
   - **PostgreSQL Version**: Latest stable
3. Create and wait for setup (2-5 minutes)
4. **Copy** the "Internal Database URL" (looks like: `postgresql://user:pass@host:5432/db`)
5. Also copy the external connection URL

### 4. Setup SQL Tables in PostgreSQL

1. Go back to your PostgreSQL instance
2. Click "Connect" → "PSQL"
3. Paste these SQL commands:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE restaurants (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  rating FLOAT DEFAULT 4.5,
  delivery_time INT DEFAULT 30,
  cuisine_type VARCHAR(100),
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE menu_items (
  id SERIAL PRIMARY KEY,
  restaurant_id INT NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  restaurant_id INT NOT NULL REFERENCES restaurants(id),
  items JSONB NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  delivery_address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_menu_restaurant ON menu_items(restaurant_id);
```

4. Click "Execute" and wait for confirmation

### 5. Seed Sample Data (Optional but Recommended)

Paste this to add sample restaurants:

```sql
INSERT INTO restaurants (name, description, rating, delivery_time, cuisine_type, image_url) VALUES
('Bella Italia', 'Authentic Italian cuisine', 4.8, 35, 'Italian', 'https://via.placeholder.com/300x200?text=Bella+Italia'),
('Spice Route', 'Aromatic Indian dishes', 4.6, 40, 'Indian', 'https://via.placeholder.com/300x200?text=Spice+Route'),
('Dragon Wok', 'Traditional Chinese food', 4.7, 30, 'Chinese', 'https://via.placeholder.com/300x200?text=Dragon+Wok'),
('Fresh Bites', 'Healthy and organic options', 4.9, 25, 'Vegan', 'https://via.placeholder.com/300x200?text=Fresh+Bites'),
('Burger House', 'Gourmet American burgers', 4.5, 20, 'American', 'https://via.placeholder.com/300x200?text=Burger+House'),
('Sushi Master', 'Premium Japanese sushi', 4.9, 35, 'Japanese', 'https://via.placeholder.com/300x200?text=Sushi+Master');

INSERT INTO menu_items (restaurant_id, name, description, price) VALUES
(1, 'Margherita Pizza', 'Classic tomato and mozzarella', 12.99),
(1, 'Pasta Carbonara', 'Creamy Roman pasta', 14.99),
(2, 'Butter Chicken', 'Tender chicken in cream sauce', 13.99),
(2, 'Biryani', 'Fragrant rice with meat', 11.99),
(3, 'Kung Pao Chicken', 'Spicy chicken with nuts', 10.99),
(3, 'Fried Rice', 'Wok-fried rice with vegetables', 8.99),
(4, 'Buddha Bowl', 'Nutritious mixed greens and tofu', 9.99),
(4, 'Green Smoothie', 'Fresh fruit and vegetable blend', 5.99),
(5, 'Classic Burger', 'Beef patty with cheese', 10.99),
(5, 'Fries', 'Crispy golden fries', 3.99),
(6, 'California Roll', 'Crab, avocado, cucumber', 8.99),
(6, 'Spicy Tuna Roll', 'Tuna with spicy mayo', 9.99);
```

### 6. Create Web Service on Render

1. Go to Render Dashboard: Click "New" → "Web Service"
2. **Select Repository**:
   - Choose: `unnita1235/QuickBite`
   - Branch: `main`
3. **Configure**:
   - **Name**: `quickbite-backend`
   - **Root Directory**: `server`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node src/index.js`
4. **Environment Variables** (CRITICAL):
   ```
   NODE_ENV = production
   PORT = 5000
   DATABASE_URL = [paste the PostgreSQL connection URL from step 3]
   JWT_SECRET = your-super-secret-key-change-this-12345
   FRONTEND_URL = https://quick-bite-mu.vercel.app
   ```
5. Click "Create Web Service" and wait for deployment (3-5 minutes)

### 7. Get Your Backend URL

1. After deployment succeeds, you'll see your service URL like:
   `https://quickbite-backend.onrender.com`
2. Test it by visiting: `https://quickbite-backend.onrender.com/api/health`
3. You should see: `{"status":"Server is running","timestamp":"..."}`

### 8. Update Frontend with Backend URL

1. Go to your frontend code (Vercel)
2. Update `.env.local` OR `.env.production.local`:
   ```
   NEXT_PUBLIC_API_URL=https://quickbite-backend.onrender.com/api
   ```
3. Redeploy frontend on Vercel

### 9. Test the Integration

1. Visit https://quick-bite-mu.vercel.app
2. Go to "Restaurants" section
3. Should load restaurants from your backend database
4. Try "Search" (uses AI and backend)
5. Try "Add to Cart" → "Checkout" → Create order

## API Endpoints Ready

```
GET  /api/health                    - Health check
GET  /api/restaurants               - All restaurants
GET  /api/restaurants/:id           - Restaurant with menu
POST /api/auth/register             - Register user
POST /api/auth/login                - Login user
POST /api/orders                    - Create order
GET  /api/orders/user/:userId       - User's orders
GET  /api/users/:id                 - User profile
```

## Troubleshooting

### "Cannot find module"
- Solution: Make sure `Root Directory` is set to `server` in Render

### Database connection errors
- Verify DATABASE_URL is correct
- Check PostgreSQL instance is running
- Ensure IP whitelist allows Render (should be automatic)

### CORS errors on frontend
- Update FRONTEND_URL in backend environment variables
- Redeploy backend after changing

### 502 Bad Gateway
- Check logs: Render Dashboard → Logs
- Common cause: Missing environment variables

## What's Deployed

✅ Express.js REST API with 7 endpoints
✅ PostgreSQL database with 4 tables
✅ JWT authentication (register/login)
✅ Restaurant search and menu retrieval
✅ Order management system
✅ CORS configured for frontend
✅ Production-ready error handling

## Next Steps After Deployment

1. Test all API endpoints
2. Add real restaurants to database
3. Implement payment processing (Stripe)
4. Add order status tracking
5. Setup email notifications
6. Monitor performance on Render

## Full Backend Documentation

See `server/README.md` for:
- Complete source code
- Local development setup
- API endpoint details
- Database schema

## Support

If deployment fails:
1. Check Render deployment logs
2. Verify all environment variables are set
3. Confirm PostgreSQL tables were created
4. Test backend URL directly in browser

---

**Status**: Backend ready for Render deployment ✅
