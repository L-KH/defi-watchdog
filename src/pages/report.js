import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../components/layout/Layout';
import { useWallet } from '../hooks/useWallet';

// Helper to get color based on security score
function getScoreColor(score) {
  if (score >= 80) return '#10b981'; // Green
  if (score >= 50) return '#f59e0b'; // Orange
  return '#ef4444'; // Red
}

// Network icon components
const LineaIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '0.25rem' }}>
    <path d="M12 22V2M2 12h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SonicIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '0.25rem' }}>
    <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Network icon selector
const NetworkIcon = ({ network }) => {
  if (network === 'linea') return <LineaIcon />;
  if (network === 'sonic') return <SonicIcon />;
  return null;
};

// Severity badge component
function SeverityBadge({ severity }) {
  const severityColorMap = {
    CRITICAL: '#FF3B30',
    HIGH: '#FF9500',
    MEDIUM: '#FFCC00',
    LOW: '#34C759',
    INFO: '#007AFF'
  };
  
  const normalizedSeverity = severity?.toUpperCase() || 'INFO';
  
  return (
    <span style={{
      backgroundColor: severityColorMap[normalizedSeverity] || '#6C757D',
      color: '#FFFFFF',
      padding: '3px 8px',
      borderRadius: '12px',
      fontSize: '0.75rem',
      fontWeight: 'bold',
      display: 'inline-block',
      marginLeft: '8px'
    }}>
      {normalizedSeverity}
    </span>
  );
}

// Finding card component
function FindingCard({ finding }) {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div style={{
      border: '1px solid #E5E7EB',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '16px',
      backgroundColor: '#FFFFFF'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 'bold' }}>
          {finding.title || finding.description?.substring(0, 40) || "Security Issue"}
        </h3>
        <SeverityBadge severity={finding.severity} />
      </div>
      
      <p style={{ fontSize: '0.875rem', margin: '8px 0' }}>
        {finding.description}
      </p>
      
      {!expanded ? (
        <button
          onClick={() => setExpanded(true)}
          style={{
            backgroundColor: 'transparent',
            border: '1px solid #D1D5DB',
            borderRadius: '4px',
            padding: '6px 12px',
            fontSize: '0.75rem',
            cursor: 'pointer'
          }}
        >
          View Details
        </button>
      ) : (
        <>
          {finding.impact && (
            <div style={{ marginTop: '12px' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 'bold', margin: '4px 0' }}>Impact</h4>
              <p style={{ fontSize: '0.875rem', margin: '4px 0' }}>{finding.impact}</p>
            </div>
          )}
          
          {finding.codeReference && (
            <div style={{ marginTop: '12px' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 'bold', margin: '4px 0' }}>Code Reference</h4>
              <p style={{ fontSize: '0.875rem', margin: '4px 0' }}>{finding.codeReference}</p>
            </div>
          )}
          
          {finding.codeSnippet && (
            <div style={{ marginTop: '12px' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 'bold', margin: '4px 0' }}>Code</h4>
              <pre style={{ 
                backgroundColor: '#F8F9FA',
                padding: '8px',
                borderRadius: '4px',
                overflow: 'auto',
                fontSize: '0.75rem',
                margin: '4px 0'
              }}>
                {finding.codeSnippet}
              </pre>
            </div>
          )}
          
          {finding.recommendation && (
            <div style={{ marginTop: '12px' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 'bold', margin: '4px 0' }}>Recommendation</h4>
              <p style={{ fontSize: '0.875rem', margin: '4px 0' }}>{finding.recommendation}</p>
            </div>
          )}
          
          <button
            onClick={() => setExpanded(false)}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid #D1D5DB',
              borderRadius: '4px',
              padding: '6px 12px',
              fontSize: '0.75rem',
              marginTop: '16px',
              cursor: 'pointer'
            }}
          >
            Show Less
          </button>
        </>
      )}
    </div>
  );
}

