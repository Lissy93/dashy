const connect = require('connect');
const serveStatic = require('serve-static');

const util = require('util');
const dns = require('dns');
const os = require('os');

const port = process.env.PORT || 80;

/* eslint no-console: 0 */
const printWelcomeMessage = () => {
  getLocalIp().then(({ address }) => {
    const ip = address || 'localhost';
    console.log(overComplicatedMessage(ip, port));
  });
}

const getLocalIp = () => {
  const dnsLookup = util.promisify(dns.lookup);
  return dnsLookup(os.hostname());
}

const overComplicatedMessage = (ip, port) => {
  let msg = '';
  const chars = {
    RESET: '\x1b[0m',
    CYAN: '\x1b[36m',
    GREEN: '\x1b[32m',
    BLUE: '\x1b[34m',
    UNDERLINE: '\033[4m',
    BOLD: '\033[1m',
    BR: '\n',
  };
  const stars = (count) => new Array(count).fill('*').join('');
  const line = (count) => new Array(count).fill('━').join('');
  const blanks = (count) => new Array(count).fill(' ').join('');
  if (process.env.IS_DOCKER) {
    const containerId = process.env.HOSTNAME || undefined;
    msg = `${chars.BLUE}${stars(91)}${chars.BR}${chars.RESET}`
      + `${chars.CYAN}${chars.BOLD}Welcome to Dashy! 🚀${chars.RESET}${chars.BR}`
      + `${chars.GREEN}Your new dashboard is now up and running `
      + `${containerId ? `in container ID ${containerId}` : 'with Docker'}${chars.BR}`
      + `${chars.GREEN}After updating your config file, run  `
      + `'${chars.UNDERLINE}docker exec -it ${containerId || '[container-id]'} yarn build`
      + `${chars.RESET}${chars.GREEN}' to rebuild${chars.BR}`
      + `${chars.BLUE}${stars(91)}${chars.BR}${chars.RESET}`;
  } else {
    msg = `${chars.GREEN}┏${line(75)}┓${chars.BR}`
      + `┃ ${chars.CYAN}${chars.BOLD}Welcome to Dashy! 🚀${blanks(55)}${chars.GREEN}┃${chars.BR}`
      + `┃ ${chars.CYAN}Your new dashboard is now up and running at ${chars.UNDERLINE}`
      + `http://${ip}:${port}${chars.RESET}${blanks(20 - ip.length)}${chars.GREEN}┃${chars.BR}`
      + `┃ ${chars.CYAN}After updating your config file, run '${chars.UNDERLINE}yarn build`
      + `${chars.RESET}${chars.CYAN}' to rebuild the app${blanks(6)}${chars.GREEN}┃${chars.BR}`
      + `┗${line(75)}┛${chars.BR}${chars.BR}`;
  }
  return msg;
}

try {
  connect()
    .use(serveStatic(`${__dirname}/dist`))
    .listen(port, () => {
      try { printWelcomeMessage(port); }
      catch (e) { console.log('Dashy is Starting...'); }
    });
} catch (error) {
  console.log('Sorry, an error occurred ', error);
}
