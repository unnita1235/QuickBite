# 🎯 SIMPLE Guide: Add Secrets to GitHub

## What Are Secrets?

Secrets are passwords/keys that GitHub needs to:
- Deploy your app to Vercel
- Use your Google AI API

**Think of it like:** Giving GitHub the keys to your house so it can deliver packages.

---

## What You Need (4 Things)

You need to get 4 secret values and add them to GitHub. Here's where to get each one:

### 1. VERCEL_TOKEN (Like a password for Vercel)
- Go to: **https://vercel.com/account/tokens**
- Click **"Create Token"**
- Name it: `GitHub Actions`
- **Copy the token** (looks like: `vercel_abc123xyz...`)
- **Save it somewhere** - you'll need it in a minute!

### 2. VERCEL_ORG_ID (Your Vercel account ID)
- Go to: **https://vercel.com/account/general**
- Find **"Team ID"** (might say "Organization ID")
- **Copy it** (looks like: `team_abc123` or just a username)

### 3. VERCEL_PROJECT_ID (Your project's ID)
- Go to: **https://vercel.com/dashboard**
- Click on your **QuickBite project**
- Click **Settings** → **General**
- Find **"Project ID"**
- **Copy it** (looks like: `prj_abc123xyz`)

### 4. GOOGLE_GENAI_API_KEY (Your Google AI key)
- Go to: **https://aistudio.google.com/app/apikey**
- **Copy your API key** (you should already have this)
- If you don't have one, click "Create API Key"

---

## How to Add Secrets to GitHub

### **Method 1: Easy Way (Web Browser - Recommended!)**

1. **Open your browser** and go to:
   ```
   https://github.com/unnita1235/QuickBite/settings/secrets/actions
   ```

2. You'll see a page that says "Secrets" with a button **"New repository secret"**

3. **Click "New repository secret"** 4 times (once for each secret):

   **First Secret:**
   - Name: `VERCEL_TOKEN`
   - Value: Paste your Vercel token (from step 1 above)
   - Click **"Add secret"**

   **Second Secret:**
   - Click "New repository secret" again
   - Name: `VERCEL_ORG_ID`
   - Value: Paste your Vercel Org ID (from step 2 above)
   - Click **"Add secret"**

   **Third Secret:**
   - Click "New repository secret" again
   - Name: `VERCEL_PROJECT_ID`
   - Value: Paste your Vercel Project ID (from step 3 above)
   - Click **"Add secret"**

   **Fourth Secret:**
   - Click "New repository secret" again
   - Name: `GOOGLE_GENAI_API_KEY`
   - Value: Paste your Google AI API key (from step 4 above)
   - Click **"Add secret"**

4. **Done!** ✅ You should now see 4 secrets listed on that page.

---

### **Method 2: Using PowerShell Script (Advanced)**

**ONLY use this if you already have GitHub CLI installed.**

1. Install GitHub CLI (if not installed):
   ```powershell
   winget install --id GitHub.cli
   ```

2. Login to GitHub:
   ```powershell
   gh auth login
   ```
   (Follow the prompts - it will open a browser)

3. Run the script:
   ```powershell
   powershell -ExecutionPolicy Bypass -File scripts/add-github-secrets.ps1
   ```

4. It will ask you for each secret value - paste them when prompted.

---

## 🎉 After Adding Secrets

Once all 4 secrets are added:

1. **Push any change to GitHub:**
   ```bash
   git add .
   git commit -m "Test deployment"
   git push origin main
   ```

2. **Check if it works:**
   - Go to: https://github.com/unnita1235/QuickBite/actions
   - You should see a workflow running
   - It should deploy to Vercel automatically!

---

## Still Confused?

**Just use Method 1 (Web Browser)** - it's the easiest!

1. Open: https://github.com/unnita1235/QuickBite/settings/secrets/actions
2. Get your 4 secret values (from the links above)
3. Click "New repository secret" 4 times
4. Paste each value
5. Done!

**That's it!** 🎉

---

## Quick Checklist

Before adding secrets, make sure you have:
- [ ] Vercel account (https://vercel.com)
- [ ] GitHub account (you already have this)
- [ ] Google AI API key (https://aistudio.google.com/app/apikey)

After adding secrets:
- [ ] 4 secrets appear in GitHub settings
- [ ] Push a change to test
- [ ] Check GitHub Actions to see deployment

---

**Need help?** The easiest way is Method 1 - just use your web browser! 🌐

