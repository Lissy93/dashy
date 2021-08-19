
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

1. Get Code: `git clone https://github.com/Lissy93/dashy.git`
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

### Environmental Variables
All environmental variables are optional. Currently there are not many environmental variables used, as most of the user preferences are stored under `appConfig` in the `conf.yml` file.

You can set variables within your local development environment using a `.env` file.

Any environmental variables used by the frontend are preceded with `VUE_APP_`. Vue will merge the contents of your `.env` file into the app in a similar way to the ['dotenv'](https://github.com/motdotla/dotenv) package, where any variables that you set on your system will always take preference over the contents of any `.env` file.

- `PORT` - The port in which the application will run (defaults to `4000` for the Node.js server, and `80` within the Docker container)
- `NODE_ENV` - Which environment to use, either `production`, `development` or `test`
- `VUE_APP_DOMAIN` - The URL where Dashy is going to be accessible from. This should include the protocol, hostname and (if not 80 or 443), then the port too, e.g. `https://localhost:3000`, `http://192.168.1.2:4002` or `https://dashy.mydomain.com`


If you do add new variables, ensure that there is always a fallback (define it in [`defaults.js`](https://github.com/Lissy93/dashy/blob/master/src/utils/defaults.js)), so as to not cause breaking changes. Don't commit your `.env` file to git, but instead take a few moments to document what you've added under the appropriate section. Try and follow the concepts outlined in the [12 factor app](https://12factor.net/config).


### Environment Modes
You can set the environment using the `NODE_ENV` variable.
The correct environment will be selected based on the script you run by default
The following environments are supported.
- `production`
- `development`
- `test`

For more info, see [Vue CLI Environment Modes](https://cli.vuejs.org/guide/mode-and-env.html#modes).

---

## Git Strategy

### Git Flow
Like most Git repos, we are following the [Github Flow](https://guides.github.com/introduction/flow) standard.

1. Create a branch (or fork if you don'd have write acces)
2. Code some awesome stuff, then add and commit your changes
3. Create a Pull Request, complete the checklist and ensure the build succeeds
4. Follow up with any reviews on your code
5. Merge 🎉

### Git Branch Naming
The format of your branch name should be something similar to: `[TYPE]/[TICKET]_[TITLE]`
For example, `FEATURE/420_Awesome-feature` or `FIX/690_login-server-error`

### Commit Emojis
Using a single emoji at the start of each commit message, to indicate the type task, makes the commit ledger easier to understand, plus it looks cool.

- 🎨 `:art:` - Improve structure / format of the code.
- ⚡️ `:zap:` - Improve performance.
- 🔥 `:fire:` - Remove code or files.
- 🐛 `:bug:` - Fix a bug.
- 🚑️ `:ambulance:` - Critical hotfix
- ✨ `:sparkles:` - Introduce new features.
- 📝 `:memo:` - Add or update documentation.
- 🚀 `:rocket:` - Deploy stuff.
- 💄 `:lipstick:` - Add or update the UI and style files.
- 🎉 `:tada:` - Begin a project.
- ✅ `:white_check_mark:` - Add, update, or pass tests.
- 🔒️ `:lock:` - Fix security issues.
- 🔖 `:bookmark:` - Make a Release or Version tag.
- 🚨 `:rotating_light:` - Fix compiler / linter warnings.
- 🚧 `:construction:` - Work in progress.
- ⬆️ `:arrow_up:` - Upgrade dependencies.
- 👷 `:construction_worker:` - Add or update CI build system.
- ♻️ `:recycle:` - Refactor code.
- 🩹 `:adhesive_bandage:` - Simple fix for a non-critical issue.
- 🔧 `:wrench:` - Add or update configuration files.
- 🍱 `:bento:` - Add or update assets.
- 🗃️ `:card_file_box:` - Perform database schema related changes.
- ✏️ `:pencil2:` - Fix typos.
- 🌐 `:globe_with_meridians:` - Internationalization and translations.

For a full list of options, see [gitmoji.dev](https://gitmoji.dev/)

### PR Guidelines
Once you've made your changes, and pushed them to your fork or branch, you're ready to open a pull request!

For a pull request to be merged, it must:
- Must be backwards compatible
- The build, lint and tests (run by GH actions) must pass
- There must not be any merge conflicts

When you submit your PR, include the required info, by filling out the PR template. Including:
- A brief description of your changes
- The issue, ticket or discussion number (if applicable)
- For UI relate updates include a screenshot
- If any dependencies were added, explain why it was needed, state the cost associated, and confirm it does not introduce any security issues
- Finally, check the checkboxes, to confirm that the standards are met, and hit submit!

---
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

---

## Style Guide

Linting is done using [ESLint](https://eslint.org/), and using the [Vue.js Styleguide](https://github.com/vuejs/eslint-config-standard), which is very similar to the [AirBnB Stylguide](https://github.com/airbnb/javascript). You can run `yarn lint` to report and fix issues. While the dev server is running, issues will be reported to the console automatically, and any lint errors will trigger the build to fail. Note that all lint checks must pass before any PR can be merged. Linting is also run as a git pre-commit hook

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

Styleguides:
- Vue: [Vue styleguide](https://vuejs.org/v2/style-guide/)
- JavaScript: [github.com/airbnb/javascript](https://github.com/airbnb/javascript) 

---

## Application Structure

### Directory Structure

#### Files in the Root: `./`
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

#### Frontend Source: `./src/`

```
./src
├── App.vue                       # Vue.js starting file
├── assets                        # Static non-compiled assets
│  ├── fonts                      # .ttf font files
│  ├── locales                    # All app text, each language in a separate JSON file
│  ╰── interface-icons            # SVG icons used in the app 
├── components                    # All front-end Vue web components
│  ├── Configuration              # Components relating to the user config pop-up
│  │  ├── AppInfoModal.vue        # A modal showing core app info, like version, language, etc
│  │  ├── CloudBackupRestore.vue  # Form where the user manages cloud sync options
│  │  ├── ConfigContainer.vue     # Main container, wrapping all other config components
│  │  ├── CustomCss.vue           # Form where the user can input custom CSS
│  │  ├── EditSiteMeta.vue        # Form where the user can edit site meta data
│  │  ├── JsonEditor.vue          # JSON editor, where the user can modify the main config file
│  │  ╰── RebuildApp.vue          # A component allowing user to trigger a rebuild through the UI
│  ├── FormElements               # Basic form elements used throughout the app
│  │  ├── Button.vue              # Standard button component
│  │  ╰── Input.vue               # Standard text field input component
│  ├── LinkItems                  # Components for Sections and Link Items
│  │  ├── Collapsable.vue         # The collapsible functionality of sections
│  │  ├── ContextMenu.vue         # The right-click menu, for showing Item opening methods and info
│  │  ├── IframeModal.vue         # Pop-up iframe modal, for viewing websites within the app
│  │  ├── Item.vue                # Main link item, which is displayed within an item group
│  │  ├── ItemGroup.vue           # Item group is a section containing icons
│  │  ├── ItemIcon.vue            # The icon used by both items and sections
│  │  ├── ItemOpenMethodIcon.vue  # A small icon, visible on hover, indicating opening method 
│  │  ╰── StatusIndicator.vue     # Traffic light dot, showing if app is online or down
│  ├── PageStrcture               # Components relating the main structure of the page
│  │  ├── Footer.vue              # Footer, visible at the bottom of all pages
│  │  ├── Header.vue              # Header, visible at the top of pages, and includes title and nav
│  │  ├── LoadingScreen.vue       # Splash screen shown on first load
│  │  ├── Nav.vue                 # Navigation bar, includes a list of links
│  │  ╰── PageTitle.vue           # Page title and sub-title, visible within the Header
│  ╰── Settings                   # Components relating to the quick-settings, in the top-right
│     ├── AuthButtons.vue          # Logout button and other app info
│     ├── ConfigLauncher.vue      # Icon that when clicked will launch the Configuration component
│     ├── CustomThemeMaker.vue    # Color pickers for letting user build their own theme
│     ├── ItemSizeSelector.vue    # Set of buttons used to set and save item size
│     ├── KeyboardShortcutInfo.vue# Small pop-up displaying the available keyboard shortcuts
│     ├── LanguageSwitcher.vue    # Dropdown in a modal for changing app language
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
│  ├── Auth.js                    # Handles all authentication related actions
│  ├── ClickOutside.js            # A directive for detecting click, used to hide dropdown, modal or context menu
│  ├── ConfigAccumulator.js       # Central place for managing and combining config
│  ├── ConfigHelpers.js           # Helper functions for managing configuration
│  ├── CloudBackup.js             # Functionality for encrypting, processing and network calls
│  ├── ConfigSchema.json          # The schema, used to validate the users conf.yml file
│  ├── ConfigValidator.js         # A helper script that validates the config file against schema
│  ├── defaults.js                # Global constants and their default values
│  ├── ErrorHandler.js            # Helper function called when an error is returned
│  ├── JsonToYaml.js              # Function that parses and converts raw JSON into valid YAML
│  ├── languages.js               # Handles fetching, switching and validating languages
│  ╰── ThemeHelper.js             # Function that handles the fetching and setting of user themes
╰── views                         # Directory of available pages, corresponding to available routes
   ├── Home.vue                   # The home page container
   ├── About.vue                  # About page
   ├── Login.vue                  # TAuthentication page
   ├── Minimal.vue                # The minimal view
   ╰── Workspace.vue              # The workspace view with apps in sidebar
```

### Frontend Components

All frontend code is located in the `./src` directory, which is split into 5 sub-folders:
- **Components** - All frontend web components are located here. Each component should have a distinct, well defined and simple task, and ideally should not be too long. The components directory is organised into a series of sub-directories, representing a specific area of the application
  - **PageStrcture** - Components relating to overall page structure (nav, footer, etc)
  - FormElements - Reusable form elements (button, input field, etc)
  - LinkItems - Components relating to Dashy's sections and items (item group, item, item icon, etc)
  - Configuration - Components relating to Dashy's configuration forms (cloud backup, JSON editor, etc)
- **Views** - Each view directly corresponds to a route (defined in the router), and in effectively a page. They should have minimal logic, and just contain a few components
- **Utils** - These are helper functions, or logic that is used within the app does not include an UI elements
- **Styles** - Any SCSS that is used globally throughout that app, and is not specific to a single component goes here. This includes variables, color themes, typography settings, CSS reset and media queries
- **Assets** - Static assets that need to be bundled into the application, but do not require any manipulation go here. This includes interface icons and fonts

The structure of the components directory is similar to that of the frontend application layout

<p align="center"><img src="https://i.ibb.co/wJCt0Lq/dashy-page-structure.png" width="600"/></p>


---

## Development Tools

### Performance - Lighthouse
The easiest method of checking performance is to use Chromium's build in auditing tool, Lighthouse. To run the test, open Developer Tools (usually F12) --> Lighthouse and click on the 'Generate Report' button at the bottom.

### Dependencies - BundlePhobia
[BundlePhobia](https://bundlephobia.com/) is a really useful app that lets you analyze the cost of adding any particular dependency to an application

---
## Notes

### Known Warnings

When running the build command, several warnings appear. These are not errors, and do not affect the security or performance of the application. They will be addressed in a future update

`WARN  A new version of sass-loader is available. Please upgrade for best experience.` - Currently we're using an older version of SASS loader, since the more recent releases do not seem to be compatible with the Vue CLI's webpack configuration.

`WARN asset size limit: The following asset(s) exceed the recommended size limit (244 KiB).` - For the PWA to support Windows 10, a splash screen asset is required, and is quite large. This throws a warning, however PWA assets are not loaded until needed, so shouldn't have any impact on application performance. A similar warning is thrown for the Raleway font, and that is looking to be addressed.

`glob-parent Security Alert` - This will be fixed soon. The version of glob-parent that is used by the latest version of Vue-CLI has a security issue associated with it. I am waiting on Vue to update their dependencies.
