/**
 * Short Node script for pinging an IP address to check if it's online
 * Used for the optional status check feature, as an alternative to the GET request
 * Accepts a single ip param, will ping that server, then respond with the status
 * Credit to @nospaceships for the node-net-ping package, MIT
 */
const ping = require('net-ping');

/* Options used for ping */
const pingOptions = {
  networkProtocol: ping.NetworkProtocol.IPv4,
  packetSize: 16,
  retries: 1,
  timeout: 1000,
  ttl: 128,
};

/* Kicks of an IP ping, and returns callback with the status */
const makePing = (ip, render) => {
  const startTime = new Date();
  const session = ping.createSession(pingOptions);
  session.pingHost(ip, (error, target) => {
    const timeTaken = (new Date() - startTime);
    if (error) {
      render(JSON.stringify({ success: false, message: `❌ ${error}` }));
    } else {
      render(JSON.stringify({ success: true, message: `✅ ${target} is Alive\n⏱️ Took ${timeTaken} ms` }));
    }
    session.close();
  });
};

/* Checks if a given IP address is online, and accessible */
module.exports = (paramStr, render) => {
  if (!paramStr || !paramStr.includes('ip=')) {
    render(JSON.stringify({ success: false, message: '❌ Malformed or Missing IP' }));
  } else {
    // Prepare the parameters, which are got from the URL
    const ip = decodeURIComponent((new URLSearchParams(paramStr)).get('ip'));
    makePing(ip, render);
  }
};
