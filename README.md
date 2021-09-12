
<h1 align="center">Dashy</h1>
<p align="center">
  <i>Dashy helps you organize your self-hosted services, by making them all accessible from a single place</i>
   <br/>
  <img width="120" src="https://i.ibb.co/yhbt6CY/dashy.png" />
  <br/>
  <b><a href="https://github.com/Lissy93/dashy/blob/master/docs/showcase.md">User Showcase</a></b> | <b><a href="https://demo.dashy.to">Live Demo</a></b> | <b><a href="https://github.com/Lissy93/dashy/blob/master/docs/quick-start.md">Getting Started</a></b> | <b><a href="https://dashy.to/docs">Documentation</a></b> | <b><a href="https://github.com/Lissy93/dashy">GitHub</a></b>
  <br/><br/>
  <a href="https://github.com/awesome-selfhosted/awesome-selfhosted#personal-dashboards">
    <img src="https://cdn.rawgit.com/sindresorhus/awesome/d7305f38d29fed78fa85652e3a63e154dd8e8829/media/badge.svg" alt="Awesome Self-Hosted">
  </a>
  <a href="https://github.com/Lissy93/dashy/blob/master/LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-0aa8d2?logo=opensourceinitiative&logoColor=fff" alt="License MIT">
  </a>
  <a href="https://github.com/Lissy93/dashy/blob/master/.github/CHANGELOG.md">
    <img src="https://img.shields.io/github/package-json/v/lissy93/dashy?logo=azurepipelines&amp;color=0aa8d2" alt="Current Version">
  </a>
  <a href="https://hub.docker.com/r/lissy93/dashy">
    <img src="https://img.shields.io/docker/pulls/lissy93/dashy?logo=docker&color=0aa8d2&logoColor=fff" alt="Docker Pulls">
  </a>
  <a href="http://as93.link/dashy-build-status">
   <img src="https://badgen.net/github/status/lissy93/dashy?icon=github" alt="GitHub Status">
  </a>
  <a href="https://snyk.io/test/github/lissy93/dashy">
    <img src="https://snyk.io/test/github/lissy93/dashy/badge.svg" alt="Known Vulnerabilities">
  </a>
</p>

<details>
  <summary><b>Contents</b></summary>
  <p>
  
