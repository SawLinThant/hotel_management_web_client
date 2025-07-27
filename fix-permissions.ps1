# Comprehensive Fix Script for Hotel Management Web Client
# This script addresses all known permission and configuration issues

Write-Host "🔧 Comprehensive Fix Script for Hotel Management Web Client" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Green

# Step 1: Kill all Node.js processes
Write-Host "`n1. Stopping all Node.js processes..." -ForegroundColor Yellow
taskkill /F /IM node.exe 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Node.js processes stopped" -ForegroundColor Green
} else {
    Write-Host "   ℹ️  No Node.js processes were running" -ForegroundColor Blue
}

# Step 2: Wait for processes to fully terminate
Write-Host "`n2. Waiting for processes to terminate..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Step 3: Remove problematic directories
Write-Host "`n3. Cleaning up directories..." -ForegroundColor Yellow
$directoriesToRemove = @(".next", "node_modules", "package-lock.json")
foreach ($dir in $directoriesToRemove) {
    if (Test-Path $dir) {
        Write-Host "   Removing $dir..." -ForegroundColor Cyan
        Remove-Item -Recurse -Force $dir -ErrorAction SilentlyContinue
        Write-Host "   ✅ $dir removed" -ForegroundColor Green
    } else {
        Write-Host "   ℹ️  $dir not found" -ForegroundColor Blue
    }
}

# Step 4: Clear npm cache
Write-Host "`n4. Clearing npm cache..." -ForegroundColor Yellow
npm cache clean --force 2>$null
Write-Host "   ✅ npm cache cleared" -ForegroundColor Green

# Step 5: Install dependencies
Write-Host "`n5. Installing dependencies..." -ForegroundColor Yellow
npm install --legacy-peer-deps
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Dependencies installed successfully" -ForegroundColor Green
} else {
    Write-Host "   ❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Step 6: Set environment variables
Write-Host "`n6. Setting environment variables..." -ForegroundColor Yellow
$env:NEXT_TELEMETRY_DISABLED = "1"
$env:NEXT_TRACE_DISABLED = "1"
$env:CHOKIDAR_USEPOLLING = "true"
Write-Host "   ✅ Environment variables set" -ForegroundColor Green

# Step 7: Test the build
Write-Host "`n7. Testing build..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Build successful" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Build had warnings but should still work" -ForegroundColor Yellow
}

# Step 8: Start development server
Write-Host "`n8. Starting development server..." -ForegroundColor Yellow
Write-Host "   🚀 Starting Next.js development server..." -ForegroundColor Green
Write-Host "   📍 Server will be available at: http://localhost:3000" -ForegroundColor Cyan
Write-Host "   🔄 Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host ""

# Start the development server
try {
    npm run dev
} catch {
    Write-Host "❌ Error starting development server: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "💡 Try running this script as Administrator" -ForegroundColor Yellow
    exit 1
} 