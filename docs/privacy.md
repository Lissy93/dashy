# Privacy & Security

Dashy was built with privacy in mind.
Self-hosting your own apps and services is a great way to protect yourself from the mass data collection employed by big tech companies, and Dashy was designed to make self-hosting easier, by keeping your local services organized and accessible from a single place. The [management docs](https://github.com/Lissy93/dashy/blob/master/docs/management.md) contains a though guide on the steps you can take to secure your homelab.

Dashy operates on the premise, that no external data requests should ever be made, unless explicitly enabled by the user. In the interest of transparency, the code is 100% open source and clearly documented throughout.

| 🔐 For privacy and security tips, check out another project of mine: **[Personal Security Checklist](https://github.com/Lissy93/personal-security-checklist)** |
|-|

### Contents

- [External Requests](#external-requests)
  - [Icons](#icons)
  - [Themes](#themes)
  - [Widgets](#widgets)
  - [Features](#features)
    - [Status Checking](#status-checking)
    - [Update Checks](#update-checks)
    - [Cloud Backup](#cloud-backup)
    - [Web Search](#web-search)
    - [Error Reporting](#anonymous-error-reporting)
- [Browser Storage](#browser-storage)
- [App Dependencies](#dependencies)
- [Security Features](#security-features)
- [Securing your Environment](#securing-your-environment)
- [Reporting a Security Issue](#reporting-a-security-issue)

---

## External Requests
By default, Dashy will not make any external requests, unless you configure it to. Some features (which are off by default) do require internat access, and this section outlines those features, the services used, and links to their privacy policies.

The following section outlines all network requests that are made when certain features are enabled.

### Icons

#### Font Awesome
If either any of your sections, items or themes are using icons from font-awesome, then it will be automatically enabled. But you can also manually enable or disable it by setting `appConfig.enableFontAwesome` to `true` / `false`. Requests are made directly to Font-Awesome CDN, for more info, see the [Font Awesome Privacy Policy](https://fontawesome.com/privacy).

#### Material Design Icons
If either any of your sections, items or themes are mdi icons, then it will be automatically enabled. But you can also manually enable or disable it by setting `appConfig.enableMaterialDesignIcons` to `true` / `false`. Requests are made directly to Material-Design-Icons CDN, for more info, see the [Material Design Icons Website](https://materialdesignicons.com/).


#### Favicon Fetching
If an item's icon is set to `favicon`, then it will be auto-fetched from the corresponding URL. Since not all websites have their icon located at `/favicon.ico`, and if they do, it's often very low resolution (like `16 x 16 px`). Therefore, the default behavior is for Dashy to check if the URL is public, and if so will use an API to fetch the favicon. For self-hosted services, the favion will be fetched from the default path, and no external requests will be made.

The default favicon API is [allesedv.com](https://favicon.allesedv.com/), but this can be changed by setting `appConfig.faviconApi` to an alternate source (`iconhorse`, `clearbit`, `faviconkit`, `besticon`, `duckduckgo`, `google` and `allesedv` are supported). If you do not want to use any API, then you can set this property to `local`, and the favicon will be fetched from the default path. For hosted services, this will still incur an external request.

#### Generative Icons
If an item has the icon set to `generative`, then an external request it made to [Dice Bear](https://dicebear.com/) to fetch the uniquely generated icon. The URL of a given service is used as the key for generating the icon, but it is first hashed and encoded for basic privacy. For more info, please reference the [Dicebear Privacy Policy](https://avatars.dicebear.com/legal/privacy-policy)

As a fallback, if Dicebear fails, then [Evatar](https://evatar.io/) is used.

#### Other Icons
Section icons, item icons and app icons are able to accept a URL to a raw image, if the image is hosted online then an external request will be made. To avoid the need to make external requests for icon assets, you can either use a self-hosted CDN, or store your images within `./public/item-icons` (which can be mounted as a volume if you're using Docker).

#### Web Assets
By default, all assets required by Dashy come bundled within the source, and so no external requests are made. If you add an additional font, which is imported from a CDN, then that will incur an external request. The same applies for other web assets, like external images, scripts or styles.

---

### Features

#### Status Checking
The status checking feature allows you to ping your apps/ services to check if they are currently operational.

Dashy will ping your services directly, and does not rely on any third party. If you are checking the uptime status of a public/ hosted application, then please refer to that services privacy policy. For all self-hosted services, requests happen locally within your network, and are not external.

#### Update Checks
When the application loads, it checks for updates. The results of which are displayed in the config menu of the UI. This was implemented because using a very outdated version of Dashy may have unfixed issues. Your version is fetched from the source (local request), but the latest version is fetched from GitHub, which is an external request. This can be disabled by setting `appConfig.disableUpdateChecks: true`

#### Cloud Backup
Dashy has an optional End-to-End encrypted [cloud backup feature](https://github.com/Lissy93/dashy/blob/master/docs/backup-restore.md). No data is ever transimtted unless you actively enable this feature through the UI.

All data is encrypted before being sent to the backend. This is done in [`CloudBackup.js`](https://github.com/Lissy93/dashy/blob/master/src/utils/CloudBackup.js), using [crypto.js](https://github.com/brix/crypto-js)'s AES method, using the users chosen password as the key. The data is then sent to a [Cloudflare worker](https://developers.cloudflare.com/workers/learning/how-workers-works) (a platform for running serverless functions), and stored in a [KV](https://developers.cloudflare.com/workers/learning/how-kv-works) data store.

Your selected password never leaves your device, and is hashed before being compared. It is only possible to restore a configuration if you have both the backup ID and decryption password. Because the data is encrypted on the client-side (before being sent to the cloud), it is not possible for a man-in-the-middle, government entity, website owner, or even Cloudflare to be able read any of your data.

#### Web Search
Dashy has a primitive [web search feature](https://github.com/Lissy93/dashy/blob/master/docs/searching.md#web-search). No external requests are made, instead you are redirected to your chosen search engine (defaults to DuckDuckGo), using your chosen opening method.

This feature can be disabled under appConfig, with `webSearch: { disableWebSearch: true }`

#### Anonymous Error Reporting
Error reporting is disabled by default, and no data will ever be sent without your explicit consent. In fact, the error tracking code isn't even imported unless you have actively enabled it. [Sentry](https://github.com/getsentry/sentry) is used for this, it's an open source error tracking and performance monitoring tool, used to identify any issues which occur in the production app (if you enable it). 

The crash report includes the file or line of code that triggered the error, and a 2-layer deep stack trace. Reoccurring errors will also include the following user information: OS type (Mac, Windows, Linux, Android or iOS) and browser type (Firefox, Chrome, IE, Safari). Data scrubbing is enabled. IP address will not be stored. If any potentially identifiable data ever finds its way into a crash report, it will be automatically and permanently erased. All statistics collected are anonomized and stored securely, and ae automatically deleted after 14 days. For more about privacy and security, see the [Sentry Docs](https://sentry.io/security/).

Enabling anonymous error reporting helps me to discover bugs I was unaware of, and then fix them, in order to make Dashy more reliable long term. Error reporting is activated by setting `appConfig.enableErrorReporting: true`.

If you need to monitor bugs yourself, then you can [self-host your own Sentry Server](https://develop.sentry.dev/self-hosted/), and use it by setting `appConfig.sentryDsn` to your Sentry instances [Data Source Name](https://docs.sentry.io/product/sentry-basics/dsn-explainer/), then just enable error reporting in Dashy.

---

### Themes
Certain themes may use external assets (such as fonts or images). Currently, this only applies the Adventure theme.

---

### Widgets

Dashy supports [Widgets](/docs/widgets.md) for displaying dynamic content. Below is a list of all widgets that make external data requests, along with the endpoint they call and a link to the Privacy Policy of that service.

- **[Weather](/docs/widgets.md#weather)** and **[Weather Forecast](/docs/widgets.md#weather-forecast)**: `https://api.openweathermap.org`
    - [OWM Privacy Policy](https://openweather.co.uk/privacy-policy)
- **[RSS Feed](/docs/widgets.md#rss-feed)**: `https://api.rss2json.com/v1/api.json`
    - [Rss2Json Privacy Policy](https://rss2json.com/privacy-policy)
- **[IP Address](/docs/widgets.md#public-ip)**: `https://ipapi.co/json` or `http://ip-api.com/json`
    - [IPGeoLocation Privacy Policy](https://ipgeolocation.io/privacy.html)
    - [IP-API Privacy Policy](https://ip-api.com/docs/legal)
- **[IP Blacklist](/docs/widgets.md#ip-blacklist)**: `https://api.blacklistchecker.com`
    - [Blacklist Checker Privacy Policy](https://blacklistchecker.com/privacy)
- **[Crypto Watch List](/docs/widgets.md#crypto-watch-list)** and **[Token Price History](/docs/widgets.md#crypto-token-price-history)**: `https://api.coingecko.com`
    - [CoinGecko Privacy Policy](https://www.coingecko.com/en/privacy)
- **[Wallet Balance](/docs/widgets.md#wallet-balance)**: `https://api.blockcypher.com/`
    - [BlockCypher Privacy Policy](https://www.blockcypher.com/privacy.html)
- **[Code::Stats](/docs/widgets.md#code-stats)**: `https://codestats.net`
    - [Code::Stats Privacy Policy](https://codestats.net/tos#privacy)
- **[AnonAddy](/docs/widgets.md#anonaddy)**: `https://app.anonaddy.com`
    - [AnonAddy Privacy Policy](https://anonaddy.com/privacy/)
- **[Vulnerability Feed](/docs/widgets.md#vulnerability-feed)**: `https://www.cvedetails.com`
    - [CVE Details Privacy Policy](https://www.cvedetails.com/privacy.php)
- **[Exchange Rate](/docs/widgets.md#exchange-rates)**: `https://v6.exchangerate-api.com`
    - [ExchangeRateAPI Privacy Policy](https://www.exchangerate-api.com/terms)
- **[Public Holidays](/docs/widgets.md#public-holidays)**: `https://kayaposoft.com`
    - [jurajmajer/enrico](https://github.com/jurajmajer/enrico)
- **[Covid-19 Status](/docs/widgets.md#covid-19-status)**: `https://codestats.net`
    - [disease-sh/api](https://github.com/disease-sh/api)
- **[Sports Scores](/docs/widgets.md#sports-scores)**: `https://thesportsdb.com`
    - No Policy Availible
- **[News Headlines](/docs/widgets.md#news-headlines)**: `https://api.currentsapi.services`
    - [CurrentsAPI Privacy Policy](https://currentsapi.services/privacy)
- **[Mullvad Status](/docs/widgets.md#mullvad-status)**: `https://am.i.mullvad.net`
    - [Mullvad Privacy Policy](https://mullvad.net/en/help/privacy-policy/)
- **[TFL Status](/docs/widgets.md#tfl-status)**: `https://api.tfl.gov.uk`
    - [TFL Privacy Policy](https://tfl.gov.uk/corporate/privacy-and-cookies/)
- **[Stock Price History](/docs/widgets.md#stock-price-history)**: `https://alphavantage.co`
    - [AlphaVantage Privacy Policy](https://www.alphavantage.co/privacy/)
- **[ETH Gas Prices](/docs/widgets.md#eth-gas-prices)**: `https://ethgas.watch`
    - [wslyvh/ethgaswatch](https://github.com/wslyvh/ethgaswatch)
- **[Joke](/docs/widgets.md#joke)**: `https://v2.jokeapi.dev`
    - [SV443's Privacy Policy](https://sv443.net/privacypolicy/en)
- **[Flight Data](/docs/widgets.md#flight-data)**: `https://aerodatabox.p.rapidapi.com`
    - [AeroDataBox Privacy Policy](https://www.aerodatabox.com/#h.p_CXtIYZWF_WQd)
- **[Astronomy Picture of the Day](/docs/widgets.md#astronomy-picture-of-the-day)**: `https://apodapi.herokuapp.com`
    - [NASA's Privacy Policy](https://www.nasa.gov/about/highlights/HP_Privacy.html)
- **[GitHub Trending](/docs/widgets.md#github-trending)** and **[GitHub Profile Stats](/docs/widgets.md#github-profile-stats)**: `https://api.github.com`
    - [GitHub's Privacy Policy](https://docs.github.com/en/github/site-policy/github-privacy-statement)
- **[Cron Monitoring (Health Checks)](/docs/widgets.md#cron-monitoring-health-checks)**: `https://healthchecks.io`
    - [Health-Checks Privacy Policy](https://healthchecks.io/privacy/)

---

## Browser Storage
In order for user preferences to be persisted between sessions, certain data needs to be stored in the browsers local storage. No personal info is kept here, none of this data can be accessed by other domains, and no data is ever sent to any server without your prior consent.

You can view and delete stored data by opening up the dev tools: <kbd>F12</kbd> --> `Application` --> `Storage`.

The following section outlines all data that is stored in the browsers, as cookies, session storage or local storage.

#### Cookies
> [Cookies](https://en.wikipedia.org/wiki/HTTP_cookie) will expire after their pre-defined lifetime

- `AUTH_TOKEN` - A unique token, generated from a hash of users credentials, to verify they are authenticated. Only used when auth is enabled 

#### Session Storage
> [Session storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage) is deleted when the current session ends (tab / window is closed)

- `SW_STATUS` - The current status of any service workers
- `ERROR_LOG` - List of recent errors

#### Local Storage
> [Local storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) is persisted between sessions, and only deleted when manually removed

- `LANGUAGE` - The locale to show app text in
- `HIDE_WELCOME_BANNER` - Set to true once user dismissed welcome message, so that it's not shown again
- `LAYOUT_ORIENTATION` - Preferred section layout, either horizontal, vertical or auto
- `COLLAPSE_STATE` - Remembers which sections are collapsed
- `ICON_SIZE` - Size of items, either small, medium or large
- `THEME` - Users applied theme
- `CUSTOM_COLORS` - Any color modifications made to a given theme
- `BACKUP_ID` - If a backup has been made, the ID is stored here
- `BACKUP_HASH` - A unique hash of the previous backups meta data
- `HIDE_SETTINGS` - Lets user hide or show the settings menu
- `USERNAME` - If user logged in, store username. Only used to show welcome message, not used for auth
- `CONF_SECTIONS` - Array of sections, only used when user applies changes locally
- `PAGE_INFO` - Config page info, only used when user applies changes locally
- `APP_CONFIG` - App config, only used when user applies changes locally
- `MOST_USED` - If smart sort is used to order items by most used, store open count
- `LAST_USED` - If smart sort is used to order items by last used, store timestamps

#### Deleting Stored Data
You can manually view and delete session storage, local storage and cookies at anytime. Fist [open](/docs/troubleshooting.md#how-to-open-browser-console) your browsers developer tools (usually <kbd>F12</kbd>), then under the Application tab select the storage category. Here you will see a list of stored data, and you can select any item and delete it.

---

## Dependencies
As with most web projects, Dashy relies on several [dependencies](https://github.com/Lissy93/dashy/blob/master/docs/credits.md#dependencies-). For links to each, and a breakdown of their licenses, please see [Legal](https://github.com/Lissy93/dashy/blob/master/.github/LEGAL.md).

Dependencies can introduce security vulnerabilities, but since all these packages are open source any issues are usually very quickly spotted. Dashy is using Snyk for dependency security monitoring, and you can see [the latest report here](https://snyk.io/test/github/lissy93/dashy). If any issue is detected by Snyk, a note about it will appear at the top of the Reamde, and will usually be fixed within 48 hours.

Note that packages listed under `devDependencies` section are only used for building the project, and are not included in the production environment.

---

## Securing your Environment
Running your self-hosted applications in individual, containerized environments (such as containers or VMs) helps keep them isolated, and prevent an exploit in one service effecting another.

If you're running Dashy in a container, see [Management Docs --> Container Security](https://github.com/Lissy93/dashy/blob/master/docs/management.md#container-security) for step-by-step security guide.

There is very little complexity involved with Dashy, and therefore the attack surface is reasonably small, but it is still important to follow best practices and employ monitoring for all your self-hosted apps. A couple of things that you should look at include:
- Use SSL for securing traffic in transit
- Configure [authentication](/docs/authentication.md#alternative-authentication-methods) to prevent unauthorized access
- Keep your system, software and Dashy up-to-date
- Ensure your server is appropriately secured
- Manage users and SSH correctly
- Enable and configure firewall rules
- Implement security, malware and traffic scanning
- Setup malicious traffic detection
- Understand the [Docker attack fronts](https://docs.docker.com/engine/security/), and follow [Docker Security Best Practices](https://snyk.io/blog/10-docker-image-security-best-practices/)

This is covered in more detail in [App Management](/docs/management.md).

---

## Security Features

#### Subresource Integrity
[Subresource Integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity) or SRI is a security feature that enables browsers to verify that resources they fetch are delivered without unexpected manipulation. It works by allowing you to provide a cryptographic hash that a fetched resource must match. This prevents the app from loading any resources that have been manipulated, by verifying the files hashes. It safeguards against the risk of an attacker injecting arbitrary malicious content into any files served up via a CDN. 

Dashy supports SRI, and it is recommended to enable this if you are hosting your dashboard via a public CDN. To enable SRI, set the `INTEGRITY` environmental variable to `true`.

#### SSL
Native SSL support is enabled, for setup instructions, see the [Management Docs](/docs/management.md#ssl-certificates)

#### Authentication
Dashy supports both basic auth, as well as server-based SSO using Keycloak. Full details of which, along with alternate authentication methods can be found in the [Authentication Docs](/docs/authentication.md). If your dashboard is exposed to the internet and/ or contains any sensitive info it is strongly recommended to configure access control with Keycloak or another server-side method.

---

## Disabling Features
You may wish to disable features that you don't want to use, if they involve storing data in the browser or making network requests.
- To disable smart-sort (uses local storage), set `appConfig.disableSmartSort: true`
- To disable update checks (makes external request to GH), set `appConfig.disableUpdateChecks: true`
- To disable web search (redirect to external / internal content), set `appConfig.disableWebSearch: true`
- To keep status checks disabled (external/ internal requests), set `appConfig.statusCheck: false`
- To keep font-awesome icons disabled (external requests), set `appConfig.enableFontAwesome: false`
- To keep error reporting disabled (external requests and data collection), set `appConfig.enableErrorReporting: false`
- To keep the service worker disabled (stores cache of app in browser data), set `appConfig.enableServiceWorker: false`

---

## Reporting a Security Issue
If you think you've found a critical issue with Dashy, please send an email to `security@mail.alicia.omg.lol`. You can encrypt it, using [`0688 F8D3 4587 D954 E9E5 1FB8 FEDB 68F5 5C02 83A7`](https://keybase.io/aliciasykes/pgp_keys.asc?fingerprint=0688f8d34587d954e9e51fb8fedb68f55c0283a7). You should receive a response within 48 hours. For more information, see [SECURITY.md](https://github.com/Lissy93/dashy/blob/master/.github/SECURITY.md).

All non-critical issues can be raised as a ticket.

Please include the following information:
- Type of issue (e.g. buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit the issue
