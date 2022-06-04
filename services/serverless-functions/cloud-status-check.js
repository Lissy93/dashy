/* A cloud function that wraps the status checking method, for use on Netlify */
const statusCheck = require('../status-check');

exports.handler = (event, context, callback) => {
  const paramStr = event.rawQuery;
  statusCheck(paramStr, (results) => {
    callback(null, {
      statusCode: 200,
      body: results,
    });
  });
};