// AI patch suggestion component
function PatchSuggestion({ patch }) {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div style={{
      border: '1px solid #E5E7EB',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '16px',
      backgroundColor: '#FFFFFF'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 'bold' }}>
          {patch.title || "Code Fix"}
        </h3>
        <SeverityBadge severity={patch.severity || "INFO"} />
      </div>
      
      <p style={{ fontSize: '0.875rem', margin: '8px 0' }}>
        {patch.description || "AI-suggested code fix for the identified issue."}
      </p>
      
      {!expanded ? (
        <button
          onClick={() => setExpanded(true)}
          style={{
            backgroundColor: 'transparent',
            border: '1px solid #D1D5DB',
            borderRadius: '4px',
            padding: '6px 12px',
            fontSize: '0.75rem',
            cursor: 'pointer'
          }}
        >
          View Fix
        </button>
      ) : (
        <>
          {patch.originalCode && (
            <div style={{ marginTop: '12px' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 'bold', margin: '4px 0' }}>Original Code</h4>
              <pre style={{ 
                backgroundColor: '#FFEEEE',
                padding: '8px',
                borderRadius: '4px',
                overflow: 'auto',
                fontSize: '0.75rem',
                margin: '4px 0'
              }}>
                {patch.originalCode}
              </pre>
            </div>
          )}
          
          {patch.fixedCode && (
            <div style={{ marginTop: '12px' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 'bold', margin: '4px 0' }}>Fixed Code</h4>
              <pre style={{ 
                backgroundColor: '#EEFFEE',
                padding: '8px',
                borderRadius: '4px',
                overflow: 'auto',
                fontSize: '0.75rem',
                margin: '4px 0'
              }}>
                {patch.fixedCode}
              </pre>
            </div>
          )}
          
          {patch.explanation && (
            <div style={{ marginTop: '12px' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 'bold', margin: '4px 0' }}>Explanation</h4>
              <p style={{ fontSize: '0.875rem', margin: '4px 0' }}>{patch.explanation}</p>
            </div>
          )}
          
          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            <button
              onClick={() => {
                navigator.clipboard.writeText(patch.fixedCode);
                alert('Fixed code copied to clipboard!');
              }}
              style={{
                backgroundColor: '#0284c7',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '6px 12px',
                fontSize: '0.75rem',
                cursor: 'pointer'
              }}
            >
              Copy Fix
            </button>
            
            <button
              onClick={() => setExpanded(false)}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid #D1D5DB',
                borderRadius: '4px',
                padding: '6px 12px',
                fontSize: '0.75rem',
                cursor: 'pointer'
              }}
            >
              Show Less
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// AI conversation view component
function AIConversation({ conversation }) {
  if (!conversation) return null;
  
  return (
    <div style={{
      border: '1px solid #E5E7EB',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '24px',
      backgroundColor: '#F9FAFB'
    }}>
      <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '12px' }}>
        AI Analysis Discussion
      </h3>
      
      <div style={{ whiteSpace: 'pre-line', fontSize: '0.875rem' }}>
        {conversation}
      </div>
    </div>
  );
}

// Format date helper
function formatDate(dateString) {
  if (!dateString) return 'Unknown';
  try {
    const date = new Date(dateString);
    return date.toLocaleString();
  } catch (e) {
    return 'Invalid Date';
  }
}

