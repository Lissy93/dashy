/**
 * This file contains the Node.js code, used for the optional status check feature
 * It accepts a single url parameter, and will make an empty GET request to that
 * endpoint, and then resolve the response status code, time taken, and short message
 */
const axios = require('axios').default;
const https = require('https');
const { Image } = require('canvas');



// Provided pingFunction function (as is)
function pingFunction(ip, callback) {
  if(!this.inUse) {
    this.inUse = true;
    this.callback = callback;
    this.ip = ip;

    var _that = this;

    this.img = new Image();
    this.img.onload = function() {_that.good();};
    this.img.onerror = function() {_that.good();}; // onerror also treated as good in original code
    this.start = new Date().getTime();
    this.img.src = "http://" + ip + "/favicon.ico?" + this.start; // Added favicon.ico and timestamp to prevent caching, and ensure HTTP request
    this.timer = setTimeout(function() { _that.bad();}, 1500);
  }
}

pingFunction.prototype.good = function() {
  if(this.timer) { clearTimeout(this.timer); }
  var timeTaken = new Date().getTime() - this.start;
  this.callback('good', timeTaken, this.ip);
  this.inUse = false;
};

pingFunction.prototype.bad = function() {
  if(this.timer) { clearTimeout(this.timer); }
  this.callback('bad', false, this.ip);
  this.inUse = false;
};


const getResponseType = (statusCode, validCodes) => {
  if (!validCodes) {
    return statusCode >= 200 && statusCode < 300;
  }
  return String(validCodes).split(',').map(code => parseInt(code.trim(), 10)).includes(statusCode);
};

const makeMessageText = (results) => {
  return `Status: ${results.successStatus ? 'Success' : 'Failure'} - Code: ${results.statusCode} - Text: ${results.statusText || 'N/A'} - Server: ${results.serverName || 'N/A'} - Time: ${results.timeTaken}ms`;
};

const makeErrorMessage = (error) => {
  return `Request failed: ${error.message}`;
};
const makeErrorMessage2 = (response) => {
  return `Request failed: Status ${response.status} - ${response.statusText}`;
};


const makeRequest = (url, options, render) => {
  const {
    headers, enableInsecure, acceptCodes, maxRedirects,
  } = options;
  const validCodes = acceptCodes && acceptCodes !== 'null' ? acceptCodes : null;
  const startTime = new Date();


  if (url.startsWith('ping://')) {
    const ipAddress = url.substring(7); // Remove "ping://" prefix
    const pinger = new pingFunction(ipAddress, (status, timeTaken, targetIp) => {
      let results = {};
      if (status === 'good') {
        results = {
          successStatus: true,
          message: `Ping Success - Target: ${targetIp} - Time: ${timeTaken}ms`,
          timeTaken: timeTaken,
          targetIp: targetIp,
          statusCode: 'N/A', // or a specific code for ping success?
          statusText: 'Ping Success'
        };
      } else {
        results = {
          successStatus: false,
          message: `Ping Failed - Target: ${targetIp}`,
          timeTaken: timeTaken || 'N/A',
          targetIp: targetIp,
          statusCode: 'N/A', // or a specific code for ping failure?
          statusText: 'Ping Failed'
        };
      }
      render(JSON.stringify(results));
    });
    // Initiate ping is already done inside pingFunction constructor. No need to call any extra function here, as it is self-starting.

  } else {
    const requestMaker = axios.create({
      httpsAgent: new https.Agent({
        rejectUnauthorized: !enableInsecure,
      }),
    });
    requestMaker.request({
      url,
      headers,
      maxRedirects,
    })
      .then((response) => {
        const statusCode = response.status;
        const { statusText } = response;
        const successStatus = getResponseType(statusCode, validCodes);
        const serverName = response.request.socket.servername;
        const timeTaken = (new Date() - startTime);
        const results = {
          statusCode, statusText, serverName, successStatus, timeTaken,
        };
        results.message = makeMessageText(results);
        return results;
      })
      .catch((error) => {
        const response = error ? (error.response || {}) : {};
        const returnCode = response.status || response.code;
        if (validCodes && String(validCodes).includes(returnCode)) { // Success overridden by user
          const results = {
            successStatus: getResponseType(returnCode, validCodes),
            statusCode: returnCode,
            statusText: response.statusText,
            timeTaken: (new Date() - startTime),
          };
          results.message = makeMessageText(results);
          return results;
        } else { // Request failed
          return {
            successStatus: false,
            message: error.response ? makeErrorMessage2(error.response) : makeErrorMessage(error),
          };
        }
      }).then((results) => {
      // Request completed (either successfully, or failed) - render results
      render(JSON.stringify(results));
    });
  }
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
    message: '❌ Missing or Malformed URL',
  }));
};

/* Main function, will check if a URL present, and call function */
module.exports = (paramStr, render) => {
  if (!paramStr || !paramStr.includes('=')) {
    immediateError(render);
  } else {
    // Prepare the parameters, which are got from the URL
    const params = new URLSearchParams(paramStr);
    const url = decodeURIComponent(params.get('url'));
    const acceptCodes = decodeURIComponent(params.get('acceptCodes'));
    const maxRedirects = decodeURIComponent(params.get('maxRedirects')) || 0;
    const headers = decodeHeaders(params.get('headers'));
    const enableInsecure = !!params.get('enableInsecure');
    if (!url || url === 'undefined') immediateError(render);
    const options = {
      headers, enableInsecure, acceptCodes, maxRedirects,
    };
    makeRequest(url, options, render);
  }
};
