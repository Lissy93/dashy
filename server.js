/**
 * This is the main entry point for the application, a simple server that
 * runs some checks, and then serves up the app from the ./dist directory
 * Also imports some routes for status checks/ ping and config saving
 * Note: The app must first be built (yarn build) before this script is run
 * */

/* Import built-in Node server modules */
const fs = require('fs');
const os = require('os');
const dns = require('dns');
const http = require('http');
const path = require('path');
const util = require('util');
const crypto = require('crypto');

/* Import NPM dependencies */
const yaml = require('js-yaml');

/* Import Express + middleware functions */
const express = require('express');
const basicAuth = require('express-basic-auth');
const history = require('connect-history-api-fallback');

/* Kick of some basic checks */
require('./services/update-checker'); // Checks if there are any updates available, prints message

let config = {}; // setup the config
config = require('./services/config-validator'); // Include and kicks off the config file validation script

/* Include route handlers for API endpoints */
const statusCheck = require('./services/status-check'); // Used by the status check feature, uses GET
const saveConfig = require('./services/save-config'); // Saves users new conf.yml to file-system
const rebuild = require('./services/rebuild-app'); // A script to programmatically trigger a build
const systemInfo = require('./services/system-info'); // Basic system info, for resource widget
const sslServer = require('./services/ssl-server'); // TLS-enabled web server
const corsProxy = require('./services/cors-proxy'); // Enables API requests to CORS-blocked services
const getUser = require('./services/get-user'); // Enables server side user lookup

/* Helper functions, and default config */
const printMessage = require('./services/print-message'); // Function to print welcome msg on start
const ENDPOINTS = require('./src/utils/defaults').serviceEndpoints; // API endpoint URL paths

/* Checks if app is running within a container, from env var */
const isDocker = !!process.env.IS_DOCKER;

/* Checks env var for port. If undefined, will use Port 8080 for Docker, or 4000 for metal */
const port = process.env.PORT || (isDocker ? 8080 : 4000);

/* Checks env var for host. If undefined, will use 0.0.0.0 */
const host = process.env.HOST || '0.0.0.0';

/* Indicates for the webpack config, that running as a server */
process.env.IS_SERVER = 'True';

/* Attempts to get the users local IP, used as part of welcome message */
const getLocalIp = () => {
  const dnsLookup = util.promisify(dns.lookup);
  return dnsLookup(os.hostname());
};

/* Gets the users local IP and port, then calls to print welcome message */
const printWelcomeMessage = () => {
  try {
    getLocalIp().then(({ address }) => {
      const ip = process.env.HOST || address || 'localhost';
      console.log(printMessage(ip, port, isDocker)); // eslint-disable-line no-console
    });
  } catch (e) {
    // No clue what could of gone wrong here, but print fallback message if above failed
    console.log(`Dashy server has started (${port})`); // eslint-disable-line no-console
  }
};

/* Just console.warns an error */
const printWarning = (msg, error) => {
  console.warn(`\x1b[103m\x1b[34m${msg}\x1b[0m\n`, error || ''); // eslint-disable-line no-console
};

/* Load appConfig.auth.users from config (if present) for authorization purposes */
function loadUserConfig() {
  try {
    const filePath = path.join(__dirname, process.env.USER_DATA_DIR || 'user-data', 'conf.yml');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = yaml.load(fileContents);
    return data?.appConfig?.auth?.users || null;
  } catch (e) {
    return [];
  }
}

/* If HTTP auth is enabled, and no username/password are pre-set, then check passed credentials */
function customAuthorizer(username, password) {
  const sha256 = (input) => crypto.createHash('sha256').update(input).digest('hex').toUpperCase();
  const generateUserToken = (user) => {
    if (!user.user || (!user.hash && !user.password)) return '';
    const strAndUpper = (input) => input.toString().toUpperCase();
    const passwordHash = user.hash || sha256(process.env[user.password]);
    const sha = sha256(strAndUpper(user.user) + strAndUpper(passwordHash));
    return strAndUpper(sha);
  };
  if (password.startsWith('Bearer ')) {
    const token = password.slice('Bearer '.length);
    const users = loadUserConfig();
    return users.some(user => generateUserToken(user) === token);
  } else {
    const users = loadUserConfig();
    const userHash = sha256(password);
    return users.some(user => (
      user.user.toLowerCase() === username.toLowerCase() && user.hash.toUpperCase() === userHash
    ));
  }
}

