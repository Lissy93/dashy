/**
 * Creates Express app, for all the server-side routes + middleware
 * Which gets imported by the server.js in the root
 * */

/* Import built-in Node server modules */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/* Project root — one level up from services/ */
const rootDir = path.join(__dirname, '..');

/* Import NPM dependencies */
const yaml = require('js-yaml');

/* Import Express + middleware functions */
const express = require('express');
const basicAuth = require('express-basic-auth');

/* Kick of some basic checks */
require('./update-checker'); // Checks if there are any updates available, prints message

let config = require('./config-validator'); // Validate config file and load result

/* Include route handlers for API endpoints */
const statusCheck = require('./status-check'); // Used by the status check feature, uses GET
const saveConfig = require('./save-config'); // Saves users new conf.yml to file-system
const systemInfo = require('./system-info'); // Basic system info, for resource widget
const sslServer = require('./ssl-server'); // TLS-enabled web server
const corsProxy = require('./cors-proxy'); // Enables API requests to CORS-blocked services
const getUser = require('./get-user'); // Enables server side user lookup

/* Service endpoint URL paths (see also serviceEndpoints in src/utils/config/defaults.js) */
const ENDPOINTS = {
  statusPing: '/status-ping',
  statusCheck: '/status-check',
  save: '/config-manager/save',
  systemInfo: '/system-info',
  corsProxy: '/cors-proxy',
  getUser: '/get-user',
};

/* Indicates for the webpack config, that running as a server */
process.env.IS_SERVER = 'True';

/* Just console.warns an error */
const printWarning = (msg, error) => {
  console.warn(`\x1b[103m\x1b[34m${msg}\x1b[0m\n`, error || ''); // eslint-disable-line no-console
};

/* Send a response body if the stream is already closed, with optional status */
const safeEnd = (res, body, status) => {
  if (res.headersSent) return;
  try {
    if (status) res.status(status);
    res.end(body);
  } catch (e) { /* response stream gone */ }
};

/* Build a serialized JSON error body */
const errBody = (e) => JSON.stringify({
  success: false,
  message: String(e && e.message ? e.message : e),
});

/* Catch any possible unhandled error. Shouldn't ever happen! */
process.on('unhandledRejection', (reason) => {
  printWarning('Unhandled promise rejection in server', reason);
});

/* Load appConfig.auth from config (if present) for authorization purposes */
function loadAuthConfig() {
  try {
    const filePath = path.join(rootDir, process.env.USER_DATA_DIR || 'user-data', 'conf.yml');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = yaml.load(fileContents);
    return data?.appConfig?.auth || {};
  } catch (e) {
    return {};
  }
}

function loadUserConfig() {
  return loadAuthConfig().users || null;
}

/* Authorizer for ENABLE_HTTP_AUTH: validates credentials against conf.yml users */
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
    return users.some(user => (
      user.user.toLowerCase() === username.toLowerCase() && generateUserToken(user) === token
    ));
  } else {
    const users = loadUserConfig();
    const userHash = sha256(password);
    return users.some(user => (
      user.user.toLowerCase() === username.toLowerCase() && user.hash.toUpperCase() === userHash
    ));
  }
}

/* If auth is enabled, setup auth for config access, otherwise skip */
function getBasicAuthMiddleware() {
  const authConfig = loadAuthConfig();
  const confUsers = authConfig.users || null;
  const hasConfUsers = confUsers && confUsers.length > 0;
  const useConfAuth = process.env.ENABLE_HTTP_AUTH && hasConfUsers;
  const { BASIC_AUTH_USERNAME, BASIC_AUTH_PASSWORD } = process.env;
  const hasStaticCreds = BASIC_AUTH_USERNAME && BASIC_AUTH_PASSWORD;

  // Warn if both auth methods are configured - they don't work together
  if (hasStaticCreds && hasConfUsers) {
    printWarning(useConfAuth
      ? 'BASIC_AUTH env vars are ignored because ENABLE_HTTP_AUTH is active with conf.yml users.'
      : 'BASIC_AUTH env vars and appConfig.auth.users are both set but use different credentials.'
        + ' This will cause auth failures. Set ENABLE_HTTP_AUTH=true, or remove users from conf.yml.');
  }

  if (useConfAuth) {
    return basicAuth({
      authorizer: customAuthorizer,
      challenge: true,
      unauthorizedResponse: () => 'Unauthorized - Incorrect token',
    });
  } else if (hasStaticCreds) {
    return basicAuth({
      users: { [BASIC_AUTH_USERNAME]: BASIC_AUTH_PASSWORD },
      challenge: true,
      unauthorizedResponse: () => 'Unauthorized - Incorrect username or password',
    });
  } else if (authConfig.enableHeaderAuth && authConfig.headerAuth) {
    const { userHeader = 'Remote-User', proxyWhitelist = [] } = authConfig.headerAuth;
    return (req, res, next) => {
      if (!proxyWhitelist.includes(req.socket.remoteAddress)) {
        return res.status(401).json({ success: false, message: 'Unauthorized - not from trusted proxy' });
      }
      const user = req.headers[userHeader.toLowerCase()];
      if (!user) {
        return res.status(401).json({ success: false, message: 'Unauthorized - missing user header' });
      }
      req.auth = { user };
      return next();
    };
  }

  return (req, res, next) => next();
}

