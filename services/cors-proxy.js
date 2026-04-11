/**
 * A simple CORS proxy, for accessing API services which aren't CORS-enabled.
 * Receives requests from frontend, applies correct access control headers,
 * makes request to endpoint, then responds to the frontend with the response
 */

const request = require('./request');

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

  // Get desired URL, from Target-URL header
  const targetURL = req.header('Target-URL');
  if (!targetURL) {
    res.status(400).send({ error: 'Missing required Target-URL header' });
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
