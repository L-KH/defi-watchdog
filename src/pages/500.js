import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Custom500() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f9fafb',
      padding: '1rem'
    }}>
      <Head>
        <title>Server Error - DeFi Watchdog</title>
      </Head>
      
      <div style={{
        maxWidth: '28rem',
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        overflow: 'hidden',
        textAlign: 'center',
        padding: '2.5rem'
      }}>
        <div style={{
          marginBottom: '1.5rem',
          fontSize: '6rem',
          fontWeight: 'bold',
          color: '#ef4444',
          lineHeight: '1'
        }}>
          500
        </div>
        
        <h1 style={{
          marginBottom: '1rem',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#111827'
        }}>
          Server Error
        </h1>
        
        <p style={{
          marginBottom: '2rem',
          color: '#6b7280'
        }}>
          We're sorry, but there was an error on our server. This is not your fault, and our team has been notified about this issue.
        </p>
        
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem'
        }}>
          <button
            onClick={() => window.location.reload()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#3b82f6',
              color: 'white',
              fontWeight: '500',
              padding: '0.625rem 1.25rem',
              borderRadius: '0.375rem',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 150ms'
            }}
          >
            Refresh Page
          </button>
          
          <Link href="/" style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#e5e7eb',
            color: '#374151',
            fontWeight: '500',
            padding: '0.625rem 1.25rem',
            borderRadius: '0.375rem',
            textDecoration: 'none',
            transition: 'background-color 150ms'
          }}>
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
