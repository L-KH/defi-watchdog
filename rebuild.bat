@echo off
echo Cleaning and rebuilding DeFi Watchdog...
echo.

echo Step 1: Cleaning build cache...
rd /s /q .next 2>nul

echo Step 2: Installing dependencies...
npm install

echo Step 3: Building project...
npm run build

echo.
echo Build complete! You can now run:
echo   npm run dev    (for development)
echo   npm start      (for production)
pause
