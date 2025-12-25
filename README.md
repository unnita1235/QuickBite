# 🍔 QuickBite - Food Delivery Platform

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://quick-bite-mu.vercel.app/)
[![TypeScript](https://img.shields.io/badge/TypeScript-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org)
[![CI/CD](https://github.com/unnita1235/QuickBite/workflows/CI/CD%20Pipeline/badge.svg)](https://github.com/unnita1235/QuickBite/actions)

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

# Set up environment variables
cp .env.example .env
# Edit .env and add your Google AI API key
# Get your API key from: https://aistudio.google.com/app/apikey

# Run development server
npm run dev
```

Open [http://localhost:9002](http://localhost:9002)

### Environment Variables

The application requires the following environment variables:

- `GOOGLE_GENAI_API_KEY`: Your Google AI API key for the Genkit AI recommendations feature. Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

Copy `.env.example` to `.env` and fill in your API key.

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
| Shopping cart | ✅ Complete |
| Order placement | ✅ Complete |
| AI Recommendations | ✅ Complete |
| Payment integration | 📅 Planned |
| Order tracking | 📅 Planned |

---

## 📦 Dependencies

### Core Dependencies
- **Next.js 15**: Framework and routing
- **React 18**: UI library
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Genkit AI**: AI-powered restaurant recommendations
- **Radix UI**: Accessible component primitives

### Optional/Unused Dependencies
The following dependencies are included but not currently used in the application:
- `firebase`: Reserved for future authentication/database features (see roadmap)
- `react-hook-form`, `recharts`, `embla-carousel-react`, `date-fns`: Part of UI component library, available for future use
- `patch-package`: Dependency patching tool (no active patches)

These can be removed if bundle size is a concern, but are kept for potential future features.

---

## 🧪 Testing & Development

For detailed information on testing and development, see:

- **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Complete development guide
- **[TESTING.md](./TESTING.md)** - Testing guide and examples
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deployment automation guide

### Quick Commands

```bash
# Run tests
npm test

# Run development server
npm run dev

# Build for production
npm run build

# Type check
npm run typecheck
```

---

## 📄 License

MIT License

---

## 👤 Author

**Unni T A**
- GitHub: [@unnita1235](https://github.com/unnita1235)
- Email: unnita1235@gmail.com
