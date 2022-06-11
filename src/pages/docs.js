import React from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Button from '../components/Button';

import './docs.scss';
import getColor from '../utils/ui-helpers';

import IconCloudSync from '../../static/icons/features_cloud-sync.svg';
import IconDeploy from '../../static/icons/features_depoloyment.svg';
// import IconIconography from '../../static/icons/features_icons.svg';
// import IconLayout from '../../static/icons/features_layout-customization.svg';
// import IconOpeningMethods from '../../static/icons/features_opening-methods.svg';
// import IconShortcuts from '../../static/icons/features_shortcuts.svg';
// import IconStatusIndicators from '../../static/icons/features_status-indicators.svg';
// import IconThemes from '../../static/icons/features_themes.svg';
import IconUiConfig from '../../static/icons/features_ui-configuration.svg';
import IconTroubleshooting from '../../static/icons/docs_troubleshooting.svg';
import IconManagement from '../../static/icons/docs_managment.svg';
import IconDeveloping from '../../static/icons/docs_developing.svg';
import IconDevGuides from '../../static/icons/docs_guides.svg';
import IconContributing from '../../static/icons/docs_contributing.svg';
import IconShowcase from '../../static/icons/docs_showcase.svg';
import IconCredits from '../../static/icons/docs_credits.svg';
import IconAuth from '../../static/icons/docs_authentication.svg';
import IconWidgets from '../../static/icons/features_widgets.svg';
// import IconCloudSync from '../../static/icons/docs_cloud-sync.svg';
import IconIconography from '../../static/icons/docs_icons.svg';
import IconInternationalization from '../../static/icons/docs_internationalisation.svg';
import IconStatusIndicators from '../../static/icons/docs_status-indicators.svg';
import IconTheming from '../../static/icons/docs_theming.svg';
import IconQuickStart from '../../static/icons/docs_quick-start.svg';
import IconAlternateViews from '../../static/icons/features_launching.svg';
import IconShortcuts from '../../static/icons/features_shortcuts.svg';
import IconSecurity from '../../static/icons/docs_security.svg';
import IconLegal from '../../static/icons/docs_legal.svg';
import IconConduct from '../../static/icons/docs_conduct.svg';
import IconChangelog from '../../static/icons/docs_changelog.svg';

const DocsLinks = [
  {
    title: 'Deployment',
    description: 'Getting Dashy up and running',
    link: '/docs/deployment',
    icon: (<IconDeploy />),
  },
  {
    title: 'Configuring',
    description: 'All Config Options',
    link: '/docs/configuring',
    icon: (<IconUiConfig />),
  },
  {
    title: 'Management',
    description: 'Updating, security, web server configuration, etc',
    link: '/docs/management',
    icon: (<IconManagement />),
  },
  {
    title: 'Troubleshooting',
    description: 'Solutions to Common Issues',
    link: '/docs/troubleshooting',
    icon: (<IconTroubleshooting />),
  },
];

