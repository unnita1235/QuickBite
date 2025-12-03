# 🍔 QuickBite

[![Status](https://img.shields.io/badge/status-in_development-orange)]()
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)

> **Multi-restaurant Food Ordering Platform** with real-time order tracking

A modern food delivery application connecting customers with local restaurants, featuring cart management, order processing, and delivery tracking.

---

## 🎯 The Problem

Traditional food ordering involves:
- 📞 Phone calls with long wait times
- 🗒️ Manual order taking (error-prone)
- ⏱️ No real-time order status updates
- 💰 Limited payment options

**QuickBite** provides a seamless digital ordering experience for customers and restaurants.

---

## ✨ Key Features

### For Customers
- 🍕 **Restaurant Discovery**: Browse restaurants by cuisine, rating, delivery time
- 🛒 **Smart Cart**: Add items, customize orders, apply promo codes
- 💳 **Multiple Payment Methods**: Card, UPI, Cash on Delivery
- 📍 **Address Management**: Save multiple delivery addresses
- 🚚 **Real-time Tracking**: Live order status and delivery tracking
- ⭐ **Reviews & Ratings**: Rate restaurants and dishes
- 🔔 **Push Notifications**: Order updates via email/SMS

### For Restaurants
- 📊 **Order Dashboard**: Manage incoming orders in real-time
- 🍽️ **Menu Management**: Add/edit dishes, pricing, availability
- 📈 **Sales Analytics**: Daily/weekly/monthly revenue reports
- ⏰ **Operating Hours**: Set open/close times, holidays
- 🖨️ **Order Printing**: Auto-print orders to kitchen

### For Delivery Partners
- 🗺️ **Route Optimization**: Shortest delivery routes
- 💰 **Earnings Tracker**: View daily earnings
- 📦 **Order Queue**: Accept/decline delivery requests

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Headless UI
- **State Management**: Zustand / React Context
- **Forms**: React Hook Form + Zod
- **Maps**: Mapbox / Google Maps (planned)

### Backend (Planned)
- **API**: Next.js API Routes
- **Database**: PostgreSQL + Redis (cart caching)
- **ORM**: Prisma
- **Auth**: NextAuth.js (Google, Email)
- **Payments**: Razorpay / Stripe
- **File Upload**: Cloudinary (menu images)
- **Real-time**: Socket.io / Pusher (order updates)

### DevOps
- **Hosting**: Vercel (Frontend), Railway/Render (Backend)
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry (error tracking)

---

## 📐 System Architecture
```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│   Customer   │◀─────▶│  Next.js App │◀─────▶│  Restaurant  │
│     App      │       │   (Frontend) │       │    Panel     │
└──────────────┘       └───────┬──────┘       └──────────────┘
                               │
                ┌──────────────┼──────────────┐
                │              │              │
          ┌─────▼─────┐  ┌────▼────┐   ┌────▼─────┐
          │   Auth    │  │   API   │   │  Payment │
          │  Service  │  │  Routes │   │ Gateway  │
          └─────┬─────┘  └────┬────┘   └────┬─────┘
                │              │              │
                └──────────────┴──────────────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
              ┌─────▼─────┐        ┌─────▼─────┐
              │PostgreSQL │        │   Redis   │
              │ (Primary) │        │  (Cache)  │
              └───────────┘        └───────────┘
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# Clone repository
git clone https://github.com/unnita1235/QuickBite.git
cd QuickBite

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure
```
QuickBite/
├── src/
│   ├── app/
│   │   ├── (customer)/      # Customer-facing pages
│   │   ├── (restaurant)/    # Restaurant admin pages
│   │   ├── cart/            # Shopping cart
│   │   ├── checkout/        # Checkout process
│   │   └── api/             # API routes
│   ├── components/
│   │   ├── restaurant/      # Restaurant card, menu items
│   │   ├── cart/            # Cart drawer, items
│   │   ├── checkout/        # Payment forms
│   │   └── ui/              # shadcn components
│   ├── lib/
│   │   ├── db/              # Database utilities
│   │   ├── validations/     # Zod schemas
│   │   └── utils/           # Helper functions
│   ├── store/               # Zustand stores (cart, user)
│   └── types/               # TypeScript types
└── public/
    └── images/              # Food images, logos
```

---

## 🎨 Current Implementation Status

| Feature | Status | Notes |
|---------|--------|-------|
| Restaurant Listing | ✅ Done | With filters |
| Menu Display | ✅ Done | Categories, items |
| Cart Functionality | 🚧 In Progress | Add/remove items |
| Checkout UI | ✅ Done | Address, payment forms |
| User Authentication | 📅 Planned | Google OAuth |
| Payment Integration | 📅 Planned | Razorpay |
| Order Tracking | 📅 Planned | Real-time updates |
| Restaurant Dashboard | 📅 Planned | Order management |

---

## 🔐 Environment Variables
```bash
# Database
DATABASE_URL="postgresql://..."

# Authentication
NEXTAUTH_SECRET="your-secret"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# Payments
RAZORPAY_KEY_ID="..."
RAZORPAY_KEY_SECRET="..."

# File Upload
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."

# Maps
NEXT_PUBLIC_MAPBOX_TOKEN="..."

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="..."
SMTP_PASS="..."
```

---

## 🧪 Key Features Deep Dive

### 1. Smart Cart System
```typescript
// Cart state management using Zustand
interface CartState {
  items: CartItem[]
  addItem: (item: MenuItem, quantity: number) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  total: number
}

// Features:
- Persistent cart (localStorage)
- Item customization (toppings, size)
- Promo code validation
- Minimum order checks
```

### 2. Restaurant Search & Filter
```typescript
// Advanced filtering
- Cuisine type (Italian, Chinese, Indian, etc.)
- Price range (₹, ₹₹, ₹₹₹)
- Delivery time (<30 min, 30-45 min, >45 min)
- Ratings (4+, 3+)
- Vegetarian/Non-veg
- Open now / Pre-order
```

### 3. Order Flow
```
1. Browse Restaurants → 2. Add to Cart → 3. Checkout → 4. Payment → 5. Tracking

Customer                Restaurant              Delivery Partner
   │                        │                          │
   ├─ Order Placed ────────▶│                          │
   │                        ├─ Accept Order ──────────▶│
   │                        │                          │
   │◀─ Order Confirmed ─────┤                          │
   │                        │                          │
   │                        ├─ Preparing Food          │
   │◀─ Status Update ───────┤                          │
   │                        │                          │
   │                        ├─ Food Ready ─────────────▶│
   │                        │                          │
   │◀─ Out for Delivery ────┴──────────────────────────┤
   │                                                    │
   │◀─ Delivered ───────────────────────────────────────┤
```

---

## 📊 Database Schema (Planned)
```sql
-- Core tables
- users (customers, restaurants, delivery partners)
- restaurants (name, address, cuisines, ratings)
- menu_items (dish details, price, availability)
- orders (order details, status, timestamps)
- order_items (junction table for orders & menu items)
- payments (transaction records)
- reviews (ratings & feedback)
- addresses (saved delivery locations)
```

---

## 🎯 Roadmap

### Phase 1 (Current)
- [x] Homepage design
- [x] Restaurant listing page
- [x] Menu display
- [ ] Cart functionality (80% done)
- [ ] Checkout flow

### Phase 2 (Next 2 months)
- [ ] User authentication
- [ ] Order placement backend
- [ ] Payment gateway integration
- [ ] Email notifications

### Phase 3 (Month 3-4)
- [ ] Restaurant admin panel
- [ ] Real-time order tracking
- [ ] Delivery partner app
- [ ] Push notifications

### Phase 4 (Month 5+)
- [ ] Advanced analytics
- [ ] Loyalty program
- [ ] Scheduled orders
- [ ] Multi-language support

---

## 🏆 Technical Highlights

1. **Optimistic UI Updates**: Cart updates instantly (no loading)
2. **Image Optimization**: Next.js Image component for fast loading
3. **SEO-friendly**: Server-side rendering for restaurant pages
4. **Mobile-first**: Fully responsive design
5. **Accessibility**: ARIA labels, keyboard navigation

---

## 🤝 Contributing

Feedback and suggestions welcome!

---

## 📄 License

MIT License

---

## 👤 Author

**Unni T A**
- GitHub: [@unnita1235](https://github.com/unnita1235)
- Email: unnita1235@gmail.com

---

## 🙏 Credits

- Food images: Unsplash
- Icons: Lucide React
- UI inspiration: Swiggy, Zomato

---

**Note**: Active development project. Backend integration in progress.
