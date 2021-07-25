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
    usersAppConfig.language = localStorage[localStorageKeys.LANGUAGE]
      || appConfigFile.language || defaultLanguage;
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
