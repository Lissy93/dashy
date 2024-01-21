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
} from '@/utils/defaults';
import ErrorHandler from '@/utils/ErrorHandler';
import { applyItemId } from '@/utils/SectionHelpers';
import $store from '@/store';

import buildConf from '../../public/conf.yml';

export default class ConfigAccumulator {
  constructor() {
    this.conf = $store.state.remoteConfig;
  }

  pages() {
    return this.conf.pages;
  }

  /* App Config */
  appConfig() {
    let appConfigFile = {};
    // Set app config from file
    if (this.conf && this.conf.appConfig) {
      appConfigFile = this.conf.appConfig;
    } else if (buildConf && buildConf.appConfig) {
      appConfigFile = buildConf.appConfig;
    }
    // Fill in defaults if anything missing
    let usersAppConfig = defaultAppConfig;
    if (localStorage[localStorageKeys.APP_CONFIG]) {
      usersAppConfig = JSON.parse(localStorage[localStorageKeys.APP_CONFIG]);
    } else if (Object.keys(appConfigFile).length > 0) {
      usersAppConfig = appConfigFile;
    }
    // Some settings have their own local storage keys, apply them here
    usersAppConfig.layout = localStorage[localStorageKeys.LAYOUT_ORIENTATION]
      || appConfigFile.layout
      || defaultLayout;
    usersAppConfig.iconSize = localStorage[localStorageKeys.ICON_SIZE]
      || appConfigFile.iconSize
      || defaultIconSize;
    // Don't let users modify users locally
    if (appConfigFile.auth) usersAppConfig.auth = appConfigFile.auth;
    // All done, return final appConfig object
    return usersAppConfig;
  }

  /* Page Info */
  pageInfo() {
    let localPageInfo = {};
    if (localStorage[localStorageKeys.PAGE_INFO]) {
      // eslint-disable-next-line brace-style
      try { localPageInfo = JSON.parse(localStorage[localStorageKeys.PAGE_INFO]); }
      catch (e) { ErrorHandler('Malformed pageInfo data in local storage'); }
    }
    const filePageInfo = (this.conf && this.conf.pageInfo) ? this.conf.pageInfo : {};
    return { ...defaultPageInfo, ...filePageInfo, ...localPageInfo };
  }

  /* Sections */
  sections() {
    let sections = [];
    // If the user has stored sections in local storage, return those
    const localSections = localStorage[localStorageKeys.CONF_SECTIONS];
    if (localSections) {
      try {
        const json = JSON.parse(localSections);
        if (json.length >= 1) sections = json;
      } catch (e) {
        ErrorHandler('Malformed section data in local storage');
      }
    }
    // If sections were not set from local data, then use config file instead
    if (sections.length === 0) {
      sections = this.conf ? this.conf.sections || [] : [];
    }
    // Apply a unique ID to each item
    sections = applyItemId(sections);
    return sections;
  }

  /* Complete config */
  config() {
    return {
      appConfig: this.appConfig(),
      pageInfo: this.pageInfo(),
      sections: this.sections(),
      pages: this.pages(),
    };
  }
}
