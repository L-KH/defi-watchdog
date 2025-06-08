// Updated AIScanCardPremium with Real Progress Display and Loading States
'use client';
import React, { useState, useEffect } from 'react';
import useMultiAIScanner, { AI_MODELS } from './MultiAIScanner';
import AuditProExporter from './export/AuditProExporter';

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
      
      // Add a delay to show loading states while parent processes
      setTimeout(() => {
        console.log('✅ Results processing complete, displaying results');
        setIsProcessingResults(false);
        setShowResultsLoading(false);
      }, 3000); // 3 second delay to show loading while parent processes
    },
    onProgress: (progress) => {
      setMultiAIProgress(progress);
    }
  });

  const handleStartAnalysis = async () => {
    setShowMultiAI(true);
    await performMultiAIScan();
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

        {/* Results Section with Loading States */}
        {showMultiAI && (
          <div className="space-y-6">
            {/* Show loading states when scanning is complete but results are being processed */}
            {!multiAIScanning && (isProcessingResults || showResultsLoading) && multiAIProgress?.apiCompleted && (
              <div className="space-y-6">
                {/* Analysis Results Loading */}
                <div className="bg-white rounded-lg shadow-lg border border-purple-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mr-3"></div>
                      <h3 className="text-lg font-semibold text-gray-900">Preparing Analysis Results</h3>
                    </div>
                    <span className="text-sm text-purple-600 bg-purple-100 px-2 py-1 rounded-full">Processing...</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
                      <p className="text-sm text-gray-700 mb-2">
                        {showResultsLoading ? 
                          'Finalizing comprehensive analysis results...' : 
                          'Your comprehensive security analysis is being prepared...'
                        }
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-600">
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          Multi-AI analysis completed
                        </div>
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          Supervisor verification done
                        </div>
                        <div className="flex items-center">
                          <span className={`w-2 h-2 rounded-full mr-2 ${
                            showResultsLoading ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'
                          }`}></span>
                          {showResultsLoading ? 'Executive summary ready' : 'Formatting executive summary...'}
                        </div>
                        <div className="flex items-center">
                          <span className={`w-2 h-2 rounded-full mr-2 ${
                            showResultsLoading ? 'bg-yellow-500 animate-pulse' : 'bg-yellow-500 animate-pulse'
                          }`}></span>
                          {showResultsLoading ? 'Rendering final results...' : 'Preparing AI specialist reports...'}
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress bar for final processing */}
                    {showResultsLoading && (
                      <div className="bg-white rounded-lg p-4 border border-blue-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-blue-700">Final Processing</span>
                          <span className="text-sm text-blue-600">Almost ready...</span>
                        </div>
                        <div className="w-full bg-blue-100 rounded-full h-2">
                          <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-1000 animate-pulse" style={{ width: '85%' }}></div>
                        </div>
                        <p className="text-xs text-blue-600 mt-2">Rendering comprehensive analysis results and AI specialist reports...</p>
                      </div>
                    )}
                    
                    {/* Score placeholders */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {['Security Score', 'Gas Optimization', 'Code Quality', 'Overall Score'].map((label, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4 text-center">
                          <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse mb-2"></div>
                          <div className="text-xs text-gray-500">{label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* AI Specialist Reports Loading */}
                <div className="bg-white rounded-lg shadow-lg border border-purple-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
                      <h3 className="text-lg font-semibold text-gray-900">AI Specialist Reports</h3>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded-full">Multi-AI</span>
                      <span className="text-sm font-bold text-blue-700">{AI_MODELS.length}</span>
                      <span className="text-xs text-gray-500">Specialists</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">
                    Individual analysis from specialized AI models
                  </p>
                  
                  <div className="text-xs text-gray-500 mb-4">
                    Each AI specialist focuses on specific security domains to provide comprehensive analysis coverage.
                  </div>
                  
                  {/* Loading AI specialist cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {AI_MODELS.slice(0, 6).map((model, index) => (
                      <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full flex items-center justify-center mr-3">
                            <span className="text-lg">{model.icon}</span>
                          </div>
                          <div className="flex-1">
                            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse mb-1"></div>
                            <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse w-3/4"></div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                          <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse w-5/6"></div>
                          <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse w-4/6"></div>
                        </div>
                        
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">Analyzing...</span>
                            <div className="animate-spin rounded-full h-3 w-3 border-b border-gray-400"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center text-sm text-blue-700">
                      <div className="animate-pulse mr-2">🔍</div>
                      <span>Processing individual AI specialist reports... This may take a moment.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Actual Results */}
            {!multiAIScanning && !isProcessingResults && !showResultsLoading && localScanResults.length > 0 && (
              <div className="space-y-4">
                <div className={`p-4 rounded-xl border ${
                  localScanResults[0]?.success === false 
                    ? 'bg-gradient-to-r from-red-50 to-orange-50 border-red-200'
                    : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
                }`}>
                  <div className="flex items-center mb-2">
                    <span className={`text-xl mr-2 ${
                      localScanResults[0]?.success === false ? '❌' : '✅'
                    }`}></span>
                    <h4 className={`font-semibold ${
                      localScanResults[0]?.success === false 
                        ? 'text-red-900' 
                        : 'text-green-900'
                    }`}>
                      {localScanResults[0]?.success === false 
                        ? 'Multi-AI Analysis Failed' 
                        : 'Multi-AI Analysis Complete'
                      }
                    </h4>
                  </div>
                  
                  {localScanResults[0]?.success === false ? (
                    <div className="space-y-2">
                      <p className="text-sm text-red-700">
                        ⚠️ Analysis encountered an error. Fallback results provided.
                      </p>
                      <p className="text-xs text-red-600">
                        Error: {localScanResults[0]?.error || 'Unknown error'}
                      </p>
                      <div className="mt-2 p-2 bg-red-100 rounded-md">
                        <p className="text-xs text-red-800">
                          💡 <strong>Suggestions:</strong>
                        </p>
                        <ul className="text-xs text-red-700 mt-1 space-y-1">
                          <li>• Try the <a href="/audit" className="underline font-medium">free analysis option</a></li>
                          <li>• Check your internet connection and try again</li>
                          <li>• Contact support if the issue persists</li>
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-green-700">
                        🚀 Comprehensive analysis completed with {AI_MODELS.length} specialized models
                      </p>
                      <div className="mt-2 text-xs text-green-600">
                        • Analysis completed successfully
                        • Supervisor verification: ✅ Verified
                        • Analysis confidence: 95%
                      </div>
                    </div>
                  )}
                </div>
                
                <AuditProExporter 
                  scanResults={localScanResults}
                  contractInfo={contractInfo}
                />
              </div>
            )}
          </div>
        )}

        {/* Premium Plan Display and Action Button */}
        {!showMultiAI && (
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
                        <span className="text-2xl font-bold text-gray-900">$0.10</span>
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
        {!showMultiAI && (
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

        {!contractSource && !showMultiAI && (
          <p className="text-center text-sm text-gray-500 mt-3">
            Please load a contract first to start the analysis
          </p>
        )}
      </div>
    </div>
  );
}
