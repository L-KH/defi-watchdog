import { useState, useEffect, useCallback } from 'react';

// Fallback version that doesn't require WagmiProvider
export function useEnhancedWeb3() {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userHistory, setUserHistory] = useState([]);
  const [currentRequestId, setCurrentRequestId] = useState(null);
  const [contractDiagnostics, setContractDiagnostics] = useState(null);
  
  const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_AUDIT_PAYMENT_ADDRESS;
  const SEPOLIA_CHAIN_ID = 11155111;
  const isCorrectNetwork = chainId === SEPOLIA_CHAIN_ID;

  // Basic Web3 detection
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      // Check if already connected
      window.ethereum.request({ method: 'eth_accounts' })
        .then(accounts => {
          if (accounts.length > 0) {
            setIsConnected(true);
            setAddress(accounts[0]);
          }
        })
        .catch(console.error);

      // Get chain ID
      window.ethereum.request({ method: 'eth_chainId' })
        .then(chainId => {
          setChainId(parseInt(chainId, 16));
        })
        .catch(console.error);

      // Listen for account changes
      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          setIsConnected(true);
          setAddress(accounts[0]);
        } else {
          setIsConnected(false);
          setAddress(null);
        }
      };

      // Listen for chain changes
      const handleChainChanged = (chainId) => {
        setChainId(parseInt(chainId, 16));
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, []);

  // Switch to Sepolia network
  const switchToSepolia = useCallback(async () => {
    if (!window.ethereum) return false;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }], // Sepolia
      });
      return true;
    } catch (error) {
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0xaa36a7',
              chainName: 'Sepolia Test Network',
              nativeCurrency: {
                name: 'ETH',
                symbol: 'ETH',
                decimals: 18
              },
              rpcUrls: ['https://sepolia.infura.io/v3/'],
              blockExplorerUrls: ['https://sepolia.etherscan.io/']
            }],
          });
          return true;
        } catch (addError) {
          console.error('Failed to add Sepolia network:', addError);
          return false;
        }
      }
      console.error('Failed to switch to Sepolia:', error);
      return false;
    }
  }, []);

  // Load user history from localStorage
  const loadUserHistory = useCallback(async () => {
    if (!address) return;

    try {
      const storedAudits = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('audit_')) {
          try {
            const audit = JSON.parse(localStorage.getItem(key));
            if (audit.user?.toLowerCase() === address.toLowerCase()) {
              storedAudits.push(audit);
            }
          } catch (e) {
            console.error('Invalid audit data:', e);
          }
        }
      }

      // Sort by timestamp
      storedAudits.sort((a, b) => b.timestamp - a.timestamp);

      const formatted = storedAudits.map((audit) => ({
        requestId: audit.requestId,
        contractAddress: audit.contractAddress,
        contractName: audit.contractName,
        timestamp: audit.timestamp,
        completed: audit.completed || false,
        reportIPFSHash: audit.reportIPFSHash || '',
        reportIPFSUrl: audit.reportIPFSUrl || '',
        hasIPFSReport: !!(audit.reportIPFSHash),
        securityScore: audit.securityScore || 0,
        riskLevel: audit.riskLevel || 'Pending',
        paidAmount: audit.paidAmount || '0.003',
        txHash: audit.txHash,
        ipfsViewUrl: audit.reportIPFSUrl || (audit.reportIPFSHash ? `https://gateway.pinata.cloud/ipfs/${audit.reportIPFSHash}` : null),
        ipfsDownloadUrl: audit.reportIPFSHash ? `https://gateway.pinata.cloud/ipfs/${audit.reportIPFSHash}` : null
      }));

      setUserHistory(formatted);
    } catch (error) {
      console.error('Failed to load user history:', error);
    }
  }, [address]);

  // Load history when address changes
  useEffect(() => {
    if (address) {
      loadUserHistory();
    } else {
      setUserHistory([]);
    }
  }, [address, loadUserHistory]);

  // Payment function (simplified for fallback mode)
  const payForAudit = async (contractAddress, contractName) => {
    if (!isConnected) {
      throw new Error('Wallet not connected');
    }

    if (!isCorrectNetwork) {
      const switched = await switchToSepolia();
      if (!switched) {
        throw new Error('Please switch to Sepolia network');
      }
    }

    setIsProcessing(true);

    try {
      // This is a simplified version - in fallback mode, we simulate the payment
      // In a real implementation, you'd want to use ethers.js here
      
      // Generate a mock request ID for demo purposes
      const requestId = Date.now();
      setCurrentRequestId(requestId);

      // Store in localStorage
      const auditData = {
        requestId,
        contractAddress,
        contractName: contractName || "Unknown Contract",
        timestamp: Date.now(),
        txHash: `0x${Math.random().toString(16).substr(2, 64)}`, // Mock transaction hash
        user: address,
        completed: false,
        securityScore: 0,
        riskLevel: 'Pending',
        reportIPFSHash: '',
        paidAmount: '0.003'
      };

      localStorage.setItem(`audit_${requestId}`, JSON.stringify(auditData));

      // Reload history
      await loadUserHistory();

      return {
        success: true,
        requestId,
        txHash: auditData.txHash,
        priceInEth: '0.003'
      };
    } catch (error) {
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    // Wallet state
    isConnected,
    isConnecting: false,
    address: address?.toLowerCase(),
    
    // Network state
    chainId,
    isCorrectNetwork,
    isSwitching: false,
    networkName: isCorrectNetwork ? 'Sepolia' : 'Wrong Network',
    
    // Actions
    switchToSepolia,
    payForAudit,
    
    // Processing state
    isProcessing,
    currentRequestId,
    
    // History
    userHistory,
    refetchHistory: loadUserHistory,
    
    // Constants
    AUDIT_PRICE: '0.003',
    CONTRACT_ADDRESS,
    
    // Fallback mode indicators
    hasAutoSwitched: false,
    contractDiagnostics,
    diagnoseContract: () => {},
    isInitialized: true
  };
}