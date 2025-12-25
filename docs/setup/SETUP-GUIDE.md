# 🚀 Step-by-Step Setup Guide

Follow these steps to complete your deployment automation setup.

---

## ✅ Step 1: Verify Files Are Ready

First, let's make sure all the automation files are in place:

```bash
# On Windows (PowerShell)
powershell -ExecutionPolicy Bypass -File scripts/verify-setup.ps1

# On Mac/Linux
bash scripts/verify-setup.sh
```

Or manually check:
- ✅ `.github/workflows/ci.yml` exists
- ✅ `.github/workflows/preview.yml` exists
- ✅ `vercel.json` exists
- ✅ `DEPLOYMENT.md` exists

---

## 🔑 Step 2: Get Vercel Credentials

You need 3 values from Vercel. See `scripts/get-vercel-info.md` for detailed instructions.

### Quick Links:

1. **Vercel Token**: https://vercel.com/account/tokens
   - Click "Create Token"
   - Name: `GitHub Actions`
   - Copy the token (save it!)

2. **Vercel Organization ID**: https://vercel.com/account/general
   - Find "Team ID" or "Organization ID"
   - Copy it

3. **Vercel Project ID**: 
   - Go to your Vercel project dashboard
   - Settings → General
   - Find "Project ID"
   - Copy it

---

## 🔐 Step 3: Add GitHub Secrets

**Go to:** https://github.com/unnita1235/QuickBite/settings/secrets/actions

Click **"New repository secret"** and add each one:

### Secret 1: VERCEL_TOKEN
- **Name:** `VERCEL_TOKEN`
- **Value:** (paste your Vercel token from Step 2)
- Click **"Add secret"**

### Secret 2: VERCEL_ORG_ID
- **Name:** `VERCEL_ORG_ID`
- **Value:** (paste your Organization ID from Step 2)
- Click **"Add secret"**

### Secret 3: VERCEL_PROJECT_ID
- **Name:** `VERCEL_PROJECT_ID`
- **Value:** (paste your Project ID from Step 2)
- Click **"Add secret"**

### Secret 4: GOOGLE_GENAI_API_KEY
- **Name:** `GOOGLE_GENAI_API_KEY`
- **Value:** (your Google AI API key from https://aistudio.google.com/app/apikey)
- Click **"Add secret"**

**✅ Verify:** You should now see 4 secrets listed.

---

## 🌐 Step 4: Configure Vercel Environment Variables

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Click **"Add New"**
4. Add:
   - **Key:** `GOOGLE_GENAI_API_KEY`
   - **Value:** (your Google AI API key)
   - **Environment:** Select all (Production, Preview, Development)
5. Click **"Save"**

---

## 📤 Step 5: Commit and Push

Now let's commit all the changes and push to trigger the automation:

```bash
# Check what files changed
git status

# Add all new files
git add .

# Commit with a descriptive message
git commit -m "Setup deployment automation with GitHub Actions"

# Push to GitHub
git push origin main
```

---

## 🎉 Step 6: Watch It Work!

After pushing, check:

1. **GitHub Actions**: https://github.com/unnita1235/QuickBite/actions
   - You should see a workflow running
   - Click on it to see progress
   - All checks should pass ✅

2. **Vercel Dashboard**: https://vercel.com/dashboard
   - A new deployment should appear
   - It will deploy automatically after tests pass

---

## 🐛 Troubleshooting

### ❌ Workflow Fails: "VERCEL_TOKEN not found"
- **Fix:** Make sure you added `VERCEL_TOKEN` to GitHub Secrets
- **Check:** Go to Settings → Secrets → Actions and verify it's there

### ❌ Workflow Fails: "Build failed"
- **Fix:** Check if `GOOGLE_GENAI_API_KEY` is set in GitHub Secrets
- **Note:** For build checks, a dummy key is used, but production needs the real one

### ❌ Tests Fail in CI
- **Fix:** Run `npm ci` locally (not `npm install`) to match CI
- **Check:** Make sure all tests pass locally first: `npm test -- --run`

### ❌ Vercel Deployment Fails
- **Fix:** Verify all 3 Vercel secrets are correct
- **Check:** Try creating a new Vercel token if the old one doesn't work

---

## ✅ Success Checklist

Before pushing, make sure:

- [ ] All 4 GitHub Secrets are added
- [ ] Vercel environment variable is set
- [ ] All files are committed (`git status` shows clean)
- [ ] You're pushing to `main` branch
- [ ] Tests pass locally (`npm test -- --run`)

---

## 📞 Need Help?

If you get stuck:

1. Check the error message in GitHub Actions
2. See `DEPLOYMENT.md` for detailed troubleshooting
3. Verify all secrets are correctly named (case-sensitive!)
4. Make sure you're using the correct branch (`main` or `master`)

---

**Ready? Let's push!** 🚀

