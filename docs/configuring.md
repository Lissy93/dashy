## Configuring

All app configuration is specified in [`/public/conf.yml`](https://github.com/Lissy93/dashy/blob/master/public/conf.yml) which is in [YAML Format](https://yaml.org/) format.

If you're new to YAML, it's pretty straight-forward. The format is exactly the same as that of JSON, but instead of using curley braces, structure is denoted using whitespace. This [quick guide](https://linuxhandbook.com/yaml-basics/) should get you up to speed in a few minutes, for more advanced topics take a look at this [Wikipedia article](https://en.wikipedia.org/wiki/YAML) and for some practicle examples, the  [Azure pipelines schema](https://docs.microsoft.com/en-us/azure/devops/pipelines/yaml-schema?view=azure-devops&tabs=schema%2Cparameter-schema) may be useful.

You may find it helpful to look at some sample config files to get you started, a collection of which can be found [here](https://gist.github.com/Lissy93/000f712a5ce98f212817d20bc16bab10).

There's a couple of things to remember, before getting started:
- After modifying your config, you will need to run `yarn build` to recompile the application
- You can check that your config file fits the schema, by running `yarn validate-config`
- Any changes made locally through the UI need to be exported into this file, in order for them to persist across devices

All fields are optional, unless otherwise stated.


#### Top-Level Fields

**Field** | **Type** | **Required**| **Description**
--- | --- | --- | ---
**`pageInfo`** | `object` | Required | Basic meta data like title, description, nav bar links, footer text. See [`pageInfo`](#pageinfo)
**`appConfig`** | `object` | _Optional_ | Settings related to how the app functions, including API keys and global styles. See [`appConfig`](#appconfig-optional)
**`sections`** | `array` | Required | An array of sections, each containing an array of items, which will be displayed as links. See [`section`](#section)

#### `PageInfo`

**Field** | **Type** | **Required**| **Description**
--- | --- | --- | ---
**`title`** | `string` |  Required | Your dashboard title, displayed in the header and browser tab
**`description`** | `string` | _Optional_ | Description of your dashboard, also displayed as a subtitle
**`navLinks`** | `array` | _Optional_ | Optional list of a maximum of 6 links, which will be displayed in the navigation bar. See [`navLinks`](#pageinfonavlinks-optional)
**`footerText`** | `string` | _Optional_ | Text to display in the footer (note that this will override the default footer content)

#### `pageInfo.navLinks` _(optional)_

**Field** | **Type** | **Required**| **Description**
--- | --- | --- | ---
**`title`** | `string` |  Required | The text to display on the link button
**`path`** | `string` | Required | The URL to navigate to when clicked. Can be relative (e.g. `/about`) or absolute (e.g. `https://example.com` or `http://192.168.1.1`)

#### `appConfig` _(optional)_

**Field** | **Type** | **Required**| **Description**
--- | --- | --- | ---
**`backgroundImg`** | `string` | _Optional_ | Path to an optional full-screen app background image. This can be either remote (http) or local (/). Note that this will slow down initial load
**`enableFontAwesome`** | `boolean` | _Optional_ | Where `true` is enabled, if left blank font-awesome will be enabled only if required by 1 or more icons
**`fontAwesomeKey`** | `string` | _Optional_ | If you have a font-awesome key, then you can use it here and make use of premium icons. It is a 10-digit alpha-numeric string from you're FA kit URL  (e.g. `13014ae648`)
**`theme`** | `string` | _Optional_ | The default theme for first load (you can change this later from the UI)
**`cssThemes`** | `string[]` | _Optional_ | An array of custom theme names which can be used in the theme switcher dropdown
**`externalStyleSheet`** | `string`  or `string[]` | _Optional_ | Either a URL to an external stylesheet or an array or URLs, which can be applied as themes within the UI
**`customCss`** | `string` | _Optional_ | Raw CSS that will be applied to the page. This can also be set from the UI. Please minify it first.
**`showSplashScreen`** | `boolean` | _Optional_ | Should display a splash screen while the app is loading. Defaults to false, except on first load

#### `section`

**Field** | **Type** | **Required**| **Description**
--- | --- | --- | ---
**`name`** | `string` | Required | The title for the section
**`icon`** | `string` | _Optional_ | An single icon to be displayed next to the title. See [`section.icon`](#sectionicon-and-sectionitemicon)
**`items`** | `array` | Required | An array of items to be displayed within the section. See [`item`](#sectionitem)
**`displayData`** | `object` | _Optional_ | Meta-data to optionally overide display settings for a given section. See [`displayData`](#sectiondisplaydata-optional)

#### `section.item`

**Field** | **Type** | **Required**| **Description**
--- | --- | --- | ---
**`title`** | `string` | Required | The text to display/ title of a given item. Max length `18`
**`description`** | `string` | _Optional_ | Additional info about an item, which is shown in the tooltip on hover, or visible on large tiles
**`url`** | `string` | Required | The URL / location of web address for when the item is clicked
**`icon`** | `string` | _Optional_ | The icon for a given item. Can be a font-awesome icon, favicon, remote URL or local URL. See [`item.icon`](#sectionicon-and-sectionitemicon)
**`target`** | `string` | _Optional_ | The opening method for when the item is clicked, either `newtab`, `sametab` or `iframe`. Where `newtab` will open the link in a new tab, `sametab` will open it in the current tab, and `iframe` will open a pop-up modal with the content displayed within that iframe. Note that for the iframe to load, you must have set the CORS headers to either allow `*` ot allow the domain that you are hosting Dashy on, for some websites and self-hosted services, this is already set.
**`color`** | `string` | _Optional_ | An optional color for the text and font-awesome icon to be displayed in. Note that this will override the current theme and so may not display well
**`backgroundColor`** | `string` | _Optional_ | An optional background fill color for the that given item. Again, this will override the current theme and so might not display well against the background

#### `section.displayData` _(optional)_

**Field** | **Type** | **Required**| **Description**
--- | --- | --- | ---
**`collapsed`** | `boolean` | _Optional_ | If true, the section will  be collapsed initially, and will need to be clicked to open. Useful for less regularly used, or very long sections. Defaults to `false` 
**`color`** | `string` | _Optional_ | A custom accent color for the section, as a hex code or HTML color (e.g. `#fff`)
**`customStyles`** | `string` | _Optional_ | Custom CSS properties that should be applied to that section, e.g. `border: 2px dashed #ff0000;`
**`itemSize`** | `string` | _Optional_ | Specify the size for items within this group, either `small`, `medium` or `large`. Note that this will overide any settings specified through the UI
**`rows`** | `number` | _Optional_ | Height of the section, specified as the number of rows it should span vertically, e.g. `2`. Defaults to `1`. Max is `5`.
**`cols`** | `number` | _Optional_ | Width of the section, specified as the number of columns the section should span horizontally, e.g. `2`. Defaults to `1`. Max is `5`.
**`layout`** | `string` | _Optional_ | Specify which CSS layout will be used to responsivley place items. Can be either `auto` (which uses flex layout), or `grid`. If `grid` is selected, then `itemCountX` and `itemCountY` may also be set. Defaults to `auto`
**`itemCountX`** | `number` | _Optional_ | The number of items to display per row / horizontally. If not set, it will be calculated automatically based on available space. Can only be set if `layout` is set to `grid`. Must be a whole number between `1` and `12`
**`itemCountY`** | `number` | _Optional_ | The number of items to display per column / vertically. If not set, it will be calculated automatically based on available space. If `itemCountX` is set, then `itemCountY` can be calculated automatically. Can only be set if `layout` is set to `grid`. Must be a whole number between `1` and `12`

#### `section.icon` and `section.item.icon`

**Field** | **Type** | **Required**| **Description**
--- | --- | --- | ---
**`icon`** | `string` | _Optional_ | The icon for a given item or section. Can be a font-awesome icon, favicon, remote URL or local URL. If set to `favicon`, the icon will be automatically fetched from the items website URL. To use font-awesome, specify the category, followed by the icon name, e.g. `fas fa-rocket`, `fab fa-monero` or `fal fa-duck` - note that to use pro icons, you mut specify `appConfig.fontAwesomeKey`. You can also use hosted any by specifying it's URL, e.g. `https://i.ibb.co/710B3Yc/space-invader-x256.png`. To use a local image, first store it in `./public/item-icons/` (or `-v /app/public/item-icons/` in Docker) , and reference it by name and extension - e.g. set `image.png` to use `./public/item-icon/image.png`, you can also use sub-folders if you have a lot of icons, to keep them organised.


#### Example

```yaml
---
pageInfo:
  title: Home Lab
sections: # An array of sections
- name: Section 1 - Getting Started
  items: # An array of items
  - title: GitHub
    description: Source code and documentation on GitHub
    icon: fab fa-github
    url: https://github.com/Lissy93/dashy
  - title: Issues
    description: View currently open issues, or raise a new one
    icon: fas fa-bug
    url: https://github.com/Lissy93/dashy/issues
  - title: Demo
    description: A live demo
    icon: far fa-rocket
    url: https://dashy-demo-1.netlify.app 
- name: Section 2 - Local Services
  items:
  - title: Firewall
    icon: favicon
    url: http://192.168.1.1/
  - title: Game Server
    icon: https://i.ibb.co/710B3Yc/space-invader-x256.png
    url: http://192.168.130.1/
```

For more example config files, see: [this gist](https://gist.github.com/Lissy93/000f712a5ce98f212817d20bc16bab10)
