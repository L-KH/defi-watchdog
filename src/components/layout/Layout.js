import React from 'react';
import styles from '../../styles/components/All.module.css';

// Import components with explicit names for better debugging
import Header from './Header';
import Footer from './Footer';

// Ultra-simple Layout for maximum speed
const Layout = ({ children }) => {
  return (
    <div className={styles.layout} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main className={styles.main} style={{ flex: 1, marginTop: '5rem' }}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

// Set display name for debugging
Layout.displayName = 'Layout';

// Export both named and default for maximum compatibility
export { Layout };
export default Layout;
