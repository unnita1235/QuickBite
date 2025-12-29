# QuickBite Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** 20 or higher
- **npm** or **yarn** package manager
- **Git** for version control

## Step 1: Clone the Repository

```bash
git clone https://github.com/unnita1235/QuickBite.git
cd QuickBite
```

## Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js 15.3.3
- React 18
- TypeScript
- Tailwind CSS
- Google Genkit for AI features
- And all other dependencies

## Step 3: Configure Environment Variables

### Create .env.local file

The project requires a Google Gemini API key for AI-powered restaurant recommendations.

1. **Get your API key:**
   - Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy your API key

2. **Create the environment file:**

The `.env.local` file has already been created for you. Open it and replace `your_api_key_here` with your actual API key:

```bash
# .env.local
GOOGLE_GENAI_API_KEY=your_actual_api_key_here
```

### Important Notes:

- **The `.env.local` file is already in `.gitignore`** and will not be committed to version control
- **AI features require a valid API key** - The search/recommendation feature won't work without it
- **Other features work without the API key:**
  - Browsing restaurants
  - Viewing menus
  - Shopping cart
  - Checkout flow

## Step 4: Build the Project (Optional)

To test if everything is configured correctly:

```bash
npm run build
```

This will create an optimized production build.

## Step 5: Start the Development Server

```bash
npm run dev
```

The application will start on **http://localhost:9002**

### Expected Output:

```
▲ Next.js 15.3.3 (Turbopack)
- Local:        http://localhost:9002
- Network:      http://[your-ip]:9002
- Environments: .env.local

✓ Starting...
✓ Ready in 2.5s
```

## Step 6: Verify the Setup

### Test the Application:

1. **Homepage:** http://localhost:9002
   - Should display all restaurants
   - Search bar should be visible

2. **Restaurant Page:** http://localhost:9002/restaurants/1
   - Should show restaurant details and menu

3. **AI Search (requires API key):**
   - Type a cuisine preference in the search bar (e.g., "sushi", "italian")
   - Wait 500ms for debounced search
   - AI recommendations should appear (if API key is valid)

### Troubleshooting:

#### AI Search Not Working:
- **Error:** "AI Search Unavailable" alert appears
- **Cause:** Invalid or missing API key
- **Solution:**
  1. Check your `.env.local` file
  2. Ensure the API key is correct
  3. Restart the dev server: `Ctrl+C` then `npm run dev`

#### Port Already in Use:
- **Error:** "Port 9002 is already in use"
- **Solution:** Change the port in `package.json`:
  ```json
  "scripts": {
    "dev": "next dev --turbopack -p 3000"
  }
  ```

#### Build Errors:
- **Error:** TypeScript or ESLint errors
- **Solution:** Run type checking:
  ```bash
  npm run typecheck
  npm run lint
  ```

## Backend Connection Architecture

### How the Frontend Connects to the Backend:

```
User Search → Frontend (SearchBar)
              ↓
         Server Action (src/actions/recommend.ts)
              ↓
         Genkit AI Flow (src/ai/flows/recommend-restaurants-by-cuisine.ts)
              ↓
         Google Gemini API (via @genkit-ai/googleai)
              ↓
         Restaurant Recommendations
```

### Key Files:

1. **Frontend Search Component:**
   - `src/components/SearchBar.tsx` - User input with debounce
   - `src/app/page.tsx` - Displays recommendations

2. **Backend API:**
   - `src/actions/recommend.ts` - Server action for AI recommendations
   - `src/ai/flows/recommend-restaurants-by-cuisine.ts` - AI flow logic
   - `src/ai/genkit.ts` - Genkit configuration

3. **Configuration:**
   - `.env.local` - API key storage
   - `next.config.ts` - Next.js configuration

## Testing the Connection

### Manual Testing:

```bash
# 1. Start the dev server
npm run dev

# 2. In another terminal, test endpoints:
curl http://localhost:9002
curl http://localhost:9002/restaurants/1
curl http://localhost:9002/checkout
```

All should return HTTP 200 status.

### Automated Testing:

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm test -- --watch
```

## Production Deployment

### Vercel (Recommended):

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Setup complete"
   git push
   ```

2. **Deploy to Vercel:**
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variable: `GOOGLE_GENAI_API_KEY`
   - Deploy

3. **Verify Deployment:**
   - Test the live URL
   - Check AI search functionality

### Environment Variables in Production:

In Vercel dashboard:
1. Go to Project Settings → Environment Variables
2. Add: `GOOGLE_GENAI_API_KEY` = `your_api_key`
3. Redeploy the application

## Additional Scripts

```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Build for production
npm run build

# Start production server
npm run start

# Run Genkit development server
npm run genkit:dev
```

## Support

For issues or questions:
- **GitHub Issues:** [QuickBite Issues](https://github.com/unnita1235/QuickBite/issues)
- **Documentation:** See `docs/` folder
- **Testing Guide:** See `TESTING.md`
- **Development Guide:** See `DEVELOPMENT.md`

## Summary

✅ **What's Working:**
- All frontend pages (homepage, restaurants, cart, checkout, confirmation)
- Static restaurant data and menu browsing
- Shopping cart functionality
- Responsive design
- Fast page loads with Turbopack

⚠️ **What Requires Setup:**
- Google Gemini API key for AI search/recommendations
- Environment variable configuration

🎉 **You're Ready!**
Once you've set up your API key, all features including AI-powered restaurant recommendations will be fully functional!
