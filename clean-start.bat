@echo off
echo 🧹 Cleaning up Node.js processes and cache...

echo Stopping all Node.js processes...
taskkill /F /IM node.exe >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Node.js processes stopped successfully
) else (
    echo ℹ️  No Node.js processes were running
)

echo Waiting for processes to terminate...
timeout /t 2 /nobreak >nul

echo Removing .next directory...
if exist ".next" (
    rmdir /s /q .next 2>nul
    echo ✅ .next directory removed
) else (
    echo ℹ️  .next directory not found
)

echo Clearing npm cache...
npm cache clean --force >nul 2>&1
echo ✅ npm cache cleared

echo Installing dependencies...
npm install
if %errorlevel% equ 0 (
    echo ✅ Dependencies installed successfully
) else (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo 🎉 Clean start completed! You can now run 'npm run dev'
echo 💡 If you still get permission errors, try running this script as Administrator
pause 