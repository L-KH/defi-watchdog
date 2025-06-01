# 🛡️ DeFi Watchdog - Smart Contract Security Audit Tool

**FIXED VERSION** - Now with optimized performance, rate limiting, and no more infinite loops!

A comprehensive smart contract security analysis tool for web3 builders, featuring multi-tool scanning and AI-powered vulnerability detection.

## ✅ **Recent Fixes & Optimizations**

### 🔧 **Critical Fixes Applied:**
- **✅ Fixed infinite API request loops** - Added request deduplication and caching
- **✅ Fixed rate limiting issues** - Implemented proper rate limiting (4 req/sec max)
- **✅ Fixed browser crashes** - Prevented multiple simultaneous requests
- **✅ Fixed duplicate route warnings** - Cleaned up duplicate API endpoints
- **✅ Fixed download errors** - Improved report generation without external API dependency
- **✅ Enhanced error handling** - Better user feedback and graceful fallbacks

### 🚀 **Performance Improvements:**
- **Request Caching**: API responses cached for 5 minutes to prevent redundant calls
- **Request Deduplication**: Multiple identical requests are merged into a single call
- **Rate Limiting**: Built-in rate limiting prevents API abuse
- **Smart Loading States**: Better UX with proper loading indicators
- **Optimized Error Recovery**: Graceful handling of API failures

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
# or
yarn install
```

### 2. Set Up API Keys
Copy the example environment file and add your API keys:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your API keys:
```env
# Blockchain Explorer API Keys (Required)
LINEASCAN_API_KEY=your_lineascan_api_key_here
SONICSCAN_API_KEY=your_sonicscan_api_key_here

# AI API Keys (Optional but recommended)
DEEPSEEK_API_KEY=your_deepseek_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Get Free API Keys

#### LineaScan API Key
1. Visit [https://lineascan.build/apis](https://lineascan.build/apis)
2. Create a free account
3. Generate an API key
4. Add to `.env.local` as `LINEASCAN_API_KEY`

#### SonicScan API Key
1. Visit [https://sonicscan.org/apis](https://sonicscan.org/apis)
2. Create a free account
3. Generate an API key
4. Add to `.env.local` as `SONICSCAN_API_KEY`

#### DeepSeek API Key (Optional)
1. Visit [https://platform.deepseek.com/api_keys](https://platform.deepseek.com/api_keys)
2. Create an account and get API key
3. Add to `.env.local` as `DEEPSEEK_API_KEY`

### 4. Run the Development Server
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔍 Features

### 🛠️ Multi-Tool Security Analysis
- **Slither**: Static analysis for Solidity smart contracts
- **Mythril**: Security analysis tool for Ethereum smart contracts
- **Semgrep**: Fast, open-source, static analysis engine
- **Pattern Matcher**: Custom vulnerability pattern detection

### 🤖 AI-Powered Analysis
- **DeepSeek Coder**: Advanced AI model for code analysis
- **Custom Security Prompts**: Tailored vulnerability assessment
- **Risk Scoring**: AI-driven security scoring

### 🌐 Supported Networks
- **Linea Network**: LineaScan integration
- **Sonic Network**: SonicScan integration
- **Ethereum Mainnet**: Etherscan integration (coming soon)

### 📄 Report Generation
- **JSON**: Machine-readable format
- **CSV**: Spreadsheet-friendly format
- **HTML**: Styled web reports
- **XML**: Structured data format
- **PDF**: Print-ready reports (via browser print)

## 🛠️ Usage

1. **Load Contract**: Enter a contract address or paste a LineaScan/SonicScan URL
2. **Security Scan**: Run comprehensive analysis using security tools
3. **AI Analysis**: Get AI-powered vulnerability assessment
4. **Review Results**: Examine findings and download reports

### Example Contracts for Testing

#### Linea Network
- **DEX Router**: `0x2d8879046f1559e53eb052e949e9544bcb72f414`
- **DEX Pool**: `0x610d2f07b7edc67565160f587f37636194c34e74`

#### Sonic Network
- **Swap Router**: `0xDd0F30DdC0D6B16B3e1E40bd7e95854246Ec3A13`
- **Staking Contract**: `0x19B25E3f1B8d35a2C5a805c0b271ECeBE1E8A4Ec`

## 🔧 Configuration

### Environment Variables
| Variable | Required | Description |
|----------|----------|-------------|
| `LINEASCAN_API_KEY` | Yes | LineaScan API key for Linea contracts |
| `SONICSCAN_API_KEY` | Yes | SonicScan API key for Sonic contracts |
| `DEEPSEEK_API_KEY` | Optional | DeepSeek API for AI analysis |
| `OPENAI_API_KEY` | Optional | OpenAI API for enhanced AI features |

### Performance Settings
- **Cache Duration**: 5 minutes (configurable in `contractScannerApi.js`)
- **Rate Limit**: 4 requests per second (configurable in `etherscan.js`)
- **Request Timeout**: 30 seconds for AI analysis

## 📁 Project Structure

```
src/
├── components/
│   ├── audit/           # Audit tool components
│   │   ├── ApiSetupGuide.js    # API setup instructions
│   │   ├── ToolsScanCard.js    # Security tools interface
│   │   ├── AIScanCard.js       # AI analysis interface
│   │   └── ScanResults.js      # Results display
│   └── layout/          # Layout components
├── lib/
│   ├── deepseek.js     # AI analysis integration (optimized)
│   └── etherscan.js    # Blockchain explorer APIs (rate limited)
├── pages/
│   ├── api/            # API routes
│   │   ├── contract-source.js  # Contract fetching (enhanced error handling)
│   │   └── key/        # API key management
│   └── audit.js        # Main audit page (optimized)
└── services/
    └── contractScannerApi.js  # Scanner API client (with caching)
```

## 🐛 Troubleshooting

### Common Issues

#### "Contract source code not available"
- ✅ Ensure the contract is verified on the respective blockchain explorer
- ✅ Check if the address is correct (40 characters, starts with 0x)
- ✅ Try switching networks if unsure
- ✅ Verify API keys are properly configured

#### "API key not configured"
- ✅ Verify API keys are added to `.env.local`
- ✅ Restart the development server after adding keys
- ✅ Check API key validity on the respective platforms

#### "Rate limit exceeded"
- ✅ Wait a few seconds - the app now handles rate limits automatically
- ✅ Check if you're making too many requests manually
- ✅ Clear cache if needed: `ContractScannerAPI.clearCache()` in browser console

#### Scanner Offline
- ✅ The external scanner service may be temporarily unavailable
- ✅ AI analysis will still work independently
- ✅ Check scanner status in the audit interface

### Debug Mode
Enable debug logging by opening browser console and running:
```javascript
// Check cache status
ContractScannerAPI.getCacheStats()

// Clear cache if needed
ContractScannerAPI.clearCache()

// View current environment
console.log('Environment loaded:', !!process.env.LINEASCAN_API_KEY)
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Security Tools**: Slither, Mythril, Semgrep communities
- **AI Models**: DeepSeek for code analysis capabilities
- **Blockchain Explorers**: LineaScan, SonicScan for API access
- **Web3 Community**: For continuous feedback and support

---

**Built for Web3 builders by Web3 builders** 🚀

Need help? Open an issue or join our community discussions!
