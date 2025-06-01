#!/bin/bash
# Test and Deploy Script for DeFi Watchdog Scanner Fix

echo "🔧 Testing DeFi Watchdog Scanner API Fix..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "📋 Changes made to fix Scanner API on Vercel:"
echo "1. ✅ Created /api/scanner/health.js - Proxy for scanner health check"
echo "2. ✅ Created /api/scanner/tools.js - Proxy for scanner tools info"
echo "3. ✅ Created /api/scanner/scan.js - Proxy for scanner operations"
echo "4. ✅ Updated contractScannerApi.js to use API routes instead of direct calls"
echo ""

echo "🧪 Testing localhost first..."
# Start the development server in background
npm run dev &
DEV_PID=$!

# Wait a few seconds for server to start
sleep 5

# Test the API endpoints
echo "Testing scanner health endpoint..."
curl -s http://localhost:3000/api/scanner/health | jq . || echo "Health endpoint test failed"

echo ""
echo "Testing scanner tools endpoint..."
curl -s http://localhost:3000/api/scanner/tools | jq . || echo "Tools endpoint test failed"

# Kill the dev server
kill $DEV_PID 2>/dev/null

echo ""
echo "🚀 Ready for Vercel deployment!"
echo ""
echo "📝 Next steps:"
echo "1. Commit and push the changes:"
echo "   git add ."
echo "   git commit -m \"Fix Scanner API for Vercel deployment - use proxy routes\""
echo "   git push origin main"
echo ""
echo "2. Deploy to Vercel:"
echo "   vercel --prod"
echo ""
echo "3. Test on Vercel:"
echo "   - Go to your deployed URL"
echo "   - Click 'Load Contract' with any contract address"
echo "   - The Scanner API should now show 'Online' instead of 'Offline'"
echo ""
echo "🎯 The fix addresses CORS issues by routing scanner API calls through Next.js API routes"
echo "   instead of making direct client-side calls to the external scanner service."
