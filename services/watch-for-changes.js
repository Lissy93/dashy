const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

const configFile = path.resolve(__dirname, './public/conf.yml');
let timeout = null;

console.log(`Watching for file changes on ${configFile}`);

fs.watch(configFile, (eventType, filename) => {
  if (filename && eventType === 'change') {
    console.log(`${filename} file Changed, preparing to build...`);
    // Clear the existing timeout, if there is one
    if (timeout) clearTimeout(timeout);
    // Set a new timeout
    timeout = setTimeout(() => {
      console.log('Running build...');
      exec('yarn build', (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
      });
    }, 1000); // Adjust the debounce time as necessary, here it's 1000 milliseconds (1 second)
  }
});
