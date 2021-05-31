module.exports = {
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
    themeColor: '#00CCB4',
    msTileColor: '#0b1021',
    manifestCrossorigin: 'use-credentials',
  },
};
