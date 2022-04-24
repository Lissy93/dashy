import ConfigAccumulator from '@/utils/ConfigAccumalator';
import filterUserSections from '@/utils/CheckSectionVisibility';
import { languages } from '@/utils/languages';
import {
  visibleComponents,
  localStorageKeys,
  theme as defaultTheme,
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
 * Gets the users saved theme, first looks for local storage theme,
 * then looks at user's appConfig, and finally checks the defaults
 * @returns {string} Name of theme to apply
 */
export const getTheme = () => {
  const localTheme = localStorage[localStorageKeys.THEME];
  const appConfigTheme = config.appConfig.theme;
  return localTheme || appConfigTheme || defaultTheme;
};

/**
 * Gets any custom styles the user has applied, wither from local storage, or from the config
 * @returns {object} An array of objects, one for each theme, containing kvps for variables
 */
export const getCustomColors = () => {
  const localColors = JSON.parse(localStorage[localStorageKeys.CUSTOM_COLORS] || '{}');
  const configColors = config.appConfig.customColors || {};
  return Object.assign(configColors, localColors);
};

/**
 * Returns a list of items which the user has assigned a hotkey to
 * So that when the hotkey is pressed, the app/ service can be launched
 */
export const getCustomKeyShortcuts = () => {
  const results = [];
  const sections = config.sections || [];
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
