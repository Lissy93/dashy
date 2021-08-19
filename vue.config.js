/**
 * Global config for the main Vue app. ES7 not supported here.
 * See docs for all config options: https://cli.vuejs.org/config
 */
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

// Get current version
process.env.VUE_APP_VERSION = require('./package.json');

// Specify and export the main Vue app config
module.exports = {
  publicPath: process.env.BASE_URL,
  integrity: true,
  chainWebpack: config => {
    config.module.rules.delete('svg');
  },
  configureWebpack: {
    performance: { hints: false },
    module: {
      rules: [
        { test: /.svg$/, loader: 'vue-svg-loader' },
      ],
    },
    plugins: [
      // Display progress bar while building
      new ProgressBarPlugin(),
    ],
  },
  // Specify resources for PWA / mobile support
  pwa: {
    name: 'Dashy',
    manifestPath: './manifest.json',
    themeColor: '#00af87',
    msTileColor: '#0b1021',
    mode: 'production',
    iconPaths: {
      manifestCrossorigin: 'use-credentials',
      favicon64: './web-icons/favicon-64x64.png',
      favicon32: './web-icons/favicon-32x32.png',
      maskIcon: './web-icons/dashy-logo.png',
      msTileImage: './web-icons/dashy-logo.png',
    },
  },
  // Specify page for app entry point
  pages: {
    dashy: {
      entry: 'src/main.js',
      filename: 'index.html',
    },
  },
};
