        {activeTab === 'supervisor' && supervisorResult && (
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold mb-2">Supervisor Verification Report</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Supervisor Model</p>
                  <p className="font-medium">{supervisorResult.model}</p>
                </div>
                <div>
                  <p className="text-gray-500">Confidence Level</p>
                  <p className="font-medium">{supervisorResult.confidenceLevel}</p>
                </div>
                <div>
                  <p className="text-gray-500">Verified Issues</p>
                  <p className="font-medium">{supervisorResult.verifiedVulnerabilities?.length || 0}</p>
                </div>
                <div>
                  <p className="text-gray-500">False Positives</p>
                  <p className="font-medium">{supervisorResult.falsePositives?.length || 0}</p>
                </div>
              </div>
            </div>

            {/* Verified Vulnerabilities */}
            {supervisorResult.verifiedVulnerabilities && supervisorResult.verifiedVulnerabilities.length > 0 && (
              <div>
                <h4 className="font-medium mb-3 text-green-800">✅ Verified Vulnerabilities</h4>
                <div className="space-y-3">
                  {supervisorResult.verifiedVulnerabilities.map((vuln, index) => (
                    <div key={index} className="p-4 border border-green-200 bg-green-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-medium text-green-900">{vuln.title || vuln.name}</h5>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(vuln.severity)}`}>
                          {vuln.severity}
                        </span>
                      </div>
                      <p className="text-green-700 text-sm mb-2">{vuln.description}</p>
                      {vuln.recommendation && (
                        <div className="mt-2 p-2 bg-green-100 rounded">
                          <p className="text-xs text-green-600"><strong>Recommendation:</strong> {vuln.recommendation}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* False Positives */}
            {supervisorResult.falsePositives && supervisorResult.falsePositives.length > 0 && (
              <div>
                <h4 className="font-medium mb-3 text-red-800">❌ False Positives Identified</h4>
                <div className="space-y-3">
                  {supervisorResult.falsePositives.map((falsePos, index) => (
                    <div key={index} className="p-4 border border-red-200 bg-red-50 rounded-lg">
                      <h5 className="font-medium text-red-900">{falsePos.title || falsePos.name}</h5>
                      <p className="text-red-700 text-sm">{falsePos.reasoning || falsePos.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Supervisor Recommendations */}
            {supervisorResult.recommendations && supervisorResult.recommendations.length > 0 && (
              <div>
                <h4 className="font-medium mb-3 text-blue-800">💡 Supervisor Recommendations</h4>
                <div className="space-y-3">
                  {supervisorResult.recommendations.map((rec, index) => (
                    <div key={index} className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
                      <h5 className="font-medium text-blue-900">{rec.title}</h5>
                      <p className="text-blue-700 text-sm">{rec.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Model Responses Summary */}
            {aiResult.modelResponses && (
              <div>
                <h4 className="font-medium mb-3">🤖 Individual Model Results</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {aiResult.modelResponses.map((response, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="font-medium">{response.model}</h5>
                        <span className={`px-2 py-1 rounded text-xs ${
                          response.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {response.success ? 'Success' : 'Failed'}
                        </span>
                      </div>
                      {response.success && (
                        <div className="text-sm space-y-1">
                          <p>Vulnerabilities: {response.vulnerabilities?.length || 0}</p>
                          <p>Gas Optimizations: {response.gasOptimizations?.length || 0}</p>
                          <p>Code Quality: {response.codeQuality?.length || 0}</p>
                        </div>
                      )}
                      {!response.success && (
                        <p className="text-red-600 text-sm">{response.error}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}// src/components/audit/ScanResults.js
import { useState } from 'react';
import { ScanUtils } from '../../services/contractScannerApi';

export default function ScanResults({ 
  toolsResult, 
  aiResult, 
  contractInfo, 
  onDownloadReport 
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [downloadingFormat, setDownloadingFormat] = useState(null);

  // Handle both single and full scan results
  const allVulnerabilities = [
    ...(toolsResult?.result?.all_vulnerabilities || []),
    ...(aiResult?.vulnerabilities?.map(vuln => ({
      ...vuln,
      tool: 'ai',
      severity: vuln.severity || 'MEDIUM',
      type: vuln.title || 'ai_detection',
      line: 0,
      code: vuln.codeSnippet || '',
      description: vuln.description || 'AI detected vulnerability'
    })) || [])
  ];

  // Handle both old and new AI result formats
  const aiVulnerabilitiesCount = aiResult?.vulnerabilities?.length || aiResult?.risks?.length || 0;
  const aiSecurityScore = aiResult?.securityScore || 0;
  const aiRiskLevel = aiResult?.riskLevel || 'UNKNOWN';
  const aiOverview = aiResult?.summary || aiResult?.overview || '';
  const isFullScan = aiResult?.type === 'full-scan';
  const modelsUsed = aiResult?.modelsUsed || [];
  const supervisorResult = aiResult?.supervisorResponse;

  const overallRisk = ScanUtils.calculateRiskScore(allVulnerabilities);

  const handleDownload = async (format) => {
    if (!toolsResult) return;
    
    try {
      setDownloadingFormat(format);
      await onDownloadReport(format);
    } catch (error) {
      console.error(`Download failed:`, error);
      alert(`Download failed: ${error.message}`);
    } finally {
      setDownloadingFormat(null);
    }
  };

  const generatePDFReport = () => {
    // Generate a comprehensive PDF report using browser's print functionality
    const reportWindow = window.open('', '_blank');
    const reportHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Security Audit Report - ${contractInfo?.contractName || contractInfo?.address}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
          .section { margin-bottom: 30px; }
          .vulnerability { border: 1px solid #ddd; padding: 15px; margin-bottom: 15px; border-radius: 5px; }
          .high { border-left: 5px solid #dc2626; background: #fef2f2; }
          .medium { border-left: 5px solid #d97706; background: #fffbeb; }
          .low { border-left: 5px solid #059669; background: #ecfdf5; }
          .info { border-left: 5px solid #6b7280; background: #f9fafb; }
          .summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }
          .summary-card { border: 1px solid #e5e7eb; padding: 15px; border-radius: 8px; text-align: center; }
          @media print { body { margin: 0; } .no-print { display: none; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Smart Contract Security Audit Report</h1>
          <h2>${contractInfo?.contractName || 'Unknown Contract'}</h2>
          <p><strong>Address:</strong> ${contractInfo?.address || 'N/A'}</p>
          <p><strong>Network:</strong> ${contractInfo?.network || 'N/A'}</p>
          <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
        </div>

        <div class="section">
          <h2>Executive Summary</h2>
          <div class="summary-grid">
            <div class="summary-card">
              <h3>Overall Risk Level</h3>
              <p style="font-size: 24px; font-weight: bold; color: ${
                overallRisk.score > 80 ? '#059669' : 
                overallRisk.score > 60 ? '#d97706' : '#dc2626'
              };">${overallRisk.level}</p>
              <p>Score: ${overallRisk.score}/100</p>
            </div>
            <div class="summary-card">
              <h3>Total Issues</h3>
              <p style="font-size: 24px; font-weight: bold;">${allVulnerabilities.length}</p>
            </div>
            <div class="summary-card">
              <h3>High Severity</h3>
              <p style="font-size: 24px; font-weight: bold; color: #dc2626;">
                ${allVulnerabilities.filter(v => v.severity === 'HIGH').length}
              </p>
            </div>
            <div class="summary-card">
              <h3>Medium Severity</h3>
              <p style="font-size: 24px; font-weight: bold; color: #d97706;">
                ${allVulnerabilities.filter(v => v.severity === 'MEDIUM').length}
              </p>
            </div>
          </div>
        </div>

        ${toolsResult ? `
        <div class="section">
          <h2>Multi-Tool Analysis Results</h2>
          <p><strong>Tools Used:</strong> ${toolsResult.result?.tools_used?.join(', ') || 'None'}</p>
          <p><strong>Scan Mode:</strong> ${toolsResult.scan_mode || 'Unknown'}</p>
        </div>
        ` : ''}

        ${aiResult ? `
        <div class="section">
          <h2>AI Analysis Results</h2>
          <p><strong>AI Model:</strong> ${aiResult.model || 'AI Model'}</p>
          <p><strong>Analysis Mode:</strong> ${aiResult.promptMode || 'Unknown'}</p>
          <p><strong>Security Score:</strong> ${aiSecurityScore}/100</p>
          <p><strong>Risk Level:</strong> ${aiRiskLevel}</p>
          ${aiOverview ? `<p><strong>Overview:</strong> ${aiOverview}</p>` : ''}
        </div>
        ` : ''}

        <div class="section">
          <h2>Detailed Findings</h2>
          ${allVulnerabilities.length === 0 ? '<p>No vulnerabilities detected.</p>' : 
            allVulnerabilities.map(vuln => `
              <div class="vulnerability ${vuln.severity?.toLowerCase() || 'info'}">
                <h3>${vuln.type || vuln.title || 'Security Issue'} 
                    <span style="float: right; background: #f3f4f6; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
                      ${vuln.severity || 'UNKNOWN'} | ${ScanUtils.getToolIcon(vuln.tool)} ${vuln.tool}
                    </span>
                </h3>
                <p><strong>Description:</strong> ${vuln.description || 'No description provided'}</p>
                ${vuln.line ? `<p><strong>Line:</strong> ${vuln.line}</p>` : ''}
                ${vuln.code ? `<p><strong>Code:</strong> <code>${vuln.code}</code></p>` : ''}
                ${vuln.recommendation || vuln.impact ? `
                  <p><strong>Recommendation:</strong> ${vuln.recommendation || vuln.impact || 'Review this finding'}</p>
                ` : ''}
              </div>
            `).join('')
          }
        </div>

        <div class="section">
          <h2>Recommendations</h2>
          <ul>
            <li>Review all HIGH severity issues immediately</li>
            <li>Address MEDIUM severity issues before deployment</li>
            <li>Consider LOW severity issues for code quality improvement</li>
            <li>Implement additional access controls where needed</li>
            <li>Follow security best practices for smart contract development</li>
            <li>Consider getting a professional audit for production contracts</li>
          </ul>
        </div>

        <div class="no-print" style="margin-top: 30px; text-align: center;">
          <button onclick="window.print()" style="background: #3b82f6; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
            Print / Save as PDF
          </button>
          <button onclick="window.close()" style="background: #6b7280; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-left: 10px;">
            Close
          </button>
        </div>
      </body>
      </html>
    `;
    
    reportWindow.document.write(reportHTML);
    reportWindow.document.close();
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'tools', name: 'Tools Analysis', icon: '🛠️', disabled: !toolsResult },
    { id: 'ai', name: 'AI Analysis', icon: '🤖', disabled: !aiResult },
    { id: 'supervisor', name: 'Supervisor Report', icon: '🛡️', disabled: !isFullScan || !supervisorResult },
    { id: 'vulnerabilities', name: 'All Issues', icon: '🔍' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Security Analysis Results</h2>
            <p className="text-gray-300">
              {contractInfo?.contractName || contractInfo?.address}
            </p>
          </div>
          <div className="text-right">
            <div className={`inline-block px-4 py-2 rounded-full text-lg font-bold ${
              overallRisk.score > 80 ? 'bg-green-100 text-green-800' :
              overallRisk.score > 60 ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {overallRisk.level}
            </div>
            <p className="text-gray-300 text-sm mt-1">
              Score: {overallRisk.score}/100
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              disabled={tab.disabled}
              className={`flex-shrink-0 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : tab.disabled
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Total Issues</h3>
                <p className="text-2xl font-bold text-gray-900">{allVulnerabilities.length}</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-red-600">High Severity</h3>
                <p className="text-2xl font-bold text-red-600">
                  {allVulnerabilities.filter(v => v.severity === 'HIGH').length}
                </p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-orange-600">Medium Severity</h3>
                <p className="text-2xl font-bold text-orange-600">
                  {allVulnerabilities.filter(v => v.severity === 'MEDIUM').length}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-green-600">Low Severity</h3>
                <p className="text-2xl font-bold text-green-600">
                  {allVulnerabilities.filter(v => v.severity === 'LOW').length}
                </p>
              </div>
            </div>

            {/* Analysis Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {toolsResult && (
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">🛠️ Multi-Tool Analysis</h3>
                  <div className="text-sm space-y-1">
                    <p><strong>Tools Used:</strong> {toolsResult.result?.tools_used?.join(', ') || 'None'}</p>
                    <p><strong>Mode:</strong> {toolsResult.scan_mode || 'Unknown'}</p>
                    <p><strong>Issues Found:</strong> {toolsResult.result?.summary?.total_vulnerabilities || 0}</p>
                  </div>
                </div>
              )}
              
              {aiResult && (
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">🤖 AI Analysis</h3>
                  <div className="text-sm space-y-1">
                    <p><strong>Analysis Type:</strong> {isFullScan ? 'Full AI Security Audit' : 'Single Model Analysis'}</p>
                    {isFullScan ? (
                      <>
                        <p><strong>Models Used:</strong> {modelsUsed.length} AI Models + Supervisor</p>
                        <p><strong>Supervisor:</strong> {supervisorResult?.model || 'GPT-4.1 Mini'}</p>
                      </>
                    ) : (
                      <p><strong>AI Model:</strong> {aiResult.model || 'AI Model'}</p>
                    )}
                    <p><strong>Analysis Mode:</strong> {aiResult.promptMode || 'Standard'}</p>
                    <p><strong>Security Score:</strong> {aiSecurityScore}/100</p>
                    <p><strong>Risk Level:</strong> {aiRiskLevel}</p>
                    <p><strong>Issues Found:</strong> {aiVulnerabilitiesCount}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Download Reports Section */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">📄 Export Reports</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <button
                  onClick={() => handleDownload('json')}
                  disabled={!toolsResult || downloadingFormat === 'json'}
                  className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {downloadingFormat === 'json' ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  ) : (
                    <>
                      <span className="text-2xl mr-2">📋</span>
                      <div>
                        <p className="font-medium">JSON</p>
                        <p className="text-xs text-gray-500">Machine readable</p>
                      </div>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleDownload('csv')}
                  disabled={!toolsResult || downloadingFormat === 'csv'}
                  className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {downloadingFormat === 'csv' ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  ) : (
                    <>
                      <span className="text-2xl mr-2">📊</span>
                      <div>
                        <p className="font-medium">CSV</p>
                        <p className="text-xs text-gray-500">Spreadsheet format</p>
                      </div>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleDownload('html')}
                  disabled={!toolsResult || downloadingFormat === 'html'}
                  className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {downloadingFormat === 'html' ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  ) : (
                    <>
                      <span className="text-2xl mr-2">🌐</span>
                      <div>
                        <p className="font-medium">HTML</p>
                        <p className="text-xs text-gray-500">Web report</p>
                      </div>
                    </>
                  )}
                </button>

                <button
                  onClick={generatePDFReport}
                  className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <span className="text-2xl mr-2">📄</span>
                  <div>
                    <p className="font-medium">PDF</p>
                    <p className="text-xs text-gray-500">Print report</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tools' && toolsResult && (
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold mb-2">Multi-Tool Analysis Details</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Scan Mode</p>
                  <p className="font-medium">{toolsResult.result?.scan_mode || toolsResult.scan_mode || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Tools Used</p>
                  <p className="font-medium">{toolsResult.result?.tools_used?.join(', ') || 'None'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Tools Failed</p>
                  <p className="font-medium">{toolsResult.result?.summary?.tools_failed || 0}</p>
                </div>
                <div>
                  <p className="text-gray-500">Total Issues</p>
                  <p className="font-medium">{toolsResult.result?.summary?.total_vulnerabilities || 0}</p>
                </div>
              </div>
            </div>

            {/* Tool-specific results */}
            {toolsResult.result?.tool_results && Object.entries(toolsResult.result.tool_results).map(([tool, result]) => (
              <div key={tool} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium flex items-center">
                    <span className="mr-2">{ScanUtils.getToolIcon(tool)}</span>
                    {tool.replace('_', ' ').toUpperCase()}
                  </h4>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {result.success ? 'Success' : 'Failed'}
                  </span>
                </div>
                
                {result.success ? (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      Found {result.total_vulnerabilities || 0} vulnerabilities
                    </p>
                    {result.vulnerabilities && result.vulnerabilities.length > 0 && (
                      <div className="space-y-2">
                        {result.vulnerabilities.slice(0, 3).map((vuln, index) => (
                          <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                            <p className="font-medium">{vuln.type}</p>
                            <p className="text-gray-600">{vuln.description}</p>
                          </div>
                        ))}
                        {result.vulnerabilities.length > 3 && (
                          <p className="text-sm text-gray-500">
                            And {result.vulnerabilities.length - 3} more...
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-red-600">
                    <p className="font-medium">Error: {result.error}</p>
                    {result.debug_info && (
                      <details className="mt-2">
                        <summary className="cursor-pointer">Debug Info</summary>
                        <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                          {JSON.stringify(result.debug_info, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'ai' && aiResult && (
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold mb-2">AI Analysis Details</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">AI Model</p>
                  <p className="font-medium">{aiResult.model || 'AI Model'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Analysis Mode</p>
                  <p className="font-medium">{aiResult.promptMode || 'Standard'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Security Score</p>
                  <p className="font-medium">{aiSecurityScore}/100</p>
                </div>
                <div>
                  <p className="text-gray-500">Issues Found</p>
                  <p className="font-medium">{aiVulnerabilitiesCount}</p>
                </div>
              </div>
            </div>

            {aiOverview && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium mb-2">Contract Analysis Summary</h4>
                <p className="text-sm text-gray-700">{aiOverview}</p>
              </div>
            )}

            {aiResult.explanation && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">AI Assessment</h4>
                <p className="text-sm text-gray-700">{aiResult.explanation}</p>
              </div>
            )}

            {/* Gas Optimizations */}
            {aiResult.gasOptimizations && aiResult.gasOptimizations.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Gas Optimization Opportunities</h4>
                <div className="space-y-2">
                  {aiResult.gasOptimizations.map((optimization, index) => (
                    <div key={index} className="p-3 bg-green-50 rounded border-l-4 border-green-400">
                      <h5 className="font-medium text-green-900">{optimization.type}</h5>
                      <p className="text-sm text-green-700 mt-1">{optimization.description}</p>
                      {optimization.location && (
                        <p className="text-xs text-green-600 mt-1">Location: {optimization.location}</p>
                      )}
                      {optimization.estimatedSaving && (
                        <p className="text-xs text-green-600 mt-1">Estimated Saving: {optimization.estimatedSaving}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Code Quality */}
            {aiResult.codeQuality && (
              <div>
                <h4 className="font-medium mb-2">Code Quality Assessment</h4>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-600">Quality Score</span>
                    <div className="flex items-center">
                      <div className={`w-16 h-2 rounded-full mr-2 ${
                        aiResult.codeQuality.score >= 80 ? 'bg-green-400' :
                        aiResult.codeQuality.score >= 60 ? 'bg-yellow-400' :
                        aiResult.codeQuality.score >= 40 ? 'bg-orange-400' : 'bg-red-400'
                      }`}>
                        <div 
                          className="h-full bg-white rounded-full"
                          style={{ width: `${100 - aiResult.codeQuality.score}%` }}
                        ></div>
                      </div>
                      <span className="font-medium">{aiResult.codeQuality.score}/100</span>
                    </div>
                  </div>
                  
                  {aiResult.codeQuality.issues && aiResult.codeQuality.issues.length > 0 && (
                    <div className="mb-3">
                      <h5 className="text-sm font-medium mb-2">Issues:</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {aiResult.codeQuality.issues.map((issue, index) => (
                          <li key={index}>• {issue}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {aiResult.codeQuality.recommendations && aiResult.codeQuality.recommendations.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium mb-2">Recommendations:</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {aiResult.codeQuality.recommendations.map((rec, index) => (
                          <li key={index}>• {rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'vulnerabilities' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">All Security Issues</h3>
              <p className="text-sm text-gray-500">
                {allVulnerabilities.length} total issues found
              </p>
            </div>

            {allVulnerabilities.length === 0 ? (
              <div className="text-center py-8">
                <span className="text-4xl mb-4 block">✅</span>
                <h4 className="text-lg font-medium text-gray-900 mb-2">No Issues Found</h4>
                <p className="text-gray-500">
                  Great! No security vulnerabilities were detected in this contract.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {allVulnerabilities
                  .sort((a, b) => {
                    const severityOrder = { 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
                    return (severityOrder[b.severity] || 0) - (severityOrder[a.severity] || 0);
                  })
                  .map((vuln, index) => (
                    <div key={index} className={`border-l-4 p-4 rounded-r-lg ${
                      vuln.severity === 'HIGH' ? 'border-red-500 bg-red-50' :
                      vuln.severity === 'MEDIUM' ? 'border-orange-500 bg-orange-50' :
                      'border-yellow-500 bg-yellow-50'
                    }`}>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900">
                          {vuln.type || vuln.title || 'Security Issue'}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${ScanUtils.getSeverityColor(vuln.severity)}`}>
                            {vuln.severity || 'UNKNOWN'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {ScanUtils.getToolIcon(vuln.tool)} {vuln.tool}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-2">
                        {vuln.description || 'No description provided'}
                      </p>
                      
                      {(vuln.line > 0 || vuln.code) && (
                        <div className="text-sm text-gray-600 mb-2">
                          {vuln.line > 0 && <span>Line {vuln.line}</span>}
                          {vuln.code && (
                            <div className="mt-1 p-2 bg-gray-100 rounded font-mono text-xs">
                              {vuln.code}
                            </div>
                          )}
                        </div>
                      )}
                      
                      {(vuln.recommendation || vuln.impact) && (
                        <div className="mt-3 p-3 bg-white rounded border">
                          <h5 className="font-medium text-sm mb-1">Recommendation:</h5>
                          <p className="text-sm text-gray-700">
                            {vuln.recommendation || vuln.impact}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}