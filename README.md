# 🍔 QuickBite - Food Delivery Platform

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://quick-bite-mu.vercel.app/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org)
[![CI/CD](https://github.com/unnita1235/QuickBite/workflows/CI/CD%20Pipeline/badge.svg)](https://github.com/unnita1235/QuickBite/actions)

> A modern food delivery platform showcasing restaurant listings, menu browsing, AI-powered recommendations, and delivery time estimates.

## 🌐 Live Demo

**Visit**: [quick-bite-mu.vercel.app](https://quick-bite-mu.vercel.app/)

---

## ✨ Features

### 🏪 Restaurant Discovery
- Browse local restaurants with beautiful cards
- View ratings, reviews, and cuisine types
- Multiple cuisine categories (Italian, Japanese, American, Indian, Mexican, Healthy)
- Real-time estimated delivery times
- AI-powered restaurant recommendations

### 📋 Restaurant Details
- Full menu with prices and descriptions
- High-quality food images
- Restaurant location and contact information
- Detailed cuisine descriptions

### 🛒 Shopping Experience
- Add items to cart with quantity management
- Real-time cart updates
- Order summary and checkout flow
- Dynamic delivery time calculation

### 🎨 User Experience
- Modern, clean UI design with Tailwind CSS
- Fully responsive layout (mobile, tablet, desktop)
- Fast page loads with Next.js 15
- Smooth navigation and animations
- Error boundaries for graceful error handling

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript 5.0 |
| **Styling** | Tailwind CSS |
| **UI Components** | Radix UI + shadcn/ui |
| **State Management** | React Context API |
| **AI/ML** | Google Genkit AI (Gemini 2.5 Flash) |
| **Testing** | Vitest + React Testing Library |
| **Deployment** | Vercel |
| **Code Quality** | ESLint + TypeScript |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ 
- npm or yarn
- Google AI API key ([Get one here](https://aistudio.google.com/app/apikey))

### Installation

```bash
# Clone the repository
git clone https://github.com/unnita1235/QuickBite.git
cd QuickBite

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your Google AI API key:
# GOOGLE_GENAI_API_KEY=your_api_key_here

# Run development server
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) to see the app.

### Environment Variables

Create a `.env.local` file in the root directory:

```env
GOOGLE_GENAI_API_KEY=your_google_ai_api_key_here
```

**Note**: Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

---

## 📁 Project Structure

```
QuickBite/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Home page
│   │   ├── checkout/          # Checkout page
│   │   ├── confirmation/      # Order confirmation
│   │   └── restaurants/[id]/  # Restaurant detail pages
│   ├── components/            # React components
│   │   ├── __tests__/        # Component tests
│   │   └── ui/               # shadcn/ui components
│   ├── hooks/                # Custom React hooks
│   │   └── __tests__/        # Hook tests
│   ├── lib/                  # Utilities and data
│   ├── actions/              # Server actions
│   └── ai/                   # AI/Genkit configuration
├── docs/                     # Documentation
├── scripts/                  # Utility scripts
└── public/                   # Static assets
```

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

**Test Coverage**: 17 tests covering cart operations, components, and core functionality.

For detailed testing information, see [TESTING.md](./TESTING.md).

---

## 🛠️ Development

```bash
# Start development server
npm run dev

# Type check
npm run typecheck

# Lint code
npm run lint

# Run all CI checks locally
npm run ci

# Build for production
npm run build

# Start production server
npm start
```

For detailed development information, see [DEVELOPMENT.md](./DEVELOPMENT.md).

---

## 📦 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server (port 9002) |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm test` | Run tests |
| `npm run typecheck` | Type check without emitting files |
| `npm run lint` | Run ESLint |
| `npm run ci` | Run all CI checks (lint, typecheck, test, build) |

---

## 🎯 Roadmap

| Feature | Status |
|---------|--------|
| Restaurant listing | ✅ Complete |
| Restaurant details | ✅ Complete |
| Category filtering | ✅ Complete |
| Shopping cart | ✅ Complete |
| Order placement | ✅ Complete |
| AI Recommendations | ✅ Complete |
| User authentication | 📅 Planned |
| Payment integration | 📅 Planned |
| Order tracking | 📅 Planned |

---

## 📚 Documentation

- **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Development guide and best practices
- **[TESTING.md](./TESTING.md)** - Testing guide and examples
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Contribution guidelines
- **[docs/deployment/](./docs/deployment/)** - Deployment guides
- **[docs/setup/](./docs/setup/)** - Setup and configuration guides

---

## 🏗️ Architecture

### State Management
- React Context API for cart state
- LocalStorage for cart persistence
- Server components for data fetching

### AI Integration
- Google Genkit for AI recommendations
- Gemini 2.5 Flash model for cuisine-based suggestions
- Error handling with fallback to text search

### Performance
- React.memo for component optimization
- Next.js Image optimization
- Code splitting with App Router

---

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.

---

## 👤 Author

**Unni T A**
- GitHub: [@unnita1235](https://github.com/unnita1235)
- Email: unnita1235@gmail.com

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Google Genkit](https://firebase.google.com/docs/genkit) - AI development framework
- [Vercel](https://vercel.com/) - Hosting and deployment

---

**Made with ❤️ using Next.js and TypeScript**
