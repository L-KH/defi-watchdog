// Premium AI Security Analysis Card with Multi-AI Support
'use client';
import { useState, useEffect } from 'react';
import MultiAIScanner from './MultiAIScanner';
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

  // Initialize MultiAIScanner
  const {
    isScanning: multiAIScanning,
    scanProgress,
    scanResults,
    currentModel,
    performMultiAIScan,
    AI_MODELS
  } = MultiAIScanner({
    contractSource,
    contractInfo,
    onComplete: (results) => {
      setLocalScanResults(results.analysis?.aiReportCards || []);
      onScan(results); // Pass to parent
    },
    onProgress: (progress) => {
      setMultiAIProgress(progress);
    }
  });

  // Premium plan configuration
  const premiumPlan = {
    name: 'Premium Security Audit',
    icon: '🚀',
    price: '$0.10',
    priceNote: 'per analysis',
    description: 'Professional-grade analysis with multiple AI models and comprehensive reporting',
    features: [
      'Multi-AI analysis (6+ models)',
      'Supervisor verification (GPT)',
      'Advanced vulnerability detection',
      'Gas optimization analysis',
      'Code quality assessment',
      'Professional audit report',
      'CVSS security scoring',
      'Detailed remediation guides',
      'Export to PDF/HTML/JSON',
      'Priority support'
    ],
    estimatedTime: '3-5 minutes',
    buttonText: 'Run Multi-AI Analysis',
    buttonClass: 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700',
    cardClass: 'border-purple-200 bg-purple-50',
    badge: 'PREMIUM',
    badgeClass: 'bg-purple-100 text-purple-700',
    popular: true
  };

  // Prompt modes
  const promptModes = {
    normal: {
      name: 'Standard',
      icon: '🔍',
      description: 'Comprehensive security assessment'
    },
    aggressive: {
      name: 'Aggressive',
      icon: '⚡',
      description: 'Deep penetration testing approach'
    },
    custom: {
      name: 'Custom',
      icon: '✏️',
      description: 'Your own analysis instructions'
    }
  };

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
          Each model specializes in different aspects, verified by an AI supervisor for accuracy.
        </p>
      </div>

      <div className="p-8">
        {/* Multi-AI Progress Display */}
        {showMultiAI && multiAIScanning && (
          <div className="mb-6 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200">
            <h4 className="font-semibold text-gray-900 mb-4">Multi-AI Analysis in Progress</h4>
            
            {/* Overall Progress */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Analyzing with {currentModel?.name || 'AI Model'}
                </span>
                <span className="text-sm text-gray-600">
                  {multiAIProgress?.currentIndex || 0} of {AI_MODELS.length} models
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-purple-600 to-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${multiAIProgress?.progress || 0}%` }}
                />
              </div>
            </div>

            {/* Individual Model Progress */}
            <div className="space-y-2">
              {AI_MODELS.map((model) => {
                const progress = scanProgress[model.id];
                const isComplete = progress?.status === 'complete';
                const isScanning = progress?.status === 'scanning';
                const isError = progress?.status === 'error';
                
                return (
                  <div key={model.id} className="flex items-center space-x-3">
                    <span className="text-xl">{model.icon}</span>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">{model.name}</span>
                        <span className={`text-xs font-medium ${
                          isComplete ? 'text-green-600' :
                          isScanning ? 'text-blue-600' :
                          isError ? 'text-red-600' : 'text-gray-500'
                        }`}>
                          {isComplete ? '✅ Complete' : 
                           isScanning ? '🔄 Scanning...' :
                           isError ? '❌ Error' : '⏸️ Waiting'}
                        </span>
                      </div>
                      {isScanning && (
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress?.progress || 0}%` }}
                          />
                        </div>
                      )}
                      {isComplete && (
                        <div className="text-xs text-green-600 font-medium">
                          Analysis completed • {model.specialty}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-xs text-gray-600 mt-4 text-center">
              This comprehensive analysis takes 3-5 minutes to complete
            </p>
          </div>
        )}

        {/* Show export options if we have results */}
        {localScanResults.length > 0 && !multiAIScanning && (
          <div className="space-y-4">
            {/* Analysis Type Indicator */}
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
                    {localScanResults[0]?.comprehensiveAuditData 
                      ? '🚀 Using Advanced Comprehensive Audit System with supervisor verification'
                      : '⚡ Using Enhanced Multi-AI Analysis System'
                    }
                  </p>
                  {localScanResults[0]?.comprehensiveAuditData && (
                    <div className="mt-2 text-xs text-green-600">
                      • {localScanResults[0].comprehensiveAuditData.aiModelsUsed?.length || 6} AI models analyzed
                      • Supervisor verification: {localScanResults[0].comprehensiveAuditData.supervisorVerification?.verified ? '✅ Verified' : '⏳ Processing'}
                      • Analysis confidence: {localScanResults[0].comprehensiveAuditData.supervisorVerification?.confidenceLevel || '95%'}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <AuditProExporter 
              scanResults={localScanResults}
              contractInfo={contractInfo}
            />
          </div>
        )}

        {/* Premium Plan Display */}
        {!showMultiAI && (
          <div className="mb-8">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium Multi-AI Security Analysis</h3>
              <p className="text-gray-600">Professional-grade analysis with 6+ specialized AI models</p>
            </div>

            <div className="max-w-lg mx-auto">
              <div className={`relative p-6 rounded-2xl border-2 ${premiumPlan.cardClass} border-current shadow-lg`}>
                {/* Popular Badge */}
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg">
                    ⭐ Professional Grade
                  </span>
                </div>

                {/* Plan Header */}
                <div className="flex items-center justify-between mb-4 mt-2">
                  <div className="flex items-center">
                    <div className="text-3xl mr-3">{premiumPlan.icon}</div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900">{premiumPlan.name}</h4>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-gray-900">{premiumPlan.price}</span>
                        <span className="text-sm text-gray-500">{premiumPlan.priceNote}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${premiumPlan.badgeClass}`}>
                          {premiumPlan.badge}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Models Grid */}
                <div className="mb-4 p-4 bg-white/60 rounded-lg">
                  <h5 className="font-semibold text-gray-900 text-sm mb-3">AI Models Used:</h5>
                  <div className="grid grid-cols-3 gap-2">
                    {AI_MODELS.slice(0, 6).map((model) => (
                      <div key={model.id} className="text-center p-2 bg-purple-50 rounded-lg">
                        <div className="text-xl mb-1">{model.icon}</div>
                        <div className="text-xs font-medium text-gray-700">{model.name.split(' ')[0]}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  <h5 className="font-semibold text-gray-900 text-sm">Premium Features:</h5>
                  <div className="space-y-2">
                    {premiumPlan.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-700">
                        <div className="w-4 h-4 rounded-full bg-purple-100 flex items-center justify-center mr-3 flex-shrink-0">
                          <span className="text-purple-600 text-xs">✓</span>
                        </div>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Estimated Time */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-2">⏱️</span>
                    <span>Analysis time: {premiumPlan.estimatedTime}</span>
                  </div>
                </div>
              </div>

              {/* Free Alternative Notice */}
              <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <div className="text-center">
                  <h4 className="font-semibold text-green-900 mb-2">Looking for a Free Option?</h4>
                  <p className="text-sm text-green-700 mb-3">
                    Try our free basic analysis with open-source AI models
                  </p>
                  <a 
                    href="/audit" 
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-medium rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200"
                  >
                    <span className="mr-2">🔍</span>
                    Try Free Analysis
                  </a>
                </div>
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
                <div className="mt-2">
                  <a 
                    href="/audit" 
                    className="text-sm text-red-600 underline hover:text-red-800"
                  >
                    → Try Free Analysis Instead
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        {!showMultiAI && (
          <>
            <button
              onClick={handleStartAnalysis}
              disabled={isScanning || !contractSource}
              className={`w-full py-4 px-6 rounded-xl text-white font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                premiumPlan.buttonClass
              }`}
            >
              {isScanning ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                  Running Multi-AI Analysis...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <span className="text-xl mr-3">{premiumPlan.icon}</span>
                  {premiumPlan.buttonText}
                </div>
              )}
            </button>

            {!contractSource && (
              <p className="text-center text-sm text-gray-500 mt-3">
                Please load a contract first to start the analysis
              </p>
            )}
          </>
        )}

        {/* Results Summary */}
        {result && result.analysis?.aiReportCards && (
          <div className="mt-8 p-6 bg-purple-50 border border-purple-200 rounded-xl">
            <h4 className="font-semibold text-purple-900 mb-4 flex items-center">
              <span className="text-purple-600 mr-2">✅</span>
              Multi-AI Analysis Complete
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">AI Models Used</p>
                <p className="font-semibold text-2xl text-gray-900">
                  {result.analysis.aiReportCards.length}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Overall Score</p>
                <p className="font-semibold text-2xl text-gray-900">
                  {result.analysis?.securityScore || 'N/A'}
                  {result.analysis?.securityScore && '/100'}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Risk Level</p>
                <p className={`font-semibold ${
                  result.analysis?.riskLevel === 'Low Risk' ? 'text-green-600' :
                  result.analysis?.riskLevel === 'Medium Risk' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {result.analysis?.riskLevel || 'Unknown'}
                </p>
              </div>
            </div>

            {result.analysis?.supervisorSummary?.executiveSummary && (
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Supervisor Summary</p>
                <p className="text-gray-900">{result.analysis.supervisorSummary.executiveSummary}</p>
              </div>
            )}
            
            {/* Analysis Type and Quality Indicator */}
            <div className="bg-white p-4 rounded-lg mt-4">
              <p className="text-sm text-gray-600 mb-2">Analysis Quality</p>
              <div className="flex items-center space-x-2">
                {result.comprehensiveAuditData ? (
                  <>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                      🚀 COMPREHENSIVE AUDIT
                    </span>
                    <span className="text-xs text-gray-600">
                      Supervisor verified • {result.comprehensiveAuditData.supervisorVerification?.confidenceLevel || '95%'} confidence
                    </span>
                  </>
                ) : (
                  <>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                      ⚡ ENHANCED MULTI-AI
                    </span>
                    <span className="text-xs text-gray-600">
                      Multiple AI models • Enhanced analysis
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
