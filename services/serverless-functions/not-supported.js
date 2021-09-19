/* A Netlify cloud function to return a message endpoints that are not available */
exports.handler = async () => ({
  statusCode: 200,
  body: JSON.stringify({
    success: false,
    error: 'This action is not supported on Netlify',
  }),
});
