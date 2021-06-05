const Ajv = require('ajv');
const yaml = require('js-yaml');
const fs = require('fs');

const schema = require('./ConfigSchema');

const validatorOptions = {
  strict: true,
  allowUnionTypes: true,
  allErrors: true,
};

const ajv = new Ajv(validatorOptions);

/* Message printed when validation was successful */
const successMsg = () => {
  return '\x1b[1m\x1b[32m\033[1mNo issues found, your configuration is valid :)\x1b[0m\n';
}

/* Formats error message. ready for printing to the console */
const errorMsg = (output) => {
  const warningFont = '\033[1m\x1b[103m\x1b[34m';
  const line = `${warningFont}${new Array(42).fill('━').join('')}\x1b[0m`;
  let msg = `\n${line}\n${warningFont}  Warning: ${output.length} `
    + `issue${output.length > 1 ? 's' : ''} found in config file  \x1b[0m\n${line}\n`;
  output.forEach((details, index) => {
    msg += `${'\033[1m\x1b[36m'}${index + 1}. ${details.keyword} ${details.message} `
      + `in ${'\033[4m'}${details.instancePath}\x1b[0m\n`;
  });
  return msg;
};

/* Error message printed when the file could not be opened */
const bigError = () => {
  const formatting = '\033[31m\033[1m\033[47m';
  const line = `${formatting}${new Array(41).fill('━').join('')}\x1b[0m\n`;
  const msg = `${formatting} Error, unable to find / open 'conf.yml' \x1b[0m\n`;
  return `${line}${msg}${line}\n`;
}

/* Start the validation */
const validate = (config, schema) => {
  console.log('\nChecking config file against schema...');
  const valid = ajv.validate(schema, config);
  if (valid) {
    console.log(successMsg());
  } else {
    console.log(errorMsg(ajv.errors));
  }
}

try {
  const config = yaml.safeLoad(fs.readFileSync('./public/conf.yml', 'utf8'));
  validate(config, schema);
} catch (e) {
  console.log(bigError(), e);
}

