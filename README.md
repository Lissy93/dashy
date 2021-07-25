
<h1 align="center">Dashy</h1>
<p align="center"><i>Dashy helps you organize your self-hosted services, by making them all accessible from a single place</i></p>

<p align="center">
  <img width="220" src="https://i.ibb.co/yhbt6CY/dashy.png" />
</p>

[![Awesome Self-Hosted](https://cdn.rawgit.com/sindresorhus/awesome/d7305f38d29fed78fa85652e3a63e154dd8e8829/media/badge.svg)](https://github.com/awesome-selfhosted/awesome-selfhosted#personal-dashboards)
![Docker Pulls](https://img.shields.io/docker/pulls/lissy93/dashy?logo=docker&style=flat-square)
![Stars](https://flat.badgen.net/github/stars/lissy93/dashy?icon=github)
![GitHub Status](https://flat.badgen.net/github/status/lissy93/dashy?icon=github)
![License MIT](https://img.shields.io/badge/License-MIT-09be48?style=flat-square&logo=opensourceinitiative)
![Current Version](https://img.shields.io/github/package-json/v/lissy93/dashy?style=flat-square&logo=azurepipelines&color=00af87)
[![Known Vulnerabilities](https://snyk.io/test/github/lissy93/dashy/badge.svg)](https://snyk.io/test/github/lissy93/dashy)

## Features 🌈

- Instant search by name, domain and tags - just start typing
- Full customizable keyboard shortcuts for navigation, filtering and launching apps
- Multiple built-in color themes, with UI color configurator and support for custom CSS
- Easy to customize every part of your dashboard, layout, icon sizes, behavior and colors etc
- Many options for icons, including Font-Awesome support, auto-fetching service favicon, images and emojis
- Option to show service status for each of your apps / links, for basic availability and uptime monitoring
- Multiple ways of opening apps, either in your browser, a pop-up modal or workspace view
- Option for full-screen background image, custom nav-bar links, html footer, title, and more
- Encrypted cloud backup and restore feature available
- Optional authentication, requiring admins and non-privileged users to log in
- Easy single-file YAML-based configuration, which can also be configured directly through the UI
- Small bundle size, fully responsive UI and PWA makes the app easy to use on any device
- Easy to setup with Docker, or on bare metal, or with 1-Click cloud deployment
- Multi-language support, with additional languages coming soon
- Plus lots more...

## Demo ⚡

> For more examples of Dashy in action, see: [**The Showcase**](./docs/showcase.md)

#### Live Demos
[Demo 1](https://dashy-demo-1.as93.net) ┆ [Demo 2](https://dashy-demo-2.as93.net) ┆ [Demo 3](https://dashy-demo-3.as93.net)

#### Spin up your own Demo
- 1-Click Deploy: [![One-Click Deploy with PWD](https://img.shields.io/badge/Play--with--Docker-Deploy-2496ed?style=flat-square&logo=docker)](https://labs.play-with-docker.com/?stack=https://raw.githubusercontent.com/Lissy93/dashy/master/docker-compose.yml)
- Or on your own machine: `docker run -p 8080:80 lissy93/dashy`

#### Recording
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

You can also build the Docker container from source, by cloning the repo, cd'ing into it and running `docker build .` and `docker compose up`.
#### Deploying from Source 🚀

You will need both [git](https://git-scm.com/downloads) and the latest or LTS version of [Node.js](https://nodejs.org/) installed on your system

- Get Code: `git clone git@github.com:Lissy93/dashy.git` and `cd dashy`
- Configuration: Fill in you're settings in `./public/conf.yml`
- Install dependencies: `yarn`
- Build: `yarn build`
- Run: `yarn start`

#### Deploy to the Cloud

Dashy supports 1-Click deployments on several popular cloud platforms. To spin up a new instance, just click a link below:
- [<img src="https://i.ibb.co/ZxtzrP3/netlify.png" width="18"/> Deploy to Netlify](https://app.netlify.com/start/deploy?repository=https://github.com/lissy93/dashy)
- [<img src="https://i.ibb.co/d2P1WZ7/heroku.png" width="18"/> Deploy to Heroku](https://heroku.com/deploy?template=https://github.com/Lissy93/dashy)
- [<img src="https://i.ibb.co/Ld2FZzb/vercel.png" width="18"/> Deploy to Vercel](https://vercel.com/new/project?template=https://github.com/lissy93/dashy)
- [<img src="https://i.ibb.co/xCHtzgh/render.png" width="18"/> Deploy to Render](https://render.com/deploy?repo=https://github.com/lissy93/dashy/tree/deploy_render)
- [<img src="https://i.ibb.co/J7MGymY/googlecloud.png" width="18"/> Deploy to GCP](https://deploy.cloud.run/?git_repo=https://github.com/lissy93/dashy.git)
- [<img src="https://i.ibb.co/HVWVYF7/docker.png" width="18"/> Deploy to PWD](https://labs.play-with-docker.com/?stack=https://raw.githubusercontent.com/Lissy93/dashy/master/docker-compose.yml)

#### Basic Commands

The following commands can be run on Dashy.

- `yarn build` - Builds the project for production, and outputs it into `./dist`
- `yarn start` - Starts a web server, and serves up the production site from `./dist`
- `yarn validate-config` - Parses and validates your `conf.yml` against Dashy's [schema](https://github.com/Lissy93/dashy/blob/master/src/utils/ConfigSchema.json)
- `yarn health-check` - Checks the health and status of Dashy's Node server
- `yarn pm2-start` - Starts the app using the [PM2](https://pm2.keymetrics.io/) process manager
- `yarn dev` - Starts the development server with hot reloading, linting, testing and verbose messaging
- `yarn lint` - Lints code to ensure it follows a consistent neat style
- `yarn test` - Runs tests, and outputs results
- `yarn install` - Install all dependencies

If you are using Docker, than precede each command with `docker exec -it [container-id]`, where container id can be found by running `docker ps`, e.g. `docker exec -it 92490c12baff yarn build`.
If you prefer [`NPM`](https://docs.npmjs.com), then just replace `yarn` with `npm run` in the following commands.

In Docker, [healthchecks](https://docs.docker.com/engine/reference/builder/#healthcheck) are pre-configured to monitor the uptime and response times of Dashy, and the status of which will show in your Docker monitoring app, or the `docker ps` command, or the container logs, using: `docker inspect --format "{{json .State.Health }}" [container-id]`.

**[⬆️ Back to Top](#dashy)**

---

## Configuring 🔧

> For full configuration documentation, see: [**Configuring**](./docs/configuring.md)

Dashy is configured with a single [YAML](https://yaml.org/) file, located at `./public/conf.yml` (or `./app/public/conf.yml` for Docker). Any other optional user-customizable assets are also located in the `./public/` directory, e.g. `favicon.ico`, `manifest.json`, `robots.txt` and `web-icons/*`. If you are using Docker, the easiest way to method is to mount a Docker volume (e.g. `-v /root/my-local-conf.yml:/app/public/conf.yml`)

In the production environment, the app needs to be rebuilt in order for changes to take effect. This should happen automatically, but can also be triggered by running `yarn build`, or `docker exec -it [container-id] yarn build` if you are using Docker (where container ID can be found by running `docker ps`).

You can check that your config matches Dashy's [schema](https://github.com/Lissy93/dashy/blob/master/src/utils/ConfigSchema.json) before deploying, by running `yarn validate-config.`

It is now possible also possible to update Dashy's config directly through the UI, and have changes written to disk. You can disable this feature by setting: `appConfig.allowConfigEdit: false`. If you are using users within Dashy, then you need to be logged in to a user of `type: admin` in order to modify the configuration globally. You can also trigger a rebuild of the app through the UI (Settings --> Rebuild).

You may find these [example config](https://gist.github.com/Lissy93/000f712a5ce98f212817d20bc16bab10) helpful for getting you started

**[⬆️ Back to Top](#dashy)**

---

## Theming 🎨

> For full theming documentation, see: [**Theming**](./docs/theming.md)

<p align="center">
  <a href="https://i.ibb.co/BVSHV1v/dashy-themes-slideshow.gif">
    <img alt="Example Themes" src="https://raw.githubusercontent.com/Lissy93/dashy/master/docs/assets/theme-slideshow.gif" width="400" />
  </a>
</p>

Dashy comes with a number of built-in themes, but it's also easy to make you're own. All colors, and most other CSS properties are specified using CSS variables, which are [documented here](./docs/theming.md#css-variables). This make modifying styles and customizing the look and feel of Dashy very easy.

You can select a theme, and customize it's colors directly through the UI. But it's also possible tp pass in external stylesheets and styles either in the config file (under `appConfig.externalStyleSheet`), or by mounting it to `/app/src/styles/user-defined-themes.scss` with Docker.

<p align="center">
  <a href="https://i.ibb.co/cLDXj1R/dashy-theme-configurator.gif">
    <img alt="Example Themes" src="https://raw.githubusercontent.com/Lissy93/dashy/master/docs/assets/theme-config-demo.gif" width="400" />
  </a>
</p>

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
- **Emoji**: Use an emoji as a tile icon, by putting the emoji's code as the icon attribute. Emojis can be specified either as emojis (`🚀`), unicode (`'U+1F680'`) or shortcode (`':rocket:'`).
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

<p align="center">
  <img
    title="Example login screen, using Vapourwave theme"
    alt="Example login screen, using Vapourwave theme"
    src="https://i.ibb.co/K52YL1g/dashy-login-form.png"
    width="400"
  />
</p>


**[⬆️ Back to Top](#dashy)**

---

## Status Indicators 🚦

> For full monitoring documentation, see: [**Status Indicators**](./docs/status-indicators.md)

Dashy has an optional feature that can display a small icon next to each of your running services, indicating it's current status. This is useful if you are using Dashy as your homelab's start page, as it gives you an overview of the health of each of your running services. Hovering over the indicator will show additional information, including average response time and an error message for services which are down.

By default, this feature is off, but you can enable it globally by setting `appConfig.statusCheck: true`, or enable/ disable it for an individual item, with `item[n].statusCheck`. You can also specify an time interval in seconds under `appConfig.statusCheckInterval`, which will determine how often to recheck services, if this value is `0`, then status is only checked on initial page load, this is default behavior.

<p align="center">
  <img alt="Status Checks demo" src="https://raw.githubusercontent.com/Lissy93/dashy/master/docs/assets/status-check-demo.gif" width="600" />
</p>

**[⬆️ Back to Top](#dashy)**

---

## Opening Methods 🖱️

One of the primary purposes of Dashy is to make launching commonly used apps and services as quick as possible. To aid in this, there are several different options on how items can be opened. You can configure your preference by setting the `target` property of any item, to one of the following values:
- `sametab` - The app will be launched in the current tab
- `newtab` - The app will be launched in a new tab
- `modal` - Launch app in a resizable/ movable popup modal on the current page
- `workspace` - Changes to Workspace view, and launches app

Even if the target is not set (or is set to `sametab`), you can still launch any given app in an alternative method: Alt + Click will open the modal, and Ctrl + Click will open in a new tab. You can also right-click on any item to see all options (as seen in the screenshot below). This custom context menu can be disabled by setting `appConfig.disableContextMenu: true`.

<p align="center">
  <img width="500" src="https://i.ibb.co/vmZdSRt/dashy-context-menu-2.png" />
</p>

The modal and workspace views work by rendering the target application in an iframe. For this to work, the HTTP response header [`X-Frame-Options`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options) for a given application needs to be set to `ALLOW`. If you are getting a `Refused to Connect` error then this header is set to `DENY` (or `SAMEORIGIN` and it's on a different host).

Here's a quick demo of the workspace view:
<p align="center">
  <img alt="Workspace view demo" src="https://raw.githubusercontent.com/Lissy93/dashy/master/docs/assets/workspace-demo.gif" width="600" />
</p>

**[⬆️ Back to Top](#dashy)**

---

## Searching and Shortcuts 🔎

Quickly finding and launching applications is the primary aim of Dashy. To that end instant search and customizable keyboard shortcuts are built-in.

To start filtering, just start typing. No need to select the search bar or use any special key. You can then use either the tab key or arrow keys to select and move between results, and hit enter to launch the currently selected application. You can also use `Alt + Enter` on a selected app to launch it in a popup modal, `Ctrl + Enter` to open in new tab, or right-click on it to see all opening methods.

For apps that you use regularly, you can set a custom keybinding. Use the `hotkey` parameter on a certain item to specify a numeric key, between `0 - 9`. You can then launch that app, by just pressing that key, which is very useful for services you use frequently.

Example:

```yaml
- title: Bookstack
  icon: far fa-books
  url: https://bookstack.local/
  hotkey: 8
```

Hit `Esc` at anytime to close any open apps, clear the search field, or hide any modals.

**[⬆️ Back to Top](#dashy)**

---

## Config Editor ⚙️

From the Settings Menu in Dashy, you can download, backup, edit and rest your config. An interactive editor makes editing the config file easy, it will tell you if you've got any errors. After making your changes, you can either apply them locally, or export into your main config file. After saving to the config file to the disk, the app will need to be rebuilt. This will happen automatically, but may take a few minutes. You can also manually trigger a rebuild from the Settings Menu. A full list of available config options can be found [here](./docs/configuring.md). It's recommend to make a backup of your configuration, as you can then restore it into a new instance of Dashy, without having to set it up again. [json2yaml](https://www.json2yaml.com/) is very useful for converting between YAML to JSON and visa versa.

<p align="center">
  <img alt="Workspace view demo" src="https://raw.githubusercontent.com/Lissy93/dashy/master/docs/assets/config-editor-demo.gif" width="600" />
</p>

**[⬆️ Back to Top](#dashy)**

---

## Language Switching 🌎

Dashy has the ability to support multiple languages and locales. When available, you're language should be automatically detected and applied on load, based on your browser or systems settings. But you can also select a language through the UI, under Config --> Switch Language.

Alternatively, set you're language in the config file, under `appConfig.language`. The language must be specified as either a 2-digit [ISO 639-1 code](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) (such as `en`), or where available, the 2-digit code followed by a region or dialect (e.g. `en-GB`).

#### Supported Languages
- 🇬🇧 **English**: `en`

#### Add your Language
I would love for Dashy to be available and comfortable to use for all, including non-native English speakers. If you speak another language, and have a few minutes to sapir, you're help with translating it would be very much appreciated.
There's not too much text to translate, and it's all located in [a single JSON file](https://github.com/Lissy93/dashy/tree/master/src/assets/locales), and you don't have to translate it all, as any missing items will just fallback to English. For more info, see the [Development Guides Docs](https://github.com/Lissy93/dashy/blob/master/docs/development-guides.md#adding-translations), and feel free to reach out if you need any support.

---

## Sections & Items 🗃️

Dashy is made up of a series of sections, each containing a series of items.

A section an be collapsed by clicking on it's name. This will cause only the title button to be visible until clicked, which is useful for particularly long sections, or those containing less-used apps. The collapse state for each section will be remembered for the next time you visit.

From the UI, you can also choose a layout, either `grid`, `horizontal` or `vertical`, as well as set the size for items, either `small`, `medium` or `large`, and of course set a theme using the dropdown. All settings specified here will be stored in your browsers local storage, and so won't persist across devices, if you require this then you must set these in the config file instead.

Within each section, you can set custom layout properties with under `displayData`. For example, you can make a given section double the width by making is span 2 columns with `cols: 2`, or specify how many rows it should span with `rows`. You can also set the layout for items within a given section here, for example, use `itemCountX` to define how many items will be on each row within the section. Sections can also have a custom color, specified as a hex code and defined using the `color` attribute. For full options for items, see the [`section.displayData` docs](https://github.com/Lissy93/dashy/blob/master/docs/configuring.md#sectiondisplaydata-optional)

Items also have some optional config attributes. As well as `title`, `description`, `URL` and `icon`, you can also specify a specific opening method (`target`), and configure status checks (`statusCheck: true/false`, `statusCheckUrl` and `statusCheckHeaders`), and modify appearance with `color` and `backgroundColor`. For full options for items, see the [`section.item` docs](https://github.com/Lissy93/dashy/blob/master/docs/configuring.md#sectionitem)


**[⬆️ Back to Top](#dashy)**

---

## Setting Dashboard Info 🌳

Page settings are defined under [`pageInfo`](https://github.com/Lissy93/dashy/blob/master/docs/configuring.md#pageinfo). Here you can set things like title, sub-title, navigation links, footer text, etc

Custom links for the navigation menu are defined under [`pageInfo.navLinks`](https://github.com/Lissy93/dashy/blob/master/docs/configuring.md#pageinfonavlinks-optional).

You can display either custom text or HTML in the footer, using the `pageInfo.footerText` attribute.

It's also possible to hide parts of the page that you do not need (e.g. navbar, footer, search, heading, etc). This is done using the [`appConfig.hideComponents`](https://github.com/Lissy93/dashy/blob/master/docs/configuring.md#appconfighidecomponents-optional) attribute.

For example, a `pageInfo` section might look something like this:

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
  footerText: 'Built with Dashy, by <a href="https://aliciasykes.com">Alicia Sykes</a>, 2021'
```

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

Some ideas for PRs include: bug fixes, improve the docs, submit a screenshot of your dashboard to the showcase, add new themes, implement a new widget, add or improve the display options, improve or refactor the code, or implement a new feature.

Before you submit your pull request, please ensure the following:
- Must be backwards compatible
- All lint checks and tests must pass
- If a new option in the the config file is added, it needs to be added into the [schema](https://github.com/Lissy93/dashy/blob/master/src/utils/ConfigSchema.json), and documented in the [configuring](https://github.com/Lissy93/dashy/blob/master/docs/configuring.md) guide
- If a new dependency is required, it must be essential, and it must be thoroughly checked out for security or efficiency issues
- Your pull request will need to be up-to-date with master, and the PR template must be filled in

### Repo Status

![Open PRs](https://flat.badgen.net/github/open-prs/lissy93/dashy?icon=github)
![Total PRs](https://flat.badgen.net/github/prs/lissy93/dashy?icon=github)
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/lissy93/dashy?style=flat-square)
![Last Commit](https://flat.badgen.net/github/last-commit/lissy93/dashy?icon=github)
![Contributors](https://flat.badgen.net/github/contributors/lissy93/dashy?icon=github)

**[⬆️ Back to Top](#dashy)**

---

## Support 🙋‍♀️

> For general discussions, the [Discussions Board](https://github.com/Lissy93/dashy/discussions) is now active!

If you've found a bug, or something that isn't working as you'd expect, please raise an issue, so that it can be resolved. Similarly, if you're having trouble getting things up and running, feel free to ask a question. Feature requests and feedback are also welcome, as it helps Dashy improve. 

- [Raise a Bug 🐛](https://github.com/Lissy93/dashy/issues/new?assignees=Lissy93&labels=%F0%9F%90%9B+Bug&template=bug-report---.md&title=%5BBUG%5D)
- [Submit a Feature Request 🦄](https://github.com/Lissy93/dashy/issues/new?assignees=Lissy93&labels=%F0%9F%A6%84+Feature+Request&template=feature-request---.md&title=%5BFEATURE_REQUEST%5D)
- [Ask a Question 🤷‍♀️](https://github.com/Lissy93/dashy/issues/new?assignees=Lissy93&labels=%F0%9F%A4%B7%E2%80%8D%E2%99%82%EF%B8%8F+Question&template=question------.md&title=%5BQUESTION%5D)
- [Share Feedback 🌈](https://github.com/Lissy93/dashy/issues/new?assignees=&labels=%F0%9F%8C%88+Feedback&template=share-feedback---.md&title=%5BFEEDBACK%5D)

[**Issue Status**](https://isitmaintained.com/project/lissy93/dashy) ![Resolution Time](http://isitmaintained.com/badge/resolution/lissy93/dashy.svg)  ![Open Issues](http://isitmaintained.com/badge/open/lissy93/dashy.svg) ![Closed Issues](https://badgen.net/github/closed-issues/lissy93/dashy)


For more general questions about any of the technologies used, [StackOverflow](https://stackoverflow.com/questions/) may be more helpful first port of info

 If you need to get in touch securely with the author (me, Alicia Sykes), drop me a message at:
- **Email**: `alicia at omg dot lol`
- **Public Key** [`0688 F8D3 4587 D954 E9E5  1FB8 FEDB 68F5 5C02 83A7`](https://keybase.io/aliciasykes/pgp_keys.asc?fingerprint=0688f8d34587d954e9e51fb8fedb68f55c0283a7)

**[⬆️ Back to Top](#dashy)**

---

## Documentation 📘

- [Deployment](/docs/deployment.md)
- [Configuring](/docs/configuring.md)
- [Developing](/docs/developing.md)
- [Contributing](/docs/contributing.md)
- [User Guide](/docs/user-guide.md)
- [Troubleshooting](/docs/troubleshooting.md)
- [Backup & Restore](/docs/backup-restore.md)
- [Status Indicators](/docs/status-indicators.md)
- [Theming](/docs/theming.md)
- [Icons](/docs/icons.md)
- [Authentication](/docs/authentication.md)
- [Showcase](/docs/showcase.md)

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

There are a few self-hosted web apps, that serve a similar purpose to Dashy. If you're looking for a dashboard, and Dashy doesn't meet your needs, I highly recommend you check these projects out! 
[HomeDash2](https://lamarios.github.io/Homedash2), [Homer](https://github.com/bastienwirtz/homer) (`Apache License 2.0`), [Organizr](https://organizr.app/) (`GPL-3.0 License`) and  [Heimdall](https://github.com/linuxserver/Heimdall) (`MIT License`)

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
_liable for anything that goes wrong._
For more info, see TLDR Legal's [Explanation of MIT](https://tldrlegal.com/license/mit-license)

![Octocat](https://github.githubassets.com/images/icons/emoji/octocat.png?v8)

**[⬆️ Back to Top](#dashy)**

---

<a href="https://www.producthunt.com/posts/dashy" target="_blank" align="center"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=294872&theme=dark" alt="Dashy - A feature-rich dashboard for your homelab 🚀 | Product Hunt" width="250" height="54" /></a>
