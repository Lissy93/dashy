const { themes } = require('prism-react-renderer');
const darkCodeTheme = themes.dracula;
const lightCodeTheme = themes.github;
const remarkGithubAlerts = require('./plugins/remark-github-alerts');

/* External URLs */
const externalUrl = {
  editUrl: 'https://github.com/Lissy93/dashy/edit/master/docs/',
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
  markdown: {
    format: 'md',
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },
  customFields: {},
  favicon: 'img/favicon.ico',
  organizationName: 'lissy93', // Usually your GitHub org/user name.
  projectName: 'dashy', // Usually your repo name.
  headTags: [
    // Preconnect to image CDNs (used for above-the-fold content)
    {
      tagName: 'link',
      attributes: { rel: 'preconnect', href: 'https://pixelflare.cc' },
    },
    {
      tagName: 'link',
      attributes: { rel: 'preconnect', href: 'https://cdn.as93.net' },
    },
    // DNS-prefetch for API and third-party domains used client-side
    {
      tagName: 'link',
      attributes: { rel: 'dns-prefetch', href: 'https://api.github.com' },
    },
    {
      tagName: 'link',
      attributes: { rel: 'dns-prefetch', href: 'https://no-track.as93.net' },
    },
    // Structured data
    {
      tagName: 'script',
      attributes: { type: 'application/ld+json' },
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Dashy',
        url: 'https://dashy.to',
        description: 'The Ultimate Homepage for your Homelab',
        publisher: {
          '@type': 'Person',
          name: 'Alicia Sykes',
          url: 'https://aliciasykes.com',
        },
      }),
    },
    {
      tagName: 'link',
      attributes: { rel: 'manifest', href: '/manifest.json' },
    },
    {
      tagName: 'meta',
      attributes: { name: 'theme-color', content: '#54bff7' },
    },
  ],
  plugins: [
    'docusaurus-plugin-sass',
    require.resolve('./plugins/github-data'),
  ],
  themes: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        indexBlog: false,
        docsRouteBasePath: '/docs',
      },
    ],
    '@docusaurus/theme-mermaid',
  ],
  themeConfig: {
    metadata: [
      { name: 'keywords', content: 'dashy, dashboard, homelab, self-hosted, docker, homepage' },
      { property: 'og:title', content: 'Dashy — The Ultimate Homepage for your Homelab' },
      { property: 'og:description', content: 'Dashy is a self-hosted dashboard app for your homelab. Manage all your services, with status checks, widgets, themes and more.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://dashy.to' },
      { property: 'og:image', content: 'https://dashy.to/img/dashy.png' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Dashy — The Ultimate Homepage for your Homelab' },
      { name: 'twitter:description', content: 'Dashy is a self-hosted dashboard app for your homelab. Manage all your services, with status checks, widgets, themes and more.' },
      { name: 'twitter:image', content: 'https://dashy.to/img/dashy.png' },
    ],
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
        { label: 'Changelog', to: '/updates' },
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
            // { label: 'Updates', to: '/updates' },
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
            { label: 'Code of Conduct', href: 'https://github.com/Lissy93/dashy/blob/master/.github/CODE_OF_CONDUCT.md' },
            { label: 'Changelog', href: 'https://github.com/Lissy93/dashy/blob/master/.github/CHANGELOG.md' },
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
          showLastUpdateTime: true,
          beforeDefaultRemarkPlugins: [remarkGithubAlerts],
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
          filename: 'sitemap.xml',
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
