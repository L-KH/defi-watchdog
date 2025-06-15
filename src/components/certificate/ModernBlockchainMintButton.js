// src/components/certificate/ModernBlockchainMintButton.js - Fallback version without Wagmi
'use client'

import { useState } from 'react'
import { useRouter } from 'next/router'

export default function ModernBlockchainMintButton({ contractAddress, auditData, onMintComplete }) {
  const router = useRouter()
  
  // States
  const [isTestMode, setIsTestMode] = useState(true)
  const [mintStep, setMintStep] = useState(null)
  const [mintProgress, setMintProgress] = useState(0)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successData, setSuccessData] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState(null)

  // Check wallet connection
  useState(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then(accounts => {
          if (accounts.length > 0) {
            setIsConnected(true)
            setAddress(accounts[0])
          }
        })
        .catch(console.error)
    }
  }, [])

  // Connect wallet
  const connectWallet = async () => {
    if (!window.ethereum) {
      setErrorMessage('MetaMask not installed')
      return
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      if (accounts.length > 0) {
        setIsConnected(true)
        setAddress(accounts[0])
      }
    } catch (error) {
      setErrorMessage('Failed to connect wallet: ' + error.message)
    }
  }

  // Upload audit data to IPFS
  const uploadToIPFS = async (data) => {
    try {
      setMintStep('Uploading audit data to IPFS...')
      setMintProgress(20)

      const response = await fetch('/api/save-audit-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      const result = await response.json()
      
      if (result.success && result.ipfs?.success) {
        setMintProgress(40)
        return {
          ipfsHash: result.ipfs.hash,
          ipfsUrl: result.ipfs.url,
          reportId: result.id
        }
      } else {
        throw new Error(result.error || 'Failed to upload to IPFS')
      }
    } catch (error) {
      console.error('IPFS upload failed:', error)
      throw error
    }
  }

  // Prepare audit data
  const prepareAuditData = () => {
    return {
      contractAddress: contractAddress || '0x2d8879046f1559e53eb052e949e9544bcb72f414',
      contractName: auditData?.contractInfo?.contractName || 'DeFi Contract',
      userAddress: address,
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
    }
  }

  // Handle test mode minting
  const handleTestMint = async () => {
    setMintStep('Test Mode: Simulating blockchain mint...')
    setMintProgress(5)
    setErrorMessage(null)

    try {
      const auditDataForIPFS = prepareAuditData()
      
      setMintStep('Preparing audit data...')
      setMintProgress(20)
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const { ipfsHash, ipfsUrl, reportId } = await uploadToIPFS(auditDataForIPFS)
      console.log('Audit data uploaded to IPFS:', { ipfsHash, ipfsUrl })
      
      setMintStep('Test Mode: Simulating blockchain transaction...')
      setMintProgress(70)
      
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`
      const tokenId = Date.now()
      
      setMintStep('Test certificate created successfully!')
      setMintProgress(100)
      
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
        onChain: false,
        txHash: mockTxHash,
        chainId: 11155111,
        mintFee: '0',
        version: '3.0',
        testMode: true
      }

      localStorage.setItem(`certificate_${tokenId}`, JSON.stringify(certificateData))
      setSuccessData(certificateData)
      
      if (onMintComplete) onMintComplete(certificateData)
      
      setTimeout(() => {
        router.push(`/certificate/${tokenId}`)
      }, 2000)
      
    } catch (error) {
      console.error('Test mint failed:', error)
      setErrorMessage(error.message)
      setMintStep(null)
      setMintProgress(0)
    }
  }

  // Handle real blockchain minting
  const handleRealMint = async () => {
    if (!isConnected) {
      await connectWallet()
      return
    }

    setErrorMessage('Live blockchain minting is temporarily disabled while Web3 integration is being fixed. Please use Test Mode for now.')
  }

  const handleMint = isTestMode ? handleTestMint : handleRealMint
  const isMinting = mintProgress > 0

  const resetMinting = () => {
    setMintStep(null)
    setMintProgress(0)
    setErrorMessage(null)
    setSuccessData(null)
  }

  const formatAddress = (addr) => {
    if (!addr) return ''
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <div className="flex flex-col space-y-4">
      {/* Mode Toggle */}
      <div className="flex items-center justify-center space-x-3 bg-gray-50 p-3 rounded-lg">
        <button
          onClick={() => setIsTestMode(true)}
          className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
            isTestMode 
              ? 'bg-blue-500 text-white shadow-md' 
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >
          🧪 Test Mode
        </button>
        <button
          onClick={() => setIsTestMode(false)}
          className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
            !isTestMode 
              ? 'bg-purple-500 text-white shadow-md' 
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >
          ⛓️ Live Blockchain
        </button>
      </div>

      {/* Connect Button or Mint Button */}
      {!isTestMode && !isConnected ? (
        <button
          onClick={connectWallet}
          className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          🔗 Connect Wallet to Mint Certificate
        </button>
      ) : (
        <button
          onClick={handleMint}
          disabled={isMinting}
          className={`w-full px-6 py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl ${
            isMinting
              ? 'bg-gradient-to-r from-blue-400 to-purple-400 text-white cursor-not-allowed'
              : isTestMode
              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white'
              : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white'
          }`}
        >
          {isMinting ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>
                {isTestMode ? '🧪 Creating Test Certificate...' : '⛓️ Minting Certificate...'}
              </span>
            </div>
          ) : isTestMode ? (
            <span>🧪 Create Test Certificate (FREE)</span>
          ) : (
            <span>⛓️ Mint Blockchain Certificate (FREE)</span>
          )}
        </button>
      )}
      
      {/* Progress Bar */}
      {isMinting && (
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${
              isTestMode 
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                : 'bg-gradient-to-r from-purple-500 to-indigo-500'
            }`}
            style={{ width: `${mintProgress}%` }}
          ></div>
        </div>
      )}
      
      {/* Status Message */}
      {mintStep && (
        <div className={`text-sm text-center p-3 rounded-lg font-medium ${
          errorMessage ? 'bg-red-50 text-red-700 border border-red-200' : 
          successData ? 'bg-green-50 text-green-700 border border-green-200' : 
          isTestMode ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-purple-50 text-purple-700 border border-purple-200'
        }`}>
          {errorMessage ? `❌ Error: ${errorMessage}` : mintStep}
          {mintProgress > 0 && !errorMessage && ` (${mintProgress}%)`}
        </div>
      )}
      
      {/* Info Panel */}
      <div className={`border rounded-lg p-4 text-sm ${
        isTestMode 
          ? 'bg-blue-50 border-blue-200' 
          : 'bg-purple-50 border-purple-200'
      }`}>
        <div className={`font-semibold mb-2 ${
          isTestMode ? 'text-blue-800' : 'text-purple-800'
        }`}>
          {isTestMode ? '🧪 Test Mode Details' : '⛓️ Blockchain Details'}
        </div>
        <div className={`space-y-1 ${
          isTestMode ? 'text-blue-700' : 'text-purple-700'
        }`}>
          <div><strong>Mode:</strong> {isTestMode ? 'Test/Demo' : 'Live Blockchain (Temporarily Disabled)'}</div>
          <div><strong>Network:</strong> Sepolia</div>
          <div><strong>Mint Fee:</strong> FREE (Static Analysis)</div>
          {address && (
            <div><strong>Wallet:</strong> {formatAddress(address)}</div>
          )}
        </div>
      </div>
      
      {/* Success Panel */}
      {successData && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm">
          <div className="text-green-800 font-semibold mb-3 flex items-center">
            ✅ {successData.testMode ? 'Test Certificate Created!' : 'Certificate Minted Successfully!'}
          </div>
          <div className="space-y-2 text-green-700">
            <div><strong>Token ID:</strong> #{successData.tokenId}</div>
            <div><strong>Security Score:</strong> {successData.securityScore}/100</div>
            <div><strong>Risk Level:</strong> {successData.riskLevel}</div>
            {successData.txHash && (
              <div>
                <strong>Transaction:</strong> 
                {successData.testMode ? (
                  <span className="text-green-600 ml-1">Test Mode - No real transaction</span>
                ) : (
                  <a 
                    href={`https://sepolia.etherscan.io/tx/${successData.txHash}`}
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
      
      {/* Error Panel */}
      {errorMessage && (
        <div className="space-y-3">
          <button
            onClick={resetMinting}
            className="w-full px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
          >
            🔄 Try Again
          </button>
        </div>
      )}
      
      <div className="text-xs text-gray-500 text-center italic">
        {isTestMode ? (
          '🧪 Test mode - Creates local certificate with IPFS report'
        ) : (
          '⛓️ Live blockchain temporarily disabled during Web3 integration fix'
        )}
      </div>
    </div>
  )
}