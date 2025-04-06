// src/components/ClientAuditAnalyzer.js
import React, { useState, useEffect } from 'react';
import { analyzeContractClientSide } from '../lib/client-analyzer';

export function ClientAuditAnalyzer({ address, network, onAnalysisComplete }) {
  const [analysisState, setAnalysisState] = useState({
    isLoading: true,
    step: 'Initializing analysis...',
    progress: 0,
    error: null,
    preliminaryResults: null,
    result: null
  });
  
  // Auto-start analysis when component mounts
  useEffect(() => {
    if (address && network) {
      startAnalysis();
    }
  }, [address, network]);

  const startAnalysis = async () => {
    setAnalysisState({
      isLoading: true,
      step: 'Initializing analysis...',
      progress: 0,
      error: null,
      preliminaryResults: null,
      result: null
    });

    try {
      const result = await analyzeContractClientSide(address, network, {
        updateCallback: (state) => setAnalysisState(prev => ({ ...prev, ...state }))
      });
      
      if (onAnalysisComplete) {
        onAnalysisComplete(result);
      }
    } catch (error) {
      setAnalysisState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message
      }));
    }
  };

  const resetApiKey = () => {
    localStorage.removeItem('deepseek_api_key');
    alert('Deep Analysis API key has been reset. You will be prompted for a new key when you start the analysis.');
  };

  const renderSeverityIndicator = (severity) => {
    const severityColors = {
      CRITICAL: 'crimson',
      HIGH: 'red',
      MEDIUM: 'orange',
      LOW: 'gold',
      INFO: 'green'
    };
    
    return (
      <span 
        style={{ 
          backgroundColor: severityColors[severity] || 'gray',
          color: 'white',
          padding: '3px 6px',
          borderRadius: '4px',
          fontSize: '0.8rem',
          fontWeight: 'bold'
        }}
      >
        {severity}
      </span>
    );
  };

  const renderPreliminaryFindings = () => {
    if (!analysisState.preliminaryResults || !analysisState.preliminaryResults.risks) {
      return null;
    }
    
    return (
      <div className="preliminary-findings">
        <h4>Initial Static Analysis Findings</h4>
        <p className="text-muted">These initial findings are being verified with Deep Analysis AI...</p>
        <ul className="list-group">
          {analysisState.preliminaryResults.risks.map((risk, index) => (
            <li key={index} className="list-group-item">
              {renderSeverityIndicator(risk.severity)} {risk.title}
              <p className="mt-1 mb-0">{risk.description}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="client-audit-analyzer p-4 border rounded shadow-sm">
      
      {analysisState.isLoading && (
        <div className="analyzer-loading">
          <h3 className="text-center mb-4">Analyzing Contract: {address}</h3>
          <div className="progress mb-3" style={{ height: '8px' }}>
            <div 
              className="progress-bar" 
              role="progressbar" 
              style={{ width: `${analysisState.progress}%`, backgroundColor: '#0284c7' }}
              aria-valuenow={analysisState.progress} 
              aria-valuemin="0" 
              aria-valuemax="100"
            />
          </div>
          <p className="text-center mb-4"><strong>{analysisState.step}</strong></p>
          
          {renderPreliminaryFindings()}
        </div>
      )}
      
      {analysisState.error && (
        <div className="analyzer-error alert alert-danger">
          <h3>Analysis Failed</h3>
          <p>{analysisState.error}</p>
          <button 
            className="btn btn-primary mt-3"
            onClick={startAnalysis}
          >
            Try Again
          </button>
        </div>
      )}
      
      {analysisState.result && !analysisState.isLoading && null /* Don't show anything when complete, the parent will display results */}
    </div>
  );
}