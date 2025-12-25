# 🍔 QuickBite - Food Delivery Platform

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://quick-bite-mu.vercel.app/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org)

A modern food delivery platform built with Next.js 15, featuring restaurant listings, menu browsing, AI-powered recommendations, and a complete shopping cart experience.

## 🌐 Live Demo

Visit the live application: [quick-bite-mu.vercel.app](https://quick-bite-mu.vercel.app/)

## ✨ Features

- **Restaurant Discovery**: Browse restaurants by category with ratings and reviews
- **Smart Search**: AI-powered restaurant recommendations using Google Genkit
- **Menu Browsing**: View detailed menus with prices and descriptions
- **Shopping Cart**: Add items, manage quantities, and checkout
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Fast Performance**: Optimized with Next.js 15 and TypeScript

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **AI/ML**: Google Genkit (Gemini 2.5 Flash)
- **Testing**: Vitest + React Testing Library
- **Deployment**: Vercel

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

# Create .env.local file
echo "GOOGLE_GENAI_API_KEY=your_api_key_here" > .env.local

# Run development server
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) to see the app.

## 📁 Project Structure

```
QuickBite/
├── src/
│   ├── app/              # Next.js pages
│   ├── components/       # React components
│   ├── hooks/           # Custom hooks
│   ├── lib/             # Utilities and data
│   ├── actions/         # Server actions
│   └── ai/              # AI configuration
├── docs/                # Documentation
└── scripts/             # Utility scripts
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm test -- --watch
```

## 🛠️ Development

```bash
# Development server
npm run dev

# Build for production
npm run build

# Type check
npm run typecheck

# Lint
npm run lint
```

## 📚 Documentation

- [Development Guide](./DEVELOPMENT.md) - Development setup and guidelines
- [Testing Guide](./TESTING.md) - Testing information
- [Contributing](./CONTRIBUTING.md) - Contribution guidelines

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.

## 👤 Author

**Unni T A**
- GitHub: [@unnita1235](https://github.com/unnita1235)
- Email: unnita1235@gmail.com
