import React, { useState, useEffect } from 'react';

/**
 * Component for displaying Sonic-specific optimization recommendations
 */
const SonicOptimizations = ({ contractAddress, enabled = false }) => {
  const [optimizations, setOptimizations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    // Only fetch if component is enabled and we have a contract address
    if (enabled && contractAddress) {
      fetchOptimizations();
    }
  }, [enabled, contractAddress]);

  // Fetch Sonic-specific optimizations
  const fetchOptimizations = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/sonic/optimizations?address=${contractAddress}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch Sonic optimizations');
      }
      
      const data = await response.json();
      setOptimizations(data.optimizations || []);
    } catch (err) {
      console.error('Error fetching Sonic optimizations:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Toggle expanded state for optimization
  const toggleExpanded = (id) => {
    setExpanded(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // If component is not enabled, don't render anything
  if (!enabled) return null;

  return (
    <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        marginBottom: '1rem'
      }}>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '0.5rem', color: '#8b5cf6' }}>
          <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0, color: '#8b5cf6' }}>
          Sonic-Specific Optimizations
        </h3>
      </div>
      
      {loading ? (
        <div style={{ 
          backgroundColor: '#f5f3ff', 
          padding: '1.5rem', 
          borderRadius: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ 
            width: '1.5rem', 
            height: '1.5rem', 
            borderRadius: '50%', 
            border: '2px solid #8b5cf6',
            borderTopColor: 'transparent',
            animation: 'spin 1s linear infinite',
            marginRight: '0.75rem'
          }} />
          <span style={{ color: '#6b7280' }}>Analyzing Sonic-specific optimizations...</span>
        </div>
      ) : error ? (
        <div style={{ 
          backgroundColor: '#fee2e2', 
          padding: '1rem', 
          borderRadius: '0.5rem',
          color: '#b91c1c'
        }}>
          <p style={{ margin: 0 }}>Error fetching Sonic optimizations: {error}</p>
        </div>
      ) : optimizations.length === 0 ? (
        <div style={{ 
          backgroundColor: '#f5f3ff', 
          padding: '1.5rem', 
          borderRadius: '0.5rem',
          color: '#6b7280',
          border: '1px dashed #d8b4fe'
        }}>
          <p style={{ margin: 0 }}>No Sonic-specific optimizations available for this contract.</p>
        </div>
      ) : (
        <>
          <div style={{ 
            backgroundColor: '#f5f3ff', 
            padding: '1rem', 
            borderRadius: '0.5rem',
            marginBottom: '1rem',
            border: '1px solid #e9d5ff'
          }}>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
              <strong>ZerePy AI Agent</strong> has analyzed this contract for Sonic-specific optimizations. 
              These recommendations can help improve gas efficiency, performance, and compatibility on the Sonic network.
            </p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {optimizations.map((opt, index) => (
              <div 
                key={index}
                style={{ 
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  overflow: 'hidden',
                  backgroundColor: 'white'
                }}
              >
                <div style={{ 
                  padding: '1rem',
                  backgroundColor: expanded[index] ? '#f5f3ff' : 'white',
                  borderBottom: expanded[index] ? '1px solid #e5e7eb' : 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <h4 style={{ 
                      fontSize: '1rem', 
                      fontWeight: 'bold', 
                      margin: 0,
                      color: expanded[index] ? '#8b5cf6' : '#111827'
                    }}>
                      {opt.title || `Optimization #${index + 1}`}
                    </h4>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>
                      {opt.description?.substring(0, 100)}
                      {opt.description?.length > 100 ? '...' : ''}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => toggleExpanded(index)}
                    style={{
                      backgroundColor: expanded[index] ? '#8b5cf6' : 'white',
                      color: expanded[index] ? 'white' : '#6b7280',
                      border: expanded[index] ? 'none' : '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {expanded[index] ? 'Hide Details' : 'View Details'}
                  </button>
                </div>
                
                {expanded[index] && (
                  <div style={{ padding: '1rem' }}>
                    <div style={{ marginBottom: '1rem' }}>
                      <h5 style={{ fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Description</h5>
                      <p style={{ fontSize: '0.875rem', color: '#4b5563', margin: 0 }}>
                        {opt.description}
                      </p>
                    </div>
                    
                    {opt.codeSnippet && (
                      <div style={{ marginBottom: '1rem' }}>
                        <h5 style={{ fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Original Code</h5>
                        <pre style={{ 
                          backgroundColor: '#f3f4f6', 
                          padding: '0.75rem', 
                          borderRadius: '0.375rem',
                          overflow: 'auto',
                          fontSize: '0.75rem',
                          fontFamily: 'monospace',
                          margin: 0
                        }}>
                          {opt.codeSnippet}
                        </pre>
                      </div>
                    )}
                    
                    {opt.optimizedCode && (
                      <div style={{ marginBottom: '1rem' }}>
                        <h5 style={{ fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Sonic-Optimized Code</h5>
                        <pre style={{ 
                          backgroundColor: '#f5f3ff', 
                          padding: '0.75rem', 
                          borderRadius: '0.375rem',
                          overflow: 'auto',
                          fontSize: '0.75rem',
                          fontFamily: 'monospace',
                          margin: 0,
                          border: '1px solid #e9d5ff'
                        }}>
                          {opt.optimizedCode}
                        </pre>
                      </div>
                    )}
                    
                    {(opt.gasSavings || opt.performanceImpact) && (
                      <div style={{ marginBottom: '1rem' }}>
                        <h5 style={{ fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Benefits</h5>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                          {opt.gasSavings && (
                            <div style={{ 
                              backgroundColor: '#ecfdf5', 
                              padding: '0.5rem 0.75rem', 
                              borderRadius: '0.375rem',
                              fontSize: '0.75rem',
                              display: 'flex',
                              alignItems: 'center',
                              color: '#047857',
                              border: '1px solid #d1fae5'
                            }}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.25rem' }}>
                                <path d="M23 12a11.05 11.05 0 0 0-22 0zm-5 7a3 3 0 0 1-6 0v-7" />
                              </svg>
                              Gas Savings: {opt.gasSavings}
                            </div>
                          )}
                          
                          {opt.performanceImpact && (
                            <div style={{ 
                              backgroundColor: '#ede9fe', 
                              padding: '0.5rem 0.75rem', 
                              borderRadius: '0.375rem',
                              fontSize: '0.75rem',
                              display: 'flex',
                              alignItems: 'center',
                              color: '#6d28d9',
                              border: '1px solid #ddd6fe'
                            }}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.25rem' }}>
                                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                              </svg>
                              Performance: {opt.performanceImpact}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(opt.optimizedCode);
                          alert('Optimized code copied to clipboard!');
                        }}
                        style={{
                          backgroundColor: '#8b5cf6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.375rem',
                          padding: '0.5rem 0.75rem',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          cursor: 'pointer'
                        }}
                      >
                        Copy Optimized Code
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SonicOptimizations;
