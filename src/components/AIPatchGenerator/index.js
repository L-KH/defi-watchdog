import React, { useState, useEffect } from 'react';

/**
 * AI Patch Generator component
 * Displays and generates AI-powered code fixes for security vulnerabilities
 */
const AIPatchGenerator = ({ contractAddress, network, findings }) => {
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [generatedFixes, setGeneratedFixes] = useState([]);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState({});

  // Filter only findings that might have code fixes
  const fixableFindings = findings?.filter(finding => 
    finding.severity?.toUpperCase() === 'CRITICAL' || 
    finding.severity?.toUpperCase() === 'HIGH' || 
    finding.severity?.toUpperCase() === 'MEDIUM'
  ) || [];

  // Simulate progress during loading
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 95) return prev;
          return prev + Math.random() * 5;
        });
      }, 500);
      
      return () => clearInterval(interval);
    } else {
      setLoadingProgress(0);
    }
  }, [loading]);

  // Function to generate fixes
  const generateFixes = async () => {
    if (!contractAddress || !network || fixableFindings.length === 0) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/generate-patch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          address: contractAddress,
          network,
          findings: fixableFindings
        })
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to generate patches');
      }
      
      const data = await response.json();
      
      if (data.fixes && Array.isArray(data.fixes)) {
        setGeneratedFixes(data.fixes);
      } else {
        throw new Error('Invalid fix data received');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error generating patches:', err);
    } finally {
      setLoading(false);
    }
  };

  // Toggle expanded state for a fix
  const toggleExpanded = (id) => {
    setExpanded(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Copy fix code to clipboard
  const copyFix = (code) => {
    navigator.clipboard.writeText(code)
      .then(() => alert('Fix copied to clipboard!'))
      .catch(err => console.error('Failed to copy:', err));
  };

  return (
    <div style={{ marginTop: '2rem', backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>
          AI-Generated Security Fixes
        </h3>
        
        <button
          onClick={generateFixes}
          disabled={loading || fixableFindings.length === 0}
          style={{
            backgroundColor: loading ? '#d1d5db' : fixableFindings.length === 0 ? '#d1d5db' : '#0284c7',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            border: 'none',
            fontWeight: '500',
            cursor: fixableFindings.length === 0 || loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {loading ? 'Generating...' : 'Generate Security Fixes'}
        </button>
      </div>
      
      {fixableFindings.length === 0 ? (
        <div style={{ 
          backgroundColor: '#f3f4f6', 
          padding: '2rem', 
          borderRadius: '0.5rem',
          textAlign: 'center', 
          color: '#6b7280' 
        }}>
          <p style={{ margin: 0 }}>No critical or high-risk issues found that require fixes.</p>
        </div>
      ) : loading ? (
        <div style={{ 
          backgroundColor: '#f0f9ff', 
          padding: '1.5rem', 
          borderRadius: '0.5rem',
          marginBottom: '1rem' 
        }}>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 'bold', color: '#0284c7' }}>AI Models Working...</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#4b5563', margin: 0 }}>
              Generating fixes for {fixableFindings.length} {fixableFindings.length === 1 ? 'issue' : 'issues'}. This may take up to a minute.
            </p>
          </div>
          
          <div style={{ height: '0.5rem', backgroundColor: '#dbeafe', borderRadius: '9999px', overflow: 'hidden' }}>
            <div 
              style={{ 
                height: '100%', 
                width: `${loadingProgress}%`, 
                backgroundColor: '#3b82f6',
                transition: 'width 0.5s ease-in-out'
              }}
            />
          </div>
        </div>
      ) : error ? (
        <div style={{ 
          backgroundColor: '#fee2e2', 
          padding: '1.5rem', 
          borderRadius: '0.5rem',
          color: '#b91c1c',
          marginBottom: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontWeight: 'bold' }}>Error Generating Fixes</span>
          </div>
          <p style={{ fontSize: '0.875rem', margin: 0 }}>{error}</p>
        </div>
      ) : generatedFixes.length > 0 ? (
        <div>
          {generatedFixes.map((fix, index) => (
            <div 
              key={index} 
              style={{ 
                marginBottom: '1.5rem', 
                border: '1px solid #e5e7eb', 
                borderRadius: '0.5rem', 
                overflow: 'hidden'
              }}
            >
              <div style={{ 
                padding: '1rem', 
                borderBottom: expanded[index] ? '1px solid #e5e7eb' : 'none', 
                backgroundColor: '#f9fafb',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 'bold', margin: 0 }}>{fix.title || `Fix for Issue`}</h4>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>
                    {fix.description || 'A security issue was fixed in the contract code.'}
                  </p>
                </div>
                
                <button
                  onClick={() => toggleExpanded(index)}
                  style={{
                    backgroundColor: 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    padding: '0.375rem 0.75rem',
                    fontSize: '0.875rem',
                    cursor: 'pointer'
                  }}
                >
                  {expanded[index] ? 'Hide Details' : 'View Details'}
                </button>
              </div>
              
              {expanded[index] && (
                <div style={{ padding: '1rem' }}>
                  <div style={{ marginBottom: '1rem' }}>
                    <h5 style={{ fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Issue:</h5>
                    <p style={{ fontSize: '0.875rem', color: '#4b5563', margin: 0 }}>
                      {fix.findingDescription || 'A security vulnerability was identified in the contract.'}
                    </p>
                  </div>
                  
                  <div style={{ display: 'flex', marginBottom: '1rem' }}>
                    <div style={{ flex: 1, marginRight: '0.5rem' }}>
                      <h5 style={{ fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Original Code:</h5>
                      <pre style={{ 
                        backgroundColor: '#fee2e2', 
                        padding: '0.75rem', 
                        borderRadius: '0.375rem',
                        fontSize: '0.75rem',
                        overflow: 'auto',
                        margin: 0
                      }}>
                        {fix.originalCode || 'No original code provided'}
                      </pre>
                    </div>
                    
                    <div style={{ flex: 1, marginLeft: '0.5rem' }}>
                      <h5 style={{ fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Fixed Code:</h5>
                      <pre style={{ 
                        backgroundColor: '#dcfce7', 
                        padding: '0.75rem', 
                        borderRadius: '0.375rem',
                        fontSize: '0.75rem',
                        overflow: 'auto',
                        margin: 0
                      }}>
                        {fix.fixedCode || 'No fix code provided'}
                      </pre>
                    </div>
                  </div>
                  
                  {fix.explanation && (
                    <div style={{ marginBottom: '1rem' }}>
                      <h5 style={{ fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Explanation:</h5>
                      <p style={{ fontSize: '0.875rem', color: '#4b5563', margin: 0 }}>
                        {fix.explanation}
                      </p>
                    </div>
                  )}
                  
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => copyFix(fix.fixedCode)}
                      style={{
                        backgroundColor: '#0284c7',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.375rem',
                        padding: '0.5rem 1rem',
                        fontSize: '0.875rem',
                        cursor: 'pointer'
                      }}
                    >
                      Copy Fixed Code
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div style={{ 
          backgroundColor: '#f3f4f6', 
          padding: '2rem', 
          borderRadius: '0.5rem',
          textAlign: 'center', 
          color: '#6b7280' 
        }}>
          <p style={{ margin: 0 }}>Click "Generate Security Fixes" to have AI create solutions for the detected issues.</p>
        </div>
      )}
    </div>
  );
};

export default AIPatchGenerator;
