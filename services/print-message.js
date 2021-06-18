/**
 * A function that prints a welcome message to the user when they start the app
 * Contains essential info about restarting and managing the container or service
 * @param String ip: The users local IP address
 * @param Integer port: the port number the app is running at
 * @param Boolean isDocker: whether or not the app is being run within a container
 * @returns A string formatted for the terminal
 */
module.exports = (ip, port, isDocker) => {
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
