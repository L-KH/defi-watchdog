'use client';
import React from 'react';
import Link from 'next/link';

// Renders a card for a featured security report
export default function FeaturedReportCard({ report, large = false }) {
  if (!report) return null;

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return 'Invalid Date';
    }
  };

  // Format address helper
  const formatAddress = (address) => {
    if (!address) return 'Unknown';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Helper to get score color
  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981'; // Green
    if (score >= 50) return '#f59e0b'; // Orange
    return '#ef4444'; // Red
  };

  // Helper to get score background
  const getScoreBg = (score) => {
    if (score >= 80) return '#ecfdf5'; // Light green
    if (score >= 50) return '#fffbeb'; // Light orange
    return '#fef2f2'; // Light red
  };

  // Network icon components
  const NetworkIcon = ({ network }) => {
    if (network === 'linea') {
      return (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '0.25rem' }}>
          <path d="M12 22V2M2 12h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    }
    
    if (network === 'sonic') {
      return (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '0.25rem' }}>
          <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    }
    
    return null;
  };

  // Style variations based on card size
  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    overflow: 'hidden',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    position: 'relative',
    cursor: 'pointer',
  };

  const largeCardStyle = {
    ...cardStyle,
    display: 'grid',
    gridTemplateColumns: large ? '1fr 1fr' : '1fr',
    gap: large ? '1rem' : 0,
  };

  return (
    <Link href={`/report?id=${report.id}`} passHref>
      <div style={large ? largeCardStyle : cardStyle} className="hover:shadow-md hover:-translate-y-1">
        {/* Card media section */}
        <div style={{ 
          height: large ? 'auto' : '140px', 
          backgroundColor: getScoreBg(report.score),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: large ? '2rem' : '1rem'
        }}>
          {/* Security score circle */}
          <div style={{
            width: large ? '120px' : '80px',
            height: large ? '120px' : '80px',
            borderRadius: '50%',
            backgroundColor: 'white',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column'
          }}>
            <div style={{
              fontSize: large ? '2.5rem' : '1.75rem',
              fontWeight: 'bold',
              color: getScoreColor(report.score)
            }}>
              {Math.round(report.score) || 0}
            </div>
            <div style={{
              fontSize: large ? '0.875rem' : '0.75rem',
              color: '#4b5563'
            }}>
              Score
            </div>
          </div>
        </div>
        
        {/* Card content section */}
        <div style={{ padding: '1.25rem' }}>
          <div style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
            <NetworkIcon network={report.network} />
            <span style={{ 
              fontSize: '0.75rem', 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em',
              fontWeight: '600',
              color: '#6b7280'
            }}>
              {report.network || 'Unknown Network'}
            </span>
          </div>
          
          <h3 style={{ 
            fontSize: large ? '1.5rem' : '1.125rem', 
            fontWeight: '600',
            marginBottom: '0.5rem',
            color: '#1f2937'
          }}>
            {report.contractName || 'Unknown Contract'}
          </h3>
          
          <div style={{
            fontFamily: 'monospace',
            fontSize: '0.75rem',
            color: '#6b7280',
            marginBottom: '0.75rem'
          }}>
            {formatAddress(report.address)}
          </div>
          
          <p style={{
            fontSize: '0.875rem',
            color: '#4b5563',
            marginBottom: '1rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: large ? 4 : 2,
            WebkitBoxOrient: 'vertical'
          }}>
            {report.description || 'No description available.'}
          </p>
          
          {/* Stats row */}
          <div style={{
            display: 'flex',
            fontSize: '0.75rem',
            color: '#6b7280',
            marginTop: 'auto'
          }}>
            <div style={{ marginRight: '1rem' }}>
              <span style={{ fontWeight: '600' }}>{report.vulnerabilityCount || 0}</span> Issues
            </div>
            
            {report.criticalCount > 0 && (
              <div style={{ color: '#ef4444' }}>
                <span style={{ fontWeight: '600' }}>{report.criticalCount}</span> Critical
              </div>
            )}
            
            <div style={{ marginLeft: 'auto' }}>
              {formatDate(report.date)}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}