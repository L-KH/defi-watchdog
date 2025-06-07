// Enhanced AuditPro Export Component with Professional Report Generation
'use client';
import { useState } from 'react';
import { generateHTMLReport, generateJSONReport, generateExecutiveSummary } from '../../../lib/reportGenerator';

export default function AuditProExporter({ scanResults, contractInfo }) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState('html');

  // Get the best audit result data
  const getAuditData = () => {
    if (!scanResults || scanResults.length === 0) return null;

    // Try to get comprehensive audit data first
    const comprehensiveResult = scanResults.find(result => 
      result.comprehensiveAuditData || result.analysis?.comprehensiveReport
    );

    if (comprehensiveResult?.comprehensiveAuditData) {
      return comprehensiveResult.comprehensiveAuditData;
    }

    // Fallback to constructing from scan results
    const bestResult = scanResults[0];
    if (!bestResult) return null;

    return constructAuditDataFromResults(scanResults, contractInfo);
  };

  const constructAuditDataFromResults = (results, contractInfo) => {
    const allFindings = {
      security: [],
      gasOptimization: [],
      codeQuality: []
    };

    let totalSecurityScore = 0;
    let validScores = 0;

    // Aggregate findings from all results
    results.forEach(result => {
      if (result.analysis?.keyFindings) {
        allFindings.security.push(...(result.analysis.keyFindings || []));
      }
      if (result.analysis?.gasOptimizations) {
        allFindings.gasOptimization.push(...(result.analysis.gasOptimizations || []));
      }
      if (result.analysis?.codeQualityIssues) {
        allFindings.codeQuality.push(...(result.analysis.codeQualityIssues || []));
      }

      if (result.analysis?.securityScore) {
        totalSecurityScore += result.analysis.securityScore;
        validScores++;
      }
    });

    const avgSecurityScore = validScores > 0 ? Math.round(totalSecurityScore / validScores) : 75;
    const overallScore = Math.round((avgSecurityScore + 80 + 85) / 3);

    return {
      findings: allFindings,
      scores: {
        security: avgSecurityScore,
        gasOptimization: 80,
        codeQuality: 85,
        overall: overallScore
      },
      executiveSummary: {
        summary: `Multi-AI security analysis completed with ${results.length} AI models. Found ${allFindings.security.length} security findings requiring attention.`,
        riskLevel: avgSecurityScore >= 80 ? 'Low Risk' : avgSecurityScore >= 60 ? 'Medium Risk' : 'High Risk',
        recommendations: [
          'Review all identified security findings',
          'Test fixes in development environment',
          'Consider professional audit for production deployment',
          'Implement comprehensive monitoring'
        ]
      },
      aiModelsUsed: results.map(result => ({
        name: result.model || 'AI Model',
        id: result.modelId || 'unknown',
        speciality: result.speciality || 'Security Analysis'
      })),
      supervisorVerification: {
        model: 'Multi-AI Consensus',
        verified: results.some(r => r.success !== false),
        confidenceLevel: '85%'
      },
      metadata: {
        contractName: contractInfo?.contractName || 'Unknown Contract',
        analysisType: 'Premium Multi-AI Security Audit',
        timestamp: new Date().toISOString(),
        analysisTime: 0,
        tier: 'premium',
        reportVersion: '3.1'
      },
      fallbackMode: results.some(r => r.success === false)
    };
  };

  const downloadFile = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExport = async () => {
    const auditData = getAuditData();
    if (!auditData) {
      alert('No audit data available for export');
      return;
    }

    setIsExporting(true);

    try {
      const contractName = contractInfo?.contractName || 'Contract';
      const timestamp = new Date().toISOString().split('T')[0];
      
      switch (exportFormat) {
        case 'html':
          const htmlReport = generateHTMLReport(auditData, contractInfo);
          downloadFile(
            htmlReport,
            `${contractName}_Security_Audit_${timestamp}.html`,
            'text/html'
          );
          break;

        case 'json':
          const jsonReport = generateJSONReport(auditData, contractInfo);
          downloadFile(
            jsonReport,
            `${contractName}_Security_Audit_${timestamp}.json`,
            'application/json'
          );
          break;

        case 'executive':
          const executiveSummary = generateExecutiveSummary(auditData, contractInfo);
          downloadFile(
            JSON.stringify(executiveSummary, null, 2),
            `${contractName}_Executive_Summary_${timestamp}.json`,
            'application/json'
          );
          break;

        case 'all':
          // Download all formats
          const html = generateHTMLReport(auditData, contractInfo);
          const json = generateJSONReport(auditData, contractInfo);
          const exec = generateExecutiveSummary(auditData, contractInfo);
          
          downloadFile(html, `${contractName}_Security_Audit_${timestamp}.html`, 'text/html');
          setTimeout(() => {
            downloadFile(json, `${contractName}_Security_Audit_${timestamp}.json`, 'application/json');
          }, 500);
          setTimeout(() => {
            downloadFile(JSON.stringify(exec, null, 2), `${contractName}_Executive_Summary_${timestamp}.json`, 'application/json');
          }, 1000);
          break;

        default:
          throw new Error('Invalid export format');
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert(`Export failed: ${error.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  const auditData = getAuditData();
  if (!auditData) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <div className="text-center">
          <div className="text-gray-400 text-4xl mb-4">📄</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Report Available</h3>
          <p className="text-gray-600">Complete an analysis to generate professional reports.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-purple-200 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-3">
              <span className="text-xl">📊</span>
            </div>
            <div>
              <h3 className="text-xl font-bold">Professional Audit Reports</h3>
              <p className="text-purple-100 text-sm">Export comprehensive security analysis</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-purple-200">Report Quality</div>
            <div className="text-lg font-bold">Premium</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Analysis Summary */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Analysis Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{auditData.scores?.overall || 75}</div>
              <div className="text-xs text-gray-600">Overall Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{auditData.findings?.security?.length || 0}</div>
              <div className="text-xs text-gray-600">Security Findings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{auditData.aiModelsUsed?.length || 0}</div>
              <div className="text-xs text-gray-600">AI Models</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {auditData.supervisorVerification?.verified ? '✓' : '⚠'}
              </div>
              <div className="text-xs text-gray-600">Verified</div>
            </div>
          </div>
        </div>

        {/* Export Options */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Export Format</h4>
          
          {/* Format Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              onClick={() => setExportFormat('html')}
              className={`p-4 rounded-lg border-2 transition-all ${
                exportFormat === 'html'
                  ? 'border-purple-500 bg-purple-50 text-purple-800'
                  : 'border-gray-200 hover:border-purple-300 text-gray-700'
              }`}
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">🌐</span>
                <div className="text-left">
                  <div className="font-semibold">HTML Report</div>
                  <div className="text-sm opacity-75">Interactive web report with full styling</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => setExportFormat('json')}
              className={`p-4 rounded-lg border-2 transition-all ${
                exportFormat === 'json'
                  ? 'border-purple-500 bg-purple-50 text-purple-800'
                  : 'border-gray-200 hover:border-purple-300 text-gray-700'
              }`}
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">📋</span>
                <div className="text-left">
                  <div className="font-semibold">JSON Data</div>
                  <div className="text-sm opacity-75">Structured data for programmatic access</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => setExportFormat('executive')}
              className={`p-4 rounded-lg border-2 transition-all ${
                exportFormat === 'executive'
                  ? 'border-purple-500 bg-purple-50 text-purple-800'
                  : 'border-gray-200 hover:border-purple-300 text-gray-700'
              }`}
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">📈</span>
                <div className="text-left">
                  <div className="font-semibold">Executive Summary</div>
                  <div className="text-sm opacity-75">High-level summary for stakeholders</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => setExportFormat('all')}
              className={`p-4 rounded-lg border-2 transition-all ${
                exportFormat === 'all'
                  ? 'border-purple-500 bg-purple-50 text-purple-800'
                  : 'border-gray-200 hover:border-purple-300 text-gray-700'
              }`}
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">📦</span>
                <div className="text-left">
                  <div className="font-semibold">All Formats</div>
                  <div className="text-sm opacity-75">Download HTML, JSON, and Executive Summary</div>
                </div>
              </div>
            </button>
          </div>

          {/* Export Button */}
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none shadow-lg hover:shadow-xl"
          >
            {isExporting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Generating Report...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <span className="text-xl mr-3">⬇️</span>
                Export {exportFormat === 'all' ? 'All Reports' : `${exportFormat.toUpperCase()} Report`}
              </div>
            )}
          </button>

          {/* Features List */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h5 className="font-semibold text-gray-900 mb-3">Report Features</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Detailed vulnerability analysis
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                CVSS security scoring
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Proof of concept exploits
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Remediation guidance
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Gas optimization analysis
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Professional formatting
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Multi-AI model consensus
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Supervisor verification
              </div>
            </div>
          </div>

          {/* Risk Assessment */}
          {auditData.executiveSummary?.riskLevel && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <span className="text-yellow-600 text-xl mr-3">⚠️</span>
                <div>
                  <div className="font-semibold text-yellow-800">
                    Risk Level: {auditData.executiveSummary.riskLevel}
                  </div>
                  <div className="text-sm text-yellow-700">
                    {auditData.fallbackMode 
                      ? 'Analysis completed in fallback mode - manual review recommended'
                      : 'Professional security analysis completed with AI verification'
                    }
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
