# Troubleshooting Guide

## Permission Errors (EPERM: operation not permitted)

If you encounter permission errors like:
```
Error: EPERM: operation not permitted, open '.next\trace'
```

### 🚀 **Recommended: Use the Comprehensive Fix Script**
```powershell
# Run the comprehensive fix script (RECOMMENDED)
.\fix-permissions.ps1
```

This script will:
1. Stop all Node.js processes
2. Clean up all problematic directories
3. Clear npm cache
4. Reinstall dependencies with correct versions
5. Set proper environment variables
6. Test the build
7. Start the development server

### Manual Fix (Windows PowerShell)
```powershell
# 1. Stop all Node.js processes
taskkill /F /IM node.exe

# 2. Remove problematic directories
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item package-lock.json -ErrorAction SilentlyContinue

# 3. Clear npm cache
npm cache clean --force

# 4. Reinstall dependencies
npm install --legacy-peer-deps

# 5. Set environment variables
$env:NEXT_TELEMETRY_DISABLED = "1"
$env:NEXT_TRACE_DISABLED = "1"
$env:CHOKIDAR_USEPOLLING = "true"

# 6. Start the development server
npm run dev
```

### Alternative: Use the Clean Start Script
```powershell
# Run the PowerShell script
.\clean-start.ps1

# Or use the batch file
.\clean-start.bat
```

### If the above doesn't work:
1. **Run as Administrator**: Right-click on PowerShell/Command Prompt and select "Run as Administrator"
2. **Restart your computer**: This will ensure all file handles are released
3. **Check antivirus**: Some antivirus software may block file operations
4. **Use the comprehensive fix script**: `.\fix-permissions.ps1`

## Common Issues and Solutions

### 1. Port Already in Use
If you see "Port 3000 is in use":
```powershell
# Find what's using the port
netstat -ano | findstr :3000

# Kill the process (replace PID with the actual process ID)
taskkill /F /PID <PID>
```

### 2. TypeScript/ESLint Errors
If you see TypeScript or ESLint errors:
```powershell
# Install dependencies
npm install --legacy-peer-deps

# Run linting
npm run lint
```

### 3. Build Failures
If the build fails:
```powershell
# Use the comprehensive fix script
.\fix-permissions.ps1
```

### 4. Next.js Version Issues
If you encounter issues with Next.js 15:
- The project has been downgraded to Next.js 14.2.5 for stability
- This version is more stable and has fewer permission issues

## Development Workflow

### Starting the Project
```powershell
# Recommended: Use the comprehensive fix script
.\fix-permissions.ps1

# Or manually:
npm run dev
```

### Building for Production
```powershell
npm run build
npm start
```

### Testing
```powershell
# The application should be available at:
# - http://localhost:3000 (redirects to /en)
# - http://localhost:3000/en (English)
# - http://localhost:3000/my (Myanmar)
```

## File Structure
```
hotel_management_web_client/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Root page (redirects to /en)
│   │   ├── [locale]/         # Locale-specific pages
│   │   └── layout.tsx        # Root layout
│   ├── components/           # React components
│   ├── lib/                  # Utilities and constants
│   └── types/                # TypeScript type definitions
├── fix-permissions.ps1       # Comprehensive fix script (RECOMMENDED)
├── clean-start.ps1           # PowerShell cleanup script
├── clean-start.bat           # Batch cleanup script
├── start-dev.ps1             # Development server starter
└── TROUBLESHOOTING.md        # This file
```

## Environment Variables

The following environment variables are automatically set by the scripts:
- `NEXT_TELEMETRY_DISABLED=1` - Disables Next.js telemetry
- `NEXT_TRACE_DISABLED=1` - Disables Next.js trace features
- `CHOKIDAR_USEPOLLING=true` - Uses polling for file watching (better for Windows)

## Support

If you continue to experience issues:
1. **Use the comprehensive fix script**: `.\fix-permissions.ps1`
2. Check the console output for specific error messages
3. Ensure you're using Node.js version 18+ and npm version 8+
4. Try running the scripts as Administrator
5. Check if your antivirus is interfering with file operations
6. Restart your computer if all else fails

## Quick Commands

```powershell
# Quick fix for permission errors
.\fix-permissions.ps1

# Quick start (if no issues)
npm run dev

# Clean start
.\clean-start.ps1

# Start with proper environment
.\start-dev.ps1
``` 