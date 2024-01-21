const axios = require('axios').default;

const currentVersion = require('../package.json').version;

const packageUrl = 'https://raw.githubusercontent.com/Lissy93/dashy/master/package.json';

const logToConsole = (msg) => {
  console.log(msg); // eslint-disable-line no-console
};

const makeMsg = (latestVersion) => {
  const parse = (version) => parseInt(version.replace(/\./g, ''), 10);
  const difference = parse(latestVersion) - parse(currentVersion);
  let msg = '';
  if (difference <= 0) {
    msg = '\x1b[1m\x1b[32m✅ Dashy is Up-to-Date\x1b[0m\n';
  } else {
    msg = `\x1b[103m\x1b[34m${new Array(27).fill('━').join('')}\x1b[0m\n`
      + `\x1b[103m\x1b[34m⚠️ Update Available: ${latestVersion} \x1b[0m\n`
      + `\x1b[103m\x1b[34m${new Array(27).fill('━').join('')}\x1b[0m\n`;
  }
  return msg;
};

axios.get(packageUrl).then((response) => {
  if (response && response.data && response.data.version) {
    logToConsole(`\nUsing Dashy V-${currentVersion}. Update Check Complete`);
    logToConsole(makeMsg(response.data.version));
  }
}).catch(() => {
  logToConsole('Unable to check for updates');
});
