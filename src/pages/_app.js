import React from 'react';
import '../styles/globals.css';
import { ToastProvider } from '../components/common/Toast';
import ErrorBoundary from '../components/ErrorBoundary';

function MyApp({ Component, pageProps }) {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <Component {...pageProps} />
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default MyApp;