// src/components/audit/ToolsScanCard.js
import { useState } from 'react';
import { ScanUtils } from '../../services/contractScannerApi';

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
      duration: '&lt; 10 seconds',
      tools: ['pattern_matcher', 'solhint'],
      color: 'bg-green-50 border-green-200 text-green-800'
    },
    balanced: {
      name: 'Balanced Scan',
      description: 'Comprehensive static analysis',
      duration: '30-60 seconds',
      tools: ['pattern_matcher', 'slither', 'semgrep'],
      color: 'bg-blue-50 border-blue-200 text-blue-800'
    },
    deep: {
      name: 'Deep Scan',
      description: 'Advanced symbolic execution',
      duration: '2-5 minutes',
      tools: ['pattern_matcher', 'slither', 'mythril'],
      color: 'bg-purple-50 border-purple-200 text-purple-800'
    },
    comprehensive: {
      name: 'Comprehensive Scan',
      description: 'All available security tools',
      duration: '5-10 minutes',
      tools: ['pattern_matcher', 'slither', 'mythril', 'semgrep', 'solhint'],
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
              scannerHealth.status === 'healthy' 
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              <span className="mr-2">
                {scannerHealth.status === 'healthy' ? '✅' : '❌'}
              </span>
              <div>
                <p className="font-medium">
                  Scanner API: {scannerHealth.status === 'healthy' ? 'Online' : 'Offline'}
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

        {/* Scan Button */}
        <button
          onClick={handleScan}
          disabled={isScanning || !scannerHealth || scannerHealth.status !== 'healthy' || 
                   (useCustomTools && selectedTools.length === 0)}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200"
        >
          {isScanning ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Scanning with {useCustomTools ? 'Custom Tools' : scanModes[selectedMode].name}...
            </div>
          ) : (
            `Start ${useCustomTools ? 'Custom' : scanModes[selectedMode].name}`
          )}
        </button>

        {/* Results Summary */}
        {result && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <h4 className="font-medium text-gray-900 mb-2">Scan Complete</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Tools Used</p>
                <p className="font-medium">{result.result?.tools_used?.join(', ') || 'None'}</p>
              </div>
              <div>
                <p className="text-gray-600">Vulnerabilities Found</p>
                <p className="font-medium">{result.result?.summary?.total_vulnerabilities || 0}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}