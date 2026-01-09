# 🍔 QuickBite - AI-Powered Food Delivery Platform

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://quick-bite-mu.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38bdf8)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> Modern food delivery platform with AI-powered restaurant recommendations using Google Gemini

**Live Demo:** https://quick-bite-mu.vercel.app/

---

  <img src="screenshots/live_home.png" alt="Home" width="45%" style="border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); margin-right: 10px;" />
  <img src="screenshots/live_register.png" alt="Register" width="45%" style="border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);" />
## Overview

QuickBite is a fully functional food delivery web application featuring AI-powered restaurant search, shopping cart management, and a complete ordering flow. Built with Next.js 15, TypeScript, and Google Genkit for AI integration.

---

## Key Features

### Core Functionality
- 🏪 **Restaurant Discovery** - Browse 6+ restaurants with detailed menus
- 🤖 **AI-Powered Search** - Smart restaurant recommendations using Google Gemini 2.5 Flash
- 🛒 **Shopping Cart** - Add items, manage quantities, persistent cart storage
- 💳 **Checkout Process** - Complete order placement workflow
- ⭐ **Ratings Display** - View restaurant ratings and delivery estimates

### Technical Features
- ⚡ **Server-Side Rendering** - Fast initial page loads
- 📱 **Fully Responsive** - Mobile-first design
- 🎨 **Modern UI** - Radix UI + shadcn/ui components
- 🔒 **Type Safety** - Full TypeScript implementation
- 🎯 **SEO Optimized** - Meta tags and Open Graph support

---

## Tech Stack

**Frontend**
- Next.js 15.3.3 (App Router + Turbopack)
- TypeScript 5.0
- Tailwind CSS 3.4
- Radix UI + shadcn/ui components
- Lucide React icons

**AI & Backend**
- Google Genkit AI framework
- Gemini 2.5 Flash model
- Next.js Server Actions
- LocalStorage for cart persistence

**Testing & Development**
- Vitest + React Testing Library
- ESLint (Next.js config)
- TypeScript strict mode

**Deployment**
- Vercel (hosting + CDN)
- Automated CI/CD

---

## Quick Start

### Prerequisites
- Node.js 20.0+
- npm/yarn/pnpm
- Google AI API key ([Get free key](https://aistudio.google.com/app/apikey))

### Installation

```bash
# Clone repository
git clone https://github.com/unnita1235/QuickBite.git
cd QuickBite

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Add your Google AI API key to .env.local:
# GOOGLE_GENAI_API_KEY=your_api_key_here

# Run development server
npm run dev
```

Open http://localhost:9002

---

## Project Structure

```
QuickBite/
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Homepage
│   │   ├── restaurants/     # Restaurant pages
│   │   ├── checkout/        # Checkout page
│   │   └── confirmation/    # Order confirmation
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── Header.tsx
│   │   ├── SearchBar.tsx   # AI search
│   │   ├── RestaurantCard.tsx
│   │   └── CartSheet.tsx
│   ├── hooks/              # Custom hooks
│   │   └── useCart.tsx
│   ├── lib/                # Utilities
│   │   ├── data.ts        # Restaurant data
│   │   └── utils.ts
│   ├── actions/            # Server Actions
│   │   └── recommend.ts   # AI recommendations
│   └── ai/                 # AI configuration
│       └── genkit.ts
├── docs/                   # Documentation
├── public/                 # Static assets
└── package.json
```

---

## Available Scripts

```bash
# Development
npm run dev          # Start dev server (port 9002)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # TypeScript check

# Testing
npm test                  # Run tests
npm run test:coverage     # Coverage report
npm run test:ui           # Run with UI

# AI Development
npm run genkit:dev        # Genkit developer UI
```

---

## AI-Powered Search

The search feature uses Google Gemini 2.5 Flash to provide intelligent restaurant recommendations:

1. User enters search query (e.g., "spicy noodles")
2. Query sent to Genkit AI flow
3. AI analyzes restaurant data
4. Returns ranked recommendations
5. Results displayed with "AI Pick" badge

---

## Environment Variables

```env
# .env.local
GOOGLE_GENAI_API_KEY=your_google_api_key_here
NEXT_PUBLIC_API_URL=http://localhost:9002
```

---

## Testing & Verification

The project includes comprehensive testing documentation in the `/docs` folder:

- **Testing Report** - 80+ test cases across 9 routes, 4 device types, 3 server configurations
- **Verification Report** - Production readiness verification
- **Setup Guide** - Complete installation instructions

All tests pass with 100% success rate.

---

## Responsive Design

- **Mobile** (< 768px) - Single column, touch-optimized
- **Tablet** (768px - 1024px) - Two column grid
- **Desktop** (> 1024px) - Three column grid
- **Large Screens** (> 1400px) - Contained layout

**Browser Support:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

---

## Current Limitations

- Cart data stored in localStorage (cleared on browser data clear)
- No backend database (uses static restaurant data)
- No real payment processing (demo checkout only)
- AI search requires Google AI API key
- Demo uses placeholder images

---

## Roadmap

**Planned Features:**
- User authentication
- Real payment integration (Stripe)
- Order history and tracking
- Restaurant admin dashboard
- Review and rating system
- Delivery tracking
- Multiple delivery addresses
- Promo codes

---

## Documentation

- 📖 [Setup Guide](docs/SETUP-GUIDE.md) - Complete installation
- 🚀 [Deployment Guide](docs/DEPLOYMENT.md) - Vercel deployment
- 🧪 [Testing Guide](TESTING.md) - Testing information
- ✅ [Testing Report](docs/TESTING-REPORT.md) - 80+ comprehensive tests
- ✅ [Verification Report](docs/VERIFICATION-REPORT.md) - Production verification

---

## Deployment

### Deploy to Vercel

1. Push to GitHub
2. Import repository in Vercel
3. Add environment variable: `GOOGLE_GENAI_API_KEY`
4. Deploy automatically

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

---

## License

MIT License - See [LICENSE](LICENSE)

---

## Author

**Unni T A**
- GitHub: [@unnita1235](https://github.com/unnita1235)
- Email: unnita1235@gmail.com

---

## Acknowledgments

- Next.js team
- Google Genkit
- Vercel
- Tailwind CSS
- Radix UI
- shadcn/ui

---

**Built with ❤️ using Next.js 15 and TypeScript**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/unnita1235/QuickBite)
