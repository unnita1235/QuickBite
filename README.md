# QuickBite - Food Delivery Platform

A full-stack food delivery web app: browse restaurants, view menus, add items to cart, register or log in, and place orders. Built with Next.js, Express, and PostgreSQL (Neon).

**Live Demo:** [https://quick-bite-mu.vercel.app/](https://quick-bite-mu.vercel.app/)

## Overview

QuickBite is a food delivery platform with a Next.js frontend and an Express backend. Restaurants and menus are stored in PostgreSQL (Neon). The app supports search via the backend API, cart management (in-memory with optional backend sync), user registration and login (JWT), and order placement with delivery address and notes.

## Key Features

- **Restaurant Browsing:** List and detail pages with cuisine, ratings, delivery time, and images (API or static fallback).
- **Search:** Backend search by name, description, or cuisine type.
- **Cart:** Add/remove items, update quantities; checkout with delivery address and notes.
- **Auth:** Register and login with JWT; protected dashboard and orders pages.
- **Orders:** Place orders and view order history.
- **Responsive UI:** Tailwind CSS and shadcn/ui (Radix).
- **Testing:** Vitest and React Testing Library for core components and hooks.

## Tech Stack

- **Frontend:** Next.js 15 (App Router), React 18, TypeScript, Tailwind CSS, shadcn/ui, Lucide icons.
- **Backend:** Express (Node.js), JWT auth, bcrypt, express-validator, rate limiting, CORS.
- **Database:** PostgreSQL via [Neon](https://neon.tech); migrations and seed in `server/`.
- **Dev/Deploy:** Vitest, ESLint, GitHub Actions CI, Vercel (frontend), Render (backend).

## Setup

See **[DEVELOPMENT.md](./DEVELOPMENT.md)** for detailed setup (env vars, database migrations, seed, and running frontend and backend).

Quick version:

1. Clone and install dependencies (root and `server/`).
2. Copy `.env.example` to `.env` in root and in `server/`; set `NEXT_PUBLIC_API_URL`, `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN`.
3. From `server/`: run `node run_migration.js` then `node seed.js`.
4. Start backend: `cd server && npm run dev` (port 5000).
5. Start frontend: `npm run dev` (port 9002).
6. Open [http://localhost:9002](http://localhost:9002).

## Project Structure

- **src/app:** App Router pages (home, login, register, checkout, confirmation, dashboard, orders, restaurants/[id]).
- **src/components:** UI components (Header, RestaurantCard, SearchBar, MenuList, CartSheet, OrderSummary, ProtectedRoute, ErrorBoundary) and shadcn primitives.
- **src/context:** AuthContext for user and token state.
- **src/hooks:** useCart, useToast.
- **src/lib:** restaurant-service (API + static fallback), data (static restaurants), utils.
- **src/config:** api.ts (client for backend endpoints).
- **server:** Express API (auth, restaurants, orders, users, cart), migrations, seed.

## Docs

- **[DEVELOPMENT.md](./DEVELOPMENT.md)** – Local setup and run instructions.
- **[docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)** – Stack, data flow, and deployment.
- **[docs/REQUIREMENTS.md](./docs/REQUIREMENTS.md)** – Product and technical requirements (functional and non-functional).

## Scripts

| Command        | Description                    |
|----------------|--------------------------------|
| `npm run dev`  | Start Next.js (port 9002)      |
| `npm run build`| Production build               |
| `npm run lint` | ESLint                         |
| `npm run typecheck` | TypeScript check         |
| `npm test -- --run` | Run Vitest tests        |
| `cd server && npm run dev` | Start Express API (port 5000) |
| `cd server && npm run migrate` | Run DB migrations   |
| `cd server && npm run seed`    | Seed database         |

## Contributions

Fork and open a PR; follow [CONTRIBUTING.md](./CONTRIBUTING.md).

License: MIT
