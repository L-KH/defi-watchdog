import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ethers } from 'ethers';

export default function SimpleBlockchainMintButton({ contractAddress, auditData, onMintComplete }) {
  const router = useRouter();
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentChainId, setCurrentChainId] = useState(null);
  const [isMinting, setIsMinting] = useState(false);
  const [mintStep, setMintStep] = useState(null);
  const [mintProgress, setMintProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successData, setSuccessData] = useState(null);
  const [txHash, setTxHash] = useState(null);
  const [isTestMode, setIsTestMode] = useState(true); // Enable test mode first

  // For now, we'll use a placeholder contract address
  const CONTRACT_ADDRESS = '0x46E086aac77023AD6E1EA65cC23A6f0Fa91Cf118';
  const MINT_FEE = '0'; // Free for static analysis
  
  // Updated ABI for our contract
  const AUDIT_NFT_ABI = [
    {
      "inputs": [
        {"internalType": "address", "name": "contractAddress", "type": "address"},
        {"internalType": "string", "name": "contractName", "type": "string"},
        {"internalType": "string", "name": "ipfsHash", "type": "string"},
        {"internalType": "uint8", "name": "securityScore", "type": "uint8"},
        {"internalType": "uint8", "name": "riskLevel", "type": "uint8"}
      ],
      "name": "mintStaticAuditReport",
      "outputs": [
        {"internalType": "uint256", "name": "", "type": "uint256"}
      ],
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
      "outputs": [
        {"internalType": "uint256", "name": "", "type": "uint256"}
      ],
      "stateMutability": "payable",
      "type": "function"
    }
  ];

  useEffect(() => {
    const initWallet = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setIsConnected(true);
          }
          
          const chainId = await window.ethereum.request({ method: 'eth_chainId' });
          setCurrentChainId(parseInt(chainId, 16));
          
          window.ethereum.on('accountsChanged', (accounts) => {
            if (accounts.length > 0) {
              setAccount(accounts[0]);
              setIsConnected(true);
            } else {
              setAccount(null);
              setIsConnected(false);
            }
          });
          
          window.ethereum.on('chainChanged', (chainId) => {
            setCurrentChainId(parseInt(chainId, 16));
          });
        } catch (error) {
          console.error('Error initializing wallet:', error);
        }
      }
    };
    
    initWallet();
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      setErrorMessage('MetaMask not installed');
      return;
    }
    
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
      }
    } catch (error) {
      setErrorMessage('Failed to connect wallet: ' + error.message);
    }
  };

  const switchToSepolia = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }],
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
          setErrorMessage('Failed to add Sepolia network');
          return false;
        }
      }
      setErrorMessage('Failed to switch to Sepolia network');
      return false;
    }
  };

  const uploadToIPFS = async (data) => {
    try {
      setMintStep('Uploading audit data to IPFS...');
      setMintProgress(20);

      const response = await fetch('/api/save-audit-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      console.log('IPFS upload result:', result);
      
      if (result.success && result.ipfs?.success) {
        setMintProgress(40);
        return {
          ipfsHash: result.ipfs.hash,
          ipfsUrl: result.ipfs.url,
          reportId: result.id
        };
      } else {
        throw new Error(result.error || 'Failed to upload to IPFS');
      }
    } catch (error) {
      console.error('IPFS upload failed:', error);
      throw error;
    }
  };

  const handleTestMint = async () => {
    setIsMinting(true);
    setMintStep('Test Mode: Simulating blockchain mint...');
    setMintProgress(5);
    setErrorMessage(null);

    try {
      setMintStep('Preparing audit data...');
      setMintProgress(20);
      
      const auditDataForIPFS = {
        contractAddress: contractAddress || '0x2d8879046f1559e53eb052e949e9544bcb72f414',
        contractName: auditData?.contractInfo?.contractName || 'DeFi Contract',
        userAddress: account || '0x...',
        requestId: `req_${Date.now()}`,
        network: 'sepolia',
        timestamp: new Date().toISOString(),
        auditResult: {
          analysis: {
            securityScore: auditData?.scores?.security || 87,
            riskLevel: 'Low',
            summary: auditData?.executiveSummary || 'Security analysis completed successfully.',
            keyFindings: auditData?.securityFindings || []
          }
        },
        securityScore: auditData?.scores?.security || 87,
        riskLevel: 'Low'
      };
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMintProgress(40);
      
      const { ipfsHash, ipfsUrl, reportId } = await uploadToIPFS(auditDataForIPFS);
      console.log('Audit data uploaded to IPFS:', { ipfsHash, ipfsUrl });
      
      setMintStep('Test Mode: Simulating blockchain transaction...');
      setMintProgress(70);
      
      // Simulate blockchain delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;
      const tokenId = Date.now();
      
      setTxHash(mockTxHash);
      setMintStep('Test certificate created successfully!');
      setMintProgress(100);
      
      const certificateData = {
        id: reportId || `cert_${Date.now()}`,
        tokenId: tokenId,
        contractAddress: auditDataForIPFS.contractAddress,
        contractName: auditDataForIPFS.contractName,
        userAddress: auditDataForIPFS.userAddress,
        ipfsHash: ipfsHash,
        ipfsUrl: ipfsUrl,
        securityScore: auditDataForIPFS.securityScore,
        riskLevel: auditDataForIPFS.riskLevel,
        timestamp: auditDataForIPFS.timestamp,
        network: 'sepolia',
        hasIPFSReport: true,
        minted: true,
        onChain: false, // Test mode
        txHash: mockTxHash,
        chainId: 11155111,
        mintFee: MINT_FEE,
        version: '3.0',
        testMode: true
      };

      localStorage.setItem(`certificate_${tokenId}`, JSON.stringify(certificateData));
      setSuccessData(certificateData);
      
      if (onMintComplete) {
        onMintComplete(certificateData);
      }
      
      setTimeout(() => {
        router.push(`/certificate/${tokenId}`);
      }, 2000);
      
    } catch (error) {
      console.error('Test mint failed:', error);
      setErrorMessage(error.message);
      setMintStep(null);
      setMintProgress(0);
    } finally {
      setTimeout(() => {
        if (!errorMessage) {
          setIsMinting(false);
        }
      }, 2000);
    }
  };

  const handleRealMint = async () => {
    if (!isConnected) {
      await connectWallet();
      return;
    }

    if (currentChainId !== 11155111) {
      const switched = await switchToSepolia();
      if (!switched) return;
    }

    setIsMinting(true);
    setMintStep('Connecting to blockchain...');
    setMintProgress(5);
    setErrorMessage(null);

    try {
      setMintStep('Preparing audit data...');
      setMintProgress(10);
      
      const auditDataForIPFS = {
        contractAddress: contractAddress || '0x2d8879046f1559e53eb052e949e9544bcb72f414',
        contractName: auditData?.contractInfo?.contractName || 'DeFi Contract',
        userAddress: account,
        requestId: `req_${Date.now()}`,
        network: 'sepolia',
        timestamp: new Date().toISOString(),
        auditResult: {
          analysis: {
            securityScore: auditData?.scores?.security || 87,
            riskLevel: 'Low',
            summary: auditData?.executiveSummary || 'Security analysis completed successfully.',
            keyFindings: auditData?.securityFindings || []
          }
        },
        securityScore: auditData?.scores?.security || 87,
        riskLevel: 'Low'
      };
      
      const { ipfsHash, ipfsUrl, reportId } = await uploadToIPFS(auditDataForIPFS);
      console.log('Audit data uploaded to IPFS:', { ipfsHash, ipfsUrl });
      
      setMintStep('Minting certificate on blockchain...');
      setMintProgress(60);
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      // Check if contract exists first
      const code = await provider.getCode(CONTRACT_ADDRESS);
      if (code === '0x') {
        throw new Error('Contract not deployed at this address. Please deploy the contract first or use test mode.');
      }
      
      const contract = new ethers.Contract(CONTRACT_ADDRESS, AUDIT_NFT_ABI, signer);
      
      console.log('Minting with contract:', CONTRACT_ADDRESS);
      
      // Convert risk level to enum value
      const getRiskLevelEnum = (level) => {
        switch(level.toLowerCase()) {
          case 'low': return 0;
          case 'medium': return 1;
          case 'high': return 2;
          case 'critical': return 3;
          default: return 0;
        }
      };
      
      const riskLevelEnum = getRiskLevelEnum(auditDataForIPFS.riskLevel);
      
      // For free static analysis (no payment required)
      const tx = await contract.mintStaticAuditReport(
        contractAddress || '0x2d8879046f1559e53eb052e949e9544bcb72f414',
        auditDataForIPFS.contractName,
        ipfsHash,
        auditDataForIPFS.securityScore,
        riskLevelEnum
      );
      
      console.log('Transaction submitted:', tx.hash);
      setTxHash(tx.hash);
      
      setMintStep('Waiting for confirmation...');
      setMintProgress(80);
      
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);
      
      let tokenId = Date.now();
      if (receipt.events) {
        for (const event of receipt.events) {
          if (event.event === 'AuditReportMinted' && event.args && event.args.tokenId) {
            tokenId = event.args.tokenId.toString();
            break;
          }
        }
      }
      
      setMintStep('Certificate minted successfully!');
      setMintProgress(100);
      
      const certificateData = {
        id: reportId || `cert_${Date.now()}`,
        tokenId: tokenId,
        contractAddress: auditDataForIPFS.contractAddress,
        contractName: auditDataForIPFS.contractName,
        userAddress: auditDataForIPFS.userAddress,
        ipfsHash: ipfsHash,
        ipfsUrl: ipfsUrl,
        securityScore: auditDataForIPFS.securityScore,
        riskLevel: auditDataForIPFS.riskLevel,
        timestamp: auditDataForIPFS.timestamp,
        network: 'sepolia',
        hasIPFSReport: true,
        minted: true,
        onChain: true,
        txHash: tx.hash,
        chainId: 11155111,
        mintFee: MINT_FEE,
        version: '3.0'
      };

      localStorage.setItem(`certificate_${tokenId}`, JSON.stringify(certificateData));
      setSuccessData(certificateData);
      
      if (onMintComplete) {
        onMintComplete(certificateData);
      }
      
      setTimeout(() => {
        router.push(`/certificate/${tokenId}`);
      }, 2000);
      
    } catch (error) {
      console.error('Blockchain mint failed:', error);
      setErrorMessage(error.message);
      setMintStep(null);
      setMintProgress(0);
    } finally {
      setTimeout(() => {
        if (!errorMessage) {
          setIsMinting(false);
        }
      }, 2000);
    }
  };

  const handleMint = isTestMode ? handleTestMint : handleRealMint;

  const resetMinting = () => {
    setIsMinting(false);
    setMintStep(null);
    setMintProgress(0);
    setErrorMessage(null);
    setSuccessData(null);
    setTxHash(null);
  };

  return (
    <div className="flex flex-col space-y-3">
      {/* Mode Toggle */}
      <div className="flex items-center justify-center space-x-3 bg-gray-50 p-2 rounded-lg">
        <button
          onClick={() => setIsTestMode(true)}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            isTestMode 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >
          Test Mode
        </button>
        <button
          onClick={() => setIsTestMode(false)}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            !isTestMode 
              ? 'bg-purple-500 text-white' 
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >
          Live Blockchain
        </button>
      </div>

      <button
        onClick={handleMint}
        disabled={isMinting}
        className={`w-full px-4 py-3 rounded-lg font-semibold transition-all duration-300 transform ${
          isMinting
            ? 'bg-gradient-to-r from-blue-400 to-purple-400 text-white cursor-not-allowed'
            : isTestMode
            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl hover:scale-105'
            : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl hover:scale-105'
        }`}
      >
        {isMinting ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>
              {isTestMode ? 'Creating Test Certificate...' : 'Minting Certificate...'}
            </span>
          </div>
        ) : isTestMode ? (
          <span>Create Test Certificate (FREE)</span>
        ) : isConnected ? (
          <span>Mint Blockchain Certificate (FREE)</span>
        ) : (
          <span>Connect Wallet to Mint</span>
        )}
      </button>
      
      {isMinting && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${
              isTestMode 
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                : 'bg-gradient-to-r from-purple-500 to-indigo-500'
            }`}
            style={{ width: `${mintProgress}%` }}
          ></div>
        </div>
      )}
      
      {mintStep && (
        <div className={`text-sm text-center ${
          errorMessage ? 'text-red-600' : 
          successData ? 'text-green-600' : 
          isTestMode ? 'text-blue-600' : 'text-purple-600'
        } font-medium`}>
          {errorMessage ? `Error: ${errorMessage}` : mintStep}
          {mintProgress > 0 && !errorMessage && ` (${mintProgress}%)`}
        </div>
      )}
      
      <div className={`border rounded-lg p-3 text-sm ${
        isTestMode 
          ? 'bg-blue-50 border-blue-200' 
          : 'bg-purple-50 border-purple-200'
      }`}>
        <div className={`font-medium mb-1 ${
          isTestMode ? 'text-blue-800' : 'text-purple-800'
        }`}>
          {isTestMode ? 'Test Mode Details' : 'Blockchain Details'}
        </div>
        <div className={`space-y-1 ${
          isTestMode ? 'text-blue-700' : 'text-purple-700'
        }`}>
          <div><strong>Mode:</strong> {isTestMode ? 'Test/Demo' : 'Live Blockchain'}</div>
          <div><strong>Network:</strong> Sepolia {currentChainId === 11155111 ? 'Connected' : 'Switch Required'}</div>
          {!isTestMode && (
            <div><strong>Contract:</strong> {CONTRACT_ADDRESS.slice(0, 10)}...</div>
          )}
          <div><strong>Mint Fee:</strong> FREE (Static Analysis)</div>
          {account && (
            <div><strong>Wallet:</strong> {account.slice(0, 6)}...{account.slice(-4)}</div>
          )}
        </div>
      </div>
      
      {successData && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm">
          <div className="text-green-800 font-medium mb-2">
            {successData.testMode ? 'Test Certificate Created!' : 'Certificate Minted Successfully!'}
          </div>
          <div className="space-y-1 text-green-700">
            <div><strong>Token ID:</strong> #{successData.tokenId}</div>
            <div><strong>Security Score:</strong> {successData.securityScore}/100</div>
            <div><strong>Risk Level:</strong> {successData.riskLevel}</div>
            {txHash && (
              <div>
                <strong>Transaction:</strong> 
                {successData.testMode ? (
                  <span className="text-green-600 ml-1">Test Mode - No real transaction</span>
                ) : (
                  <a 
                    href={`https://sepolia.etherscan.io/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-800 underline ml-1"
                  >
                    View on Etherscan
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      
      {errorMessage && (
        <div className="space-y-2">
          <button
            onClick={resetMinting}
            className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
          >
            Try Again
          </button>
          {errorMessage.includes('Contract not deployed') && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm">
              <div className="text-yellow-800 font-medium mb-1">🔧 Fix Required</div>
              <div className="text-yellow-700">
                The contract needs to be deployed to Sepolia. Try using Test Mode for now, or run: 
                <code className="bg-yellow-100 px-2 py-1 rounded ml-1 font-mono text-xs">
                  npm run deploy:sepolia
                </code>
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="text-xs text-gray-600 text-center">
        {isTestMode ? (
          'Test mode - Creates local certificate with IPFS report'
        ) : (
          'Real blockchain NFT certificate with IPFS audit report'
        )}
      </div>
    </div>
  );
}
