# CLAUDE.md

This file provides guidance for Claude Code when working in this repository.

## Project Overview

QuickBite is a full-stack food delivery platform with AI-powered restaurant recommendations. Next.js 15 frontend with an Express.js backend, PostgreSQL database, and Google Genkit/Gemini integration for AI features.

## Commands

### Frontend (root directory)

```bash
npm run dev              # Dev server with Turbopack on port 9002
npm run build            # Production build
npm run lint             # ESLint
npm run typecheck        # TypeScript type checking (tsc --noEmit)
npm test                 # Vitest in watch mode
npm test -- --run        # Vitest single run (no watch)
npm test -- --run src/components/__tests__/SearchBar.test.tsx  # Run a single test file
npm run test:coverage    # Coverage report
npm run ci               # Full CI: lint + typecheck + test + build
```

### Backend (server/ directory)

```bash
cd server
npm run dev              # Dev server with nodemon
npm start                # Production server
npm run migrate          # Run database migrations
npm run seed             # Seed sample data
```

## Architecture

### Two separate npm projects

- **Root (`/`)** — Next.js 15 frontend (TypeScript, App Router)
- **`/server`** — Express.js backend (plain JS, ES modules)

Each has its own `package.json` and `node_modules`. Install dependencies separately in each.

### Frontend structure (`src/`)

- **`app/`** — Next.js App Router pages (file-based routing)
- **`components/`** — React components; `components/ui/` contains shadcn/ui primitives
- **`hooks/`** — `useCart` (cart state + localStorage), `use-toast`, `use-mobile`
- **`context/AuthContext.tsx`** — Auth state management (login/register/logout with JWT)
- **`actions/recommend.ts`** — Server action calling Genkit AI flow
- **`ai/`** — Genkit config and AI flows (Gemini 2.0 Flash for restaurant recommendations)
- **`config/api.ts`** — API client with auth header injection
- **`lib/data.ts`** — Static restaurant/menu data (6 restaurants hardcoded)

State management uses React Context for both cart (`useCart` hook with `CartProvider`) and auth (`AuthProvider`). Cart persists to localStorage.

### Backend structure (`server/src/`)

- **`index.js`** — Express app setup, route mounting, CORS, rate limiting
- **`db.js`** — PostgreSQL connection pool (pg)
- **`middleware.js`** — JWT auth middleware, error handling
- **`validation.js`** — Input validation and XSS sanitization
- **`routes/`** — RESTful route handlers: auth, restaurants, orders, users, cart

### Database

PostgreSQL with migrations in `server/migrations/`. Tables: `users`, `restaurants`, `menus`, `orders`, `carts`. Uses JSONB for menu items and cart items.

### API endpoints

All prefixed with `/api`: `/api/auth/*`, `/api/restaurants/*`, `/api/orders/*`, `/api/users/*`, `/api/cart/*`, `/api/health`.

### Key patterns

- Path alias `@/*` maps to `./src/*` in both TypeScript and Vitest configs
- UI built with shadcn/ui (Radix primitives + Tailwind CSS + class-variance-authority)
- Dark mode via Tailwind `class` strategy with CSS variable theming
- Authentication uses JWT tokens (7-day expiry), bcrypt for password hashing
- Backend uses ES modules (`"type": "module"` in server/package.json)

## Environment Variables

- **Frontend**: `GOOGLE_GENAI_API_KEY`, `NEXT_PUBLIC_API_URL` (see `.env.example`)
- **Backend**: `DATABASE_URL`, `JWT_SECRET`, `PORT`, `FRONTEND_URL`, `NODE_ENV` (see `server/.env.example`)

## Testing

Tests use Vitest + React Testing Library with jsdom environment. Test files live in `__tests__/` directories alongside source (e.g., `src/components/__tests__/`, `src/hooks/__tests__/`). The backend has no automated tests.

## CI/CD

GitHub Actions (`.github/workflows/ci.yml`) runs lint, typecheck, test, and build on pushes/PRs to main. Preview deployments to Vercel via `preview.yml`. The CI build requires a `GOOGLE_GENAI_API_KEY` env var (can be a dummy value for build-only).

## Deployment

Frontend deploys to Vercel, backend to Render/Railway, database on Neon (managed PostgreSQL).
