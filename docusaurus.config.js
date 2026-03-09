const { themes } = require('prism-react-renderer');
const darkCodeTheme = themes.dracula;
const lightCodeTheme = themes.github;

/* External URLs */
const externalUrl = {
  editUrl: 'https://github.com/Lissy93/dashy/edit/gh-pages/docs/',
  licenseUrl: 'https://github.com/Lissy93/dashy/blob/master/LICENSE',
  aliciaUrl: 'https://aliciasykes.com',
  dashyUrl: 'https://dashy.to',
};

const footerText = `<a href="${externalUrl.dashyUrl}">Dashy</a> - The Self-Hosted Dashboard for your Homelab`
  + `<br />License under <a href="${externalUrl.licenseUrl}">MIT</a>. `
  + `Copyright © ${new Date().getFullYear()} <a href="${externalUrl.aliciaUrl}">Alicia Sykes</a>`;

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'Dashy',
  tagline: 'The Ultimate Homepage for your Homelab',
  url: externalUrl.dashyUrl,
  baseUrl: '/',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  markdown: {
    format: 'md',
  },
  favicon: 'img/favicon.ico',
  organizationName: 'lissy93', // Usually your GitHub org/user name.
  projectName: 'dashy', // Usually your repo name.
  plugins: ['docusaurus-plugin-sass'],
  themes: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        indexBlog: false,
        docsRouteBasePath: '/docs',
      },
    ],
  ],
  themeConfig: {
    // Dark & Light Mode
    colorMode: {
      defaultMode: 'dark',
    },
    // Prism Code Highlighting
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
    },
    // Top Navigation Bar
    navbar: {
      title: 'Dashy',
      logo: {
        alt: 'Dashy Logo',
        src: 'img/dashy.png',
      },
      items: [
        { label: 'GitHub', href: 'https://github.com/lissy93/dashy' },
        { label: 'Live Demo', href: 'https://demo.dashy.to' },
        { label: 'Quick Start', to: '/docs/quick-start' },
        { label: 'Documentation', to: '/docs' },
      ],
    },
    // Page Footer Links
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Intro',
          items: [
            { label: 'GitHub', href: 'https://github.com/lissy93/dashy' },
            { label: 'Live Demo', href: 'https://demo.dashy.to' },
            { label: 'Quick Start', to: '/docs/quick-start' },
            { label: 'Documentation', to: '/docs' },
          ],
        },
        {
          title: 'Setup Guide',
          items: [
            { label: 'Deploying', to: '/docs/deployment' },
            { label: 'Configuring', to: '/docs/configuring' },
            { label: 'Management', to: '/docs/management' },
            { label: 'Troubleshooting', to: '/docs/troubleshooting' },
          ],
        },
        {
          title: 'Feature Docs Pt 1',
          items: [
            { label: 'Authentication', to: '/docs/authentication' },
            { label: 'Alternate Views', to: '/docs/alternate-views' },
            { label: 'Backup & Restore', to: '/docs/backup-restore' },
            { label: 'Icons', to: '/docs/icons' },
          ],
        },
        {
          title: 'Feature Docs Pt 2',
          items: [
            { label: 'Language Switching', to: '/docs/multi-language-support' },
            { label: 'Status Indicators', to: '/docs/status-indicators' },
            { label: 'Searching  & Shortcuts', to: '/docs/searching' },
            { label: 'Theming', to: '/docs/theming' },
          ],
        },
        {
          title: 'Community',
          items: [
            { label: 'Developing', to: '/docs/developing' },
            { label: 'Development Guides', to: '/docs/development-guides' },
            { label: 'Contributing', to: '/docs/contributing' },
            { label: 'Showcase', to: '/docs/showcase' },
            { label: 'Credits', to: '/docs/credits' },
          ],
        },
        {
          title: 'Misc',
          items: [
            { label: 'Privacy & Security', to: '/docs/privacy' },
            { label: 'License', to: '/docs/license' },
            { label: 'Legal', href: 'https://github.com/Lissy93/dashy/blob/master/.github/LEGAL.md' },
            { label: 'Code of Conduct', to: '/docs/code-of-conduct' },
            { label: 'Changelog', to: '/docs/changelog' },
          ],
        },
      ],
      copyright: footerText,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: externalUrl.editUrl,
        },
        theme: {
          customCss: [
            require.resolve('./src/styles/Colors.scss'),
            require.resolve('./src/styles/Typography.scss'),
            require.resolve('./src/styles/custom.scss'),
          ]
        },
      },
    ],
  ],
  scripts: [
    // Plausible Analytics (no tracking, just hit counter, using self-hosted Plausible)
    {src: 'https://no-track.as93.net/js/script.js', defer: true, 'data-domain': 'dashy.to'},
  ],
};
