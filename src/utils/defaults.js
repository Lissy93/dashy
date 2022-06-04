module.exports = {
  /* Default pageInfo object, used if user does not specify their own */
  pageInfo: {
    title: 'Dashy',
    description: '',
    navLinks: [],
    footerText: '',
  },
  /* Default appConfig to be used, if user does not specify their own */
  appConfig: {},
  /* Default language code */
  language: 'en',
  /* The page to use as the starting homepage */
  startingView: 'default',
  /* Default icon size to be applied on initial load */
  iconSize: 'medium',
  /* Default layout to be applied on initial load */
  layout: 'auto',
  /* Default theme to be applied on initial load */
  theme: 'default',
  /* Default Font-Awesome API key, for FA icons (if used) */
  fontAwesomeKey: '0821c65656',
  /* Default API to use for fetching of user service favicon icons (if enabled) */
  faviconApi: 'allesedv',
  /* The default sort order for sections */
  sortOrder: 'default',
  /* If no 'target' specified, this is the default opening method */
  openingMethod: 'newtab',
  /* The page paths for each route within the app for the router */
  routePaths: {
    home: '/home',
    minimal: '/minimal',
    workspace: '/workspace',
    about: '/about',
    login: '/login',
    download: '/download',
    notFound: '/404',
  },
  /* Server Endpoints */
  serviceEndpoints: {
    statusPing: '/status-ping',
    statusCheck: '/status-check',
    save: '/config-manager/save',
    rebuild: '/config-manager/rebuild',
    systemInfo: '/system-info',
    corsProxy: '/cors-proxy',
  },
  /* List of built-in themes, to be displayed within the theme-switcher dropdown */
  builtInThemes: [
    'default',
    'callisto',
    'material',
    'material-dark',
    'dashy-docs',
    'colorful',
    'dracula',
    'one-dark',
    'lissy',
    'cherry-blossom',
    'nord-frost',
    'nord',
    'argon',
    'fallout',
    'whimsy',
    'oblivion',
    'adventure',
    'crayola',
    'deep-ocean',
    'minimal-dark',
    'minimal-light',
    'thebe',
    'matrix',
    'matrix-red',
    'color-block',
    'raspberry-jam',
    'bee',
    'tiger',
    'glow',
    'vaporware',
    'cyberpunk',
    'material-original',
    'material-dark-original',
    'high-contrast-dark',
    'high-contrast-light',
    'adventure-basic',
    'basic',
  ],
  /* Default color options for the theme configurator swatches */
  swatches: [
    ['#eb5cad', '#985ceb', '#5346f3', '#5c90eb'],
    ['#5cdfeb', '#00CCB4', '#5ceb8d', '#afeb5c'],
    ['#eff961', '#ebb75c', '#eb615c', '#eb2d6c'],
    ['#060913', '#141b33', '#1c2645', '#263256'],
    ['#2b2d42', '#1a535c', '#372424', '#312437'],
    ['#f5f5f5', '#d9d9d9', '#bfbfbf', '#9a9a9a'],
    ['#636363', '#363636', '#313941', '#0d0d0d'],
  ],
  /* Which CSS variables to show in the first view of theme configurator */
  mainCssVars: ['primary', 'background', 'background-darker'],
  /* Which structural components should be visible by default */
  visibleComponents: {
    splashScreen: false,
    navigation: true,
    pageTitle: true,
    searchBar: true,
    settings: true,
    footer: true,
  },
  /* A list of route names that page furniture (header, footer, etc) should be hidden on */
  hideFurnitureOn: [
    'minimal',
    'login',
    'download',
  ],
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
    CONF_WIDGETS: 'confSections',
    PAGE_INFO: 'pageInfo',
    APP_CONFIG: 'appConfig',
    BACKUP_ID: 'backupId',
    BACKUP_HASH: 'backupHash',
    HIDE_SETTINGS: 'hideSettings',
    USERNAME: 'username',
    MOST_USED: 'mostUsed',
    LAST_USED: 'lastUsed',
    KEYCLOAK_INFO: 'keycloakInfo',
  },
  /* Key names for cookie identifiers */
  cookieKeys: {
    AUTH_TOKEN: 'authenticationToken',
  },
  /* Key names for session storage identifiers */
  sessionStorageKeys: {
    SW_STATUS: 'serviceWorkerStatus',
    ERROR_LOG: 'errorLog',
  },
  /* Unique IDs of modals within the app */
  modalNames: {
    CONF_EDITOR: 'CONF_EDITOR',
    REBUILD_APP: 'REBUILD_APP',
    ABOUT_APP: 'ABOUT_APP',
    LANG_SWITCHER: 'LANG_SWITCHER',
    EDIT_ITEM: 'EDIT_ITEM',
    EDIT_SECTION: 'EDIT_SECTION',
    EDIT_PAGE_INFO: 'EDIT_PAGE_INFO',
    EDIT_APP_CONFIG: 'EDIT_APP_CONFIG',
    EDIT_MULTI_PAGES: 'EDIT_MULTI_PAGES',
    EXPORT_CONFIG_MENU: 'EXPORT_CONFIG_MENU',
    MOVE_ITEM_TO: 'MOVE_ITEM_TO',
  },
  /* Key names for the top-level objects in conf.yml */
  topLevelConfKeys: {
    PAGE_INFO: 'pageInfo',
    APP_CONFIG: 'appConfig',
    SECTIONS: 'sections',
  },
  /* Amount of time to show splash screen, when enabled, in milliseconds */
  splashScreenTime: 1000,
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
  /* Default tooltip options */
  tooltipOptions: {
    defaultTrigger: 'hover focus',
    defaultHideOnTargetClick: true,
    autoHide: true,
    defaultHtml: false,
    defaultPlacement: 'auto',
    defaultLoadingContent: 'Loading...',
    defaultDelay: { show: 380, hide: 0 },
    // delay: { show: 380, hide: 0 },
  },
  /* Server location of the Backup & Sync cloud function */
  backupEndpoint: 'https://dashy-sync-service.as93.net',
  /* Available services for fetching favicon icon for user apps */
  faviconApiEndpoints: {
    allesedv: 'https://f1.allesedv.com/128/$URL',
    clearbit: 'https://logo.clearbit.com/$URL',
    iconhorse: 'https://icon.horse/icon/$URL',
    faviconkit: 'https://api.faviconkit.com/$URL/64',
    duckduckgo: 'https://icons.duckduckgo.com/ip2/$URL.ico',
    yandex: 'https://favicon.yandex.net/favicon/$URL',
    google: 'https://www.google.com/s2/favicons?sz=128&domain_url=$URL',
    besticon: 'https://besticon-demo.herokuapp.com/icon?url=$URL&size=80..120..200',
    webmasterapi: 'https://api.webmasterapi.com/v1/favicon/yEwx0ZFs0CSPshHq/$URL',
    mcapi: 'https://eu.mc-api.net/v3/server/favicon/$URL',
  },
  /* The URL to CDNs used for external icons. These are only loaded when required */
  iconCdns: {
    fa: 'https://kit.fontawesome.com',
    mdi: 'https://cdn.jsdelivr.net/npm/@mdi/font@5.9.55/css/materialdesignicons.min.css',
    si: 'https://unpkg.com/simple-icons@v5/icons',
    generative: 'https://avatars.dicebear.com/api/identicon/{icon}.svg',
    generativeFallback: 'https://evatar.io/{icon}',
    localPath: './item-icons',
    faviconName: 'favicon.ico',
    homeLabIcons: 'https://raw.githubusercontent.com/walkxhub/dashboard-icons/master/png/{icon}.png',
    homeLabIconsFallback: 'https://raw.githubusercontent.com/NX211/homer-icons/master/png/{icon}.png',
  },
  /* API endpoints for widgets that need to fetch external data */
  widgetApiEndpoints: {
    anonAddy: 'https://app.anonaddy.com',
    astronomyPictureOfTheDay: 'https://apodapi.herokuapp.com/api',
    blacklistCheck: 'https://api.blacklistchecker.com/check',
    codeStats: 'https://codestats.net/',
    covidStats: 'https://disease.sh/v3/covid-19',
    cryptoPrices: 'https://api.coingecko.com/api/v3/coins/',
    cryptoWatchList: 'https://api.coingecko.com/api/v3/coins/markets/',
    cveVulnerabilities: 'https://www.cvedetails.com/json-feed.php',
    ethGasPrices: 'https://ethgas.watch/api/gas',
    ethGasHistory: 'https://ethgas.watch/api/gas/trend',
    exchangeRates: 'https://v6.exchangerate-api.com/v6/',
    flights: 'https://aerodatabox.p.rapidapi.com/flights/airports/icao/',
    githubTrending: 'https://gh-trending-repos.herokuapp.com/',
    healthChecks: 'https://healthchecks.io/api/v1/checks',
    holidays: 'https://kayaposoft.com/enrico/json/v2.0/?action=getHolidaysForDateRange',
    jokes: 'https://v2.jokeapi.dev/joke/',
    news: 'https://api.currentsapi.services/v1/latest-news',
    mullvad: 'https://am.i.mullvad.net/json',
    publicIp: 'https://ipapi.co/json',
    publicIp2: 'https://api.ipgeolocation.io/ipgeo',
    publicIp3: 'http://ip-api.com/json',
    readMeStats: 'https://github-readme-stats.vercel.app/api',
    rssToJson: 'https://api.rss2json.com/v1/api.json',
    sportsScores: 'https://www.thesportsdb.com/api/v1/json',
    stockPriceChart: 'https://www.alphavantage.co/query',
    tflStatus: 'https://api.tfl.gov.uk/line/mode/tube/status',
    walletBalance: 'https://api.blockcypher.com/v1',
    walletQrCode: 'https://www.bitcoinqrcodemaker.com/api',
    weather: 'https://api.openweathermap.org/data/2.5/weather',
    weatherForecast: 'https://api.openweathermap.org/data/2.5/forecast/daily',
    xkcdComic: 'https://xkcd.vercel.app/',
  },
  /* URLs for web search engines */
  searchEngineUrls: {
    // Common
    duckduckgo: 'https://duckduckgo.com/?q=',
    google: 'https://google.com/search?q=',
    whoogle: 'https://whoogle.sdf.org/search?q=',
    qwant: 'https://www.qwant.com/?q=',
    startpage: 'https://www.startpage.com/do/search?query=',
    // Niche
    'searx-bar': 'https://searx.bar/search?q=',
    'searx-info': 'https://searx.info/search?q=',
    'searx-tiekoetter': 'https://searx.tiekoetter.com/search?q=',
    'searx-bissisoft': 'https://searx.bissisoft.com/search?q=',
    ecosia: 'https://www.ecosia.org/search?q=',
    metager: 'https://metager.org/meta/meta.ger3?eingabe=',
    swisscows: 'https://swisscows.com/web?query=',
    mojeek: 'https://www.mojeek.com/search?q=',
    peekier: 'https://peekier.com/#!',
    // Specific
    wikipedia: 'https://en.wikipedia.org/w/?search=',
    stackoverflow: 'https://stackoverflow.com/search?q=',
    wolframalpha: 'https://www.wolframalpha.com/input/?i=',
    reddit: 'https://www.reddit.com/search/?q=',
    youtube: 'https://youtube.com/results?q=',
    github: 'https://github.com/search?q=',
    bbc: 'https://www.bbc.co.uk/search?q=',
  },
  defaultSearchEngine: 'duckduckgo',
  defaultSearchOpeningMethod: 'newtab',
  searchBangs: {
    '/b': 'bbc',
    '/d': 'duckduckgo',
    '/g': 'google',
    '/r': 'reddit',
    '/w': 'wikipedia',
    '/y': 'youtube',
    '/gh': 'github',
    '/so': 'stackoverflow',
    '/wa': 'wolframalpha',
  },
  /* Use your own self-hosted Sentry instance. Only used if error reporting is turned on */
  sentryDsn: 'https://3138ea85f15a4fa883a5b27a4dc8ee28@o937511.ingest.sentry.io/5887934',
  /* A JS enum for indicating the user state, when guest mode + authentication is enabled */
  userStateEnum: {
    notConfigured: 0,
    loggedIn: 1,
    guestAccess: 2,
    notLoggedIn: 3,
    keycloakEnabled: 4,
  },
  /* Progressive Web App settings, used by Vue Config */
  pwa: {
    name: 'Dashy',
    manifestPath: './manifest.json',
    themeColor: '#00af87',
    msTileColor: '#0b1021',
    mode: 'production',
    iconPaths: {
      manifestCrossorigin: 'use-credentials',
      favicon64: './web-icons/favicon-64x64.png',
      favicon32: './web-icons/favicon-32x32.png',
      maskIcon: './web-icons/dashy-logo.png',
      msTileImage: './web-icons/dashy-logo.png',
    },
  },
};