// Risk summary component
function RiskSummary({ findings }) {
  const findingCounts = {
    critical: findings.filter(f => f.severity?.toUpperCase() === 'CRITICAL').length,
    high: findings.filter(f => f.severity?.toUpperCase() === 'HIGH').length,
    medium: findings.filter(f => f.severity?.toUpperCase() === 'MEDIUM').length,
    low: findings.filter(f => f.severity?.toUpperCase() === 'LOW').length,
    info: findings.filter(f => f.severity?.toUpperCase() === 'INFO').length
  };
  
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        padding: '8px', 
        backgroundColor: findingCounts.critical > 0 ? '#FFEEEE' : '#F3F4F6',
        borderRadius: '4px',
        minWidth: '120px'
      }}>
        <span style={{ marginRight: '8px' }}>🟥</span>
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '0.875rem' }}>Critical</div>
          <div style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>{findingCounts.critical}</div>
        </div>
      </div>
      
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        padding: '8px', 
        backgroundColor: findingCounts.high > 0 ? '#FFF8EE' : '#F3F4F6',
        borderRadius: '4px',
        minWidth: '120px'
      }}>
        <span style={{ marginRight: '8px' }}>🟧</span>
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '0.875rem' }}>High</div>
          <div style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>{findingCounts.high}</div>
        </div>
      </div>
      
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        padding: '8px', 
        backgroundColor: findingCounts.medium > 0 ? '#FFFBEE' : '#F3F4F6',
        borderRadius: '4px',
        minWidth: '120px'
      }}>
        <span style={{ marginRight: '8px' }}>🟨</span>
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '0.875rem' }}>Medium</div>
          <div style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>{findingCounts.medium}</div>
        </div>
      </div>
      
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        padding: '8px', 
        backgroundColor: '#F0FFF5',
        borderRadius: '4px',
        minWidth: '120px'
      }}>
        <span style={{ marginRight: '8px' }}>🟩</span>
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '0.875rem' }}>Low/Info</div>
          <div style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>{findingCounts.low + findingCounts.info}</div>
        </div>
      </div>
    </div>
  );
}

