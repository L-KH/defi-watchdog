@echo off
echo Cleaning Next.js cache and restarting development server...
echo.

echo 1. Stopping any running Next.js processes...
taskkill /f /im node.exe 2>nul
timeout /t 2 /nobreak >nul

echo 2. Clearing Next.js cache...
if exist ".next" (
    rmdir /s /q ".next"
    echo   - Deleted .next directory
)

if exist "node_modules/.cache" (
    rmdir /s /q "node_modules/.cache"
    echo   - Deleted node_modules cache
)

echo 3. Restarting development server...
echo.
echo Starting npm run dev...
echo Press Ctrl+C to stop the server when done.
echo.

npm run dev
