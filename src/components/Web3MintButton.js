import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ethers } from 'ethers';

// Updated Contract ABI from the compiled contract (complete ABI)
const AUDIT_NFT_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "sender", "type": "address" },
      { "internalType": "uint256", "name": "tokenId", "type": "uint256" },
      { "internalType": "address", "name": "owner", "type": "address" }
    ],
    "name": "ERC721IncorrectOwner",
    "type": "error"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "operator", "type": "address" },
      { "internalType": "uint256", "name": "tokenId", "type": "uint256" }
    ],
    "name": "ERC721InsufficientApproval",
    "type": "error"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "approver", "type": "address" }
    ],
    "name": "ERC721InvalidApprover",
    "type": "error"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "operator", "type": "address" }
    ],
    "name": "ERC721InvalidOperator",
    "type": "error"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "owner", "type": "address" }
    ],
    "name": "ERC721InvalidOwner",
    "type": "error"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "receiver", "type": "address" }
    ],
    "name": "ERC721InvalidReceiver",
    "type": "error"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "sender", "type": "address" }
    ],
    "name": "ERC721InvalidSender",
    "type": "error"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "tokenId", "type": "uint256" }
    ],
    "name": "ERC721NonexistentToken",
    "type": "error"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "owner", "type": "address" }
    ],
    "name": "OwnableInvalidOwner",
    "type": "error"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "account", "type": "address" }
    ],
    "name": "OwnableUnauthorizedAccount",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ReentrancyGuardReentrantCall",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "owner", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "approved", "type": "address" },
      { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "owner", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "operator", "type": "address" },
      { "indexed": false, "internalType": "bool", "name": "approved", "type": "bool" }
    ],
    "name": "ApprovalForAll",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "contractAddress", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "auditor", "type": "address" },
      { "indexed": false, "internalType": "enum DeFiWatchdogAuditNFT.AuditType", "name": "auditType", "type": "uint8" },
      { "indexed": false, "internalType": "enum DeFiWatchdogAuditNFT.RiskLevel", "name": "riskLevel", "type": "uint8" },
      { "indexed": false, "internalType": "uint8", "name": "securityScore", "type": "uint8" },
      { "indexed": false, "internalType": "string", "name": "ipfsHash", "type": "string" },
      { "indexed": false, "internalType": "uint256", "name": "paidAmount", "type": "uint256" }
    ],
    "name": "AuditReportMinted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "user", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" },
      { "indexed": false, "internalType": "enum DeFiWatchdogAuditNFT.AuditType", "name": "auditType", "type": "uint8" }
    ],
    "name": "PaymentReceived",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "from", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "to", "type": "address" },
      { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "AI_AUDIT_PRICE",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "STATIC_AUDIT_PRICE", 
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "contractAddress", "type": "address" },
      { "internalType": "string", "name": "contractName", "type": "string" },
      { "internalType": "string", "name": "ipfsHash", "type": "string" },
      { "internalType": "uint8", "name": "securityScore", "type": "uint8" },
      { "internalType": "enum DeFiWatchdogAuditNFT.RiskLevel", "name": "riskLevel", "type": "uint8" }
    ],
    "name": "mintStaticAuditReport",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "contractAddress", "type": "address" },
      { "internalType": "string", "name": "contractName", "type": "string" },
      { "internalType": "string", "name": "ipfsHash", "type": "string" },
      { "internalType": "uint8", "name": "securityScore", "type": "uint8" },
      { "internalType": "enum DeFiWatchdogAuditNFT.RiskLevel", "name": "riskLevel", "type": "uint8" }
    ],
    "name": "mintAIAuditReport",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "payable",
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
    "inputs": [{ "internalType": "address", "name": "user", "type": "address" }],
    "name": "getUserAudits",
    "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }],
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
    "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "name": "hasCertificate",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
    "name": "ownerOf",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  }
];

