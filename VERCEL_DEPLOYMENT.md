# Vercel Deployment Guide for DeFi Watchdog

## Prerequisites

1. Vercel account (https://vercel.com)
2. OpenRouter API key for client-side AI analysis
3. GitHub repository with your code

## Environment Setup

### 1. Set Environment Variables in Vercel Dashboard

Go to your project settings in Vercel and add these environment variables:

```bash
# Required for AI Analysis
NEXT_PUBLIC_OPENROUTER_API_KEY=your_openrouter_api_key_here
NEXT_PUBLIC_USE_CLIENT_AI=true

# Blockchain Explorer APIs
LINEASCAN_API_KEY=your_lineascan_api_key
SONICSCAN_API_KEY=your_sonicscan_api_key

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app

# Scanner API
SCANNER_API_BASE=http://89.147.103.119
```

### 2. Get OpenRouter API Key

1. Sign up at https://openrouter.ai
2. Create a new API key
3. Set rate limits for security (recommended: 100 requests/day)
4. Add allowed domains (your Vercel domain)

### 3. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Or connect GitHub repo for automatic deployments
```

## Important Notes

### Client-Side AI Analysis

Due to Vercel's 10-second function timeout, AI analysis runs directly in the browser:
- API keys are exposed to the client (use rate-limited keys)
- Analysis may take 1-5 minutes depending on contract size
- Progress indicators show real-time updates

### Security Considerations

1. **API Key Security**:
   - Use a separate OpenRouter API key for production
   - Set strict rate limits (100-500 requests/day)
   - Add domain restrictions to your Vercel domain

2. **CORS Settings**:
   - OpenRouter handles CORS automatically
   - Scanner API (89.147.103.119) must allow your domain

### Performance Tips

1. **Build Optimization**:
   ```json
   // next.config.js
   {
     "swcMinify": true,
     "images": {
       "domains": ["your-domain.vercel.app"]
     }
   }
   ```

2. **Function Regions**:
   - Set function region close to your users
   - Use Edge functions where possible

### Troubleshooting

1. **"Function timeout" errors**:
   - Ensure `NEXT_PUBLIC_USE_CLIENT_AI=true` is set
   - Check browser console for client-side errors

2. **API key not working**:
   - Verify key starts with `NEXT_PUBLIC_`
   - Check rate limits haven't been exceeded
   - Ensure domain is whitelisted in OpenRouter

3. **Build failures**:
   - Clear cache: `vercel --force`
   - Check for missing dependencies
   - Verify all imports are correct

### Monitoring

1. **Vercel Analytics**:
   - Enable Web Analytics for performance monitoring
   - Check Function logs for errors

2. **API Usage**:
   - Monitor OpenRouter dashboard for usage
   - Set up alerts for rate limit warnings

## Production Checklist

- [ ] Set all required environment variables
- [ ] Configure rate-limited API keys
- [ ] Test AI analysis in production
- [ ] Enable Vercel Analytics
- [ ] Set up error monitoring
- [ ] Configure custom domain (optional)
- [ ] Test on multiple devices/browsers

## Support

For issues specific to:
- **Vercel deployment**: https://vercel.com/support
- **OpenRouter API**: https://openrouter.ai/docs
- **DeFi Watchdog**: Create an issue on GitHub
