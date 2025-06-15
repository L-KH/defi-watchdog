// src/components/AuditHistoryNFT.js
import React, { useState, useEffect } from 'react';
import { useAuditNFT } from '../hooks/useAuditNFT';
import { formatDistanceToNow } from 'date-fns';
import Web3MintButton from './Web3MintButton';

/**
 * Component to display user's audit NFT history with real blockchain integration
 */
export default function AuditHistoryNFT() {
  const {
    userAudits,
    contractStats,
    isLoading,
    isConnected,
    loadUserAudits,
    loadContractStats,
    currentNetwork,
    account
  } = useAuditNFT();

  const [selectedAudit, setSelectedAudit] = useState(null);
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');
  const [showHtmlReport, setShowHtmlReport] = useState(null);
  const [loadingReport, setLoadingReport] = useState(null);

  // Load data on mount and when connected
  useEffect(() => {
    if (isConnected) {
      loadUserAudits();
      loadContractStats();
    }
  }, [isConnected]); // Remove the function dependencies to prevent loops

  // Sort audits based on selection
  const sortedAudits = React.useMemo(() => {
    if (!userAudits) return [];
    
    let filtered = userAudits;
    
    // Apply filters
    if (filterBy === 'static') {
      filtered = userAudits.filter(audit => audit.auditType === 'STATIC');
    } else if (filterBy === 'ai') {
      filtered = userAudits.filter(audit => audit.auditType === 'AI_POWERED');
    } else if (filterBy === 'onchain') {
      filtered = userAudits.filter(audit => audit.onChain);
    } else if (filterBy === 'local') {
      filtered = userAudits.filter(audit => !audit.onChain);
    }
    
    // Apply sorting
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.timestamp) - new Date(a.timestamp);
        case 'oldest':
          return new Date(a.timestamp) - new Date(b.timestamp);
        case 'score-high':
          return b.securityScore - a.securityScore;
        case 'score-low':
          return a.securityScore - b.securityScore;
        default:
          return 0;
      }
    });
  }, [userAudits, sortBy, filterBy]);

  const getRiskBadgeColor = (riskLevel) => {
    const level = riskLevel?.toUpperCase();
    switch (level) {
      case 'LOW': return 'bg-green-100 text-green-800 border-green-200';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'CRITICAL': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  const formatTimestamp = (timestamp) => {
    try {
      const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return 'Unknown time';
    }
  };

  // Function to generate HTML report from IPFS data
  const generateHtmlFromIpfs = async (audit) => {
    try {
      setLoadingReport(audit.tokenId);
      
      // Fetch IPFS data
      console.log('Fetching IPFS data for audit:', audit.tokenId);
      const response = await fetch(audit.ipfsUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch IPFS data');
      }
      
      const ipfsData = await response.json();
      console.log('IPFS data fetched:', ipfsData);
      
      // Extract audit information from IPFS data
      const auditResult = ipfsData.auditResult || {};
      const analysis = auditResult.analysis || {};
      
      // Generate professional HTML report
      const htmlReport = generateProfessionalHtmlReport({
        contractName: ipfsData.contractName || audit.contractName,
        contractAddress: ipfsData.contractAddress || audit.contractAddress,
        auditDate: audit.timestamp,
        auditType: audit.auditType,
        securityScore: ipfsData.securityScore || audit.securityScore,
        riskLevel: ipfsData.riskLevel || audit.riskLevel,
        summary: analysis.summary || analysis.overview || 'Security analysis completed.',
        keyFindings: analysis.keyFindings || [],
        gasOptimizations: analysis.gasOptimizations || [],
        codeQualityIssues: analysis.codeQualityIssues || [],
        modelsUsed: auditResult.modelsUsed || ['Analysis Engine'],
        processingTime: auditResult.processingTime || 'N/A',
        requestId: ipfsData.requestId,
        network: ipfsData.network || audit.network,
        ipfsHash: audit.ipfsHash
      });
      
      // Create and download the HTML file
      const blob = new Blob([htmlReport], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${ipfsData.contractName || 'contract'}_audit_report_${audit.tokenId}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      console.log('HTML report generated and downloaded successfully');
      
    } catch (error) {
      console.error('Failed to generate HTML report:', error);
      alert(`Failed to generate HTML report: ${error.message}`);
    } finally {
      setLoadingReport(null);
    }
  };

  // Function to generate professional HTML report
  const generateProfessionalHtmlReport = (data) => {
    const timestamp = new Date(data.auditDate).toLocaleString();
    const scoreColor = data.securityScore >= 80 ? '#10b981' : data.securityScore >= 60 ? '#f59e0b' : '#ef4444';
    const riskColor = data.riskLevel === 'Low' ? '#10b981' : data.riskLevel === 'Medium' ? '#f59e0b' : '#ef4444';
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Security Audit Report - ${data.contractName}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #1f2937;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 10px;
        }
        
        .header .subtitle {
            font-size: 1.2rem;
            opacity: 0.9;
            margin-bottom: 20px;
        }
        
        .header .meta {
            display: flex;
            justify-content: center;
            gap: 30px;
            flex-wrap: wrap;
            font-size: 0.9rem;
        }
        
        .content {
            padding: 40px;
        }
        
        .section {
            margin-bottom: 40px;
        }
        
        .section h2 {
            font-size: 1.8rem;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 3px solid #667eea;
        }
        
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .stat-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 20px;
            text-align: center;
        }
        
        .stat-value {
            font-size: 2rem;
            font-weight: 700;
            margin-bottom: 5px;
        }
        
        .stat-label {
            color: #64748b;
            font-size: 0.9rem;
        }
        
        .findings {
            display: grid;
            gap: 15px;
        }
        
        .finding {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 20px;
            border-left: 4px solid #667eea;
        }
        
        .finding.critical {
            border-left-color: #dc2626;
            background: #fef2f2;
        }
        
        .finding.high {
            border-left-color: #ea580c;
            background: #fff7ed;
        }
        
        .finding.medium {
            border-left-color: #d97706;
            background: #fffbeb;
        }
        
        .finding.low {
            border-left-color: #059669;
            background: #ecfdf5;
        }
        
        .finding-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }
        
        .finding-title {
            font-weight: 600;
            font-size: 1.1rem;
        }
        
        .severity-badge {
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 500;
            text-transform: uppercase;
        }
        
        .severity-critical {
            background: #dc2626;
            color: white;
        }
        
        .severity-high {
            background: #ea580c;
            color: white;
        }
        
        .severity-medium {
            background: #d97706;
            color: white;
        }
        
        .severity-low {
            background: #059669;
            color: white;
        }
        
        .finding-description {
            margin-bottom: 15px;
            color: #4b5563;
        }
        
        .finding-details {
            display: grid;
            gap: 10px;
            font-size: 0.9rem;
        }
        
        .detail-row {
            display: flex;
            gap: 10px;
        }
        
        .detail-label {
            font-weight: 500;
            color: #374151;
            min-width: 100px;
        }
        
        .summary-box {
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            border: 1px solid #0ea5e9;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 30px;
        }
        
        .footer {
            background: #f8fafc;
            padding: 30px 40px;
            border-top: 1px solid #e2e8f0;
            text-align: center;
            color: #64748b;
            font-size: 0.9rem;
        }
        
        .logo {
            font-size: 1.5rem;
            font-weight: 700;
            color: #667eea;
            margin-bottom: 10px;
        }
        
        @media (max-width: 768px) {
            .header {
                padding: 20px;
            }
            
            .header h1 {
                font-size: 2rem;
            }
            
            .content {
                padding: 20px;
            }
            
            .stats {
                grid-template-columns: 1fr;
            }
            
            .finding-header {
                flex-direction: column;
                align-items: flex-start;
                gap: 10px;
            }
        }
        
        .no-print {
            margin: 20px 0;
            text-align: center;
        }
        
        .print-btn {
            background: #667eea;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 1rem;
            cursor: pointer;
            transition: background 0.2s;
        }
        
        .print-btn:hover {
            background: #5a67d8;
        }
        
        @media print {
            .no-print {
                display: none;
            }
            
            body {
                background: white;
                padding: 0;
            }
            
            .container {
                box-shadow: none;
                border-radius: 0;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔒 Security Audit Report</h1>
            <div class="subtitle">${data.contractName}</div>
            <div class="meta">
                <div>📅 ${timestamp}</div>
                <div>🌐 ${data.network}</div>
                <div>🎨 ${data.auditType}</div>
                <div>🔗 Request: ${data.requestId || 'N/A'}</div>
            </div>
        </div>
        
        <div class="content">
            <div class="no-print">
                <button class="print-btn" onclick="window.print()">🖨️ Print Report</button>
            </div>
            
            <div class="section">
                <h2>📈 Executive Summary</h2>
                <div class="summary-box">
                    <p>${data.summary}</p>
                </div>
            </div>
            
            <div class="section">
                <h2>📉 Security Metrics</h2>
                <div class="stats">
                    <div class="stat-card">
                        <div class="stat-value" style="color: ${scoreColor}">${data.securityScore}</div>
                        <div class="stat-label">Security Score</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value" style="color: ${riskColor}">${data.riskLevel}</div>
                        <div class="stat-label">Risk Level</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${data.keyFindings.length}</div>
                        <div class="stat-label">Security Findings</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${data.processingTime}</div>
                        <div class="stat-label">Analysis Time</div>
                    </div>
                </div>
            </div>
            
            <div class="section">
                <h2>🔍 Contract Information</h2>
                <div class="finding">
                    <div class="detail-row">
                        <span class="detail-label">Contract Name:</span>
                        <span>${data.contractName}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Address:</span>
                        <span style="font-family: monospace;">${data.contractAddress}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Network:</span>
                        <span>${data.network}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">IPFS Hash:</span>
                        <span style="font-family: monospace; font-size: 0.8rem;">${data.ipfsHash || 'N/A'}</span>
                    </div>
                </div>
            </div>
            
            ${data.keyFindings.length > 0 ? `
            <div class="section">
                <h2>🛑 Security Findings</h2>
                <div class="findings">
                    ${data.keyFindings.map((finding, index) => {
                        const severity = (finding.severity || 'medium').toLowerCase();
                        return `
                        <div class="finding ${severity}">
                            <div class="finding-header">
                                <div class="finding-title">${finding.title || `Finding #${index + 1}`}</div>
                                <span class="severity-badge severity-${severity}">${finding.severity || 'Medium'}</span>
                            </div>
                            <div class="finding-description">
                                ${finding.description || 'No description provided'}
                            </div>
                            <div class="finding-details">
                                ${finding.location ? `
                                    <div class="detail-row">
                                        <span class="detail-label">Location:</span>
                                        <span>${finding.location}</span>
                                    </div>
                                ` : ''}
                                ${finding.category ? `
                                    <div class="detail-row">
                                        <span class="detail-label">Category:</span>
                                        <span>${finding.category}</span>
                                    </div>
                                ` : ''}
                                ${finding.impact ? `
                                    <div class="detail-row">
                                        <span class="detail-label">Impact:</span>
                                        <span>${typeof finding.impact === 'object' ? finding.impact.technical || finding.impact.description || 'Impact assessment' : finding.impact}</span>
                                    </div>
                                ` : ''}
                                ${finding.recommendation ? `
                                    <div class="detail-row">
                                        <span class="detail-label">Recommendation:</span>
                                        <span>${finding.recommendation}</span>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                        `;
                    }).join('')}
                </div>
            </div>
            ` : ''}
            
            ${data.gasOptimizations.length > 0 ? `
            <div class="section">
                <h2>⛽ Gas Optimization Opportunities</h2>
                <div class="findings">
                    ${data.gasOptimizations.map((opt, index) => `
                        <div class="finding low">
                            <div class="finding-header">
                                <div class="finding-title">${opt.title || `Optimization #${index + 1}`}</div>
                                <span class="severity-badge severity-low">Gas</span>
                            </div>
                            <div class="finding-description">
                                ${opt.description || 'Gas optimization opportunity identified'}
                            </div>
                            ${opt.potentialSavings ? `
                                <div class="detail-row">
                                    <span class="detail-label">Potential Savings:</span>
                                    <span>${opt.potentialSavings}</span>
                                </div>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}
            
            ${data.modelsUsed.length > 0 ? `
            <div class="section">
                <h2>🤖 Analysis Details</h2>
                <div class="finding">
                    <div class="detail-row">
                        <span class="detail-label">AI Models Used:</span>
                        <span>${data.modelsUsed.join(', ')}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Processing Time:</span>
                        <span>${data.processingTime}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Audit Type:</span>
                        <span>${data.auditType}</span>
                    </div>
                </div>
            </div>
            ` : ''}
        </div>
        
        <div class="footer">
            <div class="logo">🕰️ DeFi Watchdog</div>
            <p>Professional Smart Contract Security Analysis</p>
            <p>Report generated on ${new Date().toLocaleString()} | Visit us at https://defi-watchdog.com</p>
            <p style="margin-top: 10px; font-size: 0.8rem;">This report is permanently stored on IPFS and verified on blockchain</p>
        </div>
    </div>
</body>
</html>
    `;
  };

  if (!isConnected) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔗</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Connect Your Wallet</h3>
          <p className="text-gray-600 mb-4">
            Connect your wallet to view your audit certificate NFT history
          </p>
          <div className="text-sm text-gray-500">
            <p>• Connect MetaMask or compatible wallet</p>
            <p>• View both on-chain and local certificates</p>
            <p>• Access your complete audit history</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">🏆 Your Audit Certificates</h2>
          <div className="text-sm text-gray-600">
            <div>Network: <span className="font-medium">{currentNetwork}</span></div>
            <div>Account: <span className="font-mono text-xs">{account?.slice(0, 6)}...{account?.slice(-4)}</span></div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{userAudits?.length || 0}</div>
            <div className="text-sm text-gray-600">Your NFTs</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {userAudits?.filter(a => a.auditType === 'STATIC').length || 0}
            </div>
            <div className="text-sm text-gray-600">Static Audits</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {userAudits?.filter(a => a.auditType === 'AI_POWERED').length || 0}
            </div>
            <div className="text-sm text-gray-600">AI Audits</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-indigo-600">
              {userAudits?.filter(a => a.onChain).length || 0}
            </div>
            <div className="text-sm text-gray-600">On-Chain</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Filter */}
            <div>
              <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Type
              </label>
              <select
                id="filter"
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="all">All Audits</option>
                <option value="static">Static Only</option>
                <option value="ai">AI Only</option>
                <option value="onchain">On-Chain Only</option>
                <option value="local">Local Only</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
                Sort by
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="score-high">High Score First</option>
                <option value="score-low">Low Score First</option>
              </select>
            </div>
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => {
              loadUserAudits();
              loadContractStats();
            }}
            disabled={isLoading}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Loading...
              </div>
            ) : (
              '🔄 Refresh'
            )}
          </button>
        </div>
      </div>

      {/* Audit List */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your audit certificates...</p>
          </div>
        ) : sortedAudits.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📋</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Audit Certificates Yet</h3>
            <p className="text-gray-600 mb-4">
              You haven't minted any audit certificate NFTs yet.
            </p>
            <div className="text-sm text-gray-500">
              <p>• Perform an audit on the audit page</p>
              <p>• Click "Mint NFT Certificate" after the analysis</p>
              <p>• Your certificates will appear here</p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {sortedAudits.map((audit, index) => (
              <div
                key={`${audit.tokenId}-${index}`}
                className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => setSelectedAudit(selectedAudit?.tokenId === audit.tokenId ? null : audit)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-lg">
                        {audit.auditType === 'STATIC' ? '🆓' : '💎'}
                      </span>
                      <h3 className="font-semibold text-gray-900">
                        {audit.contractName}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRiskBadgeColor(audit.riskLevel)}`}>
                        {audit.riskLevel}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        audit.auditType === 'STATIC' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {audit.auditType}
                      </span>
                      {audit.onChain && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          On-Chain
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <span>Token #{audit.tokenId}</span>
                      <span>•</span>
                      <span>{formatTimestamp(audit.timestamp)}</span>
                      <span>•</span>
                      <span className={`font-medium ${getScoreColor(audit.securityScore)}`}>
                        Score: {audit.securityScore}/100
                      </span>
                      {audit.paidAmount && parseFloat(audit.paidAmount) > 0 && (
                        <>
                          <span>•</span>
                          <span className="font-medium text-purple-600">
                            {audit.paidAmount} ETH
                          </span>
                        </>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-500 font-mono">
                      {audit.contractAddress}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    {audit.ipfsUrl && (
                      <a
                        href={audit.ipfsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Report on IPFS"
                      >
                        <span className="text-lg">📄</span>
                      </a>
                    )}
                    {audit.transactionHash && (
                      <a
                        href={`https://sepolia.etherscan.io/tx/${audit.transactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                        title="View Transaction"
                      >
                        <span className="text-lg">🔗</span>
                      </a>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAudit(selectedAudit?.tokenId === audit.tokenId ? null : audit);
                      }}
                      className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <span className="text-lg">
                        {selectedAudit?.tokenId === audit.tokenId ? '▼' : '▶'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {selectedAudit?.tokenId === audit.tokenId && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">📊 Audit Details</h4>
                        <div className="space-y-1 text-sm">
                          <p><span className="text-gray-600">Type:</span> {audit.auditType}</p>
                          <p><span className="text-gray-600">Score:</span> {audit.securityScore}/100</p>
                          <p><span className="text-gray-600">Risk:</span> {audit.riskLevel}</p>
                          <p><span className="text-gray-600">Date:</span> {new Date(audit.timestamp).toLocaleDateString()}</p>
                          <p><span className="text-gray-600">Status:</span> {audit.onChain ? 'On-Chain' : 'Local'}</p>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">🔗 Contract Info</h4>
                        <div className="space-y-1 text-sm">
                          <p><span className="text-gray-600">Name:</span> {audit.contractName}</p>
                          <p className="break-all">
                            <span className="text-gray-600">Address:</span> 
                            <span className="font-mono ml-1">{audit.contractAddress}</span>
                          </p>
                          <p><span className="text-gray-600">Network:</span> {audit.network}</p>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">🌐 Links & Data</h4>
                        <div className="space-y-2">
                          {audit.ipfsUrl && (
                            <a
                              href={audit.ipfsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block text-blue-600 hover:text-blue-800 text-sm hover:underline"
                            >
                              📄 View Full Report (IPFS)
                            </a>
                          )}
                          {audit.ipfsUrl && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                generateHtmlFromIpfs(audit);
                              }}
                              disabled={loadingReport === audit.tokenId}
                              className="block text-purple-600 hover:text-purple-800 text-sm hover:underline disabled:opacity-50"
                            >
                              {loadingReport === audit.tokenId ? (
                                <span>⏳ Generating HTML Report...</span>
                              ) : (
                                <span>🎨 Generate Styled HTML Report</span>
                              )}
                            </button>
                          )}
                          {audit.transactionHash && (
                            <a
                              href={`https://sepolia.etherscan.io/tx/${audit.transactionHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block text-blue-600 hover:text-blue-800 text-sm hover:underline"
                            >
                              🔍 View Transaction
                            </a>
                          )}
                          {audit.onChain && (
                            <a
                              href={`https://sepolia.etherscan.io/token/0x449a12495A524fC7EA7A37a26b13d55911e51344?a=${audit.tokenId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block text-blue-600 hover:text-blue-800 text-sm hover:underline"
                            >
                              🏆 View NFT on Etherscan
                            </a>
                          )}
                          {audit.ipfsHash && (
                            <p className="text-xs text-gray-500 break-all">
                              IPFS: {audit.ipfsHash}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Export a simplified version for dashboard use
export function AuditHistoryPreview({ limit = 3 }) {
  const { userAudits, isLoading, isConnected } = useAuditNFT();

  if (!isConnected) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-2">Recent Audit Certificates</h3>
        <p className="text-gray-600 text-sm">Connect wallet to view certificates</p>
      </div>
    );
  }

  const recentAudits = userAudits?.slice(0, limit) || [];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Recent Audit Certificates</h3>
        <span className="text-sm text-gray-500">{userAudits?.length || 0} total</span>
      </div>

      {isLoading ? (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto"></div>
        </div>
      ) : recentAudits.length === 0 ? (
        <p className="text-gray-500 text-sm">No certificates yet</p>
      ) : (
        <div className="space-y-3">
          {recentAudits.map((audit) => (
            <div key={audit.tokenId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-sm">{audit.contractName}</p>
                <p className="text-xs text-gray-600">
                  #{audit.tokenId} • {audit.auditType} • Score: {audit.securityScore}
                  {audit.onChain && ' • On-Chain'}
                </p>
              </div>
              {audit.ipfsUrl && (
                <a
                  href={audit.ipfsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  View →
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}