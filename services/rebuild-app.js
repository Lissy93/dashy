/**
 * This script programmatically triggers a production build
 * and responds with the status, message and full output
 */
const { exec } = require('child_process');

module.exports = () => new Promise((resolve, reject) => {
  const buildProcess = exec('npm run build');

  let output = '';

  buildProcess.stdout.on('data', (data) => {
    process.stdout.write(data);
    output += data;
  });

  buildProcess.on('error', (error) => {
    reject(Error({
      success: false,
      error,
      output,
    }));
  });

  buildProcess.on('exit', (response) => {
    const success = response === 0;
    const message = `Build process exited with ${response}: `
      + `${success ? 'Success' : 'Possible Error'}`;
    resolve({ success, message, output });
  });
});
