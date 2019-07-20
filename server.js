var connect = require('connect');
var serveStatic = require('serve-static');

const port = process.env.PORT || 3002;

try {
  connect()
  .use(serveStatic(__dirname+'/dist'))
  .listen(port, () =>
    console.log(`Boom, app is running on port ${port}`)
  );
} catch(error) {
  console.log('Something fucked up', error);
}