# Clean Start Script for Hotel Management Web Client
# This script helps resolve permission errors and clean up Node.js processes

Write-Host "🧹 Cleaning up Node.js processes and cache..." -ForegroundColor Yellow

# Kill all Node.js processes
Write-Host "Stopping all Node.js processes..." -ForegroundColor Cyan
taskkill /F /IM node.exe 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Node.js processes stopped successfully" -ForegroundColor Green
} else {
    Write-Host "ℹ️  No Node.js processes were running" -ForegroundColor Blue
}

# Wait a moment for processes to fully terminate
Start-Sleep -Seconds 2

# Remove .next directory
Write-Host "Removing .next directory..." -ForegroundColor Cyan
if (Test-Path ".next") {
    Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
    Write-Host "✅ .next directory removed" -ForegroundColor Green
} else {
    Write-Host "ℹ️  .next directory not found" -ForegroundColor Blue
}

# Clear npm cache
Write-Host "Clearing npm cache..." -ForegroundColor Cyan
npm cache clean --force 2>$null
Write-Host "✅ npm cache cleared" -ForegroundColor Green

# Install dependencies (optional)
Write-Host "Installing dependencies..." -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

Write-Host "`n🎉 Clean start completed! You can now run 'npm run dev'" -ForegroundColor Green
Write-Host "💡 If you still get permission errors, try running this script as Administrator" -ForegroundColor Yellow 