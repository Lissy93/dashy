import React from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.scss';


import HomePageHeader from '../components/HomePageHeader';
import HomePageFeatures from '../components/HomePageFeatures';

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Description will go into a meta tag in <head />">
      <HomePageHeader />
      <HomePageFeatures />
      <main>
      </main>
    </Layout>
  );
}
