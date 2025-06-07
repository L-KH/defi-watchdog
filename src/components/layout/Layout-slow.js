import React from 'react';
import styles from '../../styles/components/All.module.css';

// Import components with explicit names for better debugging
import Header from './Header';
import Footer from './Footer';

// Use React.memo for performance and React 19 compatibility
const Layout = React.memo(({ children }) => {
  // Use useEffect only on client side
  React.useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    // Load navigation fix script
    const script = document.createElement('script');
    script.src = '/navigation-fix.js';
    script.async = true;
    script.onerror = () => console.warn('Navigation fix script failed to load');
    
    document.head.appendChild(script);
    
    return () => {
      // Cleanup
      try {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      } catch (error) {
        console.warn('Failed to cleanup navigation script:', error);
      }
    };
  }, []);
  
  return React.createElement(
    'div',
    { 
      className: styles.layout, 
      style: { minHeight: '100vh', display: 'flex', flexDirection: 'column' } 
    },
    React.createElement(Header),
    React.createElement(
      'main',
      { 
        className: styles.main, 
        style: { flex: 1, marginTop: '4rem' } 
      },
      children
    ),
    React.createElement(Footer)
  );
});

// Set display name for debugging
Layout.displayName = 'Layout';

// Export both named and default for maximum compatibility
export { Layout };
export default Layout;
