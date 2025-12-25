# QuickBite Deployment Setup Script (PowerShell)
# This script helps you set up deployment automation

Write-Host "🚀 QuickBite Deployment Setup" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host ""

# Check if GitHub CLI is installed
try {
    $null = Get-Command gh -ErrorAction Stop
    Write-Host "✅ GitHub CLI found" -ForegroundColor Green
} catch {
    Write-Host "⚠️  GitHub CLI (gh) not found." -ForegroundColor Yellow
    Write-Host "   Install it from: https://cli.github.com/" -ForegroundColor Yellow
    Write-Host "   Or manually add secrets in GitHub Settings > Secrets" -ForegroundColor Yellow
    Write-Host ""
}

# Check if Vercel CLI is installed
try {
    $null = Get-Command vercel -ErrorAction Stop
    Write-Host "✅ Vercel CLI found" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Vercel CLI not found." -ForegroundColor Yellow
    Write-Host "   Install it: npm i -g vercel" -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "📋 Setup Checklist:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. ✅ GitHub Actions workflows created" -ForegroundColor Green
Write-Host "   - .github/workflows/ci.yml"
Write-Host "   - .github/workflows/preview.yml"
Write-Host ""
Write-Host "2. 🔑 Add GitHub Secrets (Required):" -ForegroundColor Yellow
Write-Host "   Go to: https://github.com/unnita1235/QuickBite/settings/secrets/actions"
Write-Host ""
Write-Host "   Required secrets:"
Write-Host "   - VERCEL_TOKEN (from https://vercel.com/account/tokens)"
Write-Host "   - VERCEL_ORG_ID (from Vercel Settings > General)"
Write-Host "   - VERCEL_PROJECT_ID (from Vercel Project Settings)"
Write-Host "   - GOOGLE_GENAI_API_KEY (from https://aistudio.google.com/app/apikey)"
Write-Host ""
Write-Host "3. 🌐 Configure Vercel:" -ForegroundColor Yellow
Write-Host "   - Connect GitHub repo to Vercel"
Write-Host "   - Set environment variables in Vercel dashboard"
Write-Host "   - Enable automatic deployments"
Write-Host ""
Write-Host "4. ✅ Test the setup:" -ForegroundColor Yellow
Write-Host "   git add ."
Write-Host "   git commit -m 'Setup deployment automation'"
Write-Host "   git push origin main"
Write-Host ""
Write-Host "📖 For detailed instructions, see DEPLOYMENT.md" -ForegroundColor Cyan
Write-Host ""

