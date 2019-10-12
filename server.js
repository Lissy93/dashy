const connect = require('connect');
const serveStatic = require('serve-static');

const port = process.env.PORT || 3002;

/* eslint no-console: 0 */
try {
  connect()
    .use(serveStatic(`${__dirname}/dist`))
    .listen(port, () => console.log(`Boom, app is running on port ${port} 🚀`));
} catch (error) {
  console.log('Something fucked up', error);
}
