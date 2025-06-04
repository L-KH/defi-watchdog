// AI Analysis Progress Tracker Component
'use client';
import { useState, useEffect } from 'react';

export default function AIProgressTracker({ 
  isScanning, 
  selectedPlan, 
  onProgressUpdate 
}) {
  const [modelProgress, setModelProgress] = useState({});
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Model configurations based on the plan
  const modelConfigs = {
    free: [
      { id: 'google/gemma-2b-it', name: 'Google Gemma 2B', icon: '🤖', specialty: 'Security Analysis' }
    ],
    premium: [
      { id: 'google/gemma-2b-it', name: 'Google Gemma 2B', icon: '🤖', specialty: 'Security Focus' },
      { id: 'deepseek/deepseek-chat-v3-0324:free', name: 'DeepSeek Chat V3', icon: '🧠', specialty: 'Vulnerability Detection' },
      { id: 'deepseek/deepseek-r1:free', name: 'DeepSeek R1', icon: '🔍', specialty: 'Code Analysis' },
      { id: 'google/gemini-2.0-flash-001', name: 'Google Gemini Flash', icon: '⚡', specialty: 'Gas Optimization' }
    ]
  };

  const currentModels = modelConfigs[selectedPlan] || modelConfigs.free;

  // Initialize progress tracking when scanning starts
  useEffect(() => {
    if (isScanning && !startTime) {
      setStartTime(Date.now());
      const initialProgress = {};
      currentModels.forEach(model => {
        initialProgress[model.id] = {
          status: 'waiting', // waiting, scanning, completed, failed
          startTime: null,
          endTime: null,
          error: null,
          result: null
        };
      });
      setModelProgress(initialProgress);
    } else if (!isScanning) {
      setStartTime(null);
      setElapsedTime(0);
    }
  }, [isScanning, startTime, currentModels]);

  // Update elapsed time
  useEffect(() => {
    let interval;
    if (isScanning && startTime) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isScanning, startTime]);

  // Public method for external components to update progress
  const updateModelProgress = (modelId, status, data = {}) => {
    setModelProgress(prev => ({
      ...prev,
      [modelId]: {
        ...prev[modelId],
        status,
        ...(status === 'scanning' && { startTime: Date.now() }),
        ...(status === 'completed' && { endTime: Date.now(), result: data.result }),
        ...(status === 'failed' && { endTime: Date.now(), error: data.error }),
        ...data
      }
    }));

    // Notify parent component
    if (onProgressUpdate) {
      onProgressUpdate(modelId, status, data);
    }
  };

  // Expose the update function globally so the AI analysis can call it
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.updateAIProgress = updateModelProgress;
    }
    return () => {
      if (typeof window !== 'undefined') {
        delete window.updateAIProgress;
      }
    };
  }, []);

  const formatTime = (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000);
    const ms = Math.floor((milliseconds % 1000) / 100);
    return `${seconds}.${ms}s`;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'waiting': return '⏳';
      case 'scanning': return '🔄';
      case 'completed': return '✅';
      case 'failed': return '❌';
      default: return '⏳';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'waiting': return 'text-gray-500 bg-gray-100';
      case 'scanning': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  const getProgressPercentage = () => {
    if (!isScanning) return 0;
    const completed = Object.values(modelProgress).filter(p => 
      p.status === 'completed' || p.status === 'failed'
    ).length;
    return Math.round((completed / currentModels.length) * 100);
  };

  const getCompletedCount = () => {
    return Object.values(modelProgress).filter(p => p.status === 'completed').length;
  };

  const getFailedCount = () => {
    return Object.values(modelProgress).filter(p => p.status === 'failed').length;
  };

  if (!isScanning && Object.keys(modelProgress).length === 0) {
    return null; // Don't show if not scanning and no progress to show
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center mr-3">
              <span className="text-lg">🤖</span>
            </div>
            <div>
              <h3 className="font-semibold text-lg">AI Analysis Progress</h3>
              <p className="text-indigo-100 text-sm">
                {selectedPlan === 'premium' ? 'Premium' : 'Free'} • {currentModels.length} AI Model{currentModels.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{getProgressPercentage()}%</div>
            <div className="text-indigo-200 text-sm">
              {isScanning ? formatTime(elapsedTime) : 'Complete'}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="bg-white/20 rounded-full h-2">
            <div 
              className="bg-white rounded-full h-2 transition-all duration-300 ease-out"
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Model Progress List */}
      <div className="p-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-lg font-bold text-blue-600">{currentModels.length}</div>
            <div className="text-xs text-blue-600">Total Models</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-lg font-bold text-green-600">{getCompletedCount()}</div>
            <div className="text-xs text-green-600">Completed</div>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="text-lg font-bold text-red-600">{getFailedCount()}</div>
            <div className="text-xs text-red-600">Failed</div>
          </div>
        </div>

        {/* Individual Model Progress */}
        <div className="space-y-3">
          {currentModels.map((model, index) => {
            const progress = modelProgress[model.id] || { status: 'waiting' };
            const isScanning = progress.status === 'scanning';
            
            return (
              <div 
                key={model.id} 
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  progress.status === 'completed' ? 'border-green-200 bg-green-50' :
                  progress.status === 'failed' ? 'border-red-200 bg-red-50' :
                  progress.status === 'scanning' ? 'border-blue-200 bg-blue-50' :
                  'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {/* Model Icon */}
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getStatusColor(progress.status)}`}>
                      {isScanning ? (
                        <div className="animate-spin text-lg">🔄</div>
                      ) : (
                        <span className="text-lg">{model.icon}</span>
                      )}
                    </div>
                    
                    {/* Model Info */}
                    <div>
                      <div className="font-semibold text-gray-900">{model.name}</div>
                      <div className="text-sm text-gray-600">{model.specialty}</div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center space-x-3">
                    {/* Timing */}
                    <div className="text-right">
                      {progress.startTime && progress.endTime && (
                        <div className="text-sm font-medium text-gray-900">
                          {formatTime(progress.endTime - progress.startTime)}
                        </div>
                      )}
                      {progress.startTime && !progress.endTime && (
                        <div className="text-sm font-medium text-blue-600">
                          {formatTime(Date.now() - progress.startTime)}
                        </div>
                      )}
                      <div className="text-xs text-gray-500 capitalize">{progress.status}</div>
                    </div>

                    {/* Status Icon */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(progress.status)}`}>
                      <span className="text-lg">{getStatusIcon(progress.status)}</span>
                    </div>
                  </div>
                </div>

                {/* Error Display */}
                {progress.status === 'failed' && progress.error && (
                  <div className="mt-3 p-3 bg-red-100 border border-red-200 rounded-lg">
                    <div className="text-sm text-red-700">
                      <span className="font-medium">Error:</span> {progress.error}
                    </div>
                  </div>
                )}

                {/* Success Details */}
                {progress.status === 'completed' && progress.result && (
                  <div className="mt-3 p-3 bg-green-100 border border-green-200 rounded-lg">
                    <div className="text-sm text-green-700">
                      <span className="font-medium">✓ Analysis complete</span>
                      {progress.result.securityScore && (
                        <span className="ml-2">• Score: {progress.result.securityScore}/100</span>
                      )}
                      {progress.result.keyFindings && (
                        <span className="ml-2">• {progress.result.keyFindings.length} findings</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Overall Status */}
        {isScanning && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-center text-blue-700">
              <div className="animate-pulse mr-2">🔄</div>
              <span className="font-medium">
                Analysis in progress... {getCompletedCount()}/{currentModels.length} models completed
              </span>
            </div>
          </div>
        )}

        {!isScanning && getProgressPercentage() > 0 && (
          <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="text-center text-gray-700">
              <div className="font-medium">Analysis Complete</div>
              <div className="text-sm mt-1">
                {getCompletedCount()} successful • {getFailedCount()} failed • Total time: {formatTime(elapsedTime)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Export the component and a utility function
export { AIProgressTracker as default };

// Utility function to update progress from external components
export const updateAIProgress = (modelId, status, data = {}) => {
  if (typeof window !== 'undefined' && window.updateAIProgress) {
    window.updateAIProgress(modelId, status, data);
  }
};