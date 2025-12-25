# 🔐 How to Add GitHub Secrets

I cannot directly access your GitHub account to add secrets, but here are **3 easy ways** to do it:

---

## Method 1: Using GitHub Web Interface (Easiest - 2 minutes)

1. **Go to:** https://github.com/unnita1235/QuickBite/settings/secrets/actions

2. **Click "New repository secret"** 4 times and add:

   | Name | Value | Where to Get It |
   |------|-------|-----------------|
   | `VERCEL_TOKEN` | Your token | https://vercel.com/account/tokens → Create Token |
   | `VERCEL_ORG_ID` | Your Team ID | https://vercel.com/account/general → Copy Team ID |
   | `VERCEL_PROJECT_ID` | Your Project ID | Vercel Project → Settings → General → Project ID |
   | `GOOGLE_GENAI_API_KEY` | Your API key | https://aistudio.google.com/app/apikey |

3. **Done!** ✅

---

## Method 2: Using GitHub CLI (If you have it installed)

1. **Install GitHub CLI** (if not installed):
   ```powershell
   winget install --id GitHub.cli
   # OR
   choco install gh
   ```

2. **Authenticate:**
   ```powershell
   gh auth login
   ```

3. **Run the helper script:**
   ```powershell
   powershell -ExecutionPolicy Bypass -File scripts/add-github-secrets.ps1
   ```

4. **Or add manually:**
   ```powershell
   # Get your values first, then:
   echo "your-vercel-token" | gh secret set VERCEL_TOKEN --repo unnita1235/QuickBite
   echo "your-org-id" | gh secret set VERCEL_ORG_ID --repo unnita1235/QuickBite
   echo "your-project-id" | gh secret set VERCEL_PROJECT_ID --repo unnita1235/QuickBite
   echo "your-api-key" | gh secret set GOOGLE_GENAI_API_KEY --repo unnita1235/QuickBite
   ```

---

## Method 3: Quick Copy-Paste Links

### Get Vercel Token
👉 https://vercel.com/account/tokens
- Click "Create Token"
- Name: `GitHub Actions`
- Copy the token

### Get Vercel Org ID
👉 https://vercel.com/account/general
- Find "Team ID" or "Organization ID"
- Copy it

### Get Vercel Project ID
👉 Go to your Vercel project dashboard
- Settings → General
- Find "Project ID"
- Copy it

### Get Google AI API Key
👉 https://aistudio.google.com/app/apikey
- Use your existing API key (or create new one)
- Copy it

### Add to GitHub
👉 https://github.com/unnita1235/QuickBite/settings/secrets/actions
- Click "New repository secret" for each one
- Paste the values

---

## ✅ Verification

After adding secrets, verify they're there:

1. **Check in GitHub:**
   - Go to: https://github.com/unnita1235/QuickBite/settings/secrets/actions
   - You should see 4 secrets listed

2. **Or using GitHub CLI:**
   ```powershell
   gh secret list --repo unnita1235/QuickBite
   ```

---

## 🚀 Test It

Once secrets are added, test the automation:

```bash
git add .
git commit -m "Test deployment automation"
git push origin main
```

Then check:
- GitHub Actions: https://github.com/unnita1235/QuickBite/actions
- Vercel Dashboard: https://vercel.com/dashboard

---

**Recommended:** Use **Method 1** (Web Interface) - it's the fastest and easiest! 🎯

