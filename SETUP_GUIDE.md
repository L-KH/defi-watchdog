# 🔧 API Setup Guide - DeFi Watchdog

This guide will help you set up the required API keys to use DeFi Watchdog's contract analysis features.

## Why API Keys Are Needed

DeFi Watchdog fetches smart contract source code from blockchain explorers (LineaScan, SonicScan) to perform security analysis. These services require free API keys to prevent abuse and ensure service quality.

## Step-by-Step Setup

### 1. Create Environment File

In your project root, copy the example environment file:

```bash
cp .env.example .env.local
```

### 2. Get LineaScan API Key (Required for Linea contracts)

1. **Visit**: [https://lineascan.build/apis](https://lineascan.build/apis)
2. **Click**: "Login" or "Register" 
3. **Create Account**: Use your email and create a password
4. **Verify Email**: Check your email and verify your account
5. **Create API Key**: 
   - Go to "API Keys" section
   - Click "Add" to create a new API key
   - Give it a name like "DeFi Watchdog"
   - Copy the generated API key
6. **Add to .env.local**:
   ```env
   LINEASCAN_API_KEY=your_actual_api_key_here
   ```

### 3. Get SonicScan API Key (Required for Sonic contracts)

1. **Visit**: [https://sonicscan.org/apis](https://sonicscan.org/apis)
2. **Register**: Create a free account
3. **Generate API Key**: Follow similar steps as LineaScan
4. **Add to .env.local**:
   ```env
   SONICSCAN_API_KEY=your_actual_api_key_here
   ```

### 4. Get DeepSeek API Key (Optional - for AI analysis)

1. **Visit**: [https://platform.deepseek.com/api_keys](https://platform.deepseek.com/api_keys)
2. **Register**: Create an account
3. **Generate API Key**: Create a new API key
4. **Add to .env.local**:
   ```env
   DEEPSEEK_API_KEY=your_actual_api_key_here
   ```

### 5. Final .env.local File

Your `.env.local` file should look like this:

```env
# Blockchain Explorer API Keys (Required)
LINEASCAN_API_KEY=LSK_1234567890abcdef...
SONICSCAN_API_KEY=SSK_abcdef1234567890...

# AI API Keys (Optional)
DEEPSEEK_API_KEY=sk-1234567890abcdef...

# Other optional settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 6. Restart Your Development Server

After adding the API keys, restart your development server:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## Verification

To verify your setup is working:

1. Go to [http://localhost:3000/audit](http://localhost:3000/audit)
2. Try one of the example contracts:
   - **Linea**: `0x2d8879046f1559e53eb052e949e9544bcb72f414`
   - **Sonic**: `0xDd0F30DdC0D6B16B3e1E40bd7e95854246Ec3A13`
3. The contract should load successfully

## Common Issues & Solutions

### ❌ "API key not configured"
**Solution**: 
- Double-check your `.env.local` file exists in the project root
- Ensure API key names match exactly (case-sensitive)
- Restart your development server

### ❌ "Contract source code not available"
**Solutions**:
- Verify the contract address is correct
- Check if the contract is verified on the blockchain explorer
- Try switching networks
- Ensure you have the correct API key for that network

### ❌ API keys not working
**Solutions**:
- Check if API keys are valid on the respective platforms
- Ensure you've verified your email address
- Check API rate limits (usually very generous for free accounts)

### ❌ Still having issues?
**Troubleshooting steps**:
1. Check browser console for detailed error messages
2. Verify `.env.local` file is not committed to git (it should be ignored)
3. Try with a known working contract address
4. Contact support with specific error messages

## Free Tier Limits

All mentioned services offer generous free tiers:

- **LineaScan**: 100,000 requests/day
- **SonicScan**: 100,000 requests/day  
- **DeepSeek**: 1M tokens/month free

These limits are more than sufficient for development and testing.

## Security Notes

- ⚠️ **Never commit `.env.local` to git** - it's automatically ignored
- 🔒 **Keep API keys private** - don't share them publicly
- 🔄 **Rotate keys regularly** for production applications
- 📝 **Use descriptive names** when creating API keys for easier management

## Need Help?

If you're still having trouble:

1. **Check the console**: Open browser dev tools (F12) and look for error messages
2. **Try example contracts**: Use the provided example addresses first
3. **Create an issue**: Include error messages and steps you've tried
4. **Community support**: Join our Discord or create a GitHub discussion

---

**Happy auditing!** 🛡️ Once set up, you'll have access to powerful contract analysis tools.
