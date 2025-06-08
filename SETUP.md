# DeFi Watchdog - Setup Instructions

## Quick Start

### 1. Install Dependencies
```bash
npm install
# or
yarn install
```

### 2. Configure OpenRouter API Key

The DeFi Watchdog uses OpenRouter for AI-powered smart contract analysis. You have two options:

#### Option A: Environment Variable (Recommended for Development)
1. Copy `.env.local.example` to `.env.local`
2. Get your OpenRouter API key from [openrouter.ai/keys](https://openrouter.ai/keys)
3. Add your key to `.env.local`:
   ```
   NEXT_PUBLIC_OPENROUTER_API_KEY=sk-or-v1-your-api-key-here
   ```

#### Option B: In-App Configuration (Recommended for Production)
1. Run the application without an API key
2. When you try to run an analysis, you'll see an "API Key Required" notice
3. Click "Configure API Key" and enter your OpenRouter API key
4. The key will be stored securely in your browser's local storage

### 3. Run the Development Server
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Troubleshooting

### "OpenRouter API key not configured" Error
This means the application cannot find your API key. Solutions:
1. Check that your `.env.local` file exists and contains the key
2. Restart the development server after adding the key
3. Use the in-app API key manager to configure the key
4. Ensure your key starts with `sk-or-v1-`

### Vercel Deployment Issues
If you're experiencing timeout issues on Vercel:
1. Set `NEXT_PUBLIC_USE_CLIENT_AI=true` in your environment variables
2. This will run the AI analysis client-side instead of using serverless functions
3. Users will need to provide their own OpenRouter API keys

### Rate Limiting
If you're hitting rate limits:
1. The app automatically staggers requests to free AI models
2. Consider upgrading to paid OpenRouter models for higher limits
3. Check your usage at [openrouter.ai/usage](https://openrouter.ai/usage)

## Features

- **Multi-AI Analysis**: Uses 6+ specialized AI models for comprehensive security analysis
- **Supervisor Verification**: AI supervisor reviews and verifies all findings
- **Fallback Analysis**: Basic static analysis when API keys are not available
- **Client-Side Support**: Can run entirely in the browser to avoid serverless limits
- **Secure Key Storage**: API keys are stored locally and never sent to our servers

## Security Note

Your OpenRouter API key is used directly from your browser to communicate with OpenRouter's API. It is never sent to our servers. For production deployments, we recommend having users provide their own API keys for maximum security and scalability.
