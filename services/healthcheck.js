/**
 * An endpoint for confirming that the application is up and running
 * Used for better Docker healthcheck results
 * Note that exiting with code 1 indicates failure, and 0 is success
 */

const fs = require('fs');
/* setting default paths for public and pvt keys to match of ssl-server.js */
const httpsCerts = {
  private: process.env.SSL_PRIV_KEY_PATH || '/etc/ssl/certs/dashy-priv.key',
  public: process.env.SSL_PUB_KEY_PATH || '/etc/ssl/certs/dashy-pub.pem',
};

/* Check if either if simular conditions exist that would of had ssl-server.js to enable ssl */
const isSsl = !!fs.existsSync(httpsCerts.private) && !!fs.existsSync(httpsCerts.public);

// eslint-disable-next-line import/no-dynamic-require
const http = require(isSsl ? 'https' : 'http');

/* Location of the server to test */
const isDocker = !!process.env.IS_DOCKER;

/* Get the port to use (depending on, if docker, if SSL) */
const sslPort = process.env.SSL_PORT || (isDocker ? 443 : 4001);
const normalPort = process.env.PORT || (isDocker ? 8080 : 4000);
const port = isSsl ? sslPort : normalPort;

const host = process.env.HOST || '0.0.0.0';
const timeout = 2000;

const agent = new http.Agent({
  rejectUnauthorized: false, // Allow self-signed certificates
});

const requestOptions = {
  host, port, timeout, agent,
};

const startTime = new Date(); // Initialize timestamp to calculate time taken

console.log(`[${startTime}] Running health check...`);

/* Creates an HTTP Request to attempt to send GET to app, then exits with appropriate exit code */
const healthCheck = http.request(requestOptions, (response) => {
  const totalTime = (new Date() - startTime) / 1000;
  const status = response.statusCode;
  const color = status === 200 ? '\x1b[32m' : '\x1b[31m';
  const message = `${color}Status: ${status}\nRequest took ${totalTime} seconds\n\x1b[0m---`;
  console.log(message); // Print out healthcheck response
  process.exit(status === 200 ? 0 : 1); // Exit with 0 (success), if response is 200 okay
});

/* If the server is not running, then print the error code, and exit with 1 */
healthCheck.on('error', (err) => {
  console.error(`\x1b[31mHealthceck Failed, Error: ${'\x1b[33m'}${err.code}\x1b[0m`);
  process.exit(1);
});

healthCheck.end();
