# QuickBite Implementation Guide

## Phase 1: Backend Setup (Completed ✅)

### 1.1 JWT Authentication Middleware
**Status:** ✅ COMPLETED
- File: `/server/middleware/auth.ts`
- Implements production-ready JWT validation
- Secure token extraction from Authorization header
- Proper error handling with non-revealing error messages

### 1.2 Database Migrations
**Status:** ✅ COMPLETED
- File: `/server/migrations/001_create_tables.sql`
- Creates users, restaurants, and orders tables
- Includes database indexes for performance
- Seeds 6 sample restaurants and test user

## Phase 2: Environment Configuration

### 2.1 Backend Environment Variables
Set the following on Render dashboard or `.env` file:

```bash
# Database Connection (Neon PostgreSQL)
DATABASE_URL=postgresql://user:password@host:5432/quickbite_db

# JWT Secret (use strong random string)
JWT_SECRET=your_super_secure_random_string_here_min_32_chars

# Google Gemini API
GOOGLE_GENAI_API_KEY=your_google_gemini_api_key

# Application Environment
NODE_ENV=production
PORT=5000

# CORS Configuration
CORS_ORIGIN=https://quick-bite-mu.vercel.app
```

### 2.2 Frontend Environment Variables
Set in Vercel project settings:

```bash
NEXT_PUBLIC_API_URL=https://quickbite-backend-zsdr.onrender.com/api
NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY=your_google_gemini_api_key
```

## Phase 3: Remaining Implementation Tasks

### 3.1 Backend API Routes (PRIORITY: HIGH)

#### Auth Routes `/api/auth`
- `POST /register` - Register new user with email/password
- `POST /login` - Login and receive JWT token
- `GET /me` - Get current authenticated user
- `POST /refresh` - Refresh JWT token

#### Restaurant Routes `/api/restaurants`
- `GET /` - List all active restaurants with pagination
- `GET /:id` - Get single restaurant details
- `GET /search?q=query` - Search restaurants by name/cuisine
- `POST /` - Admin: Create new restaurant
- `PUT /:id` - Admin: Update restaurant details

#### Order Routes `/api/orders`
- `POST /` - Create new order (requires auth)
- `GET /` - Get user's orders (requires auth)
- `GET /:id` - Get order details (requires auth)
- `PUT /:id/status` - Update order status (requires auth)
- `DELETE /:id` - Cancel order (requires auth)

### 3.2 Frontend API Integration (PRIORITY: HIGH)

#### Create API Client (`src/lib/api-client.ts`)
```typescript
export async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('authToken');
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
    {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
    }
  );
  
  if (!response.ok) throw new Error(`API Error: ${response.status}`);
  return response.json();
}
```

#### Auth Service (`src/lib/auth.ts`)
```typescript
export async function register(email: string, password: string) {
  const data = await apiCall('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  localStorage.setItem('authToken', data.token);
  return data;
}

export async function login(email: string, password: string) {
  const data = await apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  localStorage.setItem('authToken', data.token);
  return data;
}
```

### 3.3 Testing

#### Local Testing Checklist
- [ ] Start backend: `npm run dev` in `/server`
- [ ] Run migrations: `psql $DATABASE_URL < migrations/001_create_tables.sql`
- [ ] Test auth endpoints with curl or Postman
- [ ] Verify JWT token generation and validation
- [ ] Test restaurant listing and search
- [ ] Test order creation with authenticated user

#### Production Verification
- [ ] Backend API responds to: `curl https://quickbite-backend-zsdr.onrender.com/api/health`
- [ ] Frontend loads: `https://quick-bite-mu.vercel.app`
- [ ] Frontend can fetch restaurants from API
- [ ] User registration/login workflow functions
- [ ] Orders can be created and retrieved

## Phase 4: Deployment

### 4.1 Backend Deployment (Render)
1. Push code to main branch
2. Set environment variables in Render dashboard
3. Run migration: `psql $DATABASE_URL < server/migrations/001_create_tables.sql`
4. Verify health check endpoint

### 4.2 Frontend Deployment (Vercel)
1. Push code to main branch
2. Set environment variables in Vercel project
3. Verify build succeeds
4. Test live application

## Quick Reference: API Endpoints

### Authentication
```bash
# Register
POST /api/auth/register
{ "email": "user@example.com", "password": "secure123" }

# Login
POST /api/auth/login
{ "email": "user@example.com", "password": "secure123" }
```

### Restaurants
```bash
# List restaurants
GET /api/restaurants?page=1&limit=10

# Get restaurant
GET /api/restaurants/:id

# Search restaurants
GET /api/restaurants/search?q=Italian
```

### Orders
```bash
# Create order (requires token)
POST /api/orders
{ "restaurantId": 1, "items": [...], "total": 45.99 }

# Get orders (requires token)
GET /api/orders
```

## Support
For issues, check:
- Backend logs: Render dashboard
- Frontend logs: Browser console
- Database: Neon dashboard
