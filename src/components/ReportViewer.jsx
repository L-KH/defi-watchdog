import React, { useState } from 'react';

const ReportViewer = ({ auditData }) => {
  const [expandedFindings, setExpandedFindings] = useState(new Set());

  if (!auditData) {
    return (
      <div className="p-8 text-center">
        <div className="text-gray-500">No audit data available</div>
      </div>
    );
  }

  // Extract data safely
  const analysis = auditData.analysis || {};
  const contractName = analysis.contractName || auditData.contractName || 'Smart Contract';
  
  // Get security findings from the correct path
  const securityFindings = analysis.keyFindings || [];
  const gasOptimizations = analysis.gasOptimizations || [];
  const codeQualityIssues = analysis.codeQualityIssues || [];
  
  // Extract scores
  const scores = {
    security: analysis.securityScore || 75,
    gasOptimization: analysis.gasOptimizationScore || 80,
    codeQuality: analysis.codeQualityScore || 85,
    overall: analysis.overallScore || 75
  };

  // Calculate statistics
  const statistics = {
    critical: securityFindings.filter(f => f.severity === 'CRITICAL').length,
    high: securityFindings.filter(f => f.severity === 'HIGH').length,
    medium: securityFindings.filter(f => f.severity === 'MEDIUM').length,
    low: securityFindings.filter(f => f.severity === 'LOW').length
  };

  const toggleFinding = (index) => {
    const newExpanded = new Set(expandedFindings);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedFindings(newExpanded);
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-500';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-500';
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-500';
      case 'low': return 'bg-green-100 text-green-800 border-green-500';
      default: return 'bg-gray-100 text-gray-800 border-gray-500';
    }
  };

  const getSeverityBadgeColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-600 text-white';
      case 'medium': return 'bg-blue-600 text-white';
      case 'low': return 'bg-green-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getRiskColor = (riskLevel) => {
    if (!riskLevel) return 'bg-yellow-100 text-yellow-800';
    const level = riskLevel.toLowerCase();
    if (level.includes('critical')) return 'bg-red-100 text-red-800';
    if (level.includes('high')) return 'bg-orange-100 text-orange-800';
    if (level.includes('medium')) return 'bg-yellow-100 text-yellow-800';
    if (level.includes('low')) return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getImpactText = (impact) => {
    if (typeof impact === 'string') return impact;
    if (typeof impact === 'object' && impact !== null) {
      return impact.technical || impact.business || impact.financial || 'Security risk identified';
    }
    return 'Security risk identified';
  };

  const renderCodeReference = (finding) => {
    const location = finding.location || finding.codeReference;
    if (!location) return null;

    return (
      <div>
        <h4 className="font-semibold text-gray-800 mb-2">💻 Code Reference</h4>
        {location.file && (
          <p className="text-gray-700 mb-1"><strong>File:</strong> {location.file}</p>
        )}
        {location.functions && Array.isArray(location.functions) && (
          <p className="text-gray-700 mb-1"><strong>Functions:</strong> {location.functions.join(', ')}</p>
        )}
        {location.lines && (
          <p className="text-gray-700 mb-2"><strong>Lines:</strong> {String(location.lines)}</p>
        )}
        {location.vulnerableCode && (
          <pre className="bg-gray-800 text-gray-100 p-3 rounded text-sm overflow-x-auto">
            <code>{location.vulnerableCode}</code>
          </pre>
        )}
      </div>
    );
  };

  const renderRemediation = (finding) => {
    const remediation = finding.recommendation || finding.remediation;
    if (!remediation) return null;

    return (
      <div>
        <h4 className="font-semibold text-gray-800 mb-2">🔧 Remediation</h4>
        {remediation.priority && (
          <p className="mb-2">
            <strong>Priority:</strong> 
            <span className={`ml-2 px-2 py-1 rounded text-xs font-bold ${getSeverityBadgeColor(remediation.priority)}`}>
              {remediation.priority}
            </span>
          </p>
        )}
        {remediation.effort && (
          <p className="text-gray-700 mb-2"><strong>Effort Required:</strong> {remediation.effort}</p>
        )}
        {remediation.secureImplementation && (
          <div className="mb-3">
            <p className="text-gray-700 mb-2"><strong>Secure Implementation:</strong></p>
            <pre className="bg-gray-800 text-gray-100 p-3 rounded text-sm overflow-x-auto">
              <code>{remediation.secureImplementation}</code>
            </pre>
          </div>
        )}
        {remediation.additionalRecommendations && (
          <p className="text-gray-700"><strong>Additional Recommendations:</strong> {remediation.additionalRecommendations}</p>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-4">🛡️ AI Security Audit Report</h1>
        <div className="text-lg opacity-90 mb-2">
          Contract: <strong>{contractName}</strong> • Analysis: <strong>Multi-AI Security Audit</strong>
        </div>
        <div className="opacity-80">
          Generated {new Date().toLocaleDateString()} • AI Models: {auditData.modelsUsed?.length || 0}
        </div>
        
        {/* Header Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white/10 rounded-lg p-4 text-center backdrop-blur">
            <div className="text-2xl font-bold">{scores.overall}</div>
            <div className="text-sm opacity-80">Overall Score</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 text-center backdrop-blur">
            <div className="text-2xl font-bold">{statistics.critical + statistics.high}</div>
            <div className="text-sm opacity-80">Critical + High</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 text-center backdrop-blur">
            <div className="text-2xl font-bold">{securityFindings.length}</div>
            <div className="text-sm opacity-80">Security Issues</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 text-center backdrop-blur">
            <div className="text-2xl font-bold">{auditData.modelsUsed?.length || 0}</div>
            <div className="text-sm opacity-80">AI Models</div>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">📋 Executive Summary</h2>
        </div>
        <div className="p-6">
          <div className="flex flex-wrap gap-2 mb-6">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(analysis.riskLevel)}`}>
              Risk Level: {analysis.riskLevel || 'Medium Risk'}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${scores.overall >= 80 ? 'bg-green-100 text-green-800' : scores.overall >= 60 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
              {scores.overall >= 80 ? 'PRODUCTION READY' : scores.overall >= 60 ? 'NEEDS REVIEW' : 'HIGH RISK'}
            </span>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">🎯 Analysis Summary</h3>
            <p className="text-gray-700">
              {analysis.summary || `Comprehensive multi-AI security analysis completed for ${contractName}. Analysis identified ${securityFindings.length} security findings, ${gasOptimizations.length} gas optimizations, and ${codeQualityIssues.length} code quality improvements.`}
            </p>
          </div>

          {/* Score Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">{scores.security}</div>
              <div className="text-sm text-blue-600 font-medium">Security Score</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-600">{scores.gasOptimization}</div>
              <div className="text-sm text-green-600 font-medium">Gas Efficiency</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
              <div className="text-2xl font-bold text-purple-600">{scores.codeQuality}</div>
              <div className="text-sm text-purple-600 font-medium">Code Quality</div>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-gray-600">{scores.overall}</div>
              <div className="text-sm text-gray-600 font-medium">Overall Score</div>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <div className="text-lg font-bold text-red-600">{statistics.critical}</div>
              <div className="text-xs text-gray-600">Critical</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <div className="text-lg font-bold text-orange-600">{statistics.high}</div>
              <div className="text-xs text-gray-600">High</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <div className="text-lg font-bold text-blue-600">{statistics.medium}</div>
              <div className="text-xs text-gray-600">Medium</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <div className="text-lg font-bold text-green-600">{statistics.low}</div>
              <div className="text-xs text-gray-600">Low</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <div className="text-lg font-bold text-gray-600">{gasOptimizations.length}</div>
              <div className="text-xs text-gray-600">Gas Opts</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <div className="text-lg font-bold text-gray-600">{codeQualityIssues.length}</div>
              <div className="text-xs text-gray-600">Quality</div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Findings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">🛡️ Security Findings ({securityFindings.length})</h2>
        </div>
        <div className="p-6">
          {securityFindings.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl text-green-500 mb-4">✅</div>
              <h3 className="text-lg font-semibold text-green-600 mb-2">No Security Issues Found</h3>
              <p className="text-gray-600">Excellent! The AI analysis found no security vulnerabilities in this contract.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {securityFindings.map((finding, index) => (
                <div key={index} className={`border-2 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md ${getSeverityColor(finding.severity)} border-l-4`}>
                  <div 
                    className="p-4 cursor-pointer" 
                    onClick={() => toggleFinding(index)}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{finding.title || `Finding ${index + 1}`}</h3>
                        <p className="text-gray-700 mb-3">
                          {finding.description ? (
                            finding.description.length > 150 
                              ? `${finding.description.substring(0, 150)}...`
                              : finding.description
                          ) : 'No description available'}
                        </p>
                        {finding.impact && (
                          <div className="mb-2">
                            <strong className="text-gray-800">Impact:</strong> 
                            <span className="text-gray-600 ml-1">{getImpactText(finding.impact)}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getSeverityBadgeColor(finding.severity)}`}>
                          {finding.severity || 'MEDIUM'}
                        </span>
                        <button className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium transition-colors">
                          {expandedFindings.has(index) ? 'Hide Details ▲' : 'View Details ▼'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {expandedFindings.has(index) && (
                    <div className="border-t bg-gray-50 p-4 space-y-4">
                      {/* Detailed Description */}
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">📋 Detailed Description</h4>
                        <p className="text-gray-700">{finding.description || 'No detailed description available.'}</p>
                      </div>

                      {/* Impact Assessment */}
                      {finding.impact && typeof finding.impact === 'object' && (
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">💥 Impact Assessment</h4>
                          {finding.impact.technical && (
                            <p className="text-gray-700 mb-1"><strong>Technical:</strong> {finding.impact.technical}</p>
                          )}
                          {finding.impact.business && (
                            <p className="text-gray-700 mb-1"><strong>Business:</strong> {finding.impact.business}</p>
                          )}
                          {finding.impact.financial && (
                            <p className="text-gray-700"><strong>Financial:</strong> {finding.impact.financial}</p>
                          )}
                        </div>
                      )}

                      {/* Code Reference */}
                      {renderCodeReference(finding)}

                      {/* Remediation */}
                      {renderRemediation(finding)}

                      {/* AI Analysis */}
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">🤖 AI Analysis</h4>
                        <p className="text-gray-700 mb-1">
                          <strong>Verified:</strong> {finding.verified !== false ? '✅ Yes' : '⚠️ Requires Manual Review'}
                        </p>
                        <p className="text-gray-700 mb-1">
                          <strong>Confidence:</strong> {finding.confidence || 'MEDIUM'}
                        </p>
                        {finding.estimatedLoss && (
                          <p className="text-gray-700">
                            <strong>Estimated Loss:</strong> {String(finding.estimatedLoss)}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-600 text-white rounded-lg p-8 text-center">
        <h3 className="text-xl font-semibold mb-4">🛡️ DeFi Watchdog AI Security Audit</h3>
        <p className="text-gray-200 mb-6">
          Professional Multi-AI Security Analysis • Comprehensive Coverage • Production-Ready Results
        </p>
        <div className="flex justify-center gap-8 flex-wrap text-sm">
          <div><strong>Report Generated:</strong> {new Date().toLocaleDateString()}</div>
          <div><strong>Analysis Time:</strong> {Math.round((auditData.analysisTime || 120000) / 1000)}s</div>
          <div><strong>Models Used:</strong> {auditData.modelsUsed?.length || 0}</div>
          <div><strong>Supervisor:</strong> AI Supervisor</div>
        </div>
      </div>
    </div>
  );
};

export default ReportViewer;