/* If a username and password are set, setup auth for config access, otherwise skip */
function getBasicAuthMiddleware() {
  const configUsers = process.env.ENABLE_HTTP_AUTH ? loadUserConfig() : null;
  const { BASIC_AUTH_USERNAME, BASIC_AUTH_PASSWORD } = process.env;
  if (BASIC_AUTH_USERNAME && BASIC_AUTH_PASSWORD) {
    return basicAuth({
      users: { [BASIC_AUTH_USERNAME]: BASIC_AUTH_PASSWORD },
      challenge: true,
      unauthorizedResponse: () => 'Unauthorized - Incorrect username or password',
    });
  } else if ((configUsers && configUsers.length > 0)) {
    return basicAuth({
      authorizer: customAuthorizer,
      challenge: true,
      unauthorizedResponse: () => 'Unauthorized - Incorrect token',
    });
  } else {
    return (req, res, next) => next();
  }
}

const protectConfig = getBasicAuthMiddleware();

/* A middleware function for Connect, that filters requests based on method type */
const method = (m, mw) => (req, res, next) => (req.method === m ? mw(req, res, next) : next());

const app = express()
  // Load SSL redirection middleware
  .use(sslServer.middleware)
  // Load middlewares for parsing JSON, and supporting HTML5 history routing
  .use(express.json({ limit: '1mb' }))
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
  // POST Endpoint used to save config, by writing config file to disk
  .use(ENDPOINTS.save, method('POST', (req, res) => {
    try {
      saveConfig(req.body, (results) => { res.end(results); });
      config = req.body.config; // update the config
    } catch (e) {
      printWarning('Error writing config file to disk', e);
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
  })
  // GET endpoint to return system info, for widget
  .use(ENDPOINTS.systemInfo, (req, res) => {
    try {
      const results = systemInfo();
      systemInfo.success = true;
      res.end(JSON.stringify(results));
    } catch (e) {
      res.end(JSON.stringify({ success: false, message: e }));
    }
  })
  // GET for accessing non-CORS API services
  .use(ENDPOINTS.corsProxy, (req, res) => {
    try {
      corsProxy(req, res);
    } catch (e) {
      res.end(JSON.stringify({ success: false, message: e }));
    }
  })
  // GET endpoint to return user info
  .use(ENDPOINTS.getUser, (req, res) => {
    try {
      const user = getUser(config, req);
      res.end(JSON.stringify(user));
    } catch (e) {
      res.end(JSON.stringify({ success: false, message: e }));
    }
  })
  // Middleware to serve any .yml files in USER_DATA_DIR with optional protection
  .get('/*.yml', protectConfig, (req, res) => {
    const ymlFile = req.path.split('/').pop();
    res.sendFile(path.join(__dirname, process.env.USER_DATA_DIR || 'user-data', ymlFile));
  })
  // Serves up static files
  .use(express.static(path.join(__dirname, process.env.USER_DATA_DIR || 'user-data')))
  .use(express.static(path.join(__dirname, 'dist')))
  .use(express.static(path.join(__dirname, 'public'), { index: 'initialization.html' }))
  .use(history())
  // If no other route is matched, serve up the index.html with a 404 status
  .use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'dist', 'index.html'));
  });

/* Create HTTP server from app on port, and print welcome message */
http.createServer(app)
  .listen(port, host, () => {
    printWelcomeMessage();
  })
  .on('error', (err) => {
    printWarning('Unable to start Dashy\'s Node server', err);
  });

/* Check, and if possible start SSL server too */
sslServer.startSSLServer(app);
