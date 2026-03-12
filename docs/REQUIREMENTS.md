# QuickBite Requirements

Product and technical requirements for the QuickBite food delivery web application. This document reflects the current system behavior and explicitly calls out gaps or future work.

## 1. Introduction

**Purpose:** This document defines the functional and non-functional requirements for QuickBite, a full-stack food delivery platform. It serves as the single reference for what the system does, what it shall support, and what is out of scope.

**Scope:** QuickBite allows users to discover restaurants, view menus, add items to a cart, register or log in, and place orders with delivery details. The system consists of a Next.js frontend, an Express backend API, and a PostgreSQL database (Neon).

**Stakeholders:** End users (guests and registered users), developers, and operators (deployment and maintenance).

---

## 2. User Roles and Personas

| Role | Description | Capabilities |
|------|-------------|--------------|
| **Guest** | Unauthenticated visitor | Browse restaurant list; search by name, description, or cuisine; view restaurant detail and menus; add or remove items from cart and adjust quantities. Cannot place an order; must register or log in to checkout. |
| **Registered user** | Authenticated user with an account | All guest capabilities plus: register (email, password, name), log in, log out; view dashboard and order history; place orders with delivery address and notes; cart is optionally synced with the server when logged in. |

There is no in-app admin or restaurant-manager role. The backend exposes protected routes for creating restaurants and managing menus (POST/PUT/DELETE), which could support a future admin UI.

---

## 3. Functional Requirements

### FR1 – Restaurant discovery

- **FR1.1** The system shall display a list of restaurants with name, description, cuisine type, rating, delivery time, and image. Data is loaded from the API with a static fallback if the API is unavailable.
- **FR1.2** The system shall support search by query string (name, description, or cuisine type) via the backend search endpoint. Results are shown on the home page; optional filters (cuisineType, minRating, maxDeliveryTime) are supported by the API.
- **FR1.3** The system shall provide a restaurant detail page per restaurant ID, showing full menu categories and items (name, description, price, image). Source: API with static fallback.
- **FR1.4** Restaurant list may be paginated (page, limit) via the API; frontend requests a configurable limit (e.g. 50).

### FR2 – Cart

- **FR2.1** Users can add menu items to the cart with quantity, and remove items or update quantities.
- **FR2.2** Cart state is persisted in browser localStorage so it survives page refresh for the same browser.
- **FR2.3** When the user is authenticated, the system may sync the cart with the server: on load, if the server cart has items, the client cart is replaced with server data; after changes, the client cart is debounced and sent to the server (PUT /api/cart). Sync failures do not block the user; localStorage remains the source of truth for the session.
- **FR2.4** Cart items may include a restaurant identifier so checkout can group items by restaurant and create one order per restaurant.

### FR3 – Authentication

- **FR3.1** Users can register with email, password, and name. The system shall validate email format, password length (minimum 8 characters), and name length (2–100 characters). Passwords are stored as bcrypt hashes.
- **FR3.2** Users can log in with email and password. The system returns a JWT and user object; the frontend stores the token (e.g. in localStorage) and attaches it to subsequent API requests via the Authorization header.
- **FR3.3** Users can log out; the frontend clears the token and user state.
- **FR3.4** Protected routes (e.g. checkout, dashboard, orders) shall redirect unauthenticated users to the login page.
- **FR3.5** Auth endpoints are rate-limited (e.g. 5 attempts per 15 minutes per client) to reduce abuse.

### FR4 – Checkout

- **FR4.1** Checkout shall require the user to be authenticated; otherwise the user is redirected to login.
- **FR4.2** The system shall collect delivery address and delivery notes (optional) on the checkout page.
- **FR4.3** On place order, the system shall create one order per restaurant represented in the cart. Each order includes restaurant id, items (id, name, price, quantity, description), total amount, delivery address, and delivery notes.
- **FR4.4** After successful order creation, the user is redirected to a confirmation view. The confirmation page displays order summary information (e.g. total and item count) passed via query parameters; the cart is cleared.

### FR5 – Orders

- **FR5.1** Authenticated users can view a list of their orders. Each order shows restaurant name, total amount, status, and date (from the API).
- **FR5.2** The system shall not require the user to update order status from the app; status updates (e.g. preparing, delivered) are backend/admin operations. The frontend only displays the current status.

### FR6 – User profile

- **FR6.1** Authenticated users can view their profile information (e.g. name, email) on the dashboard. Data is loaded from GET /api/users/profile.
- **FR6.2** The backend supports updating profile (first name, last name, phone, email) via PUT /api/users/profile. A dedicated profile-edit UI is not implemented; document as optional/future (see Section 7).

### FR7 – Global UX

- **FR7.1** The system shall show a custom 404 page when a resource is not found (e.g. invalid restaurant id), with a link back to the restaurant list.
- **FR7.2** The system may show a root loading state (e.g. skeletons) while the initial layout or page is loading.

---

## 4. Non-Functional Requirements

### NFR1 – Security

- Passwords shall be hashed with bcrypt before storage.
- API authentication shall use JWT; protected routes validate the token and set the user identity for the request.
- Global and auth-specific rate limiting shall be applied to reduce brute-force and abuse.
- CORS shall restrict allowed origins to a configured list (e.g. frontend origin and localhost for development).
- User input (e.g. strings) shall be sanitized to reduce XSS (e.g. stripping or limiting certain characters); validation (email, password length, name length) shall be applied on the backend.

### NFR2 – Availability and resilience

