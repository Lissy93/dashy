module.exports = (req) => {
  const userHeader = "Remote-User";
  console.log("Running Server Side", req.headers[userHeader.toLowerCase()]); // eslint-disable-line no-console
  return { "success": true, "user": req.headers[userHeader.toLowerCase()] };
};