# QuickBite Deployment & Fix Walkthrough

This document outlines the fixes applied to the QuickBite project to resolve deployment, search, and configuration issues.

## 🚀 Applied Fixes

### 1. Database Setup (Issue #3)
- **Migration**: Added `menus` table to `migrations/001_create_tables.sql`.
- **Seeding**: Successfully ran `seed.js` to populate:
    - 6 Restaurants (Pasta Palace, Sushi Spot, etc.)
    - Example Menus
    - Test User credentials
- **Scripts**: Added `npm run migrate` and `npm run seed` to `server/package.json`.

### 2. Backend Search & API (Issue #1, #4)
- **Search Endpoint**: Implemented `/api/search` in `server/src/index.js` to handle queries via database text search.
- **Health Check**: Verified `/api/health` returns 200 OK locally.
- **Git Config**: Fixed `.gitignore` to properly exclude `server/node_modules` from the repository.

### 3. Frontend Logic (Issue #4, #5)
- **Refactoring**: Rewrote `src/app/page.tsx` to call the backend `/api/search` endpoint directly.
- **Configuration**: Created `.env.local` for local development.
- **Dependencies**: Fixed build issues by ensuring all dependencies are installed.

## 🛠️ Required Manual Actions

I have pushed the code fixes to GitHub (`origin main`). To complete the deployment, **you must perform the following actions manually**:

### 1. Render Dashboard (Backend)
Go to your [Render Dashboard](https://dashboard.render.com/) -> QuickBite Backend -> **Environment**.
Add the following Environment Variables:

| Variable | Value |
| :--- | :--- |
| `DATABASE_URL` | *Your Neon Connection String* |
| `JWT_SECRET` | `ff5ec74f4fe666ba77dff4e856d38daecf325d7557efd69222352b9ec36eb85a` |
| `NODE_ENV` | `production` |
| `PORT` | `3000` |
| `FRONTEND_URL` | `https://quick-bite-mu.vercel.app` |

**After adding variables, navigate to "Manual Deploy" -> "Clear build cache and deploy".**

### 2. Vercel Dashboard (Frontend)
Go to your [Vercel Dashboard](https://vercel.com/dashboard) -> QuickBite Project -> Settings -> **Environment Variables**.
Add the following:

| Variable | Value |
| :--- | :--- |
| `GOOGLE_GENAI_API_KEY` | *Your Google API Key* (needed if you revert to AI later) |
| `NEXT_PUBLIC_API_URL` | `https://quickbite-backend-zsdz.onrender.com/api` |

**After adding variables, go to "Deployments" and Redeploy.**

## ❓ Troubleshooting

If you see "Not Found" or errors:

1.  **Check Render Logs**: Go to Dashboard -> Logs. Look for "Error" or "Crash".
    *   *Common Issue*: Database connection failing. Check `DATABASE_URL`.
2.  **Check Build Logs**: Ensure the build finished successfully.
3.  **Wait**: Deployments can take 3-5 minutes to go live.
