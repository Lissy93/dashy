/**
 * Global config for the main Vue app. ES7 not supported here.
 * See docs for all config options: https://cli.vuejs.org/config
 */

const fs = require('fs');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// Get app mode: production, development or test
const mode = process.env.NODE_ENV || 'production';

// Get current version
process.env.VUE_APP_VERSION = require('./package.json').version;

// Get default info for PWA
const { pwa } = require('./src/utils/defaults');

// Get base URL
const publicPath = process.env.BASE_URL || '/';

// Should enable Subresource Integrity (SRI) on link and script tags
const integrity = process.env.INTEGRITY === 'true';

// When deploying as a static site, we must ensure user-data is copied over
class ConditionalCopyPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.beforeRun.tapAsync('ConditionalCopyPlugin', (_compilation, callback) => {
      const targetDir = path.resolve(compiler.options.output.path, this.options.to);
      if (!fs.existsSync(targetDir)) {
        new CopyWebpackPlugin({
          patterns: [
            { from: path.resolve(__dirname, this.options.from), to: targetDir },
          ],
        }).apply(compiler);
      }
      callback();
    });
  }
}

// Webpack Config
const configureWebpack = {
  mode,
  plugins: [
    new ConditionalCopyPlugin({ from: 'user-data', to: 'user-data' }),
  ],
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
