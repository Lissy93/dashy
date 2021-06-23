/**
 * Reads the users config from `conf.yml`, and combines it with any local preferences
 * Also ensures that any missing attributes are populated with defaults, and the
 * object is structurally sound, to avoid any error if the user is missing something
 * The main config object is made up of three parts: appConfig, pageInfo and sections
 */
import Defaults, { localStorageKeys } from '@/utils/defaults';
import conf from '../../public/conf.yml';

/**
 * Returns the appConfig section, as JSON
 */
export const appConfig = (() => {
  const appConfigFile = conf.appConfig || {};
  let usersAppConfig = Defaults.appConfig;
  if (localStorage[localStorageKeys.APP_CONFIG]) {
    usersAppConfig = JSON.parse(localStorage[localStorageKeys.APP_CONFIG]);
  } else if (appConfigFile !== {}) {
    usersAppConfig = appConfigFile;
  }
  usersAppConfig.layout = localStorage[localStorageKeys.LAYOUT_ORIENTATION]
    || appConfigFile.layout || Defaults.layout;
  usersAppConfig.iconSize = localStorage[localStorageKeys.ICON_SIZE]
    || appConfigFile.iconSize || Defaults.iconSize;
  return usersAppConfig;
})();

/**
 * Returns the pageInfo section, as JSON
 */
export const pageInfo = (() => {
  const defaults = Defaults.pageInfo;
  let localPageInfo;
  try {
    localPageInfo = JSON.parse(localStorage[localStorageKeys.PAGE_INFO]);
  } catch (e) {
    localPageInfo = {};
  }
  const pi = conf.pageInfo || defaults; // The page info object to return
  pi.title = localPageInfo.title || conf.pageInfo.title || defaults.title;
  pi.description = localPageInfo.description || conf.pageInfo.description || defaults.description;
  pi.navLinks = localPageInfo.navLinks || conf.pageInfo.navLinks || defaults.navLinks;
  pi.footerText = localPageInfo.footerText || conf.pageInfo.footerText || defaults.footerText;
  return pi;
})();

/**
 * Returns the sections section, as an array of JSON objects
 */
export const sections = (() => {
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
  return conf.sections;
})();

/**
 * Returns the complete configuration, as JSON
 */
export const config = (() => {
  const result = {
    appConfig,
    pageInfo,
    sections,
  };
  return result;
})();