const protectConfig = getBasicAuthMiddleware();

/* Middleware to restrict write endpoints to admin users only */
function requireAdmin(req, res, next) {
  if (!req.auth) return next();
  const users = loadUserConfig();
  if (!users || users.length === 0) return next();
  const user = users.find(u => u.user.toLowerCase() === req.auth.user.toLowerCase());
  if (user && user.type === 'admin') return next();
  return res.status(403).json({ success: false, message: 'Forbidden - Admin access required' });
}

/* A middleware function for Connect, that filters requests based on method type */
const method = (m, mw) => (req, res, next) => (req.method === m ? mw(req, res, next) : next());

const app = express()
  // Load SSL redirection middleware
  .use(sslServer.middleware)
  // Load middlewares for parsing JSON, and supporting HTML5 history routing
  .use(express.json({ limit: '1mb' }))
  // GET endpoint to run status of a given URL with GET request
  .use(ENDPOINTS.statusCheck, protectConfig, method('GET', (req, res) => {
    try {
      statusCheck(req.url, (results) => {
        if (!res.headersSent) {
          res.setHeader('Content-Type', 'application/json');
          res.end(results);
        }
      });
    } catch (e) {
      printWarning(`Error running status check for ${req.url}\n`, e);
      if (!res.headersSent) {
        res.status(500).end(JSON.stringify({ successStatus: false, message: '❌ Status check failed badly' }));
      }
    }
  }))
  // POST Endpoint used to save config, by writing config file to disk
  .use(ENDPOINTS.save, protectConfig, requireAdmin, method('POST', (req, res) => {
    let responded = false;
    const respond = (jsonBody) => {
      if (responded || res.headersSent) return;
      responded = true;
      try { // Only update in-memory config when disk write succeeds
        if (JSON.parse(jsonBody).success === true) config = req.body.config;
      } catch (e) { /* unparseable body, config is unchanged */ }
      try { res.end(jsonBody); } catch (e) { /* response stream gone */ }
    };
    saveConfig(req.body, respond).catch((e) => {
      printWarning('Error writing config file to disk', e);
      respond(JSON.stringify({ success: false, message: String(e) }));
    });
  }))
  // GET endpoint to return system info, for widget
  .use(ENDPOINTS.systemInfo, protectConfig, method('GET', (req, res) => {
    try {
      safeEnd(res, JSON.stringify(systemInfo()));
    } catch (e) {
      safeEnd(res, errBody(e));
    }
  }))
  // GET for accessing non-CORS API services
  .use(ENDPOINTS.corsProxy, protectConfig, (req, res) => {
    try {
      corsProxy(req, res);
    } catch (e) {
      safeEnd(res, errBody(e));
    }
  })
  // GET endpoint to return user info
  .use(ENDPOINTS.getUser, protectConfig, method('GET', (req, res) => {
    try {
      safeEnd(res, JSON.stringify(getUser(config, req)));
    } catch (e) {
      safeEnd(res, errBody(e));
    }
  }))
  // Middleware to serve any .yml files in USER_DATA_DIR with optional protection
  .get('/*.yml', protectConfig, (req, res) => {
    const ymlFile = req.path.split('/').pop();
    const filePath = path.join(rootDir, process.env.USER_DATA_DIR || 'user-data', ymlFile);
    res.sendFile(filePath, (err) => {
      if (err) safeEnd(res, errBody(`Could not read ${ymlFile}`), 404);
    });
  })
  // Serves up static files
  .use(express.static(path.join(rootDir, process.env.USER_DATA_DIR || 'user-data')))
  .use(express.static(path.join(rootDir, 'dist')))
  .use(express.static(path.join(rootDir, 'public'), { index: 'initialization.html' }))
  // If no other route is matched, serve up the index.html with a 404 status
  .use((req, res) => {
    res.status(404).sendFile(path.join(rootDir, 'dist', 'index.html'), (err) => {
      if (err) safeEnd(res, errBody('Not Found'));
    });
  });

module.exports = app;
