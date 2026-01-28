# QuickBite - AI-Powered Food Delivery Prototype

A web app prototype demonstrating restaurant discovery with basic AI recommendations using Google Gemini. Built as a learning project to explore full-stack development.

**Live Demo:** [https://quick-bite-mu.vercel.app/](https://quick-bite-mu.vercel.app/) (Shows static restaurant list; AI search functional in local dev with API key).

## Overview
QuickBite is an entry-level prototype for a food delivery platform. It features a static list of 6 restaurants with menus, AI-based search for recommendations (e.g., query "spicy noodles" to match descriptions), and a basic cart system using localStorage. Data is hardcoded in src/lib/data.ts, making it suitable for demos but not real use. The project highlights modern web practices but remains incomplete, with planned features like authentication and payments not implemented.

## Key Features
- **Restaurant Browsing:** View hardcoded restaurants with cuisine, ratings (4.2-4.9), descriptions, and delivery estimates (20-45 min).
- **AI Recommendations:** Uses Google Gemini 2.5 Flash via Genkit to suggest matches based on query and static data; basic but operational for simple inputs.
- **Cart Management:** Add/remove items, update quantities; persists in browser storage.
- **Responsive UI:** Mobile-friendly design with Tailwind CSS and shadcn/ui components.
- **Testing:** 80+ Vitest tests with claimed 100% coverage for core functions.

Limitations: No database, user accounts, or real backend persistence; AI limited to static analysis without learning or scalability.

## Tech Stack
- **Frontend:** Next.js 15 (App Router, SSR), React, TypeScript (strict mode), Tailwind CSS, Radix UI/shadcn/ui, Lucide icons.
- **AI/Backend:** Google Genkit, Gemini model, Next.js Server Actions; minimal Express setup (in server/ folder but not fully integrated).
- **Dev Tools:** Vitest + React Testing Library, ESLint, GitHub Actions for CI/CD, Vercel deployment.
- **Dependencies:** From package.json - next@^15, typescript@^5, tailwindcss@^3, @genkit-ai/core, lucide-react, etc.

## Setup Instructions
1. Clone: `git clone https://github.com/unnita1235/QuickBite.git`
2. Install: `npm install`
3. Env: Copy .env.example to .env.local; add GOOGLE_GENAI_API_KEY (free from Google AI Studio).
4. Run: `npm run dev` (localhost:3000)
5. Test: `npm test`

For AI to work, ensure valid API key; demo uses static fallback.

## Project Structure
- **src/app:** Pages and layouts (e.g., page.tsx for home, [id]/page.tsx for details).
- **src/actions:** Server logic (recommend.ts handles AI queries with try-catch error handling).
- **src/components:** Reusable UI (RestaurantCard.tsx, CartSheet.tsx).
- **src/hooks:** State management (useCart.tsx with useState/effect for localStorage).
- **src/lib:** Data and utils (data.ts with static arrays).
- **src/ai:** Genkit config (genkit.ts sets up model).
- **docs:** Architecture notes, testing reports.
- **server:** Basic Express setup (not fully connected in current build).

Code Style: Modular with separation of concerns; async/await for promises; basic error logging. 158 commits show iterative fixes (e.g., backend deployment on Jan 8, 2026).

## Roadmap
- Add authentication and user profiles.
- Integrate Stripe for payments.
- Implement real database (MongoDB) for dynamic data.
- Add order tracking and admin dashboard.
- Enhance AI with more advanced querying.

## Contributions
Fork and PR; follow CONTRIBUTING.md for guidelines. Contributors: unnita1235 (main), claude (AI-assisted docs/code).

License: MIT

*Updated: January 2026*
