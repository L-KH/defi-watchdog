import React, { useState, useEffect } from 'react';
import '../styles/globals.css';
import { WalletProvider } from '../context/WalletContext';
import ErrorBoundary from '../components/ErrorBoundary';

function MyApp({ Component, pageProps }) {
  // Use client-side only rendering to avoid hydration issues
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Provide a simple loading screen while waiting for client-side hydration
  if (!isClient) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#f9fafb' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '1rem' }}>
            <div className="animate-spin h-8 w-8 text-blue-500 mx-auto" style={{ 
              border: '4px solid #e5e7eb', 
              borderTopColor: '#3b82f6', 
              borderRadius: '50%', 
              width: '2rem', 
              height: '2rem', 
              animation: 'spin 1s linear infinite' 
            }} />
          </div>
          <p style={{ color: '#6b7280' }}>Loading DeFi Watchdog...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <WalletProvider>
        <Component {...pageProps} />
      </WalletProvider>
    </ErrorBoundary>
  );
}

export default MyApp;
