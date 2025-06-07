@echo off
echo ========================================
echo   DeFi Watchdog - AI Analysis Fix
echo ========================================
echo.

echo 1. Creating backup of current aiAnalysisServer.js...
copy "src\lib\aiAnalysisServer.js" "src\lib\aiAnalysisServer.js.backup" >nul 2>&1
if %errorlevel%==0 (
    echo    ✅ Backup created successfully
) else (
    echo    ❌ Failed to create backup
    pause
    exit /b 1
)

echo.
echo 2. The enhanced aiAnalysisServer.js has been updated with:
echo    ✅ Smart contract code preprocessing
echo    ✅ Main contract prioritization over imports
echo    ✅ Enhanced token limit handling
echo    ✅ Better JSON parsing and fallbacks
echo    ✅ Improved error handling

echo.
echo 3. Testing the fix...
echo    (This will verify the preprocessing works correctly)
echo.

cd fixes
node test-ai-fix.js
cd ..

echo.
echo 4. Restarting development server...
echo    Please restart your dev server with:
echo    npm run dev  (or yarn dev)

echo.
echo ========================================
echo Fix deployment complete! 
echo ========================================
echo.
echo Next steps:
echo 1. Restart your development server
echo 2. Go to /audit page  
echo 3. Test with the same contract that failed before
echo 4. Verify you get meaningful analysis results
echo.
echo If any issues occur, restore backup with:
echo copy src\lib\aiAnalysisServer.js.backup src\lib\aiAnalysisServer.js
echo.
pause
