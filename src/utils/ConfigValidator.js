/* eslint-disable no-console */
/* Script that validates the conf.yml file against Dashy's schema, and outputs any issues */
const Ajv = require('ajv');
const yaml = require('js-yaml');
const fs = require('fs');

const schema = require('./ConfigSchema.json');

const validatorOptions = {
  strict: true,
  allowUnionTypes: true,
  allErrors: true,
};

const ajv = new Ajv(validatorOptions);

/* Message printed when validation was successful */
const successMsg = () => '\x1b[1m\x1b[32mNo issues found, your configuration is valid :)\x1b[0m\n';

/* Formats error message. ready for printing to the console */
const errorMsg = (output) => {
  const warningFont = '\x1b[103m\x1b[34m';
  const line = `${warningFont}${new Array(42).fill('━').join('')}\x1b[0m`;
  let msg = `\n${line}\n${warningFont}  Warning: ${output.length} `
    + `issue${output.length > 1 ? 's' : ''} found in config file  \x1b[0m\n${line}\n`;
  output.forEach((details, index) => {
    msg += `${'\x1b[36m'}${index + 1}. ${details.keyword} ${details.message} `
      + `in ${details.instancePath}\x1b[0m\n`;
  });
  return msg;
};

/* Error message printed when the file could not be opened */
const bigError = () => {
  const formatting = '\x1b[30m\x1b[43m';
  const line = `${formatting}${new Array(38).fill('━').join('')}\x1b[0m\n`;
  const msg = `${formatting} Error, unable to validate 'conf.yml' \x1b[0m\n`;
  return `\n${line}${msg}${line}\n`;
};

/* Start the validation */
const validate = (config) => {
  console.log('\nChecking config file against schema...');
  const valid = ajv.validate(schema, config);
  if (valid) {
    console.log(successMsg());
  } else {
    console.log(errorMsg(ajv.errors));
  }
};

try {
  const config = yaml.load(fs.readFileSync('./public/conf.yml', 'utf8'));
  validate(config);
} catch (e) {
  console.log(bigError());
  console.log('Please ensure that your config file is present, '
    + 'has the correct access rights and is parsable. '
    + 'If this warning persists, it may be an issue with the '
    + 'validator function. Please raise an issue, and include the following stack trace:\n');
  console.warn('\x1b[33mStack Trace for ConfigValidators.js:\x1b[0m\n', e);
  console.log('\n\n');
}
