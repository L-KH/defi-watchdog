// src/pages/audit.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '../components/layout/Layout';
import ContractScannerAPI, { ScanUtils } from '../services/contractScannerApi';
import { analyzeWithAI } from '../lib/aiAnalysis';

// Component imports
import ToolsScanCard from '../components/audit/ToolsScanCard';
import AIScanCard from '../components/audit/AIScanCard';
import EnhancedScanResults from '../components/audit/EnhancedScanResults';
// import ApiSetupGuide from '../components/audit/ApiSetupGuide'; // Removed for production

export default function EnhancedAuditTool() {
  const router = useRouter();
  
  // Form states
  const [address, setAddress] = useState('');
  const [network, setNetwork] = useState('linea');
  
  // Scanner states
  const [scannerHealth, setScannerHealth] = useState(null);
  const [toolsInfo, setToolsInfo] = useState(null);
  const [isLoadingHealth, setIsLoadingHealth] = useState(true);
  
  // Analysis states
  const [isToolsScanning, setIsToolsScanning] = useState(false);
  const [isAIScanning, setIsAIScanning] = useState(false);
  const [toolsScanResult, setToolsScanResult] = useState(null);
  const [aiScanResult, setAIScanResult] = useState(null);
  
  // Error states
  const [toolsError, setToolsError] = useState(null);
  const [aiError, setAIError] = useState(null);
  
  // Contract data
  const [contractInfo, setContractInfo] = useState(null);
  const [contractSource, setContractSource] = useState(null);
  const [isLoadingContract, setIsLoadingContract] = useState(false);
  const [loadingError, setLoadingError] = useState(null);
  const [requestInProgress, setRequestInProgress] = useState(false);

  // Load scanner health and tools info on mount
  useEffect(() => {
    loadScannerInfo();
  }, []);

  // Process URL parameters with debouncing
  useEffect(() => {
    if (router.query.address && !requestInProgress) {
      const queryAddress = router.query.address;
      const queryNetwork = router.query.network || 'linea';
      
      // Only process if different from current state
      if (queryAddress !== address || queryNetwork !== network) {
        setAddress(queryAddress);
        setNetwork(queryNetwork);
        
        // Debounce the handleAddressSubmit call
        const timer = setTimeout(() => {
          handleAddressSubmit(queryAddress, queryNetwork);
        }, 100);
        
        return () => clearTimeout(timer);
      }
    }
  }, [router.query.address, router.query.network]);

  const loadScannerInfo = async () => {
    try {
      setIsLoadingHealth(true);
      const [health, tools] = await Promise.all([
        ContractScannerAPI.getHealthStatus().catch(error => ({
          status: 'error',
          error: error.message,
          available_tools: {},
          service: 'Scanner API',
          version: 'Unknown'
        })),
        ContractScannerAPI.getToolsInfo().catch(error => ({
          available_tools: {
            pattern_matcher: true,
            slither: false,
            mythril: false,
            semgrep: false,
            solhint: false
          },
          error: error.message
        }))
      ]);
      
      setScannerHealth(health);
      setToolsInfo(tools);
    } catch (error) {
      console.error('Failed to load scanner info:', error);
      setScannerHealth({ 
        status: 'error', 
        error: error.message,
        available_tools: {},
        service: 'Scanner API',
        version: 'Unknown'
      });
      setToolsInfo({
        available_tools: {
          pattern_matcher: true,
          slither: false,
          mythril: false,
          semgrep: false,
          solhint: false
        }
      });
    } finally {
      setIsLoadingHealth(false);
    }
  };

  const extractAddressFromUrl = (url) => {
    const patterns = [
      /address\/(0x[a-fA-F0-9]{40})/,
      /token\/(0x[a-fA-F0-9]{40})/,
      /(0x[a-fA-F0-9]{40})/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }
    return url;
  };

  const handleAddressChange = (value) => {
    if (value.includes('scan') || value.includes('http')) {
      const extractedAddress = extractAddressFromUrl(value);
      setAddress(extractedAddress);
      
      if (value.includes('lineascan')) {
        setNetwork('linea');
      } else if (value.includes('sonicscan')) {
        setNetwork('sonic');
      }
    } else {
      setAddress(value);
    }
  };

  const handleAddressSubmit = async (submittedAddress, submittedNetwork) => {
    if (!submittedAddress) return;
    
    // Prevent multiple simultaneous requests
    if (requestInProgress) {
      console.log('Request already in progress, ignoring duplicate request');
      return;
    }
    
    setRequestInProgress(true);
    setAddress(submittedAddress);
    setNetwork(submittedNetwork);
    
    // Update URL only if it's different to prevent router loop
    const currentQuery = router.query;
    if (currentQuery.address !== submittedAddress || currentQuery.network !== submittedNetwork) {
      try {
        await router.replace({
          pathname: router.pathname,
          query: { address: submittedAddress, network: submittedNetwork }
        }, undefined, { shallow: true });
      } catch (error) {
        console.warn('Router update failed:', error);
        // Continue with the rest of the function even if router update fails
      }
    }
    
    // Reset previous results
    setToolsScanResult(null);
    setAIScanResult(null);
    setToolsError(null);
    setAIError(null);
    setContractInfo(null);
    setContractSource(null);
    setLoadingError(null);
    
    // Fetch contract info
    try {
      setIsLoadingContract(true);
      const sourceData = await ContractScannerAPI.getContractSource(
        submittedAddress, 
        submittedNetwork
      );
      
      if (sourceData.sourceCode) {
        setContractInfo(sourceData);
        setContractSource(sourceData.sourceCode);
        setLoadingError(null);
      } else {
        setLoadingError(sourceData.error || 'Contract source code not available. The contract may not be verified on the explorer.');
        setContractInfo({ 
          address: submittedAddress,
          network: submittedNetwork,
          contractName: `Contract-${submittedAddress.slice(0, 6)}`,
          compilerVersion: 'Unknown'
        });
      }
    } catch (error) {
      console.error('Failed to fetch contract source:', error);
      setLoadingError(error.message);
      setContractInfo({ 
        error: error.message,
        address: submittedAddress,
        network: submittedNetwork
      });
    } finally {
      setIsLoadingContract(false);
      setRequestInProgress(false);
    }
  };

  const handleToolsScan = async (scanOptions) => {
    if (!contractSource || !contractInfo) {
      setToolsError('Contract source code not available');
      return;
    }
    
    try {
      setIsToolsScanning(true);
      setToolsError(null);
      
      const filename = `${contractInfo.contractName || 'Contract'}.sol`;
      
      const result = await ContractScannerAPI.scanContractCode(
        contractSource,
        filename,
        {
          ...scanOptions,
          format: 'json'
        }
      );
      
      result.originalCode = contractSource;
      result.contractInfo = contractInfo;
      
      setToolsScanResult(result);
    } catch (error) {
      console.error('Tools scan failed:', error);
      setToolsError(error.message);
    } finally {
      setIsToolsScanning(false);
    }
  };

  const handleAIScan = async (scanOptions = {}) => {
    if (!contractSource || !contractInfo) {
      setAIError('Contract source code not available');
      return;
    }
    
    try {
      setIsAIScanning(true);
      setAIError(null);
      
      const result = await analyzeWithAI(
        contractSource,
        contractInfo.contractName || 'Unknown Contract',
        { 
          ...scanOptions,
          timeout: scanOptions.timeout || (scanOptions.type === 'full-scan' ? 300000 : 120000),
          temperature: 0.1,
          max_tokens: scanOptions.type === 'full-scan' ? 6000 : 4000
        }
      );
      
      result.contractInfo = contractInfo;
      result.scanOptions = scanOptions;
      setAIScanResult(result);
    } catch (error) {
      console.error('AI scan failed:', error);
      setAIError(error.message);
    } finally {
      setIsAIScanning(false);
    }
  };

  const isLoading = isLoadingContract || isToolsScanning || isAIScanning;

  return (
    <Layout>
      <Head>
        <title>Smart Contract Security Audit - DeFi Watchdog</title>
        <meta name="description" content="Comprehensive smart contract security analysis using multiple tools and AI" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Head>
      
      <div className="container mx-auto px-4 py-8 mt-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Smart Contract Security Audit
          </h1>
          <p className="text-xl text-gray-600">
            Advanced multi-tool security analysis powered by AI
          </p>
        </div>

        {/* Unified Contract Input and Analysis Interface */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          {/* Address Input Section */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Contract Analysis</h2>
            <p className="text-gray-600 mb-6">
              Enter a contract address or paste a LineaScan/SonicScan URL to begin security analysis
            </p>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              if (address.trim()) {
                handleAddressSubmit(address.trim(), network);
              }
            }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-3">
                  <label htmlFor="contract-address" className="block text-sm font-medium text-gray-700 mb-2">
                    Contract Address or Scan URL
                  </label>
                  <input
                    type="text"
                    id="contract-address"
                    placeholder="0x... or https://lineascan.build/address/0x..."
                    value={address}
                    onChange={(e) => handleAddressChange(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label htmlFor="network" className="block text-sm font-medium text-gray-700 mb-2">
                    Network
                  </label>
                  <select
                    id="network"
                    value={network}
                    onChange={(e) => setNetwork(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    disabled={isLoading}
                  >
                    <option value="linea">Linea Network</option>
                    <option value="sonic">Sonic Network</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={!address.trim() || isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200"
              >
                {isLoadingContract ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Loading Contract...
                  </div>
                ) : (
                  'Load Contract'
                )}
              </button>
            </form>

            {/* Quick Examples */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Example Contracts for Testing</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setAddress('0x2d8879046f1559e53eb052e949e9544bcb72f414');
                    setNetwork('linea');
                  }}
                  className="text-xs text-blue-600 hover:text-blue-800 hover:underline text-left p-2 rounded border hover:bg-blue-50"
                  disabled={isLoading}
                >
                  Linea DEX Router: 0x2d8879046f1559e53eb052e949e9544bcb72f414
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAddress('0xDd0F30DdC0D6B16B3e1E40bd7e95854246Ec3A13');
                    setNetwork('sonic');
                  }}
                  className="text-xs text-blue-600 hover:text-blue-800 hover:underline text-left p-2 rounded border hover:bg-blue-50"
                  disabled={isLoading}
                >
                  Sonic Swap Router: 0xDd0F30DdC0D6B16B3e1E40bd7e95854246Ec3A13
                </button>
              </div>
            </div>
          </div>

          {/* Contract Info Display */}
          {(contractInfo || isLoadingContract || loadingError) && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Contract Information</h3>
              {isLoadingContract ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  <span>Loading contract information...</span>
                </div>
              ) : loadingError ? (
                <div className="p-4 bg-red-50 text-red-700 rounded-md">
                  <p className="font-medium">⚠️ Error: {loadingError}</p>
                  <div className="mt-2 text-sm">
                    <p><strong>Possible solutions:</strong></p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>Make sure the contract is verified on {network === 'sonic' ? 'SonicScan' : 'LineaScan'}</li>
                      <li>Check if the address is correct (40 characters, starts with 0x)</li>
                      <li>Try switching networks if you're unsure</li>
                      <li>Ensure the contract is properly verified on the explorer</li>
                    </ul>
                  </div>
                </div>
              ) : contractInfo && contractSource ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Contract Name</p>
                    <p className="font-medium">{contractInfo.contractName || 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Compiler Version</p>
                    <p className="font-medium">{contractInfo.compilerVersion || 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Network</p>
                    <p className="font-medium capitalize">{network}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="text-green-600 font-medium">✅ Ready for Analysis</p>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* Analysis Options - Only show when contract is loaded */}
          {contractSource && !loadingError && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Tools Analysis */}
              <ToolsScanCard
                scannerHealth={scannerHealth}
                toolsInfo={toolsInfo}
                isLoading={isLoadingHealth}
                isScanning={isToolsScanning}
                onScan={handleToolsScan}
                error={toolsError}
                result={toolsScanResult}
              />

              {/* AI Analysis */}
              <AIScanCard
                isScanning={isAIScanning}
                onScan={handleAIScan}
                error={aiError}
                result={aiScanResult}
              />
            </div>
          )}
        </div>

        {/* Results Section */}
        {(toolsScanResult || aiScanResult) && (
          <EnhancedScanResults
            toolsResult={toolsScanResult}
            aiResult={aiScanResult}
            contractInfo={contractInfo}
          />
        )}

        {/* How It Works & Tools Overview */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* How It Works */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">How It Works</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2 flex items-center">
                  <span className="mr-2">🔍</span> 1. Load Contract
                </h4>
                <p className="text-sm text-gray-600">
                  Enter a contract address and we'll fetch the verified source code from the blockchain explorer.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2 flex items-center">
                  <span className="mr-2">🛠️</span> 2. Security Tools
                </h4>
                <p className="text-sm text-gray-600">
                  Choose from multiple scan modes and run industry-standard security tools for comprehensive analysis.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2 flex items-center">
                  <span className="mr-2">🤖</span> 3. AI Analysis
                </h4>
                <p className="text-sm text-gray-600">
                  Advanced AI models analyze contract logic and identify complex vulnerabilities.
                </p>
              </div>
            </div>
          </div>

          {/* Security Tools Overview */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-blue-900">Available Security Tools</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-white rounded border">
                <div className="flex items-center">
                  <span className="mr-2">🔍</span>
                  <div>
                    <p className="font-medium text-sm">Pattern Matcher</p>
                    <p className="text-xs text-gray-500">&lt; 5s • Basic patterns</p>
                  </div>
                </div>
                <span className="text-green-600 text-xs font-medium">✅ Always Available</span>
              </div>
              
              <div className="flex items-center justify-between p-2 bg-white rounded border">
                <div className="flex items-center">
                  <span className="mr-2">🐍</span>
                  <div>
                    <p className="font-medium text-sm">Slither</p>
                    <p className="text-xs text-gray-500">10-30s • 70+ detectors</p>
                  </div>
                </div>
                <span className="text-orange-600 text-xs font-medium">⚡ Optional</span>
              </div>
              
              <div className="flex items-center justify-between p-2 bg-white rounded border">
                <div className="flex items-center">
                  <span className="mr-2">⚡</span>
                  <div>
                    <p className="font-medium text-sm">Mythril</p>
                    <p className="text-xs text-gray-500">1-5min • Deep logic</p>
                  </div>
                </div>
                <span className="text-orange-600 text-xs font-medium">⚡ Optional</span>
              </div>
              
              <div className="flex items-center justify-between p-2 bg-white rounded border">
                <div className="flex items-center">
                  <span className="mr-2">🎯</span>
                  <div>
                    <p className="font-medium text-sm">Semgrep</p>
                    <p className="text-xs text-gray-500">30-60s • Community rules</p>
                  </div>
                </div>
                <span className="text-orange-600 text-xs font-medium">⚡ Optional</span>
              </div>
              
              <div className="flex items-center justify-between p-2 bg-white rounded border">
                <div className="flex items-center">
                  <span className="mr-2">✨</span>
                  <div>
                    <p className="font-medium text-sm">Solhint</p>
                    <p className="text-xs text-gray-500">&lt; 10s • Style + security</p>
                  </div>
                </div>
                <span className="text-orange-600 text-xs font-medium">⚡ Optional</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
