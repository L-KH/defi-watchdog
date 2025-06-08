// Real-time AI Analysis Progress Component
'use client';
import { useState, useEffect } from 'react';

export default function AIAnalysisProgress({ 
  isAnalyzing, 
  analysisType, 
  onComplete, 
  sourceCode, 
  contractName, 
  analysisOptions 
}) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [modelProgress, setModelProgress] = useState([]);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [estimatedTotal, setEstimatedTotal] = useState(0);

  // Analysis steps for different types
  const analysisSteps = {
    premium: [
      { name: 'Initializing Multi-AI Analysis', duration: 5 },
      { name: 'Gemma 2 9B - Security Analysis', duration: 45 },
      { name: 'Mistral 7B - Code Review', duration: 30 },
      { name: 'Phi-3 - Gas Optimization', duration: 25 },
      { name: 'Synthesizing Results', duration: 10 },
      { name: 'Generating Report', duration: 5 }
    ],
    basic: [
      { name: 'Initializing AI Analysis', duration: 3 },
      { name: 'Gemma 2 9B - Security Scan', duration: 30 },
      { name: 'Processing Results', duration: 5 },
      { name: 'Generating Report', duration: 2 }
    ]
  };

  const steps = analysisSteps[analysisType] || analysisSteps.basic;
  const totalDuration = steps.reduce((sum, step) => sum + step.duration, 0);

  useEffect(() => {
    if (!isAnalyzing) {
      setProgress(0);
      setCurrentStep('');
      setModelProgress([]);
      setTimeElapsed(0);
      return;
    }

    setEstimatedTotal(totalDuration);
    
    // Simulate realistic progress
    const interval = setInterval(() => {
      setTimeElapsed(prev => {
        const newTime = prev + 1;
        
        // Calculate which step we should be on
        let accumulatedTime = 0;
        let currentStepIndex = 0;
        
        for (let i = 0; i < steps.length; i++) {
          if (newTime <= accumulatedTime + steps[i].duration) {
            currentStepIndex = i;
            break;
          }
          accumulatedTime += steps[i].duration;
        }
        
        const currentStepInfo = steps[currentStepIndex];
        setCurrentStep(currentStepInfo?.name || 'Completing Analysis...');
        
        // Update progress
        const newProgress = Math.min(95, (newTime / totalDuration) * 100);
        setProgress(newProgress);
        
        // Update model progress for premium analysis
        if (analysisType === 'premium') {
          const modelUpdates = [];
          
          if (newTime >= 5) {
            modelUpdates.push({
              name: 'Gemma 2 9B',
              status: newTime >= 50 ? 'completed' : 'running',
              progress: newTime >= 50 ? 100 : Math.min(100, ((newTime - 5) / 45) * 100),
              specialty: 'Security vulnerabilities'
            });
          }
          
          if (newTime >= 50) {
            modelUpdates.push({
              name: 'Mistral 7B',
              status: newTime >= 80 ? 'completed' : 'running',
              progress: newTime >= 80 ? 100 : Math.min(100, ((newTime - 50) / 30) * 100),
              specialty: 'Code analysis'
            });
          }
          
          if (newTime >= 80) {
            modelUpdates.push({
              name: 'Phi-3 Medium',
              status: newTime >= 105 ? 'completed' : 'running',
              progress: newTime >= 105 ? 100 : Math.min(100, ((newTime - 80) / 25) * 100),
              specialty: 'Gas optimization'
            });
          }
          
          setModelProgress(modelUpdates);
        }
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isAnalyzing, analysisType, totalDuration]);

  // Reset when analysis completes
  useEffect(() => {
    if (!isAnalyzing && timeElapsed > 0) {
      // Show completion for a moment
      setProgress(100);
      setCurrentStep('Analysis Complete!');
      
      setTimeout(() => {
        setProgress(0);
        setCurrentStep('');
        setModelProgress([]);
        setTimeElapsed(0);
      }, 2000);
    }
  }, [isAnalyzing, timeElapsed]);

  if (!isAnalyzing && timeElapsed === 0) {
    return null;
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className=\"bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6 mb-6\">
      {/* Header */}
      <div className=\"flex items-center justify-between mb-6\">
        <div className=\"flex items-center\">
          <div className=\"animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3\"></div>
          <div>
            <h3 className=\"text-lg font-semibold text-blue-900\">
              {analysisType === 'premium' ? '🚀 Multi-AI Security Analysis' : '🤖 AI Security Analysis'}
            </h3>
            <p className=\"text-sm text-blue-700\">Analyzing {contractName}</p>
          </div>
        </div>
        <div className=\"text-right\">
          <div className=\"text-2xl font-bold text-blue-800\">{Math.round(progress)}%</div>
          <div className=\"text-sm text-blue-600\">{formatTime(timeElapsed)} / ~{formatTime(estimatedTotal)}</div>
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div className=\"mb-6\">
        <div className=\"flex items-center justify-between mb-2\">
          <span className=\"text-sm font-medium text-blue-800\">Overall Progress</span>
          <span className=\"text-sm text-blue-600\">{currentStep}</span>
        </div>
        <div className=\"w-full bg-blue-100 rounded-full h-3\">
          <div 
            className=\"bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-1000 ease-out\"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Model Progress (Premium Only) */}
      {analysisType === 'premium' && modelProgress.length > 0 && (
        <div className=\"space-y-4\">
          <h4 className=\"font-medium text-blue-900 mb-3\">AI Model Progress</h4>
          {modelProgress.map((model, index) => (
            <div key={index} className=\"bg-white rounded-lg p-4 border border-blue-100\">
              <div className=\"flex items-center justify-between mb-2\">
                <div className=\"flex items-center\">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    model.status === 'completed' ? 'bg-green-500' : 
                    model.status === 'running' ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'
                  }`}></div>
                  <span className=\"font-medium text-gray-900\">{model.name}</span>
                  <span className=\"ml-2 text-sm text-gray-600\">• {model.specialty}</span>
                </div>
                <div className=\"flex items-center\">
                  {model.status === 'completed' && (
                    <span className=\"text-green-600 text-sm font-medium mr-2\">✓ Complete</span>
                  )}
                  <span className=\"text-sm font-medium text-gray-700\">{Math.round(model.progress)}%</span>
                </div>
              </div>
              <div className=\"w-full bg-gray-100 rounded-full h-2\">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    model.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${model.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Analysis Steps */}
      <div className=\"mt-6 bg-white rounded-lg p-4 border border-blue-100\">
        <h4 className=\"font-medium text-blue-900 mb-3\">Analysis Steps</h4>
        <div className=\"space-y-2\">
          {steps.map((step, index) => {
            let stepTime = 0;
            for (let i = 0; i < index; i++) {
              stepTime += steps[i].duration;
            }
            
            const isActive = timeElapsed >= stepTime && timeElapsed < stepTime + step.duration;
            const isCompleted = timeElapsed >= stepTime + step.duration;
            
            return (
              <div key={index} className={`flex items-center text-sm ${
                isActive ? 'text-blue-700 font-medium' : 
                isCompleted ? 'text-green-600' : 'text-gray-500'
              }`}>
                <div className={`w-2 h-2 rounded-full mr-3 ${
                  isActive ? 'bg-blue-500 animate-pulse' : 
                  isCompleted ? 'bg-green-500' : 'bg-gray-300'
                }`}></div>
                {step.name}
                {isCompleted && <span className=\"ml-2\">✓</span>}
                {isActive && (
                  <div className=\"ml-auto flex items-center\">
                    <div className=\"animate-spin rounded-full h-3 w-3 border-b border-blue-600\"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Tips */}
      <div className=\"mt-4 p-3 bg-blue-100 rounded-lg\">
        <div className=\"text-sm text-blue-800\">
          <strong>💡 Did you know?</strong> {
            analysisType === 'premium' 
              ? 'Premium analysis uses multiple AI models for comprehensive security coverage and consensus validation.'
              : 'Our AI analysis examines over 50 common vulnerability patterns and provides actionable recommendations.'
          }
        </div>
      </div>
    </div>
  );
}
