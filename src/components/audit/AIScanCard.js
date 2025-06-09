// Modern Free vs Premium AI Security Analysis Card
'use client';
import { useState } from 'react';

export default function AIScanCard({ 
  isScanning, 
  onScan, 
  error, 
  result 
}) {
  const [selectedPlan, setSelectedPlan] = useState('free');
  const [promptMode, setPromptMode] = useState('normal');
  const [customPrompt, setCustomPrompt] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Analysis plans configuration
  const analysisPlans = {
    free: {
      name: 'Free Security Scan',
      icon: '🔍',
      price: 'Free',
      description: 'Essential security analysis with open-source AI models',
      features: [
        'Basic vulnerability detection',
        'Core security patterns',
        'DeepSeek & Qwen AI models',
        'Simple report format',
        'Community support'
      ],
      limitations: [
        'Basic analysis only',
        'Limited AI models',
        'Standard reporting'
      ],
      estimatedTime: '30-60 seconds',
      buttonText: 'Start Free Scan',
      buttonClass: 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800',
      cardClass: 'border-green-200 bg-green-50',
      badge: 'FREE',
      badgeClass: 'bg-green-100 text-green-700'
    },
    premium: {
      name: 'Premium Security Audit',
      icon: '🚀',
      price: '$10',
      priceNote: 'per analysis',
      description: 'Professional-grade analysis with advanced AI models and comprehensive reporting',
      features: [
        'Advanced vulnerability detection',
        'Multiple premium AI models (GPT-4, Claude, Gemini)',
        'Gas optimization analysis',
        'Code quality assessment',
        'Professional audit report',
        'CVSS security scoring',
        'Detailed remediation guides',
        'Export to PDF/HTML/JSON',
        'Priority support'
      ],
      estimatedTime: '2-4 minutes',
      buttonText: 'Connect Wallet & Analyze',
      buttonClass: 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700',
      cardClass: 'border-purple-200 bg-purple-50',
      badge: 'PREMIUM',
      badgeClass: 'bg-purple-100 text-purple-700',
      popular: true
    }
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

  const handleStartAnalysis = () => {
    const plan = analysisPlans[selectedPlan];
    
    const scanOptions = {
      type: selectedPlan === 'premium' ? 'premium' : 'basic',
      plan: selectedPlan,
      promptMode: promptMode,
      customPrompt: promptMode === 'custom' ? customPrompt : null,
      timeout: selectedPlan === 'premium' ? 240000 : 60000
    };

    onScan(scanOptions);
  };

  const getCurrentPlan = () => analysisPlans[selectedPlan];

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 text-white p-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center mr-4">
              <span className="text-2xl">🤖</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold">AI Security Analysis</h2>
              <p className="text-indigo-100 text-sm">Powered by advanced AI models</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-indigo-200">Trusted by</div>
            <div className="text-xl font-bold">10,000+</div>
            <div className="text-sm text-indigo-200">developers</div>
          </div>
        </div>
        <p className="text-indigo-100 leading-relaxed">
          Choose your analysis tier for comprehensive smart contract security assessment. 
          Our AI models detect vulnerabilities, optimize gas usage, and ensure code quality.
        </p>
      </div>

      <div className="p-8">
        {/* Plan Selection */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Analysis</h3>
            <p className="text-gray-600">Select the plan that fits your security needs</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Object.entries(analysisPlans).map(([planKey, plan]) => {
              const isSelected = selectedPlan === planKey;
              const cardClasses = `relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
                isSelected
                  ? `${plan.cardClass} border-current shadow-lg scale-105`
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`;

              return (
                <div
                  key={planKey}
                  onClick={() => setSelectedPlan(planKey)}
                  className={cardClasses}
                >
                  {/* Popular Badge */}
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg">
                        ⭐ Most Popular
                      </span>
                    </div>
                  )}

                  {/* Plan Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="text-3xl mr-3">{plan.icon}</div>
                      <div>
                        <h4 className="text-xl font-bold text-gray-900">{plan.name}</h4>
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold text-gray-900">{plan.price}</span>
                          {plan.priceNote && (
                            <span className="text-sm text-gray-500">{plan.priceNote}</span>
                          )}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${plan.badgeClass}`}>
                            {plan.badge}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Selection Indicator */}
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      isSelected 
                        ? 'border-purple-600 bg-purple-600' 
                        : 'border-gray-300'
                    }`}>
                      {isSelected && (
                        <div className="w-3 h-3 rounded-full bg-white"></div>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">{plan.description}</p>

                  {/* Features */}
                  <div className="space-y-3">
                    <h5 className="font-semibold text-gray-900 text-sm">Includes:</h5>
                    <div className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-700">
                          <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                            <span className="text-green-600 text-xs">✓</span>
                          </div>
                          {feature}
                        </div>
                      ))}
                    </div>
                    
                    {/* Limitations for free plan */}
                    {plan.limitations && (
                      <div className="pt-2 mt-4 border-t border-gray-200">
                        <h5 className="font-semibold text-gray-700 text-sm mb-2">Limitations:</h5>
                        <div className="space-y-1">
                          {plan.limitations.map((limitation, index) => (
                            <div key={index} className="flex items-center text-sm text-gray-500">
                              <div className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center mr-3 flex-shrink-0">
                                <span className="text-gray-400 text-xs">×</span>
                              </div>
                              {limitation}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Estimated Time */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">⏱️</span>
                      <span>Analysis time: {plan.estimatedTime}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Advanced Options */}
        <div className="mb-6">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center text-gray-700 hover:text-gray-900 transition-colors"
          >
            <span className="mr-2">⚙️</span>
            <span className="font-medium">Advanced Options</span>
            <span className={`ml-2 transform transition-transform ${
              showAdvanced ? 'rotate-180' : ''
            }`}>▼</span>
          </button>

          {showAdvanced && (
            <div className="mt-4 p-6 bg-gray-50 rounded-xl border border-gray-200">
              {/* Analysis Mode */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Analysis Mode</h4>
                <div className="grid grid-cols-3 gap-3">
                  {Object.entries(promptModes).map(([mode, config]) => (
                    <button
                      key={mode}
                      onClick={() => setPromptMode(mode)}
                      className={`p-4 rounded-lg border-2 text-center transition-all ${
                        promptMode === mode
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
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
                    placeholder="Describe what you want the AI to focus on... e.g., 'Focus on flash loan vulnerabilities and reentrancy attacks'..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    💡 Tip: Be specific about what vulnerabilities or aspects you want analyzed
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Analysis Preview */}
        <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            {getCurrentPlan().icon}
            <span className="ml-2">Selected: {getCurrentPlan().name}</span>
          </h4>
          <div className="text-sm text-gray-700">
            {selectedPlan === 'free' ? (
              <div>
                <p className="mb-3">🎯 <strong>Quick & Free:</strong> Essential security check with open-source AI models</p>
                <div className="bg-white/60 backdrop-blur rounded-lg p-4">
                  <h5 className="font-medium mb-2">What you'll get:</h5>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Basic vulnerability scan</li>
                    <li>• Common security patterns check</li>
                    <li>• Simple findings report</li>
                    <li>• Perfect for initial assessment</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div>
                <p className="mb-3">🚀 <strong>Professional Grade:</strong> Comprehensive analysis with premium AI models</p>
                <div className="bg-white/60 backdrop-blur rounded-lg p-4">
                  <h5 className="font-medium mb-2">What you'll get:</h5>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Advanced AI models (GPT-4, Claude, Gemini)</li>
                    <li>• Detailed vulnerability analysis with CVSS scores</li>
                    <li>• Gas optimization recommendations</li>
                    <li>• Code quality improvements</li>
                    <li>• Professional audit report (PDF/HTML export)</li>
                    <li>• Ready for production deployment</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mode-specific Warnings */}
        {promptMode === 'aggressive' && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg">
            <div className="flex items-center">
              <span className="mr-2">⚡</span>
              <div>
                <p className="font-medium">Aggressive Mode Active</p>
                <p className="text-sm mt-1">
                  This mode uses penetration testing techniques and may find theoretical vulnerabilities.
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
            getCurrentPlan().buttonClass
          }`}
        >
          {isScanning ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
              {selectedPlan === 'premium' ? 'Running Premium Analysis...' : 'Running Free Analysis...'}
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <span className="text-xl mr-3">{getCurrentPlan().icon}</span>
              {getCurrentPlan().buttonText}
            </div>
          )}
        </button>

        {selectedPlan === 'premium' && (
          <p className="text-center text-sm text-gray-500 mt-3">
            💳 Secure payment via MetaMask • Cancel anytime • 30-day guarantee
          </p>
        )}

        {/* Results Summary */}
        {result && (
          <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-xl">
            <h4 className="font-semibold text-green-900 mb-4 flex items-center">
              <span className="text-green-600 mr-2">✅</span>
              Analysis Complete
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Analysis Type</p>
                <p className="font-semibold text-gray-900">
                  {result.plan === 'premium' ? 'Premium Analysis' : 'Free Analysis'}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Security Score</p>
                <p className="font-semibold text-2xl text-gray-900">
                  {result.analysis?.securityScore || result.analysis?.overallScore || 'N/A'}
                  {(result.analysis?.securityScore || result.analysis?.overallScore) && '/100'}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Risk Level</p>
                <p className={`font-semibold ${
                  result.analysis?.riskLevel === 'Safe' ? 'text-green-600' :
                  result.analysis?.riskLevel === 'Low Risk' ? 'text-blue-600' :
                  result.analysis?.riskLevel === 'Medium Risk' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {result.analysis?.riskLevel || 'Unknown'}
                </p>
              </div>
            </div>

            {result.analysis?.summary && (
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Summary</p>
                <p className="text-gray-900">{result.analysis.summary}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
