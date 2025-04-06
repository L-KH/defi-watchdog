# DeFi Watchdog - Multi-Chain Smart Contract Security Auditor

DeFi Watchdog is an AI-powered smart contract auditing tool that helps users analyze contracts across multiple blockchains, find vulnerabilities, and receive security certifications for safe contracts.

## Features

- **Multi-Chain Support**: Analyze smart contracts on both Linea and Sonic blockchains
- **AI-Powered Analysis**: Uses multiple AI models to perform thorough security assessments
- **Detailed Vulnerability Reports**: Identifies and explains security issues with severity ratings
- **Gas Optimizations**: Network-specific optimization suggestions 
- **Security Scoring**: Comprehensive security score and risk assessment
- **NFT Certification**: Mint security certificates for contracts that pass audits
- **Patch Suggestions**: AI-generated patches for identified vulnerabilities

## Getting Started

### Prerequisites

Before running the application, you need to set up your environment:

1. Install Node.js (18.x or higher)
2. Set up API keys (create a `.env.local` file based on `.env.local.example`)
   - Required: `ETHERSCAN_API_KEY` and `OPENAI_API_KEY`
   - Optional: `LINEASCAN_API_KEY`, `SONICSCAN_API_KEY`, and `DEEPSEEK_API_KEY`

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/defi-watchdog.git
cd defi-watchdog

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Recent Updates

### Dashboard Optimizations (April 2025)

The dashboard has been completely rewritten to address several critical issues:

- **Fixed hydration issues** that were causing client/server rendering mismatches
- **Eliminated refresh loops** by properly managing component lifecycle and state updates
- **Enhanced data fetching** with parallel requests, proper error handling and recovery
- **Improved network detection** and better overall stability
- **Optimized UI components** with cleaner separation between client and server rendering

These improvements make the application much more reliable, especially when:
- Switching between networks
- Loading contract data
- Managing wallet connections

## Configuration

DeFi Watchdog uses environment variables for configuration. Create a `.env.local` file in the root directory with the following variables:

```
# API Keys (required)
ETHERSCAN_API_KEY=your_etherscan_api_key
OPENAI_API_KEY=your_openai_api_key

# Network-specific API keys (recommended)
LINEASCAN_API_KEY=your_lineascan_api_key
SONICSCAN_API_KEY=your_sonicscan_api_key
DEEPSEEK_API_KEY=your_deepseek_api_key

# MongoDB URI for data storage
MONGODB_URI=your_mongodb_connection_string

# Contract addresses for certificate minting
NEXT_PUBLIC_CONTRACT_ADDRESS_LINEA=your_linea_contract_address
NEXT_PUBLIC_CONTRACT_ADDRESS_SONIC=your_sonic_contract_address
```

## Network Support

### Linea Network

Linea support is fully implemented, allowing you to analyze contracts on the Linea blockchain. When using the Linea network:

1. Make sure your `LINEASCAN_API_KEY` or `ETHERSCAN_API_KEY` is configured 
2. Enter any verified contract address on Linea blockchain
3. Receive a comprehensive security analysis with vulnerabilities and recommendations

### Sonic Network

Sonic network integration uses a specialized API for blockchain-specific optimizations. When using the Sonic network:

1. Configure your `SONICSCAN_API_KEY` 
2. The analysis will be directed to the ZerePy system for Sonic-specific insights
3. Get gas optimization suggestions specifically designed for Sonic blockchain

## Project Structure

- `/src/pages/api/`: API endpoints for smart contract analysis
- `/src/lib/`: Core logic for contract analysis and blockchain integration
- `/src/components/`: React components for the UI
- `/src/pages/`: Application pages including audit interface
- `/contracts/`: Smart contract for NFT certificate minting

## Using DeFi Watchdog

1. Navigate to the Audit page
2. Enter a smart contract address and select the network (Linea or Sonic)
3. Click "Analyze Contract"
4. Review the detailed security assessment
5. If the contract passes safety checks, you can mint a security certificate NFT

## Troubleshooting

If you encounter issues:

1. Verify your API keys are configured correctly in `.env.local`
2. Check the network status in the Health API (`/api/health` endpoint)
3. Ensure the contract address is valid and verified on the selected network
4. Review server logs for detailed error messages

### Common Issues

- **Dashboard loading loop**: Use the new dashboard implementation at `/new/dashboard` or wait for the automatic redirect
- **Hydration errors**: Make sure you're using the latest version with the fixes for client/server rendering
- **Network switching problems**: Try connecting your wallet first, then switch networks in your wallet app

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Powered by OpenAI, Deepseek, and other AI technologies
- Blockchain data provided by LineaScan and SonicScan APIs