- **Getting Started**
  - [🌈 Features](#features-)
  - [⚡Demo](#demo-)
  - [🚀 Getting Started](#getting-started-)
  - [🔧 Configuring](#configuring-)
- **Feature Overview**
  - [🎨 Theming](#theming-)
  - [🧸 Icons](#icons-)
  - [🚦 Status Indicators](#status-indicators-)
  - [💂 Authentication](#authentication-)
  - [🖱️ Opening Methods](#opening-methods-%EF%B8%8F)
  - [👓 Alternate Views](#alternate-views-)
  - [🔎 Searching and Shortcuts](#searching-and-shortcuts-)
  - [⚙️ Config Editor](#config-editor-%EF%B8%8F)
  - [☁ Cloud Backup & Sync](#cloud-backup--sync-)
  - [🌎 Language Switching](#language-switching-)
  - [🌳 Dashboard Info](#setting-dashboard-info-)
- **Community**
  - [🙋‍♀️ Getting Help](#getting-help-%EF%B8%8F)
  - [🐛 Raising Issues](#raising-issues-)
  - [💖 Supporting Dashy](#supporting-dashy-)
  - [🏆 Credits](#credits-)
  - [🧱 Developing](#developing-)
  - [🗞️ Release Schedule](#release-schedule-)
  - [📘 Documentation](#documentation-)
  - [🛣️ Roadmap](#roadmap-)
  - [🙌 Alternatives](#alternatives-)
  - [📜 License](#license-)
    
  </p>
</details>

## Features 🌈

- 🔎 Instant search by name, domain and tags - just start typing + customizable keyboard shortcuts
- 🎨 Multiple built-in color themes, with UI color editor and support for custom CSS
- 🧸 Many options for icons, including Font-Awesome support, auto-fetching favicon, images and emojis
- 🚦 Service status feature for each of your apps / links, for basic availability and uptime monitoring
- 💂 Optional authentication with multi-user support, configurable privileges and SSO support
- ☁ Optional encrypted cloud backup and restore feature available
- 💼 A workspace view, for easily switching between multiple apps at once
- 🛩️ A minimal view, for use as a fast-loading browser startpage
- 🖱️ Choose how to launch apps, either new tab, same tab, a pop-up modal or in the workspace view
- 🌎 Multi-language support, with more languages being added regularly
- 📏 Customizable layout, sizes, text, component visibility, sort order, behavior etc
- 🖼️ Option for full-screen background image, custom nav-bar links, html footer, title, and more
- 🚀 Easy to setup with Docker, or on bare metal, or with 1-Click cloud deployment
- ⚙️ Easy single-file YAML-based configuration, with option to configure app directly through the UI
- 🤏 Small bundle size, fully responsive UI and PWA makes the app easy to use on any device
- ✨ Under active development with improvements and new features added regularly 
- 🆓 100% free and open source
- 🔐 Strong focus on privacy
- 🌈 Plus lots more...

## Demo ⚡

> For more examples of Dashy in action, see: [**The Showcase**](./docs/showcase.md)

#### Live Demos
[Demo 1](https://dashy-demo-1.as93.net) ┆ [Demo 2](https://dashy-demo-2.as93.net) ┆ [Demo 3](https://dashy-demo-3.as93.net)

#### Spin up your own Demo
- 1-Click Deploy: [![One-Click Deploy with PWD](https://img.shields.io/badge/Play--with--Docker-Deploy-2496ed?style=flat-square&logo=docker)](https://labs.play-with-docker.com/?stack=https://raw.githubusercontent.com/Lissy93/dashy/master/docker-compose.yml)
- Or on your own machine: `docker run -p 8080:80 lissy93/dashy`
  - See the [Quick Start Guide](./docs/quick-start.md) for getting Dashy up and running in under 5 minutes

#### Demo GIF
<p align="center">
  <img width="800" src="https://i.ibb.co/L8YbNNc/dashy-demo2.gif" alt="Demo" />
</p>

#### User Showcase
Are using Dashy? Want to share your dashboard here too - [Submit your Screenshots to the Showcase](./docs/showcase.md#submitting-your-dashboard)!

![Screenshots](https://i.ibb.co/r5T3MwM/dashy-screenshots.png)

**[⬆️ Back to Top](#dashy)**

---

## Getting Started 🛫

> For full setup instructions, see: [**Deployment**](./docs/deployment.md)

### Deploying from Docker Hub 🐳

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
[![Dashy on Docker Hub](https://dockeri.co/image/lissy93/dashy)](https://hub.docker.com/r/lissy93/dashy)

If you prefer to use Docker Compose, [here is an example](./docs/deployment.md#using-docker-compose).

Dashy is also available through GHCR, run: `docker pull ghcr.io/lissy93/dashy`.

To use Dashy on an system other than `amd64`, then use [one of these tags](https://hub.docker.com/r/lissy93/dashy/tags). There are containers for `arm32-7`, `arm64-v8` and a multi-architecture image.

The image defaults to `:latest`, but you can instead specify a specific version, e.g. `docker pull lissy93/dashy:release-1.5.0`

> Once you've got Dashy running, you can take a look at [App Management Docs](./docs/management.md), for info on using health checks, provisioning assets, configuring web servers, securing your app, logs, performance and more.

### Deploying from Source 🚀

You will need [git](https://git-scm.com/downloads), the latest or LTS version of [Node.js](https://nodejs.org/) and (optionally) [Yarn](https://yarnpkg.com/) installed on your system.

- Get Code: `git clone https://github.com/Lissy93/dashy.git` and `cd dashy`
- Configuration: Fill in you're settings in `./public/conf.yml`
- Install dependencies: `yarn`
- Build: `yarn build`
- Run: `yarn start`

> See docs [Full list of Dashy's commands](./docs/management.md#basic-commands)

### Deploy to the Cloud ☁️

Dashy supports 1-Click deployments on several popular cloud platforms. To spin up a new instance, just click a link below:
- [<img src="https://i.ibb.co/ZxtzrP3/netlify.png" width="18"/> Deploy to Netlify](https://app.netlify.com/start/deploy?repository=https://github.com/lissy93/dashy)
- [<img src="https://i.ibb.co/d2P1WZ7/heroku.png" width="18"/> Deploy to Heroku](https://heroku.com/deploy?template=https://github.com/Lissy93/dashy)
- [<img src="https://i.ibb.co/Ld2FZzb/vercel.png" width="18"/> Deploy to Vercel](https://vercel.com/new/project?template=https://github.com/lissy93/dashy)
- [<img src="https://i.ibb.co/xCHtzgh/render.png" width="18"/> Deploy to Render](https://render.com/deploy?repo=https://github.com/lissy93/dashy/tree/deploy_render)
- [<img src="https://i.ibb.co/J7MGymY/googlecloud.png" width="18"/> Deploy to GCP](https://deploy.cloud.run/?git_repo=https://github.com/lissy93/dashy.git)
- [<img src="https://i.ibb.co/HVWVYF7/docker.png" width="18"/> Deploy to PWD](https://labs.play-with-docker.com/?stack=https://raw.githubusercontent.com/Lissy93/dashy/master/docker-compose.yml)

> For more 1-click cloud deployments, see [Cloud Deployment](./docs/deployment.md#deploy-to-cloud-service)

**[⬆️ Back to Top](#dashy)**

---

## Configuring 🔧

> For full configuration documentation, see: [**Configuring**](./docs/configuring.md)

All of Dashy's configuration is specified in a single [YAML](https://yaml.org/) file, located at `./public/conf.yml`. You can find a complete list of available options in th [Configuring Docs](/docs/configuring.md). If you're using Docker, you'll probably want to pass this file in as a Docker volume (e.g. `-v /root/my-local-conf.yml:/app/public/conf.yml`).

The config can also be edited directly through the UI, with changes written to your conf.yml file. After making any modifications the app needs to be rebuilt, which will happen automatically or can be trigger with `yarn build` or directly through the UI.

You can check that your config is valid and matches Dashy's [schema](https://github.com/Lissy93/dashy/blob/master/src/utils/ConfigSchema.json), by running: `yarn validate-config`.

Finally, you may find these [example config](https://gist.github.com/Lissy93/000f712a5ce98f212817d20bc16bab10) helpful for getting you started.

**[⬆️ Back to Top](#dashy)**

---

## Theming 🎨

> For full theming documentation, see: [**Theming**](./docs/theming.md)

<p align="center">
  <a href="https://i.ibb.co/BVSHV1v/dashy-themes-slideshow.gif">
    <img alt="Example Themes" src="https://raw.githubusercontent.com/Lissy93/dashy/master/docs/assets/theme-slideshow.gif" width="400" />
  </a>
</p>

Dashy comes with a number of built-in themes, but it's also easy to make you're own. You can either use the color editor, or you're own custom CSS. All colors, and most other CSS properties are specified using CSS variables, which are [documented here](./docs/theming.md#css-variables), so customizing the look and feel of Dashy very easy. Learn more about adding your own theme in the [docs](https://github.com/Lissy93/dashy/blob/master/docs/theming.md#adding-your-own-theme).

<p align="center">
  <a href="https://i.ibb.co/cLDXj1R/dashy-theme-configurator.gif">
    <img alt="Example Themes" src="https://raw.githubusercontent.com/Lissy93/dashy/master/docs/assets/theme-config-demo.gif" width="400" />
  </a>
</p>

**[⬆️ Back to Top](#dashy)**

---

## Icons 🧸

> For full iconography documentation, see: [**Icons**](./docs/icons.md)

Both sections and items can have an icon associated with them, and defined under the `icon` attribute. There are many options for icons, including Font Awesome support, automatic fetching from favicon, emojis, programmatically generated icons and direct local or remote URLs.

<p align="center">
  <img width="400" src="https://i.ibb.co/GTVmZnc/dashy-example-icons.png" />
</p>

- **Favicon**: Set `icon: favicon` to fetch a services icon automatically from the URL of the corresponding application
- **Font-Awesome**: To use any font-awesome icon, specify the category, followed by the icon name, e.g. `fas fa-rocket` or `fab fa-monero`. You can also use Pro icons if you have a license key, just set it under `appConfig.fontAwesomeKey`
- **Simple Icons**: Use any brand/ logo icon from [simpleicons.org](https://simpleicons.org/) by setting the icon to `si-[icon-name]`
- **Emoji**: Use an emoji as a tile icon, by putting the emoji's code as the icon attribute. Emojis can be specified either as emojis (`🚀`), unicode (`'U+1F680'`) or shortcode (`':rocket:'`)
- **Generative**: Setting `icon: generative`, will generate a unique logo for a given service, based on it's specified URL or IP
- **URL**: You can also pass in a URL to an icon asset, hosted either locally or using any CDN service. E.g. `icon: https://i.ibb.co/710B3Yc/space-invader-x256.png`
- **Local Image**: To use a local image, store it in `./public/item-icons/` (or create a volume in Docker: `-v /local/image/directory:/app/public/item-icons/`) , and reference it by name and extension - e.g. set `icon: image.png` to use `./public/item-icon/image.png`. You can also use sub-folders here
- **Material Design Icons**: You can also use any icon from [materialdesignicons.com](https://dev.materialdesignicons.com/icons) by setting the icon to `mdi-[icon-name]`

**[⬆️ Back to Top](#dashy)**

---

## Status Indicators 🚦

> For full monitoring documentation, see: [**Status Indicators**](./docs/status-indicators.md)

Dashy has an optional feature that can display a small icon next to each of your running services, indicating it's current status. This is useful if you are using Dashy as your homelab's start page, as it gives you an overview of the health of each of your running services. Hovering over the indicator will show additional information, including average response time and an error message for services which are down.

By default, this feature is off, but you can enable it globally by setting `appConfig.statusCheck: true`, or enable/ disable it for an individual item, with `item[n].statusCheck`. 

You can also specify an time interval in seconds under `appConfig.statusCheckInterval`, between checks, if this value is `0`, then status is only checked on initial page load, which is the default behavior. Status checks use the `url` attribute, but to call a different endpoint instead, you can set `statusCheckUrl`. Custom headers can also be specified using `statusCheckHeaders`.

<p align="center">
  <img alt="Status Checks demo" src="https://raw.githubusercontent.com/Lissy93/dashy/master/docs/assets/status-check-demo.gif" width="600" />
</p>

**[⬆️ Back to Top](#dashy)**

---

## Authentication 💂

> For full authentication documentation, see: [**Authentication**](./docs/authentication.md)

Dashy now has full support for secure single-sign-on using [Keycloak](https://www.keycloak.org/)! This provides secure, easy single-sign on. See [setup docs](/docs/authentication.md#keycloak) for a full usage guide

There is also a simple login feature for basic access control, which doesn't require any additional setup. To enable this feature, add an `auth` attribute under `appConfig`, containing an array of `users`, each with a username, SHA-256 hashed password and optional user type.

```yaml
appConfig:
  auth:
    users:
    - user: alicia
      hash: 4D1E58C90B3B94BCAD9848ECCACD6D2A8C9FBC5CA913304BBA5CDEAB36FEEFA3
      type: admin
```

**Guest Access**: By default, when authentication is configured no user can access your dashboard without first logging in. If you would like to allow for read-only access by unauthenticated users, then you can enable guest mode, by setting `appConfig.auth.enableGuestAccess: true`.

**Granular Controls**: With basic login, it is also possible to control which sections are visible to which users. Under the `displayData` property of a section, you can pass an array of usernames to  one of the following attributes:
- `hideForUsers` - Section will be visible to all users, except for those specified in this list
- `showForUsers` - Section will be hidden from all users, except for those specified in this list
- `hideForGuests` - Section will be visible for all logged in users, but not for guests (if guest access is enabled)

<p align="center">
  <img
    title="Example login screen, using Vapourwave theme"
    alt="Example login screen, using Vapourwave theme"
    src="https://i.ibb.co/K52YL1g/dashy-login-form.png"
    width="400"
  />
</p>

**Note**: The simple auth method handles access control on the frontend, and therefore in security-critical situations, it is recommended to use an alternate method for authentication, like [Keycloak](docs/authentication.md#keycloak) or one of the [alternatives](docs/authentication.md#alternative-authentication-methods).

**[⬆️ Back to Top](#dashy)**

---

## Opening Methods 🖱️

> For full documentation on views and opening methods, see: [**Alternate Views**](./docs/alternate-views.md)

One of the primary purposes of Dashy is to make launching commonly used apps and services as quick as possible. To aid in this, there are several different options on how items can be opened. You can configure your preference by setting the `target` property of any item, to one of the following values:
- `sametab` - The app will be launched in the current tab
- `newtab` - The app will be launched in a new tab
- `modal` - Launch app in a resizable/ movable popup modal on the current page
- `workspace` - Changes to Workspace view, and launches app

Even if the target is not set (or is set to `sametab`), you can still launch any given app in an alternative method: Alt + Click will open the modal, and Ctrl + Click will open in a new tab. You can also right-click on any item to see all options (as seen in the screenshot below). This custom context menu can be disabled by setting `appConfig.disableContextMenu: true`.

In the workspace view, you can keep previously opened websites/ apps open in the background, by setting `appConfig.enableMultiTasking: true`. This comes at the cost of performance, but does mean that your session with each app is preserved, enabling you to quickly switch between your apps.

<p align="center">
  <img width="500" src="https://i.ibb.co/vmZdSRt/dashy-context-menu-2.png" />
</p>

The modal and workspace views work by rendering the target application in an iframe. If you are getting a a `Refused to Connect` error, then you need to set the HTTP response header [`X-Frame-Options`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options) to `ALLOW [url-for-dashy]`. See [the docs](./docs/troubleshooting.md#refused-to-connect-in-modal-or-workspace-view) for instructions on how to do this.

---

## Alternate Views 👓

As well as the default homepage, there is also:
- A minimal view, useful for use as a browser start page
- A workspace view, useful for visiting many apps simultaneously

You can change the view from the UI, using the switch icon in the top-right corner, or select a default view in the config, under `appConfig.startingView` attribute (can be either `default`, `minimal` or `workspace`). Clicking the page title on any view will take you back to your default starting view.

<p align="center">
  <b>Example of Workspace View</b><br>
  <img alt="Workspace view demo" src="https://raw.githubusercontent.com/Lissy93/dashy/master/docs/assets/workspace-demo.gif" width="600" />
</p>

<p align="center">
  <b>Example of Minimal View</b><br>
  <img alt="Workspace view demo" src="https://raw.githubusercontent.com/Lissy93/dashy/master/docs/assets/minimal-view-demo.gif" width="600" />
</p>

**[⬆️ Back to Top](#dashy)**

---

## Searching and Shortcuts 🔎

> For full documentation on searching, see: [**Searching & Shortcuts**](./docs/searching.md)

Quickly finding and launching applications is the primary aim of Dashy. To that end instant search and customizable keyboard shortcuts are built-in.

To start filtering, just start typing. No need to select the search bar or use any special key. You can then use either the tab key or arrow keys to select and move between results, and hit enter to launch the currently selected application. You can also use `Alt + Enter` on a selected app to launch it in a popup modal, `Ctrl + Enter` to open in new tab, or right-click on it to see all opening methods.

You can also add custom tags to a given item, to make finding them based on keywords easier. For example, in the following example, searching for 'Movies' will show 'Plex'

```yaml
  items:
  - title: Plex
    description: Media library
    icon: favicon
    url: https://plex.lab.local
    tags: [ movies, videos, music ]
```

For apps that you use regularly, you can set a custom keybinding. Use the `hotkey` parameter on a certain item to specify a numeric key, between `0 - 9`. You can then launch that app, by just pressing that key, which is very useful for services you use frequently.

Example:

```yaml
- title: Bookstack
  icon: far fa-books
  url: https://bookstack.local/
  hotkey: 8
```

To search the web directly through Dashy, just press enter after typing your query. Options for web search are set under `appConfig.webSearch`. There is built in support for [10+ search engines](./docs/searching.md#setting-search-engine), or [use your own custom provider](./docs/searching.md#using-custom-search-engine) or self-hosted instance.
To disable web search all together, set: `webSearch: { disableWebSearch: true }`

```yaml
webSearch:
  searchEngine: duckduckgo
  openingMethod: newtab
```

With the web search, you can also define your own bangs, to redirect results to any given app, website or search engine, when the query is preceded with a certain character sequence (usually beginning in `/`, `!` or `:`).

For example, with the below code, typing `:git dashy` will search GitHub for Dashy, or `/w docker` will open the Docker Wikipedia page. 

```yaml
webSearch:
  searchBangs:
    /r: reddit
    /w: wikipedia
    /s: https://whoogle.local/search?q=
    ':wolf': wolframalpha
    ':so': stackoverflow
    ':git': github
```

Hit `Esc` at anytime to close any open apps, clear the search field, or hide any modals.

**[⬆️ Back to Top](#dashy)**

---

## Config Editor ⚙️
> For full config documentation, see: [**Configuring**](./docs/configuring.md)

From the Settings Menu in Dashy, you can download, backup, edit and rest your config. The editor will tell you if you've got any validation warnings.

A full list of available config options can be found [here](./docs/configuring.md). It's recommend to make a backup of your configuration, as you can then restore it into a new instance of Dashy, without having to set it up again. [json2yaml](https://www.json2yaml.com/) is very useful for converting between YAML to JSON and visa versa.

<p align="center">
  <img alt="Config Editor demo" src="https://raw.githubusercontent.com/Lissy93/dashy/master/docs/assets/config-editor-demo.gif" width="600" />
</p>

**Update:** A new and improved drag-and-drop UI editor is in progress, and should be released within the next couple of weeks!

**[⬆️ Back to Top](#dashy)**

---

## Cloud Backup & Sync ☁

> For full backup documentation, see: [**Cloud Backup & Sync**](./docs/backup-restore.md)

Dashy has an **optional** built-in feature for securely backing up your config to a hosted cloud service, and then restoring it on another instance. This feature is totally optional, and if you do not enable it, then Dashy will not make any external network requests.

This is useful not only for backing up your configuration off-site, but it also enables Dashy to be used without having write a YAML config file, and in the future there will allow the use of the public hosted instance of Dashy for users without a server.

All data is fully E2E encrypted before being sent to the backend. In Dashy, this is done in [`CloudBackup.js`](https://github.com/Lissy93/dashy/blob/master/src/utils/CloudBackup.js), using [crypto.js](https://github.com/brix/crypto-js)'s AES method, with the users chosen password as the key. The data is then sent to a [Cloudflare worker](https://developers.cloudflare.com/workers/learning/how-workers-works), and stored in a [KV](https://developers.cloudflare.com/workers/learning/how-kv-works) data store.

<p align="center">
  <img width="400" src="https://i.ibb.co/yBrVN4N/dashy-cloud-sync.png" />
</p>

**[⬆️ Back to Top](#dashy)**

---

## Language Switching 🌎
> For full internationalization documentation, see: [**Multi-Language Support**](./docs/multi-language-support.md)

Dashy supports multiple languages and locales. When available, you're language should be automatically detected and applied on load, based on your browser or systems settings. But you can also select a language through the UI (under Config --> Switch Language), or set `appConfig.language` to your language (specified as a 2-digit [ISO 639-1 code](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)).

#### Supported Languages
- 🇬🇧 **English**: `en` - _Default_
- 🇨🇳 **Chinese**: `cn` - Contributed by **[@FormatToday](https://github.com/FormatToday)**
- 🇳🇱 **Dutch**: `nl` - Contributed by **[@evroon](https://github.com/evroon)**
- 🇲🇫 **French**: `fr` - Contributed by **[@EVOTk](https://github.com/EVOTk)**
- 🇩🇪 **German**: `de` - Contributed by **[@Niklashere](https://github.com/Niklashere)**
- 🇪🇸 **Spanish**: `es` - Contributed by **[@lu4t](https://github.com/lu4t)**
- 🇸🇮 **Slovenian**: `sl` - Contributed by **[@UrekD](https://github.com/UrekD)**

#### Add your Language
I would love for Dashy to be available to everyone, without language being a barrier to entry for non-native English speakers. If you have a few minutes to sapir, you're help with translating it would be very much appreciated.
It's quite a quick task, all text is in [a single JSON file](https://github.com/Lissy93/dashy/tree/master/src/assets/locales), and you don't have to translate it all. For more info, see the [Adding a New Language Docs](./docs/multi-language-support.md#adding-a-new-language), and feel free to reach out if you need any support.

**[⬆️ Back to Top](#dashy)**

---

## Setting Dashboard Info 🌳

Page settings are defined under [`pageInfo`](https://github.com/Lissy93/dashy/blob/master/docs/configuring.md#pageinfo). Here you can set things like title, sub-title, navigation links, footer text, etc. For example:

```yaml
pageInfo:
  title: Home Lab
  description: Dashy
  navLinks:
  - title: Home
    path: /
  - title: Server Monitoring
    path: https://server-start.local
  - title: Start Page
    path: https://start-page.local
  footerText: 'My <b>Awesome</b> Dashboard. Built with <a href="https://dashy.to">Dashy</a>'
```

**[⬆️ Back to Top](#dashy)**

---

## Getting Help 🙋‍♀️

> For general discussions, check out the **[Discussions Board](https://github.com/Lissy93/dashy/discussions)**

If you're having trouble getting things up and running, feel free to ask a question. The best way to do so is in the [discussion](https://github.com/Lissy93/dashy/discussions), or if you think you think the issue is on Dashy's side, you can [raise a ticket](https://github.com/Lissy93/dashy/issues/new/choose). It's best to check the [docs](./docs) and [previous questions](https://github.com/Lissy93/dashy/issues?q=label%3A%22%F0%9F%A4%B7%E2%80%8D%E2%99%82%EF%B8%8F+Question%22+) first, as you'll likely find the solution there.

**[⬆️ Back to Top](#dashy)**

## Raising Issues 🐛

Found a bug, or something that isn't working as you'd expect? Please raise it as an issue so that it can be resolved. Feature requests are also welcome. Similarlty, feedback is very useful, as it helps me know what areas of Dashy need some improvement. 

- [Raise a Bug 🐛](https://github.com/Lissy93/dashy/issues/new?assignees=lissy93&labels=%F0%9F%90%9B+Bug&template=bug.yml&title=%5BBUG%5D+%3Ctitle%3E)
- [Submit a Feature Request 🦄](https://github.com/Lissy93/dashy/issues/new?template=feature-request.yml)
- [Share Feedback 🌈](https://github.com/Lissy93/dashy/issues/new?assignees=&labels=%F0%9F%8C%88+Feedback&template=share-feedback.md&title=%5BFEEDBACK%5D)

**Issue Status** [![Resolution Time](http://isitmaintained.com/badge/resolution/lissy93/dashy.svg)](https://isitmaintained.com/project/lissy93/dashy)  [![Open Issues](http://isitmaintained.com/badge/open/lissy93/dashy.svg)](https://github.com/Lissy93/dashy/issues) [![Closed Issues](https://badgen.net/github/closed-issues/lissy93/dashy)](https://github.com/Lissy93/dashy/issues?q=is%3Aissue+is%3Aclosed) [![GitHub Discussions](https://img.shields.io/github/discussions/lissy93/dashy)
](https://github.com/Lissy93/dashy/discussions)

**[⬆️ Back to Top](#dashy)**

## Supporting Dashy 💖

> For full details, and other ways you can help out, see: [**Contributing**](./docs/contributing.md)

If you're using Dashy, and would like to help support it's development, then that would be awesome! Contributions of any type, however small are always very much appreciated, and you will be appropriately credited for your effort.

Several areas that we need a bit of help with at the moment are:
- Translating - Help make Dashy available to non-native English speakers by [adding youre language](./docs/multi-language-support.md#adding-a-new-language)
- Donate a small amount, by [Sponsoring @Lissy93 on GitHub](https://github.com/sponsors/Lissy93) and receive some extra perks!
- Complete a [short survey](https://n9fy6xak9yd.typeform.com/to/gl0L68ou), to have your say about future features
- Share your dashboard in the [Showcase](https://github.com/Lissy93/dashy/blob/master/docs/showcase.md#dashy-showcase-), to provide inspiration for others
- Join the [discussion](https://github.com/Lissy93/dashy/discussions), help answer other users questions, suggest features, share tips and ask questions
- Spread the word, by sharing Dashy or a screenshot of your dashboard, to help new users discover it
- Submit a PR, to add a new feature, fix a bug, update the docs, add a theme or something else
- Star Dashy on GitHub/ DockerHub or leave an upvote / review on [these platforms](https://github.com/Lissy93/dashy/blob/master/docs/contributing.md#star-upvote-or-leave-a-review)

[![Sponsor Lissy93 on GitHub](./docs/assets/sponsor-button.svg)](https://github.com/sponsors/Lissy93)

**[⬆️ Back to Top](#dashy)**

## Credits 🏆

> For a full list of credits, and attributions to packages used within Dashy, see: [**Credits**](./docs/credits.md)

Thank you so much to everyone who has helped with Dashy so far, every contribution is very much appreciated.

#### Sponsors

Huge thanks to the sponsors helping to support Dashy's development!
<!-- readme: sponsors -start -->
<table>
<tr>
    <td align="center">
        <a href="https://github.com/Robert-Ernst">
            <img src="https://avatars.githubusercontent.com/u/9050259?u=7253b4063f1ffe3b5a894263c8b2056151802508&v=4" width="80;" alt="Robert-Ernst"/>
            <br />
            <sub><b>Robert Ernst</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/swcarlosrj">
            <img src="https://avatars.githubusercontent.com/u/9881700?u=c92e4a0ccc0bff241e50582bce914b179b6d89b6&v=4" width="80;" alt="swcarlosrj"/>
            <br />
            <sub><b>Carlos Rufo</b></sub>
        </a>
    </td></tr>
</table>
<!-- readme: sponsors -end -->

#### Contributors
[![Auto-generated contributors](https://raw.githubusercontent.com/Lissy93/dashy/master/docs/assets/CONTRIBUTORS.svg)](./docs/credits.md)

#### Packages
Dashy was made possible thanks to the following packages and components. For more details on each, see [Dependency Credits](./docs/credits.md#dependencies-). Full credit to their respective authors.
- **Utils**: [`crypto-js`](https://github.com/brix/crypto-js), [`axios`](https://github.com/axios/axios), [`ajv`](https://github.com/ajv-validator/ajv)
- **Components**: [`vue-select`](https://github.com/sagalbot/vue-select) by @sagalbot, [`vue-js-modal`](https://github.com/euvl/vue-js-modal) by @euvl, [`v-tooltip`](https://github.com/Akryum/v-tooltip) by @Akryum, [`vue-material-tabs`](https://github.com/jairoblatt/vue-material-tabs) by @jairoblatt, [`JsonEditor`](https://github.com/josdejong/jsoneditor) by @josdejong, [`vue-toasted`](https://github.com/shakee93/vue-toasted) by @shakee93
- **Core**: Vue.js, TypeScript, SCSS, Node.js, ESLint
- **Backup & sync**: This server uses [Cloudflare workers](https://workers.cloudflare.com/) plus [KV](https://developers.cloudflare.com/workers/runtime-apis/kv) and [web crypto](https://developers.cloudflare.com/workers/runtime-apis/web-crypto)
- **Services**: The 1-Click demo uses [Play-with-Docker Labs](https://play-with-docker.com/). Code is hosted on [GitHub](https://github.com), Docker image is hosted on [DockerHub](https://hub.docker.com/), and the demos are hosted on [Netlify](https://www.netlify.com/).
- **Actions**: [`action-autotag`](https://github.com/butlerlogic/action-autotag) by @butlerlogic, [`contributors-list`](https://github.com/bubkoo/contributors-list), [`github-pages-deploy-action`](https://github.com/JamesIves/github-pages-deploy-action), [`is-sponsor-label-action`](https://github.com/JasonEtco/is-sponsor-label-action), [`issues-translate-action`](https://github.com/tomsun28/issues-translate-action) by @tomsun28, [`pr-commenter-action`](https://github.com/exercism/pr-commenter-action) by @exercism, [`snyk node`](https://github.com/snyk/actions/node) by @snyk, and [`yarn-lock-changes`](https://github.com/Simek/yarn-lock-changes) by @Simek. See [all action credits](/docs/credits.md#actions)


**[⬆️ Back to Top](#dashy)**

## Developing 🧱

> For full development documentation, see: [**Developing**](./docs/developing.md)

[![Open Project in VS Code](https://img.shields.io/badge/Open_in-VS_Code-863cfc?style=for-the-badge&logo=visualstudiocode)](https://open.vscode.dev/Lissy93/Dashy)

Before getting started, you'll need [Git](https://git-scm.com/downloads), [Node](https://nodejs.org/en/download/) and optionally [Yarn](https://yarnpkg.com/) (run `npm i -g yarn`) installed.

To set up the development environment:
1. Get Code: `git clone https://github.com/Lissy93/dashy.git`  and `cd dashy`
2. Install dependencies: `yarn`
3. Start dev server: `yarn dev`

Hot reload is enabled, so changes will be automatically detected, compiled and refreshed.

Like most Git repos, we are following the [Github Flow](https://guides.github.com/introduction/flow) standard.
1. Create a branch (or fork if you're not a collaborator)
2. Code some awesome stuff, then add and commit your changes
3. Create a Pull Request, complete the checklist and ensure the build succeeds
4. Follow up with any reviews on your code
5. Merge 🎉

Branch names are specified in the following format: `[TYPE]/[TICKET]_[TITLE]`. E.g. `FEATURE/420_Awesome-feature` or `FIX/690_login-server-error`.

Most commit messages use git [commit emojis](https://gist.github.com/parmentf/035de27d6ed1dce0b36a) - e.g. ✨ = New feature, 🐛 = Bug fix, 💄 = UI stuff, 🚧 = Work in progress, 🌐 = Language, 🔖 = New release, and so on. Take a look at [gitmoji.dev](https://gitmoji.dev/) for a list of what each emoji indicates

Before you submit your pull request, please ensure you've checked off all the boxes in the template. For your PR to be merged, it must:
- Must be backwards compatible
- Any new features should be documented
- The build, lint and tests (run by GH actions) should all pass (there are some exceptions)
- There must not be any merge conflicts

If you're new to web development, I've put together a short [list of resources](https://github.com/Lissy93/dashy/blob/master/docs/developing.md#resources-for-beginners), to help beginners get started

**Repo Status**:
[![Open PRs](https://flat.badgen.net/github/open-prs/lissy93/dashy?icon=github)](https://github.com/Lissy93/dashy/pulls)
[![Total PRs](https://flat.badgen.net/github/prs/lissy93/dashy?icon=github)](https://github.com/Lissy93/dashy/pulls?q=)
[![GitHub commit activity](https://img.shields.io/github/commit-activity/m/lissy93/dashy?style=flat-square)](https://github.com/Lissy93/dashy/commits/master)
[![Last Commit](https://flat.badgen.net/github/last-commit/lissy93/dashy?icon=github)](https://github.com/Lissy93/dashy/commits/master)
[![Contributors](https://flat.badgen.net/github/contributors/lissy93/dashy?icon=github)](https://github.com/Lissy93/dashy/graphs/contributors)

**[⬆️ Back to Top](#dashy)**

---

## Release Schedule 🗞️

> For full release, automation and CI documentation, see: [**Releases & Workflows**](./docs/release-workflow.md)

Dashy is under active development, with features, improvements and changes pushed almost daily.

We're using [Semantic Versioning](https://semver.org/), to indicate major, minor and patch versions. You can find the current version number in the readme, and check your apps version under the config menu. The version number is pulled from the [package.json](https://github.com/Lissy93/dashy/blob/master/package.json#L3) file.

Typically there is a new major release every 2 weeks, usually on Sunday, and you can view these under the [Releases Page](https://github.com/Lissy93/dashy/releases). Each release will create a new [tag on GitHub](https://github.com/Lissy93/dashy/tags), and each major release will also result in the creation of a new [tag on DockerHub](https://hub.docker.com/r/lissy93/dashy/tags), so that you can fix your container to a certain version.

For a full breakdown of each change, you can view the [Changelog](https://github.com/Lissy93/dashy/blob/master/.github/CHANGELOG.md). Each new feature or significant change needs to be submitted through a pull request, which makes it easy to review and track these changes, and roll back if needed.

**[⬆️ Back to Top](#dashy)**

---

## Documentation 📘
> For full docs, see: **[Documentation Contents](./docs/readme.md)**
#### Running Dashy
- 💨 [Quick Start](/docs/quick-start.md) - TDLR guide on getting Dashy up and running in under 5 minutes
- 🚀 [Deployment](/docs/deployment.md) - Full guide on setting up Dashy on various different environments
- 🔧 [Configuring](/docs/configuring.md) - Complete list of all available options in the config file
- 💻 [Management](/docs/management.md) - Managing your app, updating, security, web server configuration, etc
- 🚒 [Troubleshooting](/docs/troubleshooting.md) - Common errors and problems, and how to fix them

#### Development and Contributing 
- 🧱 [Developing](/docs/developing.md) - Running Dashy development server locally, and general workflow
- 🛎️ [Development Guides](/docs/development-guides.md) - Common development tasks, to help new contributors
- 💖 [Contributing](/docs/contributing.md) - How to contribute to Dashy
- 🌟 [Showcase](/docs/showcase.md) - See how others are using Dashy, and share your dashboard
- 🏆 [Credits](/docs/credits.md) - Shout out to the amazing people who have contributed so far
- 🗞️ [Release Workflow](/docs/release-workflow.md) - Info about releases, CI and automated tasks

#### Feature Docs
- 🛡️ [Authentication](/docs/authentication.md) - Guide to setting up authentication to protect your dashboard
- 🧿 [Alternate Views](/docs/alternate-views.md) - Outline of available pages / views and item opening methods
- 💾 [Backup & Restore](/docs/backup-restore.md) - Guide to Dashy's cloud sync feature
- 🧸 [Icons](/docs/icons.md) - Outline of all available icon types for sections and items
- 🌐 [Language Switching](/docs/multi-language-support.md) - How to change language, add a language, or update text
- 🚦 [Status Indicators](/docs/status-indicators.md) - Using Dashy to monitor uptime and status of your apps
- 🔍 [Searching  & Shortcuts](/docs/searching.md) - Finding and launching your apps, and using keyboard shortcuts
- 🎨 [Theming](/docs/theming.md) - Complete guide to applying, writing and modifying themes and styles

#### Misc
- 🔐 [Privacy & Security](/docs/privacy.md) - List of requests, potential issues, and security resources
- 📄 [License](/LICENSE) - Copy of the MIT License
- ⚖️ [Legal](/.github/LEGAL.md) - Licenses of direct dependencies
- 📏 [Code of Conduct](/.github/CODE_OF_CONDUCT.md) - Contributor Covenant Code of Conduct
- 🌳 [Changelog](/.github/CHANGELOG.md) - Details of recent changes, and historical versions

**[⬆️ Back to Top](#dashy)**

---

## Roadmap 🛣️

> For past and future app updates, see: [**Changelog**](/.github/CHANGELOG.md)


The following features and tasks are planned for the near future.
- Widget support- cards showing live stats and interactive content from your self-hosted services
- UI Drag & Drop editor and visual configurator
- Conversion to TypeScript
- Improved test coverage
 
 **[⬆️ Back to Top](#dashy)**

---

## Alternatives 🙌

There are a few self-hosted web apps, that serve a similar purpose to Dashy. If you're looking for a dashboard, and Dashy doesn't meet your needs, I highly recommend you check these projects out! 
- [Flame](https://github.com/pawelmalak/flame) by @pawelmalak (`MIT`)
- [HomeDash2](https://lamarios.github.io/Homedash2)
- [Homer](https://github.com/bastienwirtz/homer) (`Apache License 2.0`)
- [Organizr](https://organizr.app/) (`GPL-3.0 License`)
- [Heimdall](https://github.com/linuxserver/Heimdall) (`MIT`)
- [Smashing](https://github.com/Smashing/smashing) (`MIT`)
- See more 👉 [Awesome Self-Hosted](https://github.com/awesome-selfhosted/awesome-selfhosted#personal-dashboards)

**[⬆️ Back to Top](#dashy)**

---
## License 📜

Dashy is License under [MIT X11](https://en.wikipedia.org/wiki/MIT_License)

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

Except as contained in this notice, Dashy shall not be used in advertising or otherwise
to promote the sale, use or other dealings in this Software without prior written
authorization from the repo owner.
```

**TDLR;** _You can do whatever you like with Dashy: use it in private or commercial settings,_
_redistribute and modify it. But you must display this license and credit the author._
_There is no warranty that this app will work as expected, and the author cannot be held_
_liable for anything that goes wrong._
For more info, see TLDR Legal's [Explanation of MIT](https://tldrlegal.com/license/mit-license)

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FLissy93%2Fdashy.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2FLissy93%2Fdashy?ref=badge_large)

**[⬆️ Back to Top](#dashy)**

---


<p align="center">
  <br>
  <a href="https://dashboard.trackgit.com/token/ks0bx7bb14lsvbwoc3ik">
    <img src="https://us-central1-trackgit-analytics.cloudfunctions.net/token/ping/ks0bx7bb14lsvbwoc3ik?style=flat-square" />
  </a>
  <br><br>
  <a href="https://github.com/Lissy93/dashy">
    <img src="https://github.githubassets.com/images/icons/emoji/octocat.png" />
  </a>
  <br><br>
  <i>Thank you for Visiting</i>
</p>

