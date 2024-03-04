const fs = require('fs');
const { exec } = require('child_process');

const configFile = './public/conf.yml';

console.log(`Watching for file changes on ${configFile}`);

fs.watch(configFile, (eventType, filename) => {
  if (filename && eventType === 'change') {
    console.log(`${filename} file Changed, running build...`);
    exec('yarn build', (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    });
  }
});
