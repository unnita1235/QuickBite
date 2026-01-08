# QuickBite 🍕

<div align="center">
  
  ![Status](https://img.shields.io/badge/Status-Live-success?style=for-the-badge&logo=statuspage)
  ![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge&logo=open-source-initiative)
  [![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel&style=for-the-badge)](https://quick-bite-mu.vercel.app)
  [![Render](https://img.shields.io/badge/Render-Backend-46E3B7?logo=render&style=for-the-badge)](https://quickbite-backend-zsdz.onrender.com)

  <br />
  <br />

  **A premium, full-stack food delivery platform engineering for performance and scale.**
  
  [**🚀 View Live Demo**](https://quick-bite-mu.vercel.app) · [**🔌 Explore API**](https://quickbite-backend-zsdz.onrender.com) · [**🐞 Report Issue**](https://github.com/unnita1235/QuickBite/issues)

  <br />

  <img src="screenshots/home.png" alt="Home" width="45%" style="border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); margin-right: 10px;" />
  <img src="screenshots/login.png" alt="Login" width="45%" style="border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);" />

</div>

---

## 🏗 Architecture & Tech Stack

This project leverages a decoupled **Client-Server** architecture to ensure scalability and security.

<div align="center">

| **Frontend** | **Backend** | **Infrastructure** |
| :---: | :---: | :---: |
| ![Next.js](https://img.shields.io/badge/Next.js_15-black?style=flat-square&logo=next.js&logoColor=white) | ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white) | ![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white) |
| ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white) | ![Express](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white) | ![Render](https://img.shields.io/badge/Render-46E3B7?style=flat-square&logo=render&logoColor=white) |
| ![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white) | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white) | ![Neon](https://img.shields.io/badge/Neon_DB-green?style=flat-square&logo=postgresql&logoColor=white) |
| ![Shadcn](https://img.shields.io/badge/Shadcn/UI-000000?style=flat-square&logo=shadcnui&logoColor=white) | ![JWT](https://img.shields.io/badge/JWT_Auth-FB005B?style=flat-square&logo=jsonwebtokens&logoColor=white) | ![GitHub](https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat-square&logo=github-actions&logoColor=white) |

</div>

<br />

```mermaid
graph LR
    subgraph Client
        Browser["Browsers"]
        Mobile["Mobile Devices"]
    end
    
    subgraph Cloud
        Frontend["Next.js App\n(Vercel)"]
        Backend["Express API\n(Render)"]
        DB[("PostgreSQL\n(Neon)")]
        AI["Genkit AI\n(Google)"]
    end

    Browser -->|HTTPS| Frontend
    Frontend -->|REST| Backend
    Backend -->|SQL| DB
    Backend -.->|RPC| AI
```

---

## ✨ Features Overview

QuickBite is designed to provide a cohesive experience from discovery to delivery.

| Feature | Description |
| :--- | :--- |
| **🔍 AI-Ready Search** | Search restaurants by name or description. Codebase includes `Genkit` hooks for future NLP upgrades. |
| **🛍️ Smart Cart** | Persistent shopping cart with real-time total calculation and quantity management. |
| **⚡ Instant UI** | Built with Next.js 15 Server Components and Client interactivity for sub-second page loads. |
| **🔐 Secure Auth** | Full registration/login flow using `bcrypt` hashing and JWT tokens backed by secure cookies. |
| **📱 Responsive** | A "Glassmorphism" inspired UI that looks perfect on iPhone, iPad, and Desktop. |
| **📊 Real Data** | Seeded with realistic restaurant data, menus, and ratings for a production-like feel. |

---

## 🚀 Getting Started

<details>
<summary><strong>👇 Click here to view Setup Instructions</strong></summary>

### 1. Clone & Install
```bash
git clone https://github.com/unnita1235/QuickBite.git
cd QuickBite
npm install
cd server && npm install
```

### 2. Configure Environment
Create `.env.local` (Frontend) and `server/.env` (Backend).

**Frontend (.env.local):**
```bash
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

**Backend (server/.env):**
```bash
DATABASE_URL=postgresql://user:pass@host/db
JWT_SECRET=your_secret
PORT=3000
```

### 3. Run Locally
```bash
# Terminal 1 (Frontend)
npm run dev

# Terminal 2 (Backend)
cd server && npm run dev
```
</details>

---

## 📂 Repository Structure

```
QuickBite/
├── src/
│   ├── app/            # Next.js App Router (Pages)
│   ├── components/     # UI Components (SEARCHBAR, CARDS)
│   ├── hooks/          # Custom React Hooks
│   └── lib/            # Utilities (API clients)
├── server/
│   ├── src/
│   │   ├── routes/     # API Endpoints (Auth, Orders)
│   │   └── index.js    # Server Entry Point
│   └── migrations/     # Database Schema
└── docs/               # Archived Documentation
```

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/NewFeature`)
3.  Commit your Changes
4.  Push to the Branch
5.  Open a Pull Request

---

<div align="center">
  <p>Distributed under the MIT License. See LICENSE for more information.</p>
  <sub>Built with ❤️ by <a href="https://github.com/unnita1235">Unnita</a></sub>
</div>
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-18-green?style=for-the-badge)
![Deployment](https://img.shields.io/badge/Deployed-Vercel%20%2B%20Render-blue?style=for-the-badge)

**A professional, full-stack food delivery application designed for the modern web.**

[**🚀 Launch Live Demo**](https://quick-bite-mu.vercel.app) · [**🔌 View API**](https://quickbite-backend-zsdz.onrender.com) · [**🐞 Report Bug**](https://github.com/unnita1235/QuickBite/issues)

---

<div align="center">
  <img src="screenshots/home.png" alt="QuickBite Home" width="45%" style="border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
  <img src="screenshots/login.png" alt="QuickBite Login" width="45%" style="border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
</div>

## 📖 About The Project

QuickBite bridges the gap between hungry users and local culinary gems. Unlike simple clones, this project is engineered as a **production-grade e-commerce template**, featuring a decoupled Client-Server architecture, secure authentication, and a scalable database design.

> **💡 AI-Ready Infrastructure:**  
> The backend is pre-configured with **Google Genkit (Gemini 2.0 Flash)** SDK. While the current search is powered by optimized PostgreSQL text queries, the system is ready to enable natural-language discovery (e.g., *"Show me spicy vegan options under $20"*) with a single config flag.

### 🏗 Architecture

```mermaid
graph TD
    User((👤 User))
    Frontend[💻 Next.js 15 Frontend\nVercel]
    Backend[⚙️ Express Backend\nRender]
    DB[(🗄️ PostgreSQL\nNeon Cloud)]
    Genkit[🤖 Google Genkit\n(AI Layer)]

    User -->|Browser| Frontend
    Frontend -->|REST API| Backend
    Backend -->|Query| DB
    Backend -.->|Prompt| Genkit
```

---

## ✨ Key Features

*   **⚡ Lightning Fast**: Built on Next.js 15 App Router for optimal performance and SEO.
*   **🛒 Seamless Cart**: Robust Redux-like state management for a smooth shopping experience.
*   **🔒 Enterprise Security**: HttpOnly Cookies, JWT Rotation, and Bcrypt password hashing.
*   **📱 Mobile First**: Fully responsive UI designed with Tailwind CSS and Radix Primitives.
*   **🔎 Smart Search**: Optimized database queries delivering instant results.

---

## 🛠️ Tech Stack

### Frontend
*   **Framework**: Next.js 15
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS, Shadcn/ui
*   **State**: React Hooks (Context API)

### Backend
*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Database**: PostgreSQL
*   **ORM**: `pg` (Native Client)

---

## 🚀 Getting Started

<details>
<summary><strong>Click to view Installation Steps</strong></summary>

### Prerequisites
*   Node.js 18+
*   PostgreSQL Database

### 1. Clone & Install
```bash
git clone https://github.com/unnita1235/QuickBite.git
cd QuickBite
npm install
cd server && npm install
```

### 2. Configure Environment
Create `.env.local` (Frontend) and `server/.env` (Backend) using the provided examples.

### 3. Run Locally
```bash
# Terminal 1
npm run dev

# Terminal 2
cd server && npm run dev
```
</details>

---

## 📂 Project Structure

| Path | Description |
| :--- | :--- |
| `src/app` | Next.js App Router pages |
| `src/components` | Reusable UI components |
| `server/src` | Express backend logic |
| `server/migrations` | Database schema & migrations |

---

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/unnita1235">Unnita</a></sub>
</div>
