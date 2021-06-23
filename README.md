
<h1 align="center">Dashy</h1>
<p align="center"><i>Dashy helps you organize your self-hosted services, by making them all accessible from a single place</i></p>

<p align="center">
  <img width="220" src="https://i.ibb.co/yhbt6CY/dashy.png" />
</p>

[![Awesome Self-Hosted](https://cdn.rawgit.com/sindresorhus/awesome/d7305f38d29fed78fa85652e3a63e154dd8e8829/media/badge.svg)](https://github.com/awesome-selfhosted/awesome-selfhosted#personal-dashboards)
![Docker Pulls](https://img.shields.io/docker/pulls/lissy93/dashy?logo=docker&style=flat-square)
![Stars](https://flat.badgen.net/github/stars/lissy93/dashy?icon=github)
![Current Version](https://img.shields.io/github/package-json/v/lissy93/dashy?style=flat-square&logo=azurepipelines&color=00af87)
![GitHub Status](https://flat.badgen.net/github/status/lissy93/dashy?icon=github)
![App Size](https://img.shields.io/github/languages/code-size/lissy93/dashy?style=flat-square)
![Code Quality](https://app.codacy.com/project/badge/Grade/3be23a4a3a8a4689bd47745b201ecb74)
![Dependencies](https://img.shields.io/david/lissy93/dashy?style=flat-square)

## Features 🌈

- Instant search by name, domain and tags - just start typing
- Full keyboard shortcuts for navigation, searching and launching
- Multiple color themes, with easy method for adding more
- Customizable layout options, and item sizes
- Quickly preview a website, by holding down the Alt key while clicking, to open it in a resizable pop-up modal
- Many options for icons, including full Font-Awesome support and the ability to auto-fetch icon from URLs favicon
- Option to show service status for each of your apps / links, for basic availability and uptime monitoring
- Additional info for each item visible on hover (including opening method icon and description as a tooltip)
- Option for full-screen background image, custom nav-bar links, and custom footer text
- Encrypted cloud backup and restore feature available
- Optional authentication, requiring user to log in
- Easy single-file YAML-based configuration
- Small bundle size, fully responsive UI and PWA makes the app easy to use on any device
- Plus lots more...

**Live Demos**: [Demo 1](https://dashy-demo-1.as93.net) ┆ [Demo 2](https://dashy-demo-2.as93.net) ┆ [Demo 3](https://dashy-demo-3.as93.net)

**Spin up your own demo**: [![One-Click Deploy with PWD](https://img.shields.io/badge/Play--with--Docker-Deploy-2496ed?style=flat-square&logo=docker)](https://labs.play-with-docker.com/?stack=https://raw.githubusercontent.com/Lissy93/dashy/master/docker-compose.yml)

**Screenshots**
![Screenshots](https://i.ibb.co/r5T3MwM/dashy-screenshots.png)

**Recording**
<p align="center">
  <img width="800" src="https://i.ibb.co/L8YbNNc/dashy-demo2.gif" alt="Demo">
</p>

**[⬆️ Back to Top](#dashy)**

---

## Getting Started 🛫

> For full setup instructions, see: [**Deployment**](./docs/deployment.md)

#### Deploying from Docker Hub 🐳

You will need [Docker](https://docs.docker.com/get-docker/) installed on your system

```
docker run -p 8080:80 lissy93/dashy
```

Or

```docker
docker run -d \
  -p 4000:80 \
  -v /root/my-local-conf.yml:/app/public/conf.yml \
  --name my-dashboard \
  --restart=always \
  lissy93/dashy:latest
```
Healthchecks are pre-configured to monitor the uptime and response times of Dashy, and the status of which can be seen in the container logs, e.g. `docker inspect --format "{{json .State.Health }}" [container-id]`.

#### Deploying from Source 🚀

You will need both [git](https://git-scm.com/downloads) and the latest or LTS version of [Node.js](https://nodejs.org/) installed on your system

- Get Code: `git clone git@github.com:Lissy93/dashy.git` and `cd dashy`
- Configuration: Fill in you're settings in `./public/conf.yml`
- Install dependencies: `yarn`
- Build: `yarn build`
- Run: `yarn start`

#### Deploy to the Cloud

Dashy supports 1-Click deployments on several popular cloud platforms (with more on the way!). To get started, just click a link below:
- [Deploy to Netlify](https://app.netlify.com/start/deploy?repository=https://github.com/lissy93/dashy)
- [Deploy to Heroku](https://heroku.com/deploy?template=https://github.com/Lissy93/dashy)
- [Deploy with Vercel](https://vercel.com/new/project?template=https://github.com/lissy93/dashy)
- [Deploy with PWD](https://labs.play-with-docker.com/?stack=https://raw.githubusercontent.com/Lissy93/dashy/master/docker-compose.yml)

**[⬆️ Back to Top](#dashy)**

#### Basic Commands

The following commands can be run on Dashy. If you are using Docker, than precede each command with `docker exec -it [container-id]`, where container id can be found by running `docker ps`, e.g. `docker exec -it 92490c12baff yarn build`.
If you prefer [`NPM`](https://docs.npmjs.com), then just replace `yarn` with `npm run` in the following commands.

- `yarn build` - Builds the project for production, and outputs it into `./dist`
- `yarn start` - Starts a web server, and serves up the production site from `./dist`
- `yarn validate-config` - Parses and validates your `conf.yml` against Dashy's [schema](https://github.com/Lissy93/dashy/blob/master/src/utils/ConfigSchema.json)
- `yarn health-check` - Checks the health and status of Dashy's Node server
- `yarn pm2-start` - Starts the app using the [PM2](https://pm2.keymetrics.io/) process manager
- `yarn dev` - Starts the development server with hot reloading, linting, testing and verbose messaging
- `yarn lint` - Lints code to ensure it follows a consistent neat style
- `yarn test` - Runs tests, and outputs results
- `yarn install` - Install all dependencies

---

## Configuring 🔧

> For full configuration documentation, see: [**Configuring**](./docs/configuring.md)

Dashy is configured with a single [YAML](https://yaml.org/) file, located at `./public/conf.yml` (or `./app/public/conf.yml` for Docker). Any other optional user-customizable assets are also located in the `./public/` directory, e.g. `favicon.ico`, `manifest.json`, `robots.txt` and `web-icons/*`. If you are using Docker, the easiest way to method is to mount a Docker volume (e.g. `-v /root/my-local-conf.yml:/app/public/conf.yml`)

In the production environment, the app needs to be rebuilt in order for changes to take effect. This should happen automatically, but can also be triggered by running `yarn build`, or `docker exec -it [container-id] yarn build` if you are using Docker (where container ID can be found by running `docker ps`).

You can check that your config matches Dashy's [schema](https://github.com/Lissy93/dashy/blob/master/src/utils/ConfigSchema.json) before deploying, by running `yarn validate-config.`

It is now possible to update Dashy's config directly through the UI, and have changes written to disk. You can disable this feature by setting: `appConfig.allowConfigEdit: false`. If you are using users within Dashy, then you need to be logged in to a user of `type: admin` in order to modify the configuration globally. You can also trigger a rebuild of the app through the UI (Settings --> Rebuild). The current theme, and other visual preferences are only stored locally, unless otherwise specified in the config file. The option to only apply config changes locally is still available, and can be used in conjunction with the cloud backup feature to sync data between instances. 

You may find these [example config](https://gist.github.com/Lissy93/000f712a5ce98f212817d20bc16bab10) helpful for getting you started

**[⬆️ Back to Top](#dashy)**

---

## Theming 🎨

> For full theming documentation, see: [**Theming**](./docs/theming.md)

<p align="center">
  <a href="https://i.ibb.co/BVSHV1v/dashy-themes-slideshow.gif">
    <img alt="Example Themes" src="/docs/assets/theme-slideshow.gif" width="400">
  </a>
</p>

The app comes with a number of built-in themes, but it's also easy to write you're own. All colors, and most other CSS properties make use of CSS variables, which makes customizing the look and feel of Dashy very easy.

You can also apply custom CSS overrides directly through the UI (Under Config menu --> Custom CSS), or specify it in your config file under `appConfig.customCss`. If you have a lot of custom styles, you can pass in the path to a stylesheet, in `appConfig.externalStyleSheet`.

**[⬆️ Back to Top](#dashy)**

---

## Icons 🧸

> For full iconography documentation, see: [**Icons**](./docs/icons.md)

Both sections and items can have an icon associated with them, and defined under the `icon` attribute. There are many options for icons, including Font Awesome support, automatic fetching from favicon, programmatically generated icons and direct local or remote URLs.

<p align="center">
  <img width="400" src="https://i.ibb.co/GTVmZnc/dashy-example-icons.png" />
</p>

- **Favicon**: Set `icon: favicon` to fetch a services icon automatically from the URL of the corresponding application
- **Font-Awesome**: To use any font-awesome icon, specify the category, followed by the icon name, e.g. `fas fa-rocket` or `fab fa-monero`. You can also use Pro icons if you have a license key, just set it under `appConfig.fontAwesomeKey`
- **Generative**: Setting `icon: generative`, will generate a unique for a given service, based on it's URL or IP
- **URL**: You can also pass in a URL to an icon asset, hosted either locally or using any CDN service. E.g. `icon: https://i.ibb.co/710B3Yc/space-invader-x256.png`.
- **Local Image**: To use a local image, store it in `./public/item-icons/` (or create a volume in Docker: `-v /local/image/directory:/app/public/item-icons/`) , and reference it by name and extension - e.g. set `icon: image.png` to use `./public/item-icon/image.png`. You can also use sub-folders here if you have a lot of icons, to keep them organized.

**[⬆️ Back to Top](#dashy)**

---

## Cloud Backup & Sync ☁

> For full backup documentation, see: [**Cloud Backup & Sync**](./docs/backup-restore.md)

Dashy has an **optional** built-in feature for securely backing up your config to a hosted cloud service, and then restoring it on another instance. This feature is totally optional, and if you do not enable it, then Dashy will not make any external network requests.

This is useful not only for backing up your configuration off-site, but it also enables Dashy to be used without having write a YAML config file, and makes it possible to use a public hosted instance, without the need to self-host.

All data is encrypted before being sent to the backend. In Dashy, this is done in [`CloudBackup.js`](https://github.com/Lissy93/dashy/blob/master/src/utils/CloudBackup.js), using [crypto.js](https://github.com/brix/crypto-js)'s AES method, using the users chosen password as the key. The data is then sent to a [Cloudflare worker](https://developers.cloudflare.com/workers/learning/how-workers-works) (a platform for running serverless functions), and stored in a [KV](https://developers.cloudflare.com/workers/learning/how-kv-works) data store.

**[⬆️ Back to Top](#dashy)**

---

## Authentication 💂

> For full authentication documentation, see: [**Authentication**](./docs/authentication.md)

Dashy has a built-in login feature, which can be used for basic access control. To enable this feature, add an `auth` attribute under `appConfig`, containing an array of users, each with a username, SHA-256 hashed password and optional user type.

```yaml
appConfig:
  auth:
    - user: alicia
      hash: 4D1E58C90B3B94BCAD9848ECCACD6D2A8C9FBC5CA913304BBA5CDEAB36FEEFA3
```
At present, access control is handled on the frontend, and therefore in security-critical situations, it is recommended to use an alternate method for authentication, such as [Authelia](https://www.authelia.com/), a VPN or web server and firewall rules.

**[⬆️ Back to Top](#dashy)**

---

## Status Indicators 🚦

> For full monitoring documentation, see: [**Status Indicators**](./docs/status-indicators.md)

Dashy has an optional feature that can display a small icon ([like this](./docs/assets/status-check-demo.gif)) next to each of your running services, indicating it's current status. This is useful if you are using Dashy as your homelab's start page, as it gives you an overview of the health of each of your running services. Hovering over the indicator will show additional information, including average response time and an error message for services which are down.

By default, this feature is off, but you can enable it globally by setting `appConfig.statusCheck: true`, or enable/ disable it for an individual item, with `item[n].statusCheck`. You can also specify an time interval in seconds under `appConfig.statusCheckInterval`, which will determine how often to recheck services, if this value is `0`, then status is only checked on initial page load, this is default behavior.

**[⬆️ Back to Top](#dashy)**

---

## Developing 🧱

> For full development documentation, see: [**Developing**](./docs/developing.md)

1. Get Code: `git clone git@github.com:Lissy93/dashy.git`  and `cd dashy`
2. Install dependencies: `yarn`
3. Start dev server: `yarn dev`

Hot reload is enabled, so changes will be detected automatically, triggering the app to be rebuilt and refreshed. Ensure that all lint checks and tests are passing before pushing an code or deploying the app.

If you are new to Vue.js or web development and want to learn more, [here are some resources](docs/developing.md#resources-for-beginners) to help get you started. Dashy is a pretty straight-forward application, so would make an ideal candidate for your first PR!

**[⬆️ Back to Top](#dashy)**

---

## Contributing 😇

> For full contributing guide, see: [**Contributing**](/docs/contributing.md)

Pull requests are welcome, and would by much appreciated!

Some ideas for PRs include: bug fixes, improve the docs, add new themes, implement a new widget, add or improve the display options, improve or refactor the code, or implement a new feature.

Before you submit your pull request, please ensure the following:
- Must be backwards compatible
- All lint checks and tests must pass
- If a new option in the the config file is added, it needs to be added into the [schema](https://github.com/Lissy93/dashy/blob/master/src/utils/ConfigSchema.json), and documented in the [configuring](https://github.com/Lissy93/dashy/blob/master/docs/configuring.md) guide
- If a new dependency is required, it must be essential, and it must be thoroughly checked out for security or efficiency issues
- Your pull request will need to be up-to-date with master, and the PR template must be filled in

### Repo Status
![Open Issues](https://flat.badgen.net/github/open-issues/lissy93/dashy?icon=github)
![Closed Issues](https://flat.badgen.net/github/closed-issues/lissy93/dashy?icon=github)
![Open PRs](https://flat.badgen.net/github/open-prs/lissy93/dashy?icon=github)
![Total PRs](https://flat.badgen.net/github/prs/lissy93/dashy?icon=github)
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/lissy93/dashy?style=flat-square)
![Last Commit](https://flat.badgen.net/github/last-commit/lissy93/dashy?icon=github)
![Contributors](https://flat.badgen.net/github/contributors/lissy93/dashy?icon=github)
![GitHub Status](https://flat.badgen.net/github/status/lissy93/dashy?icon=github)
![Stars](https://flat.badgen.net/github/stars/lissy93/dashy?icon=github)
![Docker Pulls](https://img.shields.io/docker/pulls/lissy93/dashy?logo=docker&style=flat-square)
![Total Lines](https://img.shields.io/tokei/lines/github/lissy93/dashy?style=flat-square)
![Maintenance](https://img.shields.io/maintenance/yes/2021?style=flat-square)

**[⬆️ Back to Top](#dashy)**

---

## Support 🙋‍♀️

> For general discussions, the [Discussions Board](https://github.com/Lissy93/dashy/discussions) is now active!

If you've found a bug, or something that isn't working as you'd expect, please raise an issue, so that it can be resolved. Similarly, if you're having trouble getting things up and running, feel free to ask a question. Feature requests and feedback are also welcome, as it helps Dashy improve. 

- [Raise a Bug 🐛](https://github.com/Lissy93/dashy/issues/new?assignees=Lissy93&labels=%F0%9F%90%9B+Bug&template=bug-report---.md&title=%5BBUG%5D)
- [Submit a Feature Request 🦄](https://github.com/Lissy93/dashy/issues/new?assignees=Lissy93&labels=%F0%9F%A6%84+Feature+Request&template=feature-request---.md&title=%5BFEATURE_REQUEST%5D)
- [Ask a Question 🤷‍♀️](https://github.com/Lissy93/dashy/issues/new?assignees=Lissy93&labels=%F0%9F%A4%B7%E2%80%8D%E2%99%82%EF%B8%8F+Question&template=question------.md&title=%5BQUESTION%5D)
- [Share Feedback 🌈](https://github.com/Lissy93/dashy/issues/new?assignees=&labels=%F0%9F%8C%88+Feedback&template=share-feedback---.md&title=%5BFEEDBACK%5D)

For more general questions about any of the technologies used, [StackOverflow](https://stackoverflow.com/questions/) may be more helpful first port of info

 If you need to get in touch securely with the author (me, Alicia Sykes), drop me a message at:
- **Email**: `alicia at omg dot lol`
- **Public Key** [`0688 F8D3 4587 D954 E9E5  1FB8 FEDB 68F5 5C02 83A7`](https://keybase.io/aliciasykes/pgp_keys.asc?fingerprint=0688f8d34587d954e9e51fb8fedb68f55c0283a7)

**[⬆️ Back to Top](#dashy)**

---

## Documentation 📘

- [Getting Started](/docs/deployment.md)
- [Configuring](/docs/configuring.md)
- [Developing](/docs/developing.md)
- [Contributing](/docs/contributing.md)
- [User Guide](/docs/user-guide.md)
- [Troubleshooting](/docs/troubleshooting.md)
- [Backup & Restore](/docs/backup-restore.md)
- [Theming](/docs/theming.md)
- [Icons](/docs/icons.md)
- [Authentication](/docs/authentication.md)

**[⬆️ Back to Top](#dashy)**

---

## Credits 🏆

### Contributors 👥

![Auto-generated contributors](https://raw.githubusercontent.com/Lissy93/dashy/master/docs/assets/CONTRIBUTORS.svg)

### Dependencies 🔗

This app definitely wouldn't have been quite so possible without the making use of the following package and components. Full credit and big kudos to their respective authors, who've done an amazing job in building and maintaining them.

##### Core
At it's core, the application uses [Vue.js](https://github.com/vuejs/vue), as well as it's services. Styling is done with [SCSS](https://github.com/sass/sass), JavaScript is currently [Babel](https://github.com/babel/babel), (but I am in the process of converting to [TypeScript](https://github.com/Microsoft/TypeScript)), linting is done with [ESLint](https://github.com/eslint/eslint), the config is defined in [YAML](https://github.com/yaml/yaml), and there is a simple [Node.js](https://github.com/nodejs/node) server to serve up the static app.

##### Frontend Components
- [`vue-select`](https://github.com/sagalbot/vue-select) - Dropdown component by @sagalbot `MIT`
- [`vue-js-modal`](https://github.com/euvl/vue-js-modal) - Modal component by @euvl `MIT`
- [`v-tooltip`](https://github.com/Akryum/v-tooltip) - Tooltip component by @Akryum `MIT`
- [`vue-material-tabs`](https://github.com/jairoblatt/vue-material-tabs) - Tab view component by @jairoblatt `MIT`
- [`VJsoneditor`](https://github.com/yansenlei/VJsoneditor) - Interactive JSON editor component by @yansenlei `MIT`
  - Forked from [`JsonEditor`](https://github.com/josdejong/jsoneditor) by @josdejong `Apache-2.0 License`
- [`vue-toasted`](https://github.com/shakee93/vue-toasted) - Toast notification component by @shakee93 `MIT`
- [`vue-prism-editor`](https://github.com/koca/vue-prism-editor) - Lightweight code editor by @koca `MIT`
  - Forked from [`prism.js`](https://github.com/PrismJS/prism) `MIT`

##### Utilities
- [`crypto-js`](https://github.com/brix/crypto-js) - Encryption implementations by @evanvosberg and community `MIT`
- [`axios`](https://github.com/axios/axios) - Promise based HTTP client by @mzabriskie and community `MIT`
- [`ajv`](https://github.com/ajv-validator/ajv) - JSON schema Validator by @epoberezkin and community `MIT`

##### Backup & Sync Server
Although the app is purely frontend, there is an optional cloud backup and restore feature. This is built as a serverless function on [Cloudflare workers](https://workers.cloudflare.com/) using [KV](https://developers.cloudflare.com/workers/runtime-apis/kv) and [web crypto](https://developers.cloudflare.com/workers/runtime-apis/web-crypto)

##### External Services
The 1-Click deploy demo uses [Play-with-Docker Labs](https://play-with-docker.com/). Code is hosted on [GitHub](https://github.com), Docker image is hosted on [DockerHub](https://hub.docker.com/), and the demos are hosted on [Netlify](https://www.netlify.com/).

### Alternatives 🙌

There are a few self-hosted web apps, that serve a similar purpose to Dashy. If you're looking for a dashboard, and Dashy doesn't meet your needs, I highly recommend you check these projects out! Including, but not limited to: [HomeDash2](https://lamarios.github.io/Homedash2), [Homer](https://github.com/bastienwirtz/homer) (`Apache License 2.0`), [Organizr](https://organizr.app/) (`GPL-3.0 License`) and  [Heimdall](https://github.com/linuxserver/Heimdall) (`MIT License`)

**[⬆️ Back to Top](#dashy)**

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

**TDLR;** _You can do whatever you like with Dashy: use it in private or commercial settings,_
_redistribute and modify it. But you must display this license and credit the author._
_There is no warranty that this app will work as expected, and the author cannot be held_
_liable for anything that goes wrong._ For more info, see
[TLDR Legal's MIT Explanation of the MIT License](https://tldrlegal.com/license/mit-license)

![Octocat](https://github.githubassets.com/images/icons/emoji/octocat.png?v8)

**[⬆️ Back to Top](#dashy)**

---

<a href="https://www.producthunt.com/posts/dashy" target="_blank" align="center"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=294872&theme=dark" alt="Dashy - A feature-rich dashboard for your homelab 🚀 | Product Hunt" width="250" height="54" /></a>
