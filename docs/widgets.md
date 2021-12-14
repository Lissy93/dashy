# Widgets

Dashy has support for displaying dynamic content in the form of widgets. There are several built-in widgets availible out-of-the-box (with more on the way!) as well as support for custom widgets to display stats from almost any service with an accessible API.

##### Contents
- [General Widgets](#general-widgets)
  - [Clock](#clock)
  - [Weather](#weather)
  - [Weather Forecast](#weather-forecast)
  - [Crypto Watch List](#crypto-watch-list)
  - [Crypto Price History](#crypto-token-price-history)
  - [XKCD Comics](#xkcd-comics)
  - [TFL Status](#tfl-status)
  - [Exchange Rates](#exchange-rates)
  - [Stock Price History](#stock-price-history)
  - [Joke of the Day](#joke)
  - [Flight Data](#flight-data)
- [Self-Hosted Services Widgets](#dynamic-widgets)
- [Dynamic Widgets](#dynamic-widgets)
  - [Iframe Widget](#iframe-widget)
  - [HTML Embed Widget](#html-embedded-widget)
- [Build your own Widget](#build-your-own-widget)

## General Widgets

### Clock

A simple, live-updating time and date widget with time-zone support. All options are optional.

<p align="center"><img width="400" src="https://i.ibb.co/vjb4RTv/clock.png" /></p>

##### Options

**Field** | **Type** | **Required** | **Description**
--- | --- | --- | ---
**`timeZone`** | `string` |  _Optional_ | The time zone to display date and time in.<br> Specified as Region/City, for example: `Australia/Melbourne`. See the [Time Zone DB](https://timezonedb.com/time-zones) for a full list of supported TZs. Defaults to the browser / device's local time
**`format`** | `string` | _Optional_ | A country code for displaying the date and time in local format.<br>Specified as `[ISO-3166]-[ISO-639]`, for example: `en-AU`. See [here](https://www.fincher.org/Utilities/CountryLanguageList.shtml) for a full list of locales. Defaults to the browser / device's region
**`hideDate`** | `boolean` |  _Optional_ | If set to `true`, the date and city will not be shown. Defaults to `false`

##### Example

```yaml
- type: clock
  options:
    timeZone: Europe/London
    format: en-GB
    hideDate: false
```

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

### Weather Forecast

Displays the weather (temperature and conditions) for the next few days for a given location. Note that this requires either the free [OpenWeatherMap Student Plan](https://home.openweathermap.org/students), or the Premium Plan. 

<p align="center"><img width="400" src="https://i.ibb.co/vshwgZB/weather-forecast.png" /></p>

##### Options

**Field** | **Type** | **Required** | **Description**
--- | --- | --- | ---
**`apiKey`** | `string` |  Required | Your OpenWeatherMap API key. You can get one for free at [openweathermap.org](https://openweathermap.org/)
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

### Crypto Watch List

Keep track of price changes of your favorite crypto assets. Data is fetched from [CoinGecko](https://www.coingecko.com/)

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

### Crypto Token Price History

Shows recent price history for a given crypto asset, using price data fetched from [CoinGecko](https://www.coingecko.com/)

<p align="center"><img width="400" src="https://i.ibb.co/jr38m6S/crypto-price-history.png" /></p>

##### Options

**Field** | **Type** | **Required** | **Description**
--- | --- | --- | ---
**`asset`** | `string` |  Required | Name of a crypto asset, coin or token to fetch price data for, see [list of supported assets](https://api.coingecko.com/api/v3/asset_platforms)
**`currency`** | `string` | _Optional_ | The fiat currency to display results in, expressed as an ISO-4217 alpha code (see [list of currencies](https://www.iban.com/currency-codes)). Defaults to `USD`
**`numDays`** | `number` |  _Optional_ | The number of days of price history to render. Defaults to `7`, min: `1`, max: `30` days

##### Example

```yaml
- type: crypto-price-chart
  options:
    asset: bitcoin
    currency: GBP
    numDays: 7
```

### XKCD Comics

Have a laugh with the daily comic from [XKCD](https://xkcd.com/). A classic webcomic website covering everything from Linux, math, romance, science and language.

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

### TFL Status

Shows real-time tube status of the London Underground. All options are optional.

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

### Exchange Rates

Display current FX rates in your native currency

<p align="center"><img width="400" src="https://i.ibb.co/M905JHM/exchange-rates.png" /></p>

##### Options

**Field** | **Type** | **Required** | **Description**
--- | --- | --- | ---
**`apiKey`** | `string` |  Required | API key for [exchangerate-api.com](https://www.exchangerate-api.com/), usually a 24-digit alpha-numeric string. You can sign up for a free account [here](https://app.exchangerate-api.com/sign-up)
**`inputCurrency`** | `string` | Required | The base currency to show results in. Specified as a 3-letter ISO-4217 code, see [here](https://www.exchangerate-api.com/docs/supported-currencies) for the full list of supported currencies, and their symbols
**`outputCurrencies`** | `array` |  Required | List or currencies to show results for. Specified as a 3-letter ISO-4217 code, see [here](https://www.exchangerate-api.com/docs/supported-currencies) for the full list of supported currencies, and their symbols

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

### Stock Price History

Shows recent price history for a given publicly-traded stock or share

<p align="center"><img width="400" src="https://i.ibb.co/XZHRb4f/stock-price.png" /></p>

##### Options

**Field** | **Type** | **Required** | **Description**
--- | --- | --- | ---
**`apiKey`** | `string` |  Required | API key for [Alpha Vantage](https://www.alphavantage.co/), you can get a free API key [here](https://www.alphavantage.co/support/#api-key)
**`stock`** | `string` | Required | The stock symbol for the asset to fetch data for
**`priceTime`** | `string` |  _Optional_ | The time to fetch price for. Can be `high`, `low`, `open` or `close`. Defaults to `high`

##### Example 

```yaml
- type: stock-price-chart
  options:
    stock: NET
    apiKey: PGUWSWD6CZTXMT8N
```

### Joke

Renders a programming or generic joke. Data is fetched from the [JokesAPI](https://github.com/Sv443/JokeAPI) by @Sv443

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

---

## Dynamic Widgets

### Iframe Widget

Embed any webpage into your dashboard as a widget.

<p align="center"><img width="400" src="https://i.ibb.co/t4VHnh3/iframe-widget.gif" /></p>

##### Options

**Field** | **Type** | **Required** | **Description**
--- | --- | --- | ---
**`url`** | `string` |  Required | The URL to the webpage to embed

### HTML Embedded Widget

Many websites and apps provide their own embeddable widgets. These can be used with Dashy using the Embed widget, which lets you dynamically embed and HTML, CSS or JavaScript contents.

⚠️ **NOTE:** Use with extreme caution. Embedding a script from an untrustworthy source may have serious unintended consequences.

<p align="center"><img width="400" src="https://i.ibb.co/yn0SGtL/embed-widget.png" /></p>

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
      css: '.coinmarketcap-currency-widget { color: var(--widget-text-color); }'
      html: '<div class="coinmarketcap-currency-widget" data-currencyid="1" data-base="USD" data-secondary="" data-ticker="true" data-rank="true" data-marketcap="true" data-volume="true" data-statsticker="true" data-stats="USD"></div>'
      scriptSrc: 'https://files.coinmarketcap.com/static/widget/currency.js'
```

---

## Build your own Widget
