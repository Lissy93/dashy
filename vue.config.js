module.exports = {
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
    },
  },
  devServer: {
    port: 8080,
    host: '0.0.0.0',
  },
};
