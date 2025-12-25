#!/bin/bash

# Verify Deployment Setup Script
# Checks if everything is ready for deployment

echo "🔍 Verifying Deployment Setup"
echo "=============================="
echo ""

ERRORS=0

# Check if GitHub Actions workflows exist
if [ -f ".github/workflows/ci.yml" ]; then
    echo "✅ CI workflow exists"
else
    echo "❌ CI workflow missing"
    ERRORS=$((ERRORS + 1))
fi

if [ -f ".github/workflows/preview.yml" ]; then
    echo "✅ Preview workflow exists"
else
    echo "❌ Preview workflow missing"
    ERRORS=$((ERRORS + 1))
fi

# Check if vercel.json exists
if [ -f "vercel.json" ]; then
    echo "✅ Vercel config exists"
else
    echo "❌ Vercel config missing"
    ERRORS=$((ERRORS + 1))
fi

# Check if package.json has ci script
if grep -q '"ci"' package.json; then
    echo "✅ CI script in package.json"
else
    echo "❌ CI script missing in package.json"
    ERRORS=$((ERRORS + 1))
fi

# Check if .env.example exists
if [ -f ".env.example" ]; then
    echo "✅ .env.example exists"
else
    echo "⚠️  .env.example missing (optional)"
fi

echo ""
echo "📋 Manual Checks Needed:"
echo ""
echo "1. GitHub Secrets (add at: https://github.com/unnita1235/QuickBite/settings/secrets/actions)"
echo "   [ ] VERCEL_TOKEN"
echo "   [ ] VERCEL_ORG_ID"
echo "   [ ] VERCEL_PROJECT_ID"
echo "   [ ] GOOGLE_GENAI_API_KEY"
echo ""
echo "2. Vercel Environment Variables"
echo "   [ ] GOOGLE_GENAI_API_KEY set in Vercel dashboard"
echo ""

if [ $ERRORS -eq 0 ]; then
    echo "✅ All automated checks passed!"
    echo ""
    echo "Next: Add GitHub Secrets and push to test"
else
    echo "❌ Found $ERRORS error(s). Please fix them first."
    exit 1
fi

