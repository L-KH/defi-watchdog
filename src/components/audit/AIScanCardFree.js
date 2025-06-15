// Enhanced Free AI Security Analysis Card with Model Selection
'use client';
import { useState } from 'react';
import Web3MintButton from '../Web3MintButton';

// Available Free AI Models with their specialties
const FREE_AI_MODELS = {
  'deepseek/deepseek-r1-0528:free': {
    name: 'DeepSeek R1',
    icon: '🧠',
    speciality: 'Advanced reasoning and vulnerability detection',
    description: 'Latest DeepSeek model with enhanced security pattern recognition',
    strengths: ['Complex vulnerability analysis', 'Business logic flaws', 'Advanced reasoning'],
    recommended: true
  },
  'qwen/qwen3-32b:free': {
    name: 'Qwen 3 32B',
    icon: '🔍',
    speciality: 'Deep code analysis and pattern matching',
    description: 'Large context model excellent for comprehensive code review',
    strengths: ['Large context analysis', 'Code quality', 'Gas optimization']
  },
  'cognitivecomputations/dolphin3.0-mistral-24b:free': {
    name: 'Dolphin Mistral',
    icon: '🐬',
    speciality: 'Security-focused analysis and exploit detection',
    description: 'Fine-tuned for security analysis with penetration testing focus',
    strengths: ['Exploit detection', 'Reentrancy analysis', 'Access control']
  }
};

