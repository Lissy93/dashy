/**
 *  Note: The app must first be built (yarn build) before this script is run
 * This is the main entry point for the application, a simple server that
 * runs some checks, and then serves up the app from the ./dist directory
 * Also includes some routes for status checks/ ping and config saving
 * */
// Test
/* Include required node dependencies */
const serveStatic = require('serve-static');
const connect = require('connect');
const util = require('util');
const dns = require('dns');
const os = require('os');
const bodyParser = require('body-parser');

/* Kick of some basic checks */
require('./services/update-checker'); // Checks if there are any updates available, prints message
require('./services/config-validator'); // Include and kicks off the config file validation script

/* Include helper functions and route handlers */
const pingUrl = require('./services/ping'); // Used by the status check feature, to ping services
const saveConfig = require('./services/save-config'); // Saves users new conf.yml to file-system
const printMessage = require('./services/print-message'); // Function to print welcome msg on start
const rebuild = require('./services/rebuild-app'); // A script to programmatically trigger a build

/* Checks if app is running within a container, from env var */
const isDocker = !!process.env.IS_DOCKER;

/* Checks env var for port. If undefined, will use Port 80 for Docker, or 4000 for metal */
const port = process.env.PORT || (isDocker ? 80 : 4000);

/* Attempts to get the users local IP, used as part of welcome message */
const getLocalIp = () => {
  const dnsLookup = util.promisify(dns.lookup);
  return dnsLookup(os.hostname());
};

/* Gets the users local IP and port, then calls to print welcome message */
const printWelcomeMessage = () => {
  getLocalIp().then(({ address }) => {
    const ip = address || 'localhost';
    console.log(printMessage(ip, port, isDocker)); // eslint-disable-line no-console
  });
};

/* Just console.warns an error */
const printWarning = (msg, error) => {
  console.warn(`\x1b[103m\x1b[34m${msg}\x1b[0m\n`, error || ''); // eslint-disable-line no-console
};

/* A middleware function for Connect, that filters requests based on method type */
const method = (m, mw) => (req, res, next) => (req.method === m ? mw(req, res, next) : next());

try {
  connect()
    .use(bodyParser.json())
    // Serves up the main built application to the root
    .use(serveStatic(`${__dirname}/dist`))
    // During build, a custom page will be served before the app is available
    .use(serveStatic(`${__dirname}/public`, { index: 'default.html' }))
    // This root returns the status of a given service - used for uptime monitoring
    .use('/ping', (req, res) => {
      try {
        pingUrl(req.url, async (results) => {
          await res.end(results);
        });
      } catch (e) {
        printWarning(`Error running ping check for ${req.url}\n`, e);
      }
    })
    // POST Endpoint used to save config, by writing conf.yml to disk
    .use('/config-manager/save', method('POST', (req, res) => {
      try {
        saveConfig(req.body, (results) => {
          res.end(results);
        });
      } catch (e) {
        res.end(JSON.stringify({ success: false, message: e }));
      }
    }))
    // GET endpoint to trigger a build, and respond with success status and output
    .use('/config-manager/rebuild', (req, res) => {
      rebuild().then((response) => {
        res.end(JSON.stringify(response));
      }).catch((response) => {
        res.end(JSON.stringify(response));
      });
    })
    // Finally, initialize the server then print welcome message
    .listen(port, () => {
      try { printWelcomeMessage(); } catch (e) { printWarning('Dashy is Starting...'); }
    });
} catch (error) {
  printWarning('Sorry, a critical error occurred ', error);
}
