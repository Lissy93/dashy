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
    apiKey: 6e29c7d514cf890f846d58178b6d418f
    city: London
    units: metric
    hideDetails: false
```

---

## Dynamic Widgets

---

## Build your own Widget
