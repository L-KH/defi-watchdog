import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import '../styles/globals.css';
import { WalletProvider } from '../context/WalletContext';
import { ToastProvider } from '../components/common/Toast';
import ErrorBoundary from '../components/ErrorBoundary';

function MyApp({ Component, pageProps }) {
  // Use client-side only rendering to avoid hydration issues
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  
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
            <div style={{ 
              border: '4px solid #e5e7eb', 
              borderTopColor: '#3b82f6', 
              borderRadius: '50%', 
              width: '2rem', 
              height: '2rem', 
              animation: 'spin 1s linear infinite',
              margin: '0 auto'
            }} />
          </div>
          <p style={{ color: '#6b7280' }}>Loading DeFi Watchdog...</p>
        </div>
        
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <ToastProvider>
        <WalletProvider>
          <Component {...pageProps} />
        </WalletProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

// Use named export as well for React 19 compatibility
export { MyApp };
export default MyApp;
