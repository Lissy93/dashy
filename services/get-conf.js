/**
 * Gets the configuration from conf.yml
 */
const fs = require('fs');
const yaml = require('js-yaml');

module.exports = () => {
  const conf = yaml.load(fs.readFileSync('./public/conf.yml', 'utf-8'));
  return conf;
};
