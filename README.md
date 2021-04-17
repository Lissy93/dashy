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

This is where all site configuration is stored


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