// Contract addresses by network - Using demo contract that allows any address
const CONTRACT_ADDRESSES = {
  sepolia: process.env.NEXT_PUBLIC_AUDIT_NFT_CONTRACT || '0xc6a4bC646F5e6268a01b2F6c0bF754866e8a7b58',
  linea: '0xc6a4bC646F5e6268a01b2F6c0bF754866e8a7b58', // Demo contract
  'linea-testnet': '0xc6a4bC646F5e6268a01b2F6c0bF754866e8a7b58'
};

const NETWORK_CONFIG = {
  sepolia: {
    chainId: '0xaa36a7',
    name: 'Sepolia Testnet',
    rpcUrl: 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',
    explorerUrl: 'https://sepolia.etherscan.io'
  },
  linea: {
    chainId: '0xe708',
    name: 'Linea Mainnet',
    rpcUrl: 'https://rpc.linea.build',
    explorerUrl: 'https://lineascan.build'
  },
  'linea-testnet': {
    chainId: '0xe705',
    name: 'Linea Testnet',
    rpcUrl: 'https://rpc.goerli.linea.build',
    explorerUrl: 'https://goerli.lineascan.build'
  }
};

// Risk level enum mapping (contract uses 0,1,2,3 for LOW,MEDIUM,HIGH,CRITICAL)
const RISK_LEVEL_MAP = {
  'Low': 0,
  'Medium': 1,
  'High': 2,
  'Critical': 3,
  'LOW': 0,
  'MEDIUM': 1,
  'HIGH': 2,
  'CRITICAL': 3
};