- The frontend and API can run independently. If the API is unavailable, the restaurant list and detail views may fall back to static data so the app remains usable for browsing.
- Database connection and errors are handled; the API returns structured error responses and appropriate HTTP status codes.

### NFR3 – Usability

- The UI shall be responsive and work on typical mobile and desktop viewports.
- Forms and interactive elements shall have appropriate labels and structure to support accessibility (existing patterns in components).

### NFR4 – Deployment and configuration

- The frontend shall be configurable via environment variables (e.g. `NEXT_PUBLIC_API_URL`).
- The backend shall be configurable via environment variables (e.g. `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN`, `PORT`, `NODE_ENV`).
- Production deployment targets: frontend on Vercel, backend on Render (or similar), database on Neon (PostgreSQL). All configuration is env-based; no hardcoded secrets.

---

## 5. API Contract Summary

| Method | Path | Auth | Request / Response (summary) |
|--------|------|------|------------------------------|
| GET | /api/health | No | Returns `{ success, status, timestamp, uptime }`. |
| POST | /api/auth/register | No | Body: `{ email, password, name }`. Returns `{ success, data: { token, user } }`. |
| POST | /api/auth/login | No | Body: `{ email, password }`. Returns `{ success, data: { token, user } }`. |
| GET | /api/restaurants | No | Query: `page`, `limit`. Returns `{ success, data: [...], pagination }`. |
| GET | /api/restaurants/:id | No | Returns `{ success, data: restaurantWithMenus }`. |
| POST | /api/search | No | Body: `{ query, cuisineType?, minRating?, maxDeliveryTime?, limit?, offset? }`. Returns `{ success, results: [...], pagination }`. |
| POST | /api/orders | Yes | Body: `{ restaurantId, items, totalAmount, deliveryAddress?, deliveryNotes? }`. Returns `{ success, data: order }`. |
| GET | /api/orders | Yes | Returns `{ success, data: orders[] }` (current user). |
| GET | /api/orders/:id | Yes | Returns `{ success, data: order }`. |
| PUT | /api/orders/:id/status | Yes | Body: `{ status }`. Updates order status (no frontend UI). |
| GET | /api/users/profile | Yes | Returns `{ success, data: user }`. |
| PUT | /api/users/profile | Yes | Body: `{ firstName?, lastName?, phone?, email? }`. Returns `{ success, data: user }`. |
| GET | /api/cart | Yes | Returns `{ success, data: { items, updated_at } }`. |
| PUT | /api/cart | Yes | Body: `{ items }`. Returns `{ success, data: { items, updated_at } }`. |
| DELETE | /api/cart | Yes | Clears cart; returns `{ success, message }`. |

Auth: "Yes" means `Authorization: Bearer <token>` required. All JSON responses use a common shape with `success` and either `data` or `error`.

---

## 6. Data Requirements

**Core entities:**

- **User:** id, email (unique), password_hash, first_name, last_name, phone, created_at, updated_at. See `server/migrations/001_create_tables.sql`.
- **Restaurant:** id, name, description, cuisine_type, rating, delivery_time, delivery_charge, min_order, image_url, address, phone, is_active, created_at, updated_at.
- **Menu:** id, restaurant_id (FK), name, items (JSONB), created_at, updated_at.
- **Order:** id, user_id (FK), restaurant_id (FK), total_amount, delivery_fee, status, delivery_address, delivery_notes, items (JSONB, migration 002), created_at, updated_at, completed_at.
- **Cart:** id, user_id (FK, unique), items (JSONB), updated_at. One cart per user (migration 003).

**Key constraints:**

- User email is unique. Order belongs to one user and one restaurant. Cart is one-per-user (upsert by user_id). Orders and carts reference users with ON DELETE CASCADE where applicable.

**References:** Schema is defined in `server/migrations/`. Seed data for restaurants and menus is provided by `server/seed.js`.

---

## 7. Current vs Future / Out of Scope

**Implemented:**

- Restaurant list and detail with API and static fallback; search via POST /api/search; cart (in-memory + localStorage, optional server sync when authenticated); registration and login with JWT; logout; protected routes (checkout, dashboard, orders); checkout with delivery address and notes; one order per restaurant on place order; confirmation page with summary from query params; order list for current user; dashboard with profile display; custom 404 and root loading UI; error boundaries and error pages.

**Not implemented / optional / future:**

- **Profile edit UI:** Backend PUT /api/users/profile is implemented; no frontend form for editing name, phone, or email.
- **Order status updates by user:** Backend PUT /api/orders/:id/status exists; no user-facing control to change status (e.g. cancel).
- **Admin UI:** No UI for creating or editing restaurants or menus; backend routes exist and are protected by JWT.
- **Payments:** No Stripe or other payment integration; orders are placed without payment capture.
- **Email notifications:** No email on registration, order confirmation, or status change.
- **PostgreSQL trigger syntax:** Migrations 002 and 003 use `EXECUTE FUNCTION`; on older PostgreSQL versions this may need to be adjusted (e.g. EXECUTE PROCEDURE or equivalent) if applicable.

---

## 8. References

- [DEVELOPMENT.md](../DEVELOPMENT.md) – Local setup, env vars, migrations, seed, run frontend and backend.
- [ARCHITECTURE.md](./ARCHITECTURE.md) – Stack diagram, data flow, deployment.
- [README.md](../README.md) – Project overview and quick start.
- Frontend API client: `src/config/api.ts`.
- Auth state: `src/context/AuthContext.tsx`.
- Cart state and sync: `src/hooks/useCart.tsx`.
- Backend entry and routes: `server/src/index.js`, `server/src/routes/*.js`.
