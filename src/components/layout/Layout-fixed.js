import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import styles from '../../styles/components/All.module.css';

// Dynamically import Header and Footer to avoid potential SSR issues
const Header = dynamic(() => import('./Header'), { 
  ssr: false,
  loading: () => <div>Loading header...</div>
});

const Footer = dynamic(() => import('./Footer'), { 
  ssr: false,
  loading: () => <div>Loading footer...</div>
});

function Layout({ children }) {
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
}

// Ensure proper default export
export default Layout;
