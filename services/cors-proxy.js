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

module.exports = (req, res) => {
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

  // Get desired URL, from Target-URL header, and validate it against the policy
  const targetURL = req.header('Target-URL');
  if (!targetURL) {
    res.status(400).send({ error: 'Missing required Target-URL header' });
    return;
  }
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
      headers = JSON.parse(rawCustomHeaders);
    } catch (e) {
      res.status(400).send({ error: 'CustomHeaders header contains malformed JSON' });
      return;
    }
  }

  // Prepare the request
  const requestConfig = {
    method: req.method,
    url: targetURL,
    data: req.body,
    headers,
    timeout: 30000,
  };

  // Make the request, and respond with result
  const send = (status, body) => {
    if (res.headersSent) return;
    try { res.status(status).send(body); } catch (e) { /* response stream gone */ }
  };
  request(requestConfig).then(
    (response) => send(200, response.data),
    (error) => send(500, { error }),
  );
};
