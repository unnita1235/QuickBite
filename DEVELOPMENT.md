# QuickBite Development Setup

This guide covers local development for the QuickBite frontend (Next.js) and backend (Express + PostgreSQL).

## Prerequisites

- Node.js 18+
- npm
- PostgreSQL (local install, Docker, or a [Neon](https://neon.tech) account for a cloud database)

## 1. Clone and install

```bash
git clone https://github.com/unnita1235/QuickBite.git
cd QuickBite
npm install
cd server
npm install
cd ..
```

## 2. Environment variables

### Frontend

Copy the example env and set the API base URL (default points to local backend):

```bash
cp .env.example .env
```

Edit `.env`:

- `NEXT_PUBLIC_API_URL=http://localhost:5000/api` (for local dev)

### Backend

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:

- **DATABASE_URL** – PostgreSQL connection string (e.g. Neon connection string or `postgresql://postgres:postgres@localhost:5432/quickbite` for local)
- **JWT_SECRET** – A secure random string (at least 32 characters)
- **NODE_ENV** – `development`
- **PORT** – `5000`
- **CORS_ORIGIN** – `http://localhost:9002,http://localhost:3000`

## 3. Database

From the `server` directory:

```bash
cd server
node run_migration.js
node seed.js
```

This runs migrations and seeds restaurants and menus.

## 4. Run the app

**Terminal 1 – backend (port 5000):**

```bash
cd server
npm run dev
```

**Terminal 2 – frontend (port 9002):**

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002). The API is at [http://localhost:5000/api](http://localhost:5000/api).

## 5. Tests and lint

From the project root (frontend):

```bash
npm run lint
npm run typecheck
npm test -- --run
```

## 6. Scripts reference

| Script        | Location  | Description                |
|---------------|-----------|----------------------------|
| `npm run dev` | root      | Start Next.js (port 9002)  |
| `npm run dev` | server/   | Start Express (port 5000)   |
| `npm run migrate` | server/ | Run DB migrations         |
| `npm run seed`    | server/ | Seed restaurants and menus |
