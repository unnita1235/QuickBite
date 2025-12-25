# 🔑 Getting Vercel Credentials

Follow these steps to get the required values for GitHub Secrets:

## Step 1: Get Vercel Token

1. Go to: https://vercel.com/account/tokens
2. Click **"Create Token"**
3. Name it: `GitHub Actions` (or any name you prefer)
4. Click **"Create"**
5. **Copy the token immediately** - you won't see it again!
6. Save it somewhere safe (you'll need it for GitHub Secrets)

## Step 2: Get Vercel Organization ID

1. Go to: https://vercel.com/account/general
2. Look for **"Team ID"** or **"Organization ID"**
3. Copy the ID (it looks like: `team_xxxxxxxxxxxxx`)

**Alternative method:**
- If you're using a personal account, the org ID might be your username
- Check your Vercel project settings for the organization name

## Step 3: Get Vercel Project ID

### Method 1: From Vercel Dashboard
1. Go to your project in Vercel: https://vercel.com/dashboard
2. Click on your project (QuickBite)
3. Go to **Settings** → **General**
4. Scroll down to find **"Project ID"**
5. Copy it (it looks like: `prj_xxxxxxxxxxxxx`)

### Method 2: Using Vercel CLI
```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Login to Vercel
vercel login

# Link your project (if not already linked)
vercel link

# This will show your project ID
```

### Method 3: From Project URL
- If your project URL is: `https://vercel.com/your-username/quickbite`
- The project name is usually visible in the URL or project settings

## Step 4: Get Google AI API Key

1. Go to: https://aistudio.google.com/app/apikey
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the API key
5. Save it securely

---

## Quick Checklist

Before adding to GitHub Secrets, make sure you have:

- [ ] Vercel Token (from Step 1)
- [ ] Vercel Organization ID (from Step 2)
- [ ] Vercel Project ID (from Step 3)
- [ ] Google AI API Key (from Step 4)

---

## Next Steps

Once you have all these values, go to:
**https://github.com/unnita1235/QuickBite/settings/secrets/actions**

And add them as secrets (see `DEPLOYMENT.md` for detailed instructions).