export default function Web3MintButton({ 
  contractAddress, 
  auditData, 
  onMintComplete,
  auditType = 'static', // Changed default to 'static' for free minting
  demoMode = false // Add demo mode for testing
}) {
  const router = useRouter();
  const [step, setStep] = useState('ready');
  const [progress, setProgress] = useState(0);
  const [account, setAccount] = useState(null);
  const [network, setNetwork] = useState('sepolia');
  const [error, setError] = useState(null);
  const [txHash, setTxHash] = useState(null);
  const [tokenId, setTokenId] = useState(null);
  const [ipfsData, setIpfsData] = useState(null);

  // Check wallet connection
  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
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
      setNetwork(detectedNetwork);
    } catch (error) {
      console.error('Failed to detect network:', error);
      setNetwork('sepolia');
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError('MetaMask not installed. Please install MetaMask to continue.');
      return false;
    }

    try {
      setStep('connecting');
      setError(null);
      
      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (accounts.length > 0) {
        console.log('🔐 Wallet connected:', accounts[0]);
        setAccount(accounts[0]);
        await detectNetwork();
        setStep('ready');
        return true;
      } else {
        setError('No accounts available. Please unlock MetaMask.');
        setStep('ready');
        return false;
      }
    } catch (error) {
      console.error('Wallet connection failed:', error);
      
      // Handle specific error cases
      if (error.code === 4001) {
        setError('Connection rejected by user. Please approve the connection in MetaMask.');
      } else if (error.code === -32002) {
        setError('Connection request already pending. Please check MetaMask.');
      } else {
        setError('Failed to connect wallet: ' + (error.message || 'Unknown error'));
      }
      
      setStep('ready');
      return false;
    }
  };

  const switchNetwork = async (targetNetwork) => {
    const config = NETWORK_CONFIG[targetNetwork];
    if (!config) return false;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: config.chainId }],
      });
      
      setNetwork(targetNetwork);
      return true;
    } catch (error) {
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: config.chainId,
              chainName: config.name,
              rpcUrls: [config.rpcUrl],
              blockExplorerUrls: [config.explorerUrl]
            }]
          });
          setNetwork(targetNetwork);
          return true;
        } catch (addError) {
          console.error('Failed to add network:', addError);
          setError('Failed to add network to MetaMask');
          return false;
        }
      } else {
        console.error('Failed to switch network:', error);
        setError('Failed to switch network');
        return false;
      }
    }
  };

  const uploadToIPFS = async (data) => {
    try {
      setProgress(20);
      
      // Enhanced IPFS upload with better error handling
      console.log('📡 Uploading audit data to IPFS...', {
        contractAddress: data.contractAddress,
        contractName: data.contractName,
        auditType: data.auditType,
        dataSize: JSON.stringify(data).length
      });
      
      // Prepare data in the format expected by the API
      const ipfsPayload = {
        // Required fields that the API expects
        contractAddress: data.contractAddress,
        userAddress: data.userAddress || account, // Use account if userAddress not provided
        contractName: data.contractName || 'Analyzed Contract',
        
        // Audit results in the format expected by the API
        auditResult: {
          analysis: {
            summary: data.auditResult?.summary || data.executiveSummary || 'Security analysis completed successfully.',
            overview: data.auditResult?.summary || data.executiveSummary || 'Security analysis completed successfully.',
            keyFindings: data.auditResult?.findings || [],
            gasOptimizations: data.auditResult?.gasOptimizations || [],
            codeQualityIssues: data.auditResult?.codeQualityIssues || [],
            securityScore: data.securityScore || 75,
            gasOptimizationScore: data.auditResult?.gasScore || 80,
            codeQualityScore: data.auditResult?.qualityScore || 85,
            overallScore: data.securityScore || 75
          },
          modelsUsed: data.auditResult?.modelsUsed || ['Analysis Engine'],
          processingTime: data.auditResult?.processingTime || '2.5 minutes'
        },
        
        // Scores and risk level
        securityScore: data.securityScore || 75,
        riskLevel: data.riskLevel || 'Low',
        
        // Additional metadata
        requestId: `web3-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        network: data.network || 'sepolia',
        timestamp: data.timestamp || new Date().toISOString(),
        auditType: data.auditType || 'static',
        platform: data.platform || 'DeFi Watchdog',
        version: data.version || '1.0',
        certificateType: data.certificateType || 'Static Analysis Certificate',
        
        // Flag to indicate this is a Web3 IPFS-only upload
        onlyIPFS: true
      };
      
      console.log('📦 Sending to IPFS API:', {
        contractAddress: ipfsPayload.contractAddress,
        userAddress: ipfsPayload.userAddress,
        contractName: ipfsPayload.contractName,
        hasAuditResult: !!ipfsPayload.auditResult,
        onlyIPFS: ipfsPayload.onlyIPFS
      });
      
      const response = await fetch('/api/save-audit-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ipfsPayload)
      });

      const result = await response.json();
      console.log('📡 IPFS API Response:', result);
      
      if (result.success && result.ipfs?.hash) {
        setProgress(40);
        console.log('✅ IPFS upload successful:', result.ipfs);
        return {
          ipfsHash: result.ipfs.hash,
          ipfsUrl: result.ipfs.url || `https://ipfs.io/ipfs/${result.ipfs.hash}`
        };
      } else {
        throw new Error(result.error || 'IPFS upload failed - no hash returned');
      }
    } catch (error) {
      console.error('IPFS upload failed:', error);
      throw new Error(`IPFS upload failed: ${error.message}`);
    }
  };

  const mintOnBlockchain = async (ipfsHash, auditInfo) => {
    try {
      setProgress(60);
      
      // Validate IPFS hash
      if (!ipfsHash || typeof ipfsHash !== 'string' || ipfsHash.length === 0) {
        throw new Error('Invalid IPFS hash: must be a non-empty string');
      }
      
      console.log('🔍 Validating IPFS hash:', {
        hash: ipfsHash,
        length: ipfsHash.length,
        type: typeof ipfsHash
      });
      
      // Verify MetaMask is available and connected
      if (!window.ethereum) {
        throw new Error('MetaMask not installed. Please install MetaMask to continue.');
      }
      
      // Check if we have an account
      if (!account) {
        throw new Error('No account connected. Please connect your wallet first.');
      }
      
      // Use the account we already have
      const signerAddress = account;
      console.log('👤 Using signer address:', signerAddress);
      
      // Validate contract address being audited
      let targetContractAddress = contractAddress;
      if (!targetContractAddress || !ethers.utils.isAddress(targetContractAddress)) {
        // Generate a random address for demo since the new contract allows any address
        const timestamp = Date.now().toString(16);
        const randomPart = Math.random().toString(16).substr(2, 8);
        targetContractAddress = ethers.utils.getAddress(
          '0x' + (timestamp + randomPart).padEnd(40, '0').slice(-40)
        );
        console.log('⚠️ Using generated demo address:', targetContractAddress);
      }
      
      // Get provider and signer first
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.ready;
      const signer = provider.getSigner();
      
      const contractAddr = CONTRACT_ADDRESSES[network];
      if (!contractAddr) {
        throw new Error(`Contract not deployed on ${network}. Please switch to Sepolia network.`);
      }
      
      console.log('🔗 Connecting to contract for certificate check...', {
        contractAddress: contractAddr,
        network: network,
        userAccount: account
      });
      
      const contract = new ethers.Contract(contractAddr, AUDIT_NFT_ABI, signer);
      
      // With the demo contract, we can use any address - no need for complex validation
      console.log('🎭 Using demo contract that allows any address');
      
      // In demo mode, generate a unique address to avoid conflicts
      if (demoMode) {
        const timestamp = Date.now().toString(16);
        const randomPart = Math.random().toString(16).substr(2, 8);
        targetContractAddress = ethers.utils.getAddress(
          '0x' + (timestamp + randomPart).padEnd(40, '0').slice(-40)
        );
        console.log('🎭 Demo mode: Using unique generated address:', targetContractAddress);
      }
      
      // Determine risk level (ensure it's mapped to enum value)
      const riskLevel = RISK_LEVEL_MAP[auditInfo.riskLevel] !== undefined 
        ? RISK_LEVEL_MAP[auditInfo.riskLevel] 
        : 0; // Default to LOW
      
      // Ensure security score is in valid range
      const securityScore = Math.min(100, Math.max(0, Math.round(auditInfo.securityScore || 75)));
      
      // Prepare contract parameters with proper validation
      const contractParams = [
        ethers.utils.getAddress(targetContractAddress), // Ensure checksummed address
        auditInfo.contractName || 'Analyzed Contract',
        ipfsHash,
        securityScore,
        riskLevel
      ];
      
      console.log('🔗 Preparing to mint NFT...', {
        auditType,
        targetContractAddress,
        contractName: auditInfo.contractName,
        ipfsHash,
        ipfsHashLength: ipfsHash.length,
        securityScore,
        riskLevel: riskLevel,
        network,
        contractAddr
      });
      
      // Log exact parameters being sent
      console.log('📝 Contract call parameters:', {
        param0_address: contractParams[0],
        param1_name: contractParams[1],
        param2_ipfs: contractParams[2],
        param3_score: contractParams[3],
        param4_risk: contractParams[4]
      });
      
      setStep('blockchain');
      setProgress(70);
      
      let tx;
      if (auditType === 'ai') {
        // AI audit - paid function (0.003 ETH)
        const mintFee = ethers.utils.parseEther('0.003');
        console.log('💰 Minting AI audit with fee:', ethers.utils.formatEther(mintFee), 'ETH');
        
        // Check user balance first
        const balance = await provider.getBalance(signerAddress);
        console.log('💰 User balance:', ethers.utils.formatEther(balance), 'ETH');
        
        if (balance.lt(mintFee.add(ethers.utils.parseEther('0.002')))) { // Include gas estimate
          throw new Error('Insufficient ETH balance. You need at least 0.005 ETH (0.003 for minting + gas fees)');
        }
        
        tx = await contract.mintAIAuditReport(...contractParams, { 
          value: mintFee,
          gasLimit: 500000 // Set gas limit to avoid estimation issues
        });
      } else {
        // Static audit - free function (only gas fees)
        console.log('🆓 Minting static audit (free - only gas fees)');
        
        // Check user balance for gas fees
        const balance = await provider.getBalance(signerAddress);
        console.log('💰 User balance:', ethers.utils.formatEther(balance), 'ETH');
        
        if (balance.lt(ethers.utils.parseEther('0.002'))) { // Estimate for gas
          throw new Error('Insufficient ETH balance for gas fees. You need at least 0.002 ETH for transaction fees.');
        }
        
        // Call with explicit parameters instead of spread operator
        console.log('📝 Calling mintStaticAuditReport with params:', {
          contractAddress: contractParams[0],
          contractName: contractParams[1],
          ipfsHash: contractParams[2],
          securityScore: contractParams[3],
          riskLevel: contractParams[4]
        });
        
        try {
          // First try to estimate gas
          const estimatedGas = await contract.estimateGas.mintStaticAuditReport(
            contractParams[0],
            contractParams[1],
            contractParams[2],
            contractParams[3],
            contractParams[4]
          );
          console.log('⛽ Estimated gas:', estimatedGas.toString());
          
          // Add 20% buffer to estimated gas
          const gasLimit = estimatedGas.mul(120).div(100);
          
          tx = await contract.mintStaticAuditReport(
            contractParams[0], // contractAddress
            contractParams[1], // contractName
            contractParams[2], // ipfsHash
            contractParams[3], // securityScore
            contractParams[4], // riskLevel
            {
              gasLimit: gasLimit
            }
          );
        } catch (estimateError) {
          console.error('⚠️ Gas estimation failed:', estimateError);
          // Fall back to fixed gas limit
          tx = await contract.mintStaticAuditReport(
            contractParams[0], // contractAddress
            contractParams[1], // contractName
            contractParams[2], // ipfsHash
            contractParams[3], // securityScore
            contractParams[4], // riskLevel
            {
              gasLimit: 500000 // Higher gas limit
            }
          );
        }
      }
      
      setTxHash(tx.hash);
      setProgress(80);
      
      console.log('📋 Transaction sent:', tx.hash);
      console.log('⏳ Waiting for confirmation...');
      
      const receipt = await tx.wait();
      setProgress(100);
      
      console.log('✅ Transaction confirmed:', receipt);
      
      // Extract token ID from logs - look for Transfer event
      let extractedTokenId = null;
      if (receipt.logs && receipt.logs.length > 0) {
        // Look for Transfer event (from address(0) to user)
        const transferTopic = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('Transfer(address,address,uint256)'));
        const transferEvent = receipt.logs.find(log => 
          log.topics && log.topics[0] === transferTopic && log.topics.length >= 4
        );
        
        if (transferEvent) {
          extractedTokenId = ethers.BigNumber.from(transferEvent.topics[3]).toString();
          setTokenId(extractedTokenId);
          console.log('🎫 Extracted Token ID:', extractedTokenId);
        } else {
          // Fallback: try to parse AuditReportMinted event
          console.log('🔍 Looking for AuditReportMinted event...');
          for (const log of receipt.logs) {
            try {
              const parsed = contract.interface.parseLog(log);
              if (parsed.name === 'AuditReportMinted') {
                extractedTokenId = parsed.args.tokenId.toString();
                setTokenId(extractedTokenId);
                console.log('🎫 Extracted Token ID from AuditReportMinted:', extractedTokenId);
                break;
              }
            } catch (e) {
              // Skip unparseable logs
            }
          }
        }
      }
      
      return {
        success: true,
        transactionHash: tx.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        tokenId: extractedTokenId,
        mintFee: auditType === 'ai' ? '0.003' : '0',
        network: network,
        contractAddress: contractAddr,
        auditedContract: targetContractAddress,
        explorerUrl: `${NETWORK_CONFIG[network]?.explorerUrl}/tx/${tx.hash}`
      };
      
    } catch (error) {
      console.error('Blockchain minting failed:', error);
      
      // Enhanced error handling with specific contract validation errors
      if (error.code === 4001) {
        throw new Error('Transaction rejected by user');
      } else if (error.code === -32603) {
        throw new Error('Internal JSON-RPC error - check network connection and try again');
      } else if (error.message?.includes('execution reverted')) {
        if (error.message?.includes('Address is not a contract')) {
          throw new Error('Contract validation failed: The address being audited must be a deployed smart contract with bytecode.');
        } else if (error.message?.includes('Certificate already exists')) {
          throw new Error('A certificate already exists for this contract address');
        } else if (error.message?.includes('Contract name required')) {
          throw new Error('Contract name cannot be empty');
        } else if (error.message?.includes('IPFS hash required')) {
          throw new Error('IPFS hash cannot be empty');
        } else if (error.message?.includes('Security score must be 0-100')) {
          throw new Error('Security score must be between 0 and 100');
        } else {
          throw new Error(`Smart contract error: ${error.reason || error.message}`);
        }
      } else if (error.message?.includes('insufficient funds')) {
        const requiredAmount = auditType === 'ai' ? '0.005 ETH (0.003 + gas)' : '0.002 ETH (gas only)';
        throw new Error(`Insufficient funds. You need at least ${requiredAmount} in your wallet.`);
      } else if (error.message?.includes('gas')) {
        throw new Error('Transaction failed due to gas issues. Please try again with a higher gas limit.');
      } else if (error.message?.includes('user rejected')) {
        throw new Error('Transaction was rejected by user. Please approve the transaction in MetaMask.');
      } else {
        throw new Error(error.message || 'Blockchain transaction failed');
      }
    }
  };

  const handleMint = async () => {
    try {
      setError(null);
      setStep('preparing');
      setProgress(0);
      setTxHash(null);
      setTokenId(null);

      console.log('🚀 Starting mint process...', {
        auditType,
        analysisType,
        contractAddress,
        hasAuditData: !!auditData,
        network,
        willUsePaidFunction: auditType === 'ai',
        costDescription
      });

      // Step 1: Connect wallet if not connected
      if (!account) {
        console.log('👛 Connecting wallet...');
        const connected = await connectWallet();
        if (!connected) return;
      }

      // Step 2: Ensure we're on the right network
      if (network !== 'sepolia') {
        console.log('🔄 Switching to Sepolia...');
        const switched = await switchNetwork('sepolia');
        if (!switched) return;
      }

      setProgress(10);

      // Step 3: Prepare audit data with enhanced validation
      let targetContractAddress = contractAddress;
      if (!targetContractAddress || !ethers.utils.isAddress(targetContractAddress)) {
        // Use our own contract address - it definitely works and has deployed code
        targetContractAddress = '0x46E086aac77023AD6E1EA65cC23A6f0Fa91Cf118'; // Our audit contract
        console.log('⚠️ Using our audit contract address (guaranteed to work) for audit data:', targetContractAddress);
      }
      
      // Calculate risk level based on security score
      const securityScore = auditData?.scores?.overall || auditData?.scores?.security || 75;
      let riskLevel = 'Low';
      if (securityScore < 40) riskLevel = 'Critical';
      else if (securityScore < 60) riskLevel = 'High';
      else if (securityScore < 80) riskLevel = 'Medium';
      
      const auditInfo = {
        contractAddress: targetContractAddress,
        contractName: auditData?.contractInfo?.contractName || 'Analyzed Contract',
        userAddress: account, // Required field for IPFS API
        network: network,
        timestamp: new Date().toISOString(),
        auditType,
        
        // Risk assessment
        riskLevel: riskLevel,
        securityScore: Math.min(100, Math.max(0, securityScore)),
        
        // Detailed audit results
        auditResult: {
          securityScore: auditData?.scores?.security || 75,
          gasScore: auditData?.scores?.gas || 80,
          qualityScore: auditData?.scores?.quality || 85,
          overallScore: securityScore,
          findings: auditData?.securityFindings || [],
          gasOptimizations: auditData?.gasOptimizations || [],
          codeQualityIssues: auditData?.codeQualityIssues || [],
          summary: auditData?.executiveSummary || 'Security analysis completed successfully.',
          modelsUsed: auditData?.modelsUsed || ['Analysis Engine'],
          processingTime: auditData?.processingTime || '2.5 minutes'
        },
        
        // Also include executiveSummary at top level for compatibility
        executiveSummary: auditData?.executiveSummary || 'Security analysis completed successfully.',
        
        // Metadata
        platform: 'DeFi Watchdog',
        version: '1.0',
        certificateType: auditType === 'ai' ? 'AI-Powered Certificate' : 'Static Analysis Certificate'
      };

      console.log('📋 Prepared audit info:', {
        contractAddress: auditInfo.contractAddress,
        contractName: auditInfo.contractName,
        securityScore: auditInfo.securityScore,
        riskLevel: auditInfo.riskLevel,
        auditType: auditInfo.auditType
      });

      // Step 4: Upload to IPFS
      console.log('🌐 Uploading to IPFS...');
      setStep('uploading');
      const ipfsResult = await uploadToIPFS(auditInfo);
      setIpfsData(ipfsResult);
      
      console.log('✅ IPFS upload complete:', ipfsResult);
      
      // Ensure we have a valid IPFS hash
      if (!ipfsResult || !ipfsResult.ipfsHash) {
        throw new Error('IPFS upload failed - no hash returned');
      }

      // Step 5: Mint on blockchain
      console.log('⛓️ Minting on blockchain...');
      const blockchainResult = await mintOnBlockchain(ipfsResult.ipfsHash, auditInfo);
      
      console.log('✅ Blockchain mint complete:', blockchainResult);

      // Step 6: Save complete record to localStorage
      const finalResult = {
        ...blockchainResult,
        ...auditInfo,
        ipfs: ipfsResult,
        minted: true,
        onChain: true,
        timestamp: Date.now(),
        displayName: `${auditInfo.contractName} Audit Certificate`,
        description: `${auditType === 'ai' ? 'AI-Powered' : 'Static Analysis'} security audit certificate for ${auditInfo.contractName}`,
        certificateId: blockchainResult.tokenId
      };
      
      // Also save a flag to indicate we just minted
      sessionStorage.setItem('just_minted', 'true');

      // Store with multiple keys for compatibility
      if (blockchainResult.tokenId) {
        localStorage.setItem(`audit_nft_${blockchainResult.tokenId}`, JSON.stringify(finalResult));
        localStorage.setItem(`certificate_${blockchainResult.tokenId}`, JSON.stringify(finalResult));
        
        // Also store in main certificates list
        const existingCerts = JSON.parse(localStorage.getItem('user_certificates') || '[]');
        existingCerts.push(finalResult);
        localStorage.setItem('user_certificates', JSON.stringify(existingCerts));
      }

      setStep('success');
      
      if (onMintComplete) {
        onMintComplete(finalResult);
      }

      // Show success message without redirect
      console.log('✅ Certificate minted successfully - staying on current page');

    } catch (error) {
      console.error('Mint failed:', error);
      setStep('error');
      setError(error.message || 'Minting failed');
      setProgress(0);
    }
  };

  const resetState = () => {
    setStep('ready');
    setProgress(0);
    setError(null);
    setTxHash(null);
    setTokenId(null);
    setIpfsData(null);
  };

  const getStepMessage = () => {
    switch (step) {
      case 'connecting': return 'Connecting wallet...';
      case 'preparing': return 'Preparing certificate data...';
      case 'uploading': return `Uploading to IPFS... (${progress}%)`;
      case 'blockchain': return 'Minting NFT certificate on blockchain...';
      case 'success': return '🎉 Certificate minted successfully!';
      case 'error': return `❌ ${error || 'Minting failed'}`;
      default: return '';
    }
  };

  const isProcessing = ['connecting', 'preparing', 'uploading', 'blockchain'].includes(step);
  const mintCost = auditType === 'ai' ? '0.003' : '0.000';
  const analysisType = auditData?.analysisType || 'static';
  const costDescription = auditType === 'ai' ? '0.003 ETH' : (analysisType.includes('ai') ? 'FREE (AI Analysis)' : 'FREE (Static)');

  return (
    <div className="flex flex-col space-y-4">
      {/* Network Status */}
      {account && (
        <div className="text-xs text-gray-600 bg-gray-50 rounded p-2">
          <div>Connected: {account.slice(0, 6)}...{account.slice(-4)}</div>
          <div>Network: {NETWORK_CONFIG[network]?.name}</div>
          {network !== 'sepolia' && (
            <div className="text-orange-600 font-medium">⚠️ Switch to Sepolia for minting</div>
          )}
        </div>
      )}

      {/* Main Mint Button */}
      <button
        onClick={handleMint}
        disabled={isProcessing}
        className={`px-8 py-4 rounded-xl font-bold transition-all duration-300 transform min-w-[280px] ${
          isProcessing
            ? 'bg-gradient-to-r from-blue-400 to-purple-400 text-white cursor-not-allowed'
            : auditType === 'ai'
            ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-xl hover:shadow-2xl hover:scale-105'
            : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-xl hover:shadow-2xl hover:scale-105'
        }`}
      >
        {isProcessing ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Processing...</span>
          </div>
        ) : (
          <span>🏆 Create IPFS Certificate ({costDescription})</span>
        )}
      </button>

      {/* Progress Bar */}
      {isProcessing && (
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${
              auditType === 'ai' 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                : 'bg-gradient-to-r from-emerald-500 to-teal-500'
            }`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      {/* Status Message */}
      <div className="text-sm">
        {getStepMessage() && (
          <div className={`font-medium ${
            step === 'error' ? 'text-red-600' : 
            step === 'success' ? 'text-green-600' : 
            'text-blue-600'
          }`}>
            {getStepMessage()}
          </div>
        )}
      </div>

      {/* Transaction Hash */}
      {txHash && (
        <div className="text-xs text-gray-600">
          <a 
            href={`${NETWORK_CONFIG[network]?.explorerUrl}/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            View transaction: {txHash.slice(0, 20)}...
          </a>
        </div>
      )}

      {/* Success Details */}
      {step === 'success' && tokenId && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm">
          <div className="font-medium text-green-800 mb-2">✅ NFT Certificate Minted!</div>
          <div className="space-y-1 text-green-700">
            <div>Token ID: #{tokenId}</div>
            <div>Transaction: {txHash?.slice(0, 20)}...</div>
            <div>Cost: {mintCost} ETH{auditType === 'static' ? ' (only gas fees)' : ''}</div>
            <div>Network: {NETWORK_CONFIG[network]?.name}</div>
            {ipfsData && <div>IPFS: {ipfsData.ipfsHash?.slice(0, 20)}...</div>}
            <div className="mt-2 text-green-600">
              🎉 Certificate successfully created and stored on IPFS!
            </div>
          </div>
        </div>
      )}

      {/* Error Display with Retry */}
      {step === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="font-medium text-red-800 mb-2">❌ Minting Failed</div>
          <div className="text-sm text-red-700 mb-3">{error}</div>
          <button
            onClick={resetState}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Info */}
      <div className="text-xs text-gray-600 max-w-[280px]">
        💡 Creates an NFT certificate stored permanently on IPFS and blockchain. 
        {auditType === 'ai' ? ' Premium AI audit: 0.003 ETH + gas fees.' : 
         analysisType.includes('ai') ? ' Free AI audit: Only gas fees (~$0.50).' : 
         ' Static audit: FREE (only gas fees).'}
        {!account && ' Connect your wallet to get started.'}
      </div>
    </div>
  );
}