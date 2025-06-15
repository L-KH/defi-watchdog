import React from 'react';
import styles from '../../styles/components/All.module.css';
import Header from './Header';
import Footer from './Footer';

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

Layout.displayName = 'Layout';

export { Layout };
export default Layout;