/**
 * Dashy is built using Vue (2). This is the main Vue and Webpack configuration
 *
 * User Configurable Options:
 * - NODE_ENV: Sets the app mode (production, development, test).
 * - BASE_URL: Root URL for the app deployment (defaults to '/').
 * - INTEGRITY: Enables SRI, set to 'true' to activate.
 * - USER_DATA_DIR: Sets an alternative dir for user data (defaults ./user-data).
 * - IS_DOCKER: Indicates if running in a Docker container.
 * - IS_SERVER: Indicates if running as a server (as opposed to static build).
 *
 * Documentation:
 * - Vue CLI Config options: https://cli.vuejs.org/config
 * - For Dashy docs, see the repo: https://github.com/lissy93/dashy
 *
 * Note: ES7 syntax is not supported in this configuration context.
 * Licensed under the MIT License, (C) Alicia Sykes 2024 (see LICENSE for details).
 */

const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// Get app mode: production, development, or test
const mode = process.env.NODE_ENV || 'production';

// Get current version
process.env.VUE_APP_VERSION = require('./package.json').version;

// Get default info for PWA
const { pwa } = require('./src/utils/defaults');

// Get base URL
const publicPath = process.env.BASE_URL || '/';

// Should enable Subresource Integrity (SRI) on link and script tags
const integrity = process.env.INTEGRITY === 'true';

// If neither env vars are set, then it's a static build
const isServer = process.env.IS_DOCKER || process.env.IS_SERVER || false;

// Use copy-webpack-plugin to copy user-data to dist IF not running as a server
const plugins = !isServer ? [
  new CopyWebpackPlugin({
    patterns: [
      { from: './user-data', to: './' },
    ],
  }),
] : [];

// Webpack Config
const configureWebpack = {
  mode,
  plugins,
  module: {
    rules: [
      { test: /.svg$/, loader: 'vue-svg-loader' },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: { appendTsSuffixTo: [/\.vue$/] },
      },
    ],
  },
  performance: {
    maxEntrypointSize: 10000000,
    maxAssetSize: 10000000,
  },
};

// Development server config
const devServer = {
  contentBase: [
    path.join(__dirname, 'public'),
    path.join(__dirname, process.env.USER_DATA_DIR || 'user-data'),
  ],
  watchContentBase: true,
  publicPath: '/',
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
  devServer,
  chainWebpack: config => {
    config.module.rules.delete('svg');
  },
};
