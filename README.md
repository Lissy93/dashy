
<h1 align="center">Dashy</h1>
<p align="center"><i>Dashy helps you organize your self-hosted services, by making them all accessible from a single place</i></p>

<p align="center">
  <img src="https://app.codacy.com/project/badge/Grade/3be23a4a3a8a4689bd47745b201ecb74" /> <img src="https://img.shields.io/github/issues/lissy93/dashy?style=flat-square" /> <img src="https://img.shields.io/github/languages/code-size/lissy93/dashy?style=flat-square" /> <img src="https://img.shields.io/tokei/lines/github/lissy93/dashy?style=flat-square" /> 
</p>

<p align="center">
  <img width="220" src="https://i.ibb.co/yhbt6CY/dashy.png" />
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

---

## Running the App 🏃‍♂️

> For full setup instructions, see: [**Getting Started**](./docs/getting-started.md)
#### Deploying from Docker Hub 🐳

You will need [Docker](https://docs.docker.com/get-docker/) installed on your system

```docker
docker run -d \
  -p 8080:80 \
  -v /root/my-local-conf.yml:/app/public/conf.yml \
  --name my-dashboard \
  --restart=always \
  lissy93/dashy:latest
```
After making changes to your configuration file, you will need to run: `docker exec -it [container-id] yarn build` to rebuild. You can also run other commands, such as `yarn validate-config` this way too. Container ID can be found by running `docker ps`. 

#### Deploying from Source 🚀

You will need both [git](https://git-scm.com/downloads) and the latest or LTS version of [Node.js](https://nodejs.org/) installed on your system

- Get Code: `git clone git@github.com:Lissy93/dashy.git` and `cd dashy`
- Configuration: Fill in you're settings in `./public/conf.yml`
- Install dependencies: `yarn`
- Build: `yarn build`
- Run: `yarn start`

After making changes to your configuration file, you will need to run: `yarn build` to rebuild. 

---

## Configuring 🔧

> For full configuration documentation, see: [**Configuring**](./docs/configuring.md)

Dashy is configured with a single [YAML](https://yaml.org/) file, located at `./public/conf.yml` (or `./app/public/conf.yml` for Docker). Any other optional user-customizable assets are also located in the `./public/` directory, e.g. `favicon.ico`, `manifest.json`, `robots.txt` and `web-icons/*`. If you are using Docker, the easiest way to method is to mount a Docker volume (e.g. `-v /root/my-local-conf.yml:/app/public/conf.yml`)

In the production environment, the app needs to be rebuilt in order for changes to take effect. This can be done with `yarn build`, or `docker exec -it [container-id] yarn build` if you are using Docker (where container ID can be found by running `docker ps`). You can check that your config matches Dashy's [schema](https://github.com/Lissy93/dashy/blob/master/src/utils/ConfigSchema.json) before deploying, by running `yarn validate-config.`

You may find these [example config](https://gist.github.com/Lissy93/000f712a5ce98f212817d20bc16bab10) helpful for getting you started

---

## Theming 🎨

> For full configuration documentation, see: [**Theming**](./docs/theming.md)

<p align="right"><img src="https://i.ibb.co/BVSHV1v/dashy-themes-slideshow.gif" width="400"></p>

The app comes with a number of built-in themes, but it's also easy to write you're own. All colors, and most other CSS properties make use of CSS variables, which makes customizing the look and feel of Dashy very easy.

You can also apply custom CSS overrides directly through the UI (Under Config menu --> Custom CSS), or specify it in your config file under `appConfig.customCss`. If you have a lot of custom styles, you can pass in the path to a stylesheet, in `appConfig.externalStyleSheet`.

---

## Cloud Backup & Sync ☁

> For full documentation, see: [**Cloud Backup & Sync**](./docs/backup-restore.md)

Dashy has an **optional** built-in feature for securely backing up your config to a hosted cloud service, and then restoring it on another instance. This feature is totally optional, and if you do not enable it, then Dashy will not make any external network requests.

This is useful not only for backing up your configuration off-site, but it also enables Dashy to be used without having write a YAML config file, and makes it possible to use a public hosted instance, without the need to self-host.

All data is encrypted before being sent to the backend. In Dashy, this is done in [`CloudBackup.js`](https://github.com/Lissy93/dashy/blob/master/src/utils/CloudBackup.js), using [crypto.js](https://github.com/brix/crypto-js)'s AES method, using the users chosen password as the key. The data is then sent to a [Cloudflare worker](https://developers.cloudflare.com/workers/learning/how-workers-works) (a platform for running serverless functions), and stored in a [KV](https://developers.cloudflare.com/workers/learning/how-kv-works) data store.

---

## Developing 🧱

> For full development documentation, see: [**Developing**](./docs/developing.md)

1. Get Code: `git clone git@github.com:Lissy93/dashy.git`  and `cd dashy`
2. Install dependencies: `yarn`
3. Start dev server: `yarn dev`

Hot reload is enabled, so changes will be detected automatically, triggering the app to be rebuilt and refreshed. Ensure that all lint checks and tests are passing before pushing an code or deploying the app.

If you are new to Vue.js or web development and want to learn more, [here are some resources](docs/developing.md#resources-for-beginners) to help get you started. Dashy is a pretty straight-forward application, so would make an ideal candidate for your first PR!

---
## Notes ✏

### Alternatives 🙌

There are a few self-hosted web apps, that serve a similar purpose to Dashy. If you're looking for a dashboard, and Dashy doesn't meet your needs, I highly recommend you check these projects out! Including, but not limited to: [HomeDash2](https://lamarios.github.io/Homedash2), [Homer](https://github.com/bastienwirtz/homer) (`Apache License 2.0`), [Organizr](https://organizr.app/) (`GPL-3.0 License`) and  [Heimdall](https://github.com/linuxserver/Heimdall) (`MIT License`)

### Credits 🏆

This app definitely wouldn't have been quite so possible without the making use of the following package and components. Full credit and big kudos to their respective authors, who've done an amazing job in building and maintaining them.

#### Core
At it's core, the application uses [Vue.js](https://github.com/vuejs/vue), as well as it's services. Styling is done with [SCSS](https://github.com/sass/sass), JavaScript is currently [Babel](https://github.com/babel/babel), (but I am in the process of converting to [TypeScript](https://github.com/Microsoft/TypeScript)), linting is done with [ESLint](https://github.com/eslint/eslint), the config is defined in [YAML](https://github.com/yaml/yaml), and there is a simple [Node.js](https://github.com/nodejs/node) server to serve up the static app.

#### Frontend Components
- [`vue-select`](https://github.com/sagalbot/vue-select) - Dropdown component by @sagalbot `MIT`
- [`vue-js-modal`](https://github.com/euvl/vue-js-modal) - Modal component by @euvl `MIT`
- [`v-tooltip`](https://github.com/Akryum/v-tooltip) - Tooltip component by @Akryum `MIT`
- [`vue-material-tabs`](https://github.com/jairoblatt/vue-material-tabs) - Tab view component by @jairoblatt `MIT`
- [`VJsoneditor`](https://github.com/yansenlei/VJsoneditor) - Interactive JSON editor component by @yansenlei `MIT`
  - Forked from [`JsonEditor`](https://github.com/josdejong/jsoneditor) by @josdejong `Apache-2.0 License`
- [`vue-toasted`](https://github.com/shakee93/vue-toasted) - Toast notification component by @shakee93 `MIT`
- [`vue-prism-editor`](https://github.com/koca/vue-prism-editor) - Lightweight code editor by @koca `MIT`
  - Forked from [`prism.js`](https://github.com/PrismJS/prism) `MIT`

#### Utilities
- [`crypto-js`](https://github.com/brix/crypto-js) - Encryption implementations by @evanvosberg and community `MIT`
- [`axios`](https://github.com/axios/axios) - Promise based HTTP client by @mzabriskie and community `MIT`
- [`ajv`](https://github.com/ajv-validator/ajv) - JSON schema Validator by @epoberezkin and community `MIT`

#### Backup & Sync Server
Although the app is purely frontend, there is an optional cloud backup and restore feature. This is built as a serverless function on [Cloudflare workers](https://workers.cloudflare.com/) using [KV](https://developers.cloudflare.com/workers/runtime-apis/kv) and [web crypto](https://developers.cloudflare.com/workers/runtime-apis/web-crypto)

---
## License 📜

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
