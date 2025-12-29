# 🍔 QuickBite - AI-Powered Food Delivery Platform

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://quick-bite-mu.vercel.app/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black)](https://nextjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)](https://tailwindcss.com)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-black)](https://vercel.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

> A modern, fully-featured food delivery platform with AI-powered restaurant recommendations, built with Next.js 15, TypeScript, and Google Gemini AI.

---

## 🌟 Highlights

- ✅ **80+ Tests Passed** - Comprehensive testing with 100% success rate
- ⚡ **8ms Response Time** - Blazing fast production performance
- 📱 **100% Mobile Responsive** - Works flawlessly on all devices
- 🤖 **AI-Powered Search** - Smart restaurant recommendations
- 🎨 **Modern UI/UX** - Beautiful, intuitive interface with Tailwind CSS
- 🚀 **Production Ready** - Fully tested and deployed on Vercel

---

## 🌐 Live Demo

**🔗 Visit:** [quick-bite-mu.vercel.app](https://quick-bite-mu.vercel.app/)

Experience the application live! Browse restaurants, search with AI, add items to cart, and simulate the complete food ordering experience.

---

## ✨ Features

### Core Functionality
- 🏪 **Restaurant Discovery** - Browse 6+ restaurants with detailed information
- 🔍 **AI-Powered Search** - Intelligent restaurant recommendations using Google Gemini
- 📋 **Menu Browsing** - Complete menus with prices, descriptions, and images
- 🛒 **Shopping Cart** - Add items, manage quantities, and persist cart data
- 💳 **Checkout Process** - Streamlined order placement flow
- ⭐ **Ratings & Reviews** - View restaurant ratings and delivery times

### Technical Features
- 📱 **Fully Responsive** - Mobile-first design for all screen sizes
- ⚡ **Server-Side Rendering** - Fast initial page loads with Next.js 15
- 🎨 **Modern UI Components** - Radix UI + shadcn/ui components
- 🔒 **Type Safety** - Full TypeScript implementation
- 🎯 **SEO Optimized** - Comprehensive meta tags and Open Graph support
- 🌈 **Dark Mode Ready** - Theme support with Tailwind CSS
- ♿ **Accessible** - ARIA labels and keyboard navigation
- 📊 **Performance Optimized** - Image optimization and code splitting

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** [Next.js 15.3.3](https://nextjs.org) (App Router + Turbopack)
- **Language:** [TypeScript 5.0](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS 3.4](https://tailwindcss.com)
- **UI Components:** [Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **State Management:** React Context API
- **Icons:** [Lucide React](https://lucide.dev/)

### Backend & AI
- **AI Framework:** [Google Genkit](https://firebase.google.com/docs/genkit)
- **AI Model:** Gemini 2.5 Flash
- **Server Actions:** Next.js Server Actions
- **Data Persistence:** LocalStorage + Context

### Development & Testing
- **Testing:** [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/)
- **Type Checking:** TypeScript strict mode
- **Linting:** ESLint with Next.js config
- **Package Manager:** npm

### Deployment
- **Hosting:** [Vercel](https://vercel.com)
- **CI/CD:** Automated Vercel deployments
- **Performance:** CDN + Edge Functions
- **Analytics:** Built-in Vercel Analytics

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20.0 or higher
- **npm** or **yarn** or **pnpm**
- **Google AI API Key** ([Get one free](https://aistudio.google.com/app/apikey))

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/unnita1235/QuickBite.git
cd QuickBite

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your Google AI API key:
# GOOGLE_GENAI_API_KEY=your_api_key_here

# 4. Run development server
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) in your browser.

---

## 📁 Project Structure

```
QuickBite/
├── src/
│   ├── app/                    # Next.js 15 App Router pages
│   │   ├── layout.tsx         # Root layout with providers
│   │   ├── page.tsx           # Homepage with restaurant grid
│   │   ├── restaurants/       # Dynamic restaurant pages
│   │   ├── checkout/          # Checkout page
│   │   └── confirmation/      # Order confirmation
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── Header.tsx        # Navigation header
│   │   ├── SearchBar.tsx     # AI-powered search
│   │   ├── RestaurantCard.tsx # Restaurant preview card
│   │   ├── MenuList.tsx      # Menu display
│   │   └── CartSheet.tsx     # Shopping cart sidebar
│   ├── hooks/                 # Custom React hooks
│   │   └── useCart.tsx       # Cart management hook
│   ├── lib/                   # Utilities and data
│   │   ├── data.ts           # Restaurant and menu data
│   │   └── utils.ts          # Helper functions
│   ├── actions/               # Server Actions
│   │   └── recommend.ts      # AI recommendation action
│   └── ai/                    # AI configuration
│       ├── genkit.ts         # Genkit setup
│       └── flows/            # AI flows
├── docs/                      # Documentation
│   ├── SETUP-GUIDE.md        # Detailed setup guide
│   ├── DEPLOYMENT.md         # Deployment instructions
│   ├── TESTING-REPORT.md     # Comprehensive testing report
│   └── VERIFICATION-REPORT.md # Production verification
├── public/                    # Static assets
├── .env.example              # Environment variables template
├── next.config.ts            # Next.js configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies and scripts
```

---

## 🎯 Available Scripts

### Development

```bash
npm run dev          # Start development server (port 9002)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript type checking
```

### Testing

```bash
npm test                  # Run tests
npm run test:coverage     # Run tests with coverage
npm run test:ui           # Run tests with UI
npm run ci                # Run all checks (lint, typecheck, test, build)
```

### AI Development

```bash
npm run genkit:dev        # Start Genkit developer UI
npm run genkit:watch      # Start Genkit with watch mode
```

---

## 🧪 Testing & Verification

This project has been comprehensively tested with **100% success rate**:

### Test Coverage
- ✅ **80+ Tests Executed** - All passing
- ✅ **9 Routes Tested** - Homepage, 6 restaurants, checkout, confirmation
- ✅ **4 Device Types** - iPhone, Android, iPad, Desktop
- ✅ **3 Server Configs** - Dev localhost, Dev 127.0.0.1, Production
- ✅ **Zero Errors** - Clean server logs
- ✅ **Performance Verified** - Sub-10ms production response times

### Performance Metrics

| Metric | Development | Production |
|--------|-------------|------------|
| Average Response | 120ms | 8ms |
| Initial Load | 4.8s | 1.5s |
| Bundle Size | - | 101-123 kB |
| Success Rate | 100% | 100% |

### Documentation
- 📄 [Testing Report](./docs/TESTING-REPORT.md) - 498 lines of comprehensive testing
- 📄 [Verification Report](./docs/VERIFICATION-REPORT.md) - Production readiness verification
- 📄 [Setup Guide](./docs/SETUP-GUIDE.md) - Complete setup instructions
- 📄 [Deployment Guide](./docs/DEPLOYMENT.md) - Vercel deployment guide

---

## 📱 Responsive Design

QuickBite is fully responsive and works seamlessly across all devices:

- 📱 **Mobile** (< 768px) - Single column layout, touch-optimized
- 📱 **Tablet** (768px - 1024px) - Two column grid, optimized spacing
- 💻 **Desktop** (> 1024px) - Three column grid, full features
- 🖥️ **Large Screens** (> 1400px) - Contained layout, optimal reading width

### Browser Support
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## 🤖 AI-Powered Features

### Smart Restaurant Recommendations

Powered by **Google Gemini 2.5 Flash**, the search feature provides intelligent restaurant recommendations based on:

- Cuisine preferences
- Food types and ingredients
- Dietary restrictions
- User search intent

### How It Works

1. User enters search query (e.g., "spicy noodles")
2. Query sent to Google Genkit AI flow
3. AI analyzes restaurant data and matches preferences
4. Returns ranked recommendations
5. Results displayed with "AI Pick" badge

---

## 🎨 UI/UX Highlights

### Design System
- **Colors:** Tailwind CSS custom color palette
- **Typography:** Google Fonts (Alegreya + Belleza)
- **Components:** Radix UI primitives with custom styling
- **Animations:** Tailwind CSS animations + smooth transitions
- **Icons:** Lucide React icon library

### Key Components
- **RestaurantCard** - Memoized card with hover effects
- **SearchBar** - Debounced input with AI integration
- **CartSheet** - Slide-out cart with quantity controls
- **MenuList** - Organized menu with add-to-cart actions
- **Header** - Sticky navigation with cart indicator

---

## 🔒 Security & Best Practices

### Implementation
- ✅ Environment variables for sensitive data
- ✅ API keys server-side only
- ✅ Input validation and sanitization
- ✅ Type-safe with TypeScript
- ✅ Error boundaries for graceful failures
- ✅ Secure localStorage usage
- ✅ HTTPS enforced on production

### Code Quality
- ✅ ESLint configuration
- ✅ TypeScript strict mode
- ✅ Component memoization
- ✅ Code splitting and lazy loading
- ✅ Optimized images
- ✅ SEO meta tags

---

## 🚢 Deployment

### Vercel (Recommended)

The easiest way to deploy QuickBite:

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Connect to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables

3. **Add Environment Variables**
   ```
   GOOGLE_GENAI_API_KEY=your_api_key
   ```

4. **Deploy**
   - Vercel will automatically build and deploy
   - Get your live URL

### Manual Deployment

```bash
# Build the project
npm run build

# Start production server
npm run start
```

See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for detailed instructions.

---

## 📚 Documentation

### Guides
- 📖 [Setup Guide](./docs/SETUP-GUIDE.md) - Complete setup instructions
- 🚀 [Deployment Guide](./docs/DEPLOYMENT.md) - Deploy to Vercel
- 🧪 [Testing Guide](./TESTING.md) - Testing information
- 💻 [Development Guide](./DEVELOPMENT.md) - Development workflow
- 🤝 [Contributing](./CONTRIBUTING.md) - Contribution guidelines

### Reports
- ✅ [Testing Report](./docs/TESTING-REPORT.md) - 80+ comprehensive tests
- ✅ [Verification Report](./docs/VERIFICATION-REPORT.md) - Production verification

---

## 🤝 Contributing

Contributions are welcome! Please read the [Contributing Guide](./CONTRIBUTING.md) first.

### Steps to Contribute

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 🐛 Known Issues

- AI search requires Google AI API key (get one free at [AI Studio](https://aistudio.google.com/app/apikey))
- Cart data stored in localStorage (clears on browser data clear)
- Demo app uses placeholder images (Picsum Photos)

---

## 🗺️ Roadmap

### Planned Features
- [ ] User authentication and accounts
- [ ] Real payment integration (Stripe)
- [ ] Order history and tracking
- [ ] Restaurant admin dashboard
- [ ] Review and rating system
- [ ] Real-time order updates
- [ ] Multiple delivery addresses
- [ ] Favorite restaurants
- [ ] Promo codes and discounts
- [ ] Mobile app (React Native)

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for details.

---

## 👤 Author

**Unni T A**

- 🌐 GitHub: [@unnita1235](https://github.com/unnita1235)
- 📧 Email: unnita1235@gmail.com
- 🔗 LinkedIn: [Connect on LinkedIn](https://linkedin.com/in/unnita)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org) - React framework
- [Vercel](https://vercel.com) - Hosting and deployment
- [Google Genkit](https://firebase.google.com/docs/genkit) - AI framework
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [Radix UI](https://www.radix-ui.com/) - UI primitives
- [shadcn/ui](https://ui.shadcn.com/) - Component library
- [Lucide](https://lucide.dev/) - Icons

---

## ⭐ Support

If you find this project helpful, please give it a ⭐ on GitHub!

---

<div align="center">

**Built with ❤️ using Next.js 15 and TypeScript**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/unnita1235/QuickBite)

</div>
