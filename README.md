
<h1 align="center">Dashy</h1>
<p align="center"><i>Dashy helps you organise your self-hosted services, by making them all accessible from a single place</i></p>

<p align="center">
  <img src="https://app.codacy.com/project/badge/Grade/3be23a4a3a8a4689bd47745b201ecb74" /> <img src="https://img.shields.io/github/issues/lissy93/dashy?style=flat-square" /> <img src="https://img.shields.io/github/languages/code-size/lissy93/dashy?style=flat-square" /> <img src="https://img.shields.io/tokei/lines/github/lissy93/dashy?style=flat-square" /> 
</p>

<p align="center">
  <img width="220" src="https://i.ibb.co/LrcpNg9/dashy.png" />
</p>

## Features 🌈

- Instant search by name, domain and tags - just start typing
- Full keyboard shortcuts for navigation, searching and launching
- Multiple color themes, with easy method for adding more
- Customizable layout options, and item sizes
- Quickly preview a website, by holding down the Alt key while clicking, to open it in a resizable pop-up modal
- Many options for icons, including full Font-Awesome support and the ability to auto-fetch icon from URLs favicon
- Additional info for each item visible on hover (including opening method icon and description as a tooltip)
- Option for full-screen background image, custom nav-bar links, and custom footer text
- User settings stored in local storage and applied on load
- Encrypted cloud backup and restore feature available
- Easy single-file YAML-based configuration
- Small bundle size, fully responsive UI and PWA makes the app easy to use on any device
- Plus lots more...

