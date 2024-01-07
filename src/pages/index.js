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
      description="Description will go into a meta tag in <head />">
        <script async type="text/javascript" src="//cdn.carbonads.com/carbon.js?serve=CWYIC53L&placement=dashyto" id="_carbonads_js"></script>
      <HomePageHeader />
      <HomePageFeatures />
      <main>
      </main>
    </Layout>
  );
}
