/* A Netlify cloud function to handle requests to CORS-disabled services */
const axios = require('axios');

exports.handler = (event, context, callback) => {
  // Get URL from header or GET param
  const requestUrl = event.queryStringParameters.url
    || event.headers['Target-URL']
    || event.headers['target-url'];

  // If URL missing, return error
  if (!requestUrl) {
    callback(null, {
      statusCode: 400,
      body: JSON.stringify({ success: false, msg: 'Missing Target-URL header' }),
    });
  }

  // Prepare request
  const requestConfig = {
    method: 'GET',
    url: requestUrl,
    json: event.body,
  };

  // Response headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    ...event.headers,
  };

  // Make request
  axios.request(requestConfig)
    .then((response) => {
      const body = JSON.stringify(response.data);
      callback(null, { statusCode: 200, body, headers });
    }).catch((error) => {
      callback(null, {
        statusCode: 400,
        body: JSON.stringify({ success: false, msg: 'Request failed', error }),
      });
    });
};
