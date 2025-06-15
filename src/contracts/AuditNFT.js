// src/contracts/AuditNFT.js - Updated Contract configuration for frontend integration

// Import the compiled contract ABI
import AuditNFTArtifact from '../../artifacts/contracts/DeFiWatchdogAuditNFT.sol/DeFiWatchdogAuditNFT.json';

// Export the full ABI from the compiled contract
export const AUDIT_NFT_ABI = AuditNFTArtifact.abi;

// Contract addresses for different networks
export const AUDIT_NFT_ADDRESSES = {
  // Update these addresses after deployment
  sepolia: process.env.NEXT_PUBLIC_AUDIT_NFT_CONTRACT || "0xB4601DD107fe59E9B829f62A8dbeeD0009EF4EF1",
  linea: process.env.NEXT_PUBLIC_LINEA_AUDIT_NFT_CONTRACT || "",
  sonic: process.env.NEXT_PUBLIC_SONIC_AUDIT_NFT_CONTRACT || "",
  localhost: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
};

// Network configuration
export const NETWORK_CONFIG = {
  sepolia: {
    chainId: 11155111,
    name: 'Sepolia',
    rpcUrl: 'https://eth-sepolia.public.blastapi.io',
    blockExplorer: 'https://sepolia.etherscan.io',
    currency: { symbol: 'ETH', decimals: 18 }
  },
  linea: {
    chainId: 59144,
    name: 'Linea Mainnet',
    rpcUrl: 'https://rpc.linea.build',
    blockExplorer: 'https://lineascan.build',
    currency: { symbol: 'ETH', decimals: 18 }
  },
  sonic: {
    chainId: 146,
    name: 'Sonic',
    rpcUrl: 'https://mainnet.sonic.io/rpc',
    blockExplorer: 'https://sonicscan.org',
    currency: { symbol: 'SONIC', decimals: 18 }
  },
  localhost: {
    chainId: 31337,
    name: 'Localhost',
    rpcUrl: 'http://127.0.0.1:8545',
    blockExplorer: '',
    currency: { symbol: 'ETH', decimals: 18 }
  }
};

// Contract configuration
export const AUDIT_NFT_CONFIG = {
  name: "DeFi Watchdog Audit Report",
  symbol: "DWARN",
  aiAuditPrice: "0.003", // ETH
  staticAuditPrice: "0", // Free
  
  // Audit types (must match smart contract enum)
  AUDIT_TYPES: {
    STATIC: 0,
    AI_POWERED: 1
  },
  
  // Risk levels (must match smart contract enum)
  RISK_LEVELS: {
    LOW: 0,
    MEDIUM: 1,
    HIGH: 2,
    CRITICAL: 3
  }
};

// Helper function to get contract address for current network
export const getContractAddress = (chainId) => {
  switch (chainId) {
    case 11155111:
      return AUDIT_NFT_ADDRESSES.sepolia;
    case 59144:
      return AUDIT_NFT_ADDRESSES.linea;
    case 146:
      return AUDIT_NFT_ADDRESSES.sonic;
    case 31337:
      return AUDIT_NFT_ADDRESSES.localhost;
    default:
      return AUDIT_NFT_ADDRESSES.sepolia; // Default to sepolia
  }
};

// Helper function to get network config
export const getNetworkConfig = (chainId) => {
  switch (chainId) {
    case 11155111:
      return NETWORK_CONFIG.sepolia;
    case 59144:
      return NETWORK_CONFIG.linea;
    case 146:
      return NETWORK_CONFIG.sonic;
    case 31337:
      return NETWORK_CONFIG.localhost;
    default:
      return NETWORK_CONFIG.sepolia;
  }
};

// Helper function to map risk level to enum
export const getRiskLevelEnum = (riskLevel) => {
  const normalizedRisk = riskLevel?.toLowerCase();
  switch (normalizedRisk) {
    case 'low':
      return AUDIT_NFT_CONFIG.RISK_LEVELS.LOW;
    case 'medium':
      return AUDIT_NFT_CONFIG.RISK_LEVELS.MEDIUM;
    case 'high':
      return AUDIT_NFT_CONFIG.RISK_LEVELS.HIGH;
    case 'critical':
      return AUDIT_NFT_CONFIG.RISK_LEVELS.CRITICAL;
    default:
      return AUDIT_NFT_CONFIG.RISK_LEVELS.LOW;
  }
};

export default {
  ABI: AUDIT_NFT_ABI,
  ADDRESSES: AUDIT_NFT_ADDRESSES,
  CONFIG: AUDIT_NFT_CONFIG,
  NETWORK_CONFIG,
  getContractAddress,
  getNetworkConfig,
  getRiskLevelEnum
};
