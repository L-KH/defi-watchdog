// src/pages/audit-pro.js - PREMIUM AUDIT PAGE (ENHANCED WORKING VERSION)
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '../components/layout/Layout';
import { useToast } from '../components/common/Toast';
import ContractScannerAPI from '../services/contractScannerApi';
import { analyzeWithAI } from '../lib/aiAnalysis';

// Component imports for Premium page
import AIScanCardPremium from '../components/audit/AIScanCardPremium';
import EnhancedScanResults from '../components/audit/EnhancedScanResults';
import MockStaticToolsCard from '../components/MockStaticToolsCard'; // Mock tools component

// Empty Static Analysis Card Component for Pro - Now with Mock Analysis
function ToolsScanCardPro({ scannerHealth, toolsInfo, isLoading, isScanning, onScan, error, result, contractSource, contractInfo }) {
  const [isMockScanning, setIsMockScanning] = useState(false);
  const [mockResult, setMockResult] = useState(null);
  
  // Enhanced mock analysis generator
  const generateMockAnalysis = async () => {
    if (!contractSource || !contractInfo) {
      alert('Please load a contract first to run mock analysis');
      return;
    }
    
    setIsMockScanning(true);
    
    // Simulate analysis time
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mockAnalysisResult = {
      success: true,
      analysisType: 'premium_mock',
      metadata: {
        contractName: contractInfo.contractName || 'Test Contract',
        contractAddress: contractInfo.address,
        analyzedAt: new Date().toISOString(),
        analysisVersion: '2.0-mock',
        tools: ['MockSlither', 'MockMythril', 'MockSemgrep', 'MockSolhint', 'MockDetector']
      },
      analysis: {
        summary: 'Mock comprehensive security analysis completed. This is a test analysis with realistic findings for development purposes.',
        overview: 'Professional mock audit analysis simulating real-world security assessment results.',
        securityScore: Math.floor(Math.random() * 30) + 65, // Random score 65-95
        riskLevel: ['Low', 'Medium'][Math.floor(Math.random() * 2)],
        
        keyFindings: [
          {
            id: 'MOCK_001',
            title: 'Potential Reentrancy Vulnerability',
            severity: 'MEDIUM',
            description: 'Mock finding: The contract may be vulnerable to reentrancy attacks in the withdraw function.',
            location: 'Line 45-67',
            recommendation: 'Implement checks-effects-interactions pattern and use ReentrancyGuard.',
            category: 'Security'
          },
          {
            id: 'MOCK_002', 
            title: 'Gas Optimization Opportunity',
            severity: 'LOW',
            description: 'Mock finding: Loop operations can be optimized to reduce gas consumption.',
            location: 'Line 23-35',
            recommendation: 'Consider using more efficient data structures or batch operations.',
            category: 'Gas Optimization'
          },
          {
            id: 'MOCK_003',
            title: 'Access Control Review',
            severity: 'INFO',
            description: 'Mock finding: Review access control modifiers for proper permission management.',
            location: 'Multiple functions',
            recommendation: 'Ensure all sensitive functions have appropriate access controls.',
            category: 'Best Practices'
          }
        ],
        
        gasOptimizations: [
          {
            title: 'Storage Variable Packing',
            description: 'Reorder storage variables to pack them efficiently',
            potentialSavings: '2,500 gas per transaction',
            severity: 'MEDIUM'
          },
          {
            title: 'Loop Optimization',
            description: 'Cache array length in loops',
            potentialSavings: '50 gas per iteration',
            severity: 'LOW'
          }
        ],
        
        codeQualityIssues: [
          {
            title: 'Missing Documentation',
            description: 'Add NatSpec comments to public functions',
            location: 'Multiple functions',
            severity: 'INFO'
          }
        ],
        
        gasOptimizationScore: Math.floor(Math.random() * 20) + 75,
        codeQualityScore: Math.floor(Math.random() * 25) + 70
      },
      
      modelsUsed: ['MockGPT-4', 'MockClaude', 'MockDeepSeek'],
      processingTime: '3.2 seconds (mock)',
      
      // Add mock reports
      htmlReport: `
        <h1>Mock Security Audit Report</h1>
        <h2>Contract: ${contractInfo.contractName || 'Test Contract'}</h2>
        <p><strong>Address:</strong> ${contractInfo.address}</p>
        <p><strong>Analysis Date:</strong> ${new Date().toLocaleString()}</p>
        <h3>Executive Summary</h3>
        <p>This is a mock comprehensive security analysis for testing purposes.</p>
        <h3>Findings</h3>
        <ul>
          <li><strong>MEDIUM:</strong> Potential Reentrancy Vulnerability</li>
          <li><strong>LOW:</strong> Gas Optimization Opportunity</li>
          <li><strong>INFO:</strong> Access Control Review</li>
        </ul>
      `,
      
      jsonReport: JSON.stringify({
        contract: contractInfo.contractName,
        address: contractInfo.address,
        findings: 3,
        score: Math.floor(Math.random() * 30) + 65,
        tools: ['MockSlither', 'MockMythril', 'MockSemgrep']
      }, null, 2)
    };
    
    setMockResult(mockAnalysisResult);
    setIsMockScanning(false);
    
    // Call the parent onScan function if provided
    if (onScan) {
      onScan(mockAnalysisResult);
    }
  };
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-600 via-slate-600 to-gray-700 text-white p-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center mr-4">
              <span className="text-2xl">🛠️</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Premium Static Analysis Tools</h2>
              <p className="text-gray-100 text-sm">Professional-grade security tools</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-200">Coming</div>
            <div className="text-xl font-bold">Soon</div>
            <div className="text-sm text-gray-200">✨</div>
          </div>
        </div>
        <p className="text-gray-100 leading-relaxed">
          Advanced static analysis tools and premium integrations will be available here. 
          Stay tuned for exclusive professional-grade security analysis features.
        </p>
      </div>

      <div className="p-8">
        {/* Coming Soon Message */}
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full mb-6">
            <span className="text-4xl">🚧</span>
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Premium Tools Coming Soon</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            We're working on integrating premium static analysis tools and exclusive security features for professional developers.
          </p>
          
          {/* Features Preview */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 mb-6">
            <h4 className="font-semibold text-gray-900 mb-4">What's Coming:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
              <div className="flex items-center">
                <span className="mr-2">🔍</span>
                <span>Advanced Slither Pro</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">⚡</span>
                <span>Mythril Enterprise</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">🎯</span>
                <span>Custom Security Rules</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">📊</span>
                <span>Advanced Reporting</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">🔒</span>
                <span>Compliance Checks</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">⚙️</span>
                <span>CI/CD Integration</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <a
              href="/audit"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <span className="mr-2">🔧</span>
              Try Free Static Tools
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EnhancedAuditToolPro() {
  const router = useRouter();
  const { showError, showSuccess, showWarning } = useToast();
  
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

  // Process URL parameters with debouncing - Fixed version
  useEffect(() => {
    if (router.isReady && router.query.address && !requestInProgress) {
      const queryAddress = router.query.address;
      const queryNetwork = router.query.network || 'linea';
      
      // Only process if different from current state
      if (queryAddress !== address || queryNetwork !== network) {
        console.log('Processing URL parameters:', { queryAddress, queryNetwork });
        setAddress(queryAddress);
        setNetwork(queryNetwork);
        
        // Debounce the handleAddressSubmit call
        const timer = setTimeout(() => {
          handleAddressSubmit(queryAddress, queryNetwork);
        }, 100);
        
        return () => clearTimeout(timer);
      }
    }
  }, [router.isReady, router.query.address, router.query.network, address, network, requestInProgress]);

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
    if (!submittedAddress) {
      showError('Please enter a contract address');
      return;
    }
    
    // Prevent multiple simultaneous requests
    if (requestInProgress) {
      console.log('Request already in progress, ignoring duplicate request');
      return;
    }
    
    console.log('🚀 Starting contract loading process...', { submittedAddress, submittedNetwork });
    
    setRequestInProgress(true);
    setAddress(submittedAddress);
    setNetwork(submittedNetwork);
    
    // Update URL to reflect current state
    if (router.isReady) {
      const currentQuery = router.query;
      if (currentQuery.address !== submittedAddress || currentQuery.network !== submittedNetwork) {
        try {
          await router.push({
            pathname: router.pathname,
            query: { address: submittedAddress, network: submittedNetwork }
          }, undefined, { shallow: true });
        } catch (error) {
          console.warn('Router update failed:', error);
          // Continue with the rest of the function even if router update fails
        }
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
      console.log('📡 Fetching contract source from API...');
      
      const sourceData = await ContractScannerAPI.getContractSource(
        submittedAddress, 
        submittedNetwork
      );
      
      console.log('📡 Contract source response:', sourceData);
      
      if (sourceData.sourceCode) {
        setContractInfo(sourceData);
        setContractSource(sourceData.sourceCode);
        setLoadingError(null);
        showSuccess('Contract loaded successfully!');
        console.log('✅ Contract loaded successfully');
      } else {
        const errorMessage = sourceData.error || 'Contract source code not available. The contract may not be verified on the explorer.';
        setLoadingError(errorMessage);
        setContractInfo({ 
          address: submittedAddress,
          network: submittedNetwork,
          contractName: `Contract-${submittedAddress.slice(0, 6)}`,
          compilerVersion: 'Unknown'
        });
        showWarning('Contract source not available');
        console.log('⚠️ Contract source not available:', errorMessage);
      }
    } catch (error) {
      console.error('❌ Failed to fetch contract source:', error);
      setLoadingError(error.message);
      setContractInfo({ 
        error: error.message,
        address: submittedAddress,
        network: submittedNetwork
      });
      showError('Failed to load contract: ' + error.message);
    } finally {
      setIsLoadingContract(false);
      setRequestInProgress(false);
      console.log('🏁 Contract loading process finished');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (address.trim()) {
      console.log('📝 Form submitted with address:', address.trim());
      await handleAddressSubmit(address.trim(), network);
    } else {
      showError('Please enter a contract address');
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
      showError('Contract source code not available. Please load a contract first.');
      return;
    }
    
    try {
      setIsAIScanning(true);
      setAIError(null);
      
      console.log('🚀 Starting PREMIUM AI analysis with options:', scanOptions);
      
      const result = await analyzeWithAI(
        contractSource,
        contractInfo.contractName || 'Unknown Contract',
        { 
          ...scanOptions,
          type: 'premium', // Force premium analysis
          timeout: scanOptions.timeout || (scanOptions.type === 'premium' ? 300000 : 120000),
          temperature: 0.1,
          max_tokens: scanOptions.type === 'premium' ? 6000 : 4000
        }
      );
      
      result.contractInfo = contractInfo;
      result.scanOptions = scanOptions;
      setAIScanResult(result);
      
      if (result.success !== false) {
        showSuccess('Premium AI analysis completed successfully!');
      } else {
        showError(`Premium AI Analysis Failed: ${result.error}`);
      }
    } catch (error) {
      console.error('AI scan failed:', error);
      setAIError(error.message);
      showError(`Premium AI Analysis Failed: ${error.message}`);
    } finally {
      setIsAIScanning(false);
    }
  };

  // Remove the problematic general isLoading variable that was causing conflicts
  // const isLoading = isLoadingContract || isToolsScanning || isAIScanning;

  return (
    <Layout>
      <Head>
        <title>Premium Smart Contract Security Audit - DeFi Watchdog</title>
        <meta name="description" content="Professional-grade smart contract security analysis with premium AI models and advanced tools" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Head>
      
      <div className="container mx-auto px-4 py-8 mt-10">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center py-2 px-4 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 text-sm font-medium mb-4">
            <span className="animate-pulse mr-2">🚀</span>
            Premium Professional Security Platform
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Premium Smart Contract Audit
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Professional-grade security analysis with premium AI models (Multiple Advanced Models + Supervisor) and comprehensive reporting
          </p>
        </div>
        
        {/* ENHANCED Contract Input Card */}
        <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-xl border border-purple-200 p-8 mb-12">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl mb-4">
                <span className="text-2xl text-white">🚀</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Premium Contract Analysis</h2>
              <p className="text-gray-600">
                Enter any verified smart contract address for professional-grade security analysis
              </p>
            </div>
            
            <form onSubmit={handleFormSubmit} className="space-y-6">
              {/* Enhanced Network Selection */}
              <div className="flex justify-center mb-6">
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-200">
                  <h3 className="text-center text-sm font-semibold text-gray-800 mb-4">🌐 Supported Networks</h3>
                  
                  {/* Active Networks */}
                  <div className="flex flex-wrap justify-center gap-3 mb-4">
                    <button
                      type="button"
                      onClick={() => setNetwork('linea')}
                      className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 min-w-[140px] ${
                        network === 'linea'
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                          : 'bg-white text-gray-700 border border-gray-200 hover:border-green-300 hover:bg-green-50'
                      }`}
                      disabled={isLoadingContract}
                    >
                      <div className="flex items-center justify-center">
                        <span className="mr-2">🟢</span>
                        <div>
                          <div className="font-semibold">Linea</div>
                          <div className="text-xs opacity-75">Active</div>
                        </div>
                      </div>
                    </button>
                  </div>

                  {/* Coming Soon Networks */}
                  <div className="border-t border-purple-200 pt-4">
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-100">
                      <div className="text-center">
                        <div className="text-2xl mb-2">🌐</div>
                        <h4 className="font-medium text-gray-800 mb-1">More Networks Coming Soon</h4>
                        <p className="text-xs text-gray-600">We're expanding to additional blockchain networks</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Input */}
              <div className="relative">
                <label htmlFor="contract-address" className="block text-sm font-semibold text-gray-800 mb-3">
                  Contract Address or Explorer URL
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="contract-address"
                    placeholder="0x742d35Cc6634C0532925a3b8D42C5D7c5041234d or https://lineascan.build/address/0x..."
                    value={address}
                    onChange={(e) => handleAddressChange(e.target.value)}
                    className="w-full px-4 py-4 text-lg border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white shadow-sm"
                    disabled={isLoadingContract}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg className="h-5 w-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Debug info for development */}
              {process.env.NODE_ENV === 'development' && (
                <div className="text-xs text-gray-500 text-center">
                  Debug: Address="{address}" | Loading={isLoadingContract.toString()} | Button Enabled={(!address.trim() || isLoadingContract) ? 'false' : 'true'}
                </div>
              )}
              
              {/* Load Button */}
              <button
                type="submit"
                disabled={!address.trim() || isLoadingContract}
                className={`w-full font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform shadow-lg ${
                  !address.trim() || isLoadingContract
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white hover:scale-105 hover:shadow-xl'
                }`}
              >
                {isLoadingContract ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Loading Contract Source Code...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <span className="mr-2">🚀</span>
                    Load Contract for Premium Analysis
                  </div>
                )}
              </button>
            </form>

            {/* Enhanced Quick Examples */}
            <div className="mt-8 pt-6 border-t border-purple-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
                <span className="mr-2">⚡</span>
                Premium Analysis Examples
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={async () => {
                    const testAddress = '0x2d8879046f1559e53eb052e949e9544bcb72f414';
                    setAddress(testAddress);
                    setNetwork('linea');
                    // Trigger the form submission
                    await handleAddressSubmit(testAddress, 'linea');
                  }}
                  className="text-left p-4 rounded-lg border-2 border-dashed border-green-200 hover:border-green-400 hover:bg-green-50 transition-all duration-200 group"
                  disabled={isLoadingContract}
                >
                  <div className="flex items-center mb-2">
                    <span className="mr-2">🟢</span>
                    <span className="font-medium text-green-800">Linea DEX Router</span>
                  </div>
                  <p className="text-xs text-gray-600 font-mono">0x2d8879046f1559e53eb052e949e9544bcb72f414</p>
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    const testAddress = '0x176211869cA2b568f2A7D4EE941E073a821EE1ff';
                    setAddress(testAddress);
                    setNetwork('linea');
                    // Trigger the form submission
                    await handleAddressSubmit(testAddress, 'linea');
                  }}
                  className="text-left p-4 rounded-lg border-2 border-dashed border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group"
                  disabled={isLoadingContract}
                >
                  <div className="flex items-center mb-2">
                    <span className="mr-2">🟢</span>
                    <span className="font-medium text-blue-800">Linea Token Bridge</span>
                  </div>
                  <p className="text-xs text-gray-600 font-mono">0x176211869cA2b568f2A7D4EE941E073a821EE1ff</p>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Contract Info Display */}
        {(contractInfo || isLoadingContract || loadingError) && (
          <div className="bg-white rounded-xl shadow-lg border border-purple-200 p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <span className="mr-2">📋</span>
              Contract Information
            </h3>
            {isLoadingContract ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mr-3"></div>
                <span className="text-lg">Fetching contract details from blockchain explorer...</span>
              </div>
            ) : loadingError ? (
              <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start">
                  <span className="text-red-500 text-xl mr-3">⚠️</span>
                  <div>
                    <p className="font-semibold text-red-800 mb-2">Unable to Load Contract</p>
                    <p className="text-red-700 mb-4">{loadingError}</p>
                    <div className="bg-red-100 p-4 rounded-md">
                      <p className="font-medium text-red-800 mb-2">💡 Possible Solutions:</p>
                      <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                        <li>Verify the contract is published on {network === 'sonic' ? 'SonicScan' : 'LineaScan'}</li>
                        <li>Ensure the address is valid (40 characters, starts with 0x)</li>
                        <li>Check if you're using the correct network</li>
                        <li>Confirm the contract source code is verified on the explorer</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ) : contractInfo && contractSource ? (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <span className="text-purple-600 text-xl mr-3">✅</span>
                  <span className="font-semibold text-purple-800 text-lg">Contract Successfully Loaded</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Contract Name</p>
                    <p className="font-semibold text-gray-900">{contractInfo.contractName || 'Unknown'}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Compiler Version</p>
                    <p className="font-semibold text-gray-900">{contractInfo.compilerVersion || 'Unknown'}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Network</p>
                    <p className="font-semibold text-gray-900 capitalize">{network}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Source Lines</p>
                    <p className="font-semibold text-gray-900">{contractSource.split('\n').length} lines</p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* Analysis Options - Only show when contract is loaded */}
        {contractSource && !loadingError && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Mock Static Analysis Tools */}
            <MockStaticToolsCard 
              contractSource={contractSource}
              contractInfo={contractInfo}
              onScan={handleToolsScan}
            />

            {/* Premium AI Analysis */}
            <AIScanCardPremium
              isScanning={isAIScanning}
              onScan={handleAIScan}
              error={aiError}
              result={aiScanResult}
              contractSource={contractSource}
              contractInfo={contractInfo}
            />
          </div>
        )}

        {/* Results Section */}
        {(toolsScanResult || aiScanResult) && (
          <div data-results-section>
            <EnhancedScanResults
              toolsResult={toolsScanResult}
              aiResult={aiScanResult}
              contractInfo={contractInfo}
            />
          </div>
        )}

        {/* ENHANCED: Premium Security Analysis Summary */}
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl border border-purple-200 p-8 mt-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-purple-900 mb-2">About Our Premium Security Analysis</h3>
              <p className="text-purple-700">Professional-grade security auditing for production-ready contracts</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Premium AI Models */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-purple-100">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white text-lg">🧠</span>
                  </div>
                  <h4 className="font-semibold text-gray-900">Premium Multi-AI Analysis</h4>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Advanced AI analysis using 6+ premium AI models with supervisor verification for comprehensive security assessment.
                </p>
                <div className="flex flex-wrap gap-1">
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">DeepSeek</span>
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">WizardLM</span>
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">Llama 3.1</span>
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">Supervisor</span>
                </div>
              </div>

              {/* Professional Reports */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-purple-100">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white text-lg">📊</span>
                  </div>
                  <h4 className="font-semibold text-gray-900">Professional Reports</h4>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Comprehensive audit reports with CVSS scoring, remediation guides, and multiple export formats for production use.
                </p>
                <div className="flex flex-wrap gap-1">
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">PDF Export</span>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">HTML Report</span>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">CVSS Scores</span>
                </div>
              </div>

              {/* Gas Optimization */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-purple-100">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white text-lg">⚡</span>
                  </div>
                  <h4 className="font-semibold text-gray-900">Advanced Optimizations</h4>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Advanced gas optimization analysis with specific recommendations for reducing deployment and execution costs.
                </p>
                <div className="flex flex-wrap gap-1">
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Cost Analysis</span>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Optimization Tips</span>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Savings Report</span>
                </div>
              </div>
            </div>

            {/* Key Benefits */}
            <div className="mt-8 pt-6 border-t border-purple-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-purple-600">6+</div>
                  <div className="text-sm text-purple-700">Premium AI Models</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">$0.10</div>
                  <div className="text-sm text-purple-700">Per Analysis</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">2-4min</div>
                  <div className="text-sm text-purple-700">Analysis Time</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">100+</div>
                  <div className="text-sm text-purple-700">Security Checks</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}