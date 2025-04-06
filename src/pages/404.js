import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Custom404() {
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
        <title>Page Not Found - DeFi Watchdog</title>
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
          color: '#3b82f6',
          lineHeight: '1'
        }}>
          404
        </div>
        
        <h1 style={{
          marginBottom: '1rem',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#111827'
        }}>
          Page Not Found
        </h1>
        
        <p style={{
          marginBottom: '2rem',
          color: '#6b7280'
        }}>
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem'
        }}>
          <Link href="/" style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#3b82f6',
            color: 'white',
            fontWeight: '500',
            padding: '0.625rem 1.25rem',
            borderRadius: '0.375rem',
            textDecoration: 'none',
            transition: 'background-color 150ms'
          }}>
            Go to Home
          </Link>
          
          <Link href="/dashboard" style={{
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
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
