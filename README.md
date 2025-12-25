# 🍔 QuickBite - Food Delivery Platform

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://quick-bite-mu.vercel.app/)
[![TypeScript](https://img.shields.io/badge/TypeScript-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org)

> A modern food delivery platform showcasing restaurant listings, menu browsing, and delivery time estimates.

## 🌐 Live Demo

**URL**: [quick-bite-mu.vercel.app](https://quick-bite-mu.vercel.app/)

---

## ✨ Features

### Restaurant Discovery
- 🏪 Browse local restaurants
- ⭐ View ratings and reviews
- 🍽️ Multiple cuisine categories (Italian, Japanese, American, Indian, Mexican, Healthy)
- ⏱️ Estimated delivery times

### Restaurant Details
- 📋 Full menu with prices
- 📍 Location information
- 📸 High-quality food images
- 📝 Restaurant descriptions

### User Experience
- 🎨 Modern, clean UI design
- 📱 Fully responsive layout
- ⚡ Fast page loads with Next.js
- 🔍 Easy navigation

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Images | Next.js Image Optimization |
| Deployment | Vercel |

---

## 🚀 Getting Started

```bash
# Clone repository
git clone https://github.com/unnita1235/QuickBite.git
cd QuickBite

# Install dependencies
npm install

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
│   │   ├── page.tsx              # Home page with restaurant list
│   │   ├── restaurants/
│   │   │   └── [id]/
│   │   │       └── page.tsx      # Restaurant detail page
│   │   └── layout.tsx            # Root layout
│   ├── components/
│   │   ├── RestaurantCard.tsx    # Restaurant preview card
│   │   ├── Header.tsx            # Navigation header
│   │   └── ui/                   # UI components
│   └── lib/
│       ├── restaurants.ts        # Restaurant data
│       └── types.ts              # TypeScript types
└── package.json
```

---

## 🍕 Restaurant Categories

| Category | Description |
|----------|-------------|
| Italian | Pasta, pizza, and Mediterranean cuisine |
| Japanese | Sushi, sashimi, and Japanese dishes |
| American | Burgers, fries, and classic American food |
| Indian | Curries, tikka masala, and Indian flavors |
| Mexican | Tacos, burritos, and Mexican street food |
| Healthy | Salads, grain bowls, and nutritious meals |

---

## 🎯 Roadmap

| Feature | Status |
|---------|--------|
| Restaurant listing | ✅ Complete |
| Restaurant details | ✅ Complete |
| Category filtering | ✅ Complete |
| User authentication | 📅 Planned |
| Shopping cart | 📅 Planned |
| Order placement | 📅 Planned |
| Payment integration | 📅 Planned |
| Order tracking | 📅 Planned |

---

## 📄 License

MIT License

---

## 👤 Author

**Unni T A**
- GitHub: [@unnita1235](https://github.com/unnita1235)
- Email: unnita1235@gmail.com
