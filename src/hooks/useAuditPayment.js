// Hook for handling audit payments and history
import { useState, useCallback, useEffect } from 'react';
import { useToast } from '../components/common/Toast';

// Contract ABI - only the functions we need
const AUDIT_PAYMENT_ABI = [
  "function AUDIT_PRICE() view returns (uint256)",
  "function requestAudit(address, string) payable returns (uint256)",
  "function auditRequests(uint256) view returns (address user, address contractToAudit, string contractName, uint256 paidAmount, uint256 timestamp, bool completed, string reportIPFSHash, uint256 securityScore, string riskLevel)",
  "function getUserRequests(address) view returns (uint256[])",
  "function getUserAuditHistory(address) view returns (tuple(address user, address contractToAudit, string contractName, uint256 paidAmount, uint256 timestamp, bool completed, string reportIPFSHash, uint256 securityScore, string riskLevel)[])",
  "function isAuditPaid(uint256) view returns (bool isPaid, address user)",
  "event AuditPaid(uint256 indexed requestId, address indexed user, address indexed contractToAudit, string contractName, uint256 paidAmount)"
];

export function useAuditPayment() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [userHistory, setUserHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [currentRequestId, setCurrentRequestId] = useState(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [userAddress, setUserAddress] = useState(null);
  const [ethers, setEthers] = useState(null);
  const { showError, showSuccess, showInfo } = useToast();
  
  const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_AUDIT_PAYMENT_ADDRESS;
  
  // Load ethers dynamically to avoid SES conflicts
  useEffect(() => {
    const loadEthers = async () => {
      try {
        const ethersModule = await import('ethers');
        setEthers(ethersModule);
      } catch (error) {
        console.error('Failed to load ethers:', error);
      }
    };
    loadEthers();
  }, []);
  
  // Check wallet connection on mount
  useEffect(() => {
    if (ethers) {
      checkWalletConnection();
      
      // Listen for account changes
      if (window.ethereum) {
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', () => window.location.reload());
      }
      
      return () => {
        if (window.ethereum) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        }
      };
    }
  }, [ethers]);
  
  // Load user history when wallet connects
  useEffect(() => {
    if (walletConnected && userAddress && ethers) {
      loadUserHistory();
    }
  }, [walletConnected, userAddress, ethers]);
  
  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      setWalletConnected(false);
      setUserAddress(null);
      setUserHistory([]);
    } else {
      setUserAddress(accounts[0]);
      setWalletConnected(true);
    }
  };
  
  const checkWalletConnection = async () => {
    if (!window.ethereum) {
      return false;
    }
    
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        setUserAddress(accounts[0]);
        setWalletConnected(true);
        return accounts[0];
      }
      return false;
    } catch (error) {
      console.error('Error checking wallet:', error);
      return false;
    }
  };
  
  const connectWallet = async () => {
    if (!window.ethereum) {
      showError("Please install MetaMask to use premium features!");
      return null;
    }
    
    try {
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (accounts.length > 0) {
        setUserAddress(accounts[0]);
        setWalletConnected(true);
        showSuccess("Wallet connected successfully!");
        return accounts[0];
      }
    } catch (error) {
      if (error.code === 4001) {
        showError("Please connect your wallet to continue");
      } else {
        showError("Failed to connect wallet: " + error.message);
      }
      return null;
    }
  };
  
  const switchToSepolia = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }], // Sepolia chainId in hex
      });
      return true;
    } catch (error) {
      if (error.code === 4902) {
        // Chain not added, let's add it
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0xaa36a7',
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
          showError("Failed to add Sepolia network");
          return false;
        }
      }
      showError("Failed to switch to Sepolia");
      return false;
    }
  };
  
  const payForAudit = async (contractAddress, contractName) => {
    if (!ethers) {
      showError("Ethers library not loaded. Please refresh the page.");
      return null;
    }
    
    try {
      setIsProcessing(true);
      
      // Check wallet connection
      let account = userAddress;
      if (!account) {
        account = await connectWallet();
        if (!account) return null;
      }
      
      // Check if contract address is provided
      if (!CONTRACT_ADDRESS) {
        showError("Payment contract not configured. Please check deployment.");
        return null;
      }
      
      // Get provider and signer
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await provider.getNetwork();
      
      // Check if on Sepolia
      if (network.chainId !== 11155111) {
        showInfo("Switching to Sepolia network...");
        const switched = await switchToSepolia();
        if (!switched) return null;
      }
      
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, AUDIT_PAYMENT_ABI, signer);
      
      // Get audit price
      const auditPrice = await contract.AUDIT_PRICE();
      const priceInEth = ethers.utils.formatEther(auditPrice);
      
      showInfo(`Requesting payment of ${priceInEth} ETH (~$10)...`);
      
      // Request audit with payment
      const tx = await contract.requestAudit(contractAddress, contractName || "Unknown Contract", {
        value: auditPrice,
        gasLimit: 200000 // Set reasonable gas limit
      });
      
      showInfo("Transaction sent! Waiting for confirmation...");
      
      // Wait for confirmation
      const receipt = await tx.wait();
      
      // Get request ID from event
      const event = receipt.events?.find(e => e.event === 'AuditPaid');
      const requestId = event?.args?.requestId?.toNumber();
      
      if (requestId) {
        setCurrentRequestId(requestId);
        
        // Store in localStorage for persistence
        const auditKey = `audit_${contractAddress}_${Date.now()}`;
        localStorage.setItem(auditKey, JSON.stringify({
          requestId,
          contractAddress,
          contractName,
          timestamp: Date.now(),
          txHash: receipt.transactionHash,
          user: account
        }));
        
        showSuccess(`Payment confirmed! Audit #${requestId} started.`);
        
        // Reload user history
        await loadUserHistory();
        
        return {
          success: true,
          requestId,
          txHash: receipt.transactionHash,
          priceInEth
        };
      } else {
        throw new Error("Failed to get request ID from transaction");
      }
      
    } catch (error) {
      console.error('Payment failed:', error);
      
      if (error.code === 'ACTION_REJECTED' || error.code === 4001) {
        showError("Transaction cancelled by user");
      } else if (error.message?.includes("insufficient funds")) {
        showError("Insufficient ETH balance. You need at least 0.003 ETH + gas fees.");
      } else {
        showError(`Payment failed: ${error.message || error}`);
      }
      
      return {
        success: false,
        error: error.message
      };
    } finally {
      setIsProcessing(false);
    }
  };
  
  const loadUserHistory = async () => {
    if (!CONTRACT_ADDRESS || !userAddress || !ethers) {
      console.log('Missing requirements:', { CONTRACT_ADDRESS: !!CONTRACT_ADDRESS, userAddress: !!userAddress, ethers: !!ethers });
      return;
    }
    
    try {
      setIsLoadingHistory(true);
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      
      // Check if contract exists
      const code = await provider.getCode(CONTRACT_ADDRESS);
      if (code === '0x') {
        console.error('No contract deployed at address:', CONTRACT_ADDRESS);
        showError('Payment contract not found. Please check deployment.');
        return;
      }
      
      const contract = new ethers.Contract(CONTRACT_ADDRESS, AUDIT_PAYMENT_ABI, provider);
      
      // Get user's audit history with error handling
      let history = [];
      try {
        history = await contract.getUserAuditHistory(userAddress);
      } catch (error) {
        console.log('getUserAuditHistory failed, trying getUserRequests fallback');
        // Fallback to getting request IDs and fetching individually
        const requestIds = await contract.getUserRequests(userAddress);
        const requests = [];
        for (const id of requestIds) {
          try {
            const request = await contract.auditRequests(id);
            requests.push(request);
          } catch (e) {
            console.error('Failed to fetch request', id, e);
          }
        }
        history = requests;
      }
      
      // Format history for display
      const formattedHistory = history.map((audit, index) => {
        try {
          // Handle different data formats (struct vs array)
          const timestamp = audit.timestamp ? 
            (typeof audit.timestamp === 'object' ? audit.timestamp.toNumber() : audit.timestamp) * 1000 : 
            Date.now();
          
          const securityScore = audit.securityScore ? 
            (typeof audit.securityScore === 'object' ? audit.securityScore.toNumber() : audit.securityScore) : 
            0;
            
          const paidAmount = audit.paidAmount ? 
            ethers.utils.formatEther(audit.paidAmount) : 
            '0';
          
          return {
            requestId: history.length - index, // Reverse order to show newest first
            contractAddress: audit.contractToAudit || audit[1] || '',
            contractName: audit.contractName || audit[2] || 'Unknown',
            timestamp: timestamp,
            completed: audit.completed || audit[5] || false,
            reportIPFSHash: audit.reportIPFSHash || audit[6] || '',
            securityScore: securityScore,
            riskLevel: audit.riskLevel || audit[8] || '',
            paidAmount: paidAmount
          };
        } catch (error) {
          console.error('Error formatting audit:', error, audit);
          return {
            requestId: index,
            contractAddress: 'Error',
            contractName: 'Error loading audit',
            timestamp: Date.now(),
            completed: false,
            reportIPFSHash: '',
            securityScore: 0,
            riskLevel: 'Unknown',
            paidAmount: '0'
          };
        }
      }).reverse(); // Show newest first
      
      setUserHistory(formattedHistory);
      
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };
  
  const checkPaymentStatus = async (requestId) => {
    if (!CONTRACT_ADDRESS || !requestId || !ethers) return null;
    
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, AUDIT_PAYMENT_ABI, provider);
      
      const [isPaid, user] = await contract.isAuditPaid(requestId);
      const auditData = await contract.auditRequests(requestId);
      
      return {
        isPaid,
        user,
        completed: auditData.completed,
        reportIPFSHash: auditData.reportIPFSHash,
        contractAddress: auditData.contractToAudit,
        contractName: auditData.contractName
      };
    } catch (error) {
      console.error('Failed to check payment:', error);
      return null;
    }
  };
  
  const getStoredAudits = () => {
    const audits = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('audit_')) {
        try {
          const audit = JSON.parse(localStorage.getItem(key));
          audits.push(audit);
        } catch (e) {
          console.error('Invalid audit data:', e);
        }
      }
    }
    return audits.sort((a, b) => b.timestamp - a.timestamp);
  };
  
  return {
    // Payment functions
    payForAudit,
    checkPaymentStatus,
    
    // Wallet functions
    connectWallet,
    checkWalletConnection,
    switchToSepolia,
    
    // State
    isProcessing,
    currentRequestId,
    walletConnected,
    userAddress,
    
    // History
    userHistory,
    isLoadingHistory,
    loadUserHistory,
    getStoredAudits,
    
    // Constants
    AUDIT_PRICE: "0.003",
    CONTRACT_ADDRESS,
    
    // Loading state
    ethersLoaded: !!ethers
  };
}
