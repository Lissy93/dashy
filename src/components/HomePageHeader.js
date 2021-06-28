import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from '../styles/Header.module.scss';

import Button from '../components/Button';
// Icons
import IconBannerDemo from '../../static/icons/banner_demo.svg';
import IconBannerGetStarted from '../../static/icons/banner_get-started.svg';
import IconBannerSource from '../../static/icons/banner_source.svg';
import IconBannerDocs from '../../static/icons/banner_docs.svg';

export default function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={styles.heroBanner}>
      <h1 className={styles.heroTitle}>{siteConfig.title}</h1>
      <h3 className={styles.heroSubTitle}>{siteConfig.tagline}</h3>
      <div className={styles.buttons}>
        <Button to="/docs" color="pink"><IconBannerDemo />Try it Out</Button>
        <Button to="/docs" color="blue"><IconBannerGetStarted />Get Started</Button>
        <Button to="/docs" color="green"><IconBannerSource />Source Code</Button>
        <Button to="/docs" color="yellow"><IconBannerDocs />Documentation</Button>
      </div>
    </header>
  );
}
