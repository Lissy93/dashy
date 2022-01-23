/* A Netlify cloud function to handle requests to CORS-disabled services */
const axios = require('axios');

exports.handler = (event, context, callback) => {
  // Get input data
  const { body, headers, queryStringParameters } = event;

  // Get URL from header or GET param
  const requestUrl = queryStringParameters.url || headers['Target-URL'] || headers['target-url'];

  const returnError = (msg, error) => {
    callback(null, {
      statusCode: 400,
      body: JSON.stringify({ success: false, msg, error }),
    });
  };
  // If URL missing, return error
  if (!requestUrl) {
    returnError('Missing Target-URL header', null);
  }

  let custom = {};
  try {
    custom = JSON.parse(headers.CustomHeaders || headers.customheaders || '{}');
  } catch (e) { returnError('Unable to parse custom headers'); }

  // Response headers
  const requestHeaders = {
    'Access-Control-Allow-Origin': '*',
    ...custom,
  };

  // Prepare request
  const requestConfig = {
    method: 'GET',
    url: requestUrl,
    json: body,
    headers: requestHeaders,
  };

  // Make request
  axios.request(requestConfig)
    .then((response) => {
      callback(null, { statusCode: 200, body: JSON.stringify(response.data) });
    }).catch((error) => {
      returnError('Request failed', error);
    });
};
