/**
 * Lightweight fetch wrapper that provides an axios-compatible API.
 * Replaces axios for all client-side HTTP requests.
 *
 * Supports: .get(), .post(), .put(), .request()
 * Returns: { data, status, statusText, headers }
 * Throws on non-2xx responses (matching axios behavior)
 */

import { makeBasicAuthHeaders } from '@/utils/auth/Auth';

/** Check if a request URL targets the local Dashy server */
function isLocalRequest(url) {
  if (!url) return false;
  if (url.startsWith('/') && !url.startsWith('//')) return true;
  const { origin } = window.location;
  const domain = import.meta.env.VITE_APP_DOMAIN;
  return url.startsWith(origin) || (domain && url.startsWith(domain));
}

class RequestError extends Error {
  constructor(message, opts = {}) {
    super(message);
    this.name = 'RequestError';
    this.response = opts.response || undefined;
    this.request = opts.request || undefined;
    this.code = opts.code || undefined;
    this.timeout = opts.timeout === true ? true : undefined;
  }
}

/**
 * Core request function. Accepts an axios-style config object.
 * @param {Object} config - { method, url, headers, data, timeout, params }
 * @returns {Promise<{data, status, statusText, headers}>}
 */
async function makeRequest(config) {
  const {
    method = 'GET',
    url,
    headers = {},
    data,
    timeout,
    params,
  } = config;

  // Build URL with query params
  let fullUrl = url;
  if (params && typeof params === 'object') {
    const searchParams = new URLSearchParams(params);
    fullUrl += (url.includes('?') ? '&' : '?') + searchParams.toString();
  }

  // Timeout via AbortController
  const controller = new AbortController();
  let timeoutId;
  if (timeout) {
    timeoutId = setTimeout(() => controller.abort(), timeout);
  }

  const fetchOptions = {
    method: method.toUpperCase(),
    headers: { ...headers },
    signal: controller.signal,
  };

  // For local API requests, include basic auth headers when configured
  if (isLocalRequest(fullUrl) && !fetchOptions.headers.Authorization) {
    const authConfig = makeBasicAuthHeaders();
    if (authConfig.headers) {
      Object.assign(fetchOptions.headers, authConfig.headers);
    }
  }

  // Attach body for non-GET/HEAD requests
  if (data != null && method.toUpperCase() !== 'GET' && method.toUpperCase() !== 'HEAD') {
    if (typeof data === 'string') {
      fetchOptions.body = data;
    } else {
      fetchOptions.body = JSON.stringify(data);
      // Auto-set Content-Type if not already provided
      const hasContentType = Object.keys(fetchOptions.headers)
        .some((k) => k.toLowerCase() === 'content-type');
      if (!hasContentType) {
        fetchOptions.headers['Content-Type'] = 'application/json';
      }
    }
  }

  try {
    const res = await fetch(fullUrl, fetchOptions);

    // Parse response - try JSON first, fall back to text
    let responseData;
    const text = await res.text();
    try { responseData = JSON.parse(text); } catch { responseData = text; }

    const response = {
      data: responseData,
      status: res.status,
      statusText: res.statusText,
      headers: res.headers,
    };

    // Throw on non-2xx (matching axios behavior)
    if (!res.ok) {
      throw new RequestError(
        `Request failed with status ${res.status}`,
        { response },
      );
    }

    return response;
  } catch (err) {
    if (err instanceof RequestError) throw err;
    // Network error or abort/timeout
    const isTimeout = err.name === 'AbortError';
    const error = new RequestError(
      isTimeout ? `timeout of ${timeout}ms exceeded` : err.message,
      { request: true, code: isTimeout ? 'ECONNABORTED' : undefined, timeout: isTimeout },
    );
    throw error;
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

/** GET request: request.get(url, config?) */
makeRequest.get = (url, config = {}) => makeRequest({
  ...config, method: 'GET', url,
});

/** POST request: request.post(url, data?, config?) */
makeRequest.post = (url, data, config = {}) => makeRequest({
  ...config, method: 'POST', url, data,
});

/** PUT request: request.put(url, data?, config?) */
makeRequest.put = (url, data, config = {}) => makeRequest({
  ...config, method: 'PUT', url, data,
});

export default makeRequest;
