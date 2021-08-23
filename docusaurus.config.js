const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

const licenseUrl = 'https://github.com/Lissy93/dashy/blob/master/LICENSE';
const aliciaUrl = 'https://aliciasykes.com';
const dashyUrl = 'https://dashy.to';

const footerText = `<a href="${dashyUrl}">Dashy</a> - The Self-Hosted Dashboard for your Homelab`
  + `<br>License under <a href="${licenseUrl}">MIT</a>. `
  + `Copyright © ${new Date().getFullYear()} <a href="${aliciaUrl}">Alicia Sykes</a>`;

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'Dashy',
  tagline: 'The Ultimate Homepage for your Homelab',
  url: 'https://dashy.to',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'facebook', // Usually your GitHub org/user name.
  projectName: 'docusaurus', // Usually your repo name.
  plugins: ['docusaurus-plugin-sass'],
  themeConfig: {
    navbar: {
      title: 'Dashy',
      logo: {
        alt: 'My Site Logo',
        src: 'img/dashy-512.png',
      },
      items: [

      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Intro',
          items: [
            { label: 'GitHub', to: 'https://github.com/lissy93/dashy' },
            { label: 'Live Demo', to: 'https://demo.dashy.to' },
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
            { label: 'Authentication', to: '/docs/deployment' },
            { label: 'Alternate Views', to: '/docs/configuring' },
            { label: 'Backup & Restore', to: '/docs/management' },
            { label: 'Icons', to: '/docs/troubleshooting' },
          ],
        },
        {
          title: 'Feature Docs Pt 2',
          items: [
            { label: 'Language Switching', to: '/docs/troubleshooting' },
            { label: 'Status Indicators', to: '/docs/troubleshooting' },
            { label: 'Searching  & Shortcuts', to: '/docs/troubleshooting' },
            { label: 'Theming', to: '/docs/troubleshooting' },
          ],
        },
        {
          title: 'Developing & Community',
          items: [
            { label: 'Developing', to: '/docs/deployment' },
            { label: 'Development Guides', to: '/docs/configuring' },
            { label: 'Contributing', to: '/docs/management' },
            { label: 'Showcase', to: '/docs/troubleshooting' },
            { label: 'Credits', to: '/docs/troubleshooting' },
          ],
        },
        {
          title: 'Misc',
          items: [
            { label: 'Privacy & Security', to: '/docs/deployment' },
            { label: 'License', to: '/docs/configuring' },
            { label: 'Legal', to: '/docs/management' },
            { label: 'Code of Conduct', to: '/docs/troubleshooting' },
            { label: 'Changelog', to: '/docs/troubleshooting' },
          ],
        },
      ],
      copyright: footerText,
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/facebook/docusaurus/edit/master/website/',
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
};
