/**
 * Utils for applying user's theme to the document
 */

import { localStorageKeys, mainCssVars, builtInThemes } from '@/utils/config/defaults';
import ErrorHandler from '@/utils/logging/ErrorHandler';

const EXTERNAL_STYLE_ID = 'user-defined-stylesheet';
const html = () => document.documentElement;

/* Map of { label: href } for stylesheets declared in appConfig.externalStyleSheet */
export const getExternalThemes = (appConfig) => {
  const ext = appConfig?.externalStyleSheet;
  if (!ext) return {};
  if (Array.isArray(ext)) {
    return Object.fromEntries(ext.map((href, i) => [`External Stylesheet ${i + 1}`, href]));
  }
  if (typeof ext === 'string') return { 'External Stylesheet': ext };
  ErrorHandler('External stylesheets must be of type string or string[]');
  return {};
};

/* Names of user-defined themes (appConfig.cssThemes). Always returns an array. */
export const getExtraThemeNames = (appConfig) => {
  const t = appConfig?.cssThemes;
  if (!t) return [];
  return typeof t === 'string' ? [t] : t;
};

const resetDom = () => {
  document.getElementById(EXTERNAL_STYLE_ID)?.remove();
  html().removeAttribute('data-theme');
};

const applyRemote = (href) => {
  resetDom();
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.id = EXTERNAL_STYLE_ID;
  link.href = href;
  document.head.appendChild(link);
};

const applyCustomVars = (theme, appConfig) => {
  mainCssVars.forEach((v) => html().style.removeProperty(`--${v}`));
  let localColors = {};
  try {
    localColors = JSON.parse(localStorage[localStorageKeys.CUSTOM_COLORS] || '{}');
  } catch (e) { /* corrupt JSON — skip */ }
  const vars = { ...(appConfig?.customColors || {}), ...localColors }[theme];
  if (!vars) return;
  Object.entries(vars).forEach(([k, v]) => html().style.setProperty(`--${k}`, v));
};

/**
 * Apply a theme name to the document. Handles built-in + user-defined + external
 * stylesheets + the special "default" reset + per-theme custom CSS vars
 */
export const applyTheme = (theme, appConfig = {}) => {
  if (!theme) return;
  const externals = getExternalThemes(appConfig);
  const locals = [...builtInThemes, ...getExtraThemeNames(appConfig)];

  if (theme.toLowerCase() === 'default') {
    resetDom();
  } else if (locals.includes(theme)) {
    resetDom();
    html().setAttribute('data-theme', theme);
  } else if (externals[theme]) {
    applyRemote(externals[theme]);
  }
  applyCustomVars(theme, appConfig);
};
