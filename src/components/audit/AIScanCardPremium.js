// Updated AIScanCardPremium with Real Progress Display and Loading States
'use client';
import React, { useState, useEffect } from 'react';
import useMultiAIScanner, { AI_MODELS } from './MultiAIScanner';
import AuditProExporter from './export/AuditProExporter';
import APIKeyManager from '../settings/APIKeyManager';

export default function AIScanCardPremium({ 
  isScanning: externalIsScanning, 
  onScan, 
  error, 
  result,
  contractSource,
  contractInfo
}) {
  const [promptMode, setPromptMode] = useState('normal');
  const [customPrompt, setCustomPrompt] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showMultiAI, setShowMultiAI] = useState(false);
  const [multiAIProgress, setMultiAIProgress] = useState(null);
  const [localScanResults, setLocalScanResults] = useState([]);
  const [isProcessingResults, setIsProcessingResults] = useState(false);
  const [showResultsLoading, setShowResultsLoading] = useState(false);
  const [showDoneButton, setShowDoneButton] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [showApiKeyManager, setShowApiKeyManager] = useState(false);

  // Check for API key on mount
  useEffect(() => {
    const checkApiKey = () => {
      const apiKey = localStorage.getItem('openrouter_api_key') || 
                     process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
      setHasApiKey(!!apiKey);
    };
    checkApiKey();
  }, []);

  // Initialize MultiAIScanner
  const {
    isScanning: multiAIScanning,
    scanProgress,
    scanResults,
    analysisPhase,
    completedModels,
    performMultiAIScan
  } = useMultiAIScanner({
    contractSource,
    contractInfo,
    onComplete: (results) => {
      console.log('📊 Analysis API completed, starting results processing...');
      setIsProcessingResults(true);
      setShowResultsLoading(true);
      
      // Immediately set the results but keep loading state
      setLocalScanResults(results.analysis?.aiReportCards || []);
      
      // Start the parent scan process
      onScan(results);
      
      // Show loading for 2 seconds, then show done button instead of continuing to load
      setTimeout(() => {
        console.log('✅ Results processing complete, showing done button');
        setIsProcessingResults(false);
        setShowResultsLoading(false);
        setShowDoneButton(true);
      }, 2000); // 2 second delay to show completion
    },
    onProgress: (progress) => {
      setMultiAIProgress(progress);
    }
  });

  const handleStartAnalysis = async () => {
    // Check for API key before starting
    const apiKey = localStorage.getItem('openrouter_api_key') || 
                   process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
    
    if (!apiKey) {
      setShowApiKeyManager(true);
      return;
    }
    
    setShowMultiAI(true);
    await performMultiAIScan();
  };

  const handleApiKeyUpdate = (newKey) => {
    setHasApiKey(!!newKey);
    if (newKey) {
      setShowApiKeyManager(false);
    }
  };

  const isScanning = externalIsScanning || multiAIScanning;

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 text-white p-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center mr-4">
              <span className="text-2xl">🚀</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Premium Multi-AI Analysis</h2>
              <p className="text-purple-100 text-sm">6+ AI Models with Supervisor Verification</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-purple-200">Trusted by</div>
            <div className="text-xl font-bold">1,000+</div>
            <div className="text-sm text-purple-200">professionals</div>
          </div>
        </div>
        <p className="text-purple-100 leading-relaxed">
          Professional-grade smart contract security analysis with multiple premium AI models. 
          Each model analyzes in parallel for faster results.
        </p>
      </div>

      <div className="p-8">
        {/* API Key Manager */}
        {showApiKeyManager && (
          <div className="mb-6">
            <APIKeyManager onKeyUpdate={handleApiKeyUpdate} />
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowApiKeyManager(false)}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        {/* Live Progress Display During Scanning */}
        {showMultiAI && multiAIScanning && (
          <div className="mb-6">
            {/* Simple AI Flow Visualization */}
            <div className="mb-8 p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200">
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Multi-AI Analysis in Progress</h3>
                <p className="text-sm text-gray-600">AI specialists are analyzing your contract in parallel</p>
              </div>
              
              {/* Simple Clean Layout */}
              <div className="relative max-w-2xl mx-auto">
                {/* AI Models Grid */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {AI_MODELS.slice(0, 6).map((model, index) => {
                    const progress = scanProgress[model.id];
                    const isActive = multiAIProgress?.activeModels?.includes(model.name);
                    
                    return (
                      <div key={model.id} className="text-center">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 transition-all duration-300 ${
                          progress?.status === 'complete' ? 'bg-green-500 shadow-lg' :
                          progress?.status === 'analyzing' ? 'bg-blue-500 shadow-md' :
                          progress?.status === 'processing' ? 'bg-orange-500 shadow-md' :
                          progress?.status === 'starting' ? 'bg-yellow-500' :
                          'bg-gray-300'
                        }`}>
                          <span className="text-2xl">{model.icon}</span>
                        </div>
                        <div className="text-xs font-medium text-gray-800 mb-1">{model.name.split(' ')[0]}</div>
                        <div className={`text-xs px-2 py-1 rounded-full ${
                          progress?.status === 'complete' ? 'bg-green-100 text-green-700' :
                          progress?.status === 'analyzing' ? 'bg-blue-100 text-blue-700' :
                          progress?.status === 'processing' ? 'bg-orange-100 text-orange-700' :
                          progress?.status === 'starting' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-500'
                        }`}>
                          {progress?.status === 'complete' ? '✓ Done' :
                           progress?.status === 'analyzing' ? '🔍 Active' :
                           progress?.status === 'processing' ? '⚙️ Processing' :
                           progress?.status === 'starting' ? '⏳ Starting' :
                           'Waiting'}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Simple Arrow Down */}
                <div className="text-center mb-6">
                  <div className="animate-bounce">
                    <span className="text-2xl text-purple-600">↓</span>
                  </div>
                </div>

                {/* Center Supervisor - Simple and Clean */}
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <span className="text-3xl">🧠</span>
                  </div>
                  <div className="mt-3">
                    <div className="text-sm font-semibold text-gray-800">GPT-4o Supervisor</div>
                    <div className="text-xs text-gray-600">Final Review & Verification</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Real-Time Progress Display */}
            <div className="mb-6 p-4 bg-white rounded-lg border border-purple-100">
              {/* Overall Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                  <span className="text-sm text-gray-500">
                    {Math.round(multiAIProgress?.progress || 0)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${multiAIProgress?.progress || 0}%` }}
                  ></div>
                </div>
              </div>

              {/* Current Phase */}
              <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {multiAIProgress?.apiCompleted ? (
                      <span className="text-green-500 mr-2">✅</span>
                    ) : (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mr-2"></div>
                    )}
                    <span className="text-sm font-medium text-gray-800">
                      {multiAIProgress?.phase || 'Initializing...'}
                    </span>
                  </div>
                  {multiAIProgress?.currentPhase && (
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                      {multiAIProgress.currentPhase.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  )}
                </div>
                
                {/* Phase Progress Bar */}
                {multiAIProgress?.phaseProgress && !multiAIProgress?.apiCompleted && (
                  <div className="mt-2">
                    <div className="w-full bg-white rounded-full h-1.5">
                      <div 
                        className="bg-purple-400 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${multiAIProgress.phaseProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* AI Models Status Summary */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center mb-4">
                <div>
                  <div className="text-lg font-bold text-green-600">{completedModels.length}</div>
                  <div className="text-xs text-gray-600">Completed</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-blue-600">
                    {Object.values(scanProgress).filter(p => p?.status === 'analyzing').length}
                  </div>
                  <div className="text-xs text-gray-600">Analyzing</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-orange-600">
                    {Object.values(scanProgress).filter(p => p?.status === 'processing').length}
                  </div>
                  <div className="text-xs text-gray-600">Processing</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-yellow-600">
                    {Object.values(scanProgress).filter(p => p?.status === 'starting').length}
                  </div>
                  <div className="text-xs text-gray-600">Starting</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-400">
                    {Object.values(scanProgress).filter(p => p?.status === 'waiting').length}
                  </div>
                  <div className="text-xs text-gray-600">Waiting</div>
                </div>
              </div>
              
              {/* Active Models */}
              {multiAIProgress?.activeModels && multiAIProgress.activeModels.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="text-xs text-gray-600 mb-2">Currently Active:</div>
                  <div className="flex flex-wrap gap-1">
                    {multiAIProgress.activeModels.map((modelName, index) => (
                      <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full animate-pulse">
                        {modelName.split(' ')[0]}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-600">
                ⚡ Live progress tracking - Models shown as complete only when analysis actually finishes
              </p>
            </div>
          </div>
        )}

        {/* Results Section - Show completion status after loading */}
        {!multiAIScanning && multiAIProgress?.apiCompleted && (
        <div className="space-y-6">
        {/* Show loading or done state based on processing status */}
        <div className="bg-white rounded-lg shadow-lg border border-purple-200 p-6">
        <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          {showDoneButton ? (
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-sm">✓</span>
            </div>
          ) : (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mr-3"></div>
          )}
        <h3 className="text-lg font-semibold text-gray-900">
          {showDoneButton ? 'Analysis Complete' : 'Processing Analysis Results'}
        </h3>
        </div>
        {showDoneButton ? (
          <button
            onClick={() => {
              // Scroll to the results section
              const resultsSection = document.querySelector('[data-results-section]');
              if (resultsSection) {
                resultsSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="text-sm text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-full transition-colors"
          >
            ✅ View Results Below
          </button>
        ) : (
          <span className="text-sm text-purple-600 bg-purple-100 px-2 py-1 rounded-full">Finalizing...</span>
        )}
        </div>
        
        <div className="space-y-4">
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
        <p className="text-sm text-gray-700 mb-3">
          {showDoneButton ? (
            <>🎉 Multi-AI analysis completed successfully! Your comprehensive security report is ready below.</>
          ) : (
            <>🎆 Multi-AI analysis completed successfully! Now preparing your comprehensive security report...</>
          )}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-gray-600 mb-4">
        <div className="flex items-center">
        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
        All 6 AI models completed analysis
        </div>
        <div className="flex items-center">
        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
        Supervisor verification finished
        </div>
        <div className="flex items-center">
        <span className={`w-2 h-2 rounded-full mr-2 ${showDoneButton ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`}></span>
        {showDoneButton ? 'Comprehensive reports ready' : 'Generating comprehensive reports...'}
        </div>
        <div className="flex items-center">
        <span className={`w-2 h-2 rounded-full mr-2 ${showDoneButton ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`}></span>
        {showDoneButton ? 'Interactive dashboard ready' : 'Preparing interactive dashboard...'}
        </div>
        </div>
        
        {/* Progress Bar - Complete or Loading */}
        <div className="w-full bg-blue-100 rounded-full h-3 mb-2">
        <div className={`bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-1000 ${showDoneButton ? '' : 'animate-pulse'}`}
        style={{ width: showDoneButton ? '100%' : '75%' }}></div>
        </div>
        <p className="text-xs text-blue-600 text-center">
          {showDoneButton ? 'Analysis complete! Results available below.' : 'Processing comprehensive analysis data...'}
        </p>
        </div>
        
        {/* What's been prepared */}
        <div className="bg-white rounded-lg p-4 border border-blue-200">
        <h4 className="text-sm font-semibold text-gray-800 mb-3">
          {showDoneButton ? '✅ Ready for you:' : '📋 What\'s being prepared for you:'}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="flex items-center text-sm text-gray-600">
        {showDoneButton ? (
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
        ) : (
          <div className="animate-spin rounded-full h-3 w-3 border-b border-blue-500 mr-2"></div>
        )}
        Executive Security Summary
        </div>
        <div className="flex items-center text-sm text-gray-600">
        {showDoneButton ? (
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
        ) : (
          <div className="animate-spin rounded-full h-3 w-3 border-b border-green-500 mr-2"></div>
        )}
        Detailed Vulnerability Reports
        </div>
        <div className="flex items-center text-sm text-gray-600">
        {showDoneButton ? (
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
        ) : (
          <div className="animate-spin rounded-full h-3 w-3 border-b border-orange-500 mr-2"></div>
        )}
          Gas Optimization Analysis
        </div>
        <div className="flex items-center text-sm text-gray-600">
        {showDoneButton ? (
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
        ) : (
          <div className="animate-spin rounded-full h-3 w-3 border-b border-purple-500 mr-2"></div>
        )}
        Professional HTML Reports
        </div>
        <div className="flex items-center text-sm text-gray-600">
        {showDoneButton ? (
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
        ) : (
          <div className="animate-spin rounded-full h-3 w-3 border-b border-red-500 mr-2"></div>
        )}
        AI Specialist Insights
        </div>
        <div className="flex items-center text-sm text-gray-600">
        {showDoneButton ? (
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
        ) : (
          <div className="animate-spin rounded-full h-3 w-3 border-b border-indigo-500 mr-2"></div>
        )}
              Interactive Analysis Dashboard
                        </div>
          </div>
        </div>
        
        {/* Success indicators */}
        <div className={`border rounded-lg p-4 ${showDoneButton ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'}`}>
        <div className="flex items-center text-sm">
        <span className={`text-lg mr-2 ${showDoneButton ? 'text-green-500' : 'text-blue-500'}`}>
          {showDoneButton ? '🎉' : '✅'}
        </span>
        <div>
        <p className={`font-medium ${showDoneButton ? 'text-green-700' : 'text-blue-700'}`}>
          {showDoneButton ? 'Ready to Review!' : 'Analysis Completed Successfully!'}
        </p>
        <p className={`text-xs mt-1 ${showDoneButton ? 'text-green-600' : 'text-blue-600'}`}>
          {showDoneButton ? (
            <>Your comprehensive security analysis is ready! Scroll down to review detailed findings, professional reports, and actionable recommendations.</>
          ) : (
            <>Your comprehensive security analysis will appear below in just a moment. This includes detailed findings, professional reports, and actionable recommendations.</>
          )}
            </p>
          </div>
        </div>
        </div>
        
        {/* Time estimate or completion */}
        <div className="text-center">
        {showDoneButton ? (
          <div className="inline-flex items-center text-xs text-green-600 bg-green-50 px-3 py-2 rounded-full">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            Analysis complete! Check results below.
          </div>
        ) : (
          <div className="inline-flex items-center text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-full">
            <div className="animate-spin rounded-full h-3 w-3 border-b border-gray-400 mr-2"></div>
            Usually takes 10-30 seconds to finalize...
          </div>
        )}
        </div>
        </div>
        </div>
        </div>
        )}

        {/* API Key Notice */}
        {!hasApiKey && !showApiKeyManager && !showMultiAI && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  OpenRouter API Key Required
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    To use the premium multi-AI analysis, you need to configure your OpenRouter API key.
                  </p>
                  <button
                    onClick={() => setShowApiKeyManager(true)}
                    className="mt-2 text-sm font-medium text-yellow-800 hover:text-yellow-900 underline"
                  >
                    Configure API Key →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Premium Plan Display and Action Button */}
        {!showMultiAI && !showApiKeyManager && (
          <div className="mb-8">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium Multi-AI Security Analysis</h3>
              <p className="text-gray-600">Professional-grade parallel analysis with 6+ specialized AI models</p>
            </div>

            <div className="max-w-lg mx-auto">
              <div className="relative p-6 rounded-2xl border-2 border-purple-200 bg-purple-50 shadow-lg">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg">
                    ⭐ Professional Grade
                  </span>
                </div>

                <div className="flex items-center justify-between mb-4 mt-2">
                  <div className="flex items-center">
                    <div className="text-3xl mr-3">🚀</div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900">Premium Security Audit</h4>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-gray-900">$10</span>
                        <span className="text-sm text-gray-500">per analysis</span>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                          PREMIUM
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-4 p-4 bg-white/60 rounded-lg">
                  <h5 className="font-semibold text-gray-900 text-sm mb-3">AI Models (Parallel Analysis):</h5>
                  <div className="grid grid-cols-3 gap-2">
                    {AI_MODELS.slice(0, 6).map((model) => (
                      <div key={model.id} className="text-center p-2 bg-purple-50 rounded-lg">
                        <div className="text-xl mb-1">{model.icon}</div>
                        <div className="text-xs font-medium text-gray-700">{model.name.split(' ')[0]}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-2">⏱️</span>
                    <span>Analysis time: 2-3 minutes (parallel processing)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        {!showMultiAI && !showApiKeyManager && (
          <button
            onClick={handleStartAnalysis}
            disabled={isScanning || !contractSource}
            className="w-full py-4 px-6 rounded-xl text-white font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {isScanning ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                Running Multi-AI Analysis...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <span className="text-xl mr-3">🚀</span>
                Run Comprehensive Multi-AI Analysis
              </div>
            )}
          </button>
        )}

        {!contractSource && !showMultiAI && !showApiKeyManager && (
          <p className="text-center text-sm text-gray-500 mt-3">
            Please load a contract first to start the analysis
          </p>
        )}
      </div>
    </div>
  );
}
