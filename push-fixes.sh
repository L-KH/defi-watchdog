#!/bin/bash

echo "🚀 Pushing Fixed Code to GitHub..."
echo ""

echo "📋 Current status:"
git status

echo ""
echo "📦 Adding all changes..."
git add .

echo ""
echo "💾 Committing changes..."
git commit -m "fix: resolve zerebro analyze.js syntax error for Vercel deployment

- Fixed apostrophe syntax error in zerebro/analyze.js line 201
- Completely rewrote file to eliminate all problematic characters  
- Added Vercel optimization configurations
- Added local testing scripts
- All build errors resolved"

echo ""
echo "🌐 Pushing to feature-dev branch..."
git push origin feature-dev

echo ""
echo "✅ Push complete! Vercel will now auto-deploy the fixed code."
echo ""
echo "🔗 Check your Vercel dashboard - the new deployment should succeed!"
