// Get current version
process.env.VUE_APP_VERSION = require('./package.json').version;

module.exports = {
  publicPath: process.env.BASE_URL, // || './',
  chainWebpack: config => {
    config.module.rules.delete('svg');
  },

  configureWebpack: {
    module: {
      rules: [
        { test: /.svg$/, loader: 'vue-svg-loader' },
      ],
    },
  },

  pwa: {
    name: 'Dashy',
    manifestPath: './public/manifest.json',
    themeColor: '#00af87',
    msTileColor: '#0b1021',
    iconPaths: {
      manifestCrossorigin: 'use-credentials',
      favicon64: './public/web-icons/favicon-64x64.png',
      favicon32: './public/web-icons/favicon-32x32.png',
      maskIcon: './public/web-icons/dashy-logo.png',
      msTileImage: './public/web-icons/dashy-logo.png',
    },
  },
  pages: {
    dashy: {
      entry: 'src/main.js',
      filename: 'index.html',
    },
  },
};
