import React from 'react';
import Header from './Header';
import Footer from './Footer';
import styles from '../../styles/components/All.module.css';

export default function Layout({ children }) {
  return (
    <div className={styles.layout} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main className={styles.main} style={{ flex: 1, marginTop: '4rem' }}>{children}</main>
      <Footer />
    </div>
  );
}
