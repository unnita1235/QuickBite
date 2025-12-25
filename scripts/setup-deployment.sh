#!/bin/bash

# QuickBite Deployment Setup Script
# This script helps you set up deployment automation

echo "🚀 QuickBite Deployment Setup"
echo "=============================="
echo ""

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo "⚠️  GitHub CLI (gh) not found."
    echo "   Install it from: https://cli.github.com/"
    echo "   Or manually add secrets in GitHub Settings > Secrets"
    echo ""
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "⚠️  Vercel CLI not found."
    echo "   Install it: npm i -g vercel"
    echo ""
fi

echo "📋 Setup Checklist:"
echo ""
echo "1. ✅ GitHub Actions workflows created"
echo "   - .github/workflows/ci.yml"
echo "   - .github/workflows/preview.yml"
echo ""
echo "2. 🔑 Add GitHub Secrets (Required):"
echo "   Go to: https://github.com/unnita1235/QuickBite/settings/secrets/actions"
echo ""
echo "   Required secrets:"
echo "   - VERCEL_TOKEN (from https://vercel.com/account/tokens)"
echo "   - VERCEL_ORG_ID (from Vercel Settings > General)"
echo "   - VERCEL_PROJECT_ID (from Vercel Project Settings)"
echo "   - GOOGLE_GENAI_API_KEY (from https://aistudio.google.com/app/apikey)"
echo ""
echo "3. 🌐 Configure Vercel:"
echo "   - Connect GitHub repo to Vercel"
echo "   - Set environment variables in Vercel dashboard"
echo "   - Enable automatic deployments"
echo ""
echo "4. ✅ Test the setup:"
echo "   git add ."
echo "   git commit -m 'Setup deployment automation'"
echo "   git push origin main"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT.md"
echo ""

