# QuickBite - Restaurant Discovery Platform

> AI-powered restaurant browsing with Google Gemini integration, built with Next.js 15 and TypeScript.

**Status**: ✅ Frontend + AI Integration (Working)  
**Live Demo**: https://quick-bite-mu.vercel.app

---

## 📸 What This Is

QuickBite is a **restaurant discovery platform** featuring AI-powered search using Google Gemini. It demonstrates modern frontend development, AI integration, and responsive design.

**Important**: This is a frontend application with AI search capabilities. No backend server, database, or actual order processing exists.

---

## ✨ Current Features

### What Actually Works ✅
- ✅ **Restaurant Browsing** - Browse 6+ restaurants with menus
- ✅ **AI-Powered Search** - Google Gemini integration for smart recommendations
- ✅ **Shopping Cart** - Add items to cart (localStorage only)
- ✅ **Responsive Design** - Works on all device sizes
- ✅ **Menu Display** - Detailed menu items with prices
- ✅ **Restaurant Details** - Individual restaurant pages

### What's Not Implemented ❌
- ❌ No backend server
- ❌ No database (restaurants are hardcoded)
- ❌ No user accounts or authentication
- ❌ No real order processing
- ❌ No payment integration
- ❌ No delivery tracking
- ❌ Cart only persists in browser localStorage

---

## 🛠️ Tech Stack

**Frontend**:
- Next.js 15 (App Router + Turbopack)
- TypeScript
- Tailwind CSS
- shadcn/ui components
- React Context API

**AI Integration**:
- Google Genkit
- Google Gemini 2.5 Flash
- Server Actions

**Deployment**:
- Vercel

**Not Implemented**:
- Backend API
- Database
- Payment gateway
- Order management system

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Google AI API Key (free from [AI Studio](https://aistudio.google.com/app/apikey))

### Installation

```bash
# Clone repository
git clone https://github.com/unnita1235/QuickBite.git
cd QuickBite

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Add your Google AI API key to .env.local:
# GOOGLE_GENAI_API_KEY=your_api_key_here

# Run development server
npm run dev

# Open http://localhost:9002
```

---

## 📁 Project Structure

```
QuickBite/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Restaurant listing page
│   │   ├── restaurants/[id]/     # Restaurant detail pages
│   │   ├── checkout/             # Checkout page (UI only)
│   │   └── confirmation/         # Order confirmation
│   ├── components/
│   │   ├── SearchBar.tsx         # AI search component
│   │   ├── RestaurantCard.tsx    # Restaurant cards
│   │   ├── MenuList.tsx          # Menu display
│   │   └── CartSheet.tsx         # Shopping cart
│   ├── actions/
│   │   └── recommend.ts          # AI recommendation action
│   ├── lib/
│   │   └── data.ts               # Hardcoded restaurant data
│   └── hooks/
│       └── useCart.tsx           # Cart management
└── package.json
```

---

## 🤖 AI Features

### Google Gemini Integration

The search feature uses Google Gemini 2.5 Flash to:
- Understand natural language queries
- Match user preferences to restaurants
- Provide intelligent recommendations
- Consider cuisine types and user intent

**Example queries**:
- "I want spicy noodles"
- "Something healthy for lunch"
- "Best burgers nearby"

---

## 🎯 What This Project Demonstrates

### Skills Proven
- ✅ AI integration (Google Gemini)
- ✅ Next.js App Router
- ✅ TypeScript
- ✅ State management (React Context)
- ✅ Responsive design
- ✅ Clean component architecture
- ✅ Server Actions
- ✅ localStorage for cart persistence

### What's Not Built Yet
- ❌ Backend API
- ❌ Database integration
- ❌ User authentication
- ❌ Real order processing
- ❌ Payment handling

---

## 📊 Demo Data

Includes 6 hardcoded restaurants:
- **Bella Italia** - Italian cuisine
- **Spice Route** - Indian food
- **Dragon Wok** - Chinese dishes
- **Fresh Bites** - Healthy options
- **Burger House** - American burgers
- **Sushi Master** - Japanese sushi

Each restaurant has:
- Menu items with prices
- Restaurant description
- Ratings and delivery time
- Category tags

**Note**: All data is static and hardcoded.

---

## 🔧 Available Scripts

```bash
npm run dev           # Development server (port 9002)
npm run build         # Production build
npm run start         # Production server
npm run lint          # ESLint
npm test              # Run tests
npm run test:coverage # Test coverage
```

---

## 📝 Current Limitations

This is a **frontend + AI demo**:

1. **No Backend**: No server, database, or API
2. **Static Data**: Restaurants hardcoded in code
3. **localStorage Cart**: Cart doesn't sync across devices
4. **No Orders**: Checkout is UI only, no real orders
5. **No Auth**: No user accounts or login
6. **Demo Only**: Not a real food delivery platform

---

## 🗺️ Development Roadmap

### Phase 1 (Current) - Frontend + AI ✅
- [x] Restaurant browsing UI
- [x] Google Gemini AI integration
- [x] Shopping cart functionality
- [x] Responsive design
- [x] Search recommendations

### Phase 2 (Planned) - Backend
- [ ] Build Express.js backend
- [ ] PostgreSQL database setup
- [ ] Restaurant CRUD operations
- [ ] Order management API
- [ ] User authentication

### Phase 3 (Future) - Full Features
- [ ] Real order processing
- [ ] Payment integration (Stripe)
- [ ] Delivery tracking
- [ ] User accounts and history
- [ ] Restaurant partner dashboard

---

## 🧪 Testing

Includes basic testing setup:
- Vitest for unit tests
- React Testing Library
- Component tests
- Frontend-only testing

**Note**: Tests are for frontend components only, not backend functionality.

---

## 🎨 Design Features

- Modern, clean interface
- Card-based layouts
- Smooth animations
- Mobile-first responsive design
- Professional color scheme
- Intuitive navigation

---

## 📄 License

MIT License - Portfolio/Learning Project

---

## 👤 Author

**Unni T A**  
Frontend Developer specializing in React/Next.js and AI integration

- GitHub: [@unnita1235](https://github.com/unnita1235)
- Email: unnita1235@gmail.com

---

## 🙏 Acknowledgments

- Google Genkit team for AI framework
- Next.js for excellent framework
- Vercel for easy deployment
- shadcn/ui for component library
- Tailwind CSS for styling

---

## 💡 What I Learned

This project showcases:
- Successfully integrating AI (Google Gemini) into web apps
- Building responsive, modern UIs
- State management with React Context
- Next.js App Router and Server Actions
- TypeScript for type safety
- Professional component architecture

Currently learning backend development to make this a complete full-stack application!

---

**Status**: ✅ Working frontend with AI - Backend in development

*Last updated: January 2026*
