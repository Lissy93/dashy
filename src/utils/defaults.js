module.exports = {
  /* Default pageInfo object, used if user does not specify their own */
  pageInfo: {
    title: 'Dashy',
    description: '',
    navLinks: [
      { title: 'Home', path: '/' },
      { title: 'Source', path: 'https://github.com/Lissy93/dashy' },
    ],
    footerText: '',
  },
  /* Default appConfig to be used, if user does not specify their own */
  appConfig: {},
  /* Default language code */
  language: 'en',
  /* Default icon size to be applied on initial load */
  iconSize: 'medium',
  /* Default layout to be applied on initial load */
  layout: 'auto',
  /* Default theme to be applied on initial load */
  theme: 'default',
  /* Default Font-Awesome API key, for FA icons (if used) */
  fontAwesomeKey: '0821c65656',
  /* Default API to use for fetching of user service favicon icons (if enabled) */
  faviconApi: 'faviconkit',
  /* List of built-in themes, to be displayed within the theme-switcher dropdown */
  builtInThemes: [
    'callisto',
    'thebe',
    'dracula',
    'material',
    'material-dark',
    'colorful',
    'nord',
    'nord-frost',
    'minimal-dark',
    'minimal-light',
    'oblivion',
    'matrix',
    'matrix-red',
    'hacker-girl',
    'raspberry-jam',
    'bee',
    'tiger',
    'blue-purple',
    'material-original',
    'material-dark-original',
    'cyberpunk',
    'vaporware',
    'high-contrast-dark',
    'high-contrast-light',
  ],
  /* Which structural components should be visible by default */
  visibleComponents: {
    pageTitle: true,
    navigation: true,
    searchBar: true,
    settings: true,
    footer: true,
  },
  /* Key names for local storage identifiers */
  localStorageKeys: {
    LANGUAGE: 'language',
    HIDE_WELCOME_BANNER: 'hideWelcomeHelpers',
    LAYOUT_ORIENTATION: 'layoutOrientation',
    COLLAPSE_STATE: 'collapseState',
    ICON_SIZE: 'iconSize',
    THEME: 'theme',
    CUSTOM_COLORS: 'customColors',
    CONF_SECTIONS: 'confSections',
    PAGE_INFO: 'pageInfo',
    APP_CONFIG: 'appConfig',
    BACKUP_ID: 'backupId',
    BACKUP_HASH: 'backupHash',
    HIDE_SETTINGS: 'hideSettings',
    USERNAME: 'username',
  },
  /* Key names for cookie identifiers */
  cookieKeys: {
    AUTH_TOKEN: 'authenticationToken',
  },
  /* Key names for session storage identifiers */
  sessionStorageKeys: {
    SW_STATUS: 'serviceWorkerStatus',
  },
  /* Unique IDs of modals within the app */
  modalNames: {
    CONF_EDITOR: 'CONF_EDITOR',
    CLOUD_BACKUP: 'CLOUD_BACKUP',
    REBUILD_APP: 'REBUILD_APP',
    THEME_MAKER: 'THEME_MAKER',
    ABOUT_APP: 'ABOUT_APP',
    LANG_SWITCHER: 'LANG_SWITCHER',
  },
  /* Key names for the top-level objects in conf.yml */
  topLevelConfKeys: {
    PAGE_INFO: 'pageInfo',
    APP_CONFIG: 'appConfig',
    SECTIONS: 'sections',
  },
  /* Which CSS variables to show in the first view of theme configurator */
  mainCssVars: ['primary', 'background', 'background-darker'],
  /* Amount of time to show splash screen, when enabled, in milliseconds */
  splashScreenTime: 1900,
  /* Page meta-data, rendered in the header of each view */
  metaTagData: [
    { name: 'description', content: 'A simple static homepage for you\'re server' },
  ],
  /* Default option for Toast messages */
  toastedOptions: {
    position: 'bottom-center',
    duration: 2500,
    keepOnHover: true,
    className: 'toast-message',
    iconPack: 'fontawesome',
  },
  /* Server location of the Backup & Sync cloud function */
  backupEndpoint: 'https://dashy-sync-service.as93.net',
  /* Available services for fetching favicon icon for user apps */
  faviconApiEndpoints: {
    mcapi: 'https://eu.mc-api.net/v3/server/favicon/$URL',
    clearbit: 'https://logo.clearbit.com/$URL',
    faviconkit: 'https://api.faviconkit.com/$URL/64',
    // favicongrabber: 'https://favicongrabber.com//api/grab/$URL',
    google: 'https://www.google.com/s2/favicons?sz=128&domain_url=$URL',
    allesedv: 'https://f1.allesedv.com/128/$URL',
    webmasterapi: 'https://api.webmasterapi.com/v1/favicon/yEwx0ZFs0CSPshHq/$URL',
  },
  /* The URL to CDNs used for external icons. These are only loaded when required */
  iconCdns: {
    fa: 'https://kit.fontawesome.com',
    mdi: 'https://cdn.jsdelivr.net/npm/@mdi/font@5.9.55/css/materialdesignicons.min.css',
    si: 'https://unpkg.com/simple-icons@v5/icons',
    generative: 'https://ipsicon.io',
    localPath: '/item-icons',
    faviconName: 'favicon.ico',
  },
  /* Available built-in colors for the theme builder */
  swatches: [
    ['#eb5cad', '#985ceb', '#5346f3', '#5c90eb'],
    ['#5cdfeb', '#00CCB4', '#5ceb8d', '#afeb5c'],
    ['#eff961', '#ebb75c', '#eb615c', '#eb2d6c'],
    ['#060913', '#141b33', '#1c2645', '#263256'],
    ['#2b2d42', '#1a535c', '#372424', '#312437'],
    ['#f5f5f5', '#d9d9d9', '#bfbfbf', '#9a9a9a'],
    ['#636363', '#363636', '#313941', '#0d0d0d'],
  ],
  /* Use your own self-hosted Sentry instance. Only used if error reporting is turned on */
  sentryDsn: 'https://3138ea85f15a4fa883a5b27a4dc8ee28@o937511.ingest.sentry.io/5887934',
};
