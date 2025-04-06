// src/components/ReliableAuditAnalyzer.js
import React, { useState, useEffect } from 'react';
import { analyzeContract } from '../lib/reliable-analyzer';

export function ReliableAuditAnalyzer({ address, network, onAnalysisComplete }) {
  const [state, setState] = useState({
    isLoading: true,
    step: 'Initializing analysis...',
    progress: 0,
    error: null,
    preliminaryResults: null,
    result: null
  });

  useEffect(() => {
    if (address && network) {
      startAnalysis();
    }
  }, [address, network]);

  const startAnalysis = async () => {
    setState({
      isLoading: true,
      step: 'Initializing analysis...',
      progress: 0,
      error: null,
      preliminaryResults: null,
      result: null
    });

    try {
      const result = await analyzeContract(address, network, {
        updateCallback: setState
      });
      
      if (onAnalysisComplete && result) {
        onAnalysisComplete(result);
      }
    } catch (error) {
      console.error('Analysis failed:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message
      }));
    }
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
    if (!state.preliminaryResults || !state.preliminaryResults.risks) {
      return null;
    }
    
    return (
      <div className="preliminary-findings">
        <h4>Initial Analysis Findings</h4>
        <p className="text-muted">These findings are being verified with DeepSeek AI...</p>
        <ul className="list-group">
          {state.preliminaryResults.risks.map((risk, index) => (
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
    <div className="reliable-audit-analyzer">
      {state.isLoading && (
        <div className="analyzer-loading">
          <h3 className="text-center mb-4">Analyzing Contract: {address}</h3>
          <div className="progress mb-3">
            <div 
              className="progress-bar" 
              role="progressbar" 
              style={{ width: `${state.progress}%` }}
              aria-valuenow={state.progress} 
              aria-valuemin="0" 
              aria-valuemax="100"
            >
              {state.progress}%
            </div>
          </div>
          <p className="text-center mb-4"><strong>{state.step}</strong></p>
          
          {renderPreliminaryFindings()}
        </div>
      )}
      
      {state.error && (
        <div className="analyzer-error alert alert-danger">
          <h3>Analysis Failed</h3>
          <p>{state.error}</p>
          <button 
            className="btn btn-primary mt-3"
            onClick={startAnalysis}
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
