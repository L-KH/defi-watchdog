// Simple Web3 payment hook using ethers directly
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '../components/common/Toast';

// Contract ABI - only the functions we need
const AUDIT_PAYMENT_ABI = [
  "function AUDIT_PRICE() view returns (uint256)",
  "function requestAudit(address, string) payable returns (uint256)",
  "function auditRequests(uint256) view returns (address user, address contractToAudit, string contractName, uint256 paidAmount, uint256 timestamp, bool completed, string reportIPFSHash, uint256 securityScore, string riskLevel)",
  "function getUserRequests(address) view returns (uint256[])",
  "function getUserAuditHistory(address) view returns (tuple(address user, address contractToAudit, string contractName, uint256 paidAmount, uint256 timestamp, bool completed, string reportIPFSHash, uint256 securityScore, string riskLevel)[])",
  "event AuditPaid(uint256 indexed requestId, address indexed user, address indexed contractToAudit, string contractName, uint256 paidAmount)"
];

// Sepolia chain ID
const SEPOLIA_CHAIN_ID = 11155111;
const SEPOLIA_HEX = '0xaa36a7';

export function useSimpleWeb3() {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userHistory, setUserHistory] = useState([]);
  const [currentRequestId, setCurrentRequestId] = useState(null);
  const { showError, showSuccess, showInfo } = useToast();
  
  const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_AUDIT_PAYMENT_ADDRESS;
  
  // Check connection on mount
  useEffect(() => {
    checkConnection();
    
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);
  
  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      setIsConnected(false);
      setAddress(null);
      setUserHistory([]);
    } else {
      setAddress(accounts[0]);
      setIsConnected(true);
    }
  };
  
  const handleChainChanged = (chainId) => {
    setChainId(parseInt(chainId, 16));
    window.location.reload();
  };
  
  const checkConnection = async () => {
    if (!window.ethereum) return;
    
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      
      if (accounts.length > 0) {
        setAddress(accounts[0]);
        setIsConnected(true);
        setChainId(parseInt(chainId, 16));
      }
    } catch (error) {
      console.error('Error checking connection:', error);
    }
  };
  
  const connectWallet = async () => {
    if (!window.ethereum) {
      showError('Please install MetaMask!');
      return null;
    }
    
    try {
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (accounts.length > 0) {
        setAddress(accounts[0]);
        setIsConnected(true);
        
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        setChainId(parseInt(chainId, 16));
        
        showSuccess('Wallet connected!');
        return accounts[0];
      }
    } catch (error) {
      if (error.code === 4001) {
        showError('Connection cancelled');
      } else {
        showError('Failed to connect wallet');
      }
      return null;
    }
  };
  
  const switchToSepolia = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: SEPOLIA_HEX }],
      });
      setChainId(SEPOLIA_CHAIN_ID);
      return true;
    } catch (error) {
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: SEPOLIA_HEX,
              chainName: 'Sepolia Testnet',
              nativeCurrency: {
                name: 'Sepolia ETH',
                symbol: 'ETH',
                decimals: 18
              },
              rpcUrls: ['https://rpc.sepolia.org'],
              blockExplorerUrls: ['https://sepolia.etherscan.io/']
            }]
          });
          return true;
        } catch (addError) {
          showError('Failed to add Sepolia network');
          return false;
        }
      }
      showError('Failed to switch network');
      return false;
    }
  };
  
  const payForAudit = async (contractAddress, contractName) => {
    if (!CONTRACT_ADDRESS) {
      showError('Payment contract not configured');
      return null;
    }
    
    try {
      setIsProcessing(true);
      
      // Check connection
      if (!isConnected) {
        const account = await connectWallet();
        if (!account) return null;
      }
      
      // Check network
      if (chainId !== SEPOLIA_CHAIN_ID) {
        showInfo('Switching to Sepolia...');
        const switched = await switchToSepolia();
        if (!switched) return null;
      }
      
      // Import ethers dynamically
      const { ethers } = await import('ethers');
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      // Create contract instance
      const contract = new ethers.Contract(CONTRACT_ADDRESS, AUDIT_PAYMENT_ABI, signer);
      
      // Get price
      const price = await contract.AUDIT_PRICE();
      const priceInEth = ethers.utils.formatEther(price);
      
      showInfo(`Requesting payment of ${priceInEth} ETH...`);
      
      // Make payment
      const tx = await contract.requestAudit(contractAddress, contractName || "Unknown", {
        value: price,
        gasLimit: 200000
      });
      
      showInfo('Waiting for confirmation...');
      const receipt = await tx.wait();
      
      // Get request ID from event
      const event = receipt.events?.find(e => e.event === 'AuditPaid');
      const requestId = event?.args?.requestId?.toNumber();
      
      if (requestId) {
        setCurrentRequestId(requestId);
        showSuccess(`Payment confirmed! Audit #${requestId} started.`);
        await loadUserHistory();
        
        return {
          success: true,
          requestId,
          txHash: receipt.transactionHash
        };
      }
      
    } catch (error) {
      console.error('Payment failed:', error);
      
      if (error.code === 'ACTION_REJECTED' || error.code === 4001) {
        showError('Transaction cancelled');
      } else if (error.message?.includes('insufficient funds')) {
        showError('Insufficient ETH balance');
      } else {
        showError('Payment failed: ' + (error.reason || error.message));
      }
      
      return { success: false, error: error.message };
    } finally {
      setIsProcessing(false);
    }
  };
  
  const loadUserHistory = useCallback(async () => {
    if (!address || !CONTRACT_ADDRESS) return;
    
    try {
      const { ethers } = await import('ethers');
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, AUDIT_PAYMENT_ABI, provider);
      
      let history = [];
      try {
        history = await contract.getUserAuditHistory(address);
      } catch (error) {
        // Fallback
        const requestIds = await contract.getUserRequests(address);
        history = [];
        for (const id of requestIds) {
          const request = await contract.auditRequests(id);
          history.push(request);
        }
      }
      
      const formatted = history.map((audit, index) => ({
        requestId: history.length - index,
        contractAddress: audit.contractToAudit || audit[1],
        contractName: audit.contractName || audit[2],
        timestamp: (audit.timestamp?.toNumber() || audit[4]) * 1000,
        completed: audit.completed || audit[5],
        reportIPFSHash: audit.reportIPFSHash || audit[6],
        securityScore: audit.securityScore?.toNumber() || 0,
        riskLevel: audit.riskLevel || audit[8],
        paidAmount: ethers.utils.formatEther(audit.paidAmount || audit[3])
      })).reverse();
      
      setUserHistory(formatted);
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  }, [address, CONTRACT_ADDRESS]);
  
  // Load history when address changes
  useEffect(() => {
    if (address) {
      loadUserHistory();
    }
  }, [address, loadUserHistory]);
  
  return {
    // State
    isConnected,
    address,
    isCorrectNetwork: chainId === SEPOLIA_CHAIN_ID,
    chainId,
    
    // Actions
    connectWallet,
    switchToSepolia,
    payForAudit,
    
    // Processing
    isProcessing,
    currentRequestId,
    
    // History
    userHistory,
    refetchHistory: loadUserHistory,
    
    // Constants
    AUDIT_PRICE: '0.003',
    CONTRACT_ADDRESS
  };
}
