# Untitled object in Dashy Config Schema Schema

```txt
https://example.com/schemas/abstract#/properties/appConfig
```

Application configuration

| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                             |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :------------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [dashy-config.schema.json*](../../out/dashy-config.schema.json "open original schema") |

## appConfig Type

`object` ([Details](dashy-config-properties-appconfig.md))

# appConfig Properties

| Property                                  | Type      | Required | Nullable       | Defined by                                                                                                                                                                           |
| :---------------------------------------- | :-------- | :------- | :------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [backgroundImg](#backgroundimg)           | `string`  | Optional | cannot be null | [Dashy Config Schema](dashy-config-properties-appconfig-properties-backgroundimg.md "https://example.com/schemas/abstract#/properties/appConfig/properties/backgroundImg")           |
| [theme](#theme)                           | `string`  | Optional | cannot be null | [Dashy Config Schema](dashy-config-properties-appconfig-properties-theme.md "https://example.com/schemas/abstract#/properties/appConfig/properties/theme")                           |
| [enableFontAwesome](#enablefontawesome)   | `boolean` | Optional | cannot be null | [Dashy Config Schema](dashy-config-properties-appconfig-properties-enablefontawesome.md "https://example.com/schemas/abstract#/properties/appConfig/properties/enableFontAwesome")   |
| [fontAwesomeKey](#fontawesomekey)         | `string`  | Optional | cannot be null | [Dashy Config Schema](dashy-config-properties-appconfig-properties-fontawesomekey.md "https://example.com/schemas/abstract#/properties/appConfig/properties/fontAwesomeKey")         |
| [cssThemes](#cssthemes)                   | `array`   | Optional | cannot be null | [Dashy Config Schema](dashy-config-properties-appconfig-properties-cssthemes.md "https://example.com/schemas/abstract#/properties/appConfig/properties/cssThemes")                   |
| [externalStyleSheet](#externalstylesheet) | Multiple  | Optional | cannot be null | [Dashy Config Schema](dashy-config-properties-appconfig-properties-externalstylesheet.md "https://example.com/schemas/abstract#/properties/appConfig/properties/externalStyleSheet") |
| [customCss](#customcss)                   | `string`  | Optional | cannot be null | [Dashy Config Schema](dashy-config-properties-appconfig-properties-customcss.md "https://example.com/schemas/abstract#/properties/appConfig/properties/customCss")                   |

## backgroundImg

A URL to an image asset to be displayed as background

`backgroundImg`

*   is optional

*   Type: `string`

*   cannot be null

*   defined in: [Dashy Config Schema](dashy-config-properties-appconfig-properties-backgroundimg.md "https://example.com/schemas/abstract#/properties/appConfig/properties/backgroundImg")

### backgroundImg Type

`string`

## theme

A theme to be applied by default on first load

`theme`

*   is optional

*   Type: `string`

*   cannot be null

*   defined in: [Dashy Config Schema](dashy-config-properties-appconfig-properties-theme.md "https://example.com/schemas/abstract#/properties/appConfig/properties/theme")

### theme Type

`string`

### theme Default Value

The default value is:

```json
"Callisto"
```

## enableFontAwesome

Should load font-awesome assets

`enableFontAwesome`

*   is optional

*   Type: `boolean`

*   cannot be null

*   defined in: [Dashy Config Schema](dashy-config-properties-appconfig-properties-enablefontawesome.md "https://example.com/schemas/abstract#/properties/appConfig/properties/enableFontAwesome")

### enableFontAwesome Type

`boolean`

### enableFontAwesome Default Value

The default value is:

```json
true
```

## fontAwesomeKey

API key for font-awesome

`fontAwesomeKey`

*   is optional

*   Type: `string`

*   cannot be null

*   defined in: [Dashy Config Schema](dashy-config-properties-appconfig-properties-fontawesomekey.md "https://example.com/schemas/abstract#/properties/appConfig/properties/fontAwesomeKey")

### fontAwesomeKey Type

`string`

### fontAwesomeKey Constraints

**pattern**: the string must match the following regular expression: 

```regexp
^[a-z0-9]{10}$
```

[try pattern](https://regexr.com/?expression=%5E%5Ba-z0-9%5D%7B10%7D%24 "try regular expression with regexr.com")

## cssThemes

Theme names to be added to the dropdown

`cssThemes`

*   is optional

*   Type: `string[]`

*   cannot be null

*   defined in: [Dashy Config Schema](dashy-config-properties-appconfig-properties-cssthemes.md "https://example.com/schemas/abstract#/properties/appConfig/properties/cssThemes")

### cssThemes Type

`string[]`

## externalStyleSheet

URL or URLs of external stylesheets to add to dropdown/ load

`externalStyleSheet`

*   is optional

*   Type: any of the folllowing: `string` or `array` ([Details](dashy-config-properties-appconfig-properties-externalstylesheet.md))

*   cannot be null

*   defined in: [Dashy Config Schema](dashy-config-properties-appconfig-properties-externalstylesheet.md "https://example.com/schemas/abstract#/properties/appConfig/properties/externalStyleSheet")

### externalStyleSheet Type

any of the folllowing: `string` or `array` ([Details](dashy-config-properties-appconfig-properties-externalstylesheet.md))

## customCss

Any custom CSS overides, must be minified

`customCss`

*   is optional

*   Type: `string`

*   cannot be null

*   defined in: [Dashy Config Schema](dashy-config-properties-appconfig-properties-customcss.md "https://example.com/schemas/abstract#/properties/appConfig/properties/customCss")

### customCss Type

`string`
