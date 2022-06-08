/**
 * Global config for the main Vue app. ES7 not supported here.
 * See docs for all config options: https://cli.vuejs.org/config
 */
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

// Get app mode: production, development or test
const mode = process.env.NODE_ENV || 'production';

// Get current version
process.env.VUE_APP_VERSION = require('./package.json').version;

// Get default info for PWA
const { pwa } = require('./src/utils/defaults');

// Get base URL
const publicPath = process.env.BASE_URL || '/';






// Webpack Config
const configureWebpack = {
  mode,
  module: {
    rules: [
      { test: /.svg$/, loader: 'vue-svg-loader' },
    ],
  },
  plugins: [
    new ProgressBarPlugin({ format: progressFormat }),
  ],
};

// Application pages
const pages = {
  dashy: {
    entry: 'src/main.js',
    filename: 'index.html',
  },
};

// Export the main Vue app config
module.exports = {
  publicPath,
  pwa,
  integrity,
  configureWebpack,
  pages,
  chainWebpack: config => {
    config.module.rules.delete('svg');
  },
};
