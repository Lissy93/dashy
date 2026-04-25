const request = require('./request');

const currentVersion = require('../package.json').version;

const packageUrl = 'https://raw.githubusercontent.com/Lissy93/dashy/master/package.json';

const logToConsole = (msg) => {
  console.log(msg); // eslint-disable-line no-console
};

const VERSION_RE = /^\d+(\.\d+)*$/;

const compareVersions = (a, b) => {
  const pa = a.split('.').map((n) => parseInt(n, 10));
  const pb = b.split('.').map((n) => parseInt(n, 10));
  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i += 1) {
    const diff = (pa[i] || 0) - (pb[i] || 0);
    if (diff !== 0) return diff;
  }
  return 0;
};

const makeMsg = (latestVersion) => {
  const difference = compareVersions(latestVersion, currentVersion);
  if (difference <= 0) {
    return '\x1b[1m\x1b[32m✅ Dashy is Up-to-Date\x1b[0m\n';
  }
  return `\x1b[103m\x1b[34m${new Array(27).fill('━').join('')}\x1b[0m\n`
    + `\x1b[103m\x1b[34m⚠️ Update Available: ${latestVersion} \x1b[0m\n`
    + `\x1b[103m\x1b[34m${new Array(27).fill('━').join('')}\x1b[0m\n`;
};

const runCheck = async () => {
  if (typeof currentVersion !== 'string' || !VERSION_RE.test(currentVersion)) {
    logToConsole('Unable to check for updates: invalid local version');
    return;
  }
  try {
    const response = await request.get(packageUrl);
    const latest = response && response.data && response.data.version;
    if (typeof latest !== 'string' || !VERSION_RE.test(latest)) {
      logToConsole('Unable to check for updates: invalid response from upstream');
      return;
    }
    logToConsole(`\nUsing Dashy V-${currentVersion}. Update Check Complete`);
    logToConsole(makeMsg(latest));
  } catch {
    logToConsole('Unable to check for updates');
  }
};

runCheck().catch(() => { /* never propagate — module-load must not throw */ });
