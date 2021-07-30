import React from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Button from '../components/Button';

import './docs.scss';

import getColor from '../utils/ui-helpers';
import IconShortcuts from '../../static/icons/features_shortcuts.svg';

const DocsLinks = [
  {
    title: 'Deployment',
    description: '',
    link: '',
    icon: (<IconShortcuts />),
  },
  {
    title: 'Configuring',
    description: '',
    link: '',
    icon: (<IconShortcuts />),
  },
  {
    title: 'Management',
    description: '',
    link: '',
    icon: (<IconShortcuts />),
  },
  {
    title: 'Troubleshooting',
    description: '',
    link: '',
    icon: (<IconShortcuts />),
  },
];

function DocsLink({ title, description, icon, link, index }) {
  const color = getColor(index);
  return (
    <Button to={link} className="docs-link" color={color}>
      <div className="docs-icon">{icon}</div>
      <div className="docs-text">
        <p>{title}</p>
        <p>{description}</p>
      </div>
    </Button>
  );
}

export default function Docs() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Documentation | Dashy, a self-hosted dashboard for your homelab">
      <main className="docs">
        <h1>Docs</h1>
        <div className="docs-contents">
          {DocsLinks.map((props, index) => (
            <DocsLink key={index} index={index} {...props} />
          )
          )}
        </div>
      </main>
    </Layout>
  );
}
