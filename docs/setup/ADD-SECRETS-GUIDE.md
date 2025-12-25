# 🔐 Complete Guide: Adding GitHub Secrets with PowerShell

## Quick Start

### Step 1: Install GitHub CLI (if not installed)

```powershell
# Option 1: Using winget (Windows Package Manager)
winget install --id GitHub.cli

# Option 2: Using Chocolatey
choco install gh

# Option 3: Download from
# https://cli.github.com/
```

### Step 2: Authenticate with GitHub

```powershell
gh auth login
```

Follow the prompts to authenticate. Choose:
- GitHub.com
- HTTPS (recommended)
- Login with a web browser (easiest)

### Step 3: Get Your Secret Values

Before running the script, get these 4 values:

#### 1. VERCEL_TOKEN
- Go to: https://vercel.com/account/tokens
- Click "Create Token"
- Name: `GitHub Actions`
- **Copy the token** (you won't see it again!)

#### 2. VERCEL_ORG_ID
- Go to: https://vercel.com/account/general
- Find "Team ID" or "Organization ID"
- Copy it

#### 3. VERCEL_PROJECT_ID
- Go to your Vercel project dashboard
- Settings → General
- Find "Project ID"
- Copy it

#### 4. GOOGLE_GENAI_API_KEY
- Go to: https://aistudio.google.com/app/apikey
- Copy your existing API key (or create new one)

### Step 4: Run the Script

**Option A: Interactive Mode (Recommended)**
```powershell
powershell -ExecutionPolicy Bypass -File scripts/add-github-secrets.ps1
```

The script will prompt you for each secret value.

**Option B: Pass Values as Parameters**
```powershell
powershell -ExecutionPolicy Bypass -File scripts/add-github-secrets.ps1 `
  -VercelToken "your-vercel-token" `
  -VercelOrgId "your-org-id" `
  -VercelProjectId "your-project-id" `
  -GoogleApiKey "your-api-key"
```

**Option C: Add Secrets One at a Time (Using GitHub CLI Directly)**
```powershell
# Add VERCEL_TOKEN
echo "your-vercel-token" | gh secret set VERCEL_TOKEN --repo unnita1235/QuickBite

# Add VERCEL_ORG_ID
echo "your-org-id" | gh secret set VERCEL_ORG_ID --repo unnita1235/QuickBite

# Add VERCEL_PROJECT_ID
echo "your-project-id" | gh secret set VERCEL_PROJECT_ID --repo unnita1235/QuickBite

# Add GOOGLE_GENAI_API_KEY
echo "your-api-key" | gh secret set GOOGLE_GENAI_API_KEY --repo unnita1235/QuickBite
```

---

## Verify Secrets Were Added

```powershell
gh secret list --repo unnita1235/QuickBite
```

You should see all 4 secrets listed.

---

## Troubleshooting

### ❌ "gh: command not found"
**Fix:** Install GitHub CLI first (see Step 1)

### ❌ "Not authenticated"
**Fix:** Run `gh auth login` first

### ❌ "Permission denied"
**Fix:** Make sure you're authenticated and have admin access to the repository

### ❌ "Secret not found" after adding
**Fix:** 
- Check spelling of secret names (case-sensitive!)
- Verify you're using the correct repository name
- Run `gh secret list` to see what's actually there

---

## Alternative: Manual Method (No CLI Required)

If you don't want to install GitHub CLI, use the web interface:

👉 https://github.com/unnita1235/QuickBite/settings/secrets/actions

Click "New repository secret" for each one.

---

## Success Checklist

After running the script, verify:

- [ ] All 4 secrets appear in: `gh secret list --repo unnita1235/QuickBite`
- [ ] Or check web interface: https://github.com/unnita1235/QuickBite/settings/secrets/actions
- [ ] Push a change to test deployment
- [ ] Check GitHub Actions: https://github.com/unnita1235/QuickBite/actions

---

**The script is located at:** `scripts/add-github-secrets.ps1`

