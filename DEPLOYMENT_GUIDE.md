# QuickBite Deployment Guide

## Complete Deployment Instructions for Production

**Last Updated**: January 6, 2026  
**Status**: Production Ready ✅

---

## Table of Contents

1. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
2. [Backend Deployment (Render)](#backend-deployment-render)
3. [Environment Variables](#environment-variables)
4. [Database Connection](#database-connection)
5. [CI/CD Pipeline](#cicd-pipeline)
6. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Frontend Deployment (Vercel)

### Prerequisites

- GitHub account with QuickBite repository access
- Vercel account (free tier available)
- Next.js 15 project ready

### Step-by-Step Deployment

#### 1. Connect Repository to Vercel

```bash
# Via GitHub:
# 1. Go to https://vercel.com/import
# 2. Select "Import from Git Repository"
# 3. Connect GitHub account
# 4. Select unnita1235/QuickBite repository
# 5. Vercel auto-detects Next.js
```

#### 2. Configure Project Settings

```
Framework: Next.js
Build Command: next build
Start Command: next start
Output Directory: .next
Install Command: npm install
```

#### 3. Environment Variables

In Vercel Dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_API_URL=https://quickbite-backend-zsdz.onrender.com
GOOGLE_GENAI_API_KEY=your_google_ai_api_key_here
NEXT_PUBLIC_APP_URL=https://quick-bite-mu.vercel.app
```

#### 4. Deploy

```bash
# Automatic deployment on git push to main
# Manual deploy via Vercel Dashboard
# Deploy button available in GitHub repo

# Current Status:
# ✅ Frontend: https://quick-bite-mu.vercel.app
# ✅ Build Time: 2m 33s
# ✅ Status: Ready (Production)
```

### Vercel Dashboard Access

- Project: QuickBite
- Domain: quick-bite-mu.vercel.app
- Environment: Production
- Deployment History: GitHub
- Monitoring: Built-in Analytics

---

## Backend Deployment (Render)

### Prerequisites

- Render account (https://render.com)
- PostgreSQL database (Neon.tech)
- Environment variables configured

### Step-by-Step Backend Deployment

#### 1. Prepare Backend Code

```bash
# Backend folder structure
server/
├── src/
│   ├── index.ts           # Entry point
│   ├── middleware/        # JWT, CORS
│   ├── routes/            # API endpoints
│   ├── models/            # Database models
│   └── config/            # Configuration
├── package.json           # Dependencies
└── .env                   # Environment variables
```

#### 2. Create Render Web Service

```bash
# 1. Go to https://render.com/dashboard
# 2. Click "New" → "Web Service"
# 3. Connect GitHub repository
# 4. Select QuickBite repository
# 5. Configure:

Name: quickbite-backend
Environment: Node
Build Command: npm install
Start Command: npm start
Region: Choose closest to users
Instance Type: Free ($0/month) or Paid
```

#### 3. Configure Render Environment

In Render Dashboard → Environment:

```
DATABASE_URL=postgresql://user:password@neon.tech:5432/quickbite
JWT_SECRET=your-very-secret-jwt-key-32-chars-minimum
FRONTEND_URL=https://quick-bite-mu.vercel.app
NODE_ENV=production
PORT=5000
GOOGLE_GENAI_API_KEY=your_key_here
```

#### 4. Deploy Backend

```bash
# Automatic deployment on git push
# Manual deploy via Render Dashboard

# Current Status:
# ✅ Backend: https://quickbite-backend-zsdz.onrender.com
# ✅ API Health: GET /api/health → 200 OK
# ✅ Response Time: <500ms
```

### Render Service Details

- Service Name: quickbite-backend
- URL: https://quickbite-backend-zsdz.onrender.com
- Region: Oregon (US)
- Status: Active/Running
- Auto-deploy: GitHub main branch

---

## Environment Variables

### Frontend Environment Variables

**File**: `.env.local` (development) or Vercel Dashboard (production)

```bash
# Google AI API
GOOGLE_GENAI_API_KEY=AIzaSy...

# Backend API Connection
NEXT_PUBLIC_API_URL=https://quickbite-backend-zsdz.onrender.com

# Frontend URL
NEXT_PUBLIC_APP_URL=https://quick-bite-mu.vercel.app

# Development only
NEXT_PUBLIC_DEVELOPMENT_MODE=false
```

### Backend Environment Variables

**File**: `.env` (development) or Render Dashboard (production)

```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/quickbite

# JWT
JWT_SECRET=your-secret-key-minimum-32-characters-long
JWT_EXPIRATION=7d

# Frontend
FRONTEND_URL=https://quick-bite-mu.vercel.app

# CORS
CORS_ORIGIN=https://quick-bite-mu.vercel.app,http://localhost:3000

# Environment
NODE_ENV=production
PORT=5000

# Logging
LOG_LEVEL=info

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100

# AI
GOOGLE_GENAI_API_KEY=AIzaSy...
```

### How to Get API Keys

**Google Gemini API Key:**
```
1. Go to https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key
4. Add to environment variables
5. Keep it secret!
```

---

## Database Connection

### Neon PostgreSQL Setup

#### 1. Create Neon Project

```bash
# 1. Go to https://console.neon.tech
# 2. Sign up or login
# 3. Click "Create Project"
# 4. Name: quickbite
# 5. Database: quickbite
# 6. Region: US East
# 7. Create
```

#### 2. Get Connection String

```bash
# In Neon Dashboard:
# Connection String → Connection pooling: checked
# Copy: postgresql://user:password@host/database?sslmode=require

# Use in .env
DATABASE_URL=postgresql://...
```

#### 3. Initialize Database Schema

```bash
# Schema is auto-created by backend on first connection
# Tables created:
# - users
# - restaurants
# - menu_items
# - orders
# - order_items
```

#### 4. Backup Strategy

```
✅ Neon provides automatic daily backups
✅ Point-in-time recovery available
✅ Backup retention: 7 days (free tier)
✅ Access via Neon Dashboard
```

---

## CI/CD Pipeline

### GitHub Actions Workflow

**File**: `.github/workflows/deploy.yml`

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install Dependencies
        run: npm install
      
      - name: Lint Code
        run: npm run lint --  --fix
      
      - name: Type Check
        run: npm run typecheck
      
      - name: Build
        run: npm run build
      
      - name: Tests
        run: npm test -- --run

  # Frontend auto-deploys to Vercel
  # Backend auto-deploys to Render
```

### Deployment Flow

```
┌─────────────────┐
│ Git Push (Main) │
└────────┬────────┘
         │
         ▼
   ┌──────────────┐
   │ GitHub       │
   │ Actions CI   │
   └──────┬───────┘
          │
    ┌─────┴─────┐
    ▼           ▼
┌────────┐  ┌────────┐
│ Vercel │  │ Render │
│ Deploy │  │ Deploy │
└────────┘  └────────┘
    │           │
    ▼           ▼
 Frontend   Backend
 LIVE       LIVE
```

### Current CI/CD Status

- ✅ GitHub Actions: Active
- ✅ Vercel Auto-Deploy: Enabled
- ✅ Render Auto-Deploy: Enabled
- ✅ Build Checks: Passing
- ✅ Test Suite: Ready (needs implementation)

---

## Monitoring & Maintenance

### Health Checks

```bash
# Frontend Health
curl https://quick-bite-mu.vercel.app
Expected: 200 OK with HTML

# Backend Health
curl https://quickbite-backend-zsdz.onrender.com/api/health
Expected: 200 OK with {"status":"ok","timestamp":"..."}
```

### Monitoring Dashboard

**Vercel Dashboard:**
- Performance metrics
- Deploy history
- Analytics
- Error tracking

**Render Dashboard:**
- Service logs
- Uptime status
- Resource usage
- Deploy history

**Neon Dashboard:**
- Database stats
- Connection count
- Query performance
- Backup status

### Maintenance Schedule

```
Daily:
  - Check health endpoints
  - Review error logs
  - Monitor uptime

Weekly:
  - Review performance metrics
  - Update dependencies (if safe)
  - Backup verification

Monthly:
  - Security audit
  - Performance optimization
  - Cost analysis
```

---

## Troubleshooting

### Frontend Issues

**Build fails:**
```
1. Check Node version compatibility
2. Clear cache: npm cache clean --force
3. Reinstall: rm -rf node_modules && npm install
4. Check environment variables in Vercel
```

**API not responding:**
```
1. Check NEXT_PUBLIC_API_URL in .env
2. Verify backend is running: /api/health
3. Check CORS configuration
4. Review browser console for errors
```

### Backend Issues

**Database connection failed:**
```
1. Verify DATABASE_URL is correct
2. Check network connectivity
3. Ensure Neon project is active
4. Check connection limit not exceeded
```

**Deployment fails:**
```
1. Check build logs in Render
2. Verify all environment variables
3. Check package.json start script
4. Ensure Node modules install successfully
```

---

## Production Checklist

- ✅ Frontend deployed to Vercel
- ✅ Backend deployed to Render
- ✅ Database operational on Neon
- ✅ All environment variables configured
- ✅ CI/CD pipeline active
- ✅ Health checks passing
- ✅ HTTPS/TLS enabled
- ✅ CORS configured
- ✅ Rate limiting enabled
- ✅ Error handling in place
- ✅ Database backups enabled
- ✅ Monitoring active

---

## Support & Documentation

- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **Neon Docs**: https://neon.tech/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Express Docs**: https://expressjs.com

---

## Summary

**Current Production Status:**
- Frontend: ✅ LIVE on Vercel
- Backend: ✅ LIVE on Render  
- Database: ✅ LIVE on Neon
- CI/CD: ✅ Active & Automated
- Uptime: ✅ 99.9% Target

**Ready for real users and production traffic!**
