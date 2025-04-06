// src/pages/audit-new.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../components/layout/Layout';
import { ClientAuditAnalyzer } from '../components/ClientAuditAnalyzer';
import { analyzeContract } from '../lib/AuditAPI';
import { analyzeContractWithTools } from '../lib/tools-analyzer';
import RiskItem from '../components/audit/RiskItem';

const callServerAnalysis = async (address, network) => {
  try {
    const response = await fetch('/api/reliable-analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address,
        network,
        method: 'server',
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed with status ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Server analysis error:', error);
    throw error;
  }
};

export default function AuditTool() {
  const router = useRouter();
  const [address, setAddress] = useState('');
  const [network, setNetwork] = useState('linea');
  const [analysisMethod, setAnalysisMethod] = useState('client');
  const [isLoading, setIsLoading] = useState(false);
  const [useClientAnalyzer, setUseClientAnalyzer] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Process URL parameters
  useEffect(() => {
    if (router.query.address) {
      setAddress(router.query.address);
      if (router.query.network) {
        setNetwork(router.query.network);
      }
    }
  }, [router.query]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    if (!address) return;
    
    setIsLoading(true);
    setError(null);
    setResult(null);
    
    try {
      // Update the URL without reloading
      router.push({
        pathname: router.pathname,
        query: { address, network }
      }, undefined, { shallow: true });
      
      if (analysisMethod === 'client') {
        // Use client-side analysis
        setUseClientAnalyzer(true);
      } else if (analysisMethod === 'tools') {
        // Use tools analysis (Slither, MythX, etc.)
        try {
          // Call the tools analyzer directly
          const analysisResult = await analyzeContractWithTools(address, network, {
            updateCallback: (state) => {
              // Update the loading state with tool progress
              if (state.step) {
                setIsLoading(true);
              }
            }
          });
          
          setResult(analysisResult);
        } catch (error) {
          console.error('Tools analysis failed:', error);
          setError(error.message || 'Tools analysis failed');
          
          // Offer to switch to client analysis as fallback
          if (window.confirm('Tools analysis failed. Would you like to try Deep Analysis instead?')) {
            setUseClientAnalyzer(true);
            return;
          }
        }
      } else {
        // Try server analysis
        try {
          const analysisResult = await callServerAnalysis(address, network);
          
          // Check if server recommends client analysis
          if (analysisResult.clientSideAnalysisRecommended) {
            if (window.confirm('For best results with this contract, we recommend Deep Analysis. Would you like to switch?')) {
              setUseClientAnalyzer(true);
              return;
            }
          }
          
          setResult(analysisResult);
        } catch (error) {
          console.error('Server analysis failed:', error);
          
          if (window.confirm('Server analysis failed. Would you like to try Deep Analysis instead?')) {
            setUseClientAnalyzer(true);
            return;
          }
          
          setError(error.message || 'Analysis failed');
        }
      }
    } catch (error) {
      setError(error.message || 'Analysis failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalysisComplete = (analysisResult) => {
    setResult(analysisResult);
    setUseClientAnalyzer(false);
    setIsLoading(false);
  };

  return (
    <Layout>
      <Head>
        <title>Smart Contract Audit - DeFi Watchdog</title>
        <style jsx global>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </Head>
      
      <div className="container mx-auto px-4 py-8 mt-10">
        <h1 className="text-3xl font-bold mb-4">Smart Contract Security Audit</h1>
        <p className="mb-6">Enter a smart contract address to analyze its security:</p>
        
        {!isLoading && !useClientAnalyzer && !result ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="contract-address" className="block mb-2 font-medium">
                  Contract Address
                </label>
                <input 
                  type="text" 
                  id="contract-address"
                  placeholder="0x..." 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md" 
                />
              </div>
              
              <div>
                <label htmlFor="network" className="block mb-2 font-medium">
                  Network
                </label>
                <select
                  id="network"
                  value={network}
                  onChange={(e) => setNetwork(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md"
                >
                  <option value="linea">Linea Network</option>
                  <option value="sonic">Sonic Network</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="analysis-method" className="block mb-2 font-medium">
                  Analysis Method
                </label>
                <select
                  id="analysis-method"
                  value={analysisMethod}
                  onChange={(e) => setAnalysisMethod(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md"
                >
                  <option value="client">Deep Analysis (AI)</option>
                  <option value="tools">Tool Analysis (Slither, MythX)</option>
                  <option value="server">Server Analysis (may timeout)</option>
                </select>
                <p className="mt-2 text-sm text-gray-500">
                  {analysisMethod === 'client' 
                    ? 'Uses advanced AI for detailed vulnerability analysis without timeouts.' 
                    : analysisMethod === 'tools'
                    ? 'Uses security tools like Slither and MythX for static code analysis.'
                    : 'Uses server-side analysis which may timeout for complex contracts.'}
                </p>
                {analysisMethod === 'tools' && (
                  <div>
                    <div className="mt-1 text-xs text-amber-600">
                      <span className="font-medium">Note:</span> Using external tools from API server at 89.147.103.119:3001
                      <button 
                        type="button"
                        onClick={() => {
                          fetch('http://89.147.103.119:3001/ping')
                            .then(res => res.json())
                            .then(data => alert(`API Status: ${JSON.stringify(data)}`))
                            .catch(err => alert(`Error: ${err.message}`));
                        }}
                        className="text-blue-600 hover:underline ml-2"
                      >
                        Test API Connection
                      </button>
                    </div>
                    <div className="mt-1 text-xs text-blue-600">
                      <button 
                        type="button"
                        onClick={() => window.open('https://github.com/crytic/slither', '_blank')}
                        className="text-blue-600 hover:underline"
                      >
                        Learn about Slither
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-md">
                  {error}
                </div>
              )}
              
              <button 
                type="submit"
                disabled={!address}
                className="px-6 py-3 bg-blue-600 text-white rounded-md disabled:opacity-50"
              >
                Analyze Contract
              </button>
            </form>
          </div>
        ) : useClientAnalyzer ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <ClientAuditAnalyzer 
              address={address}
              network={network}
              onAnalysisComplete={handleAnalysisComplete}
            />
          </div>
        ) : isLoading ? (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3>Analyzing Contract...</h3>
            <div className="mt-4 relative pt-1">
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                <div className="w-full animate-pulse rounded flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
              </div>
            </div>
            <p>Please wait while we analyze your contract...</p>
          </div>
        ) : result ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className={`px-6 py-4 flex justify-between items-center ${result.isSafe ? 'bg-green-50' : 'bg-red-50'}`}>
              <div>
                <h2 className="text-xl font-bold">Contract Analysis Results</h2>
                <p className="text-gray-600">{result.contractName || address}</p>
              </div>
              <div>
                <span className={`inline-block px-3 py-1 text-sm font-bold rounded-full ${
                  result.isSafe ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {result.isSafe ? 'Safe' : 'Risks Detected'}
                </span>
              </div>
            </div>
            
            <div className="p-6 border-b border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm text-gray-500 mb-1">Contract Name</h3>
                  <p className="font-medium">{result.contractName}</p>
                </div>
                <div>
                  <h3 className="text-sm text-gray-500 mb-1">Contract Type</h3>
                  <p className="font-medium">{result.contractType || 'Unknown'}</p>
                </div>
                <div>
                  <h3 className="text-sm text-gray-500 mb-1">Security Score</h3>
                  <p className={`font-medium ${
                    result.securityScore > 80 ? 'text-green-600' : 
                    result.securityScore > 60 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {result.securityScore}/100
                  </p>
                </div>
                <div>
                  <h3 className="text-sm text-gray-500 mb-1">Risk Level</h3>
                  <p className="font-medium">{result.riskLevel || 'Unknown'}</p>
                </div>
                {result.toolsUsed && result.toolsUsed.length > 0 && (
                <div>
                  <h3 className="text-sm text-gray-500 mb-1">Tools Used</h3>
                  <p className="font-medium">{result.toolsUsed.join(', ')}</p>
                </div>
                )}
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Analysis Results</h3>
              <p className="mb-4">{result.analysis?.overview}</p>
              
              {result.analysis?.risks?.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-md font-semibold mb-2">Security Issues</h4>
                  <div className="space-y-3">
                    {result.analysis.risks.map((risk, index) => (
                      <RiskItem key={index} risk={risk} />
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="px-6 py-4 bg-gray-50 flex justify-between">
              <a 
                href={result.etherscanUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-2 border rounded-md text-gray-800 hover:bg-gray-100"
              >
                View on {network === 'sonic' ? 'SonicScan' : 'LineaScan'}
              </a>
              
              <button 
                onClick={() => {
                  setResult(null);
                  setError(null);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Analyze Another Contract
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </Layout>
  );
}