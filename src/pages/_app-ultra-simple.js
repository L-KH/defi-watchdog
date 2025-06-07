import React from 'react';
import '../styles/globals.css';

// Ultra-simple _app for fastest loading
function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
