# 🚀 Deployment Guide

This guide explains how to set up automated deployments for QuickBite.

## 📋 Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Setting Up Vercel](#setting-up-vercel)
- [Setting Up GitHub Actions](#setting-up-github-actions)
- [Environment Variables](#environment-variables)
- [Deployment Workflows](#deployment-workflows)
- [Manual Deployment](#manual-deployment)
- [Troubleshooting](#troubleshooting)

---

## Overview

QuickBite uses **Vercel** for hosting and **GitHub Actions** for CI/CD automation. Every push to the main branch automatically:

1. ✅ Runs linting and type checking
2. ✅ Runs all tests
3. ✅ Builds the application
4. ✅ Deploys to production

Pull requests get preview deployments automatically.

---

## Prerequisites

Before setting up deployment automation, ensure you have:

- ✅ A GitHub account
- ✅ A Vercel account (free tier works)
- ✅ Your code pushed to a GitHub repository
- ✅ Node.js 20+ installed locally

---

## Setting Up Vercel

### Step 1: Create Vercel Account

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Connect your GitHub account

### Step 2: Import Your Project

1. Click **"Add New Project"**
2. Import your GitHub repository (`unnita1235/QuickBite`)
3. Vercel will auto-detect Next.js settings
4. Click **"Deploy"**

### Step 3: Get Vercel Credentials

You'll need these for GitHub Actions:

1. **Vercel Token**:
   - Go to [Vercel Settings > Tokens](https://vercel.com/account/tokens)
   - Create a new token (name it "GitHub Actions")
   - Copy the token (you'll only see it once!)

2. **Vercel Project ID**:
   - Go to your project settings in Vercel
   - Find "Project ID" in the General settings
   - Copy it

3. **Vercel Organization ID**:
   - Go to [Vercel Settings > General](https://vercel.com/account/general)
   - Find "Team ID" (this is your org ID)
   - Copy it

---

## Setting Up GitHub Actions

### Step 1: Add GitHub Secrets

Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions**

Add these secrets:

| Secret Name | Value | Where to Find |
|------------|-------|---------------|
| `VERCEL_TOKEN` | Your Vercel token | Vercel Settings > Tokens |
| `VERCEL_ORG_ID` | Your team/org ID | Vercel Settings > General |
| `VERCEL_PROJECT_ID` | Your project ID | Vercel Project Settings |
| `GOOGLE_GENAI_API_KEY` | Your Google AI API key | [Google AI Studio](https://aistudio.google.com/app/apikey) |

### Step 2: Verify Workflow Files

The following files should already be in your repository:

- `.github/workflows/ci.yml` - Main CI/CD pipeline
- `.github/workflows/preview.yml` - Preview deployments for PRs

### Step 3: Test the Workflow

1. Make a small change (e.g., update README)
2. Commit and push to `main` branch:
   ```bash
   git add .
   git commit -m "Test deployment automation"
   git push origin main
   ```
3. Go to **Actions** tab in GitHub to see the workflow run
4. Check Vercel dashboard for deployment status

---

## Environment Variables

### Vercel Environment Variables

Set these in Vercel dashboard:

1. Go to your project → **Settings** → **Environment Variables**
2. Add:
   - `GOOGLE_GENAI_API_KEY` = Your Google AI API key
   - Set for: **Production**, **Preview**, and **Development**

### Local Environment Variables

Create `.env.local` for local development:

```bash
GOOGLE_GENAI_API_KEY=your_api_key_here
```

**Never commit `.env.local` to Git!**

---

## Deployment Workflows

### Automatic Production Deployment

**Trigger**: Push to `main` or `master` branch

**Process**:
1. ✅ Lint code
2. ✅ Type check
3. ✅ Run tests
4. ✅ Build application
5. ✅ Deploy to Vercel production

**Status**: Check in GitHub Actions tab

### Preview Deployment

**Trigger**: Open a Pull Request

**Process**:
1. ✅ Run all checks (lint, typecheck, tests, build)
2. ✅ Deploy preview URL
3. ✅ Comment preview URL on PR

**Preview URL**: Automatically added as a comment on your PR

### Manual Deployment

If you need to deploy manually:

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

---

## Deployment Status Badges

Add these badges to your README to show deployment status:

```markdown
[![Deploy Status](https://github.com/unnita1235/QuickBite/workflows/CI/CD%20Pipeline/badge.svg)](https://github.com/unnita1235/QuickBite/actions)
[![Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/unnita1235/QuickBite)
```

---

## Troubleshooting

### ❌ Build Fails in GitHub Actions

**Problem**: Build fails with missing environment variable

**Solution**: 
- Ensure `GOOGLE_GENAI_API_KEY` is set in GitHub Secrets
- For build checks, a dummy key is used (won't affect production)

### ❌ Vercel Deployment Fails

**Problem**: Vercel can't authenticate

**Solution**:
- Verify `VERCEL_TOKEN` is correct in GitHub Secrets
- Check token hasn't expired (create new one if needed)
- Ensure `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` are correct

### ❌ Tests Fail in CI

**Problem**: Tests pass locally but fail in CI

**Solution**:
- Run `npm ci` locally (not `npm install`) to match CI
- Check Node.js version matches (should be 20)
- Ensure all dependencies are in `package.json` (not just `package-lock.json`)

### ❌ Preview Deployments Not Working

**Problem**: PRs don't get preview URLs

**Solution**:
- Check `.github/workflows/preview.yml` exists
- Verify Vercel project settings allow preview deployments
- Check GitHub Actions logs for errors

---

## Best Practices

### ✅ Do's

- ✅ Always run `npm run lint` and `npm test` before pushing
- ✅ Use meaningful commit messages
- ✅ Test locally before pushing
- ✅ Review preview deployments before merging PRs
- ✅ Keep environment variables secure (never commit them)

### ❌ Don'ts

- ❌ Don't skip tests or linting
- ❌ Don't commit `.env` files
- ❌ Don't deploy directly to production without testing
- ❌ Don't ignore build warnings

---

## Monitoring Deployments

### GitHub Actions

- View workflow runs: `https://github.com/unnita1235/QuickBite/actions`
- See logs for each step
- Re-run failed workflows

### Vercel Dashboard

- View deployments: `https://vercel.com/[your-username]/quickbite`
- See deployment logs
- Rollback to previous versions
- View analytics

---

## Need Help?

- 📖 [Vercel Documentation](https://vercel.com/docs)
- 📖 [GitHub Actions Documentation](https://docs.github.com/en/actions)
- 🐛 [Report Issues](https://github.com/unnita1235/QuickBite/issues)

---

**Last Updated**: 2024

