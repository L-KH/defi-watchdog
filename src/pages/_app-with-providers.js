import React from 'react';
import '../styles/globals.css';
import { WalletProvider } from '../context/WalletContext';
import { ToastProvider } from '../components/common/Toast';
import ErrorBoundary from '../components/ErrorBoundary';

function MyApp({ Component, pageProps }) {
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

export default MyApp;
