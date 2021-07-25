
# Developing

This article outlines how to get Dashy running in a development environment, and outlines the basics of the architecture.
If you're adding new features, you may want to check out the [Development Guides](./docs/development-guides.md) docs, for tutorials covering basic tasks.

- [Setting up the Development Environment](#setting-up-the-dev-environment)
- [Resources for Beginners](#resources-for-beginners)
- [Style Guide](#style-guide)
- [Frontend Components](#frontend-components)
- [Project Structure](#directory-structure)
- [Dependencies and Packages](#dependencies-and-packages)

## Setting up the Dev Environment

### Prerequisites
You will need either the latest or LTS version of **[Node.js](https://nodejs.org/)** to build and serve the application and **[Git](https://git-scm.com/downloads)** to easily fetch the code, and push any changes. If you plan on running or deploying the container, you'll also need **[Docker](https://docs.docker.com/get-docker/)**. To avoid any unexpected issues, ensure you've got at least **[NPM](https://www.npmjs.com/get-npm)** V 7.5 or **[Yarn](https://classic.yarnpkg.com/en/docs/install/#windows-stable)** 1.22 (you may find [NVM](https://github.com/nvm-sh/nvm) helpful for switching/ managing versions).

### Running the Project

1. Get Code: `git clone git@github.com:Lissy93/dashy.git`
2. Navigate into the directory: `cd dashy`
3. Install dependencies: `yarn`
4. Start dev server: `yarn dev`

Dashy should now be being served on http://localhost:8080/. Hot reload is enabled, so making changes to any of the files will trigger them to be rebuilt and the page refreshed.

### Project Commands

- `yarn dev` - Starts the development server with hot reloading
- `yarn build` - Builds the project for production, and outputs it into `./dist`
- `yarn start` - Starts a web server, and serves up the production site from `./dist`
- `yarn validate-config` - Parses and validates your `conf.yml` against Dashy's schema
- `yarn lint` - Lints code to ensure it follows a consistent, neat style
- `yarn test` - Runs tests, and outputs results

There is also:
- `yarn build-and-start` will run `yarn build` and `yarn start`
- `yarn build-watch` will output contents to `./dist` and recompile when anything in `./src` is modified, you can then use either `yarn start` or your own server, to have a production environment that watches for changes.

Using the Vue CLI:
- The app is build with Vue, and uses the [Vue-CLI Service](https://cli.vuejs.org/guide/cli-service.html) for basic commands.
- If you have [NPX](https://github.com/npm/npx) installed, then you can invoke the Vue CLI binary using `npx vue-cli-service [command]`
- Vue also has a GUI environment that can be used for basic project management, and may be useful for beginners, this can be started by running `vue ui`, and opening up `http://localhost:8000`

Note:
- If you are using NPM, replace `yarn` with `npm run`
- If you are using Docker, precede each command with `docker exec -it [container-id]`. Container ID can be found by running `docker ps`

## Environmental Variables
- `PORT` - The port in which the application will run (defaults to `4000` for the Node.js server, and `80` within the Docker container)
- `NODE_ENV` - Which environment to use, either `production`, `development` or `test`
- `VUE_APP_DOMAIN` - The URL where Dashy is going to be accessible from. This should include the protocol, hostname and (if not 80 or 443), then the port too, e.g. `https://localhost:3000`, `http://192.168.1.2:4002` or `https://dashy.mydomain.com`

All environmental variables are optional. Currently there are not many environmental variables used, as most of the user preferences are stored under `appConfig` in the `conf.yml` file.

If you do add new variables, ensure that there is always a fallback (define it in [`defaults.js`](https://github.com/Lissy93/dashy/blob/master/src/utils/defaults.js)), so as to not cause breaking changes. Don't commit your `.env` file to git, but instead take a few moments to document what you've added under the appropriate section. Try and follow the concepts outlined in the [12 factor app](https://12factor.net/config), as these are good practices.

Any environmental variables used by the frontend are preceded with `VUE_APP_`. Vue will merge the contents of your `.env` file into the app in a similar way to the ['dotenv'](https://github.com/motdotla/dotenv) package, where any variables that you set on your system will always take preference over the contents of any `.env` file.

## Environment Modes
Both the Node app and Vue app supports several environments: `production`, `development` and `test`. You can set the environment using the `NODE_ENV` variable (either with your OS, in the Docker script or in an `.env` file - see [Environmental Variables](#environmental-variables) above).

The production environment will build the app in full, minifying and streamlining all assets. This means that building takes longer, but the app will then run faster. Whereas the dev environment creates a webpack configuration which enables HMR, doesn't hash assets or create vendor bundles in order to allow for fast re-builds when running a dev server. It supports sourcemaps and other debugging tools, re-compiles and reloads quickly but is not optimized, and so the app will not be as snappy as it could be. The test environment is intended for test running servers, it ignores assets that aren't needed for testing, and focuses on running all the E2E, regression and unit tests. For more information, see [Vue CLI Environment Modes](https://cli.vuejs.org/guide/mode-and-env.html#modes).

By default:
- `production` is used by `yarn build` (or `vue-cli-service build`) and `yarn build-and-start` and `yarn pm2-start`
- `development` is used by `yarn dev` (or `vue-cli-service serve`)
- `test` is used by `yarn test` (or `vue-cli-service test:unit`)
## Resources for Beginners
New to Web Development? Glad you're here! Dashy is a pretty simple app, so it should make a good candidate for your first PR. Presuming that you already have a basic knowledge of JavaScript, the following articles should point you in the right direction for getting up to speed with the technologies used in this project:
- [Introduction to Vue.js](https://v3.vuejs.org/guide/introduction.html)
- [Vue.js Walkthrough](https://www.taniarascia.com/getting-started-with-vue/)
- [Definitive guide to SCSS](https://blog.logrocket.com/the-definitive-guide-to-scss/)
- [Complete beginners guide to Docker](https://docker-curriculum.com/)
- [Docker Classroom - Interactive Tutorials](https://training.play-with-docker.com/)
- [Quick start TypeScript guide](https://www.freecodecamp.org/news/learn-typescript-in-5-minutes-13eda868daeb/)
- [Complete TypeScript tutorial series](https://www.typescripttutorial.net/)
- [Using TypeScript with Vue.js](https://blog.logrocket.com/vue-typescript-tutorial-examples/)
- [Git cheat sheet](http://git-cheatsheet.com/)
- [Basics of using NPM](https://www.freecodecamp.org/news/what-is-npm-a-node-package-manager-tutorial-for-beginners/)

As well as Node, Git and Docker- you'll also need an IDE (e.g. [VS Code](https://code.visualstudio.com/) or [Vim](https://www.vim.org/)) and a terminal (Windows users may find [WSL](https://docs.microsoft.com/en-us/windows/wsl/) more convenient). 

## Style Guide

Linting is done using [ESLint](https://eslint.org/), and using the [Vue.js Styleguide](https://github.com/vuejs/eslint-config-standard), which is very similar to the [AirBnB Stylguide](https://github.com/airbnb/javascript). You can run `yarn lint` to report and fix issues. While the dev server is running, issues will be reported to the console automatically. Any lint errors will trigger the build to fail. Note that all lint checks must pass before any PR can be merged. Linting is also run as a git pre-commit hook

The most significant things to note are:
- Indentation should be done with two spaces
- Strings should use single quotes
- All statements must end in a semi-colon
- The final element in all objects must be preceded with a comma
- Maximum line length is 100
- There must be exactly one blank line between sections, before function names, and at the end of the file
- With conditionals, put else on the same line as your if block’s closing brace
- All multiline blocks must use braces
- Avoid console statements in the frontend

For the full styleguide, see: [github.com/airbnb/javascript](https://github.com/airbnb/javascript) 

## Frontend Components

All frontend code is located in the `./src` directory, which is split into 5 sub-folders:
- Components - All frontend web components are located here. Each component should have a distinct, well defined and simple task, and ideally should not be too long. The components directory is organised into a series of sub-directories, representing a specific area of the application
  - PageStrcture - Components relating to overall page structure (nav, footer, etc)
  - FormElements - Reusable form elements (button, input field, etc)
  - LinkItems - Components relating to Dashy's sections and items (item group, item, item icon, etc)
  - Configuration - Components relating to Dashy's configuration forms (cloud backup, JSON editor, etc)
- Views - Each view directly corresponds to a route (defined in the router), and in effectively a page. They should have minimal logic, and just contain a few components
- Utils - These are helper functions, or logic that is used within the app does not include an UI elements
- Styles - Any SCSS that is used globally throughout that app, and is not specific to a single component goes here. This includes variables, color themes, typography settings, CSS reset and media queries
- Assets - Static assets that need to be bundled into the application, but do not require any manipulation go here. This includes interface icons and fonts

The structure of the components directory is similar to that of the frontend application layout

<p align="center"><img src="https://i.ibb.co/wJCt0Lq/dashy-page-structure.png" width="600"/></p>

### Updating Dependencies

Running `yarn upgrade` will updated all dependencies based on the ranges specified in the `package.json`. The `yarn.lock` file will be updated, as will the contents of `./node_modules`, for more info, see the [yarn upgrade documentation](https://classic.yarnpkg.com/en/docs/cli/upgrade/). It is important to thoroughly test after any big dependency updates.

## Development Tools

### Performance - Lighthouse
The easiest method of checking performance is to use Chromium's build in auditing tool, Lighthouse. To run the test, open Developer Tools (usually F12) --> Lighthouse and click on the 'Generate Report' button at the bottom.

### Dependencies - BundlePhobia
[BundlePhobia](https://bundlephobia.com/) is a really useful app that lets you analyze the cost of adding any particular dependency to an application

## Directory Structure

### Files in the Root: `./`
```
╮
├── package.json        # Project meta-data, dependencies and paths to scripts
├── src/                # Project front-end source code
├── server.js           # A Node.js server to serve up the /dist directory
├── vue.config.js       # Vue.js configuration
├── Dockerfile          # The blueprint for building the Docker container
├── docker-compose.yml  # A Docker run command
├── .env                # Location for any environmental variables
├── yarn.lock           # Auto-generated list of current packages and version numbers
├── docs/               # Markdown documentation
├── README.md           # Readme, basic info for getting started
├── LICENSE.md          # License for use
╯
```

### Frontend Source: `./src/`

```
./src
├── App.vue                       # Vue.js starting file
├── assets                        # Static non-compiled assets
│  ├── fonts                      # .ttf font files
│  ╰── interface-icons            # SVG icons used in the app 
├── components                    # All front-end Vue web components
│  ├── Configuration              # Components relating to the user config pop-up
│  │  ├── CloudBackupRestore.vue  # Form where the user manages cloud sync options
│  │  ├── ConfigContainer.vue     # Main container, wrapping all other config components
│  │  ├── CustomCss.vue           # Form where the user can input custom CSS
│  │  ├── EditSiteMeta.vue        # Form where the user can edit site meta data
│  │  ╰── JsonEditor.vue          # JSON editor, where the user can modify the main config file
│  ├── FormElements               # Basic form elements used throughout the app
│  │  ├── Button.vue              # Standard button component
│  │  └── Input.vue               # Standard text field input component
│  ├── LinkItems                  # Components for Sections and Link Items
│  │  ├── Collapsable.vue         # The collapsible functionality of sections
│  │  ├── IframeModal.vue         # Pop-up iframe modal, for viewing websites within the app
│  │  ├── Item.vue                # Main link item, which is displayed within an item group
│  │  ├── ItemGroup.vue           # Item group is a section containing icons
│  │  ├── ItemIcon.vue            # The icon used by both items and sections
│  │  ╰── ItemOpenMethodIcon.vue  # A small icon, visible on hover, indicating opening method 
│  ├── PageStrcture               # Components relating the main structure of the page
│  │  ├── Footer.vue              # Footer, visible at the bottom of all pages
│  │  ├── Header.vue              # Header, visible at the top of pages, and includes title and nav
│  │  ├── Nav.vue                 # Navigation bar, includes a list of links
│  │  ╰── PageTitle.vue           # Page title and sub-title, visible within the Header
│  ╰── Settings                   # Components relating to the quick-settings, in the top-right
│     ├── ConfigLauncher.vue      # Icon that when clicked will launch the Configuration component
│     ├── ItemSizeSelector.vue    # Set of buttons used to set and save item size
│     ├── KeyboardShortcutInfo.vue# Small pop-up displaying the available keyboard shortcuts
│     ├── LayoutSelector.vue      # Set of buttons, letting the user select their desired layout
│     ├── SearchBar.vue           # The input field in the header, used for searching the app
│     ├── SettingsContainer.vue   # Container that wraps all the quick-settings components
│     ╰── ThemeSelector.vue       # Drop-down menu enabling the user to select and change themes
├── main.js                       # Main front-end entry point
├── registerServiceWorker.js      # Registers and manages service workers, for PWA apps
├── router.js                     # Defines all available application routes
├── styles                        # Directory of all globally used common SCSS styles
├── utils                         # Directory of re-used helper functions
│  ├── ArrowKeyNavigation.js      # Functionality for arrow-key navigation
│  ├── CloudBackup.js             # Functionality for encrypting, processing and network calls
│  ├── ConfigSchema.json          # The schema, used to validate the users conf.yml file
│  ├── ConfigValidator.js         # A helper script that validates the config file against schema
│  ├── defaults.js                # Global constants and their default values
│  ├── ErrorHandler.js            # Helper function called when an error is returned
│  ├── JsonToYaml.js              # Function that parses and converts raw JSON into valid YAML
│  ╰── ThemeHelper.js             # Function that handles the fetching and setting of user themes
╰── views                         # Directory of available pages, corresponding to available routes
   ╰── Home.vue                   # The home page container
```
---

## Dependencies and Packages

During development I made the conscious decision to not reinvent the wheel if not necessary. It is often really tempting to try an build everything yourself, but sometimes it's just not practical. Often there's packages out there, developed by amazing individuals which are probably built better than I could have done. That being said, I have looked through the code of most these dependencies, to verify that they are both legitimate and efficient.

The following packages are used. Full credit, and massive kudos to each of their authors.

### Core

At it's core, the application uses [Vue.js](https://github.com/vuejs/vue), as well as it's services. Styling is done with [SCSS](https://github.com/sass/sass), JavaScript is currently [Babel](https://github.com/babel/babel), (but I am in the process of converting to [TypeScript](https://github.com/Microsoft/TypeScript)), linting is done with [ESLint](https://github.com/eslint/eslint), the config is defined in [YAML](https://github.com/yaml/yaml), and there is a simple [Node.js](https://github.com/nodejs/node) server to serve up the static app.

### Frontend Components

- [`vue-select`](https://github.com/sagalbot/vue-select) - Dropdown component by @sagalbot `MIT`
- [`vue-js-modal`](https://github.com/euvl/vue-js-modal) - Modal component by @euvl `MIT`
- [`v-tooltip`](https://github.com/Akryum/v-tooltip) - Tooltip component by @Akryum `MIT`
- [`vue-material-tabs`](https://github.com/jairoblatt/vue-material-tabs) - Tab view component by @jairoblatt `MIT`
- [`VJsoneditor`](https://github.com/yansenlei/VJsoneditor) - Interactive JSON editor component by @yansenlei `MIT`
  - Forked from [`JsonEditor`](https://github.com/josdejong/jsoneditor) by @josdejong `Apache-2.0 License`
- [`vue-toasted`](https://github.com/shakee93/vue-toasted) - Toast notification component by @shakee93 `MIT`
- [`vue-prism-editor`](https://github.com/koca/vue-prism-editor) - Lightweight code editor by @koca `MIT`
  - Forked from [`prism.js`](https://github.com/PrismJS/prism) `MIT`

### Utilities

- [`crypto-js`](https://github.com/brix/crypto-js) - Encryption implementations by @evanvosberg and community `MIT`
- [`axios`](https://github.com/axios/axios) - Promise based HTTP client by @mzabriskie and community `MIT`
- [`ajv`](https://github.com/ajv-validator/ajv) - JSON schema Validator by @epoberezkin and community `MIT`

### Server

- [`connect`](https://github.com/senchalabs/connect) - Minimilistic middleware layer for chaining together Node.js requests handled by the server file `MIT`
- [`serve-static`](https://github.com/expressjs/serve-static) - Lightweight static Node file server `MIT`

#### External Services
The 1-Click deploy demo uses [Play-with-Docker Labs](https://play-with-docker.com/). Code is hosted on [GitHub](https://github.com), Docker image is hosted on [DockerHub](https://hub.docker.com/), and the demos are hosted on [Netlify](https://www.netlify.com/).

## Notes

### Known Warnings

When running the build command, several warnings appear. These are not errors, and do not affect the security or performance of the application. They will be addressed in a future update

`WARN  A new version of sass-loader is available. Please upgrade for best experience.` - Currently we're using an older version of SASS loader, since the more recent releases do not seem to be compatible with the Vue CLI's webpack configuration.

`WARN asset size limit: The following asset(s) exceed the recommended size limit (244 KiB).` - For the PWA to support Windows 10, a splash screen asset is required, and is quite large. This throws a warning, however PWA assets are not loaded until needed, so shouldn't have any impact on application performance. A similar warning is thrown for the Raleway font, and that is looking to be addressed.
