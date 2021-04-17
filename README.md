# Server Landing Page

> A static site linking to all running services for networking, management and monitoring

---

## Running the App

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

### Config Locations

Configuration files are located in `./public/`.
- `./public/conf.yml` - This is the main site configuration file, and is required for the app to work
- `./public/item-icons` - If you're using custom icons for your items, then store these here. You can use sub-folders to keep things organised
- `./public/logo.png` - Optionally add a logo image for you're website, which will show in the top left

Also within `./public` you'll find normal website assets, including `favicon.ico`, `manifest.json`, `robots.txt` and `web-icons/*`. There's no need to modify these, but you can do so if you wish.

### The conf.yml File

This is where all site configuration is stored in [YAML Format](https://yaml.org/), and is located in `./public/conf.yml`

**`pageInfo`**
- `title` - String: The page title and heading
- `description` - String: Short description visible under the heading

**`appConfig`**
- `theme`- String: The default theme for first load
- `cssThemes` - String[]: An array of theme names which can be used in the theme switcher dropdown
- `externalStyleSheet` - String or String[] - Either a URL to an external stylesheet or an array or URLs, which can be applied as themes within the UI

**`sections`** - Section[]: (required) An array of sections - *See **`section`** below*

**`section`**
- `name` - String: (required) The title of that section
- `items` - Item[]: (required) An array of items - *See **`item`** below*
- `displayData`: An object with the following fields (all optional)
  - `collapsed` - Boolean: If true, the section will  be collapsed (defaults to `false`) 
  - `rows` - Int: Number of rows the section should span vertically, e.g. 2 (defaults to `1`)
  - `cols` - Int: Number of columns the section should span horizontally, e.g. 2 (defaults to `1`)
  - `color` - String: A custom background color for the section, as a hex code or HTML color
  - `customStyles` - String: Custom CSS properties that should be applied to that section, separated by semicolon

**`item`**
- `title` - String: The text to display on the item
- `description` - String: Additional info which is shown in the tooltip on hover
- `icon` - String: The icon for the tile, *see below for more info*
- `url` - String: The full path to be opened on click (e.g. https://example.com)
- `target` - String: The method in which the item will be opened, either `newtab`, `sametab` or `iframe`
- `color` - String: A custom background color the the item, as a hex code or HTML color

---

## License 📜

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