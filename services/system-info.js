/**
 * Gets basic system info, for the resource usage widget
 */
const os = require('os');

module.exports = () => {
  const meta = {
    timestamp: new Date(),
    uptime: os.uptime(),
    hostname: os.hostname(),
    username: os.userInfo().username,
    system: `${os.version()} (${os.platform()})`,
  };

  const memory = {
    total: `${Math.round(os.totalmem() / (1024 * 1024 * 1024))} GB`,
    freePercent: (os.freemem() / os.totalmem()).toFixed(2),
  };

  const loadAv = os.loadavg();
  const load = { one: loadAv[0], five: loadAv[1], fifteen: loadAv[2] };

  return { meta, memory, load };
};
