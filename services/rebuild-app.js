/**
 * This script programmatically triggers a production build
 * and responds with the status, message and full output
 */
const { exec } = require('child_process');

module.exports = () => new Promise((resolve, reject) => {
  const buildProcess = exec('npm run build'); // Trigger the build command

  let output = ''; // Will store console output

  // Write output to console, and append to var for returning
  buildProcess.stdout.on('data', (data) => {
    process.stdout.write(data);
    output += data;
  });

  // Handle errors, by sending the reject
  buildProcess.on('error', (error) => {
    reject(Error({
      success: false,
      error,
      output,
    }));
  });

  // When finished, check success, make message and resolve response
  buildProcess.on('exit', (response) => {
    const success = response === 0;
    const message = `Build process exited with ${response}: `
      + `${success ? 'Success' : 'Possible Error'}`;
    resolve({ success, message, output });
  });
});
