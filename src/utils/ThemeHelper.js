/**
 * A function for pre-loading, and easy switching of external stylesheets
 * External CSS is preloaded to avoid FOUC
 */
const ThemeHelper = function th() {
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
    const t = themes; // To avoid ESLint complaining about mutating a param
    if (name && !themes[name]) throw new Error(`Theme: '${name}' does not exist.`);
    Object.keys(themes).forEach(n => { t[n].disabled = (n !== name); });
  };

  const themes = {};

  return {
    add(name, href) { return preloadTheme(href).then(s => { themes[name] = s; }); },
    set theme(name) { selectTheme(themes, name); },
    get theme() { return Object.keys(themes).find(n => !themes[n].disabled); },
  };
};

export default ThemeHelper;