const DocsSections = [
  {
    section: 'Running Dashy',
    items: [
      {
        title: 'Quick-Start',
        description: 'TLDR Guide on running Dashy',
        link: '/docs/quick-start',
        icon: (<IconQuickStart />),
      },
      {
        title: 'Deployment',
        description: 'Deploying Dashy to any server',
        link: '/docs/deployment',
        icon: (<IconDeploy />),
      },
      {
        title: 'Configuring',
        description: 'All Config Options',
        link: '/docs/configuring',
        icon: (<IconUiConfig />),
      },
      {
        title: 'Management',
        description: 'Updating, security, web server configuration, etc',
        link: '/docs/management',
        icon: (<IconManagement />),
      },
      {
        title: 'Troubleshooting',
        description: 'Solutions to Common Issues',
        link: '/docs/troubleshooting',
        icon: (<IconTroubleshooting />),
      },
    ]
  },
  {
    section: 'Feature Docs',
    items: [
      {
        title: 'Authentication',
        description: 'Configure login and user control',
        link: '/docs/authentication',
        icon: (<IconAuth />),
      },
      {
        title: 'Alternate Views',
        description: 'Startpage mode, Workspace and opening methods',
        link: '/docs/alternate-views',
        icon: (<IconAlternateViews />),
      },
      {
        title: 'Backup & Restore',
        description: 'Cloud Sync, usage and background',
        link: '/docs/backup-restore',
        icon: (<IconCloudSync />),
      },
      {
        title: 'Icons',
        description: 'Available icon types for sections and items',
        link: '/docs/icons',
        icon: (<IconIconography />),
      },
      {
        title: 'Language Switching',
        description: 'Changing language, and adding new locales',
        link: '/docs/multi-language-support',
        icon: (<IconInternationalization />),
      },
      {
        title: 'Status Indicators',
        description: 'Monitoring uptime of your services with Dashy',
        link: '/docs/status-indicators',
        icon: (<IconStatusIndicators />),
      },
      {
        title: 'Search & Shortcuts',
        description: 'Filtering, web search and custom hotkeys',
        link: '/docs/searching',
        icon: (<IconShortcuts />),
      },
      {
        title: 'Theming',
        description: 'Guide to customizing the look and feel of Dashy',
        link: '/docs/theming',
        icon: (<IconTheming />),
      },
      {
        title: 'Widgets',
        description: 'List of all pre-built and custom widgets supported',
        link: '/docs/widgets',
        icon: (<IconWidgets />),
      },
    ]
  },
  {
    section: 'Community',
    items: [
      {
        title: 'Developing',
        description: 'Dashy workflow, and running locally',
        link: '/docs/developing',
        icon: (<IconDeveloping />),
      },
      {
        title: 'Dev Guides',
        description: 'Common development tasks',
        link: '/docs/development-guides',
        icon: (<IconDevGuides />),
      },
      {
        title: 'Contributing',
        description: 'How you can help support Dashy\'s development',
        link: '/docs/contributing',
        icon: (<IconContributing />),
      },
      {
        title: 'Showcase',
        description: 'See how others are using Dashy, and share your dashboard',
        link: '/docs/showcase',
        icon: (<IconShowcase />),
      },
      {
        title: 'Credits',
        description: 'List of people and projects that have made Dashy possible',
        link: '/docs/credits',
        icon: (<IconCredits />),
      },
    ]
  },
  {
    section: 'Misc',
    items: [
      {
        title: 'Privacy & Security',
        description: 'Configure login and user control',
        link: '/docs/privacy',
        icon: (<IconSecurity />),
      },
      {
        title: 'License',
        description: 'Configure login and user control',
        link: '/docs/license',
        icon: (<IconLegal />),
      },
      {
        title: 'Code of Conduct',
        description: 'Configure login and user control',
        link: '/docs/code-of-conduct',
        icon: (<IconConduct />),
      },
      {
        title: 'Changelog',
        description: 'Configure login and user control',
        link: '/docs/changelog',
        icon: (<IconChangelog />),
      },
    ]
  }
];

function DocsLink({ title, description, icon, link, index }) {
  const color = getColor(index);
  return (
    <Button to={link} className="docs-link" color={color}>
      <div className="row1">
        {icon}
        <p className="name">{title}</p>
      </div>
      <span className="description">{description}</span>
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
        <h1 className="docs-title">Dashy Docs</h1>
        <p className="see-repo-note">
          <span>Note, for the most up-to-date documentation, please see the </span> 
          <a href="https://github.com/Lissy93/dashy/tree/master/docs">GitHub repository</a>
        </p>
        <div className="docs-contents">
          {DocsSections.map((DocsLinks, indexOuter) => (
            <div key={indexOuter}>
              <h3 className="section-title">{indexOuter + 1}. {DocsLinks.section}</h3>
              <div className="docs-links-section">
                {DocsLinks.items.map((props, index) => (<DocsLink key={indexOuter + index} index={indexOuter + index} {...props} />))}
              </div>
            </div>
          )
          )}
        </div>
      </main>
    </Layout>
  );
}
