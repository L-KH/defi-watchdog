// Quick API key diagnosis script
// Usage: cd into your project and run: node debug-api.js

require('dotenv').config({ path: '.env.local' });

const API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY;

console.log("🔍 DeFi Watchdog API Key Debug");
console.log("===============================");

// Check environment variables
console.log("📋 Environment Check:");
console.log(`- NEXT_PUBLIC_OPENROUTER_API_KEY: ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY ? 'SET' : 'NOT SET'}`);
console.log(`- OPENROUTER_API_KEY: ${process.env.OPENROUTER_API_KEY ? 'SET' : 'NOT SET'}`);
console.log(`- Final API Key: ${API_KEY ? `${API_KEY.substring(0, 15)}...${API_KEY.substring(API_KEY.length - 5)}` : 'NOT FOUND'}`);

// Check API key format
if (API_KEY) {
    console.log("\n🔑 API Key Validation:");
    console.log(`- Starts with 'sk-': ${API_KEY.startsWith('sk-') ? '✅' : '❌'}`);
    console.log(`- Proper length: ${API_KEY.length > 50 ? '✅' : '❌'} (${API_KEY.length} chars)`);
    console.log(`- Not placeholder: ${!API_KEY.includes('your_') ? '✅' : '❌'}`);
} else {
    console.log("\n❌ No API key found!");
    console.log("💡 Fix: Add NEXT_PUBLIC_OPENROUTER_API_KEY=your_key_here to .env.local");
}

// List potential issues
console.log("\n🚨 Common Issues to Check:");
console.log("1. API key expired - check OpenRouter dashboard");
console.log("2. No credits in OpenRouter account");
console.log("3. Rate limiting (429 errors)");
console.log("4. Models not available for your key");
console.log("5. API key not configured for data collection settings");

console.log("\n🔧 Next Steps:");
if (!API_KEY) {
    console.log("1. Get new API key from https://openrouter.ai/keys");
    console.log("2. Add to .env.local file");
    console.log("3. Restart your development server");
} else {
    console.log("1. Visit OpenRouter dashboard to check account status");
    console.log("2. Verify API key hasn't expired");
    console.log("3. Check account credits");
    console.log("4. Run test-api-key.js for detailed testing");
}

console.log("\n📚 Documentation:");
console.log("- OpenRouter Dashboard: https://openrouter.ai/dashboard");
console.log("- API Keys: https://openrouter.ai/keys");
console.log("- Credits: https://openrouter.ai/credits");
