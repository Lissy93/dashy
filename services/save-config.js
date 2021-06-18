const fs = require('fs').promises;

/* Copies an existing file to a new file */
async function backupConfig(fromPath, toPath, done) {
  try {
    fs.copyFile(fromPath, toPath, done({ success: true }));
  } catch (error) {
    done({
      success: false,
      message: `Error backing up config file: ${error.message}`,
    });
  }
}

/* Creates a new file and writes content to it */
async function saveNewConfig(writePath, fileContents, done) {
  try {
    fs.writeFile(writePath, fileContents, done({ success: true }));
  } catch (error) {
    done({
      success: false,
      message: `Error writing changes to config file: ${error.message}`,
    });
  }
}

module.exports = (newConfig, render) => {
  // Define constants for the config file
  const settings = {
    defaultLocation: './public/',
    defaultFile: 'conf.yml',
    filename: 'conf',
    backupDenominator: '.backup.yml',
  };

  // Make the full file name and path to save the backup config file
  const backupFilePath = `${settings.defaultLocation}${settings.filename}-`
    + `${Math.round(new Date() / 1000)}${settings.backupDenominator}`;

  // The path where the main conf.yml should be read and saved to
  const defaultFilePath = settings.defaultLocation + settings.defaultFile;

  // Returns a string confirming successful job
  const getSuccessMessage = () => `Successfully backed up ${settings.defaultFile} to`
    + ` ${backupFilePath}, and updated the contents of ${defaultFilePath}`;

  // Prepare the response returned by the API
  const getRenderMessage = (success, errorMsg) => JSON.stringify({
    success,
    message: !success ? errorMsg : getSuccessMessage(),
  });

  // Backs up the config, then writes new content to the existing config, and returns
  backupConfig(defaultFilePath, backupFilePath, (backupResult) => {
    if (!backupResult.success) {
      render(getRenderMessage(false, backupResult.message));
    } else {
      saveNewConfig(defaultFilePath, newConfig.config, (copyResult) => {
        if (copyResult.failed) render(getRenderMessage(false, copyResult.message));
        render(getRenderMessage(true));
      });
    }
  });

  // Promise.resolve().then(() => {
  //   backupConfig(defaultFilePath, backupFilePath)
  //     .catch(error => thereWasAnError(error));
  // }).then(() => {
  //   saveNewConfig(defaultFilePath, newConfig)
  //     .catch(error => thereWasAnError(error));
  // }).then(() => {
  //   render(JSON.stringify({
  //     success: !failed,
  //     message: failed ? errorMessage : 'Success!',
  //   }));
  // });
};
