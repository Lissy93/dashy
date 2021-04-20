
<h1 align="center">Dashy</h1>
<p align="center"><i>A static site linking to all running services for networking, management and monitoring</i></p>

<p align="center">
  <img width="800" src="https://i.ibb.co/L8YbNNc/dashy-demo2.gif" alt="Demo">
</p>

## Features 🌈

- Instant search and full keyboard shortcuts
- Multiple color themes, layout options and item sizes all configurable through the browser
- Preferences stored in local storage and applied on load
- Quickly preview a website, by holding down the Alt key while clicking, to open it in a resizable pop-up modal
- Additional info for each item visible on hover (including opening method icon, description as a tooltip and domain info)
- Small bundle size and a fully responsive UI makes the app easy to use on any device
- Many options for icons, including full Font-Awesome support and the ability to auto-fetch icon from URLs favicon
- Plus lots more...

---

## Running the App 🏃‍♂️

### Deploying 🚀
- Get Code: `git clone git@github.com:Lissy93/dashy.git` and `cd dashy`
- Configuration: Fill in you're settings in `./public/conf.yml`
- Install dependencies: `yarn`
- Build: `yarn build`
- Run: `yarn start`

### Deploying with Docker 🐳
- Get Code: `git clone git@github.com:Lissy93/dashy.git`  and `cd dashy`
- Configuration: Fill in you're settings in `./public/conf.yml`
- Build: `docker build -t lissy93/dashy .`
- Start: `docker run -it -p 8080:80 --rm --name my-dashboard lissy93/dashy`

### Developing 🧱
- Get Code: `git clone git@github.com:Lissy93/dashy.git`  and `cd dashy`
- Install dependencies: `yarn`
- Start dev server: `yarn dev`

---

## Configuring 🔧

### Config Locations 📍

Configuration files are located in [`./public/`](https://github.com/Lissy93/dashy/tree/master/public).
- `./public/conf.yml` - This is the main site configuration file, and is required for the app to work
- `./public/item-icons` - If you're using your own icons, you can choose to store them locally for better load time. You can also use sub-folders to keep things organized

Also within `./public` you'll find normal website assets, including `favicon.ico`, `manifest.json`, `robots.txt` and `web-icons/*`. There's no need to modify these, but you can do so if you wish.

### The Conf File 📄

All app config is specified in [`/public/conf.yml`](https://github.com/Lissy93/dashy/blob/master/public/conf.yml) (in [YAML Format](https://yaml.org/)).
All fields are optional, unless otherwise stated.

**`pageInfo`**
- `title` - String: The page title and heading
- `description` - String: Short description visible under the heading
- `navLinks` - Array: Links to display in the nav bar, an array or objects containing a title and link:
  - `title` - String: Text to display
  - `path` - String: URL or relative link

**`appConfig`** _(optional)_
- `enableFontAwesome` - Boolean: Where `true` is enabled, if left blank font-awesome will be enabled only if required by 1 or more icons
- `fontAwesomeKey` - String: If you have a font-awesome key, then you can use it here and make use of premium icons. It is a 10-digit alpha-numeric string from you're FA kit URL  (e.g. `13014ae648`)
- `theme`- String: The default theme for first load
- `cssThemes` - String[]: An array of custom theme names which can be used in the theme switcher dropdown - _See **theming** below_
- `externalStyleSheet` - String or String[] - Either a URL to an external stylesheet or an array or URLs, which can be applied as themes within the UI

**`sections`** - Section[]: (required) An array of sections - _See **`section`** below_

**`section`**
- `name` - String: (required) The title of that section
- `items` - Item[]: (required) An array of items - _See **`item`** below_
- `displayData`: An object with the following fields (all optional)
  - `collapsed` - Boolean: If true, the section will  be collapsed initially (defaults to `false`) 
  - `rows` - Int: Number of rows the section should span vertically, e.g. 2 (defaults to `1`)
  - `cols` - Int: Number of columns the section should span horizontally, e.g. 2 (defaults to `1`)
  - `color` - String: A custom accent color for the section, as a hex code or HTML color (e.g. `#fff`)
  - `customStyles` - String: Custom CSS properties that should be applied to that section, e.g. `border: 2px dashed #ff0000;`
  - `itemSize` - String: Specify the size for items within this group, either `small`, `medium` or `large`

**`item`**
- `title` - String: The text to display on the item
- `description` - String: Additional info which is shown in the tooltip on hover
- `icon` - String: Icons can be either a local image, remote image, or a Font Awesome icon,  *see below for more info*
- `url` - String: The full path to be opened on click (e.g. `https://example.com`)
- `target` - String: The method in which the item will be opened, either `newtab`, `sametab` or `iframe`
- `color` - String: A custom color the the item, as a hex code or HTML color (e.g. `#fff`)
- `backgroundColor` - String: A custom fill color for the the item's background, also as a hex code

**`icon`** Examples:
- To use use a remote image, just use it's full URL, e.g. `https://i.ibb.co/710B3Yc/space-invader-x256.png`
- To use a local image, save it in `./public/item-icons/image.png` or  `./public/my-category/item-icons/image.png` and specify the image as `image.png` or `my-category/image.png`. For best results, use either png or svg formats.
- To automatically fetch an icon from items URL, just set icon field to `favicon`
- To use a Font-Awesome icon, specify the category (`fas`, `fab`, `far`, `fal` or`fad`), followed by a space then `fa-` and the icon name. For example: `fas fa-rocket`, `fab fa-monero`, `fal fa-duck` or `fad fa-glass-whiskey-rocks`. Note that light (`fal`) and duotone (`fad`) icons are only available with Font Awesome Pro, to use this, you need to set you're kit ID under `appConfig.fontAwesomeKey`.


### Theming 🎨

The app comes with a number of built-in themes, but it's also easy to write you're own. Once you've done so you can select you're theme fro the dropdown menu, and like other visual settings, you're chosen theme is saved in local storage, so will load automatically when you next visit the page.

The theme switching is done by simply changing the `data-theme` attribute on the root DOM element, which can then be targeted by CSS. First off, in order for the theme to show up in the theme switcher, it needs to be added to the config file, under `appConfig.cssThemes`, either as a string, or an array of strings for multiple themes. For example:

```yaml
appConfig:
  cssThemes: ['tiger', 'another-theme']
```

You can now create a block to target you're theme with `html[data-theme='my-theme']{}` and set some styles. The easiest method is by setting CSS variables, but you can also directly override elements by their selector. As an example, see the [built-in CSS themes](https://github.com/Lissy93/dashy/blob/master/src/styles/color-themes.scss).

```css
html[data-theme='tiger'] {
  --primary: #f58233;
  --item-group-background: #0b1021;
}
```
Alternatively, you can load an external stylesheet. Pass either a URL to a .css file, or an array or URLs to `appConfig.externalStyleSheet`. The stylesheet will then be pre-loaded, and can then be enabled from the UI using the theme switcher.

```yaml
appConfig:
  externalStyleSheet: 'https://example.com/my-stylesheet.css'
```
---

## Notes

### Credits 🏆

The app makes use of the following components, kudos to their respective authors
- [`vue-select`](https://github.com/sagalbot/vue-select) - Dropdown component by @sagalbot
- [`vue-js-modal`](https://github.com/euvl/vue-js-modal) - Modal component by @euvl
- [`v-tooltip`](https://github.com/Akryum/v-tooltip) - Tooltip component by @Akryum

### License 📜

```
Copyright © 2021 Alicia Sykes <https://aliciasykes.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
associated documentation files (the “Software”), to deal in the Software without restriction, 
including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial
portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT
LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWAREOR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```