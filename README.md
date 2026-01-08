# QuickBite 🍕

A full-stack food delivery application designed to bridge the gap between hungry users and local culinary gems. Built with **Next.js 15** and **Node.js**, QuickBite combines lightning-fast performance with a premium user experience.

> **Note:** This project currently uses a robust text-based search engine backed by PostgreSQL, with architecture pre-configured for **Google Genkit (Gemini 2.0 Flash)** integration to enable future natural-language discovery.

## About The Project

QuickBite is more than just a clone; it is a production-ready template for modern e-commerce. It solves the challenge of efficient food discovery and order management through a decoupled client-server architecture.

**Key capabilities include:**
*   **Seamless Ordering**: From browsing menus to checkout, the flow is optimized for conversion.
*   **Secure Infrastructure**: Industry-standard JWT authentication and password hashing.
*   **AI Foundation**: The codebase includes the `genkit` SDK setup, ready to transform search queries like *"healthy lunch under $15"* into structured database queries.
*   **Real-world Deployment**: Fully configured for Vercel (Frontend) and Render (Backend) with environment-based configuration.**Live Demo:** [https://quick-bite-mu.vercel.app](https://quick-bite-mu.vercel.app)  
**Backend API:** [https://quickbite-backend-zsdz.onrender.com](https://quickbite-backend-zsdz.onrender.com)

---

## Features

- **AI-Powered Search** — Natural language restaurant search using Google Genkit AI
- **Restaurant Discovery** — Browse restaurants with ratings, cuisine types, and delivery times
- **Shopping Cart** — Add menu items, adjust quantities, and view order totals
- **User Authentication** — JWT-based registration and login
- **Order Management** — Place and track food orders
- **Responsive Design** — Mobile-first UI with Tailwind CSS

---

## Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| Next.js 15 | React framework with App Router |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Radix UI | Accessible component primitives |
| Google Genkit | AI recommendations |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js + Express | REST API server |
| PostgreSQL | Database |
| bcrypt | Password hashing |
| JWT | Authentication tokens |
| express-rate-limit | Rate limiting |

---

## Project Structure

```
QuickBite/
├── src/
│   ├── app/                  # Next.js pages (App Router)
│   │   ├── checkout/         # Checkout flow
│   │   ├── dashboard/        # User dashboard
│   │   ├── login/            # Login page
│   │   ├── orders/           # Order history
│   │   ├── register/         # Registration page
│   │   └── restaurants/      # Restaurant details
│   ├── ai/                   # Genkit AI flows
│   ├── components/           # React components
│   │   ├── ui/               # Shadcn/ui components
│   │   └── __tests__/        # Component tests
│   ├── context/              # React context providers
│   ├── hooks/                # Custom React hooks
│   └── lib/                  # Utilities and data
├── server/
│   ├── src/
│   │   ├── index.js          # Express server entry
│   │   └── routes/           # API route handlers
│   └── migrations/           # Database migrations
└── docs/                     # Additional documentation
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Google AI API key (for Genkit)

### 1. Clone the Repository

```bash
git clone https://github.com/unnita1235/QuickBite.git
cd QuickBite
```

### 2. Install Dependencies

```bash
# Frontend
npm install

# Backend
cd server && npm install
```

### 3. Configure Environment Variables

Create `.env.local` in the root directory:

```env
# AI Search
GOOGLE_GENAI_API_KEY=your_google_ai_api_key

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

Create `.env` in the `server/` directory:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/quickbite
JWT_SECRET=your_secure_jwt_secret
FRONTEND_URL=http://localhost:9002
PORT=3000
```

### 4. Setup Database

Run the migrations to create tables:

```bash
cd server
# Initialize PostgreSQL tables (users, restaurants, orders, menus)
```

### 5. Start Development Servers

**Terminal 1 — Frontend (port 9002):**
```bash
npm run dev
```

**Terminal 2 — Backend (port 3000):**
```bash
cd server && npm run dev
```

Open [http://localhost:9002](http://localhost:9002)

---

## API Endpoints

### Health Check
```
GET /api/health
```

### Authentication
```
POST /api/auth/register    # Register new user
POST /api/auth/login       # Login and get JWT token
```

### Restaurants
```
GET  /api/restaurants      # List all restaurants (paginated)
GET  /api/restaurants/:id  # Get restaurant details with menu
POST /api/restaurants      # Create restaurant (auth required)
```

### Orders
```
GET  /api/orders           # Get user's orders (auth required)
GET  /api/orders/:id       # Get order details (auth required)
POST /api/orders           # Create new order (auth required)
```

### User Profile
```
GET  /api/users/profile    # Get current user profile (auth required)
PUT  /api/users/profile    # Update user profile (auth required)
```

---

## Testing

Run the component test suite:

```bash
npm run test           # Run tests
npm run test:ui        # Run tests with UI
npm run test:coverage  # Run tests with coverage report
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js dev server (port 9002) |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run test` | Run Vitest tests |
| `npm run ci` | Run full CI pipeline (lint + typecheck + test + build) |

---

## Deployment

### Frontend (Vercel)
The frontend is deployed on Vercel with automatic deployments from the main branch.

### Backend (Render)
The backend is deployed on Render. Configuration is in `server/Procfile`:
```
web: npm start
```

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

## Author

**Unnita** — [@unnita1235](https://github.com/unnita1235)
