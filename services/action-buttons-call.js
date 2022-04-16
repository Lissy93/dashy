/**
 * Endpoint called from the client, to execute action buttons,
 * by making GET request to web hook URL, and returning response
 */
const axios = require('axios').default;
const https = require('https');

/* Makes human-readable response text for failed check */
const makeErrorMessage = (data) => `❌ Service Unavailable: ${data.hostname || 'Server'} `
  + `resulted in ${data.code || 'a fatal error'} ${data.errno ? `(${data.errno})` : ''}`;

/* Kicks of a HTTP request, then formats and renders results */
const makeRequest = (url, options, render) => {
  const {
    headers, enableInsecure, maxRedirects,
  } = options;
  const startTime = new Date();
  // Create HTTPS agent for request
  const requestMaker = axios.create({
    httpsAgent: new https.Agent({
      rejectUnauthorized: !enableInsecure,
    }),
  });
  // Make request, with params
  requestMaker.request({
    url,
    headers,
    maxRedirects,
  }).then((response) => ({
    statusCode: response.status,
    responseText: response.statusText,
    successStatus: true,
    timeTaken: (new Date() - startTime),
  })).catch((error) => ({
    successStatus: false,
    message: makeErrorMessage(error),
  })).then((results) => {
    // Request completed (either successfully, or failed) - render results
    render(JSON.stringify(results));
  });
};

const decodeHeaders = (maybeHeaders) => {
  if (!maybeHeaders) return {};
  const decodedHeaders = decodeURIComponent(maybeHeaders);
  let parsedHeaders = {};
  try {
    parsedHeaders = JSON.parse(decodedHeaders);
  } catch (e) { /* Not valid JSON, will just return false */ }
  return parsedHeaders;
};

/* Returned if the URL param is not present or correct */
const immediateError = (render) => {
  render(JSON.stringify({
    successStatus: false,
    message: '❌ Missing URL or Malformed Options',
  }));
};

/* Main function, will check if a URL present, and call function */
module.exports = (paramStr, render) => {
  // If no parameters passed, then fail
  if (!paramStr || !paramStr.includes('=')) {
    immediateError(render);
    return;
  }
  // Prepare the parameters, which are got from the URL
  const params = new URLSearchParams(paramStr);
  const url = decodeURIComponent(params.get('url'));
  const maxRedirects = decodeURIComponent(params.get('maxRedirects')) || 0;
  const headers = decodeHeaders(params.get('headers'));
  const enableInsecure = !!params.get('enableInsecure');
  // Check target URL is present
  if (!url || url === 'undefined') immediateError(render);
  // Put options together
  const options = {
    headers, enableInsecure, maxRedirects,
  };
  // Make the request
  makeRequest(url, options, render);
};
