/**
 *  Note: The app must first be built (yarn build) before this script is run
 * This is the main entry point for the application, a simple server that
 * runs some checks, and then serves up the app from the ./dist directory
 * Also includes some routes for status checks/ ping and config saving
 * */

/* Include required node dependencies */
const express = require('express');
const util = require('util');
const dns = require('dns');
const os = require('os');
const history = require('connect-history-api-fallback');

/* Kick of some basic checks */
require('./services/update-checker'); // Checks if there are any updates available, prints message
require('./services/config-validator'); // Include and kicks off the config file validation script

/* Include route handlers for API endpoints */
const statusCheck = require('./services/status-check'); // Used by the status check feature, uses GET
const saveConfig = require('./services/save-config'); // Saves users new conf.yml to file-system
const rebuild = require('./services/rebuild-app'); // A script to programmatically trigger a build

/* Helper functions, and default config */
const printMessage = require('./services/print-message'); // Function to print welcome msg on start
const ENDPOINTS = require('./src/utils/defaults').serviceEndpoints; // API endpoint URL paths

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

const app = express()
  .use(history())
  .use(express.json())
  // Serves up the main built application to the root
  .use(express.static(`${__dirname}/dist`))
  .use(express.static(`${__dirname}/public`, { index: 'default.html' }))
  // GET endpoint to run status of a given URL with GET request
  .use(ENDPOINTS.statusCheck, (req, res) => {
    try {
      statusCheck(req.url, async (results) => {
        await res.end(results);
      });
    } catch (e) {
      printWarning(`Error running status check for ${req.url}\n`, e);
    }
  })
  // POST Endpoint used to save config, by writing conf.yml to disk
  .use(ENDPOINTS.save, method('POST', (req, res) => {
    try {
      saveConfig(req.body, (results) => { res.end(results); });
    } catch (e) {
      res.end(JSON.stringify({ success: false, message: e }));
    }
  }))
  // GET endpoint to trigger a build, and respond with success status and output
  .use(ENDPOINTS.rebuild, (req, res) => {
    rebuild().then((response) => {
      res.end(JSON.stringify(response));
    }).catch((response) => {
      res.end(JSON.stringify(response));
    });
  });

// Finally, initialize the server then print welcome message
app.listen(port, () => {
  try { printWelcomeMessage(); } catch (e) { printWarning('Dashy is Starting...'); }
});
