// src/components/audit/ToolsScanCard.js
import { useState } from 'react';
import { ScanUtils } from '../../services/contractScannerApi';
import LoadingProgress from '../ui/LoadingProgress';
import Web3MintButton from '../Web3MintButton';

// Helper functions for processing static analysis results
const calculateSecurityScore = (result) => {
  if (!result?.result?.summary) return 75;
  
  const summary = result.result.summary;
  let score = 100;
  
  // Deduct points based on vulnerability severity
  score -= (summary.critical || 0) * 25;
  score -= (summary.high || 0) * 20;
  score -= (summary.medium || 0) * 10;
  score -= (summary.low || 0) * 5;
  
  return Math.max(10, score); // Minimum score of 10
};

const extractSecurityFindings = (result) => {
  if (!result?.result?.all_vulnerabilities) return [];
  
  return result.result.all_vulnerabilities.map((vuln, index) => ({
    title: vuln.type || vuln.title || `Vulnerability #${index + 1}`,
    description: vuln.description || vuln.message || 'Security issue detected',
    severity: vuln.severity || vuln.level || 'MEDIUM',
    category: vuln.category || 'Security',
    location: vuln.line ? `Line ${vuln.line}` : 'Unknown location',
    impact: vuln.impact || 'Security vulnerability',
    recommendation: vuln.recommendation || 'Review and fix the identified issue'
  }));
};

const generateExecutiveSummary = (result) => {
  if (!result?.result?.summary) {
    return 'Static security analysis completed successfully.';
  }
  
  const summary = result.result.summary;
  const totalVulns = summary.total_vulnerabilities || 0;
  const toolsUsed = result.result.tools_used?.join(', ') || 'security tools';
  
  if (totalVulns === 0) {
    return `Static analysis using ${toolsUsed} completed successfully. No vulnerabilities detected.`;
  }
  
  return `Static analysis using ${toolsUsed} completed. Found ${totalVulns} vulnerabilities: ${summary.high || 0} High, ${summary.medium || 0} Medium, ${summary.low || 0} Low severity issues.`;
};

