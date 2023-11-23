module.exports = (config, req) => {
  try {
    if ( config.appConfig.auth.enableHeaderAuth ) {
      const userHeader = config.appConfig.auth.headerAuth.userHeader;
      return { "success": true, "user": req.headers[userHeader.toLowerCase()] };
    }
  } catch (e) {
    console.warn("Error get-user: ", e);
    return { 'success': false };
  }
};