# QuickBite Complete Fix Guide

## CRITICAL AUDIT FINDINGS & FIXES

This guide addresses all identified issues preventing the app from being production-ready.

---

## 🔴 CRITICAL ISSUES (MUST FIX FIRST)

### 1. MISSING CORE FUNCTIONALITY

**Problem:** App is 30% complete, not 70%
- ❌ No order creation system
- ❌ Shopping cart not persisted to backend
- ❌ No payment integration  
- ❌ No user profiles/order history

**Solution:**
```javascript
// Create src/routes/orders.js
const express = require('express');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// POST /api/orders - Create order
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { restaurantId, items, totalAmount, deliveryAddress } = req.body;
    
    const result = await pool.query(
      `INSERT INTO orders (user_id, restaurant_id, items_json, total_amount, delivery_address, status)
       VALUES ($1, $2, $3, $4, $5, 'pending')
       RETURNING *`,
      [req.userId, restaurantId, JSON.stringify(items), totalAmount, deliveryAddress]
    );
    
    res.status(201).json({
      success: true,
      order: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/orders - List user orders
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
      [req.userId]
    );
    res.json({ success: true, orders: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
```

### 2. BACKEND TYPE SAFETY

**Problem:** Mixed JavaScript/TypeScript - unsafe and inconsistent

**Solution:**
1. Convert backend to TypeScript:
```bash
npm install -D typescript @types/express @types/node tsx ts-node
```

2. Create tsconfig.json in server folder
3. Rename .js files to .ts
4. Add proper type definitions

### 3. INPUT VALIDATION MISSING

**Problem:** express-validator installed but not used

**Solution:** Already implemented in auth.js - apply to all routes:
```javascript
const { body, param, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};
```

### 4. DATABASE SCHEMA NOT APPLIED

**Problem:** Schema exists in migrations but not in actual database

**Solution:**
```bash
# Run this on PostgreSQL/Neon:
psql $DATABASE_URL < server/migrations/001_create_tables.sql
```

### 5. ERROR HANDLING MIDDLEWARE MISSING

**Problem:** No global error handler

**Solution:** Create src/middleware/errorHandler.js
```javascript
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  const statusCode = err.statusCode || 500;
  
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal server error',
    code: err.code || 'INTERNAL_ERROR',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
```

---

## 🟡 BACKEND INFRASTRUCTURE FIXES

### 1. Add Health Check Endpoint

```javascript
// In main app file
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});
```

### 2. Add CORS Configuration

```javascript
const cors = require('cors');
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'https://quick-bite-mu.vercel.app',
  credentials: true
}));
```

### 3. Add Security Headers

```bash
npm install helmet
```

```javascript
const helmet = require('helmet');
app.use(helmet());
```

### 4. Add Rate Limiting

```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use('/api/', limiter);
```

---

## 🔵 FRONTEND FIXES

### 1. Create Auth Context

```typescript
// src/context/AuthContext.tsx
import { createContext, useContext, useState } from 'react';

type AuthContextType = {
  user: any | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (!res.ok) throw new Error('Login failed');
      
      const data = await res.json();
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('authToken', data.token);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
};
```

### 2. Add Error Boundary

```typescript
// src/components/ErrorBoundary.tsx
import { ReactNode } from 'react';

type Props = { children: ReactNode };
type State = { hasError: boolean; error: Error | null };

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 text-red-800 rounded">
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message}</p>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### 3. Protected Routes

```typescript
// src/components/ProtectedRoute.tsx
import { ReactNode } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) {
    router.push('/login');
    return null;
  }

  return <>{children}</>;
}
```

---

## 📋 DEPLOYMENT CHECKLIST

### Before Going to Production:

- [ ] Database migrations applied (psql command above)
- [ ] All environment variables set on Render & Vercel
- [ ] Health check endpoint responding
- [ ] Auth endpoints tested with Postman
- [ ] Orders can be created and retrieved
- [ ] Frontend can login and access protected pages
- [ ] Error boundaries working
- [ ] No console errors in browser
- [ ] HTTPS enforced everywhere
- [ ] Rate limiting active
- [ ] Security headers present (helmet)

### Test Endpoints:

```bash
# Health check
curl https://quickbite-backend-zsdr.onrender.com/api/health

# Register
curl -X POST https://quickbite-backend-zsdr.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123","name":"Test User"}'

# Login  
curl -X POST https://quickbite-backend-zsdr.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'
```

---

## 🎯 NEXT STEPS (PRIORITY ORDER)

1. Create orders.js route (order creation system)
2. Create errorHandler.js middleware
3. Apply database migrations
4. Add health check endpoint
5. Create AuthContext for frontend
6. Create ProtectedRoute component
7. Create ErrorBoundary component
8. Set environment variables
9. Test all endpoints
10. Deploy and verify

Following this guide will transform the app from incomplete to production-ready.