export default function ToolsScanCard({ 
  scannerHealth, 
  toolsInfo, 
  isLoading, 
  isScanning, 
  onScan, 
  error, 
  result 
}) {
  const [selectedMode, setSelectedMode] = useState('balanced');
  const [selectedTools, setSelectedTools] = useState([]);
  const [useCustomTools, setUseCustomTools] = useState(false);

  const scanModes = {
    fast: {
      name: 'Fast Scan',
      description: 'Quick pattern matching and linting',
      duration: '1 second',
      tools: ['pattern_matcher'],
      color: 'bg-green-50 border-green-200 text-green-800'
    },
    balanced: {
      name: 'Balanced Scan',
      description: 'Comprehensive static analysis',
      duration: '3 seconds',
      tools: ['pattern_matcher', 'static_analyzer'],
      color: 'bg-blue-50 border-blue-200 text-blue-800'
    },
    deep: {
      name: 'Deep Scan',
      description: 'Advanced flow analysis',
      duration: '8 seconds',
      tools: ['pattern_matcher', 'static_analyzer', 'flow_analyzer'],
      color: 'bg-purple-50 border-purple-200 text-purple-800'
    },
    comprehensive: {
      name: 'Comprehensive Scan',
      description: 'All available security tools',
      duration: '15 seconds',
      tools: ['pattern_matcher', 'static_analyzer', 'flow_analyzer', 'semantic_analyzer'],
      color: 'bg-orange-50 border-orange-200 text-orange-800'
    }
  };

  const handleScan = () => {
    const scanOptions = useCustomTools 
      ? { tools: selectedTools.join(',') }
      : { mode: selectedMode };
    
    onScan(scanOptions);
  };

  const toggleTool = (toolName) => {
    setSelectedTools(prev => 
      prev.includes(toolName)
        ? prev.filter(t => t !== toolName)
        : [...prev, toolName]
    );
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
        <div className="flex items-center mb-2">
          <span className="text-2xl mr-3">🛠️</span>
          <h2 className="text-xl font-bold">Multi-Tool Security Analysis</h2>
        </div>
        <p className="text-blue-100">
          Industry-standard security tools for comprehensive vulnerability detection
        </p>
      </div>

      <div className="p-6">
        {/* Scanner Health Status */}
        {scannerHealth && (
          <div className="mb-6">
            <div className={`flex items-center p-3 rounded-md border ${
              (scannerHealth.status === 'healthy' || scannerHealth.available_tools?.mythril) 
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              <span className="mr-2">
                {(scannerHealth.status === 'healthy' || scannerHealth.available_tools?.mythril) ? '✅' : '❌'}
              </span>
              <div>
                <p className="font-medium">
                  Scanner API: {(scannerHealth.status === 'healthy' || scannerHealth.available_tools?.mythril) ? 'Online' : 'Offline'}
                </p>
                {scannerHealth.version && (
                  <p className="text-sm opacity-75">Version: {scannerHealth.version}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Available Tools */}
        {toolsInfo && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Available Tools</h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(toolsInfo.available_tools || {}).map(([tool, available]) => (
                <div key={tool} className={`flex items-center p-2 rounded text-xs ${
                  available 
                    ? 'bg-green-50 text-green-700' 
                    : 'bg-gray-50 text-gray-500'
                }`}>
                  <span className="mr-2">{ScanUtils.getToolIcon(tool)}</span>
                  <span className="capitalize">{tool.replace('_', ' ')}</span>
                  <span className="ml-auto">
                    {available ? '✓' : '✗'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Scan Mode Selection */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-700">Scan Configuration</h3>
            <button
              type="button"
              onClick={() => setUseCustomTools(!useCustomTools)}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              {useCustomTools ? 'Use Presets' : 'Custom Tools'}
            </button>
          </div>

          {!useCustomTools ? (
            <div className="space-y-3">
              {Object.entries(scanModes).map(([mode, config]) => (
                <label key={mode} className="block">
                  <input
                    type="radio"
                    name="scanMode"
                    value={mode}
                    checked={selectedMode === mode}
                    onChange={(e) => setSelectedMode(e.target.value)}
                    className="sr-only"
                  />
                  <div className={`p-3 rounded-md border-2 cursor-pointer transition-all ${
                    selectedMode === mode 
                      ? config.color 
                      : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                  }`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{config.name}</h4>
                        <p className="text-sm opacity-75">{config.description}</p>
                      </div>
                      <span className="text-xs font-medium px-2 py-1 bg-white rounded">
                        {config.duration}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {config.tools.map(tool => (
                        <span key={tool} className="text-xs px-2 py-1 bg-white rounded">
                          {ScanUtils.getToolIcon(tool)} {tool.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Select specific tools to run:</p>
              {Object.entries(toolsInfo?.available_tools || {}).map(([tool, available]) => (
                <label key={tool} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedTools.includes(tool)}
                    onChange={() => toggleTool(tool)}
                    disabled={!available}
                    className="mr-2"
                  />
                  <span className={`text-sm ${available ? '' : 'text-gray-400'}`}>
                    {ScanUtils.getToolIcon(tool)} {tool.replace('_', ' ')}
                  </span>
                  {!available && <span className="ml-2 text-xs text-red-500">(unavailable)</span>}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
            <p className="font-medium">Scan Failed</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Enhanced Loading Display */}
        {isScanning && (
          <div className="mb-6">
            <LoadingProgress
              isActive={isScanning}
              duration={scanModes[selectedMode]?.duration === '1 second' ? 1000 : 
                      scanModes[selectedMode]?.duration === '3 seconds' ? 3000 :
                      scanModes[selectedMode]?.duration === '8 seconds' ? 8000 :
                      scanModes[selectedMode]?.duration === '15 seconds' ? 15000 : 3000}
              mode={selectedMode}
              message={`Running ${scanModes[selectedMode]?.name || 'scan'}...`}
            />
          </div>
        )}

        {/* Scan Button */}
        <button
          onClick={handleScan}
          disabled={isScanning || !scannerHealth || 
                   (useCustomTools && selectedTools.length === 0)}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200"
        >
          {isScanning ? (
            `Scanning in progress...`
          ) : (
            `Start ${useCustomTools ? 'Custom' : scanModes[selectedMode].name}`
          )}
        </button>

        {/* Results Summary with Mint Button */}
        {result && (
          <div className="mt-6 p-6 bg-blue-50 border border-blue-200 rounded-xl">
            <h4 className="font-semibold text-blue-900 mb-4 flex items-center">
              <span className="text-blue-600 mr-2">✅</span>
              Static Analysis Complete
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Tools Used</p>
                <p className="font-semibold text-gray-900">{result.result?.tools_used?.join(', ') || 'Pattern Matcher'}</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Vulnerabilities</p>
                <p className="font-semibold text-2xl text-gray-900">{result.result?.summary?.total_vulnerabilities || 0}</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Security Score</p>
                <p className="font-semibold text-2xl text-gray-900">
                  {result.securityScore || calculateSecurityScore(result)}/100
                </p>
              </div>
            </div>

            {result.result?.summary && (
              <div className="bg-white p-4 rounded-lg mb-4">
                <p className="text-sm text-gray-600 mb-2">Analysis Summary</p>
                <p className="text-gray-900">
                  Found {result.result.summary.total_vulnerabilities || 0} vulnerabilities: 
                  {result.result.summary.high || 0} High, 
                  {result.result.summary.medium || 0} Medium, 
                  {result.result.summary.low || 0} Low severity issues.
                </p>
              </div>
            )}
            
            {/* Mint Certificate Button - Only show when analysis is successful */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
              <div className="text-center">
                <h5 className="font-semibold text-green-800 mb-2 flex items-center justify-center">
                  <span className="mr-2">🏆</span>
                  Save Your Analysis Report
                </h5>
                <p className="text-sm text-green-700 mb-4">
                  Create a permanent certificate of this security analysis with IPFS storage
                </p>
                
                <div className="flex justify-center">
                  <Web3MintButton 
                    contractAddress={result.contractInfo?.address || result.contractInfo?.contractAddress}
                    auditData={{
                      contractInfo: {
                        contractName: result.contractInfo?.contractName || 'Analyzed Contract',
                        address: result.contractInfo?.address || result.contractInfo?.contractAddress,
                        network: result.contractInfo?.network || 'linea'
                      },
                      scores: {
                        security: result.securityScore || calculateSecurityScore(result),
                        gas: 80,
                        quality: 85,
                        overall: result.securityScore || calculateSecurityScore(result)
                      },
                      securityFindings: extractSecurityFindings(result),
                      gasOptimizations: [],
                      codeQualityIssues: [],
                      executiveSummary: generateExecutiveSummary(result),
                      modelsUsed: result.result?.tools_used || ['Static Analysis Tools'],
                      analysisType: 'static',
                      processingTime: '3s'
                    }}
                    auditType="static"
                    onMintComplete={(certificateData) => {
                      console.log('✅ Static Certificate created successfully!', certificateData);
                    }}
                  />
                </div>
                
                <div className="mt-3 text-xs text-green-600">
                  ✅ Permanent IPFS storage • 📱 Always accessible • 🔗 Shareable link
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}