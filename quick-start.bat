@echo off
echo ====================================
echo DeFi Watchdog - Quick Start
echo ====================================
echo.

echo Clearing cache and starting development server...
if exist ".next" rmdir /s /q ".next"
npm run dev
