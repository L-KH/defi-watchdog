import React from 'react';
import '../styles/globals.css';
import { ToastProvider } from '../components/common/Toast';

// Simple app with just the Toast provider for audit-pro functionality
function MyApp({ Component, pageProps }) {
  return (
    <ToastProvider>
      <Component {...pageProps} />
    </ToastProvider>
  );
}

export default MyApp;
