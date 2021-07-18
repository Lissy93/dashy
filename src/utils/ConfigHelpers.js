import ConfigAccumulator from '@/utils/ConfigAccumalator';
import { visibleComponents, localStorageKeys, theme as defaultTheme } from '@/utils/defaults';

/**
 * Initiates the Accumulator class and generates a complete config object
 * Self-executing function, returns the full user config as a JSON object
 */
export const config = (() => {
  const Accumulator = new ConfigAccumulator();
  return Accumulator.config();
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
    splashScreen: isThere(usersChoice.hideSplashScreen)
      ? !usersChoice.hideSplashScreen : visibleComponents.splashScreen,
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
