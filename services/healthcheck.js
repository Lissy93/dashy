/**
 * An endpoint for confirming that the application is up and running
 * Used for better Docker healthcheck results
 * Note that exiting with code 1 indicates failure, and 0 is success
 */

const http = require('http');

/* Location of the server to test */
const port = process.env.PORT || !!process.env.IS_DOCKER ? 80 : 4000;
const host = process.env.HOST || '0.0.0.0';
const timeout = 2000;

const requestOptions = { host, port, timeout };

const startTime = new Date(); // Initialize timestamp to calculate time taken

console.log(`[${startTime}] Running health check...`);

/* Starts quick HTTP server, attempts to send GET to app, then exists with appropriate exit code */
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
