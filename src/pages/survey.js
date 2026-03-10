import React from 'react';
import Layout from '@theme/Layout';
import '../styles/Survey.scss';

export default function Survey() {
  return (
    <Layout
      title="Dashy Survey"
      description="Documentation | Dashy, a self-hosted dashboard for your homelab">
      <main className="survey">
        <iframe id="dashy-survey" src="https://n9fy6xak9yd.typeform.com/to/gl0L68ou" loading="lazy" title="Dashy User Survey"></iframe>
      </main>
    </Layout>
  );
}
