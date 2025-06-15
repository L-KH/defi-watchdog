// src/config/web3.js - Modern Web3 Configuration
import { http, createConfig } from 'wagmi'
import { sepolia, mainnet } from 'wagmi/chains'
import { metaMask, walletConnect } from 'wagmi/connectors'

// Define chain configurations
export const sepoliaChain = {
  ...sepolia,
  rpcUrls: {
    default: {
      http: ['https://eth-sepolia.public.blastapi.io']
    },
    public: {
      http: ['https://eth-sepolia.public.blastapi.io']
    }
  }
}

// Wallet connectors
const connectors = [
  metaMask(),
  walletConnect({
    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '142eb630219aa2039a04babd028ba730'
  })
]

// Create Wagmi config
export const wagmiConfig = createConfig({
  chains: [sepoliaChain, mainnet],
  connectors,
  transports: {
    [sepolia.id]: http('https://eth-sepolia.public.blastapi.io'),
    [mainnet.id]: http()
  }
})

// Contract configurations
export const CONTRACTS = {
  AUDIT_NFT: {
    address: process.env.NEXT_PUBLIC_AUDIT_NFT_CONTRACT || '0x46E086aac77023AD6E1EA65cC23A6f0Fa91Cf118',
    abi: [
      {
        "inputs": [
          {"internalType": "address", "name": "contractAddress", "type": "address"},
          {"internalType": "string", "name": "contractName", "type": "string"},
          {"internalType": "string", "name": "ipfsHash", "type": "string"},
          {"internalType": "uint8", "name": "securityScore", "type": "uint8"},
          {"internalType": "uint8", "name": "riskLevel", "type": "uint8"}
        ],
        "name": "mintStaticAuditReport",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {"internalType": "address", "name": "contractAddress", "type": "address"},
          {"internalType": "string", "name": "contractName", "type": "string"},
          {"internalType": "string", "name": "ipfsHash", "type": "string"},
          {"internalType": "uint8", "name": "securityScore", "type": "uint8"},
          {"internalType": "uint8", "name": "riskLevel", "type": "uint8"}
        ],
        "name": "mintAIAuditReport",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
        "name": "getAuditReport",
        "outputs": [
          {"internalType": "address", "name": "contractAddress", "type": "address"},
          {"internalType": "address", "name": "auditor", "type": "address"},
          {"internalType": "uint8", "name": "auditType", "type": "uint8"},
          {"internalType": "uint8", "name": "riskLevel", "type": "uint8"},
          {"internalType": "uint8", "name": "securityScore", "type": "uint8"},
          {"internalType": "string", "name": "ipfsHash", "type": "string"},
          {"internalType": "string", "name": "contractName", "type": "string"},
          {"internalType": "uint256", "name": "timestamp", "type": "uint256"},
          {"internalType": "uint256", "name": "paidAmount", "type": "uint256"}
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ]
  }
}

// Chain constants
export const SUPPORTED_CHAINS = {
  SEPOLIA: 11155111,
  MAINNET: 1
}

// Risk level mappings
export const RISK_LEVELS = {
  LOW: 0,
  MEDIUM: 1,
  HIGH: 2,
  CRITICAL: 3
}

// Utility functions
export const getRiskLevelEnum = (level) => {
  switch(level?.toLowerCase()) {
    case 'low': return RISK_LEVELS.LOW
    case 'medium': return RISK_LEVELS.MEDIUM
    case 'high': return RISK_LEVELS.HIGH
    case 'critical': return RISK_LEVELS.CRITICAL
    default: return RISK_LEVELS.LOW
  }
}

export const formatAddress = (address) => {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export const getExplorerUrl = (txHash, chainId = SUPPORTED_CHAINS.SEPOLIA) => {
  if (chainId === SUPPORTED_CHAINS.SEPOLIA) {
    return `https://sepolia.etherscan.io/tx/${txHash}`
  }
  return `https://etherscan.io/tx/${txHash}`
}