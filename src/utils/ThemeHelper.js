import ErrorHandler from '@/utils/ErrorHandler';
import { getTheme, getCustomColors } from '@/utils/ConfigHelpers';
import { mainCssVars } from '@/utils/defaults';

/* Returns users current theme */
export const GetTheme = () => getTheme();

/* Gets user custom color preferences for current theme, and applies to DOM */
export const ApplyCustomVariables = (theme) => {
  mainCssVars.forEach((vName) => { document.documentElement.style.removeProperty(`--${vName}`); });
  const themeColors = getCustomColors()[theme];
  if (themeColors) {
    Object.keys(themeColors).forEach((customVar) => {
      document.documentElement.style.setProperty(`--${customVar}`, themeColors[customVar]);
    });
  }
};

/* Sets the theme, by updating data-theme attribute on the html tag */
export const ApplyLocalTheme = (newTheme) => {
  const htmlTag = document.getElementsByTagName('html')[0];
  if (htmlTag.hasAttribute('data-theme')) htmlTag.removeAttribute('data-theme');
  htmlTag.setAttribute('data-theme', newTheme);
};

/**
 * A function for pre-loading, and easy switching of external stylesheets
 * External CSS is preloaded to avoid FOUC
 */
export const LoadExternalTheme = function th() {
  /* Preload selected external theme */
  const preloadTheme = (href) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = href;
    document.head.appendChild(link);
    return new Promise((resolve, reject) => {
      link.onload = e => {
        const { sheet } = e.target;
        sheet.disabled = true;
        resolve(sheet);
      };
      link.onerror = reject;
    });
  };

  /* Check theme is selected, and it exists */
  const checkTheme = (themes, name) => {
    if ((!name) || (name !== 'custom' && !themes[name])) {
      ErrorHandler(`Theme: '${name || '[not selected]'}' does not exist.`);
      return false;
    }
    return true;
  };

  /* Disable all but selected theme */
  const selectTheme = (themes, name) => {
    if (checkTheme(themes, name)) {
      const t = themes; // To avoid ESLint complaining about mutating a param
      Object.keys(themes).forEach(n => { t[n].disabled = (n !== name); });
    }
  };

  const themes = {};

  return {
    add(name, href) { return preloadTheme(href).then(s => { themes[name] = s; }); },
    set theme(name) { selectTheme(themes, name); },
    get theme() { return Object.keys(themes).find(n => !themes[n].disabled); },
  };
};
