/**
 * This file exports a function, used by the write config endpoint.
 * It will make a backup of the users conf.yml file
 * and then write their new config into the main conf.yml file.
 * Finally, it will call a function with the status message
 */
const fsPromises = require('fs').promises;

module.exports = async (newConfig, render) => {
  /* Either returns nothing (if using default path), or strips navigational characters from path */
  const makeSafeFileName = (configObj) => {
    if (!configObj || !configObj.filename) return undefined;
    return configObj.filename.replaceAll('/', '').replaceAll('..', '');
  };

  const usersFileName = makeSafeFileName(newConfig);

  // Define constants for the config file
  const settings = {
    defaultLocation: './public/',
    defaultFile: 'conf.yml',
    filename: 'conf',
    backupDenominator: '.backup.yml',
  };

  // Make the full file name and path to save the backup config file
  const backupFilePath = `${settings.defaultLocation}${usersFileName || settings.filename}-`
    + `${Math.round(new Date() / 1000)}${settings.backupDenominator}`;

  // The path where the main conf.yml should be read and saved to
  const defaultFilePath = settings.defaultLocation + (usersFileName || settings.defaultFile);

  // Returns a string confirming successful job
  const getSuccessMessage = () => `Successfully backed up ${settings.defaultFile} to`
    + ` ${backupFilePath}, and updated the contents of ${defaultFilePath}`;

  // Encoding options for writing to conf file
  const writeFileOptions = { encoding: 'utf8' };

  // Prepare the response returned by the API
  const getRenderMessage = (success, errorMsg) => JSON.stringify({
    success,
    message: !success ? errorMsg : getSuccessMessage(),
  });

  // Makes a backup of the existing config file
  await fsPromises
    .copyFile(defaultFilePath, backupFilePath)
    .catch((error) => render(getRenderMessage(false, `Unable to backup conf.yml: ${error}`)));

  // Writes the new content to the conf.yml file
  await fsPromises
    .writeFile(defaultFilePath, newConfig.config.toString(), writeFileOptions)
    .catch((error) => render(getRenderMessage(false, `Unable to write to conf.yml: ${error}`)));

  // If successful, then render hasn't yet been called- call it
  await render(getRenderMessage(true));
};
