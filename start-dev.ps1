# Start Development Server Script
# This script starts the Next.js development server with proper environment setup

Write-Host "🚀 Starting Hotel Management Web Client..." -ForegroundColor Green

# Set environment variables to disable problematic features
$env:NEXT_TELEMETRY_DISABLED = "1"
$env:NEXT_TRACE_DISABLED = "1"
$env:CHOKIDAR_USEPOLLING = "true"

# Kill any existing Node.js processes
Write-Host "Stopping any existing Node.js processes..." -ForegroundColor Yellow
taskkill /F /IM node.exe 2>$null

# Wait for processes to terminate
Start-Sleep -Seconds 2

# Remove .next directory if it exists
if (Test-Path ".next") {
    Write-Host "Removing .next directory..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
}

# Start the development server
Write-Host "Starting development server..." -ForegroundColor Green
Write-Host "Environment variables set:" -ForegroundColor Cyan
Write-Host "  - NEXT_TELEMETRY_DISABLED=1" -ForegroundColor Gray
Write-Host "  - NEXT_TRACE_DISABLED=1" -ForegroundColor Gray
Write-Host "  - CHOKIDAR_USEPOLLING=true" -ForegroundColor Gray
Write-Host ""

try {
    npm run dev
} catch {
    Write-Host "❌ Error starting development server: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Try running this script as Administrator" -ForegroundColor Yellow
    exit 1
} 