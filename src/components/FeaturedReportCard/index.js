import React from 'react';
import Link from 'next/link';

const NetworkIcon = ({ network }) => {
  if (network === 'linea') {
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '0.25rem' }}>
        <path d="M12 22V2M2 12h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  } else if (network === 'sonic') {
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '0.25rem' }}>
        <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }
  return null;
};

const getScoreColor = (score) => {
  if (score >= 80) return '#10b981'; // Green
  if (score >= 50) return '#f59e0b'; // Orange
  return '#ef4444'; // Red
};

const formatAddress = (address) => {
  if (!address) return 'Unknown';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

const FeaturedReportCard = ({ report, large = false, showActions = true }) => {
  const { 
    id, 
    address, 
    contractName, 
    network, 
    score, 
    date, 
    issues, 
    aiAgents = 3,
    summary
  } = report;

  const isSafe = score >= 70;
  
  return (
    <div 
      style={{ 
        backgroundColor: 'white', 
        borderRadius: '0.5rem', 
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', 
        overflow: 'hidden',
        height: large ? 'auto' : '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div style={{ 
        padding: large ? '1.25rem' : '1rem',
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: isSafe ? '#f0fdf4' : '#fef2f2'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.25rem 0.5rem',
              borderRadius: '9999px',
              backgroundColor: network === 'sonic' ? '#8b5cf6' : '#2563eb',
              color: 'white',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              marginRight: '0.5rem'
            }}>
              <NetworkIcon network={network} />
              {network === 'sonic' ? 'Sonic' : 'Linea'}
            </div>
            <span style={{ fontSize: large ? '1.25rem' : '1rem', fontWeight: '600' }}>
              {contractName || `Contract-${address?.slice(0, 6)}`}
            </span>
          </div>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            width: large ? '3rem' : '2.5rem',
            height: large ? '3rem' : '2.5rem',
            borderRadius: '9999px',
            backgroundColor: getScoreColor(score),
            color: 'white',
            fontWeight: 'bold',
            fontSize: large ? '1.25rem' : '1rem'
          }}>
            {score}
          </div>
        </div>
        
        {large && (
          <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
            <span style={{ fontWeight: '500', color: '#374151' }}>Address:</span> {address}
          </div>
        )}
      </div>
      
      <div style={{ padding: large ? '1.25rem' : '1rem', flex: 1 }}>
        {!large ? (
          <>
            <div style={{ marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Address:</div>
              <div style={{ fontSize: '0.875rem', fontFamily: 'monospace' }}>{formatAddress(address)}</div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Security Score:</div>
                <div style={{ fontSize: '0.875rem', fontWeight: '500', color: getScoreColor(score) }}>{score}/100</div>
              </div>
              
              <div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Issues Found:</div>
                <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>{issues || 0}</div>
              </div>
            </div>
          </>
        ) : (
          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>Security Summary</h3>
            <p style={{ fontSize: '0.875rem', color: '#4b5563', margin: 0 }}>
              {summary || "This contract was analyzed by our AI agents for security vulnerabilities and potential issues."}
            </p>
          </div>
        )}
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          backgroundColor: '#f3f4f6', 
          padding: '0.5rem', 
          borderRadius: '0.375rem',
          marginBottom: large ? '1rem' : '0.75rem'
        }}>
          <div style={{ 
            width: '1.5rem', 
            height: '1.5rem', 
            backgroundColor: '#e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '9999px',
            marginRight: '0.5rem',
            fontSize: '0.75rem'
          }}>
            🤖
          </div>
          <div style={{ fontSize: '0.75rem', color: '#4b5563' }}>
            Analyzed by <strong>{aiAgents}</strong> AI agents
          </div>
        </div>
        
        {large && (
          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>Vulnerability Overview</h3>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {issues > 0 ? (
                <>
                  <div style={{ 
                    padding: '0.25rem 0.5rem', 
                    backgroundColor: '#fee2e2', 
                    color: '#b91c1c',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: '500'
                  }}>
                    {Math.ceil(issues * 0.2)} Critical
                  </div>
                  <div style={{ 
                    padding: '0.25rem 0.5rem', 
                    backgroundColor: '#fff7ed', 
                    color: '#c2410c',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: '500'
                  }}>
                    {Math.ceil(issues * 0.3)} High
                  </div>
                  <div style={{ 
                    padding: '0.25rem 0.5rem', 
                    backgroundColor: '#fef9c3', 
                    color: '#854d0e',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: '500'
                  }}>
                    {Math.floor(issues * 0.5)} Medium/Low
                  </div>
                </>
              ) : (
                <div style={{ 
                  padding: '0.25rem 0.5rem', 
                  backgroundColor: '#dcfce7', 
                  color: '#166534',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: '500'
                }}>
                  No vulnerabilities detected
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {showActions && (
        <div style={{ 
          padding: large ? '1.25rem' : '1rem', 
          borderTop: '1px solid #e5e7eb',
          display: 'flex', 
          justifyContent: 'space-between',
          backgroundColor: '#f9fafb'
        }}>
          <Link
            href={`/audit?address=${address}&network=${network}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.375rem 0.75rem',
              backgroundColor: 'white',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.75rem',
              fontWeight: '500',
              color: '#4b5563',
              textDecoration: 'none'
            }}
          >
            Re-analyze
          </Link>
          
          <Link
            href={`/report?id=${id}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.375rem 0.75rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              borderRadius: '0.375rem',
              fontSize: '0.75rem',
              fontWeight: '500',
              textDecoration: 'none'
            }}
          >
            View Report
          </Link>
        </div>
      )}
    </div>
  );
};

export default FeaturedReportCard;