**Live Demos**: [Demo 1](https://dashy-demo-1.as93.net) ┆ [Demo 2](https://dashy-demo-2.as93.net) ┆ [Demo 3](https://dashy-demo-3.as93.net)

**Screenshots**
![Screenshots](https://i.ibb.co/r5T3MwM/dashy-screenshots.png)

**Recording**
<p align="center">
  <img width="800" src="https://i.ibb.co/L8YbNNc/dashy-demo2.gif" alt="Demo">
</p>

![More themes and screens](https://i.ibb.co/M6nyvqW/dashy-options-screen.png)

---

## Running the App 🏃‍♂️
### Deploying 🚀
- Get Code: `git clone git@github.com:Lissy93/dashy.git` and `cd dashy`
- Configuration: Fill in you're settings in `./public/conf.yml`
- Install dependencies: `yarn`
- Build: `yarn build`
- Run: `yarn start`

### Deploying with Docker from Source 🛳️
- Get Code: `git clone git@github.com:Lissy93/dashy.git`  and `cd dashy`
- Configuration: Fill in you're settings in `./public/conf.yml`
- Build: `docker build -t lissy93/dashy .`
- Start: `docker run -p 8080:80 --name my-dashboard lissy93/dashy`

### Deploying from Docker Hub 🐳
- Get the Image: `docker pull lissy93/dashy`
- Start the Container: `docker run -d -p 8080:80 --name my-dashboard lissy93/dashy`
### Developing 🧱
- Get Code: `git clone git@github.com:Lissy93/dashy.git`  and `cd dashy`
- Install dependencies: `yarn`
- Start dev server: `yarn dev`

Note that although recommended, it is not required to use the conf.yml file- all settings can be specified through the UI, and backed up on the cloud.

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

**Example Configs**: https://gist.github.com/Lissy93/000f712a5ce98f212817d20bc16bab10

**`pageInfo`**
- `title` - String: The page title and heading
- `description` - String: Short description visible under the heading
- `navLinks` - Array: Links to display in the nav bar, an array or objects containing a title and link:
  - `title` - String: Text to display
  - `path` - String: URL or relative link
- `footerText` - String: Text to display in the footer

**`appConfig`** _(optional)_
- `backgroundImg` - String: Path to an optional full-screen app background image. This can be either remote (http) or local (/). Note that this will slow down initial load
- `enableFontAwesome` - Boolean: Where `true` is enabled, if left blank font-awesome will be enabled only if required by 1 or more icons
- `fontAwesomeKey` - String: If you have a font-awesome key, then you can use it here and make use of premium icons. It is a 10-digit alpha-numeric string from you're FA kit URL  (e.g. `13014ae648`)
- `customCss` - String: Raw CSS that will be applied to the page. Please minify it first.
- `theme`- String: The default theme for first load (you can change this later from the UI)
- `cssThemes` - String[]: An array of custom theme names which can be used in the theme switcher dropdown - _See **theming** below_
- `externalStyleSheet` - String or String[] - Either a URL to an external stylesheet or an array or URLs, which can be applied as themes within the UI

**`sections`** - Section[]: (required) An array of sections - _See **`section`** below_

**`section`**
- `name` - String: (required) The title of that section
- `items` - Item[]: (required) An array of items - _See **`item`** below_
- `displayData`: An object with the following fields (all optional)
  - `collapsed` - Boolean: If true, the section will  be collapsed initially (defaults to `false`) 
  - `color` - String: A custom accent color for the section, as a hex code or HTML color (e.g. `#fff`)
  - `customStyles` - String: Custom CSS properties that should be applied to that section, e.g. `border: 2px dashed #ff0000;`
  - `itemSize` - String: Specify the size for items within this group, either `small`, `medium` or `large`
  - `rows` - Int: Number of rows the section should span vertically, e.g. 2 (defaults to `1`)
  - `cols` - Int: Number of columns the section should span horizontally, e.g. 2 (defaults to `1`)
  - `layout` - Enum: `auto` or `grid`. If `grid` is selected, then the number of items per row can be set
  - `itemCountX` - Int: Number of items horizontally (for `layout: grid`)
  - `itemCountY` - Int: Number of items vertically (for `layout: grid`)

Note about `rows` and `cols`: These are defined as a proportion of the screen (rather than by number of child items), and is built using [`grid-layout`](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout). For more info, see [this example](https://i.ibb.co/HXRWVRK/how-rows-and-cols-work-in-dashy.png). In order to set the number of items that will display horizontally or vertically within a section, first set `display: grid`, and then specify values for `itemCountX`, and optionally `itemCountY`.

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
### Roadmap 🛣

- [ ] Allow users to import / export configuration through the UI
- [ ] Improve deployment process (with a one-liner Docker run command)
- [ ] Add support for custom widgets
- [ ] Convert JavaScript to TypeScript

### Alternatives 🙌

There are a few self-hosted web apps, that serve a similar purpose to Dashy. Including, but not limited to: [HomeDash2](https://lamarios.github.io/Homedash2), [Homer](https://github.com/bastienwirtz/homer) (`Apache License 2.0`), [Organizr](https://organizr.app/) (`GPL-3.0 License`) and  [Heimdall](https://github.com/linuxserver/Heimdall) (`MIT License`).

### Credits 🏆

This wouldn't have been quite so possible without the following components, kudos to their respective authors
- [`vue-select`](https://github.com/sagalbot/vue-select) - Dropdown component by @sagalbot `MIT`
- [`vue-js-modal`](https://github.com/euvl/vue-js-modal) - Modal component by @euvl `MIT`
- [`v-tooltip`](https://github.com/Akryum/v-tooltip) - Tooltip component by @Akryum `MIT`
- [`vue-material-tabs`](https://github.com/jairoblatt/vue-material-tabs) - Tab view component by @jairoblatt `MIT`
- [`VJsoneditor`](https://github.com/yansenlei/VJsoneditor) - Interactive JSON editor component by @yansenlei `MIT`
  - Forked from [`JsonEditor`](https://github.com/josdejong/jsoneditor) by @josdejong `Apache-2.0 License`
  - Using [`ajv`](https://github.com/ajv-validator/ajv) `MIT` JSON schema Validator and [`ace`](https://github.com/ajaxorg/ace) `BSD` code editor
- [`vue-toasted`](https://github.com/shakee93/vue-toasted) - Toast notification component by @shakee93 `MIT`

Utils:
- [`crypto-js`](https://github.com/brix/crypto-js) - Encryption implementations by @evanvosberg and community `MIT`
- [`axios`](https://github.com/axios/axios) - Promise based HTTP client by @mzabriskie and community `MIT`

And the app itself is built with [Vue.js](https://github.com/vuejs/vue) ![vue-logo](https://i.ibb.co/xqKW6h5/vue-logo.png)

Although the app is purely frontend, there is an optional cloud backup and restore feature. This is built as a serverless function on [Cloudflare workers](https://workers.cloudflare.com/) using [KV](https://developers.cloudflare.com/workers/runtime-apis/kv) and [web crypto](https://developers.cloudflare.com/workers/runtime-apis/web-crypto)

### License 📜

```
Copyright © 2021 Alicia Sykes <https://aliciasykes.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this
software and associated documentation files (the “Software”), to deal in the Software
without restriction, including without limitation the rights to use, copy, modify, merge,
publish, distribute, sublicense, and/or sell copies of the Software, and to permit
persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or
substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWAREOR THE USE
OR OTHER DEALINGS IN THE SOFTWARE.
```

---

<a href="https://www.producthunt.com/posts/dashy" target="_blank" align="center"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=294872&theme=dark" alt="Dashy - A feature-rich dashboard for your homelab 🚀 | Product Hunt" width="250" height="54" /></a>
