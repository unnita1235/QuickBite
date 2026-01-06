# QuickBite 🍕

> **AI-Powered Restaurant Discovery Platform**
>
> A full-stack web application that leverages Google Gemini AI to provide intelligent restaurant recommendations and natural language search capabilities.

---

## ✨ Overview

QuickBite is a modern, responsive restaurant discovery platform designed to help users find their next favorite dining experience. With AI-powered search and intelligent recommendations, QuickBite makes discovering restaurants effortless and enjoyable.

**Live Application:** [https://quick-bite-mu.vercel.app](https://quick-bite-mu.vercel.app)  
**Backend API:** [https://quickbite-backend-zsdr.onrender.com/api](https://quickbite-backend-zsdr.onrender.com/api)

---

## 🚀 Key Features

✅ **AI-Powered Search** - Natural language restaurant search with Google Gemini integration  
✅ **Real-time Ratings** - Live restaurant ratings and delivery time estimates  
✅ **Responsive Design** - Mobile-first responsive interface for all devices  
✅ **Restaurant Browsing** - Elegant card-based restaurant discovery interface  
✅ **JWT Authentication** - Secure user authentication and authorization  
✅ **Production Ready** - Fully deployed and optimized for production environments

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** Next.js 15 + TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn/ui
- **State Management:** React Hooks
- **API Client:** Axios
- **Deployment:** Vercel

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT
- **API Documentation:** OpenAPI/Swagger
- **Deployment:** Render

### AI & APIs
- **AI Integration:** Google Gemini API
- **API Testing:** Postman Collections Included

---

## 📋 Prerequisites

Before getting started, ensure you have:

- **Node.js** 18+ installed
- **npm** or **yarn** package manager
- **PostgreSQL** database
- **Google Gemini API** key
- Code editor (VS Code recommended)

---

## ⚙️ Installation & Setup

### 1. Clone Repository
```bash
git clone https://github.com/unnita1235/QuickBite.git
cd QuickBite
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
```bash
cp .env.example .env.local
```

Update `.env.local` with:
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/quickbite

# Frontend API
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Google Gemini API
GOOGLE_GENAI_API_KEY=your_gemini_api_key

# JWT Secret
JWT_SECRET=your_jwt_secret_key
```

### 4. Database Setup
```bash
# Run migrations
cd server && npx prisma migrate dev
```

### 5. Start Development Servers

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
cd server && npm run dev
```

Access the application at `http://localhost:3000`

---

## 🧪 Testing

### Run Unit Tests
```bash
npm run test
```

### Run Integration Tests
```bash
npm run test:integration
```

### Run E2E Tests with Playwright
```bash
npm run test:e2e
```

### Code Coverage
```bash
npm run test:coverage
```

---

## 📦 Build & Deployment

### Build for Production
```bash
npm run build
```

### Verify Build
```bash
npm run lint
npm run type-check
```

### Production Deployment

The application is configured for:
- **Frontend:** Vercel (automatic deployments from main branch)
- **Backend:** Render (automatic deployments from main branch)
- **Database:** PostgreSQL (Neon)

---

## 📁 Project Structure

```
QuickBite/
├── src/                      # Frontend source code
│   ├── app/                  # Next.js app router
│   ├── components/           # React components
│   ├── lib/                  # Utilities and helpers
│   └── types/                # TypeScript type definitions
├── server/                   # Backend source code
│   ├── middleware/           # Express middleware
│   ├── routes/               # API routes
│   ├── controllers/          # Route controllers
│   ├── models/               # Database models (Prisma)
│   └── config/               # Configuration files
├── public/                   # Static assets
└── docs/                     # Documentation
```

---

## 🔒 Security Features

- ✅ JWT Token-based Authentication
- ✅ Password Hashing with bcrypt
- ✅ CORS Protection
- ✅ Rate Limiting on API Endpoints
- ✅ SQL Injection Prevention (Prisma ORM)
- ✅ XSS Protection
- ✅ Environment Variable Security

---

## 📊 Performance Metrics

- **Lighthouse Score:** 90+
- **Core Web Vitals:** All Green
- **Bundle Size:** < 250KB (gzipped)
- **API Response Time:** < 200ms average
- **Database Queries:** Optimized with indexes

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Unnita** - Full-Stack Developer

- GitHub: [@unnita1235](https://github.com/unnita1235)
- Portfolio: [Quick-Bite Live](https://quick-bite-mu.vercel.app)

---

## 🙏 Acknowledgments

- Google Gemini API for AI capabilities
- Next.js and Vercel for excellent deployment platform
- Render for reliable backend hosting
- Open source community for amazing tools and libraries

---

**Made with ❤️ by Unnita**
