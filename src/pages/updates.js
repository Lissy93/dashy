import React from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import UpdatesTimeline from '../components/UpdatesTimeline';
import styles from '../styles/Updates.module.scss';

export default function Updates() {
  return (
    <Layout
      title="Updates — Dashy"
      description="Project activity timeline for Dashy — releases, tags, and commits"
    >
      <Head>
        <meta property="og:title" content="Updates — Dashy" />
        <meta property="og:description" content="Project activity timeline for Dashy — releases, tags, and commits" />
        <link rel="canonical" href="https://dashy.to/updates" />
      </Head>
      <main className={styles.updatesPage}>
        <div className={styles.pageHeader}>
          <h1>Project Updates</h1>
          <p>The latest releases and updates from Dashy</p>
        </div>
        <UpdatesTimeline />
      </main>
    </Layout>
  );
}
