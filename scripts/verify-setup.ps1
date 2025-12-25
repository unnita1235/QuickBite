# Verify Deployment Setup Script (PowerShell)
# Checks if everything is ready for deployment

Write-Host "🔍 Verifying Deployment Setup" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host ""

$Errors = 0

# Check if GitHub Actions workflows exist
if (Test-Path ".github/workflows/ci.yml") {
    Write-Host "✅ CI workflow exists" -ForegroundColor Green
} else {
    Write-Host "❌ CI workflow missing" -ForegroundColor Red
    $Errors++
}

if (Test-Path ".github/workflows/preview.yml") {
    Write-Host "✅ Preview workflow exists" -ForegroundColor Green
} else {
    Write-Host "❌ Preview workflow missing" -ForegroundColor Red
    $Errors++
}

# Check if vercel.json exists
if (Test-Path "vercel.json") {
    Write-Host "✅ Vercel config exists" -ForegroundColor Green
} else {
    Write-Host "❌ Vercel config missing" -ForegroundColor Red
    $Errors++
}

# Check if package.json has ci script
$packageJson = Get-Content package.json -Raw
if ($packageJson -match '"ci"') {
    Write-Host "✅ CI script in package.json" -ForegroundColor Green
} else {
    Write-Host "❌ CI script missing in package.json" -ForegroundColor Red
    $Errors++
}

# Check if .env.example exists
if (Test-Path ".env.example") {
    Write-Host "✅ .env.example exists" -ForegroundColor Green
} else {
    Write-Host "⚠️  .env.example missing (optional)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📋 Manual Checks Needed:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. GitHub Secrets (add at: https://github.com/unnita1235/QuickBite/settings/secrets/actions)"
Write-Host "   [ ] VERCEL_TOKEN"
Write-Host "   [ ] VERCEL_ORG_ID"
Write-Host "   [ ] VERCEL_PROJECT_ID"
Write-Host "   [ ] GOOGLE_GENAI_API_KEY"
Write-Host ""
Write-Host "2. Vercel Environment Variables"
Write-Host "   [ ] GOOGLE_GENAI_API_KEY set in Vercel dashboard"
Write-Host ""

if ($Errors -eq 0) {
    Write-Host "✅ All automated checks passed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next: Add GitHub Secrets and push to test" -ForegroundColor Cyan
} else {
    Write-Host "❌ Found $Errors error(s). Please fix them first." -ForegroundColor Red
    exit 1
}

