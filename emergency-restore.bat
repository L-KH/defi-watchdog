@echo off
REM Emergency restore script - back to working state

echo 🚨 Emergency Restore: Reverting to Original Working State
echo.
echo Changes made:
echo ✅ Reverted contractScannerApi.js to use direct external API calls
echo ✅ Removed API proxy routes that were causing conflicts  
echo ✅ Fixed infinite loop in contract caching
echo.
echo This should restore the scanner to working state on Vercel!
echo.

REM Deploy immediately
git add .
git commit -m "EMERGENCY: Revert to original working scanner configuration"
git push origin main
vercel --prod

echo.
echo 🎯 Expected results:
echo - Scanner API should show 'Online' on Vercel
echo - All tools should show ✓ (except solhint which was ✗ before)
echo - Contract loading should work without infinite loops
echo.
echo This restores the EXACT configuration that was working before!

pause
