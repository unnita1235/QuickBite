# Add GitHub Secrets Script
# This script helps you add secrets to GitHub using GitHub CLI

param(
    [string]$VercelToken,
    [string]$VercelOrgId,
    [string]$VercelProjectId,
    [string]$GoogleApiKey
)

Write-Host "🔐 GitHub Secrets Setup Script" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host ""

# Check if GitHub CLI is installed
try {
    $null = Get-Command gh -ErrorAction Stop
    Write-Host "✅ GitHub CLI found" -ForegroundColor Green
} catch {
    Write-Host "❌ GitHub CLI not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install GitHub CLI first:" -ForegroundColor Yellow
    Write-Host "  Windows (winget): winget install --id GitHub.cli" -ForegroundColor Yellow
    Write-Host "  Windows (choco): choco install gh" -ForegroundColor Yellow
    Write-Host "  Or download from: https://cli.github.com/" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "After installing, run: gh auth login" -ForegroundColor Yellow
    exit 1
}

# Check if authenticated
$authStatus = gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Not authenticated with GitHub!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please run: gh auth login" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Authenticated with GitHub" -ForegroundColor Green
Write-Host ""

# Prompt for values if not provided
if (-not $VercelToken) {
    Write-Host "Enter VERCEL_TOKEN (or press Enter to skip):" -ForegroundColor Yellow
    $VercelToken = Read-Host
}

if (-not $VercelOrgId) {
    Write-Host "Enter VERCEL_ORG_ID (or press Enter to skip):" -ForegroundColor Yellow
    $VercelOrgId = Read-Host
}

if (-not $VercelProjectId) {
    Write-Host "Enter VERCEL_PROJECT_ID (or press Enter to skip):" -ForegroundColor Yellow
    $VercelProjectId = Read-Host
}

if (-not $GoogleApiKey) {
    Write-Host "Enter GOOGLE_GENAI_API_KEY (or press Enter to skip):" -ForegroundColor Yellow
    $GoogleApiKey = Read-Host
}

Write-Host ""
Write-Host "Adding secrets to GitHub..." -ForegroundColor Cyan
Write-Host ""

$repo = "unnita1235/QuickBite"
$added = 0
$skipped = 0

# Add VERCEL_TOKEN
if ($VercelToken) {
    Write-Host "Adding VERCEL_TOKEN..." -ForegroundColor Yellow
    echo $VercelToken | gh secret set VERCEL_TOKEN --repo $repo
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ VERCEL_TOKEN added" -ForegroundColor Green
        $added++
    } else {
        Write-Host "❌ Failed to add VERCEL_TOKEN" -ForegroundColor Red
    }
} else {
    Write-Host "⏭️  Skipping VERCEL_TOKEN" -ForegroundColor Yellow
    $skipped++
}

# Add VERCEL_ORG_ID
if ($VercelOrgId) {
    Write-Host "Adding VERCEL_ORG_ID..." -ForegroundColor Yellow
    echo $VercelOrgId | gh secret set VERCEL_ORG_ID --repo $repo
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ VERCEL_ORG_ID added" -ForegroundColor Green
        $added++
    } else {
        Write-Host "❌ Failed to add VERCEL_ORG_ID" -ForegroundColor Red
    }
} else {
    Write-Host "⏭️  Skipping VERCEL_ORG_ID" -ForegroundColor Yellow
    $skipped++
}

# Add VERCEL_PROJECT_ID
if ($VercelProjectId) {
    Write-Host "Adding VERCEL_PROJECT_ID..." -ForegroundColor Yellow
    echo $VercelProjectId | gh secret set VERCEL_PROJECT_ID --repo $repo
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ VERCEL_PROJECT_ID added" -ForegroundColor Green
        $added++
    } else {
        Write-Host "❌ Failed to add VERCEL_PROJECT_ID" -ForegroundColor Red
    }
} else {
    Write-Host "⏭️  Skipping VERCEL_PROJECT_ID" -ForegroundColor Yellow
    $skipped++
}

# Add GOOGLE_GENAI_API_KEY
if ($GoogleApiKey) {
    Write-Host "Adding GOOGLE_GENAI_API_KEY..." -ForegroundColor Yellow
    echo $GoogleApiKey | gh secret set GOOGLE_GENAI_API_KEY --repo $repo
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ GOOGLE_GENAI_API_KEY added" -ForegroundColor Green
        $added++
    } else {
        Write-Host "❌ Failed to add GOOGLE_GENAI_API_KEY" -ForegroundColor Red
    }
} else {
    Write-Host "⏭️  Skipping GOOGLE_GENAI_API_KEY" -ForegroundColor Yellow
    $skipped++
}

Write-Host ""
Write-Host "==============================" -ForegroundColor Cyan
Write-Host "✅ Added: $added secrets" -ForegroundColor Green
Write-Host "⏭️  Skipped: $skipped secrets" -ForegroundColor Yellow
Write-Host ""

if ($added -eq 4) {
    Write-Host "🎉 All secrets added successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Verify secrets: gh secret list --repo $repo" -ForegroundColor Yellow
    Write-Host "2. Push a change to trigger deployment" -ForegroundColor Yellow
    Write-Host "3. Check GitHub Actions: https://github.com/$repo/actions" -ForegroundColor Yellow
} else {
    Write-Host "⚠️  Some secrets were not added. You can add them manually:" -ForegroundColor Yellow
    Write-Host "   https://github.com/$repo/settings/secrets/actions" -ForegroundColor Yellow
}

