/**
 * A function for pre-loading, and easy switching of external stylesheets
 */
const ThemeHelper = function th() {
  /* Preload content, to avoid FOUC */
  const preloadTheme = (href) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
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

  const selectTheme = (themes, name) => {
    const themeResults = themes;
    if (name && !themes[name]) {
      throw new Error(`'${name}' has not been defined as a theme.`);
    }
    Object.keys(themeResults).forEach(n => { themeResults[n].disabled = (n !== name); });
  };

  const themes = {};

  return {
    add(name, href) { return preloadTheme(href).then(s => { themes[name] = s; }); },
    set theme(name) { selectTheme(themes, name); },
    get theme() { return Object.keys(themes).find(n => !themes[n].disabled); },
  };
};

export default ThemeHelper;
