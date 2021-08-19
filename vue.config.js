/**
 * Global config for the main Vue app. ES7 not supported here.
 * See docs for all config options: https://cli.vuejs.org/config
 */
const webpack = require('webpack');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

// Get current version
const { version } = require('./package.json');

// Set the current version, for use within the app
process.env.VUE_APP_VERSION = version;

// Make banner text, for output files
const banner = (() => {
  const now = new Date();
  const line1 = `Dashy ${version}. Built at ${now.toLocaleTimeString()} on ${now.toLocaleDateString()}`;
  const line2 = `Licensed under MIT - (C) Alicia Sykes ${now.getFullYear()}`;
  const line3 = 'Code + docs: https://github.com/lissy93/dashy';
  return `${line1}\n${line2}\n${line3}`;
})();

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
      // Insert banner into output chunks
      new webpack.BannerPlugin({ banner }),
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
