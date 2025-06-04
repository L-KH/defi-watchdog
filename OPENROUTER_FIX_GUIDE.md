# OpenRouter API Key Fix Guide

## Problem
Your DeFi Watchdog application is getting a 401 "No auth credentials found" error when trying to use the OpenRouter API.

## Root Cause
The hardcoded API key `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` may be:
1. **Expired** - OpenRouter API keys can expire
2. **Compromised** - The key was exposed in public code and may have been deactivated
3. **Invalid** - The key format or permissions may have changed

## Solution Steps

### Step 1: Generate a New API Key
1. Go to https://openrouter.ai/keys
2. Log in to your OpenRouter account (or create one if needed)
3. Click "Create Key"
4. Give it a name like "DeFi Watchdog"
5. Copy the new API key (starts with `sk-or-v1-`)

### Step 2: Update Your Environment Variables
1. Open `.env.local` in your project root
2. Replace the old key with your new key:
```env
OPENROUTER_API_KEY=your_new_api_key_here
```

### Step 3: Test the New Key
1. Restart your development server:
```bash
npm run dev
```

2. Visit http://localhost:3000/api/test-openrouter to test the API

### Step 4: Verify the Fix
1. Go to your audit page
2. Try running an AI analysis
3. You should now see real AI results instead of mock data

## What I've Fixed

### 1. Enhanced Error Handling
- Added specific error messages for different HTTP status codes
- Better debugging information to identify issues quickly

### 2. Fallback Mock Response
- If the API key fails, the app now shows a mock analysis instead of crashing
- This allows you to test the interface while fixing the API key

### 3. Multiple Model Support
- Updated to use currently working free models:
  - Microsoft Phi-3 Mini
  - Google Gemma 2
  - Qwen 2
  - Mistral 7B
  - Llama 3.2

### 4. Improved Authentication
- Better API key validation
- Enhanced request headers
- More robust error handling

## Files Modified
- `src/lib/aiAnalysis.js` - Main AI analysis logic
- `src/pages/api/test-openrouter.js` - API test endpoint
- `scripts/test-openrouter.js` - Standalone test script

## Testing
After getting a new API key, you can test with:

### Method 1: Web Interface
1. Go to http://localhost:3000/audit
2. Enter a contract address
3. Click "Start Free Scan"

### Method 2: API Test Endpoint
```bash
curl -X POST http://localhost:3000/api/test-openrouter
```

### Method 3: Direct API Test
```bash
curl -X POST https://openrouter.ai/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_NEW_API_KEY" \
  -d '{
    "model": "microsoft/phi-3-mini-128k-instruct:free",
    "messages": [{"role": "user", "content": "Hello"}],
    "max_tokens": 50
  }'
```

## Prevention
- Keep API keys in environment variables only
- Never commit API keys to public repositories
- Regenerate keys periodically
- Monitor OpenRouter usage and credits

## Support
If you continue having issues after getting a new API key:
1. Check OpenRouter's status page
2. Verify your account has sufficient credits
3. Contact OpenRouter support
4. Use the mock response mode for development

---
**Next Steps:** Get a new API key from https://openrouter.ai/keys and update your `.env.local` file.
