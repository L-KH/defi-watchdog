// src/components/audit/AIScanCard.js
import { useState } from 'react';

export default function AIScanCard({ 
  isScanning, 
  onScan, 
  error, 
  result 
}) {
  const [aiModel, setAiModel] = useState('deepseek');
  const [analysisType, setAnalysisType] = useState('comprehensive');

  const aiModels = {
    deepseek: {
      name: 'DeepSeek Coder',
      description: 'Advanced AI model specialized in code analysis',
      features: ['Logic Analysis', 'Pattern Recognition', 'Risk Assessment'],
      color: 'bg-purple-50 border-purple-200 text-purple-800'
    },
    openai: {
      name: 'OpenAI GPT-4',
      description: 'General-purpose AI with security knowledge',
      features: ['Code Review', 'Vulnerability Detection', 'Best Practices'],
      color: 'bg-green-50 border-green-200 text-green-800'
    }
  };

  const analysisTypes = {
    quick: {
      name: 'Quick Analysis',
      description: 'Basic security assessment',
      duration: '10-30 seconds',
      focus: 'Common vulnerabilities and basic patterns'
    },
    comprehensive: {
      name: 'Comprehensive Analysis',
      description: 'Detailed security review',
      duration: '1-2 minutes',
      focus: 'Logic flaws, edge cases, and complex vulnerabilities'
    },
    custom: {
      name: 'Custom Focus',
      description: 'Targeted analysis',
      duration: '30-60 seconds',
      focus: 'Specific vulnerability types or contract functions'
    }
  };

  const handleScan = () => {
    const scanOptions = {
      model: aiModel,
      type: analysisType,
      timeout: analysisType === 'comprehensive' ? 120000 : 60000
    };
    
    onScan(scanOptions);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6">
        <div className="flex items-center mb-2">
          <span className="text-2xl mr-3">🤖</span>
          <h2 className="text-xl font-bold">AI-Powered Security Analysis</h2>
        </div>
        <p className="text-purple-100">
          Advanced AI models for deep contract logic analysis and vulnerability detection
        </p>
      </div>

      <div className="p-6">
        {/* AI Model Selection */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">AI Model</h3>
          <div className="space-y-3">
            {Object.entries(aiModels).map(([model, config]) => (
              <label key={model} className="block">
                <input
                  type="radio"
                  name="aiModel"
                  value={model}
                  checked={aiModel === model}
                  onChange={(e) => setAiModel(e.target.value)}
                  className="sr-only"
                />
                <div className={`p-3 rounded-md border-2 cursor-pointer transition-all ${ 
                  aiModel === model 
                    ? config.color 
                    : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{config.name}</h4>
                    <span className={`text-xs px-2 py-1 rounded ${ 
                      model === 'deepseek' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {model === 'deepseek' ? 'Recommended' : 'Alternative'}
                    </span>
                  </div>
                  <p className="text-sm opacity-75 mb-2">{config.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {config.features.map(feature => (
                      <span key={feature} className="text-xs px-2 py-1 bg-white rounded">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Analysis Type Selection */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Analysis Type</h3>
          <div className="space-y-2">
            {Object.entries(analysisTypes).map(([type, config]) => (
              <label key={type} className="flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="analysisType"
                  value={type}
                  checked={analysisType === type}
                  onChange={(e) => setAnalysisType(e.target.value)}
                  className="mr-3"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">{config.name}</h4>
                    <span className="text-xs text-gray-500">{config.duration}</span>
                  </div>
                  <p className="text-sm text-gray-600">{config.description}</p>
                  <p className="text-xs text-gray-500 mt-1">Focus: {config.focus}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* AI Analysis Features */}
        <div className="mb-6 p-4 bg-blue-50 rounded-md">
          <h4 className="font-medium text-blue-900 mb-2">🔍 AI Analysis Features</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Logic flow analysis and edge case detection</li>
            <li>• Business logic vulnerabilities identification</li>
            <li>• Gas optimization opportunities</li>
            <li>• Security best practices assessment</li>
            <li>• Custom vulnerability pattern recognition</li>
          </ul>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
            <p className="font-medium">Analysis Failed</p>
            <p className="text-sm">{error}</p>
            {error.includes('API key') && (
              <div className="mt-2 text-xs">
                <p><strong>Solution:</strong> Add your DeepSeek API key to .env.local:</p>
                <code className="bg-red-100 px-1 rounded">DEEPSEEK_API_KEY=your_key_here</code>
              </div>
            )}
          </div>
        )}

        {/* Scan Button */}
        <button
          onClick={handleScan}
          disabled={isScanning}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200"
        >
          {isScanning ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              AI Analyzing with {aiModels[aiModel].name}...
            </div>
          ) : (
            `Start ${analysisTypes[analysisType].name}`
          )}
        </button>

        {/* Results Summary */}
        {result && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <h4 className="font-medium text-gray-900 mb-2">AI Analysis Complete</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Model Used</p>
                <p className="font-medium">{aiModels[aiModel]?.name || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-gray-600">Analysis Type</p>
                <p className="font-medium">{analysisTypes[analysisType]?.name || 'Unknown'}</p>
              </div>
            </div>
            {result.summary && (
              <div className="mt-3 p-3 bg-white rounded border">
                <p className="text-xs text-gray-500 mb-1">Summary</p>
                <p className="text-sm">{result.summary}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