export default function AIScanCardFree({ 
  isScanning, 
  onScan, 
  error, 
  result 
}) {
  const [selectedModel, setSelectedModel] = useState('deepseek/deepseek-r1-0528:free');
  const [promptMode, setPromptMode] = useState('normal');
  const [customPrompt, setCustomPrompt] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showModelDetails, setShowModelDetails] = useState(false);

  // Free plan configuration
  const freePlan = {
    name: 'Free Security Scan',
    icon: '🔍',
    price: 'Free',
    description: 'Professional security analysis with state-of-the-art free AI models',
    features: [
      'Advanced vulnerability detection',
      'Multiple AI model options',
      'Real exploit analysis',
      'Gas optimization suggestions',
      'Professional reporting',
      'Community support'
    ],
    estimatedTime: '45-90 seconds',
    buttonText: 'Start Free Analysis',
    buttonClass: 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800',
    cardClass: 'border-blue-200 bg-blue-50',
    badge: 'FREE',
    badgeClass: 'bg-blue-100 text-blue-700'
  };

  // Enhanced prompt modes
  const promptModes = {
    normal: {
      name: 'Comprehensive',
      icon: '🔍',
      description: 'Complete security assessment'
    },
    aggressive: {
      name: 'Penetration',
      icon: '⚡',
      description: 'Aggressive exploit detection'
    },
    focused: {
      name: 'Focused',
      icon: '🎯',
      description: 'Focus on critical vulnerabilities'
    },
    custom: {
      name: 'Custom',
      icon: '✏️',
      description: 'Your specific requirements'
    }
  };

  const selectedModelInfo = FREE_AI_MODELS[selectedModel];

  const handleStartAnalysis = () => {
    const scanOptions = {
      type: 'free', // IMPORTANT: Mark as free for regular audit page
      plan: 'free',
      model: selectedModel,
      promptMode: promptMode,
      customPrompt: promptMode === 'custom' ? customPrompt : null,
      timeout: 90000, // Longer timeout for better analysis
      source: 'regular-audit-page' // Track source
    };
    
    console.log('🆓 AIScanCardFree - Starting free AI analysis:', {
      scanOptions,
      selectedModel,
      promptMode,
      source: 'regular-audit-page'
    });

    onScan(scanOptions);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white p-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center mr-4">
              <span className="text-2xl">🤖</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold">AI Security Analysis</h2>
              <p className="text-blue-100 text-sm">Free tier with advanced AI models</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-blue-200">Powered by</div>
            <div className="text-lg font-bold">{selectedModelInfo.name}</div>
            <div className="text-sm text-blue-200">{selectedModelInfo.icon}</div>
          </div>
        </div>
        <p className="text-blue-100 leading-relaxed">
          Professional smart contract security analysis with state-of-the-art free AI models. 
          Choose your preferred AI model and analysis approach.
        </p>
      </div>

      <div className="p-8">
        {/* AI Model Selection */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Choose AI Model</h3>
            <button
              onClick={() => setShowModelDetails(!showModelDetails)}
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              {showModelDetails ? 'Hide Details' : 'Model Details'}
            </button>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            {Object.entries(FREE_AI_MODELS).map(([modelId, modelInfo]) => (
              <div key={modelId} className="relative">
                <button
                  onClick={() => setSelectedModel(modelId)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                    selectedModel === modelId
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{modelInfo.icon}</span>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-gray-900">{modelInfo.name}</h4>
                          {modelInfo.recommended && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                              Recommended
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{modelInfo.speciality}</p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedModel === modelId ? 'border-blue-500' : 'border-gray-300'
                    }`}>
                      {selectedModel === modelId && (
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      )}
                    </div>
                  </div>
                  
                  {showModelDetails && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-sm text-gray-700 mb-2">{modelInfo.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {modelInfo.strengths.map((strength, index) => (
                          <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                            {strength}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Analysis Preview for Selected Model */}
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
          <div className="flex items-center">
            <span className="text-2xl mr-3">{selectedModelInfo.icon}</span>
            <div>
              <h4 className="font-semibold text-gray-900">{selectedModelInfo.name} Analysis</h4>
              <p className="text-sm text-gray-700 mt-1">🎯 <strong>Speciality:</strong> {selectedModelInfo.speciality}</p>
            </div>
          </div>
        </div>

        {/* Advanced Options */}
        <div className="mb-6">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center text-gray-700 hover:text-gray-900 transition-colors"
          >
            <span className="mr-2">⚙️</span>
            <span className="font-medium">Analysis Options</span>
            <span className={`ml-2 transform transition-transform ${
              showAdvanced ? 'rotate-180' : ''
            }`}>▼</span>
          </button>

          {showAdvanced && (
            <div className="mt-4 p-6 bg-gray-50 rounded-xl border border-gray-200">
              {/* Analysis Mode */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Analysis Approach</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(promptModes).map(([mode, config]) => (
                    <button
                      key={mode}
                      onClick={() => setPromptMode(mode)}
                      className={`p-4 rounded-lg border-2 text-center transition-all ${
                        promptMode === mode
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600 bg-white'
                      }`}
                    >
                      <div className="text-2xl mb-2">{config.icon}</div>
                      <div className="font-medium text-sm">{config.name}</div>
                      <div className="text-xs opacity-75 mt-1">{config.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Prompt */}
              {promptMode === 'custom' && (
                <div>
                  <label htmlFor="custom-prompt" className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Analysis Instructions
                  </label>
                  <textarea
                    id="custom-prompt"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="Example: Focus on reentrancy vulnerabilities in withdrawal functions, check for flash loan attacks, analyze access control in admin functions..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    💡 Be specific about vulnerabilities, functions, or security patterns you want analyzed
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mode-specific Information */}
        {promptMode === 'aggressive' && (
          <div className="mb-4 p-4 bg-orange-50 border border-orange-200 text-orange-800 rounded-lg">
            <div className="flex items-center">
              <span className="mr-2">⚡</span>
              <div>
                <p className="font-medium">Penetration Testing Mode</p>
                <p className="text-sm mt-1">
                  This mode simulates actual attack scenarios and may report theoretical vulnerabilities.
                </p>
              </div>
            </div>
          </div>
        )}

        {promptMode === 'focused' && (
          <div className="mb-4 p-4 bg-purple-50 border border-purple-200 text-purple-800 rounded-lg">
            <div className="flex items-center">
              <span className="mr-2">🎯</span>
              <div>
                <p className="font-medium">Focused Critical Analysis</p>
                <p className="text-sm mt-1">
                  Concentrates on high and critical severity vulnerabilities for faster results.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            <div className="flex items-center">
              <span className="mr-2">❌</span>
              <div>
                <p className="font-medium">Analysis Failed</p>
                <p className="text-sm mt-1">{error}</p>
                {error.includes('API key') && (
                  <div className="mt-2 text-xs bg-red-100 p-2 rounded">
                    <p><strong>Solution:</strong> Check your .env.local file contains:</p>
                    <code>OPENROUTER_API_KEY=your_key_here</code>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleStartAnalysis}
          disabled={isScanning || (promptMode === 'custom' && !customPrompt.trim())}
          className={`w-full py-4 px-6 rounded-xl text-white font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
            freePlan.buttonClass
          }`}
        >
          {isScanning ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
              Analyzing with {selectedModelInfo.name}...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <span className="text-xl mr-3">{selectedModelInfo.icon}</span>
              Start {selectedModelInfo.name} Analysis
            </div>
          )}
        </button>

        <p className="text-center text-sm text-gray-500 mt-3">
          🔍 Free professional analysis • No registration required • Real vulnerability detection
        </p>

        {/* Results Summary with Mint Button */}
        {result && (
          <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-xl">
            <h4 className="font-semibold text-blue-900 mb-4 flex items-center">
              <span className="text-blue-600 mr-2">✅</span>
              Analysis Complete - {result.model || selectedModelInfo.name}
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">AI Model</p>
                <p className="font-semibold text-gray-900">{result.model || selectedModelInfo.name}</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Security Score</p>
                <p className="font-semibold text-2xl text-gray-900">
                  {result.analysis?.securityScore || result.analysis?.overallScore || 'N/A'}
                  {(result.analysis?.securityScore || result.analysis?.overallScore) && '/100'}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Findings</p>
                <p className="font-semibold text-2xl text-gray-900">
                  {result.analysis?.keyFindings?.length || 0}
                </p>
              </div>
            </div>

            {result.analysis?.summary && (
              <div className="bg-white p-4 rounded-lg mb-4">
                <p className="text-sm text-gray-600 mb-2">Analysis Summary</p>
                <p className="text-gray-900">{result.analysis.summary}</p>
              </div>
            )}
            
            {/* Mint Certificate Button - Only show when analysis is successful */}
            {result.success !== false && (
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
                    security: result.analysis?.securityScore || 75,
                    gas: result.analysis?.gasOptimizationScore || 80,
                    quality: result.analysis?.codeQualityScore || 85,
                    overall: result.analysis?.overallScore || result.analysis?.securityScore || 75
                    },
                    securityFindings: result.analysis?.keyFindings || [],
                    gasOptimizations: result.analysis?.gasOptimizations || [],
                    codeQualityIssues: result.analysis?.codeQualityIssues || [],
                    executiveSummary: result.analysis?.summary || 'AI security analysis completed successfully.',
                    modelsUsed: [result.model || selectedModelInfo.name],
                    analysisType: 'free-ai',
                    processingTime: result.analysisTime ? `${(result.analysisTime / 1000).toFixed(1)}s` : '45s'
                    }}
                    auditType="static"
                    onMintComplete={(certificateData) => {
                    console.log('✅ Free AI Certificate created successfully!', certificateData);
                    }}
                    />
                  </div>
                  
                  <div className="mt-3 text-xs text-green-600">
                    ✅ Permanent IPFS storage • 📱 Always accessible • 🔗 Shareable link
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Upgrade Notice */}
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
          <div className="text-center">
            <h4 className="font-semibold text-purple-900 mb-2">Need Enterprise-Grade Analysis?</h4>
            <p className="text-sm text-purple-700 mb-3">
              Upgrade to Premium for multi-AI consensus, supervisor verification, and production-ready reports
            </p>
            <a 
              href="/audit-pro" 
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
            >
              <span className="mr-2">🚀</span>
              Try Premium Analysis
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
