import ConfigAccumulator from '@/utils/ConfigAccumalator';
// import $store from '@/store';
import filterUserSections from '@/utils/CheckSectionVisibility';
import { languages } from '@/utils/languages';
import {
  visibleComponents,
  localStorageKeys,
  language as defaultLanguage,
} from '@/utils/defaults';
import ErrorHandler from '@/utils/ErrorHandler';
import ConfigSchema from '@/utils/ConfigSchema.json';

/* Given a page name, converts to lowercase, removes special characters and extension */
export const makePageName = (pageName) => {
  if (!pageName) return 'unnamed-page';
  return pageName
    .toLowerCase()
    .replaceAll(' ', '-')
    .replace('.yml', '')
    .replace(/[^\w\s-]/gi, '');
};

/* For a given sub-page, and page type, return the URL */
export const makePageSlug = (pageName, pageType) => {
  const formattedName = makePageName(pageName);
  return `/${pageType}/${formattedName}`;
};

/* Put fetch path for additional configs in correct format */
export const formatConfigPath = (configPath) => {
  if (/^https?:\/\//.test(configPath)) return configPath;
  if (configPath.substring(0, 1) !== '/') return `/${configPath}`;
  return configPath;
};

/**
 * Resolves the complete config file path by combining BASE_URL with the config path.
 * If VUE_APP_CONFIG_PATH is a full URL (http:// or https://), returns it as-is.
 * Otherwise, joins BASE_URL with the config path. Defaults to './conf.yml' if no path is set.
 * If BASE_URL is incomplete, falls back to a relative path.
 * @param {string} configDefault - Default config path if VUE_APP_CONFIG_PATH is not set
 * @returns {string} The complete config file path
 */
export const getConfigFilePath = (configDefault = './conf.yml') => {
  const configPath = process.env.VUE_APP_CONFIG_PATH || configDefault;

  // If it's already a full URL, return as-is
  if (/^https?:\/\//.test(configPath)) {
    return configPath;
  }

  // Get BASE_URL and ensure it's valid
  const baseUrl = (process.env.BASE_URL || '/').replace(/\/$/, '');

  // If BASE_URL is incomplete (just protocol or empty), fall back to relative path
  if (!baseUrl || /^https?:$/.test(baseUrl)) {
    return formatConfigPath(configPath);
  }

  // Combine baseUrl with the formatted config path
  const normalizedPath = formatConfigPath(configPath);
  return `${baseUrl}${normalizedPath}`;
};

/**
 * Initiates the Accumulator class and generates a complete config object
 * Self-executing function, returns the full user config as a JSON object
 */
export const config = (() => {
  const Accumulator = new ConfigAccumulator();
  return {
    appConfig: Accumulator.appConfig(),
    pageInfo: Accumulator.pageInfo(),
    sections: filterUserSections(Accumulator.sections()),
  };
})();

/**
 * Generates an object containing booleans indicating which
 * components should be hidden. This enables the user to hide
 * parts of the page and disable functionality that they don't need/ want
 * All options fallback on the values defined in the defaults
 * @param {object} appConfig The full app config
 * @returns {object} result
 */
export const componentVisibility = (appConfig) => {
  // Get users choice from app config
  const usersChoice = appConfig.hideComponents || {};
  // Checks if value is defined, and is a boolean
  const isThere = (userValue) => typeof userValue === 'boolean';
  // For each option, return users choice (if specified), else use the default
  return {
    pageTitle: isThere(usersChoice.hideHeading)
      ? !usersChoice.hideHeading : visibleComponents.pageTitle,
    navigation: isThere(usersChoice.hideNav)
      ? !usersChoice.hideNav : visibleComponents.navigation,
    searchBar: isThere(usersChoice.hideSearch)
      ? !usersChoice.hideSearch : visibleComponents.searchBar,
    settings: isThere(usersChoice.hideSettings)
      ? !usersChoice.hideSettings : visibleComponents.settings,
    footer: isThere(usersChoice.hideFooter)
      ? !usersChoice.hideFooter : visibleComponents.footer,
  };
};

/**
 * Returns a list of items which the user has assigned a hotkey to
 * So that when the hotkey is pressed, the app/ service can be launched
 */
export const getCustomKeyShortcuts = (sections) => {
  const results = [];
  sections.forEach((section) => {
    const itemsWithHotKeys = section.items.filter(item => item.hotkey);
    results.push(itemsWithHotKeys.map(item => ({ hotkey: item.hotkey, url: item.url })));
  });
  return results.flat();
};

/**
 * Gets the users chosen language. Defaults to English.
 * @returns {object} Language, including code, name and flag
 */
export const getUsersLanguage = () => {
  const langCode = localStorage[localStorageKeys.LANGUAGE]
    || config.appConfig.language
    || defaultLanguage;
  const langObj = languages.find(lang => lang.code === langCode);
  return langObj;
};

/**
 * validator for item target attribute
 * Uses enum values from config schema, and shows warning if invalid
 * @param {String} target
 * @returns {Boolean} isValid
 */
export const targetValidator = (target) => {
  const acceptedTargets = ConfigSchema.properties.sections.items
    .properties.items.items.properties.target.enum;
  const isTargetValid = acceptedTargets.indexOf(target) !== -1;
  if (!isTargetValid) ErrorHandler(`Unknown target value: ${target}`);
  return isTargetValid;
};
