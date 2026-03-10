import React from 'react';
import Layout from '@theme/Layout';
import NotFoundContent from '@theme/NotFound/Content';

export default function NotFound() {
  return (
    <Layout title="Page Not Found" description="The page you were looking for could not be found.">
      <NotFoundContent />
    </Layout>
  );
}
