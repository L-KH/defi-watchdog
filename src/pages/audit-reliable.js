// src/pages/audit-reliable.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '../components/layout/Layout';
import { ReliableAuditAnalyzer } from '../components/ReliableAuditAnalyzer';

export default function AuditReliable() {
  const router = useRouter();
  const [address, setAddress] = useState('');
  const [network, setNetwork] = useState('linea');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Check for address in URL
  useEffect(() => {
    if (router.query.address) {
      setAddress(router.query.address);
      if (router.query.network) {
        setNetwork(router.query.network);
      }
      
      // Auto-analyze if address is in URL
      if (!isAnalyzing && !result) {
        handleSubmit();
      }
    }
  }, [router.query]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    
    if (!address) return;
    
    setIsAnalyzing(true);
    setError(null);
    setResult(null);
    
    // Update URL without reloading
    router.push({
      pathname: router.pathname,
      query: { address, network }
    }, undefined, { shallow: true });
  };

  const handleAnalysisComplete = (analysisResult) => {
    setResult(analysisResult);
    setIsAnalyzing(false);
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
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-bold mb-4">Smart Contract Security Audit</h1>
        <p className="mb-6">Enter a smart contract address to analyze its security:</p>
        
        {!isAnalyzing && !result ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block mb-2 font-medium">Contract Address</label>
                <input 
                  type="text" 
                  placeholder="0x..." 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md" 
                />
              </div>
              
              <div>
                <label className="block mb-2 font-medium">Network</label>
                <select
                  value={network}
                  onChange={(e) => setNetwork(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md"
                >
                  <option value="linea">Linea Network</option>
                  <option value="sonic">Sonic Network</option>
                </select>
              </div>
              
              {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-md">
                  {error}
                </div>
              )}
              
              <button 
                type="submit"
                disabled={!address}
                className="px-6 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
              >
                Analyze Contract
              </button>
            </form>
          </div>
        ) : isAnalyzing ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <ReliableAuditAnalyzer 
              address={address}
              network={network}
              onAnalysisComplete={handleAnalysisComplete}
            />
          </div>
        ) : result ? (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className={`px-6 py-4 flex justify-between items-center ${result.isSafe ? 'bg-green-50' : 'bg-red-50'}`}>
                <div>
                  <h2 className="text-xl font-semibold">Contract Analysis Results</h2>
                  <p className="text-gray-600">{result.contractName} ({result.address.substring(0, 6)}...{result.address.slice(-4)})</p>
                </div>
                <div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${result.isSafe ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {result.isSafe ? 'Safe' : 'Risks Detected'}
                  </span>
                </div>
              </div>
              
              <div className="p-6 border-b">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm text-gray-500 mb-1">Contract Name</h3>
                    <p className="font-medium">{result.contractName}</p>
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-500 mb-1">Contract Type</h3>
                    <p className="font-medium">{result.analysis.contractType}</p>
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-500 mb-1">Security Score</h3>
                    <p className="font-medium">
                      <span className={result.securityScore > 80 ? 'text-green-600' : result.securityScore > 60 ? 'text-yellow-600' : 'text-red-600'}>
                        {result.securityScore}/100
                      </span>
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-500 mb-1">Risk Level</h3>
                    <p className="font-medium">{result.riskLevel}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">AI Analysis</h3>
                <div className="mb-6">
                  <h4 className="font-medium mb-2">Contract Overview</h4>
                  <p className="text-gray-700">{result.analysis.overview}</p>
                </div>
                
                {result.analysis.keyFeatures?.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-medium mb-2">Key Features</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {result.analysis.keyFeatures.map((feature, index) => (
                        <li key={index} className="text-gray-700">{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {result.analysis.risks?.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-medium mb-2">Security Findings</h4>
                    <div className="space-y-4">
                      {result.analysis.risks.map((risk, index) => (
                        <div key={index} className="border rounded-md p-4">
                          <div className="flex justify-between">
                            <span className="font-medium">{risk.title || 'Security Issue'}</span>
                            <span className={`px-2 py-1 text-xs font-bold rounded ${
                              risk.severity === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                              risk.severity === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                              risk.severity === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                              risk.severity === 'LOW' ? 'bg-green-100 text-green-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {risk.severity}
                            </span>
                          </div>
                          <p className="mt-2 text-gray-700">{risk.description}</p>
                          {risk.recommendation && (
                            <p className="mt-2 text-gray-600">
                              <span className="font-medium">Recommendation:</span> {risk.recommendation}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <h4 className="font-medium mb-2">Security Assessment</h4>
                  <p className="text-gray-700">{result.analysis.explanation}</p>
                </div>
              </div>
              
              <div className="px-6 py-4 bg-gray-50 flex justify-between">
                <a 
                  href={result.etherscanUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
                >
                  View on {network === 'sonic' ? 'SonicScan' : 'LineaScan'}
                </a>
                
                <button 
                  onClick={() => {
                    setResult(null);
                    setIsAnalyzing(false);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                  Analyze Another Contract
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </Layout>
  );
}
