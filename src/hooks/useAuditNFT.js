// src/hooks/useAuditNFT.js - Enhanced with real blockchain integration

import { useState, useCallback, useEffect } from 'react';
import { ethers } from 'ethers';

// Contract ABI (same as in Web3MintButton)
const AUDIT_NFT_ABI = [
  {
    "inputs": [{ "internalType": "address", "name": "user", "type": "address" }],
    "name": "getUserAudits",
    "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
    "name": "getAuditReport",
    "outputs": [
      { "internalType": "address", "name": "contractAddress", "type": "address" },
      { "internalType": "address", "name": "auditor", "type": "address" },
      { "internalType": "enum DeFiWatchdogAuditNFT.AuditType", "name": "auditType", "type": "uint8" },
      { "internalType": "enum DeFiWatchdogAuditNFT.RiskLevel", "name": "riskLevel", "type": "uint8" },
      { "internalType": "uint8", "name": "securityScore", "type": "uint8" },
      { "internalType": "string", "name": "ipfsHash", "type": "string" },
      { "internalType": "string", "name": "contractName", "type": "string" },
      { "internalType": "uint256", "name": "timestamp", "type": "uint256" },
      { "internalType": "uint256", "name": "paidAmount", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalAudits",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAuditTypeStats",
    "outputs": [
      { "internalType": "uint256", "name": "staticCount", "type": "uint256" },
      { "internalType": "uint256", "name": "aiCount", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getRiskLevelStats",
    "outputs": [
      { "internalType": "uint256", "name": "lowCount", "type": "uint256" },
      { "internalType": "uint256", "name": "mediumCount", "type": "uint256" },
      { "internalType": "uint256", "name": "highCount", "type": "uint256" },
      { "internalType": "uint256", "name": "criticalCount", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

const CONTRACT_ADDRESSES = {
  sepolia: process.env.NEXT_PUBLIC_AUDIT_NFT_CONTRACT || '0xc6a4bC646F5e6268a01b2F6c0bF754866e8a7b58',
  linea: '0xc6a4bC646F5e6268a01b2F6c0bF754866e8a7b58',
  'linea-testnet': '0xc6a4bC646F5e6268a01b2F6c0bF754866e8a7b58'
};

const NETWORK_CONFIG = {
  sepolia: { chainId: '0xaa36a7', name: 'Sepolia Testnet' },
  linea: { chainId: '0xe708', name: 'Linea Mainnet' },
  'linea-testnet': { chainId: '0xe705', name: 'Linea Testnet' }
};

// Enum mappings
const AUDIT_TYPE_MAP = { 0: 'STATIC', 1: 'AI_POWERED' };
const RISK_LEVEL_MAP = { 0: 'LOW', 1: 'MEDIUM', 2: 'HIGH', 3: 'CRITICAL' };

export function useAuditNFT() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [transaction, setTransaction] = useState(null);
  const [userAudits, setUserAudits] = useState([]);
  const [contractStats, setContractStats] = useState({
    totalAudits: 0,
    staticAudits: 0,
    aiAudits: 0
  });
  const [isConnected, setIsConnected] = useState(false);
  const [currentNetwork, setCurrentNetwork] = useState('sepolia');
  const [account, setAccount] = useState(null);

  // Check wallet connection and network
  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
          await detectNetwork();
        }
      } catch (error) {
        console.error('Failed to check wallet connection:', error);
      }
    }
  };

  const detectNetwork = async () => {
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const networkMapping = {
        '0xaa36a7': 'sepolia',
        '0xe708': 'linea',
        '0xe705': 'linea-testnet'
      };
      const detectedNetwork = networkMapping[chainId] || 'sepolia';
      setCurrentNetwork(detectedNetwork);
    } catch (error) {
      console.error('Failed to detect network:', error);
    }
  };

  const getContract = useCallback(() => {
    if (!window.ethereum || !isConnected) return null;
    
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contractAddress = CONTRACT_ADDRESSES[currentNetwork];
      
      if (!contractAddress) {
        console.error('Contract not deployed on', currentNetwork);
        return null;
      }
      
      // Check if provider is ready
      if (!provider || !provider.connection || !provider.connection.url) {
        console.warn('Provider not fully initialized');
        return null;
      }
      
      return new ethers.Contract(contractAddress, AUDIT_NFT_ABI, provider);
    } catch (error) {
      console.error('Failed to create contract instance:', error);
      return null;
    }
  }, [currentNetwork, isConnected]);

  // Load user audits from blockchain
  const loadUserAudits = useCallback(async () => {
    if (!account || !isConnected) {
      console.log('No account connected, loading from localStorage');
      loadFromLocalStorage();
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const contract = getContract();
      if (!contract) {
        console.log('No contract available, falling back to localStorage');
        loadFromLocalStorage();
        return;
      }

      console.log('Loading audits for account:', account);
      
      // Get user's token IDs
      const tokenIds = await contract.getUserAudits(account);
      console.log('Found token IDs:', tokenIds);
      
      if (tokenIds.length === 0) {
        console.log('No on-chain audits found, checking localStorage');
        loadFromLocalStorage();
        return;
      }

      // Get detailed audit data for each token
      const audits = [];
      for (const tokenId of tokenIds) {
        try {
          const auditData = await contract.getAuditReport(tokenId);
          const [
            contractAddress,
            auditor,
            auditType,
            riskLevel,
            securityScore,
            ipfsHash,
            contractName,
            timestamp,
            paidAmount
          ] = auditData;

          // Format the audit data
          const formattedAudit = {
            tokenId: tokenId.toString(),
            contractAddress,
            contractName,
            auditor,
            auditType: AUDIT_TYPE_MAP[auditType] || 'STATIC',
            riskLevel: RISK_LEVEL_MAP[riskLevel] || 'LOW',
            securityScore: securityScore,
            ipfsHash,
            timestamp: new Date(timestamp.toNumber() * 1000),
            paidAmount: ethers.utils.formatEther(paidAmount),
            onChain: true,
            network: currentNetwork,
            ipfsUrl: `https://gateway.pinata.cloud/ipfs/${ipfsHash}`
          };

          audits.push(formattedAudit);
        } catch (error) {
          console.error(`Failed to load audit ${tokenId}:`, error);
        }
      }

      // Merge with localStorage data
      const localAudits = getLocalStorageAudits();
      const allAudits = [...audits];
      
      // Add localStorage audits that aren't on-chain yet
      localAudits.forEach(localAudit => {
        const exists = audits.find(audit => audit.tokenId === localAudit.tokenId);
        if (!exists) {
          allAudits.push({
            ...localAudit,
            onChain: false
          });
        }
      });

      // Sort by timestamp (newest first)
      allAudits.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      setUserAudits(allAudits);
      console.log('Loaded total audits:', allAudits.length);
      
    } catch (error) {
      console.error('Failed to load blockchain audits:', error);
      setError(error.message);
      // Fallback to localStorage
      loadFromLocalStorage();
    } finally {
      setIsLoading(false);
    }
  }, [account, isConnected, currentNetwork, getContract]);

  const getLocalStorageAudits = () => {
    const audits = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('audit_nft_') || key?.startsWith('certificate_')) {
        try {
          const auditData = JSON.parse(localStorage.getItem(key));
          const formattedAudit = {
            tokenId: auditData.tokenId || key.split('_').pop(),
            contractAddress: auditData.contractAddress,
            contractName: auditData.contractName || auditData.auditResult?.contractName || 'Unknown Contract',
            auditor: auditData.userAddress || auditData.user,
            auditType: auditData.auditType === 'ai' ? 'AI_POWERED' : 'STATIC',
            riskLevel: auditData.riskLevel || auditData.auditResult?.riskLevel || 'LOW',
            securityScore: auditData.securityScore || auditData.auditResult?.securityScore || 75,
            ipfsHash: auditData.ipfsHash || auditData.ipfs?.ipfsHash || '',
            timestamp: auditData.timestamp ? new Date(auditData.timestamp) : new Date(),
            paidAmount: auditData.paidAmount || (auditData.auditType === 'ai' ? '0.003' : '0'),
            transactionHash: auditData.transactionHash || auditData.txHash,
            network: auditData.network || 'sepolia',
            ipfsUrl: auditData.ipfsUrl || auditData.ipfs?.ipfsUrl,
            onChain: auditData.onChain || false
          };
          audits.push(formattedAudit);
        } catch (e) {
          console.error('Error parsing audit data:', e);
        }
      }
    }
    return audits;
  };

  const loadFromLocalStorage = () => {
    const localAudits = getLocalStorageAudits();
    localAudits.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    setUserAudits(localAudits);
  };

  // Load contract stats
  const loadContractStats = useCallback(async () => {
    try {
      // First check if we have a proper window.ethereum
      if (!window.ethereum) {
        console.log('No ethereum provider, using fallback stats');
        const stats = {
          totalAudits: userAudits.length,
          staticAudits: userAudits.filter(a => a.auditType === 'STATIC').length,
          aiAudits: userAudits.filter(a => a.auditType === 'AI_POWERED').length
        };
        setContractStats(stats);
        return;
      }

      const contract = getContract();
      if (!contract) {
        // Fallback to localStorage stats
        const stats = {
          totalAudits: userAudits.length,
          staticAudits: userAudits.filter(a => a.auditType === 'STATIC').length,
          aiAudits: userAudits.filter(a => a.auditType === 'AI_POWERED').length
        };
        setContractStats(stats);
        return;
      }

      // Add a small delay to ensure provider is ready
      await new Promise(resolve => setTimeout(resolve, 100));

      try {
        // Try to call getTotalAudits first as a test
        const totalAudits = await contract.getTotalAudits();
        
        // If that works, try getAuditTypeStats
        const auditTypeStats = await contract.getAuditTypeStats();
        
        const stats = {
          totalAudits: totalAudits.toNumber(),
          staticAudits: auditTypeStats.staticCount.toNumber(),
          aiAudits: auditTypeStats.aiCount.toNumber()
        };
        
        setContractStats(stats);
      } catch (contractError) {
        console.warn('Contract call failed, using fallback stats:', contractError.message);
        // If contract calls fail, use fallback stats
        const stats = {
          totalAudits: userAudits.length,
          staticAudits: userAudits.filter(a => a.auditType === 'STATIC').length,
          aiAudits: userAudits.filter(a => a.auditType === 'AI_POWERED').length
        };
        setContractStats(stats);
      }
    } catch (error) {
      console.error('Failed to load contract stats:', error);
      // Fallback calculation
      const stats = {
        totalAudits: userAudits.length,
        staticAudits: userAudits.filter(a => a.auditType === 'STATIC').length,
        aiAudits: userAudits.filter(a => a.auditType === 'AI_POWERED').length
      };
      setContractStats(stats);
    }
  }, [getContract, userAudits]);

  // Load data when wallet connects
  useEffect(() => {
    if (isConnected && account) {
      loadUserAudits();
    } else {
      loadFromLocalStorage();
    }
  }, [isConnected, account, loadUserAudits]);
  
  // Load stats after audits are loaded, with a delay
  useEffect(() => {
    if (userAudits.length > 0 || isConnected) {
      // Delay loading stats to ensure provider is ready
      const timer = setTimeout(() => {
        loadContractStats();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [userAudits.length, isConnected, loadContractStats]);

  // Update stats when audits change
  useEffect(() => {
    if (userAudits.length > 0) {
      // Don't call loadContractStats here - it will be called separately
      // Just update the local counts
      const stats = {
        totalAudits: contractStats.totalAudits || userAudits.length,
        staticAudits: userAudits.filter(a => a.auditType === 'STATIC').length,
        aiAudits: userAudits.filter(a => a.auditType === 'AI_POWERED').length
      };
      setContractStats(prev => ({ ...prev, ...stats }));
    }
  }, [userAudits, contractStats.totalAudits]);

  // Legacy functions for compatibility
  const mintStaticAuditReport = useCallback(async (params) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const mockResult = {
        success: true,
        tokenId: Date.now().toString(),
        transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
        gasUsed: '150000',
        contractAddress: CONTRACT_ADDRESSES.sepolia,
        ...params
      };
      
      setTransaction({
        hash: mockResult.transactionHash,
        status: 'confirmed',
        blockNumber: mockResult.blockNumber,
        gasUsed: mockResult.gasUsed
      });
      
      setTimeout(() => loadUserAudits(), 1000);
      return mockResult;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [loadUserAudits]);

  const mintAIAuditReport = useCallback(async (params) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      const mockResult = {
        success: true,
        tokenId: Date.now().toString(),
        transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
        gasUsed: '200000',
        contractAddress: CONTRACT_ADDRESSES.sepolia,
        paidAmount: '0.003',
        ...params
      };
      
      setTransaction({
        hash: mockResult.transactionHash,
        status: 'confirmed',
        blockNumber: mockResult.blockNumber,
        gasUsed: mockResult.gasUsed
      });
      
      setTimeout(() => loadUserAudits(), 1000);
      return mockResult;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [loadUserAudits]);

  const checkContractHealth = useCallback(async () => {
    try {
      const contract = getContract();
      if (!contract) {
        return {
          isHealthy: false,
          name: 'DeFi Watchdog Audit NFT',
          symbol: 'DWARN',
          totalAudits: contractStats.totalAudits.toString(),
          address: CONTRACT_ADDRESSES[currentNetwork],
          network: `${NETWORK_CONFIG[currentNetwork]?.name} (No Connection)`
        };
      }

      const totalAudits = await contract.getTotalAudits();
      return {
        isHealthy: true,
        name: 'DeFi Watchdog Audit NFT',
        symbol: 'DWARN',
        totalAudits: totalAudits.toString(),
        address: CONTRACT_ADDRESSES[currentNetwork],
        network: NETWORK_CONFIG[currentNetwork]?.name
      };
    } catch (error) {
      console.error('Contract health check failed:', error);
      return {
        isHealthy: false,
        error: error.message,
        address: CONTRACT_ADDRESSES[currentNetwork],
        network: `${NETWORK_CONFIG[currentNetwork]?.name} (Error)`
      };
    }
  }, [getContract, contractStats, currentNetwork]);

  const getUserAudits = useCallback(async () => {
    return userAudits;
  }, [userAudits]);

  const getAuditReport = useCallback(async (tokenId) => {
    const audit = userAudits.find(a => a.tokenId === tokenId.toString());
    return audit || null;
  }, [userAudits]);

  const ensureSupportedNetwork = useCallback(async () => {
    if (!window.ethereum) return false;
    
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const supportedChains = Object.values(NETWORK_CONFIG).map(n => n.chainId);
      
      if (!supportedChains.includes(chainId)) {
        // Switch to Sepolia
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: NETWORK_CONFIG.sepolia.chainId }],
        });
        setCurrentNetwork('sepolia');
      }
      return true;
    } catch (error) {
      console.error('Failed to ensure supported network:', error);
      return false;
    }
  }, []);

  return {
    // State for audit-history page
    userAudits,
    contractStats,
    isLoading,
    isConnected,
    currentNetwork,
    account,
    
    // Original hook state
    error,
    transaction,
    
    // Contract info
    contractAddress: CONTRACT_ADDRESSES[currentNetwork],
    networkConfig: NETWORK_CONFIG[currentNetwork],
    
    // Actions for audit-history page
    loadUserAudits,
    loadContractStats,
    
    // Original actions
    mintStaticAuditReport,
    mintAIAuditReport,
    getUserAudits,
    getAuditReport,
    checkContractHealth,
    ensureSupportedNetwork,
    
    // Utils
    clearError: () => setError(null),
    clearTransaction: () => setTransaction(null)
  };
}