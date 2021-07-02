const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const WebpackBuildNotifierPlugin = require('webpack-build-notifier');

// Get current version
process.env.VUE_APP_VERSION = require('./package.json').version;

module.exports = {
  publicPath: process.env.BASE_URL, // || './',
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
      new ProgressBarPlugin(),
      new WebpackBuildNotifierPlugin({
        title: 'Dashy Build Complete',
        logo: './public/web-icons/dashy-logo.png',
        suppressSuccess: true,
        showDuration: true,
      }),
    ],
  },
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
  pages: {
    dashy: {
      entry: 'src/main.js',
      filename: 'index.html',
    },
  },
};
