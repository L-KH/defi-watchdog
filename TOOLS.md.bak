# External Security Tools Integration

DeFi Watchdog supports integration with popular Ethereum smart contract security tools. This guide explains how to set up these tools to enable full functionality.

## Supported Tools

Currently, the following tools are supported:

1. **Slither** - A Solidity static analysis framework by Trail of Bits
2. **MythX** - A security analysis API for Ethereum smart contracts

## Installation Instructions

### Slither

Slither is a static analysis framework for Solidity that can detect vulnerabilities, enhance code understanding, and help with smart contract optimization.

#### Prerequisites:
- Python 3.6+ and pip
- Node.js 16+
- solc (Solidity compiler)

#### Installation:

1. Install Slither using pip:

```bash
pip3 install slither-analyzer
```

2. Verify installation:

```bash
slither --version
```

For more details, see the [Slither documentation](https://github.com/crytic/slither).

### MythX

MythX is a security analysis API that requires an API key.

#### Setup:

1. Sign up for an account at [mythx.io](https://mythx.io)
2. Obtain your API key from the dashboard
3. Set the environment variable:

```bash
export MYTHX_API_KEY=your_api_key_here
```

For more details, see the [MythX documentation](https://docs.mythx.io/).

## How Tool Analysis Works

When you select "Tool Analysis" in the DeFi Watchdog interface:

1. The application will first try to use installed tools (Slither, MythX) if available
2. If a tool is not installed or encounters an error, the application will use simulated results
3. Results from all available tools are combined into a single report

## Adding Your Own Tools

You can extend the tool analysis by modifying the following files:

- `src/pages/api/tools/analyze.js` - Backend API that executes the tools
- `src/lib/tools-analyzer.js` - Frontend integration for tool analysis

## Troubleshooting

If you encounter issues with tool analysis:

1. Check if the tools are correctly installed by running them directly from the command line
2. Verify that proper permissions are set for the application to execute external tools
3. Check the server logs for any execution errors
4. For MythX-specific issues, verify your API key is valid

## Fallback Mechanism

If tools are not available or encounter errors, the application will automatically fall back to simulated analysis based on pattern matching. While this is less comprehensive than running the actual tools, it provides a reasonable approximation for basic issues.
