# Widgets

Dashy has support for displaying dynamic content in the form of widgets. There are several built-in widgets available out-of-the-box as well as support for custom widgets to display stats from almost any service with an API.

> ℹ️ **Note**: Widgets are still in the Alpha-phase of development.
> If you find a bug, please raise it.<br>
> Adding / editing widgets through the UI isn't yet supported, you will need to do this in the YAML config file.

##### Contents
- **[General Widgets](#general-widgets)**
  - [Clock](#clock)
  - [Weather](#weather)
  - [Weather Forecast](#weather-forecast)
  - [RSS Feed](#rss-feed)
  - [Image](#image)
  - [Public IP Address](#public-ip)
  - [IP Blacklist Checker](#ip-blacklist)
  - [Crypto Watch List](#crypto-watch-list)
  - [Crypto Price History](#crypto-token-price-history)
  - [Crypto Wallet Balance](#wallet-balance)
  - [Code Stats](#code-stats)
  - [Mullvad Status](#mullvad-status)
  - [Email Aliases (AnonAddy)](#anonaddy)
  - [Vulnerability Feed](#vulnerability-feed)
  - [Exchange Rates](#exchange-rates)
  - [Public Holidays](#public-holidays)
  - [Covid-19 Status](#covid-19-status)
  - [Sports Scores](#sports-scores)
  - [News Headlines](#news-headlines)
  - [TFL Status](#tfl-status)
  - [Stock Price History](#stock-price-history)
  - [ETH Gas Prices](#eth-gas-prices)
  - [Joke of the Day](#joke)
  - [XKCD Comics](#xkcd-comics)
  - [Flight Data](#flight-data)
  - [NASA APOD](#astronomy-picture-of-the-day)
  - [GitHub Trending](#github-trending)
  - [GitHub Profile Stats](#github-profile-stats)
- **[Self-Hosted Services Widgets](#self-hosted-services-widgets)**
  - [System Info](#system-info)
  - [Cron Monitoring](#cron-monitoring-health-checks)
  - [CPU History](#cpu-history-netdata)
  - [Memory History](#memory-history-netdata)
  - [System Load History](#load-history-netdata)
  - [Pi Hole Stats](#pi-hole-stats)
  - [Pi Hole Queries](#pi-hole-queries)
  - [Recent Traffic](#recent-traffic)
  - [Stat Ping Statuses](#stat-ping-statuses)
  - [Synology Download Station](#synology-download-station)
- **[System Resource Monitoring](#system-resource-monitoring)**
  - [CPU Usage Current](#current-cpu-usage)
  - [CPU Usage Per Core](#cpu-usage-per-core)
  - [CPU Usage History](#cpu-usage-history)
  - [Memory Usage Current](#current-memory-usage)
  - [Memory Usage History](#memory-usage-history)
  - [Disk Space](#disk-space)
  - [Disk IO](#disk-io)
  - [System Load](#system-load)
  - [System Load History](#system-load-history)
  - [Network Interfaces](#network-interfaces)
  - [Network Traffic](#network-traffic)
  - [Resource Usage Alerts](#resource-usage-alerts)
  - [Public & Private IP](#ip-address)
  - [CPU Temperature](#cpu-temp)
- **[Dynamic Widgets](#dynamic-widgets)**
  - [Iframe Widget](#iframe-widget)
  - [HTML Embed Widget](#html-embedded-widget)
  - [API Response](#api-response)
  - [Prometheus Data](#prometheus-data)
  - [Data Feed](#data-feed)
- **[Usage & Customizations](#usage--customizations)**
  - [Widget Usage Guide](#widget-usage-guide)
  - [Continuous Updates](#continuous-updates)
  - [Proxying Requests](#proxying-requests)
  - [Setting Timeout](#setting-timeout)
  - [Custom CSS Styling](#widget-styling)
  - [Customizing Charts](#customizing-charts)
  - [Language Translations](#language-translations)
  - [Widget UI Options](#widget-ui-options)
  - [Building a Widget](#build-your-own-widget)
  - [Requesting a Widget](#requesting-a-widget)
  - [Troubleshooting](#troubleshooting-widget-errors)

## General Widgets

### Clock

A simple, live-updating time and date widget with time-zone support. All fields are optional.

<p align="center"><img width="400" src="https://i.ibb.co/vjb4RTv/clock.png" /></p>

##### Options

**Field** | **Type** | **Required** | **Description**
--- | --- | --- | ---
**`timeZone`** | `string` |  _Optional_ | The time zone to display date and time in.<br> Specified as Region/City, for example: `Australia/Melbourne`. See the [Time Zone DB](https://timezonedb.com/time-zones) for a full list of supported TZs. Defaults to the browser / device's local time
**`format`** | `string` | _Optional_ | A country code for displaying the date and time in local format.<br>Specified as `[ISO-3166]-[ISO-639]`, for example: `en-AU`. See [here](https://www.fincher.org/Utilities/CountryLanguageList.shtml) for a full list of locales. Defaults to the browser / device's region
**`customCityName`** | `string` |  _Optional_ | By default the city from the time-zone is shown, but setting this value will override that text
**`hideDate`** | `boolean` |  _Optional_ | If set to `true`, the date and city will not be shown. Defaults to `false`
**`hideSeconds`** | `boolean` |  _Optional_ | If set to `true`, seconds will not be shown. Defaults to `false`

##### Example

```yaml
- type: clock
  options:
    timeZone: Europe/London
    format: en-GB
    hideDate: false
```

##### Info
_No external data requests_

---

### Weather

A simple, live-updating local weather component, showing temperature, conditions and more info.

<p align="center"><img width="400" src="https://i.ibb.co/r6MCfsL/weather.png" /></p>

##### Options

**Field** | **Type** | **Required** | **Description**
--- | --- | --- | ---
**`apiKey`** | `string` |  Required | Your OpenWeatherMap API key. You can get one for free at [openweathermap.org](https://openweathermap.org/)
**`city`** | `string` | Required | A city name to use for fetching weather. This can also be a state code or country code, following the ISO-3166 format
**`units`** | `string` |  _Optional_ | The units to use for displaying data, can be either `metric` or `imperial`. Defaults to `metric`
**`hideDetails`** | `boolean` |  _Optional_ | If set to `true`, the additional details (wind, humidity, pressure, etc) will not be shown. Defaults to `false`

##### Example

```yaml
- type: weather
  options:
    apiKey: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    city: London
    units: metric
    hideDetails: false
```

##### Info
- **CORS**: 🟢 Enabled
- **Auth**: 🔴 Required
- **Price**: 🟠 Free plan
- **Privacy**: _See [OWM Privacy Policy](https://openweather.co.uk/privacy-policy)_

---

### Weather Forecast

Displays the weather (temperature and conditions) for the next few days for a given location. Note that this requires either the free [OpenWeatherMap Student Plan](https://home.openweathermap.org/students), or the Premium Plan. 

<p align="center"><img width="400" src="https://i.ibb.co/vshwgZB/weather-forecast.png" /></p>

##### Options

**Field** | **Type** | **Required** | **Description**
--- | --- | --- | ---
**`apiKey`** | `string` |  Required | Your OpenWeatherMap API key. You can get one at [openweathermap.org](https://openweathermap.org/) or for free via the [OWM Student Plan](https://home.openweathermap.org/students)
**`city`** | `string` | Required | A city name to use for fetching weather. This can also be a state code or country code, following the ISO-3166 format
**`numDays`** | `number` |  _Optional_ | The number of days to display of forecast info to display. Defaults to `4`, max `16` days
**`units`** | `string` |  _Optional_ | The units to use for displaying data, can be either `metric` or `imperial`. Defaults to `metric`
**`hideDetails`** | `boolean` |  _Optional_ | If set to `true`, the additional details (wind, humidity, pressure, etc) will not be shown. Defaults to `false`

##### Example

```yaml
- type: weather-forecast
  options:
    city: California
    numDays: 6
    apiKey: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    units: imperial
```

##### Info
- **CORS**: 🟢 Enabled
- **Auth**: 🔴 Required
- **Price**: 🔴 Premium (free for personal use only)
- **Privacy**: _See [OWM Privacy Policy](https://openweather.co.uk/privacy-policy)_

---

### RSS Feed

Display news and updates from any RSS-enabled service.

<p align="center"><img width="600" src="https://i.ibb.co/N9mvLh4/rss-feed.png" /></p>

##### Options

**Field** | **Type** | **Required** | **Description**
--- | --- | --- | ---
**`rssUrl`** | `string` |  Required | The URL location of your RSS feed
**`apiKey`** | `string` |  _Optional_ | An API key for [rss2json](https://rss2json.com/). It's free, and will allow you to make 10,000 requests per day, you can sign up [here](https://rss2json.com/sign-up)
**`limit`** | `number` |  _Optional_ | The number of posts to return. If you haven't specified an API key, this will be limited to 10
**`orderBy`** | `string` |  _Optional_ | How results should be sorted. Can be either `pubDate`, `author` or `title`. Defaults to `pubDate`
**`orderDirection`** | `string` |  _Optional_ | Order direction of feed items to return. Can be either `asc` or `desc`. Defaults to `desc`

##### Example

```yaml
- type: rss-feed
  options:
    rssUrl: https://www.schneier.com/blog/atom.xml
    apiKey: xxxx
```

##### Info
- **CORS**: 🟢 Enabled
- **Auth**: 🟠 Optional
- **Price**: 🟠 Free Plan (up to 10,000 requests / day)
- **Privacy**: _See [Rss2Json Privacy Policy](https://rss2json.com/privacy-policy)_

---

### Image

Displays an image.

This may be useful if you have a service (such as Grafana - [see example](https://mattionline.de/grafana-api-export-graph-as-png/)), which periodically exports charts or other data as an image.

You can also store images within Dashy's public directory (using a Docker volume), and reference them directly. E.g. `-v ./path/to/my-homelab-logo.png:/app/public/logo.png`, then in the widget `imagePath: /logo.png`.

Similarly, any web service that serves up widgets as image can be used. E.g. you could show current star chart for a GitHub repo, with: `imagePath: https://starchart.cc/Lissy93/dashy.svg`.

If you'd like to embed a live screenshot, of all or just part of a website, then this can be done using [API Flash](https://apiflash.com/).

Or what about showing a photo of the day? Try `https://source.unsplash.com/random/400x300` or `https://picsum.photos/400/300`

<p align="center"><img width="300" src="https://i.ibb.co/P48Y443/image-widget.png" /></p>

##### Options

**Field** | **Type** | **Required** | **Description**
--- | --- | --- | ---
**`imagePath`** | `string` |  Required | The path (local or remote) of the image to display

##### Example 

```yaml
- type: image
  options:
    imagePath: https://i.ibb.co/yhbt6CY/dashy.png
```

##### Info
Unless image fetched from remote source, no external data request is made.

---

### Public IP

Often find yourself searching "What's my IP", just so you can check your VPN is still connected? This widget displays your public IP address, along with ISP name and approx location. Data can be fetched from either [IpApi.co](https://ipapi.co/), [IP-API.com](https://ip-api.com/) or [IpGeolocation.io](https://ipgeolocation.io/).

<p align="center"><img width="400" src="https://i.ibb.co/vc3c8zN/public-ip.png" /></p>

##### Options
_All fields are optional_

**Field** | **Type** | **Required** | **Description**
--- | --- | --- | ---
**`provider`** | `string` |  _Optional_ | The name of the service to fetch IP address from. Can be either `ipapi.co`, `ip-api` or `ipgeolocation`. Defaults to `ipapi.co`. Note, `ip-api` doesn't work on HTTPS, and if you set to `ipgeolocation` then you must also provide an API key
**`apiKey`** | `string` |  _Optional_ | Only required if provider is set to `ipgeolocation`. You can get a free API key [here](https://ipgeolocation.io/signup.html)

##### Example 

```yaml
- type: public-ip
```

Or

```yaml
- type: public-ip
  options:
    provider: ipgeolocation
    apiKey: xxxxxxxxxxxxxxx
```

##### Info
- **CORS**: 🟢 Enabled
- **Auth**: 🟠 Optional
- **Price**: 🟢 Free
- **Host**: Managed Instance Only
- **Privacy**: _See [IPGeoLocation Privacy Policy](https://ipgeolocation.io/privacy.html) or [IP-API Privacy Policy](https://ip-api.com/docs/legal)_

---

### IP Blacklist

Notice certain web pages aren't loading? This widget quickly shows which blacklists your IP address (or host, or email) appears on, using data from [blacklistchecker.com](https://blacklistchecker.com/).

<p align="center"><img width="600" src="https://i.ibb.co/hX0fp5Z/ip-blacklist.png" /></p>

##### Options

**Field** | **Type** | **Required** | **Description**
--- | --- | --- | ---
**`ipAddress`** | `string` |  _Optional_ | The IP to check. This can also be a domain/ host name or even an email address. If left blank, Dashy will use your current public IP address.
**`apiKey`** | `string` |  Required | You can get your free API key from [blacklistchecker.com](https://blacklistchecker.com/keys)

##### Example 

```yaml
- type: blacklist-check
  options:
    apiKey: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    ipAddress: 1.1.1.1
```

##### Info
- **CORS**: 🟢 Enabled
- **Auth**: 🔴 Required
- **Price**: 🟠 Free Plan
- **Host**: Managed Instance Only
- **Privacy**: _See [BlacklistChecker Privacy Policy](https://blacklistchecker.com/privacy)_

---

### Crypto Watch List

Keep track of price changes of your favorite crypto assets. Data is fetched from [CoinGecko](https://www.coingecko.com/). All fields are optional.

<p align="center"><img width="400" src="https://i.ibb.co/WtS6jQ8/crypto-prices.png" /></p>

##### Options

**Field** | **Type** | **Required** | **Description**
--- | --- | --- | ---
**`assets`** | `string` |  _Optional_ | An array of cryptocurrencies, coins and tokens. See [list of supported assets](https://api.coingecko.com/api/v3/asset_platforms). If none are specified, then the top coins by `sortBy` (defaults to market cap) will be returned
**`currency`** | `string` | _Optional_ | The fiat currency to display price in, expressed as an ISO-4217 alpha code (see [list of currencies](https://www.iban.com/currency-codes)). Defaults to `USD`
**`sortBy`** | `string` |  _Optional_ | The method of sorting results. Can be `marketCap`, `volume` or `alphabetical`. Defaults to `marketCap`.
**`limit`** | `number` |  _Optional_ | Number of results to return, useful when no assets are specified. Defaults to either `all` or `100`

##### Example

```yaml
- type: crypto-watch-list
  options:
    limit: 10
```

Or

```yaml
  - type: crypto-watch-list
    options:
      currency: GBP
      sortBy: marketCap
      assets:
      - bitcoin
      - ethereum
      - monero
      - cosmos
      - polkadot
      - dogecoin
```

##### Info
- **CORS**: 🟢 Enabled
- **Auth**: 🟢 Not Required
- **Price**: 🟢 Free
- **Privacy**: _See [CoinGecko Privacy Policy](https://www.coingecko.com/en/privacy)_

---

### Crypto Token Price History

Shows recent price history for a given crypto asset, using price data fetched from [CoinGecko](https://www.coingecko.com/)

<p align="center"><img width="400" src="https://i.ibb.co/jr38m6S/crypto-price-history.png" /></p>

##### Options

**Field** | **Type** | **Required** | **Description**
--- | --- | --- | ---
**`asset`** | `string` |  Required | Name of a crypto asset, coin or token to fetch price data for, see [list of supported assets](https://api.coingecko.com/api/v3/asset_platforms)
**`currency`** | `string` | _Optional_ | The fiat currency to display results in, expressed as an ISO-4217 alpha code (see [list of currencies](https://www.iban.com/currency-codes)). Defaults to `USD`
**`numDays`** | `number` |  _Optional_ | The number of days of price history to render. Defaults to `7`, min: `1`, max: `30` days
**`chartColor`** | `string` | _Optional_ | Color of the chart value. Defaults to `--widget-text-color` which inherits dashboard primary color
**`chartHeight`** | `number` | _Optional_ | The height of rendered chart in px. Defaults to `300`

##### Example

```yaml
- type: crypto-price-chart
  options:
    asset: bitcoin
    currency: GBP
    numDays: 7
```

##### Info
- **CORS**: 🟢 Enabled
- **Auth**: 🟢 Not Required
- **Price**: 🟢 Free
- **Privacy**: _See [CoinGecko Privacy Policy](https://www.coingecko.com/en/privacy)_

---

### Wallet Balance

Keep track of your crypto balances and see recent transactions. Data is fetched from [BlockCypher](https://www.blockcypher.com/dev/)

<p align="center"><img width="600" src="https://i.ibb.co/27HG4nj/wallet-balances.png" /></p>

##### Options

**Field** | **Type** | **Required** | **Description**
--- | --- | --- | ---
**`coin`** | `string` |  Required | Symbol of coin or asset, e.g. `btc`, `eth` or `doge`
**`address`** | `string` | Required | Address to monitor. This is your wallet's **public** / receiving address
**`network`** | `string` |  _Optional_ | To use a different network, other than mainnet. Defaults to `main`
**`limit`** | `number` | _Optional_ | Limit the number of transactions to display. Defaults to `10`, set to large number to show all

##### Example

```yaml
- type: wallet-balance
  options:
    coin: btc
    address: 3853bSxupMjvxEYfwGDGAaLZhTKxB2vEVC	
```

##### Info
- **CORS**: 🟢 Enabled
- **Auth**: 🟢 Not Required
- **Price**: 🟢 Free
- **Privacy**: _See [BlockCypher Privacy Policy](https://www.blockcypher.com/privacy.html)_

---

### Code Stats

Display your coding summary. [Code::Stats](https://codestats.net/) is a free and open source app that aggregates statistics about your programming activity. Dashy supports both the public instance, as well as self-hosted versions.

<p align="center"><img width="400" src="https://i.ibb.co/dc0DTBW/code-stats.png" /></p>

##### Options

**Field** | **Type** | **Required** | **Description**
--- | --- | --- | ---
**`username`** | `string` |  Required | Your CodeStats username
**`hostname`** | `string` |  _Optional_ | If your self-hosting CodeStats, then supply the host name. By default it will use the public hosted instance
**`monthsToShow`** | `number` |  _Optional_ | Specify the number of months to render in the historical data chart. Defaults to `6`
**`hideMeta`** | `boolean` |  _Optional_ | Optionally hide the meta section (username, level, all-time and recent XP)
**`hideHistory`** | `boolean` |  _Optional_ | Optionally hide the historical calendar heat map
**`hideLanguages`** | `boolean` |  _Optional_ | Optionally hide the programming languages pie chart
**`hideMachines`** | `boolean` |  _Optional_ | Optionally hide the machines percentage chart

##### Example

```yaml
- type: code-stats
  options:
    username: alicia
```

##### Info
- **CORS**: 🟢 Enabled
- **Auth**: 🟢 Not Required
- **Price**: 🟢 Free
- **Host**: Self-Hosted or Managed
- **Privacy**: _See [Code::Stats Privacy Policy](https://codestats.net/tos#privacy)_

---

### Mullvad Status

Shows your Mullvad VPN connection status, as well as server info. Fetched from [am.i.mullvad.net](https://mullvad.net/en/check/)

<p align="center"><img width="400" src="https://i.ibb.co/3BCb2YV/mullvad-check.png" /></p>

##### Options

_No Options_

##### Example

```yaml
- type: mullvad-status
```

##### Info
- **CORS**: 🟢 Enabled
- **Auth**: 🟢 Not Required
- **Price**: 🟢 Free
- **Host**: Managed
- **Privacy**: _See [Mullvad Privacy Policy](https://mullvad.net/en/help/privacy-policy/)_

---

### AnonAddy

[AnonAddy](https://anonaddy.com/) is a free and open source mail forwarding service. Use it to protect your real email address, by using a different alias for each of your online accounts, and have all emails land in your normal inbox(es). Supports custom domains, email replies, PGP-encryption, multiple recipients and more

This widget display email addresses / aliases from AnonAddy. Click an email address to copy to clipboard, or use the toggle switch to enable/ disable it. Shows usage stats (bandwidth, used aliases etc), as well as total messages recieved, blocked and sent. Works with both self-hosted and managed instances of AnonAddy.

<p align="center"><img width="400" src="https://i.ibb.co/ZhfyRdV/anonaddy.png" /></p>

##### Options

**Field** | **Type** | **Required** | **Description**
--- | --- | --- | ---
**`apiKey`** | `string` |  Required | Your AnonAddy API Key / Personal Access Token. You can generate this under [Account Settings](https://app.anonaddy.com/settings)
**`hostname`** | `string` |  _Optional_ | If your self-hosting AnonAddy, then supply the host name. By default it will use the public hosted instance
**`apiVersion`** | `string` |  _Optional_ | If you're using an API version that is not version `v1`, then specify it here
**`limit`** | `number` |  _Optional_ | Limit the number of emails shown per page. Defaults to `10`
**`sortBy`** | `string` |  _Optional_ | Specify the sort order for email addresses. Defaults to `updated_at`. Can be either: `local_part`, `domain`, `email`, `emails_forwarded`, `emails_blocked`, `emails_replied`, `emails_sent`, `created_at`, `updated_at` or `deleted_at`. Precede with a `-` character to reverse order.
**`searchTerm`** | `string` |  _Optional_ | A search term to filter results by, will search the email, description and domain
**`disableControls`** | `boolean` |  _Optional_ | Prevent any changes being made to account through the widget. User will not be able to enable or disable aliases through UI when this option is set
**`hideMeta`** | `boolean` |  _Optional_ | Don't show account meta info (forward/ block count, quota usage etc)
**`hideAliases`** | `boolean` |  _Optional_ | Don't show email address / alias list. Will only show account meta info

##### Example

```yaml
  - type: anonaddy
    options:
      apiKey: "xxxxxxxxxxxxxxxxxxxxxxxx\
        xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx\
        xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
      limit: 5
      sortBy: created_at
      disableControls: true
```

##### Info
- **CORS**: 🟢 Enabled
- **Auth**: 🔴 Required
- **Price**: 🟠 Free for Self-Hosted / Free Plan available on managed instance or $1/month for premium
- **Host**: Self-Hosted or Managed
- **Privacy**: _See [AnonAddy Privacy Policy](https://anonaddy.com/privacy/)_

---

### Vulnerability Feed

Keep track of recent security advisories and vulnerabilities, with optional filtering by score, exploits, vendor and product. All fields are optional.

<p align="center"><img width="400" src="https://i.ibb.co/DYJMpjp/vulnerability-feed.png" /></p>

##### Options

**Field** | **Type** | **Required** | **Description**
--- | --- | --- | ---
**`sortBy`** | `string` |  _Optional_ | The sorting method. Can be either `publish-date`, `last-update` or `cve-code`. Defaults to `publish-date`
**`limit`** | `number` |  _Optional_ | The number of results to fetch. Can be between `5` and `30`, defaults to `10`
**`minScore`** | `number` |  _Optional_ | If set, will only display results with a CVE score higher than the number specified. Can be a number between `0` and `9.9`. By default, vulnerabilities of all CVE scores are shown
**`hasExploit`** | `boolean` |  _Optional_ | If set to `true`, will only show results with active exploits. Defaults to `false`
**`vendorId`** | `number` |  _Optional_ | Only show results from a specific vendor, specified by ID. See [Vendor Search](https://www.cvedetails.com/vendor-search.php) for list of vendors. E.g. `23` (Debian), `26` (Microsoft), `23682` (CloudFlare)
**`productId`** | `number` |  _Optional_ | Only show results from a specific app or product, specified by ID. See [Product Search](https://www.cvedetails.com/product-search.php) for list of products. E.g. `13534` (Docker), `15913` (NextCloud), `19294` (Portainer), `17908` (ProtonMail)


##### Example

```yaml
- type: cve-vulnerabilities
```

or

```yaml
- type: cve-vulnerabilities
  options:
    sortBy: publish-date
    productId: 28125
    hasExploit: true
    minScore: 5
    limit: 30
```

##### Info
- **CORS**: 🟠 Proxied
- **Auth**: 🟢 Not Required
- **Price**: 🟢 Free
- **Host**: Managed
- **Privacy**: _See [CVE Details Privacy Policy](https://www.cvedetails.com/privacy.php)_

---

### Exchange Rates

Display current FX rates in your native currency. Hover over a row to view more info, or click to show rates in that currency.

<p align="center"><img width="400" src="https://i.ibb.co/fMdyLTB/exchange-rates.png" /></p>

##### Options

**Field** | **Type** | **Required** | **Description**
--- | --- | --- | ---
**`inputCurrency`** | `string` | Required | The base currency to show results in. Specified as a 3-letter ISO-4217 code, see [here](https://www.exchangerate-api.com/docs/supported-currencies) for the full list of supported currencies, and their symbols
**`outputCurrencies`** | `array` |  Required | List or currencies to show results for. Specified as a 3-letter ISO-4217 code, see [here](https://www.exchangerate-api.com/docs/supported-currencies) for the full list of supported currencies, and their symbols
**`apiKey`** | `string` |  Required | API key for [exchangerate-api.com](https://www.exchangerate-api.com/), usually a 24-digit alpha-numeric string. You can sign up for a free account [here](https://app.exchangerate-api.com/sign-up)

##### Example 

```yaml
- type: exchange-rates
  options:
    apiKey: xxxxxxxxxxxxxxxxxxxxxxxx
    inputCurrency: GBP
    outputCurrencies:
      - USD
      - JPY
      - HKD
      - KPW
```

##### Info
- **CORS**: 🟢 Enabled
- **Auth**: 🔴 Required
- **Price**: 🟠 Free plan (upto 100,000 requests/ month)
- **Host**: Managed Instance Only
- **Privacy**: _See [ExchangeRateAPI Privacy Policy](https://www.exchangerate-api.com/terms)_

---

### Public Holidays

Counting down to the next day off work? This widget displays upcoming public holidays for your country. Data is fetched from [Enrico](http://kayaposoft.com/enrico/)

<p align="center"><img width="400" src="https://i.ibb.co/VC6fZqn/public-holidays.png" /></p>

##### Options

**Field** | **Type** | **Required** | **Description**
--- | --- | --- | ---
**`country`** | `string` |  Required | The region to fetch holiday data for, specified as a country code, e.g. `GB` or `US`
**`holidayType`** | `string` |  __Optional__ | The type of holidays to fetch. Can be: `all`, `public_holiday`, `observance`, `school_holiday`, `other_day` or `extra_working_day`. Defaults to `public_holiday`
**`monthsToShow`** | `number` |  __Optional__ | The number of months in advance to show. Min: `1`, max: `24`. Defaults to `12`

##### Example

```yaml
- type: public-holidays
  options:
    country: GB
    holidayType: all
    monthsToShow: 12
```

##### Info
- **CORS**: 🟢 Enabled
- **Auth**: 🟢 Not Required
- **Price**: 🟢 Free
- **Host**: Self-Hosted (see [jurajmajer/enrico](https://github.com/jurajmajer/enrico)) or Managed
- **Privacy**: ⚫ No Policy Available

---

### Covid-19 Status

Keep track of the current COVID-19 status. Optionally also show cases by country, and a time-series chart. Uses live data from various sources, computed by [disease.sh](https://disease.sh/)

<p align="center"><img width="400" src="https://i.ibb.co/7XjbyRg/covid-19-status.png?" /></p>

##### Options

**Field** | **Type** | **Required** | **Description**
--- | --- | --- | ---
**`showChart`** | `boolean` | _Optional_ | Also display a time-series chart showing number of recent cases
**`showCountries`** | `boolean` |  _Optional_ | Also display a list of cases per country
**`numDays`** | `number` | _Optional_ | Specify number of days worth of history to render on the chart
**`countries`** | `string[]` | _Optional_ | An array of countries to display, specified by their [ISO-3 codes](https://www.iso.org/obp/ui). Leave blank to show all, sorted by most cases. `showCountries` must be set to `true`
**`limit`** | `number` | _Optional_ | If showing all countries, set a limit for number of results to return. Defaults to `10`, no maximum


##### Example 

```yaml
- type: covid-stats
```

Or

```yaml
- type: covid-stats
  options:
    showChart: true
    showCountries: true
    countries:
    - GBR
    - USA
    - IND
    - RUS
```

##### Info
- **CORS**: 🟢 Enabled
- **Auth**: 🟢 Not Required
- **Price**: 🟢 Free
- **Host**: Managed Instance or Self-Hosted (see [disease-sh/api](https://github.com/disease-sh/api))
- **Privacy**: ⚫ No Policy Available
- **Conditions**: [Terms of Use](https://github.com/disease-sh/api/blob/master/TERMS.md)

---

### Sports Scores

Show recent scores and upcoming matches from your favourite sports team. Data is fetched from [TheSportsDB.com](https://www.thesportsdb.com/). From the UI, you can click any other team to view their scores and upcoming games, or click a league name to see all teams.

<p align="center"><img width="400" src="https://i.ibb.co/8XhXGkN/sports-scores.png" /></p>

##### Options

**Field** | **Type** | **Required** | **Description**
--- | --- | --- | ---
**`teamId`** | `string` |  __Optional__ | The ID of a team to fetch scores from. You can search for your team on the [Teams Page](https://www.thesportsdb.com/teams_main.php)
**`leagueId`** | `string` |  __Optional__ | Alternatively, provide a league ID to fetch all games from. You can find the ID on the [Leagues Page](https://www.thesportsdb.com/Sport/Leagues)
**`pastOrFuture`** | `string` |  __Optional__ | Set to `past` to show scores for recent games, or `future` to show upcoming games. Defaults to `past`. You can change this within the UI
**`apiKey`** | `string` | __Optional__ | Optionally specify your API key, which you can sign up for at [TheSportsDB.com](https://www.thesportsdb.com/)
**`limit`** | `number` | __Optional__ | To limit output to a certain number of matches, defaults to `15`
**`hideImage`** | `boolean` | __Optional__ | Set to `true` to not render the team / match banner image, defaults to `false`

##### Example

```yaml
- type: sports-scores
  options:
    teamId: 133636
```

##### Info
- **CORS**: 🟢 Enabled
- **Auth**: 🟠 Optional
- **Price**: 🟠 Free plan (upto 30 requests / minute, limited endpoints)
- **Host**: Managed Instance Only
- **Privacy**: ⚫ No Policy Available

---

### News Headlines

Displays the latest news, click to read full article. Date is fetched from various news sources using [Currents API](https://currentsapi.services/en)

<p align="center"><img width="380" src="https://i.ibb.co/6NDWW0z/news-headlines.png" /></p>

##### Options

**Field** | **Type** | **Required** | **Description**
--- | --- | --- | ---
**`apiKey`** | `string` |  Required | Your API key for CurrentsAPI. This is free, and you can [get one here](https://currentsapi.services/en/register)
**`country`** | `string` | _Optional_ | Fetch news only from a certain country or region. Specified as a country code, e.g. `GB` or `US`. See [here](https://api.currentsapi.services/v1/available/regions) for a list of supported regions
**`category`** | `string` | _Optional_ | Only return news from within a given category, e.g. `sports`, `programming`, `world`, `science`. The [following categories](https://api.currentsapi.services/v1/available/categories) are supported
**`lang`** | `string` |  _Optional_ | Specify the language for returned articles as a 2-digit ISO code (limited article support). The [following languages](https://api.currentsapi.services/v1/available/languages) are supported, defaults to `en`
**`count`** | `number` |  _Optional_ | Limit the number of results. Can be between `1` and `200`, defaults to `10`
**`keywords`** | `string` |  _Optional_ | Only return articles that contain an exact match within their title or description
**`hideImages`** | `boolean` |  _Optional_ | If set to `true`, then article image thumbnails will not be displayed

##### Example 

```yaml
- type: news-headlines
    options:
      apiKey: xxxxxxx
      category: world
```

##### Info
- **CORS**: 🟢 Enabled
- **Auth**: 🔴 Required
- **Price**: 🟠 Free plan (upto 600 requests / day)
- **Host**: Managed Instance Only
- **Privacy**: _See [CurrentsAPI Privacy Policy](https://currentsapi.services/privacy)_

---

### TFL Status

Shows real-time tube status of the London Underground. All fields are optional.

<p align="center"><img width="400" src="https://i.ibb.co/LRDhXDn/tfl-status.png" /></p>

##### Options

**Field** | **Type** | **Required** | **Description**
--- | --- | --- | ---
**`showAll`** | `boolean` |  _Optional_ | By default, details for lines with a Good Service are not visible, but you can click More Details to see all. Setting this option to `true` will show all lines on initial page load
**`sortAlphabetically`** | `boolean` | _Optional_ | By default lines are sorted by current status, set this option to `true` to instead sort them alphabetically
**`linesToShow`** | `array` | _Optional_ | By default all lines are shown. If you're only interested in the status of a few lines, then pass in an array of lines to show, specified by name

##### Example 

```yaml
- type: tfl-status
```

```yaml
  - type: tfl-status
    options:
      showAll: true
      sortAlphabetically: true
      linesToShow:
      - District
      - Jubilee
      - Central
```

##### Info
- **CORS**: 🟢 Enabled
- **Auth**: 🟢 Not Required
- **Price**: 🟢 Free
- **Host**: Managed Instance Only
- **Privacy**: _See [TFL Privacy Policy](https://tfl.gov.uk/corporate/privacy-and-cookies/)_

---

### Stock Price History

Shows recent price history for a given publicly-traded stock or share

<p align="center"><img width="400" src="https://i.ibb.co/XZHRb4f/stock-price.png" /></p>

##### Options

**Field** | **Type** | **Required** | **Description**
--- | --- | --- | ---
**`apiKey`** | `string` |  Required | API key for [Alpha Vantage](https://www.alphavantage.co/), you can get a free API key [here](https://www.alphavantage.co/support/#api-key)
**`stock`** | `string` | Required | The stock symbol for the asset to fetch data for
**`priceTime`** | `string` |  _Optional_ | The time to fetch price for. Can be `high`, `low`, `open` or `close`. Defaults to `high`
**`chartColor`** | `string` | _Optional_ | Color of the chart value. Defaults to `--widget-text-color` which inherits dashboard primary color
**`chartHeight`** | `number` | _Optional_ | The height of rendered chart in px. Defaults to `300`

##### Example 

```yaml
- type: stock-price-chart
  options:
    stock: NET
    apiKey: PGUWSWD6CZTXMT8N
```

##### Info
- **CORS**: 🟢 Enabled
- **Auth**: 🔴 Required
- **Price**: 🟠 Free plan (upto 500 requests/day)
- **Host**: Managed Instance Only
- **Privacy**: _See [AlphaVantage Privacy Policy](https://www.alphavantage.co/privacy/)_

---

### ETH Gas Prices

Renders the current Gas cost of transactions on the Ethereum network (in both GWEI and USD), along with recent historical prices. Useful for spotting a good time to transact. Uses data from [ethgas.watch](https://ethgas.watch/)

<p align="center"><img width="400" src="https://i.ibb.co/LhHfQyp/eth-gas-prices.png" /></p>

##### Options

_No config options._

##### Example 

```yaml
- type: eth-gas-prices
```

##### Info
- **CORS**: 🟢 Enabled
- **Auth**: 🟢 Not Required
- **Price**: 🟢 Free
- **Host**: Managed Instance or Self-Hosted (see [wslyvh/ethgaswatch](https://github.com/wslyvh/ethgaswatch))
- **Privacy**: ⚫ No Policy Available

---

### Joke

Renders a programming or generic joke. Data is fetched from the [JokesAPI](https://github.com/Sv443/JokeAPI) by @Sv443. All fields are optional.

<p align="center"><img width="400" src="https://i.ibb.co/sQJGkyR/joke.png" /></p>

##### Options

**Field** | **Type** | **Required** | **Description**
--- | --- | --- | ---
**`category`** | `string` |  _Optional_ | Set the category of jokes to return. Use a string to specify a single category, or an array to pass in multiple options. Available options are: `all`, `programming`, `pun`, `dark`, `spooky`, `christmas` and `misc`. An up-to-date list of supported categories can be found [here](https://v2.jokeapi.dev/categories). Defaults to `all`
**`safeMode`** | `boolean` | _Optional_ | Set to `true`, to prevent the fetching of any NSFW jokes. Defaults to `false`
**`language`** | `string` |  _Optional_ | Specify the language for returned jokes. The following languages are supported: `en`, `cs`, `de`, `es`, `fr` and `pt`, and an up-to-date list of supported languages can be found [here](https://v2.jokeapi.dev/languages). By default, your system language will be used, if it's supported, otherwise English

##### Example 

```yaml
- type: joke
  options:
    safeMode: true
    language: en
    category: Programming
```

##### Info
- **CORS**: 🟢 Enabled
- **Auth**: 🟢 Not Required
- **Price**: 🟢 Free
- **Host**: Managed Instance or Self-Hosted (see [Sv443/JokeAPI](https://github.com/Sv443/JokeAPI))
- **Privacy**: _See [SV443's Privacy Policy](https://sv443.net/privacypolicy/en)_

---

### XKCD Comics

Have a laugh with the daily comic from [XKCD](https://xkcd.com/). A classic webcomic website covering everything from Linux, math, romance, science and language. All fields are optional.

<p align="center"><img width="400" src="https://i.ibb.co/kqV68hy/xkcd-comic.png" /></p>

##### Options

**Field** | **Type** | **Required** | **Description**
--- | --- | --- | ---
**`comic`** | `string / number` |  _Optional_ | Choose which comic to display. Set to either `random`, `latest` or the series number of a specific comic, like `627`. Defaults to `latest`

##### Example

```yaml
- type: xkcd-comic
  options:
    comic: latest
```

##### Info
- **CORS**: 🟢 Enabled
- **Auth**: 🟢 Not Required
- **Price**: 🟢 Free
- **Privacy**: ⚫ No Policy Available

---

### Flight Data

Displays airport departure and arrival flights, using data from [AeroDataBox](https://www.aerodatabox.com/). Useful if you live near an airport and often wonder where the flight overhead is going to. Hover over a row for more flight data.

<p align="center"><img width="400" src="https://i.ibb.co/yPMBJSY/flight-data.png" /></p>

##### Options

**Field** | **Type** | **Required** | **Description**
--- | --- | --- | ---
**`airport`** | `string` |  Required | The airport to show flight data from. Should be specified as a 4-character ICAO-code, a full list of which can be found [here](https://en.wikipedia.org/wiki/ICAO_airport_code) (example: `KBJC` or `EGKK`)
**`apiKey`** | `string` | Required | A valid [RapidAPI](https://rapidapi.com/) Key, with [AeroDataBox](https://rapidapi.com/aerodatabox/api/aerodatabox/) enabled (check in your [Subscription Dashboard](https://rapidapi.com/developer/billing/subscriptions-and-usage)). This API is free to sign up for and use
**`limit`** | `number` | _Optional_ | For busy airports, you may wish to limit the number of results visible
**`direction`** | `string` | _Optional_ | By default, both departure and arrival flights will be fetched, if you would like to only show flights in one direction, set this to wither `departure` or `arrival`

##### Example 

```yaml
- type: flight-data
  options:
    airport: EGLC
    apiKey: XXXXX
    limit: 12
    direction: all
```

##### Info
- **CORS**: 🟢 Enabled
- **Auth**: 🔴 Required
- **Price**: 🟠 Free plan (upto 150 requests / month)
- **Host**: Managed Instance Only
- **Privacy**: _See [AeroDataBox](https://www.aerodatabox.com/#h.p_CXtIYZWF_WQd) and [RapidAPI Policy](https://rapidapi.com/privacy/)_

---

### Astronomy Picture of the Day

Show the NASA Astronomy Pictore of the Day. Data is fetched from [APOD](https://apod.nasa.gov/apod/) using [PawelPleskaczynski/apod_api](https://github.com/PawelPleskaczynski/apod_api).

<p align="center"><img width="400" src="https://i.ibb.co/ZMkgLFK/apod.png" /></p>

##### Options

_No config options._

##### Example 

```yaml
- type: apod
```

##### Info
- **CORS**: 🟢 Enabled
- **Auth**: 🟢 Not Required
- **Price**: 🟢 Free
- **Host**: Managed Instance or Self-Hosted (see [PawelPleskaczynski/apod_api](https://github.com/PawelPleskaczynski/apod_api))
- **Privacy**: _See [NASA's Privacy Policy](https://www.nasa.gov/about/highlights/HP_Privacy.html)_

---

### GitHub Trending

Displays currently trending projects on GitHub. Optionally specify a language and time-frame. Data is fetched from [Lissy93/gh-trending-no-cors](https://github.com/Lissy93/gh-trending-no-cors) using the GitHub API. All fields are optional.

<p align="center"><img width="380" src="https://i.ibb.co/BGy7Q3g/github-trending.png" /></p>

##### Options

**Field** | **Type** | **Required** | **Description**
--- | --- | --- | ---
**`lang`** | `string` |  _Optional_ | A programming language to fetch trending repos from that category. E.g. `javascript` or `go`
**`since`** | `string` |  _Optional_ | The timeframe to use when calculating trends. Can be either `daily`, `weekly` or `monthly`. Defaults to `daily`
**`limit`** | `number` |  _Optional_ | Optionally limit the number of results. Max `25`, default is `10`

##### Example 

```yaml
- type: github-trending-repos
  options:
    limit: 8
    since: weekly
```

##### Info
- **CORS**: 🟢 Enabled
- **Auth**: 🟢 Not Required
- **Price**: 🟢 Free
- **Host**: Managed Instance or Self-Hosted (see [Lissy93/gh-trending-no-cors](https://github.com/Lissy93/gh-trending-no-cors))
- **Privacy**: _See [GitHub's Privacy Policy](https://docs.github.com/en/github/site-policy/github-privacy-statement)_

---

### GitHub Profile Stats

Display stats from your GitHub profile, using embedded cards from [anuraghazra/github-readme-stats](https://github.com/anuraghazra/github-readme-stats)

<p align="center"><img width="380" src="https://i.ibb.co/L0K1zNN/github-profile-stats.png" /></p>

##### Options

**Field** | **Type** | **Required** | **Description**
--- | --- | --- | ---
**`username`** | `string` |  Required | The GitHub username to fetch info for. E.g. `lissy93`. (Not required if `hideProfileCard` and `hideLanguagesCard` are both set to `true`)
**`hideProfileCard`** | `boolean` |  _Optional_ | If set to `true`, the users profile card will not be shown. Defaults to `false`
**`hideLanguagesCard`** | `boolean` |  _Optional_ | If set to `true`, the users top languages card will not be shown. Defaults to `false`
**`repos`** | `array` |  _Optional_ | If you'd like to also display stats for some GitHub reposotories, then add an array or repo names here. Specified as `[username]/[repo-name]`, e.g. `lissy93/dashy`


##### Example 


```yaml
- type: github-profile-stats
  options:
    username: Lissy93
    hideLanguagesCard: true
    repos:
    - lissy93/dashy
    - lissy93/personal-security-checklist
    - lissy93/twitter-sentiment-visualisation
```

##### Info
- **CORS**: 🟢 Enabled
- **Auth**: 🟢 Not Required
- **Price**: 🟢 Free
- **Host**: Managed Instance or Self-Hosted (see [anuraghazra/github-readme-stats](https://github.com/anuraghazra/github-readme-stats))
- **Privacy**: _See [GitHub's Privacy Policy](https://docs.github.com/en/github/site-policy/github-privacy-statement)_

---

## Self-Hosted Services Widgets


### System Info

Displays info about the server which Dashy is hosted on. Includes user + host, operating system, uptime and basic memory & load data.

<p align="center"><img width="400" src="https://i.ibb.co/rvDPBDF/system-info.png" /></p>

##### Options

_No config options._

##### Example 

```yaml
- type: system-info
```

##### Info
No external data requests made

Note that this widget is not available if you are running Dashy in a container or VM. Instead you can use the [System Monitoring](#system-resource-monitoring) widgets to display stats from the host system instead.

---

### Cron Monitoring (Health Checks)

Cron job monitoring using [Health Checks](https://github.com/healthchecks/healthchecks). Both managed and self-hosted instances are supported.

<p align="center"><img width="400" src="https://i.ibb.co/Ptf2kwm/health-checks.png" /></p>

##### Options

**Field** | **Type** | **Required** | **Description**
--- | --- | --- | ---
**`apiKey`** | `string` |  Required | A read-only API key for the project to monitor. You can generate this by selecting a Project --> Settings --> API Access. Note that you must generate a separate key for each project
**`host`** | `string` | _Optional_ | If you're self-hosting, or using any instance other than the official (healthchecks.io), you will need to specify the host address. E.g. `https://healthchecks.example.com` or `http://cron-monitoing.local`

##### Example 

```yaml
- type: health-checks
  options:
    apiKey: XXXXXXXXX
```

##### Info
- **CORS**: 🟢 Enabled
- **Auth**: 🔴 Required
- **Price**: 🟠 Free plan (upto 20 services, or self-host for unlimited)
- **Host**: Managed Instance or Self-Hosted (see [GitHub - HealthChecks](https://github.com/healthchecks/healthchecks))
- **Privacy**: _See [Health-Checks Privacy Policy](https://healthchecks.io/privacy/)_

---

### CPU History (NetData)

Pull recent CPU usage history from NetData.

<p align="center"><img width="600" src="https://i.ibb.co/ZdyR5nJ/nd-cpu-history.png" /></p>

##### Options

**Field** | **Type** | **Required** | **Description**
--- | --- | --- | ---
**`host`** | `string` |  Required | The URL to your NetData instance
**`chartHeight`** | `number` | _Optional_ | The height of rendered chart in px. Defaults to `300`
**`chartColor`** / **`chartColors`** | `string` / `array`| _Optional_ | Color of the chart value(s) as hex codes. `chartColor` is a single value (defaults to `--widget-text-color`), whereas `chartColors` is an array of colors

##### Example 

```yaml
- type: nd-cpu-history
  options:
  host: http://192.168.1.1:19999
```

##### Info
- **CORS**: 🟢 Enabled
- **Auth**: 🟢 Not Required
- **Price**: 🟢 Free
- **Host**: Self-Hosted (see [GitHub - NetData](https://github.com/netdata/netdata))
- **Privacy**: _See [NetData Privacy Policy](https://www.netdata.cloud/data-privacy/)_

---


### Memory History (NetData)

Pull recent system RAM usage from NetData, and show as a breakdown of different categories.

<p align="center"><img width="600" src="https://i.ibb.co/2dsSWnk/nd-memory-history.png" /></p>

##### Options

**Field** | **Type** | **Required** | **Description**
--- | --- | --- | ---
**`host`** | `string` |  Required | The URL to your NetData instance
**`chartHeight`** | `number` | _Optional_ | The height of rendered chart in px. Defaults to `300`
**`chartColor`** / **`chartColors`** | `string` / `array`| _Optional_ | Color of the chart value(s) as hex codes. `chartColor` is a single value (defaults to `--widget-text-color`), whereas `chartColors` is an array of colors

##### Example 

```yaml
- type: nd-ram-history
  options:
    host: http://192.168.1.1:19999
```

##### Info
- **CORS**: 🟢 Enabled
- **Auth**: 🟢 Not Required
- **Price**: 🟢 Free
- **Host**: Self-Hosted (see [GitHub - NetData](https://github.com/netdata/netdata))
- **Privacy**: _See [NetData Privacy Policy](https://www.netdata.cloud/data-privacy/)_

---

### Load History (NetData)

Pull recent load usage in 1, 5 and 15 minute intervals, from NetData.

<p align="center"><img width="600" src="https://i.ibb.co/qR9C2tJ/nd-load-history.png" /></p>

##### Options

**Field** | **Type** | **Required** | **Description**
--- | --- | --- | ---
**`host`** | `string` |  Required | The URL to your NetData instance
**`chartHeight`** | `number` | _Optional_ | The height of rendered chart in px. Defaults to `300`
**`chartColor`** / **`chartColors`** | `string` / `array`| _Optional_ | Color of the chart value(s) as hex codes. `chartColor` is a single value (defaults to `--widget-text-color`), whereas `chartColors` is an array of colors

##### Example 

```yaml
- type: nd-load-history
  options:
  host: http://192.168.1.1:19999
```

##### Info
- **CORS**: 🟢 Enabled
- **Auth**: 🟢 Not Required
- **Price**: 🟢 Free
- **Host**: Self-Hosted (see [GitHub - NetData](https://github.com/netdata/netdata))
- **Privacy**: _See [NetData Privacy Policy](https://www.netdata.cloud/data-privacy/)_

---

### Pi Hole Stats

Displays the number of queries blocked by [Pi-Hole](https://pi-hole.net/).

<p align="center"><img width="400" src="https://i.ibb.co/zftCLJN/pi-hole-stats.png" /></p>

##### Options

**Field** | **Type** | **Required** | **Description**
--- | --- | --- | ---
**`hostname`** | `string` |  Required | The URL to your Pi-Hole instance
**`hideStatus`** / **`hideChart`** / **`hideInfo`** | `boolean` |  _Optional_ | Optionally hide any of the three parts of the widget

##### Example 

```yaml
- type: pi-hole-stats
  options:
    hostname: http://192.168.130.1
```

##### Info
- **CORS**: 🟢 Enabled
- **Auth**: 🟢 Not Required
- **Price**: 🟢 Free
- **Host**: Self-Hosted (see [GitHub - Pi-hole](https://github.com/pi-hole/pi-hole))
- **Privacy**: _See [Pi-Hole Privacy Guide](https://pi-hole.net/privacy/)_

---

### Pi Hole Queries

Shows top queries that were blocked and allowed by [Pi-Hole](https://pi-hole.net/).

<p align="center"><img width="400" src="https://i.ibb.co/pXR0bdQ/pi-hole-queries.png" /></p>

##### Options

**Field** | **Type** | **Required** | **Description**
--- | --- | --- | ---
**`hostname`** | `string` |  Required | The URL to your Pi-Hole instance
**`apiKey`** | `string` |  Required | Your Pi-Hole web password. It is **NOT** your pi-hole admin interface or server password. It can be found in `/etc/pihole/setupVars.conf`, and is a 64-character located on the line that starts with `WEBPASSWORD`
**`count`** | `number` |  _Optional_ | The number of queries to display. Defaults to `10`

##### Example 

```yaml
- type: pi-hole-top-queries
  options:
    hostname: https://pi-hole.local
    apiKey: xxxxxxxxxxxxxxxxxxxxxxx
```

##### Info
- **CORS**: 🟢 Enabled
- **Auth**: 🔴 Required
- **Price**: 🟢 Free
- **Host**: Self-Hosted (see [GitHub - Pi-hole](https://github.com/pi-hole/pi-hole))
- **Privacy**: _See [Pi-Hole Privacy Guide](https://pi-hole.net/privacy/)_

---

### Recent Traffic

Shows number of recent traffic, using allowed and blocked queries from [Pi-Hole](https://pi-hole.net/)

<p align="center"><img width="500" src="https://i.ibb.co/7kdxxwx/pi-hole-recent-queries.png" /></p>

##### Options

**Field** | **Type** | **Required** | **Description**
--- | --- | --- | ---
**`hostname`** | `string` |  Required | The URL to your Pi-Hole instance

##### Example 

```yaml
- type: pi-hole-traffic
  options:
    hostname: https://pi-hole.local
```

##### Info
- **CORS**: 🟢 Enabled
- **Auth**: 🟢 Not Required
- **Price**: 🟢 Free
- **Host**: Self-Hosted (see [GitHub - Pi-hole](https://github.com/pi-hole/pi-hole))
- **Privacy**: _See [Pi-Hole Privacy Guide](https://pi-hole.net/privacy/)_

---

### Stat Ping Statuses

Displays the current and recent uptime of your running services, via a self-hosted instance of [StatPing](https://github.com/statping/statping)

<p align="center"><img width="300" src="https://i.ibb.co/Fq7JDjQ/stat-ping.png" /></p>

##### Options

**Field** | **Type** | **Required** | **Description**
--- | --- | --- | ---
**`hostname`** | `string` |  Required | The URL to your StatPing instance, without a trailing slash

##### Example 

```yaml
- type: stat-ping
  options:
    hostname: http://192.168.130.1:8080
```

##### Info
- **CORS**: 🟠 Proxied
- **Auth**: 🟢 Not Required
- **Price**: 🟢 Free
- **Host**: Self-Hosted (see [GitHub - StatPing](https://github.com/statping/statping))
- **Privacy**: _See [StatPing Docs](https://docs.statping.com/)_

---

### Synology Download Station

Displays the current downloads/torrents tasks of your Synology NAS

<p align="center"><img width="300" src="https://i.ibb.co/N2kKWTN/image.png" /></p>

##### Options

**Field** | **Type** | **Required** | **Description**
--- | --- | --- | ---
**`hostname`** | `string` |  Required | The URL to your Synology NAS, without a trailing slash
**`username`** | `string` |  Required | The username of a user on your synology NAS. You will see only this user download station tasks if he is not part of the administrator group. Currently don't support OTP protected accounts.
**`password`** | `string` |  Required | The password of the account specified above.

##### Example 

```yaml
- type: synology-download
  options:
    hostname: http://192.168.1.1:8080
    username: dashy
    password: totally-secure-password


```

##### Info
- **CORS**: 🟠 Proxied
- **Auth**: 🟢 Required
- **Price**: 🟢 Free
- **Host**: Self-Hosted (see [Synology](https://www.synology.com/en-us))
- **Privacy**: _See [Synology Privacy Statement](https://www.synology.com/en-us/company/legal/privacy)_

---

## System Resource Monitoring

The easiest method for displaying system info and resource usage in Dashy is with [Glances](https://nicolargo.github.io/glances/).

Glances is a cross-platform monitoring tool developed by [@nicolargo](https://github.com/nicolargo). It's similar to top/htop but with a [Rest API](https://glances.readthedocs.io/en/latest/api.html) and many [data exporters](https://glances.readthedocs.io/en/latest/gw/index.html) available. Under the hood, it uses [psutil](https://github.com/giampaolo/psutil) for retrieving system info.

If you don't already have it installed, either follow the [Installation Guide](https://github.com/nicolargo/glances/blob/master/README.rst) for your system, or setup [with Docker](https://glances.readthedocs.io/en/latest/docker.html), or use the one-line install script: `curl -L https://bit.ly/glances | /bin/bash`.

Glances can be launched with the `glances` command. You'll need to run it in web server mode, using the `-w` option for the API to be reachable. If you don't plan on using the Web UI, then you can disable it using `--disable-webui`. See the [command reference docs](https://glances.readthedocs.io/en/latest/cmds.html) for more info.


##### Options

All Glance's based widgets require a `hostname`. All other parameters are optional.

**Field** | **Type** | **Required** | **Description**
--- | --- | --- | ---
**`hostname`** | `string` |  Required | The URL or IP + port to your Glances instance (without a trailing slash)
**`username`** | `string` |  _Optional_ | If you have setup basic auth on Glances, specify username here (defaults to `glances`)
**`password`** | `string` |  _Optional_ | If you have setup basic auth on Glances, specify password here. **Note**: since this password is in plaintext, it is important not to reuse it anywhere else
**`apiVersion`** | `string` |  _Optional_ | Specify an API version, defaults to V `3`. Note that support for older versions is limited
**`limit`** | `number` |  _Optional_ | For widgets that show a time-series chart, optionally limit the number of data points returned. A higher number will show more historical results, but will take longer to load. A value between 300 - 800 is usually optimal

Note that if auth is configured, requests must be proxied with `useProxy: true`
##### Info
- **CORS**: 🟢 Enabled
- **Auth**: 🟠 Optional
- **Price**: 🟢 Free
- **Host**: Self-Hosted (see [GitHub - Nicolargo/Glances](https://github.com/nicolargo/glances))
- **Privacy**: ⚫ No Policy Available

##### Screenshot
[![example-screenshot](https://i.ibb.co/xfK6BGb/system-monitor-board.png)](https://ibb.co/pR6dMZT)

---

### Current CPU Usage

Live-updating current CPU usage, as a combined average across alll cores

<p align="center"><img width="400" src="https://i.ibb.co/qkLgxLp/gl-cpu-usage.png" /></p>

##### Example 

```yaml
- type: gl-current-cpu
  options:
    hostname: http://192.168.130.2:61208
```

---

### CPU Usage Per Core

Live-updating CPU usage breakdown per core

<p align="center"><img width="400" src="https://i.ibb.co/512MYhT/gl-cpu-cores.png" /></p>

##### Example 

```yaml
- type: gl-current-cores
  options:
    hostname: http://192.168.130.2:61208
```

---

### CPU Usage History

Recent CPU usage history, across all cores, and displayed by user and system

<p align="center"><img width="500" src="https://i.ibb.co/zs8BDzR/gl-cpu-history.png" /></p>

##### Options

**Field** | **Type** | **Required** | **Description**
--- | --- | --- | ---
**`limit`** | `number` |  _Optional_ | Limit the number of results returned, rendering more data points will take longer to load. Defaults to `100`

##### Example 

```yaml
- type: gl-cpu-history
  options:
    hostname: http://192.168.130.2:61208
    limit: 60
```

---

### Current Memory Usage

Real-time memory usage gauge, with more info visible on click

<p align="center"><img width="400" src="https://i.ibb.co/rynp52J/gl-mem-usage.png" /></p>

##### Example 

```yaml
- type: gl-current-mem
  options:
    hostname: http://192.168.130.2:61208
```

---

### Memory Usage History

Recent memory usage chart

<p align="center"><img width="500" src="https://i.ibb.co/V3wSgW0/gl-mem-history.png" /></p>

##### Options

**Field** | **Type** | **Required** | **Description**
--- | --- | --- | ---
**`limit`** | `number` |  _Optional_ | Limit the number of results returned, rendering more data points will take longer to load. Defaults to `100`


##### Example 

```yaml
- type: gl-mem-history
  options:
    hostname: http://localhost:61208
    limit: 80
```

---

### Disk Space

List connected disks, showing free / used space and other info (file system, mount point and space available)

<p align="center"><img width="400" src="https://i.ibb.co/25y94bB/gl-disk-usage.png" /></p>

##### Example 

```yaml
- type: gl-disk-space
  options:
    hostname: http://192.168.130.2:61208
```

---

### Disk IO

Shows real-time read and write speeds and operations per sec for each disk 

<p align="center"><img width="400" src="https://i.ibb.co/JdgjCjG/gl-disk-io.png" /></p>

##### Example 

```yaml
- type: gl-disk-io
  options:
    hostname: http://192.168.130.2:61208
```

---

### System Load

Shows the number of processes waiting in the run-queue, averaged across all cores. Displays for past 5, 10 and 15 minutes

<p align="center"><img width="400" src="https://i.ibb.co/090FfNy/gl-system-load.png" /></p>

##### Example 

```yaml
- type: gl-system-load
  options:
    hostname: http://192.168.130.2:61208
```

---

### System Load History

Shows recent historical system load, calculated from the number of processes waiting in the run-queue, in 1, 5 and 15 minute intervals, and averaged across all cores. Optionally specify `limit` to set number of results returned, defaults to `500`, max `100000`, but the higher the number the longer the load and render times will be.

<p align="center"><img width="500" src="https://i.ibb.co/C2rGMLg/system-load-history.png" /></p>

##### Example 

```yaml
- type: gl-load-history
  options:
    hostname: http://192.168.130.2:61208
```

---

### Network Interfaces

Lists visible network interfaces, including real-time upload/ download stats

<p align="center"><img width="400" src="https://i.ibb.co/FnhgHfG/gl-network-interfaces.png" /></p>

##### Example 

```yaml
- type: gl-network-interfaces
  options:
    hostname: http://192.168.130.2:61208
```

---

### Network Traffic

Shows amount of data recently uploaded/ downloaded across all network interfaces. Optionally set the `limit` option to specify number historical of data points to return

<p align="center"><img width="400" src="https://i.ibb.co/12RN6KT/gl-network-traffic.png" /></p>

##### Example 

```yaml
- type: gl-network-traffic
  options:
    hostname: http://192.168.130.2:61208
    limit: 500
```

---

### Resource Usage Alerts

Lists recent high resource usage alerts (e.g. CPU, mem, IO, load, temp)

<p align="center"><img width="400" src="https://i.ibb.co/w01NX5R/gl-alerts.png" /></p>

##### Example 

```yaml
- type: gl-alerts
  options:
    hostname: http://192.168.130.2:61208
```

---

### IP Address

Shows public and private IP address. Note that the ip plugin is not available on all instances of Glances.

<p align="center"><img width="400" src="https://i.ibb.co/ZhXBxZr/gl-ip-address.png" /></p>

##### Example 

```yaml
- type: gl-ip-address
  options:
    hostname: http://192.168.130.2:61208
```

---

### CPU Temp

Displays temperature data from system CPUs.

Note: This widget uses the [`sensors`](https://github.com/nicolargo/glances/blob/develop/glances/plugins/glances_sensors.py) plugin, which is disabled by default, and may cause [performance issues](https://github.com/nicolargo/glances/issues/1664#issuecomment-632063558).
You'll need to enable the sensors plugin to use this widget, using: `--enable-plugin sensors` when you start Glances.

<p align="center"><img width="400" src="https://i.ibb.co/xSs4Gqd/gl-cpu-temp.png" /></p>

##### Example 

```yaml
- type: gl-cpu-temp
  options:
    hostname: http://192.168.130.2:61208
```

---

## Dynamic Widgets

### Iframe Widget

Embed any webpage into your dashboard as a widget.

<p align="center"><img width="400" src="https://i.ibb.co/t4VHnh3/iframe-widget.gif" /></p>

##### Options

**Field** | **Type** | **Required** | **Description**
--- | --- | --- | ---
**`url`** | `string` |  Required | The URL to the webpage to embed
**`frameHeight`** | `number` | _Optional_ | If needed, specify height of iframe in `px`. E.g. `400`, defaults to auto

##### Example 

```yaml
- type: iframe
  options:
    url: https://fiatleak.com/
```

---

### HTML Embedded Widget

Many websites and apps provide their own embeddable widgets. These can be used with Dashy using the Embed widget, which lets you dynamically embed and HTML, CSS or JavaScript contents.

⚠️ **NOTE:** Use with extreme caution. Embedding a script from an untrustworthy source may have serious unintended consequences.

<p align="center"><img width="400" src="https://i.ibb.co/fkwNnxT/embed-widget-2.png" /></p>

##### Options

**Field** | **Type** | **Required** | **Description**
--- | --- | --- | ---
**`html`** | `string` |  _Optional_ | HTML contents to render in the widget
**`script`** | `string` |  _Optional_ | Raw JavaScript code to execute (caution)
**`scriptSrc`** | `string` |  _Optional_ | A URL to JavaScript content (caution)
**`css`** | `string` |  _Optional_ | Any stylings for widget contents

##### Example 

```yaml
- type: embed
  options:
    scriptSrc: https://cdn.speedcheck.org/basic/scbjs.min.js
    html: | 
      <div id="sc-container">
      <div id="sc-branding" class="sc-bb">
      <a target="_blank" href="https://www.speedcheck.org/">
      <img src="https://cdn.speedcheck.org/branding/speedcheck-logo-18.png" alt="Speedcheck"/>
      </a>
      </div>
      </div>
```

Or

```yaml
- type: embed
    options:
      css: '.coinmarketcap-currency-widget { color: var(--widget-text-color); }'
      html: '<div class="coinmarketcap-currency-widget" data-currencyid="1" data-base="USD" data-secondary="" data-ticker="true" data-rank="true" data-marketcap="true" data-volume="true" data-statsticker="true" data-stats="USD"></div>'
      scriptSrc: 'https://files.coinmarketcap.com/static/widget/currency.js'
```

You can also use this widget to display an image, wither locally or from a remote origin.

```yaml
- type: embed
  options:
    html: '<img src="https://dashy.lan/item-icons/my-image.png" />'
```

---

### API Response

Directly output plain-text response from any API-enabled service.

// Coming soon...

---

### Prometheus Data

Display data from any service with a Prometheus exporter.

// Coming soon...

---

### Data Feed

Show live data from an RSS-enabled service. The only required parameter is `rssUrl`, which is the URL to the ATOM feed. See [RSS Widget](#rss-feed) for full list of available options.

<p align="center"><img width="700" src="https://i.ibb.co/1r88pvL/rss-feed-example-1.png" /></p>

##### Example

```yaml
- type: rss-feed
  options:
    rssUrl: https://notes.aliciasykes.com/feed
```

---

## Usage & Customizations

### Widget Usage Guide

Like items, widgets are placed under sections. You may have one or more widgets per section.

In your YAML config file, this will look something like:

```yaml
sections:
- name: Today
  icon: far fa-calendar-day
  widgets:
  - type: clock
    options:
      format: en-GB
  - type: weather
    options:
      apiKey: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
      city: London
      units: metric
```

> In this example, there is a single section, named "Today", using a Calendar icon from Font-Awesome. It has 2 widgets, a clock and the current weather.

---

### Continuous Updates

By default, a widget which displays dynamic data from an external source, will only fetch results on page load. If you would like to keep data updated at all times, you can enable **Continuous Updates**. This is done by setting a time value in the `updateInterval` field.

The value of `updateInterval` is optional, and is specified and seconds. It must be more than `10` and less than `7200`.

For example, the following widget displaying stats from Pi-Hole will update ever 20 seconds.

```yaml
widgets:
- type: pi-hole-stats
  updateInterval: 20
  options:
    hostname: http://192.168.130.2
```

Note that if you have many widgets, and set them to continuously update frequently, you will notice a hit to performance. A widget that relies on data from an external API, will also consume your usage quota faster, if set to keep updating.

---

### Proxying Requests

If a widget fails to make a data request, and the console shows a CORS error, this means the server is blocking client-side requests.

Dashy has a built-in CORS proxy ([`services/cors-proxy.js`](https://github.com/Lissy93/dashy/blob/master/services/cors-proxy.js)), which will be used automatically by some widgets, or can be forced to use by other by setting the `useProxy` option.

For example:

```yaml
widgets:
- type: pi-hole-stats
  useProxy: true
  options:
    hostname: http://pi-hole.local
```

Alternativley, and more securley, you can set the auth headers on your service to accept requests from Dashy. For example:

```
Access-Control-Allow-Origin: https://location-of-dashy/
Vary: Origin
```

---

### Setting Timeout

If the endpoint you are requesting data from is slow to respond, you may see a timeout error in the console. This can easily be fixed by specifying the `timeout` property on the offending widget. This should be an integer value, in milliseconds. By default timeout is `2500` ms (2½ seconds).

For example:

```yaml
- type: gl-current-cpu
  timeout: 8000
  options:
    hostname: https://glances.dns-device.local
```

---

### Widget Styling

Like elsewhere in Dashy, all colours can be easily modified with CSS variables. 

Widgets use the following color variables, which can be overridden if desired:
- `--widget-text-color` - Text color, defaults to `--primary`
- `--widget-background-color` - Background color, defaults to `--background-darker`
- `--widget-accent-color` - Accent color, defaults to `--background`

For more info on how to apply custom variables, see the [Theming Docs](/docs/theming.md#setting-custom-css-in-the-ui)

---

### Customizing Charts

For widgets that contain charts, you can set an array of colors under `chartColors`.
To specify the chart height, set `chartHeight` to an integer (in `px`), defaults to `300`.
For example:

```yaml
- type: gl-load-history
  options:
    hostname: http://192.168.130.2:61208
    chartColors: ['#9b5de5', '#f15bb5', '#00bbf9', '#00f5d4']
    chartHeight: 450
```

---

### Language Translations

Since most of the content displayed within widgets is fetched from an external API, unless that API supports multiple languages, translating dynamic content is not possible.

However, any hard-coded content is translatable, and all dates and times will display in your local format.

For more info about multi-language support, see the [Internationalization Docs](/docs/multi-language-support.md).

---

### Widget UI Options

Widgets can be opened in full-page view, by clicking the Arrow icon (top-right). The URL in your address bar will also update, and visiting that web address directly will take you straight to that widget.

You can reload the data of any widget, by clicking the Refresh Data icon (also in top-right). This will only affect the widget where the action was triggered from.

All [config options](/docs/configuring.md#section) that can be applied to sections, can also be applied to widget sections. For example, to make a widget section double the width, set `displayData.cols: 2` within the parent section. You can collapse a widget (by clicking the section title), and collapse state will be saved locally.

Widgets cannot currently be edited through the UI. This feature is in development, and will be released soon.  In the meantime, you can either use the JSON config editor, or use [VS Code Server](https://github.com/coder/code-server), or just SSH into your box and edit the conf.yml file directly.

---

### Build your own Widget

Widgets are built in a modular fashion, making it easy for anyone to create their own custom components.

For a full tutorial on creating your own widget, you can follow [this guide](/docs/development-guides.md#building-a-widget), or take a look at [here](https://github.com/Lissy93/dashy/commit/3da76ce2999f57f76a97454c0276301e39957b8e) for a code example. 

Alternatively, for displaying simple data, you could also just use the either the [iframe](#iframe-widget), [embed](#html-embedded-widget), [data feed](#data-feed) or [API response](#api-response) widgets.

---

### Requesting a Widget

Suggestions for widget ideas are welcome. But there is no guarantee that I will build your widget idea.

Please only request widgets for services that:
- Have a publicly accessible API
- Are CORS and HTTPS enabled
- Are free to use, or have a free plan
- Allow for use in their Terms of Service
- Would be useful for other users

You can suggest a widget [here](https://git.io/Jygo3), please star the repo before submitting a ticket. If you are a monthly GitHub sponsor, I will happily build out a custom widget for any service that meets the above criteria, usually 2 within weeks of initial request.

For services that are not officially supported, it is likely still possible to display data using either the [iframe](#iframe-widget), [embed](#html-embedded-widget) or [API response](#api-response) widgets. For more advanced features, like charts and action buttons, you could also build your own widget, using [this tutorial](/docs/development-guides.md#building-a-widget), it's fairly straight forward, and you can use an [existing widget](https://github.com/Lissy93/dashy/tree/master/src/components/Widgets) (or [this example](https://git.io/JygKI)) as a template.

---

### Troubleshooting Widget Errors

If an error occurs when fetching or rendering results, you will see a short message in the UI. If that message doesn't addequatley explain the problem, then you can [open the browser console](/docs/troubleshooting.md#how-to-open-browser-console) to see more details.

Before proceeding, ensure that if the widget requires auth your API is correct, and for custom widgets, double check that the URL and protocol is correct.

If you're able to, you can find more information about why the request may be failing in the Dev Tools under the Network tab, and you can ensure your endpoint is correct and working using a tool like Postman.

#### CORS Errors

The most common issue is a CORS error. This is a browser security mechanism which prevents the client-side app (Dashy) from from accessing resources on a remote origin, without that server's explicit permission (e.g. with headers like Access-Control-Allow-Origin). See the MDN Docs for more info: [Cross-Origin Resource Sharing](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS).

There are several ways to fix a CORS error:

##### Option 1 - Ensure Correct Protocol
You will get a CORS error if you try and access a http service from a https source. So ensure that the URL you are requesting has the right protocol, and is correctly formatted.

##### Option 2 - Set Headers

If you have control over the destination (e.g. for a self-hosted service), then you can simply apply the correct headers.
Add the `Access-Control-Allow-Origin` header, with the value of either `*` to allow requests from anywhere, or more securely, the host of where Dashy is served from. For example:

```
Access-Control-Allow-Origin: https://url-of-dashy.local
```

or

```
Access-Control-Allow-Origin: *
```

##### Option 3 - Proxying Request

You can route requests through Dashy's built-in CORS proxy. Instructions and more details can be found [here](#proxying-requests). If you don't have control over the target origin, and you are running Dashy either through Docker, with the Node server or on Netlify, then this solution will work for you.

Just add the `useProxy: true` option to the failing widget.

##### Option 4 - Use a plugin

For testing purposes, you can use an addon, which will disable the CORS checks. You can get the Allow-CORS extension for [Chrome](https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf?hl=en-US) or [Firefox](https://addons.mozilla.org/en-US/firefox/addon/access-control-allow-origin/), more details [here](https://mybrowseraddon.com/access-control-allow-origin.html)

---

### Raising an Issue

If you need to submit a bug report for a failing widget, then please include the full console output (see [how](/docs/troubleshooting.md#how-to-open-browser-console)) as well as the relevant parts of your config file. Before sending the request, ensure you've read the docs. If you're new to GitHub, an haven't previously contributed to the project, then please fist star the repo to avoid your ticket being closed by the anti-spam bot.
