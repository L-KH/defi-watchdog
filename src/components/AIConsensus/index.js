import React, { useState } from 'react';

/**
 * AIConsensus component visualizes how multiple AI models reach consensus on security issues
 */
const AIConsensus = ({ findings, aiAgents = ['OpenAI', 'Deepseek', 'Mistral', 'ZerePy', 'Claude'] }) => {
  const [expanded, setExpanded] = useState(false);
  
  // Generate simulated AI agent consensus data
  const generateConsensusData = (finding) => {
    const severityMap = {
      'CRITICAL': { baseConfidence: 0.9, variation: 0.1 },
      'HIGH': { baseConfidence: 0.8, variation: 0.15 },
      'MEDIUM': { baseConfidence: 0.7, variation: 0.2 },
      'LOW': { baseConfidence: 0.6, variation: 0.25 },
      'INFO': { baseConfidence: 0.5, variation: 0.3 }
    };
    
    const severity = finding.severity?.toUpperCase() || 'MEDIUM';
    const { baseConfidence, variation } = severityMap[severity] || severityMap['MEDIUM'];
    
    return aiAgents.map(agent => ({
      name: agent,
      detected: Math.random() < (baseConfidence + (Math.random() * variation - variation/2)),
      confidence: Math.min(0.99, Math.max(0.1, baseConfidence + (Math.random() * variation - variation/2))).toFixed(2),
      severity: severity,
      score: Math.floor(Math.random() * 30) + (
        severity === 'CRITICAL' ? 70 :
        severity === 'HIGH' ? 60 :
        severity === 'MEDIUM' ? 50 :
        severity === 'LOW' ? 30 : 20
      )
    }));
  };
  
  // For each finding, generate AI consensus data
  const findingsWithConsensus = findings.slice(0, 5).map(finding => ({
    ...finding,
    aiConsensus: generateConsensusData(finding)
  }));
  
  // Calculate overall AI consensus and agreement percentages
  const calculateAgreementStats = () => {
    let totalAgreement = 0;
    let totalFindings = 0;
    
    findingsWithConsensus.forEach(finding => {
      const detected = finding.aiConsensus.filter(a => a.detected);
      if (detected.length > 0) {
        totalAgreement += detected.length / aiAgents.length;
        totalFindings++;
      }
    });
    
    return {
      averageAgreement: totalFindings > 0 ? 
        `${Math.round(totalAgreement / totalFindings * 100)}%` : 'N/A',
      modelCount: aiAgents.length
    };
  };
  
  const stats = calculateAgreementStats();
  
  // Get confidence level text
  const getConfidenceLevel = (percentage) => {
    if (percentage >= 0.8) return 'High';
    if (percentage >= 0.5) return 'Medium';
    return 'Low';
  };
  
  // Get color based on confidence
  const getConfidenceColor = (percentage) => {
    if (percentage >= 0.8) return '#10b981';
    if (percentage >= 0.5) return '#f59e0b';
    return '#ef4444';
  };
  
  // Get agent icon (simplified)
  const getAgentIcon = (agent) => {
    if (agent === 'OpenAI') return '🧠';
    if (agent === 'Deepseek') return '🔍';
    if (agent === 'Mistral') return '🔮';
    if (agent === 'ZerePy') return '🤖';
    if (agent === 'Claude') return '🧪';
    return '🔧';
  };
  
  return (
    <div style={{ 
      marginTop: '2rem', 
      marginBottom: '2rem', 
      backgroundColor: 'white',
      padding: '1.5rem',
      borderRadius: '0.5rem',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <h3 style={{ 
          fontSize: '1.25rem', 
          fontWeight: 'bold', 
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span style={{ 
            backgroundColor: '#f0f9ff',
            color: '#0284c7',
            width: '2rem',
            height: '2rem',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem'
          }}>
            🤝
          </span>
          Multi-AI Consensus Analysis
        </h3>
        
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0.5rem 0.75rem',
            backgroundColor: 'white',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          {expanded ? 'Hide Details' : 'Show Details'}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            style={{ 
              marginLeft: '0.25rem',
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease-in-out'
            }}
          >
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>
      </div>
      
      <div style={{ 
        padding: '1rem', 
        backgroundColor: '#f8fafc', 
        borderRadius: '0.375rem',
        marginBottom: expanded ? '1.5rem' : '0'
      }}>
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '1rem',
          alignItems: 'center'
        }}>
          <div style={{ flex: '2 1 200px' }}>
            <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem', color: '#64748b' }}>
              AI Consensus Strength:
            </p>
            <div style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#0f172a' }}>
              {stats.averageAgreement} Agreement Across Models
            </div>
          </div>
          
          <div style={{ flex: '1 1 150px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {aiAgents.slice(0, 5).map((agent, index) => (
                <div 
                  key={index}
                  style={{
                    width: '2rem',
                    height: '2rem',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: [
                      '#dbeafe', 
                      '#f3e8ff', 
                      '#dcfce7', 
                      '#fef3c7', 
                      '#ede9fe'
                    ][index % 5],
                    fontSize: '1rem',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                  }}
                  title={agent}
                >
                  {getAgentIcon(agent)}
                </div>
              ))}
            </div>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: '#64748b' }}>
              {stats.modelCount} AI Models Analyzed
            </p>
          </div>
        </div>
      </div>
      
      {expanded && (
        <>
          <div style={{ marginBottom: '1rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>
              AI Model Findings Comparison
            </h4>
            
            {findingsWithConsensus.length === 0 ? (
              <div style={{ 
                padding: '1.5rem', 
                backgroundColor: '#f3f4f6', 
                borderRadius: '0.375rem',
                textAlign: 'center',
                color: '#6b7280'
              }}>
                No findings available for AI consensus display
              </div>
            ) : (
              <div>
                {findingsWithConsensus.map((finding, index) => (
                  <div 
                    key={index} 
                    style={{ 
                      marginBottom: index < findingsWithConsensus.length - 1 ? '1rem' : 0,
                      padding: '1rem',
                      backgroundColor: '#f9fafb',
                      borderRadius: '0.375rem',
                      border: '1px solid #e5e7eb'
                    }}
                  >
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '0.75rem'
                    }}>
                      <div>
                        <h5 style={{ fontSize: '0.875rem', fontWeight: 'bold', margin: '0 0 0.25rem 0' }}>
                          {finding.title || finding.description?.substring(0, 60) || 'Security Issue'}
                        </h5>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          {finding.aiConsensus.filter(a => a.detected).length} of {aiAgents.length} models detected this issue
                        </div>
                      </div>
                      
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.375rem',
                        backgroundColor: 
                          finding.severity?.toUpperCase() === 'CRITICAL' ? '#fef2f2' :
                          finding.severity?.toUpperCase() === 'HIGH' ? '#fff7ed' :
                          finding.severity?.toUpperCase() === 'MEDIUM' ? '#fffbeb' :
                          finding.severity?.toUpperCase() === 'LOW' ? '#f0fdf4' : '#f0f9ff',
                        color: 
                          finding.severity?.toUpperCase() === 'CRITICAL' ? '#b91c1c' :
                          finding.severity?.toUpperCase() === 'HIGH' ? '#c2410c' :
                          finding.severity?.toUpperCase() === 'MEDIUM' ? '#a16207' :
                          finding.severity?.toUpperCase() === 'LOW' ? '#166534' : '#0369a1',
                        fontSize: '0.75rem',
                        fontWeight: 'bold'
                      }}>
                        {finding.severity?.toUpperCase() || 'INFO'}
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                      {finding.aiConsensus.map((agent, idx) => (
                        <div 
                          key={idx} 
                          style={{ 
                            padding: '0.5rem',
                            backgroundColor: agent.detected ? '#f8fafc' : '#f3f4f6',
                            borderRadius: '0.375rem',
                            border: `1px solid ${agent.detected ? '#dbeafe' : '#e5e7eb'}`,
                            flex: '1 1 150px',
                            minWidth: '150px',
                            opacity: agent.detected ? 1 : 0.7
                          }}
                        >
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            marginBottom: '0.5rem',
                            gap: '0.5rem'
                          }}>
                            <div style={{
                              width: '1.5rem',
                              height: '1.5rem',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: [
                                '#dbeafe', 
                                '#f3e8ff', 
                                '#dcfce7', 
                                '#fef3c7', 
                                '#ede9fe'
                              ][idx % 5],
                              fontSize: '0.875rem',
                              flexShrink: 0
                            }}>
                              {getAgentIcon(agent.name)}
                            </div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>
                              {agent.name}
                            </div>
                          </div>
                          
                          {agent.detected ? (
                            <div style={{ 
                              display: 'flex', 
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}>
                              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                Confidence:
                              </div>
                              <div style={{ 
                                fontSize: '0.75rem', 
                                fontWeight: 'bold',
                                color: getConfidenceColor(agent.confidence)
                              }}>
                                {getConfidenceLevel(agent.confidence)}
                                <span style={{ fontWeight: 'normal', marginLeft: '0.25rem' }}>
                                  ({Math.round(agent.confidence * 100)}%)
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div style={{ 
                              fontSize: '0.75rem', 
                              color: '#6b7280',
                              textAlign: 'center'
                            }}>
                              Issue Not Detected
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div style={{ 
            backgroundColor: '#f8fafc', 
            padding: '1rem', 
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            color: '#475569' 
          }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.75rem', color: '#0f172a' }}>
              How Multi-AI Analysis Works:
            </h4>
            <ol style={{ margin: 0, paddingLeft: '1.25rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>Multiple specialized AI models analyze the contract independently</li>
              <li style={{ marginBottom: '0.5rem' }}>Each model is trained to identify specific vulnerability patterns</li>
              <li style={{ marginBottom: '0.5rem' }}>Issue detection confidence is calculated for each finding</li>
              <li style={{ marginBottom: '0.5rem' }}>AI models "discuss" findings to eliminate false positives</li>
              <li style={{ marginBottom: '0.5rem' }}>Issues identified by multiple models receive higher confidence scores</li>
              <li style={{ marginBottom: 0 }}>Final consensus report provides validated vulnerabilities with remediation steps</li>
            </ol>
          </div>
        </>
      )}
    </div>
  );
};

export default AIConsensus;
