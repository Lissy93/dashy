/**
 * Returns a welcome message, to be printed to the user when they start the app
 * Contains essential info about restarting and managing the container or service
 * @param String ip: The users local IP address or hostname
 * @param Integer port: the port number that the app is running at
 * @param Boolean isDocker: whether or not the app is being run within a container
 * @returns A string formatted for the terminal
 */
module.exports = (ip, port, isDocker) => {
  let msg = ''; // To return
  const chars = { // Color codes used in the message
    RESET: '\x1b[0m',
    CYAN: '\x1b[36m',
    GREEN: '\x1b[32m',
    BLUE: '\x1b[34m',
    BRIGHT: '\x1b[1m',
    BR: '\n',
  };
  // Functions to insert string of set length of characters
  const printChars = (count, char) => new Array(count).fill(char).join('');
  const stars = (count) => printChars(count, '*');
  const line = (count) => printChars(count, '━');
  const blanks = (count) => printChars(count, ' ');
  if (isDocker) {
    // Prepare message for Docker users
    const containerId = process.env.HOST || undefined;
    msg = `${chars.BLUE}${stars(91)}${chars.BR}${chars.RESET}`
      + `${chars.CYAN}Welcome to Dashy! 🚀${chars.RESET}${chars.BR}`
      + `${chars.GREEN}Your new dashboard is now up and running `
      + `${containerId ? `in container ID ${containerId}` : 'with Docker'}${chars.BR}`
      + `${chars.BLUE}${stars(91)}${chars.BR}${chars.RESET}`;
  } else {
    // Prepare message for users running app on bare metal
    msg = `${chars.GREEN}┏${line(75)}┓${chars.BR}`
      + `┃ ${chars.CYAN}Welcome to Dashy! 🚀${blanks(55)}${chars.GREEN}┃${chars.BR}`
      + `┃ ${chars.CYAN}Your new dashboard is now up and running at ${chars.BRIGHT}`
      + `http://${ip}:${port}${chars.RESET}${blanks(18 - ip.length)}${chars.GREEN}┃${chars.BR}`
      + `┗${line(75)}┛${chars.BR}${chars.BR}${chars.RESET}`;
  }
  // Make some sexy ascii art ;)
  const ascii = `${chars.CYAN}\n\n`
    + ' ██████╗  █████╗ ███████╗██╗  ██╗██╗   ██╗\n'
    + ' ██╔══██╗██╔══██╗██╔════╝██║  ██║╚██╗ ██╔╝\n'
    + ' ██║  ██║███████║███████╗███████║ ╚████╔╝\n'
    + ' ██║  ██║██╔══██║╚════██║██╔══██║  ╚██╔╝\n'
    + ' ██████╔╝██║  ██║███████║██║  ██║   ██║\n'
    + ` ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝   ╚═╝\n${chars.RESET}\n`;

  return ascii + msg;
};
