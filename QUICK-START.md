# ⚡ Quick Start - Add Secrets & Deploy

## 🎯 What You Need (5 minutes)

### 1️⃣ Get Vercel Token (1 min)
👉 https://vercel.com/account/tokens
- Click "Create Token"
- Name: `GitHub Actions`
- **Copy it!** (you won't see it again)

### 2️⃣ Get Vercel IDs (2 min)
👉 https://vercel.com/account/general
- Copy **Team ID** (this is your Org ID)

👉 Your Vercel Project → Settings → General
- Copy **Project ID**

### 3️⃣ Add GitHub Secrets (2 min)
👉 https://github.com/unnita1235/QuickBite/settings/secrets/actions

Click "New repository secret" 4 times:

| Name | Value |
|------|-------|
| `VERCEL_TOKEN` | (from step 1) |
| `VERCEL_ORG_ID` | (from step 2) |
| `VERCEL_PROJECT_ID` | (from step 2) |
| `GOOGLE_GENAI_API_KEY` | (your existing API key) |

### 4️⃣ Push to GitHub
```bash
git add .
git commit -m "Setup deployment automation"
git push origin main
```

### 5️⃣ Watch It Deploy! 🎉
👉 https://github.com/unnita1235/QuickBite/actions

---

## ✅ That's It!

Your app will automatically deploy every time you push to `main`!

---

**Need more details?** See `SETUP-GUIDE.md`

