/**
 * This file exports a function, used by the write config endpoint.
 * It will make a backup of the users conf.yml file
 * and then write their new config into the main conf.yml file.
 * Finally, it will call a function with the status message
 */
const fsPromises = require('fs').promises;
const path = require('path');

const { ConfigValidator, formatValidationErrors } = require('./config-validator-utils');

const MAX_CONFIG_BYTES = 256 * 1024;

// Disallow paths having path separators, control chars (NUL/CR/LF), or ..
const SAFE_FILENAME = /^(?!\.+$)[^\\/\0\r\n]+\.ya?ml$/i;

module.exports = async (newConfig, render) => {
  const respond = (success, message, errors = null) => render(JSON.stringify({ 
    success, 
    message,
    errors: errors || undefined,
  }));

  // Validate request body
  if (!newConfig || typeof newConfig.config !== 'string' || newConfig.config.length === 0) {
    respond(false, "Request body is missing or has an invalid 'config' field");
    return;
  }
  if (newConfig.config.length > MAX_CONFIG_BYTES) {
    respond(false, `Config exceeds maximum size of ${MAX_CONFIG_BYTES / 1024} KB`);
    return;
  }

  // Validate YAML syntax and config structure before proceeding
  const validator = new ConfigValidator();
  const validationResult = validator.validate(newConfig.config);
  
  if (!validationResult.valid) {
    const errorMessage = formatValidationErrors(validationResult.errors);
    respond(false, `Config validation failed: ${errorMessage}`, validationResult.errors);
    return;
  }

  // If `filename` (for sub-pages) is specified validate and set it
  let usersFileName;
  if (typeof newConfig.filename === 'string' && newConfig.filename) {
    const base = path.basename(newConfig.filename);
    if (!SAFE_FILENAME.test(base)) {
      respond(false, 'Invalid filename: must be a basename ending in .yml or .yaml');
      return;
    }
    usersFileName = base;
  }

  // Resolve paths
  const userDataDirectory = process.env.USER_DATA_DIR || './user-data/';
  const backupLocation = process.env.BACKUP_DIR || path.join(userDataDirectory, 'config-backups');
  const targetFile = usersFileName || 'conf.yml';
  const targetFilePath = path.join(userDataDirectory, targetFile);

  const backupBase = targetFile.replace(/\.ya?ml$/i, '');
  const backupFilePath = path.join(backupLocation, `${backupBase}-${Date.now()}.backup.yml`);

  // Backup current config before proceeding
  try {
    await fsPromises.mkdir(backupLocation, { recursive: true });
    await fsPromises.copyFile(targetFilePath, backupFilePath);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      respond(false, `Unable to backup ${targetFile}: ${error}`);
      return;
    }
  }

  // Write the new config
  try {
    await fsPromises.writeFile(targetFilePath, newConfig.config, { encoding: 'utf8' });
  } catch (error) {
    respond(false, `Unable to write to ${targetFile}: ${error}`);
    return;
  }

  // If successful, then render hasn't yet been called- call it
  respond(
    true,
    `Successfully backed up ${targetFile} to ${backupFilePath}, `
    + `and updated the contents of ${targetFilePath}`,
  );
};
