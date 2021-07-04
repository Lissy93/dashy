/**
 * Reads the users config from `conf.yml`, and combines it with any local preferences
 * Also ensures that any missing attributes are populated with defaults, and the
 * object is structurally sound, to avoid any error if the user is missing something
 * The main config object is made up of three parts: appConfig, pageInfo and sections
 */
import {
  localStorageKeys,
  appConfig as defaultAppConfig,
  layout as defaultLayout,
  iconSize as defaultIconSize,
  pageInfo as defaultPageInfo,
} from '@/utils/defaults';
import ErrorHandler from '@/utils/ErrorHandler';
import conf from '../../public/conf.yml';

export default class ConfigAccumulator {
  constructor(filePath) {
    if (filePath) { // Custom config path passed in
      this.loadAdditionalConfig(filePath);
    } else { // We are using the default config
      this.conf = conf;
    }
  }

  /**
   * If we're loading the config for any page other than the default (conf.yml)
   * then this function handles the importing and checking of additional configs.
   * This feature is only used when the user has multiple pages and config files.
   */
  loadAdditionalConfig(filePath) {
    try {
      // eslint-disable-next-line global-require, import/no-dynamic-require
      const importedConf = require(`../../public/configs/${filePath}`);
      // Ensure user isn't trying to import anything funky
      if (typeof importedConf === 'object') {
        this.conf = importedConf;
      } else {
        this.conf = conf;
      }
    } catch (e) { // Unable to read input config, fallback to the main conf.yml file
      this.conf = conf;
      ErrorHandler(`Unable to read this pages config file using ${filePath}`, e);
    }
  }

  /* App Config */
  appConfig() {
    const appConfigFile = this.conf.appConfig || {};
    let usersAppConfig = defaultAppConfig;
    if (localStorage[localStorageKeys.APP_CONFIG]) {
      usersAppConfig = JSON.parse(localStorage[localStorageKeys.APP_CONFIG]);
    } else if (appConfigFile !== {}) {
      usersAppConfig = appConfigFile;
    }
    usersAppConfig.layout = localStorage[localStorageKeys.LAYOUT_ORIENTATION]
      || appConfigFile.layout || defaultLayout;
    usersAppConfig.iconSize = localStorage[localStorageKeys.ICON_SIZE]
      || appConfigFile.iconSize || defaultIconSize;
    return usersAppConfig;
  }

  /* Page Info */
  pageInfo() {
    const defaults = defaultPageInfo;
    let localPageInfo;
    try {
      localPageInfo = JSON.parse(localStorage[localStorageKeys.PAGE_INFO]);
    } catch (e) {
      localPageInfo = {};
    }
    const pi = this.conf.pageInfo || defaults; // The page info object to return
    pi.title = localPageInfo.title || conf.pageInfo.title || defaults.title;
    pi.description = localPageInfo.description || conf.pageInfo.description || defaults.description;
    pi.navLinks = localPageInfo.navLinks || conf.pageInfo.navLinks || defaults.navLinks;
    pi.footerText = localPageInfo.footerText || conf.pageInfo.footerText || defaults.footerText;
    return pi;
  }

  /* Sections */
  sections() {
    // If the user has stored sections in local storage, return those
    const localSections = localStorage[localStorageKeys.CONF_SECTIONS];
    if (localSections) {
      try {
        const json = JSON.parse(localSections);
        if (json.length >= 1) return json;
      } catch (e) {
        // The data in local storage has been malformed, will return conf.sections instead
      }
    }
    // If the function hasn't yet returned, then return the config file sections
    return this.conf.sections;
  }

  /* Complete config */
  config() {
    return {
      appConfig: this.appConfig(),
      pageInfo: this.pageInfo(),
      sections: this.sections(),
    };
  }
}

/**
 * Returns the complete configuration, as JSON
 */
export const config = (() => {
  const Accumulator = new ConfigAccumulator();
  return Accumulator.config();
})();
