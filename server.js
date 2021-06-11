/* eslint-disable no-console */
/* This is a simple Node.js http server, that is used to serve up the contents of ./dist */
const connect = require('connect');
const serveStatic = require('serve-static');

const util = require('util');
const dns = require('dns');
const os = require('os');

require('./src/utils/ConfigValidator');

const isDocker = !!process.env.IS_DOCKER;

/* Checks env var for port. If undefined, will use Port 80 for Docker, or 4000 for metal */
const port = process.env.PORT || isDocker ? 80 : 4000;

const getLocalIp = () => {
  const dnsLookup = util.promisify(dns.lookup);
  return dnsLookup(os.hostname());
};

const overComplicatedMessage = (ip) => {
  let msg = '';
  const chars = {
    RESET: '\x1b[0m',
    CYAN: '\x1b[36m',
    GREEN: '\x1b[32m',
    BLUE: '\x1b[34m',
    BRIGHT: '\x1b[1m',
    BR: '\n',
  };
  const stars = (count) => new Array(count).fill('*').join('');
  const line = (count) => new Array(count).fill('━').join('');
  const blanks = (count) => new Array(count).fill(' ').join('');
  if (isDocker) {
    const containerId = process.env.HOSTNAME || undefined;
    msg = `${chars.BLUE}${stars(91)}${chars.BR}${chars.RESET}`
      + `${chars.CYAN}Welcome to Dashy! 🚀${chars.RESET}${chars.BR}`
      + `${chars.GREEN}Your new dashboard is now up and running `
      + `${containerId ? `in container ID ${containerId}` : 'with Docker'}${chars.BR}`
      + `${chars.GREEN}After updating your config file, run  `
      + `'${chars.BRIGHT}docker exec -it ${containerId || '[container-id]'} yarn build`
      + `${chars.RESET}${chars.GREEN}' to rebuild${chars.BR}`
      + `${chars.BLUE}${stars(91)}${chars.BR}${chars.RESET}`;
  } else {
    msg = `${chars.GREEN}┏${line(75)}┓${chars.BR}`
      + `┃ ${chars.CYAN}Welcome to Dashy! 🚀${blanks(55)}${chars.GREEN}┃${chars.BR}`
      + `┃ ${chars.CYAN}Your new dashboard is now up and running at ${chars.BRIGHT}`
      + `http://${ip}:${port}${chars.RESET}${blanks(18 - ip.length)}${chars.GREEN}┃${chars.BR}`
      + `┃ ${chars.CYAN}After updating your config file, run '${chars.BRIGHT}yarn build`
      + `${chars.RESET}${chars.CYAN}' to rebuild the app${blanks(6)}${chars.GREEN}┃${chars.BR}`
      + `┗${line(75)}┛${chars.BR}${chars.BR}`;
  }
  return msg;
};

/* eslint no-console: 0 */
const printWelcomeMessage = () => {
  getLocalIp().then(({ address }) => {
    const ip = address || 'localhost';
    console.log(overComplicatedMessage(ip));
  });
};

try {
  connect()
    .use(serveStatic(`${__dirname}/dist`))
    .use(serveStatic(`${__dirname}/public`, { index: 'default.html' }))
    .listen(port, () => {
      try { printWelcomeMessage(); } catch (e) { console.log('Dashy is Starting...'); }
    });
} catch (error) {
  console.log('Sorry, an error occurred ', error);
}
