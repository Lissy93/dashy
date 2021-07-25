# Development Guides

A series of short tutorials, to guide you through the most common development tasks. 

Sections:
- [Creating a new theme](#creating-a-new-theme)
- [Adding Translations](#adding-translations)
- [Adding a new option in the config file](#adding-a-new-option-in-the-config-file)

## Creating a new theme

See [Theming](./theming.md)

## Adding Translations

Dashy is using [vue-i18n](https://vue-i18n.intlify.dev/guide/) to manage multi-language support.

Adding a new language is pretty straightforward, with just three steps:

##### 1. Create a new Language File
Create a new JSON file in `./src/assets/locales` name is a 2-digit [ISO-639 code](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) for your language, E.g. for German `de.json`, French `fr.json` or Spanish `es.json` - You can find a list of all ISO codes at [iso.org](https://www.iso.org/obp/ui).
If your language is a specific dialect or regional language, then use the Posfix [CLDR](http://cldr.unicode.org/) format, where, e.g. `en-GB.json` (British), `es-MX.json` (Spanish, in Mexico) or `zh-CN.json` (Chinese, simplified) - A list of which can be found [here](https://github.com/unicode-org/cldr-json/blob/master/cldr-json/cldr-core/availableLocales.json)


##### 2. Translate!
Using [`en.json`](https://github.com/Lissy93/dashy/tree/master/src/assets/locales/en.json) as an example, translate the JSON values to your language, while leaving the keys as they are. It's fine to leave out certain items, as if they're missing they will fall-back to English. If you see any attribute which include curly braces (`{xxx}`), then leave the inner value of these braces as is, as this is for variables.

```json
{
  "theme-maker": {
    "export-button": "Benutzerdefinierte Variablen exportieren",
    "reset-button": "Stile zurücksetzen für",
    "show-all-button": "Alle Variablen anzeigen",
    "save-button": "Speichern",
    "cancel-button": "Abbrechen",
    "saved-toast": "{theme} Erfolgreich aktualisiert",
    "reset-toast": "Benutzerdefinierte Farben für {theme} entfernt"
  },
}
```

##### 3. Add your file to the app

In [`./src/utils/languages.js`](https://github.com/Lissy93/dashy/tree/master/src/utils/languages.js), you need to do 2 small things:

First import your new translation file, do this at the top of the page.
E.g. `import de from '@/assets/locales/de.json';`

Second, add it to the array of languages, e.g:
```javascript
export const languages = [
  {
    name: 'English',
    code: 'en',
    locale: en,
    flag: '🇬🇧',
  },
  {
    name: 'German', // The name of your language
    code: 'de', // The ISO code of your language
    locale: de, // The name of the file you imported (no quotes)
    flag: '🇩🇪', // An optional flag emoji
  },
];
```
You can also add your new language to the readme, under the [Language Switching](https://github.com/Lissy93/dashy#language-switching-) section and optionally include your name/ username if you'd like to be credited for your work. Done!

If you are not comfortable with making pull requests, or do not want to modify the code, then feel free to instead send the translated file to me, and I can add it into the application. I will be sure to credit you appropriately. 

# Adding a new option in the config file

This section is for, if you're adding a new component or setting, that requires an additional item to be added to the users config file.

All of the users config is specified in `./public/conf.yml` - see [Configuring Docs](./configuring.md) for info.
Before adding a new option in the config file, first ensure that there is nothing similar available, that is is definitely necessary, it will not conflict with any other options and most importantly that it will not cause any breaking changes. Ensure that you choose an appropriate and relevant section to place it under.

Next decide the most appropriate place for your attribute:
- Application settings should be located under `appConfig`
- Page info (such as text and metadata) should be under `pageInfo`
- Data relating to specific sections should be under `section[n].displayData`
- And for setting applied to specific items, it should be under `item[n]`

In order for the user to be able to add your new attribute using the Config Editor, and for the build validation to pass, your attribute must be included within the [ConfigSchema](https://github.com/Lissy93/dashy/blob/master/src/utils/ConfigSchema.js). You can read about how to do this on the [ajv docs](https://ajv.js.org/json-schema.html). Give your property a type and a description, as well as any other optional fields that you feel are relevant. For example:

```json
"fontAwesomeKey": {
  "type": "string",
  "pattern": "^[a-z0-9]{10}$",
  "description": "API key for font-awesome",
  "example": "0821c65656"
}
```
or
```json
"iconSize": {
  "enum": [ "small", "medium", "large" ],
  "default": "medium",
  "description": "The size of each link item / icon"
}
```

Next, if you're property should have a default value, then add it to [`defaults.js`](https://github.com/Lissy93/dashy/blob/master/src/utils/defaults.js). This ensures that nothing will break if the user does not use your property, and having all defaults together keeps things organised and easy to manage.

If your property needs additional logic for fetching, setting or processing, then you can add a helper function within [`ConfigHelpers.js`](https://github.com/Lissy93/dashy/blob/master/src/utils/ConfigHelpers.js).

Finally, add your new property to the [`configuring.md`](./configuring.md) API docs. Put it under the relevant section, and be sure to include field name, data type, a description and mention that it is optional.  If your new feature needs more explaining, then you can also document it under the relevant section elsewhere in the documentation.

Checklist:
- [] Ensure the new attribute is actually necessary, and nothing similar already exists 
- [] Update the [Schema](https://github.com/Lissy93/dashy/blob/master/src/utils/ConfigSchema.js) with the parameters for your new option
- [] Set a default value (if required) within [`defaults.js`](https://github.com/Lissy93/dashy/blob/master/src/utils/defaults.js)
- [] Document the new value in [`configuring.md`](./configuring.md)
- [] Test that the reading of the new attribute is properly handled, and will not cause any errors when it is missing or populated with an unexpected value