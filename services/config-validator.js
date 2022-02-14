/**
 * Checks that conf.yml is present + parsable, then validates it against the schema
 * Prints detailed info about any errors or warnings to help the user fix the issue
 */

const fs = require('fs'); // For opening + reading files
const yaml = require('js-yaml'); // For parsing YAML
const Ajv = require('ajv'); // For validating with schema

const schema = require('../src/utils/ConfigSchema.json');

/* Tell AJV to use strict mode, and report all errors */
const validatorOptions = {
  strict: true,
  allowUnionTypes: true,
  allErrors: true,
};

/* Initiate AJV validator */
const ajv = new Ajv(validatorOptions);

/* Message printed when validation was successful */
const successMsg = () => '\x1b[1m\x1b[32m✔️ Config file is valid, no issues found\x1b[0m\n';

/* Just a wrapper to system's console.log */
const logToConsole = (msg) => { console.log(msg || '\n'); }; // eslint-disable-line no-console

/* Formats error message. ready for printing to the console */
const errorMsg = (output) => {
  const warningFont = '\x1b[103m\x1b[34m';
  const line = `${warningFont}${new Array(42).fill('━').join('')}\x1b[0m`;
  const formatParams = (params) => {
    if (params.additionalProperty) return `(${params.additionalProperty})`;
    return '';
  };
  let msg = `\n${line}\n${warningFont}  Warning: ${output.length} `
    + `issue${output.length > 1 ? 's' : ''} found in config file  \x1b[0m\n${line}\n`;
  output.forEach((details, index) => {
    msg += `${'\x1b[36m'}${index + 1}. \x1b[4m${details.instancePath}\x1b[0m\x1b[36m `
      + `${details.message} ${formatParams(details.params)}\x1b[0m\n`;
  });
  return msg;
};

/* Sets valid status as environmental variable */
const setIsValidVariable = (isValid) => {
  process.env.VUE_APP_CONFIG_VALID = isValid;
};

/* Start the validation */
const validate = (config) => {
  logToConsole('\nChecking config file against schema...');
  const valid = ajv.validate(schema, config);
  if (valid) {
    setIsValidVariable(true);
    logToConsole(successMsg());
  } else {
    setIsValidVariable(false);
    logToConsole(errorMsg(ajv.errors));
  }
};

/* Error message printed when the file could not be opened */
const bigError = () => {
  const formatting = '\x1b[30m\x1b[43m';
  const line = `${formatting}${new Array(38).fill('━').join('')}\x1b[0m\n`;
  const msg = `${formatting} Error, unable to validate 'conf.yml' \x1b[0m\n`;
  return `\n${line}${msg}${line}`;
};

/* Given an error object, prints helpful info to the user */
const printFileReadError = (e) => {
  let customError = '';
  if (e.mark) { // YAML syntax error
    customError = `\x1b[33m\x1b[4m⚠️ Error on line ${e.mark.line}, column ${e.mark.column}: `
      + `${e.reason}\x1b[0m\n\n${e.mark.snippet}\n\x1b[0m`
      + '\n\x1b[36m ℹ️ You might find it helpful to use a YAML validator'
      + ', like: \x1b[4mhttps://yamlchecker.com/\x1b[0m\n';
  }
  if (e.code === 'ENOENT') { // File not found error
    customError = `\x1b[33m⚠️ Config file could not be found at ${e.path}\x1b[0m\n`;
  }
  if (e.code === 'EISDIR') { // Not a file
    customError = '\x1b[33m⚠️ Config needs to be a file, but found a directory instead \x1b[0m\n';
  }
  if (e.code === 'EACCES' || e.code === 'EPERM') { // File permissions error
    customError = '\x1b[33m⚠️ Permission denied \x1b[0m\n';
  }
  logToConsole(customError);
  if (customError === '') { // Unknown error, print stack trace
    const moreInfo = 'Ensure that your config file is present, readable, and valid YAML. '
      + 'If this issue persists, you can get support by raising a ticket on GitHub. '
      + 'Please include the following stack trace';
    logToConsole(moreInfo);
    // eslint-disable-next-line no-console
    console.warn('\x1b[33mStack Trace for config-validator.js:\x1b[0m\n', e);
    logToConsole();
  }
};

try { // Try to open and parse the YAML file
  const config = yaml.load(fs.readFileSync('./public/conf.yml', 'utf8'));
  validate(config);
} catch (e) { // Something went very wrong...
  setIsValidVariable(false);
  logToConsole(bigError());
  printFileReadError(e);
}
