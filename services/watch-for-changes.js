const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');
const crypto = require('crypto');

// Default location of config file in container
const configFileName = '../public/conf.yml';
// Real path of config file in container
const configFilePath = path.resolve(__dirname, configFileName);
// Amount of time to ignore file after change detected
const debounceTimeMs = 2000;

// Store current timeout
let timeout = null;
// Store last hash of file
let lastHash = null;

/**
 * Calculate hash of file, used for de-bounce mechanism to
 * prevent successive updates if file content not changed
 */
const hashFileContent = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');
  return crypto.createHash('sha256').update(content).digest('hex');
};

/**
 * Just logs a given message to terminal so user knows what's happening
 */
const logInfo = (message, msgLevel = 'OUTPUT') => {
  const RESET = '\x1b[0m';
  let logLevels = {};
  switch (msgLevel) {
    case 'ERROR': logLevels = { col: '\x1b[31m', func: console.error }; break;
    case 'WARNING': logLevels = { col: '\x1b[33m', func: console.warn }; break;
    case 'INFO': logLevels = { col: '\x1b[36m', func: console.info }; break;
    case 'SUCCESS': logLevels = { col: '\x1b[32m', func: console.log }; break;
    default: logLevels = { col: RESET, func: console.log };
  }
  logLevels.func(`${logLevels.col}\x1b[1m[${msgLevel}]${RESET} ${logLevels.col}${message}${RESET}\n`);
};

// Log initial message to user
logInfo(`When '${configFileName}' is updated, a rebuild will be triggered.\n`);

/**
 * Code to be executed when a watch event is triggered
 * Will check correctly expected file and time frame,
 * then ensure the hash is different from last hash,
 * and then trigger -rebuild of frontend with yarn build
 * outputting the stdrout and stderr to user's terminal
 */
const watchAction = (eventType, filename) => {
  if (filename && eventType === 'change') {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      const currentHash = hashFileContent(configFilePath);
      if (currentHash !== lastHash) {
        lastHash = currentHash;
        logInfo(`${filename} file Changed, running build...`);
        exec('yarn build', (error, stdout, stderr) => {
          if (error) {
            logInfo(error, 'ERROR');
            return;
          }
          logInfo(stdout);
          logInfo(stderr, 'WARNING');
          logInfo('Build completed successfully.\n', 'SUCCESS');
        });
      } else {
        logInfo(`${filename} file Detected change, but content is the same. Skipping....`, 'WARNING');
      }
    }, debounceTimeMs);
  }
};

// Watch given config path, with the watch action function
fs.watch(configFilePath, watchAction);
