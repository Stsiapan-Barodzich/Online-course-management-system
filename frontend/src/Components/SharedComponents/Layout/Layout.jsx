import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import styles from '@Styles/layout.module.css';

const Layout = () => {
  return (
    <div className={styles.appContainer}>
      <Sidebar />
      <div className={styles.mainContent}>
        <Header />
        <main className={styles.contentWrapper}>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;

