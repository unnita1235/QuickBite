# QuickBite 🍕

![Status](https://img.shields.io/badge/Status-Live-success?style=for-the-badge)
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
