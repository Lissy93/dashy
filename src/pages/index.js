import React from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

import HomePageHeader from '../components/HomePageHeader';
import HomePageFeatures from '../components/HomepageFeatures';
import Authors from '../components/Authors';

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title="Dashy -- The Ultimate Homepage for your Homelab"
      description="Dashy is an open-source, self-hosted dashboard for your homelab. Features include status checks, widgets, themes, icon packs, a UI editor, and more.">
      <Head>
        <meta property="og:title" content="Dashy — The Ultimate Homepage for your Homelab" />
        <meta property="og:description" content="Dashy is an open-source, self-hosted dashboard for your homelab. Features include status checks, widgets, themes, icon packs, a UI editor, and more." />
        <link rel="canonical" href="https://dashy.to" />
      </Head>
      <HomePageHeader />
      <HomePageFeatures />
      <main id="top">
      </main>
      <Authors />
    </Layout>
  );
}
