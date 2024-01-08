import React from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Head from '@docusaurus/Head';
import styles from './index.module.scss';


import HomePageHeader from '../components/HomePageHeader';
import HomePageFeatures from '../components/HomepageFeatures';

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Dashy, the self-hosted dashboard app for your homelab">
      <HomePageHeader />
      <HomePageFeatures />
      <main>  
      </main>
    </Layout>
  );
}
