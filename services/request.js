/**
 * Lightweight HTTP client for server-side (Node.js) code.
 * Uses built-in http/https modules - no external dependencies.
 * Replaces axios for all server-side requests.
 *
 * Supports: .get(), .request(), custom httpsAgent options, maxRedirects,
 * gzip/deflate/brotli decompression, optional timeout,
 * and exposes the raw socket (needed by status-check.js for servername).
 */

const http = require('http');
const https = require('https');
const zlib = require('zlib');
const { URL } = require('url');

class RequestError extends Error {
  constructor(message, { response, code, errno } = {}) {
    super(message);
    this.name = 'RequestError';
    this.response = response || undefined;
    this.code = code || undefined;
    this.errno = errno || undefined;
  }

  // Return a JSON-safe summary, to prevent the any circular references
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      errno: this.errno,
      status: this.response && this.response.status,
      statusText: this.response && this.response.statusText,
      data: this.response && this.response.data,
    };
  }
}

/**
 * Core request function.
 * @param {Object} config
 * @param {string} config.url
 * @param {string} [config.method='GET']
 * @param {Object} [config.headers={}]
 * @param {*} [config.data] - Request body (object will be JSON-stringified)
 * @param {number} [config.maxRedirects=5]
 * @param {number} [config.timeout=0] - Request timeout in ms (0 = no timeout)
 * @param {Object} [config.httpsAgent] - Options for https.Agent (e.g. { rejectUnauthorized })
 * @returns {Promise<{data, status, statusText, headers, request}>}
 */
function request(config) {
  const {
    url,
    method = 'GET',
    headers = {},
    data,
    json,
    maxRedirects = 5,
    timeout = 0,
    maxResponseSize = 0,
    httpsAgent,
  } = config;

  return new Promise((resolve, reject) => {
    const makeRequest = (targetUrl, redirectsLeft) => {
      let parsed;
      try {
        parsed = new URL(targetUrl);
      } catch (e) {
        reject(new RequestError(`Invalid URL: ${targetUrl}`));
        return;
      }

      const isHttps = parsed.protocol === 'https:';
      const transport = isHttps ? https : http;

      const reqOptions = {
        method: method.toUpperCase(),
        hostname: parsed.hostname,
        port: parsed.port || (isHttps ? 443 : 80),
        path: parsed.pathname + parsed.search,
        headers: { ...headers },
      };

      // Advertise supported encodings (matching axios behavior)
      if (!reqOptions.headers['Accept-Encoding'] && !reqOptions.headers['accept-encoding']) {
        reqOptions.headers['Accept-Encoding'] = 'gzip, deflate, br';
      }

      // Support URL-embedded credentials (e.g. https://user:pass@host)
      if (parsed.username && !reqOptions.headers.Authorization) {
        const creds = `${decodeURIComponent(parsed.username)}:${decodeURIComponent(parsed.password || '')}`;
        reqOptions.headers.Authorization = `Basic ${Buffer.from(creds).toString('base64')}`;
      }

      // Apply httpsAgent options (e.g. rejectUnauthorized)
      if (isHttps && httpsAgent) {
        reqOptions.agent = new https.Agent(httpsAgent);
      }

      // Prepare body
      let body = null;
      const payload = data || json;
      if (payload != null && method.toUpperCase() !== 'GET' && method.toUpperCase() !== 'HEAD') {
        body = typeof payload === 'string' ? payload : JSON.stringify(payload);
        if (!reqOptions.headers['Content-Type'] && !reqOptions.headers['content-type']) {
          reqOptions.headers['Content-Type'] = 'application/json';
        }
        reqOptions.headers['Content-Length'] = Buffer.byteLength(body);
      }

      const req = transport.request(reqOptions, (res) => {
        // Handle redirects
        if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
          // Drain the response body to free the socket
          res.resume();
          if (redirectsLeft <= 0) {
            reject(new RequestError('Max redirects exceeded'));
            return;
          }
          const redirectUrl = new URL(res.headers.location, targetUrl).href;
          makeRequest(redirectUrl, redirectsLeft - 1);
          return;
        }

        // Decompress response based on Content-Encoding (matching axios behavior)
        let stream = res;
        const encoding = (res.headers['content-encoding'] || '').toLowerCase();
        if (encoding === 'gzip' || encoding === 'x-gzip') {
          stream = res.pipe(zlib.createGunzip());
        } else if (encoding === 'deflate') {
          stream = res.pipe(zlib.createInflate());
        } else if (encoding === 'br') {
          stream = res.pipe(zlib.createBrotliDecompress());
        }

        const chunks = [];
        let totalSize = 0;
        let aborted = false;
        stream.on('data', (chunk) => {
          if (aborted) return;
          totalSize += chunk.length;
          if (maxResponseSize > 0 && totalSize > maxResponseSize) {
            aborted = true;
            req.destroy();
            reject(new RequestError(
              `Response exceeds maximum size of ${maxResponseSize} bytes`,
              { code: 'E_RESPONSE_TOO_LARGE' },
            ));
            return;
          }
          chunks.push(chunk);
        });
        stream.on('error', (err) => {
          if (aborted) return;
          reject(new RequestError(`Decompression failed: ${err.message}`, { code: err.code }));
        });
        stream.on('end', () => {
          if (aborted) return;
          const raw = Buffer.concat(chunks).toString('utf8');
          let responseData;
          try { responseData = JSON.parse(raw); } catch (_) { responseData = raw; }

          const response = {
            data: responseData,
            status: res.statusCode,
            statusText: res.statusMessage,
            headers: res.headers,
          };
          // Expose the raw request object for socket access (status-check.js
          // needs this). Defined as non-enumerable so JSON.stringify() skips
          // it — the http.ClientRequest has circular socket references that
          // would otherwise crash any endpoint forwarding the response.
          Object.defineProperty(response, 'request', {
            value: req,
            enumerable: false,
          });

          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(response);
          } else {
            reject(new RequestError(
              `Request failed with status ${res.statusCode}`,
              { response, code: res.statusCode },
            ));
          }
        });
      });

      // Expose socket events for servername access
      req.on('socket', (socket) => {
        req.socket = socket;
        socket.on('secureConnect', () => {
          req.socket = socket;
        });
      });

      req.on('error', (err) => {
        reject(new RequestError(
          err.message,
          { code: err.code, errno: err.errno },
        ));
      });

      // Optional request timeout
      if (timeout > 0) {
        req.setTimeout(timeout, () => {
          req.destroy();
          reject(new RequestError(
            `timeout of ${timeout}ms exceeded`,
            { code: 'ECONNABORTED' },
          ));
        });
      }

      if (body) req.write(body);
      req.end();
    };

    makeRequest(url, maxRedirects);
  });
}

/** GET shorthand */
request.get = (url, config = {}) => request({ ...config, method: 'GET', url });

/** POST shorthand */
request.post = (url, data, config = {}) => request({ ...config, method: 'POST', url, data });

/** PUT shorthand */
request.put = (url, data, config = {}) => request({ ...config, method: 'PUT', url, data });

module.exports = request;
module.exports.RequestError = RequestError;
