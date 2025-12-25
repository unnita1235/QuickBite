# 🚀 START HERE - Complete Setup Guide

## What You Need to Do

Add 4 secret values to GitHub so your app can deploy automatically.

---

## 📋 Quick Overview

1. **Get 4 secret values** (from Vercel and Google)
2. **Add them to GitHub** (takes 2 minutes)
3. **Done!** Your app will deploy automatically

---

## 🎯 Step 1: Get the 4 Secret Values

Follow the detailed guide: **`FIND-SECRETS.md`**

**Quick links to get each value:**

1. **VERCEL_TOKEN**
   - Go to: https://vercel.com/account/tokens
   - Click "Create Token" → Name it → Copy it

2. **VERCEL_ORG_ID**
   - Go to: https://vercel.com/account/general
   - Copy "Team ID" or "Organization ID"

3. **VERCEL_PROJECT_ID**
   - Go to: https://vercel.com/dashboard
   - Click your QuickBite project → Settings → General
   - Copy "Project ID"

4. **GOOGLE_GENAI_API_KEY**
   - Go to: https://aistudio.google.com/app/apikey
   - Copy your API key (or create one)

**Write them down before moving to Step 2!**

---

## 🎯 Step 2: Add Secrets to GitHub

1. **Go to:** https://github.com/unnita1235/QuickBite/settings/secrets/actions

2. **Click "New repository secret"** 4 times:

   **First time:**
   - Name: `VERCEL_TOKEN`
   - Value: (paste your Vercel token)
   - Click "Add secret"

   **Second time:**
   - Name: `VERCEL_ORG_ID`
   - Value: (paste your Org ID)
   - Click "Add secret"

   **Third time:**
   - Name: `VERCEL_PROJECT_ID`
   - Value: (paste your Project ID)
   - Click "Add secret"

   **Fourth time:**
   - Name: `GOOGLE_GENAI_API_KEY`
   - Value: (paste your API key)
   - Click "Add secret"

3. **✅ Done!** You should see 4 secrets listed.

---

## 🎉 Step 3: Test It!

Push a change to GitHub and watch it deploy:

```bash
git add .
git commit -m "Test automatic deployment"
git push origin main
```

Then check:
- GitHub Actions: https://github.com/unnita1235/QuickBite/actions
- Vercel Dashboard: https://vercel.com/dashboard

---

## 📚 Need More Help?

- **Can't find the values?** → See `FIND-SECRETS.md`
- **Want simpler instructions?** → See `SIMPLE-SETUP.md`
- **Want to use PowerShell?** → See `ADD-SECRETS-GUIDE.md`

---

## ✅ Checklist

- [ ] Got VERCEL_TOKEN
- [ ] Got VERCEL_ORG_ID
- [ ] Got VERCEL_PROJECT_ID
- [ ] Got GOOGLE_GENAI_API_KEY
- [ ] Added all 4 to GitHub
- [ ] Tested deployment

**That's it! You're done!** 🎊

