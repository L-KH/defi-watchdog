@echo off
REM CONSERVATIVE ANALYSIS TEST

echo 🔍 CONSERVATIVE PATTERN ANALYSIS - REBUILT FROM SCRATCH
echo.
echo ✅ Completely rewritten scanner logic
echo ✅ Only flags REAL security issues
echo ✅ Conservative pattern matching
echo ✅ No false positives from normal Solidity code
echo.
echo 🎯 What it ONLY detects:
echo    1. tx.origin in authorization (HIGH)
echo    2. Unchecked external calls (HIGH) 
echo    3. Unprotected selfdestruct (CRITICAL)
echo    4. Timestamp in critical logic (MEDIUM)
echo    5. Reentrancy patterns (HIGH)
echo.
echo 🚫 What it IGNORES:
echo    ❌ Normal arithmetic operations
echo    ❌ Standard function declarations
echo    ❌ Regular variable assignments
echo    ❌ Comments and imports
echo    ❌ Safe Solidity patterns
echo.
echo Expected results:
echo    📊 Simple contracts: 0-5 issues
echo    📊 Complex contracts: 5-20 issues
echo    📊 NOT 793 issues!
echo.

REM Test locally
echo 🧪 Starting localhost test...
start npm run dev

echo.
echo 🎯 Test with the same contract that showed 793 issues
echo    Should now show reasonable numbers (0-20 issues)
echo.
echo Press any key when satisfied with localhost results...
pause

echo.
echo 🚀 Deploy conservative analysis?
echo This will replace the aggressive scanner with conservative one.
set /p deploy="Deploy to Vercel? (y/n): "
if /i "%deploy%"=="y" (
    git add .
    git commit -m "REBUILD: Conservative pattern analysis - no false positives"
    git push origin main
    vercel --prod
    echo.
    echo 🎉 DEPLOYED! Scanner now gives realistic results.
) else (
    echo Deployment cancelled. Test more on localhost.
)

pause
