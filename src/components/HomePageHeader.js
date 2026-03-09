import React, { useState } from 'react'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from '../styles/Header.module.scss';

import Button from '../components/Button';
import CarbonAd from '../components/CarbonAd';

// Icons
import IconBannerDemo from '../../static/icons/banner_demo.svg';
import IconBannerGetStarted from '../../static/icons/banner_get-started.svg';
import IconBannerSource from '../../static/icons/banner_source.svg';
import IconBannerDocs from '../../static/icons/banner_docs.svg';
import IconDownArrow from '../../static/icons/interface_down.svg';

const scrollToFeatures = () => {
  document.querySelector('#features-wrap').scrollIntoView({ behavior: 'smooth' });
};

export default function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  const [showMore, setShowMore] = useState(false);
  return (
    <header className={styles.heroBanner}>
      <h1 className={styles.heroTitle}>{siteConfig.title}</h1>
      <h3 className={styles.heroSubTitle}>{siteConfig.tagline}</h3>
      <div className={styles.buttons}>
        <Button to="/docs/quick-start" color="pink"><IconBannerGetStarted />Get Started</Button>
        <Button to="https://demo.dashy.to" color="blue"><IconBannerDemo />Live Demo</Button>
        <Button to="https://github.com/Lissy93/dashy" color="green"><IconBannerSource />Source Code</Button>
        <Button to="/docs" color="yellow"><IconBannerDocs />Documentation</Button>
      </div>
      <div className={styles.dashyDescription}>
        Dashy is an open source, highly customizable, easy to use, privacy-respecting dashboard app.
        {showMore && (
          <p className={styles.dashyDescription}>
            It's packed full of useful features, to help you build your perfect dashboard.
            Including status checks, keyboard shortcuts, dynamic widgets, auto-fetched
            favicon icons and font-awesome support, built-in authentication, tons of themes,
            an interactive config editor, many display layouts plus loads more.<br />
            All the code is free and open source, and everything is thoroughly documented,
            you can get support with any questions on GitHub.
          </p>
        )}
        <span className={styles.keepReading} onClick={() => setShowMore(!showMore)}>
          {!showMore ? 'Keep Reading...' : 'Show Less'}
        </span>
      </div>
      <div className={styles.sponsorContainer}>
        <div className={styles.sponsor}>
          <span>
            Dashy is kindly sponsored by{' '}
            <a href="https://ssdnodes.com/dashy" target="_blank" rel="noopener noreferrer" style={{textDecoration: 'underline'}}>
              SSD Nodes
            </a>
            {' '}- Affordable VPS hosting for self-hosters
          </span>
          <a href="https://ssdnodes.com/dashy" target="_blank" rel="noopener noreferrer" style={{margin: '0 auto'}}>
            <img src="https://cdn.as93.net/sponsors/ssd-nodes-sponsorship.png" alt="SSD Nodes" style={{width: '100%', maxWidth: '280px', height: 'auto'}} />
          </a>
        </div>

        <div className={styles.sponsor}>
          <span>
            Dashy is kindly sponsored by{' '}
            <a href="https://umbrel.com?ref=dashy" target="_blank" rel="noopener noreferrer" style={{textDecoration: 'underline'}}>
              Umbrel
            </a>
            {' '}- the personal home cloud and OS for self-hosting
          </span>
          <a href="https://umbrel.com?ref=dashy" target="_blank" rel="noopener noreferrer" style={{margin: '0 auto'}}>
            <img src="https://cdn.as93.net/sponsors/umbrel-banner.jpg/w512" alt="Umbrel" style={{width: '100%', maxWidth: '320px', height: 'auto'}} />
          </a>
        </div>

        <div className={styles.sponsor}>
          <span>
            Dashy is kindly sponsored by{' '}
            <a href="https://www.testmuai.com/?utm_medium=sponsor&utm_source=dashy" target="_blank" rel="noopener noreferrer" style={{textDecoration: 'underline'}}>
              TestMu AI
            </a>
            {' '}- The world's first full-stack Agentic AI Quality Engineering platform
          </span>
          <a href="https://www.testmuai.com/?utm_medium=sponsor&utm_source=dashy" target="_blank" rel="noopener noreferrer" style={{margin: '0 auto'}}>
            <img src="https://cdn.as93.net/sponsors/test-mu-ai.png/w512" alt="TestMu AI" style={{width: '100%', maxWidth: '320px', height: 'auto'}} />
          </a>
        </div>
      </div>
      <CarbonAd />
      {/* {(!showMore) &&
        <a onClick={scrollToFeatures} className={styles.scrollDown}>
          <IconDownArrow className={styles.scrollDownIcon} />
          <span className={styles.scrollDownText}>Feature List</span>
          <IconDownArrow className={styles.scrollDownIcon} />
        </a>
      }*/}
      <a href="https://github.com/lissy93/dashy">
        <img className={styles.starButton}
          src="https://img.shields.io/github/stars/Lissy93/Dashy?label=Dashy%20on%20GitHub&logo=github&style=social"
        />
      </a>
    </header>
  );
}
