/**
 * A simple CORS proxy, for accessing API services which aren't CORS-enabled.
 * Receives requests from frontend, applies correct access control headers,
 * makes request to endpoint, then responds to the frontend with the response
 */

const request = require('./request');

// List of hosts to disallow by default, for cloud instances
// Covers AWS, Azure, GCP, DO, Hetzner, Oracle, etc on IPv4/6
const BLOCKED_HOSTS = new Set([
  '169.254.169.254',
  '::ffff:a9fe:a9fe',
  'fd00:ec2::254',
  'metadata.google.internal',
  '100.100.100.200',
]);

// Operator escape hatch, set this env var to bypass all proxy restrictions
const restrictionsDisabled = !!process.env.DANGEROUSLY_DISABLE_PROXY_RESTRICTIONS;

// If reference to env var is present, substitute for env var value if set
const PLACEHOLDER_RE = /\b(?:DASHY_|VITE_APP_|VUE_APP_)\w+/g;
const warnedPlaceholders = new Set();
const resolvePlaceholder = (name) => {
  const value = process.env[name];
  if (value !== undefined) return value;
  if (!warnedPlaceholders.has(name)) {
    warnedPlaceholders.add(name);
    // eslint-disable-next-line no-console
    console.warn(`[cors-proxy] Env-var placeholder '${name}' is referenced but not set`);
  }
  return name;
};
const substituteEnv = (val) => {
  if (typeof val === 'string') return val.replace(PLACEHOLDER_RE, resolvePlaceholder);
  if (Array.isArray(val)) return val.map(substituteEnv);
  if (val && typeof val === 'object') {
    const out = {};
    Object.keys(val).forEach((k) => { out[k] = substituteEnv(val[k]); });
    return out;
  }
  return val;
};

// Validate the target URL against scheme and host policies
// Returns { ok: true } on success, or { ok: false, status, error } on rejection
const validateTargetUrl = (raw) => {
  if (restrictionsDisabled) return { ok: true };
  let url;
  try { url = new URL(raw); } catch (e) {
    return { ok: false, status: 400, error: 'Target-URL is not a valid URL' };
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return { ok: false, status: 400, error: 'Target-URL must use http:// or https://' };
  }
  // url.hostname includes brackets for IPv6 (e.g. '[fd00:ec2::254]') - strip em
  const host = url.hostname.toLowerCase().replace(/^\[|\]$/g, '');
  if (BLOCKED_HOSTS.has(host)) {
    return {
      ok: false,
      status: 403,
      error: `Target-URL host '${host}' is blocked by the CORS proxy. `
        + 'This address is reserved for cloud instance metadata services. '
        + 'To bypass, set DANGEROUSLY_DISABLE_PROXY_RESTRICTIONS=true.',
    };
  }
  return { ok: true };
};

const handler = (req, res) => {
  // Apply allow-all response headers
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, PATCH, POST, DELETE');
  if (req.header('access-control-request-headers')) {
    res.header('Access-Control-Allow-Headers', req.header('access-control-request-headers'));
  }

  // Pre-flight
  if (req.method === 'OPTIONS') {
    res.send();
    return;
  }

  // Get desired URL, resolve env-var placeholders, then validate against the policy.
  const rawTargetURL = req.header('Target-URL');
  if (!rawTargetURL) {
    res.status(400).send({ error: 'Missing required Target-URL header' });
    return;
  }
  const targetURL = substituteEnv(rawTargetURL);
  const validation = validateTargetUrl(targetURL);
  if (!validation.ok) {
    res.status(validation.status).send({ error: validation.error });
    return;
  }

  // Apply any custom headers, if needed
  let headers = {};
  const rawCustomHeaders = req.header('CustomHeaders');
  if (rawCustomHeaders) {
    try {
      headers = substituteEnv(JSON.parse(rawCustomHeaders));
    } catch (e) {
      res.status(400).send({ error: 'CustomHeaders header contains malformed JSON' });
      return;
    }
  }

  // Prepare the request
  const requestConfig = {
    method: req.method,
    url: targetURL,
    data: substituteEnv(req.body),
    headers,
    timeout: 30000,
    maxResponseSize: 10 * 1024 * 1024, // 10 MB
  };

  // Make the request, and respond with result
  const send = (status, body) => {
    if (res.headersSent) return;
    try { res.status(status).send(body); } catch (e) { /* response stream gone */ }
  };
  request(requestConfig).then(
    (response) => send(200, response.data),
    (error) => {
      // Handle unexpected or partial error objects
      const err = (error && typeof error === 'object') ? error : {};
      const upstream = (err.response && typeof err.response === 'object') ? err.response : null;
      const upstreamStatus = upstream && typeof upstream.status === 'number' ? upstream.status : null;

      // Make response code and error type
      let proxyStatus;
      let type;
      if (upstreamStatus !== null && upstreamStatus >= 400) {
        proxyStatus = upstreamStatus;
        type = 'upstream_status';
      } else if (err.timeout) {
        proxyStatus = 504;
        type = 'upstream_timeout';
      } else {
        proxyStatus = 502;
        type = 'upstream_error';
      }

      send(proxyStatus, {
        error: {
          type,
          name: err.name,
          message: err.message,
          code: err.code,
          status: upstreamStatus,
          statusText: upstream && upstream.statusText,
          data: upstream && upstream.data,
        },
      });
    },
  );
};

module.exports = handler;
module.exports.substituteEnv = substituteEnv;