export default function Report() {
  const router = useRouter();
  const { id } = router.query;
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const { account } = useWallet();
  
  useEffect(() => {
    if (!id) return;
    
    async function fetchReport() {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/reports/${id}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch report: ${response.statusText}`);
        }
        
        const data = await response.json();
        setReport(data);
      } catch (err) {
        console.error('Error fetching report:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchReport();
  }, [id]);
  
  const handleGoBack = () => {
    router.back();
  };
  
  if (loading) {
    return (
      <Layout>
        <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '1rem' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            padding: '4rem',
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '50%', 
                border: '3px solid #38bdf8',
                borderTopColor: 'transparent',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 1rem auto'
              }} />
              <p style={{ fontWeight: '500', color: '#0284c7' }}>Loading report...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (error) {
    return (
      <Layout>
        <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '1rem' }}>
          <div style={{ 
            backgroundColor: '#fee2e2', 
            padding: '1.5rem', 
            borderRadius: '0.5rem',
            color: '#b91c1c',
            marginBottom: '1rem'
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Error</h2>
            <p>{error}</p>
          </div>
          
          <button
            onClick={handleGoBack}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.5rem 1rem',
              backgroundColor: 'white',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              color: '#4b5563',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Back to Dashboard
          </button>
        </div>
      </Layout>
    );
  }
  
  if (!report) {
    return (
      <Layout>
        <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '1rem' }}>
          <div style={{ 
            backgroundColor: '#f3f4f6', 
            padding: '1.5rem', 
            borderRadius: '0.5rem',
            textAlign: 'center',
            marginBottom: '1rem'
          }}>
            <p>Report not found or has been removed.</p>
          </div>
          
          <button
            onClick={handleGoBack}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.5rem 1rem',
              backgroundColor: 'white',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              color: '#4b5563',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Back to Dashboard
          </button>
        </div>
      </Layout>
    );
  }
  
  const securityScore = report.securityScore || report.analysis?.securityScore || 0;
  const isSafe = report.isSafe || securityScore >= 70;
  const findings = report.analysis?.risks || [];
  const patches = report.analysis?.fixes || [];
  const aiConversation = report.analysis?.analysisDiscussion;
  
  return (
    <Layout>
      <Head>
        <title>Security Report | DeFi Watchdog</title>
      </Head>
      
      <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '1rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          <button
            onClick={handleGoBack}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.5rem 1rem',
              backgroundColor: 'white',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              color: '#4b5563',
              fontWeight: '500',
              cursor: 'pointer',
              marginRight: '1rem'
            }}
          >
            Back
          </button>
          
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
            Contract Security Report
          </h1>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          overflow: 'hidden',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            padding: '1.5rem',
            borderBottom: '1px solid #e5e7eb',
            backgroundColor: isSafe ? '#f0fdf4' : '#fef2f2',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                {report.contractName || `Contract-${report.address?.slice(0, 6)}`}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem', color: '#6b7280' }}>
                <NetworkIcon network={report.network} />
                <span style={{ textTransform: 'capitalize' }}>{report.network || 'Ethereum'} Network</span>
                <span style={{ margin: '0 0.25rem' }}>•</span>
                <span style={{ fontFamily: 'monospace' }}>{report.address}</span>
              </div>
            </div>
            
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.375rem 0.75rem',
              borderRadius: '9999px',
              backgroundColor: isSafe ? '#dcfce7' : '#fee2e2',
              color: isSafe ? '#166534' : '#991b1b',
              fontWeight: 'bold',
              fontSize: '0.875rem'
            }}>
              {isSafe ? 'Safe' : 'Vulnerabilities Detected'}
            </div>
          </div>
          
          <div style={{
            padding: '1.5rem',
            borderBottom: '1px solid #e5e7eb'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.5rem'
            }}>
              <div>
                <h3 style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem', fontWeight: 'normal' }}>Security Score</h3>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                  <div style={{ 
                    width: '2.5rem', 
                    height: '2.5rem', 
                    borderRadius: '9999px', 
                    backgroundColor: getScoreColor(securityScore),
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '0.5rem',
                    fontWeight: 'bold'
                  }}>
                    {Math.round(securityScore)}
                  </div>
                  <span style={{ color: getScoreColor(securityScore) }}>/ 100</span>
                </div>
              </div>
              
              <div>
                <h3 style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem', fontWeight: 'normal' }}>Contract Type</h3>
                <p style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                  {report.analysis?.contractType || 'Smart Contract'}
                </p>
              </div>
              
              <div>
                <h3 style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem', fontWeight: 'normal' }}>Analysis Date</h3>
                <p style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                  {formatDate(report.createdAt || report.date)}
                </p>
              </div>
              
              <div>
                <h3 style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem', fontWeight: 'normal' }}>Issues Found</h3>
                <p style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                  {findings.length} {findings.length === 1 ? 'issue' : 'issues'}
                </p>
              </div>
            </div>
          </div>
          
          <div style={{ borderBottom: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex' }}>
              <button
                onClick={() => setActiveTab('overview')}
                style={{
                  padding: '1rem',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: activeTab === 'overview' ? '2px solid #0284c7' : 'none',
                  fontWeight: activeTab === 'overview' ? 'bold' : 'normal',
                  color: activeTab === 'overview' ? '#0284c7' : '#6b7280',
                  cursor: 'pointer'
                }}
              >
                Overview
              </button>
              
              <button
                onClick={() => setActiveTab('findings')}
                style={{
                  padding: '1rem',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: activeTab === 'findings' ? '2px solid #0284c7' : 'none',
                  fontWeight: activeTab === 'findings' ? 'bold' : 'normal',
                  color: activeTab === 'findings' ? '#0284c7' : '#6b7280',
                  cursor: 'pointer'
                }}
              >
                Findings
              </button>
              
              <button
                onClick={() => setActiveTab('fixes')}
                style={{
                  padding: '1rem',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: activeTab === 'fixes' ? '2px solid #0284c7' : 'none',
                  fontWeight: activeTab === 'fixes' ? 'bold' : 'normal',
                  color: activeTab === 'fixes' ? '#0284c7' : '#6b7280',
                  cursor: 'pointer'
                }}
              >
                AI Fixes
              </button>
              
              <button
                onClick={() => setActiveTab('discussion')}
                style={{
                  padding: '1rem',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: activeTab === 'discussion' ? '2px solid #0284c7' : 'none',
                  fontWeight: activeTab === 'discussion' ? 'bold' : 'normal',
                  color: activeTab === 'discussion' ? '#0284c7' : '#6b7280',
                  cursor: 'pointer'
                }}
              >
                AI Discussion
              </button>
            </div>
          </div>
          
          <div style={{ padding: '1.5rem' }}>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                  Contract Overview
                </h3>
                
                {isSafe ? (
                  <div style={{
                    backgroundColor: '#f0fdf4',
                    borderRadius: '0.5rem',
                    padding: '1rem',
                    marginBottom: '1.5rem',
                    border: '1px solid #dcfce7'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <svg 
                        style={{ height: '1.5rem', width: '1.5rem', color: '#059669', marginRight: '0.5rem', flexShrink: 0 }} 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 'bold', color: '#059669' }}>
                        This Contract Passed Security Checks
                      </h4>
                    </div>
                    <p style={{ marginTop: '0.5rem', color: '#059669' }}>
                      Our AI analysis did not detect any significant security vulnerabilities in this contract.
                    </p>
                  </div>
                ) : (
                  <div style={{
                    backgroundColor: '#fef2f2',
                    borderRadius: '0.5rem',
                    padding: '1rem',
                    marginBottom: '1.5rem',
                    border: '1px solid #fee2e2'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <svg 
                        style={{ height: '1.5rem', width: '1.5rem', color: '#dc2626', marginRight: '0.5rem', flexShrink: 0 }} 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 'bold', color: '#dc2626' }}>
                        Security Vulnerabilities Detected
                      </h4>
                    </div>
                    <p style={{ marginTop: '0.5rem', color: '#dc2626' }}>
                      Our AI analysis has identified potential security issues in this contract. Please review the findings.
                    </p>
                  </div>
                )}
                
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    Contract Summary
                  </h4>
                  <p style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
                    {report.summary || report.analysis?.overview || "No summary available for this contract."}
                  </p>
                </div>
                
                {findings.length > 0 && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                      Risk Summary
                    </h4>
                    <RiskSummary findings={findings} />
                  </div>
                )}
                
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    Security Assessment
                  </h4>
                  <p style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
                    {report.analysis?.explanation || "No detailed assessment available."}
                  </p>
                </div>
              </div>
            )}
            
            {/* Findings Tab */}
            {activeTab === 'findings' && (
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                  Security Findings
                </h3>
                
                {findings.length > 0 ? (
                  <div>
                    <RiskSummary findings={findings} />
                    
                    {/* Critical Findings */}
                    {findings.filter(f => f.severity?.toUpperCase() === 'CRITICAL').length > 0 && (
                      <div style={{ marginBottom: '1.5rem' }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#dc2626', marginBottom: '0.5rem' }}>
                          Critical Vulnerabilities
                        </h4>
                        {findings
                          .filter(f => f.severity?.toUpperCase() === 'CRITICAL')
                          .map((finding, index) => (
                            <FindingCard key={`critical-${index}`} finding={finding} />
                          ))}
                      </div>
                    )}
                    
                    {/* High Findings */}
                    {findings.filter(f => f.severity?.toUpperCase() === 'HIGH').length > 0 && (
                      <div style={{ marginBottom: '1.5rem' }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#ea580c', marginBottom: '0.5rem' }}>
                          High Severity Issues
                        </h4>
                        {findings
                          .filter(f => f.severity?.toUpperCase() === 'HIGH')
                          .map((finding, index) => (
                            <FindingCard key={`high-${index}`} finding={finding} />
                          ))}
                      </div>
                    )}
                    
                    {/* Medium Findings */}
                    {findings.filter(f => f.severity?.toUpperCase() === 'MEDIUM').length > 0 && (
                      <div style={{ marginBottom: '1.5rem' }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#d97706', marginBottom: '0.5rem' }}>
                          Medium Severity Issues
                        </h4>
                        {findings
                          .filter(f => f.severity?.toUpperCase() === 'MEDIUM')
                          .map((finding, index) => (
                            <FindingCard key={`medium-${index}`} finding={finding} />
                          ))}
                      </div>
                    )}
                    
                    {/* Low/Info Findings */}
                    {findings.filter(f => 
                      f.severity?.toUpperCase() === 'LOW' || 
                      f.severity?.toUpperCase() === 'INFO'
                    ).length > 0 && (
                      <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#65a30d', marginBottom: '0.5rem' }}>
                          Low Severity/Informational Issues
                        </h4>
                        {findings
                          .filter(f => 
                            f.severity?.toUpperCase() === 'LOW' || 
                            f.severity?.toUpperCase() === 'INFO'
                          )
                          .map((finding, index) => (
                            <FindingCard key={`low-${index}`} finding={finding} />
                          ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{
                    backgroundColor: '#f3f4f6',
                    borderRadius: '0.5rem',
                    padding: '2rem',
                    textAlign: 'center'
                  }}>
                    <p style={{ margin: 0, color: '#6b7280' }}>
                      No specific findings were identified for this contract.
                    </p>
                  </div>
                )}
              </div>
            )}
            
            {/* AI Fixes Tab */}
            {activeTab === 'fixes' && (
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                  AI-Suggested Fixes
                </h3>
                
                {patches && patches.length > 0 ? (
                  <div>
                    {patches.map((patch, index) => (
                      <PatchSuggestion key={index} patch={patch} />
                    ))}
                  </div>
                ) : (
                  <div style={{
                    backgroundColor: '#f3f4f6',
                    borderRadius: '0.5rem',
                    padding: '2rem',
                    textAlign: 'center'
                  }}>
                    <p style={{ margin: '0 0 1rem 0', color: '#6b7280' }}>
                      {isSafe 
                        ? 'No fixes needed as no significant issues were found.' 
                        : 'No AI-generated fixes are available for this report yet.'}
                    </p>
                    
                    {!isSafe && (
                      <Link
                        href={`/audit?address=${report.address}&network=${report.network}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '0.5rem 1rem',
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          borderRadius: '0.375rem',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          textDecoration: 'none'
                        }}
                      >
                        Re-analyze to Generate Fixes
                      </Link>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {/* AI Discussion Tab */}
            {activeTab === 'discussion' && (
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                  Multi-AI Analysis Discussion
                </h3>
                
                {aiConversation ? (
                  <AIConversation conversation={aiConversation} />
                ) : (
                  <div style={{
                    backgroundColor: '#f3f4f6',
                    borderRadius: '0.5rem',
                    padding: '2rem',
                    textAlign: 'center'
                  }}>
                    <p style={{ margin: 0, color: '#6b7280' }}>
                      No AI discussion is available for this report.
                    </p>
                  </div>
                )}
                
                <div style={{
                  backgroundColor: '#f9fafb',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                  marginTop: '1.5rem',
                  fontSize: '0.875rem',
                  color: '#6b7280'
                }}>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    About Multi-AI Analysis
                  </h4>
                  <p style={{ margin: '0 0 0.5rem 0' }}>
                    For comprehensive security assessment, multiple AI models analyze the contract independently and then discuss their findings to reach a consensus.
                  </p>
                  <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                    <li>Multiple AI systems analyze the contract independently</li>
                    <li>False positives are reduced through cross-validation</li>
                    <li>Findings receive confidence scores based on AI consensus</li>
                    <li>Final report reflects the combined insights from all AI models</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
          
          <div style={{
            padding: '1.5rem',
            borderTop: '1px solid #e5e7eb',
            backgroundColor: '#f9fafb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <a
              href={`${
                report.network === 'sonic' 
                  ? 'https://sonicscan.org/address/' 
                  : 'https://lineascan.build/address/'
              }${report.address}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0.5rem 1rem',
                backgroundColor: 'white',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                color: '#4b5563',
                fontWeight: '500',
                textDecoration: 'none'
              }}
            >
              View on {report.network === 'sonic' ? 'SonicScan' : 'LineaScan'}
            </a>
            
            <Link
              href={`/audit?address=${report.address}&network=${report.network}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0.5rem 1rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                textDecoration: 'none'
              }}
            >
              Re-analyze Contract
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
