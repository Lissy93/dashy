# Widgets

Dashy has support for displaying dynamic content in the form of widgets. There are several built-in widgets availible out-of-the-box (with more on the way!) as well as support for custom widgets to display stats from almost any service with an accessible API.

##### Contents
- [Built-In Widgets](#built-in-widgets)
- [Dynamic Widgets](#dynamic-widgets)
- [Build your own Widget](#build-your-own-widget)

## Built-In Widgets

### Clock

A simple, live-updating time and date widget with time-zone support. All options are optional.

##### Options

**Field** | **Type** | **Required** | **Description**
--- | --- | --- | ---
**`timeZone`** | `string` |  _Optional_ | The time zone to display date and time in.<br> Specified as Region/City, for example: `Australia/Melbourne`. See the [Time Zone DB](https://timezonedb.com/time-zones) for a full list of supported TZs. Defaults to the browser / device's local time
**`format`** | `string` | _Optional_ | A country code for displaying the date and time in local format.<br>Specified as `[ISO-3166]-[ISO-639]`, for example: `en-AU`. See [here](https://www.fincher.org/Utilities/CountryLanguageList.shtml) for a full list of locales. Defaults to the browser / device's region
**`hideDate`** | `boolean` |  _Optional_ | If set to `true`, the date and city will not be shown. Defaults to `false`

##### Example

```yaml
- name: London Time
  icon: fas fa-clock
  type: clock
  options:
    timeZone: Europe/London
    format: en-GB
    hideDate: false
```

### Weather

A simple, live-updating local weather component, showing temperature, conditions and more info.

##### Options

**Field** | **Type** | **Required** | **Description**
--- | --- | --- | ---
**`apiKey`** | `string` |  Required | Your OpenWeatherMap API key. You can get one for free at [openweathermap.org](https://openweathermap.org/)
**`city`** | `string` | Required | A city name to use for fetching weather. This can also be a state code or country code, following the ISO-3166 format
**`units`** | `string` |  _Optional_ | The units to use for displaying data, can be either `metric` or `imperial`. Defaults to `metric`
**`hideDetails`** | `boolean` |  _Optional_ | If set to `true`, the additional details (wind, humidity, pressure, etc) will not be shown. Defaults to `false`

##### Example

```yaml
- name: Local Weather
  icon: fas fa-clouds
  type: weather
  options:
    apiKey: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    city: London
    units: metric
    hideDetails: false
```

### Weather Forecast

Displays the weather (temperature and conditions) for the next few days for a given location. Note that this requires either the free [OpenWeatherMap Student Plan](https://home.openweathermap.org/students), or the Premium Plan. 

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
- name: Weather Forecast
  icon: ':sunny:'
  type: weather-forecast
  options:
    city: California
    numDays: 6
    apiKey: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    units: imperial
```

### Crypto Watch List

Keep track of price changes of your favorite crypto assets. Data is fetched from [CoinGecko](https://www.coingecko.com/)

##### Options

**Field** | **Type** | **Required** | **Description**
--- | --- | --- | ---
**`assets`** | `string` |  Required | An array of cryptocurrencies, coins and tokens. See [list of supported assets](https://api.coingecko.com/api/v3/asset_platforms)
**`currency`** | `string` | _Optional_ | The fiat currency to display price in, expressed as an ISO-4217 alpha code (see [list of currencies](https://www.iban.com/currency-codes)). Defaults to `USD`
**`sortBy`** | `number` |  _Optional_ | The method of sorting results. Can be `marketCap`, `volume` or `alphabetical`. Defaults to `marketCap`.

##### Example

```yaml
  - name: Crypto Prices
    icon: fas fa-rocket
    type: crypto-watch-list
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

##### Options

**Field** | **Type** | **Required** | **Description**
--- | --- | --- | ---
**`asset`** | `string` |  Required | Name of a crypto asset, coin or token to fetch price data for, see [list of supported assets](https://api.coingecko.com/api/v3/asset_platforms)
**`currency`** | `string` | _Optional_ | The fiat currency to display results in, expressed as an ISO-4217 alpha code (see [list of currencies](https://www.iban.com/currency-codes)). Defaults to `USD`
**`numDays`** | `number` |  _Optional_ | The number of days of price history to render. Defaults to `7`, min: `1`, max: `30` days

##### Example

```yaml
- name: Bitcoin Price
  icon: fab fa-bitcoin
  type: crypto-price-chart
  options:
    asset: bitcoin
    currency: GBP
    numDays: 7
```

### XKCD Comics

Have a laugh with the daily comic from [XKCD](https://xkcd.com/). A classic webcomic website covering everything from Linux, math, romance, science and language.

##### Options

**Field** | **Type** | **Required** | **Description**
--- | --- | --- | ---
**`comic`** | `string | number` |  _Optional_ | Choose which comic to display. Set to either `random`, `latest` or the series number of a specific comic, like `627`. Defaults to `latest`

##### Example

```yaml
- name: XKCD of the Day
  icon: fas fa-laugh
  type: xkcd-comic
  options:
    comic: latest
```

### TFL Status

Shows real-time tube status of the London Underground. All options are optional.

##### Options

**Field** | **Type** | **Required** | **Description**
--- | --- | --- | ---
**`showAll`** | `boolean` |  _Optional_ | By default, details for lines with a Good Service are not visible, but you can click More Details to see all. Setting this option to `true` will show all lines on initial page load
**`sortAlphabetically`** | `boolean` | _Optional_ | By default lines are sorted by current status, set this option to `true` to instead sort them alphabetically
**`linesToShow`** | `array` | _Optional_ | By default all lines are shown. If you're only interested in the status of a few lines, then pass in an array of lines to show, specified by name

##### Example 

```yaml
- name: London Underground
  type: tfl-status
```

```yaml
  - name: Commute
    icon: '🚋'
    type: tfl-status
    options:
      showAll: true
      sortAlphabetically: true
      linesToShow:
      - District
      - Jubilee
      - Central
```

---

## Dynamic Widgets

---

## Build your own Widget
