import { useState, useEffect } from 'react';
import { useWallet } from '../../hooks/useWallet';

export default function UserAuditHistory() {
  const { account, isConnected } = useWallet();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, [account]);

  const loadHistory = async () => {
    setLoading(true);
    
    try {
      const localHistory = [];
      
      // Load from localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('certificate_')) {
          try {
            const certData = JSON.parse(localStorage.getItem(key));
            localHistory.push(certData);
          } catch (error) {
            console.warn('Invalid certificate data:', key);
          }
        }
      }
      
      // Load from API if available
      try {
        const response = await fetch('/api/user-audit-history');
        if (response.ok) {
          const apiData = await response.json();
          if (apiData.success && apiData.history) {
            // Merge with local history, avoiding duplicates
            apiData.history.forEach(apiCert => {
              const exists = localHistory.find(local => 
                local.id === apiCert.id || 
                local.contractAddress === apiCert.contractAddress
              );
              if (!exists) {
                localHistory.push(apiCert);
              }
            });
          }
        }
      } catch (error) {
        console.warn('Could not load from API:', error);
      }
      
      // Sort by timestamp
      localHistory.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      setHistory(localHistory);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Your Audit History</h3>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading your audit history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Your Audit History</h3>
        <button
          onClick={loadHistory}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          🔄 Refresh
        </button>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-4">📋</div>
          <p className="mb-2">No audit history found</p>
          <p className="text-sm">Complete an audit and create a certificate to see it here!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((audit, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium text-gray-900">
                      {audit.contractName || 'Unknown Contract'}
                    </h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(audit.riskLevel)}`}>
                      {audit.riskLevel || 'Unknown'} Risk
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-3">
                    <p className="font-mono">{audit.contractAddress}</p>
                    <p>Audited: {new Date(audit.timestamp).toLocaleDateString()}</p>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-600">
                      Score: <span className="font-medium">{audit.securityScore}/100</span>
                    </span>
                    <span className="text-gray-600">
                      Issues: <span className="font-medium">{audit.findings || 0}</span>
                    </span>
                    {audit.hasIPFSReport && (
                      <span className="text-green-600 font-medium">
                        ✅ IPFS Stored
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  {audit.hasIPFSReport && audit.ipfsHash && (
                    <a
                      href={audit.ipfsUrl || `https://gateway.pinata.cloud/ipfs/${audit.ipfsHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      📋 IPFS Report
                    </a>
                  )}
                  
                  {audit.tokenId && (
                    <a
                      href={`/certificate/${audit.tokenId}`}
                      className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      🏆 Certificate
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {!isConnected && history.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
          💡 Connect your wallet to see all your audit history across devices
        </div>
      )}
    </div>
  );
}
