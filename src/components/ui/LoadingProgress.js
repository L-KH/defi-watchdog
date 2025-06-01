// src/components/ui/LoadingProgress.js
import { useState, useEffect } from 'react';

export default function LoadingProgress({ 
  isActive, 
  duration = 15000, 
  mode = 'balanced',
  message = 'Processing...' 
}) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = {
    fast: [
      'Initializing scan...',
      'Pattern matching...',
      'Generating report...'
    ],
    balanced: [
      'Initializing security analysis...',
      'Parsing contract code...',
      'Pattern matching...',
      'Static analysis...',
      'Generating report...'
    ],
    deep: [
      'Initializing security analysis...',
      'Parsing contract source...',
      'Running pattern matching...',
      'Static code analysis...',
      'Flow analysis...',
      'Vulnerability detection...',
      'Generating detailed report...'
    ],
    comprehensive: [
      'Initializing comprehensive scan...',
      'Parsing contract source...',
      'Pattern matching analysis...',
      'Static code analysis...',
      'Data flow analysis...',
      'Semantic analysis...',
      'Cross-referencing vulnerabilities...',
      'Generating comprehensive report...'
    ]
  };

  const currentSteps = steps[mode] || steps.balanced;

  useEffect(() => {
    if (!isActive) {
      setProgress(0);
      setCurrentStep(0);
      return;
    }

    const stepDuration = duration / currentSteps.length;
    const updateInterval = 100; // Update every 100ms for smooth progress
    const progressIncrement = (100 / currentSteps.length) / (stepDuration / updateInterval);

    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + progressIncrement;
        
        // Update current step based on progress
        const newStep = Math.min(
          Math.floor((newProgress / 100) * currentSteps.length),
          currentSteps.length - 1
        );
        setCurrentStep(newStep);
        
        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        
        return newProgress;
      });
    }, updateInterval);

    return () => clearInterval(interval);
  }, [isActive, duration, currentSteps.length]);

  if (!isActive) return null;

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>{mode.charAt(0).toUpperCase() + mode.slice(1)} Scan</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Current Step */}
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">
            {currentSteps[currentStep]}
          </p>
          <p className="text-xs text-gray-500">
            Step {currentStep + 1} of {currentSteps.length}
          </p>
        </div>
      </div>

      {/* Tools Being Used */}
      <div className="mt-4 p-3 bg-gray-50 rounded-md">
        <p className="text-xs font-medium text-gray-700 mb-2">Tools Active:</p>
        <div className="flex flex-wrap gap-1">
          {getToolsForMode(mode).map((tool) => (
            <span
              key={tool}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
              {getToolIcon(tool)} {tool.replace('_', ' ')}
            </span>
          ))}
        </div>
      </div>

      {/* Estimated Time */}
      <div className="mt-3 text-center">
        <p className="text-xs text-gray-500">
          Estimated time: {Math.ceil(duration / 1000)}s
        </p>
      </div>
    </div>
  );
}

// Helper functions
function getToolsForMode(mode) {
  switch(mode) {
    case 'fast':
      return ['pattern_matcher'];
    case 'balanced':
      return ['pattern_matcher', 'static_analyzer'];
    case 'deep':
      return ['pattern_matcher', 'static_analyzer', 'flow_analyzer'];
    case 'comprehensive':
      return ['pattern_matcher', 'static_analyzer', 'flow_analyzer', 'semantic_analyzer'];
    default:
      return ['pattern_matcher'];
  }
}

function getToolIcon(toolName) {
  const icons = {
    pattern_matcher: '🔍',
    static_analyzer: '🔧',
    flow_analyzer: '🌊',
    semantic_analyzer: '🧠'
  };
  return icons[toolName] || '🔧';
}
