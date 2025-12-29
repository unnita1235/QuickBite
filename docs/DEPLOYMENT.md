# QuickBite Deployment Guide

## 🚀 Deployment Overview

QuickBite is configured for deployment on Vercel with Next.js 15. The application is production-ready with full frontend-backend integration.

## ✅ Pre-Deployment Checklist

### 1. Code Quality
- [x] TypeScript check passes (`npm run typecheck`)
- [x] Build successful (`npm run build`)
- [x] All tests pass
- [x] No critical errors or warnings
- [x] Code committed to Git

### 2. Environment Variables
- [x] `.env.local` created (local development)
- [ ] `GOOGLE_GENAI_API_KEY` added to Vercel (production)

### 3. Configuration Files
- [x] `vercel.json` configured
- [x] `next.config.ts` optimized
- [x] `package.json` scripts ready
- [x] `.gitignore` properly configured

---

## 📋 Deployment Methods

### Method 1: Vercel Dashboard (Recommended)

#### Step 1: Connect Repository
1. Visit [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository: `unnita1235/QuickBite`
4. Vercel will auto-detect Next.js framework

#### Step 2: Configure Project
The project is pre-configured via `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"]
}
```

No additional configuration needed in the dashboard!

#### Step 3: Add Environment Variables
In Vercel Project Settings → Environment Variables:

**Required:**
- `GOOGLE_GENAI_API_KEY` = `your_actual_api_key_here`
  - Get from: https://aistudio.google.com/app/apikey
  - Environment: Production, Preview, Development (all three)

**Note:** The `vercel.json` references `@google_genai_api_key` which links to the secret stored in your Vercel account.

#### Step 4: Deploy
1. Click "Deploy"
2. Wait 2-3 minutes for build
3. Visit your deployment URL
4. Test all features

---

### Method 2: Vercel CLI

#### Prerequisites
```bash
npm install -g vercel
```

#### Commands
```bash
# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Set environment variables
vercel env add GOOGLE_GENAI_API_KEY
```

---

## 🔧 Vercel Configuration Details

### Build Settings
- **Framework**: Next.js 15.3.3
- **Build Command**: `npm run build`
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm install`
- **Development Command**: `npm run dev`

### Performance Settings
- **Region**: `iad1` (US East)
- **Node.js Version**: 20.x (auto-detected from engines)
- **Edge Runtime**: Not used (using Node.js runtime)

### Environment Variables

| Variable | Description | Required | Where to Get |
|----------|-------------|----------|--------------|
| `GOOGLE_GENAI_API_KEY` | Google Gemini API key for AI features | Yes* | [Google AI Studio](https://aistudio.google.com/app/apikey) |

*Required for AI search features. Core app works without it.

---

## 🌐 Post-Deployment Verification

### 1. Test Core Features
After deployment, verify:

**Without API Key:**
- [ ] Homepage loads with all 6 restaurants
- [ ] Restaurant detail pages work
- [ ] Menu items display with prices
- [ ] Shopping cart functionality
- [ ] Checkout page accessible
- [ ] Order confirmation page
- [ ] Text-based search works

**With API Key:**
- [ ] AI-powered search works
- [ ] Restaurant recommendations appear
- [ ] Natural language queries work
- [ ] Error handling for API failures

### 2. Performance Check
```bash
# Use Lighthouse or similar tools
# Target Scores:
# - Performance: 90+
# - Accessibility: 95+
# - Best Practices: 90+
# - SEO: 95+
```

### 3. Check Server Logs
In Vercel Dashboard → Deployment → Functions Logs:
- No critical errors
- API calls working (if key configured)
- Proper error handling visible

---

## 🐛 Troubleshooting

### Issue: Build Fails

**Symptoms:**
- "Module not found" errors
- TypeScript errors
- Dependency issues

**Solutions:**
```bash
# Clear build cache
rm -rf .next node_modules
npm install
npm run build

# Check Node.js version
node --version  # Should be 20.x

# Verify dependencies
npm audit fix
```

### Issue: API Key Not Working

**Symptoms:**
- "AI Search Unavailable" alert
- No recommendations showing
- 403/401 errors in logs

**Solutions:**
1. Verify API key is valid: https://aistudio.google.com/app/apikey
2. Check Environment Variables in Vercel dashboard
3. Ensure key is set for all environments (Production, Preview, Development)
4. Redeploy after adding environment variable
5. Check API quota limits in Google AI Studio

### Issue: Images Not Loading

**Symptoms:**
- Broken image placeholders
- 403 errors for image domains

**Solutions:**
1. Check `next.config.ts` has proper domains:
```typescript
images: {
  remotePatterns: [
    { hostname: 'picsum.photos' },
    { hostname: 'images.unsplash.com' },
    { hostname: 'placehold.co' }
  ]
}
```
2. Redeploy after config changes

### Issue: Routes Not Found (404)

**Symptoms:**
- Direct URL access gives 404
- Routes work in development but not production

**Solutions:**
1. Ensure dynamic routes are properly configured
2. Check `generateStaticParams` in `/restaurants/[id]/page.tsx`
3. Verify build output shows all routes generated
4. Clear Vercel build cache and redeploy

### Issue: Environment Variables Not Loading

**Symptoms:**
- `process.env.GOOGLE_GENAI_API_KEY` is undefined
- "API key missing" errors

**Solutions:**
1. Ensure variable name matches exactly (case-sensitive)
2. Redeploy after adding/changing environment variables
3. Check `.env.local` is NOT committed to Git
4. Verify `vercel.json` env mapping is correct

---

## 📊 Build Output Reference

### Successful Build
```
Route (app)                              Size  First Load JS
┌ ○ /                                 5.27 kB         122 kB
├ ○ /_not-found                         977 B         102 kB
├ ○ /checkout                         1.25 kB         123 kB
├ ○ /confirmation                     1.01 kB         123 kB
└ ● /restaurants/[id]                 3.08 kB         117 kB
    ├ /restaurants/1
    ├ /restaurants/2
    ├ /restaurants/3
    └ [+3 more paths]

○  (Static)  prerendered as static content
●  (SSG)     prerendered as static HTML (uses generateStaticParams)
```

### Build Warnings (Non-Critical)
- Handlebars webpack warnings (from Genkit dependency - safe to ignore)
- ESLint circular structure warning (Next.js 15 known issue - safe to ignore)

---

## 🔒 Security Checklist

- [x] `.env.local` in `.gitignore`
- [x] API keys not committed to repository
- [x] Vercel environment variables encrypted
- [x] HTTPS enabled (automatic on Vercel)
- [x] No sensitive data in client-side code
- [x] Error messages don't expose internals
- [x] Dependencies up to date (run `npm audit`)

---

## 📈 Monitoring & Analytics

### Vercel Analytics
Enable in Vercel Dashboard → Analytics:
- Page views
- Unique visitors
- Top pages
- Performance metrics

### Error Tracking
Built-in error handling:
- React Error Boundaries (`ErrorBoundary.tsx`)
- Server-side error logging
- Client-side console errors
- Graceful degradation for API failures

---

## 🔄 CI/CD Pipeline

### Automatic Deployments
Vercel automatically deploys:
- **Production**: On push to `main` branch
- **Preview**: On pull requests
- **Development**: On push to other branches

### Manual Deployment
```bash
# From any branch
vercel --prod

# Force fresh build
vercel --prod --force
```

---

## 📝 Deployment Commands Cheat Sheet

```bash
# Local testing
npm run dev              # Start dev server
npm run build            # Production build
npm run start            # Start production server
npm run typecheck        # Type checking
npm run lint             # Linting

# Vercel deployment
vercel                   # Deploy preview
vercel --prod            # Deploy production
vercel env ls            # List environment variables
vercel env add           # Add environment variable
vercel env rm            # Remove environment variable
vercel logs              # View deployment logs
vercel domains           # Manage custom domains

# Debugging
vercel --debug           # Deploy with debug output
vercel inspect           # Inspect deployment
```

---

## 🎯 Performance Optimization

### Already Implemented
- ✅ Next.js Image Optimization
- ✅ Static page generation (SSG)
- ✅ Code splitting
- ✅ Turbopack in development
- ✅ Font optimization (Google Fonts)
- ✅ CSS optimization (Tailwind)
- ✅ Debounced search (500ms)
- ✅ LocalStorage caching (cart)

### Optional Enhancements
- [ ] Add ISR (Incremental Static Regeneration)
- [ ] Implement Redis caching for AI results
- [ ] Add service worker for offline support
- [ ] Implement CDN for static assets
- [ ] Add response compression

---

## 🌍 Custom Domain Setup

### Add Custom Domain
1. Go to Vercel Dashboard → Project → Domains
2. Add your domain (e.g., `quickbite.com`)
3. Configure DNS records as shown
4. Wait for DNS propagation (5-60 minutes)
5. SSL certificate auto-generated

### DNS Records Example
```
Type    Name    Value
A       @       76.76.21.21
CNAME   www     cname.vercel-dns.com
```

---

## 📞 Support & Resources

### Documentation
- **QuickBite Setup**: `docs/SETUP-GUIDE.md`
- **Development**: `DEVELOPMENT.md`
- **Testing**: `TESTING.md`

### External Resources
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Google Genkit Docs](https://firebase.google.com/docs/genkit)

### Getting Help
- GitHub Issues: https://github.com/unnita1235/QuickBite/issues
- Vercel Support: https://vercel.com/support
- Next.js Discord: https://nextjs.org/discord

---

## ✅ Deployment Verification Checklist

Use this checklist after each deployment:

```
Environment Setup:
[ ] GOOGLE_GENAI_API_KEY added to Vercel
[ ] All environment variables configured
[ ] Build completed successfully
[ ] No critical errors in build logs

Functionality Testing:
[ ] Homepage loads (<2s)
[ ] All restaurant pages accessible
[ ] Search bar functional
[ ] Cart add/remove works
[ ] Checkout flow complete
[ ] AI search works (with API key)
[ ] Error handling displays properly
[ ] Mobile responsiveness good

Performance:
[ ] Lighthouse score >90
[ ] First contentful paint <1.5s
[ ] Time to interactive <3s
[ ] No console errors

Security:
[ ] HTTPS enabled
[ ] No API keys in client code
[ ] Error messages safe
[ ] CSP headers configured

Post-Deployment:
[ ] DNS configured (if custom domain)
[ ] Analytics enabled
[ ] Monitoring set up
[ ] Team notified
```

---

## 🎉 You're Ready!

Your QuickBite application is now deployed and running in production!

**Live URL**: Check your Vercel dashboard for the deployment URL

**Next Steps:**
1. Test all features thoroughly
2. Monitor performance and errors
3. Gather user feedback
4. Iterate and improve

Happy deploying! 🚀
