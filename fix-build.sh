#!/bin/bash
# Fix and rebuild script for DeFi Watchdog

echo "🔧 Fixing DeFi Watchdog deployment issues..."

# Clean the build cache
echo "🧹 Cleaning build cache..."
rm -rf .next

# Ensure all dependencies are installed
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🏗️ Building project..."
npm run build

echo "✅ Build complete! Now you can run:"
echo "   npm run dev    (for development)"
echo "   npm start      (for production)"
