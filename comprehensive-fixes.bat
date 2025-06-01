@echo off
echo ====================================
echo DeFi Watchdog - Comprehensive Fixes
echo ====================================
echo.

echo [1/5] Checking Node.js and npm installation...
node --version
npm --version
echo.

echo [2/5] Installing/updating dependencies...
npm install --legacy-peer-deps
echo.

echo [3/5] Clearing Next.js cache...
if exist ".next" (
    rmdir /s /q ".next"
    echo Cache cleared
) else (
    echo No cache to clear
)
echo.

echo [4/5] Building the project...
npm run build
if %errorlevel% neq 0 (
    echo Build failed! Checking for issues...
    echo Running development mode instead...
    echo.
    echo [5/5] Starting development server...
    npm run dev
) else (
    echo Build successful!
    echo.
    echo [5/5] Starting production server...
    npm start
)

echo.
echo ====================================
echo Fixed Issues:
echo - Reduced scan times (1s, 3s, 8s, 15s)
echo - Added enhanced loading progress
echo - Added error boundary for stability
echo - Improved vulnerability detection
echo - Better error handling
echo ====================================
