/**
 * Reads the users config from `conf.yml`, and combines it with any local preferences
 * Also ensures that any missing attributes are populated with defaults, and the
 * object is structurally sound, to avoid any error if the user is missing something
 * The main config object is made up of three parts: appConfig, pageInfo and sections
 * For anything other than these three sections, please see @utils/ConfigHelpers.js
 */
import {
  localStorageKeys,
  appConfig as defaultAppConfig,
  pageInfo as defaultPageInfo,
  iconSize as defaultIconSize,
  layout as defaultLayout,
  language as defaultLanguage,
} from '@/utils/defaults';

import conf from '../../public/conf.yml';

export default class ConfigAccumulator {
  constructor() {
    this.conf = conf;
  }

  /* App Config */
  appConfig() {
    let appConfigFile = {};
    // Set app config from file
    if (this.conf) appConfigFile = this.conf.appConfig || {};
    // Fill in defaults if anything missing
    let usersAppConfig = defaultAppConfig;
    if (localStorage[localStorageKeys.APP_CONFIG]) {
      usersAppConfig = JSON.parse(localStorage[localStorageKeys.APP_CONFIG]);
    } else if (appConfigFile !== {}) {
      usersAppConfig = appConfigFile;
    }
    // Some settings have their own local storage keys, apply them here
    usersAppConfig.layout = localStorage[localStorageKeys.LAYOUT_ORIENTATION]
      || appConfigFile.layout || defaultLayout;
    usersAppConfig.iconSize = localStorage[localStorageKeys.ICON_SIZE]
      || appConfigFile.iconSize || defaultIconSize;
    usersAppConfig.language = localStorage[localStorageKeys.LANGUAGE]
      || appConfigFile.language || defaultLanguage;
    // Don't let users modify users locally
    if (appConfigFile.auth) usersAppConfig.auth = appConfigFile.auth;
    // All done, return final appConfig object
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
    let filePageInfo = {};
    if (this.conf) {
      filePageInfo = this.conf.pageInfo || {};
    }
    const pi = filePageInfo || defaults; // The page info object to return
    pi.title = localPageInfo.title || filePageInfo.title || defaults.title;
    pi.logo = localPageInfo.logo || filePageInfo.logo || defaults.logo;
    pi.description = localPageInfo.description || filePageInfo.description || defaults.description;
    pi.navLinks = localPageInfo.navLinks || filePageInfo.navLinks || defaults.navLinks;
    pi.footerText = localPageInfo.footerText || filePageInfo.footerText || defaults.footerText;
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
    let sectionsFile = [];
    if (this.conf) sectionsFile = this.conf.sections || [];
    return sectionsFile;
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
