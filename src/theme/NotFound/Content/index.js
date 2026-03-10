import React from 'react';
import styles from '../../../styles/NotFound.module.scss';

export default function NotFoundContent() {
  return (
    <div className={styles.notFoundPage}>
      <div className={styles.particles}>
        {Array.from({ length: 20 }, (_, i) => (
          <span key={i} className={styles.particle} />
        ))}
      </div>
      <div className={styles.container}>
        <div className={styles.glitchCode}>404</div>
        <h1 className={styles.title}>Page Not Found</h1>
        <p className={styles.subtitle}>
          The page you&#39;re looking for doesn&#39;t exist or has been moved.
          Try navigating back to the docs or homepage.
        </p>
        <div className={styles.navLinks}>
          <a href="/" className={`${styles.navLink} ${styles.primaryLink}`}>
            Home
          </a>
          <a href="/docs" className={`${styles.navLink} ${styles.secondaryLink}`}>
            Documentation
          </a>
          <a href="/docs/quick-start" className={`${styles.navLink} ${styles.secondaryLink}`}>
            Quick Start
          </a>
        </div>
      </div>
    </div>
  );
}
