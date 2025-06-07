import React, { useEffect } from 'react';
import styles from '../../styles/components/All.module.css';

// Import components directly without dynamic imports to avoid SSR issues
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  useEffect(() => {
    // Load navigation fix script
    const script = document.createElement('script');
    script.src = '/navigation-fix.js';
    script.async = true;
    document.head.appendChild(script);
    
    return () => {
      // Cleanup
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);
  
  return (
    <div className={styles.layout} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main className={styles.main} style={{ flex: 1, marginTop: '4rem' }}>{children}</main>
      <Footer />
    </div>
  );
};

// Use named export as well as default export for compatibility
export { Layout };
export default Layout;
