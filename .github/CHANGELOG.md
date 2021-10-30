# Changelog

## ✨ 1.8.9 - All New Interactive Config Editor [PR #298](https://github.com/Lissy93/dashy/pull/298)
- Builds a new UI-based config editor
- Support for sections, items, app config and page info
- Live preview, and undoing of local changes
- Export config or write changes to disk through UI

## ✨ 1.8.8 - Improved Item Targets [PR #292](https://github.com/Lissy93/dashy/pull/292)
- Adds support for `_top` and `_parent` anchor targets on items, Re: #289
- Adds `appConfig.defaultOpeningMethod` option to specify default target
- Adds new icons to show items opening method on hover
- Refactors target checking, updates item target docs and schema

## ⚡️ 1.8.7 - Bug Fixes and Improvements [PR #273](https://github.com/Lissy93/dashy/pull/273)
- Clean URLs without the hash, now using history-mode routing
- New initial main example conf.yml
- Minor UI style updates and fixes
- Support for single section view
- A new theme, soft-glow
- Container security in management docs, and other things
- Bug fixes, including missing Firefox favicon and fix custom icon paths with base_url

## ⚡️ 1.8.6 - Implementation of VueX [PR: #271](https://github.com/Lissy93/dashy/pull/271)
- New state management pattern, which should lead to a more organized code base long term, and will also make building out the new UI editor significantly easier to do in a clean and reliable way

## 💄 1.8.5 - Lots of Requested UI Improvements [PR #261](https://github.com/Lissy93/dashy/pull/261)
- Adds an option for landing URL in workspace, Re: #255
- Switches to a new API for generative icons, Re: #163
- Adds new tab functionality to Workspace, Re: #254
- Remove CSS validation in style editor, Re: #259
- Cap item description at 2 lines, Re: #250
- Adds native support for common homelab icons, using dashboard-icons
- Improves general responsiveness of home page sections positioning
- Updates, fixes and adds a bunch of actions for easier repo management

## ✨ 1.8.4 - Custom Error Pages [PR #257](https://github.com/Lissy93/dashy/pull/257)
- Creates a 404 Not Found page
- Routes any missing views to the 404 page

## ⚡️ 1.8.3 - Improved UX for Initial Load [PR #238](https://github.com/Lissy93/dashy/pull/238)
- Removes the old splash screen
- Adds placeholder in the HTML index, which will usually be visible on initial load
- Show progress bar on route switcher

## ✨ 1.8.2 - Serverless Functions for Netlify Instances [PR #235](https://github.com/Lissy93/dashy/pull/235)
- Previously when Dashy was deployed as a static site to Netlify, it was not possible to use several features, which required server-side code
- This PR adds serverless cloud functions to provide most of this functionality

## 🩹 1.8.1 - Additional Languages, Bug Fix, and more [PR #234](https://github.com/Lissy93/dashy/pull/234)
- Merges 5 additional languages
- Adds RickyCZ's dashboard to showcase
- Fixes #323, and improves status indicator tooltip
- Define constants for endpoints
- Updates management, translations and readme docs

## ⚡️ 1.7.7 - Improved Error Handling [PR #226](https://github.com/Lissy93/dashy/pull/226)
- Errors can be viewed via the UI (Config menu --> App Info)
- Service workers should be disabled by default
- Also renames actions to be easier to maintain
- Updates docs to include release schedule + merge strategy

## ✨ 1.7.6 - Adds Multi-Search Support with Bangs [PR #224](https://github.com/Lissy93/dashy/pull/224)
- Adds option for user to add custom search bangs, in order to specify search engine/ target app. Re: #206

## 🎨 1.7.5 - Improved Language Detection & UI [PR #223](https://github.com/Lissy93/dashy/pull/223)
- Makes the auto language detection algo smarter
- Improves responsiveness for the language selector form

## 🌐 1.7.4 - Adds Spanish Translations [PR #222](https://github.com/Lissy93/dashy/pull/222)
- Adds Spanish language file, contributed by @lu4t

## 👷 1.7.3 - CI with GH Actions [PR #212](https://github.com/Lissy93/dashy/pull/212)
- Adds a series of GH actions for repository maintenance and administration
- Auto-labels PR and issues, adds helpful info to PRs based on files changed
- Lints, tests, builds and deploys the app when PR submitted
- Checks app size, dependencies, security, accessibility etc when PR submitted
- Closes incomplete, stale or spammy issues and leaves a comment

## ✨ 1.7.2 - Item Sort Options [PR #203](https://github.com/Lissy93/dashy/pull/203)
- Adds option for user to specify `sortBy` to order items within a section
- Can sort by last clicked, most used, alphabetically and more
- And fixes UI of the item tooltip and, if specified, will show Provider in the tooltip
- Also improves error logging and console warning message

## 🐛 1.7.1 - Lots of Tiny Fixes and Improvements [PR #200](https://github.com/Lissy93/dashy/pull/201)
- Removes background in console art
- Updates auto environmental variables
- Icon image assets max height Force same Icon/Item Height #200
- Adds an action to close spammy issues
- Adds option to enable SRI integrity, plus refactos PWA into defaults
- Updates privacy and security docs
- Adds option for different favicon API for each app [FEATURE_REQUEST] Allow using different faviconApi for each items #196
- Fixes loading of local SVG icons #199

## 🍻 1.7.0 - Documentation Website [PR #190](https://github.com/Lissy93/dashy/pull/190)
- Builds a quick website to host the docs. No code changes, but prepares for V1.7 release

## ✨ 1.6.9 - Web Search Feature [PR #185](https://github.com/Lissy93/dashy/pull/185)
- Adds ability to search the web directly from Dashy by pressing enter on the search bar
- Adds configuration options, for setting default search engine, opening method and disabling
- Adds text under search bar, implements into minimal view also

## ⚡️ 1.6.8 - Improved Loading Experience [PR #183](https://github.com/Lissy93/dashy/pull/183)
- During app initialization, show the build progress and status message
- While requests are being made, show loader at top of screen
- Also adds some UI improvements to Workspace view

## ⚡️ 1.6.7 - Option for non-SSL status checks plus minor things [PR #182](https://github.com/Lissy93/dashy/pull/182)
- Adds an option for user to use status checks with non-HTTPS services, Re: #181
- Updates the .env template, plus the variables used in the server
- Uses the v-cloak to hide text before it's finished loading
- Fixed the parsing of the update-checker during build

## ⚡️ 1.6.6 - Improved Search & Shortcuts [PR #175](https://github.com/Lissy93/dashy/pull/175)
- Refactors the search algorithm to improve performance and code reusability
- Updates search to ignore case, special characters and minor-typos
- Adds the option for user to specify tags, which can be used for searching

## ✨ 1.6.5 - Adds support for Secure Authentication using Keycloak [PR #174](https://github.com/Lissy93/dashy/pull/174)
- Major restructure of auth config
- Implements keycloak support, adds docs and updates schema

## ✨ 1.6.4 - Adds functionality for Granular Auth Control [PR #171](https://github.com/Lissy93/dashy/pull/171)
- Enables sections to be visible for all users except for those specified
- Enables sections to be hidden from all users except for those specified
- Enables sections to be hidden from guests, but visible to all authenticated users

## ⚡️ 1.6.3 - Dependency and Build File Updates [PR #168](https://github.com/Lissy93/dashy/pull/168)
- Removes any dependencies which are not 100% essential
- Moves packages that are only used for building into devDependencies
- Updates dependencies to latest version
- Adds a .dockerignore, so that non-essential files are not included in the container
- Updates deployment config files for Netlify, Heroku and GH actions
- Made a brand new bug-report template, with input fields and validation!

## ✨ 1.6.2 - Support for Guest Access [PR #167](https://github.com/Lissy93/dashy/pull/167)
- Adds functionality for optional read-only guest access to dashboards with authentication
- Can be enabled by setting `appConfig.enableGuestAccess: true`

## 💄 1.6.1 - Adds new Theme [PR #166](https://github.com/Lissy93/dashy/issues/166)
- Adds Dashy theme, for use in the dev dashboard

## ✨ 1.5.9 - New Minimal/ Startpage View [PR #155](https://github.com/Lissy93/dashy/issues/155)
- Adds a new view, called minimal view, designed to be like a light-weight startpage
- Implemented all the required features (filtering, opening methods, icons, etc) into minimal view
- Adds `appConfig.startingView`  into schema, for specifying the initial default view to be loaded

## ✨ 1.5.8 - Multi-Tasking Support in Workspace View [PR #146](https://github.com/Lissy93/dashy/pull/146)
- Adds option to keep launched apps open in the background, to reduce friction when switching between websites, Re: #144
- This can be enabled by setting `appConfig.enableMultiTasking: true`
- Note that having many apps opened simultaneously, will have an impact on performance

## ✨ 1.5.7 - Adds Support for Material Design Icons [PR #141](https://github.com/Lissy93/dashy/pull/141)
- Enables user to use any icon from [materialdesignicons.com](https://dev.materialdesignicons.com/icons), Re: #139
- Also adds support for [simpleicons.org](https://simpleicons.org/)
- Assets only loaded when needed
- Adds docs for using MDI icons

## ⚡️ 1.5.6 - Refactor + Couple of small things [PR #135](https://github.com/Lissy93/dashy/pull/135)
- The main Dockerfile now uses yarn.lock instead of package-lock.json
- Adds a check to verify password is not empty in cloud backup screen
- Improves responsiveness of config modals for mobile devices
- Enables the user to use their own self-hosted Sentry instance
- Removes the View Config tab of the Config menu, as not needed
- Updates and fixes some typos in the readme

## 🌐 1.5.5 - Adds Missing Translations + Small UI Issues [PR #129](https://github.com/Lissy93/dashy/pull/129)
- Adds missing translations to several UI elements, Re: #126
- Fixes login translations not being picked up on page load, Re: #127
- Fixes small text overflow glitch in config icon, Re: #123
- Several small UI improvements: height of config editor, scrollbar on theme dropdown, page height, white-on-white on material theme, etc
- Adds an action to auto-assign reviewer based on ./.github/CODEOWNERS file

## 🐳 1.5.4 - Docker ARM Support [PR #122](https://github.com/Lissy93/dashy/pull/122)
- Adds a Dockerfile for `arm64v8` and `arm32v7`, to support Raspberry Pi and other modern ARM-based devices
- Sets up automated workflow to publish ARM containers to DockerHub after every new release
- Adds documentation for running Dashy on RPi/ ARM-based devices, Re: #117

## 🩹 1.5.3 - UI Quick Fix [PR #121](https://github.com/Lissy93/dashy/pull/121)
- Downgrades and pins vue-material-tabs to 0.1.5, to prevent breaking changes. Fixes #118 p1
- Sets auto-width for theme selector, so text doesn't wrap for long theme names. Fixes #119
- Uses flex layout for config menu, so note doesn't overlap menu on small screens. Fixes #118 p2

## 🌐 1.5.2 - Adds Dutch Translations [PR #120](https://github.com/Lissy93/dashy/pull/120)
- Dutch language support, contributed by @evroon

## 🩹 1.5.1 - UI Quick Fix [PR #116](https://github.com/Lissy93/dashy/pull/116)
- Uses min-max width parent layout, to prevent longer languages (e.g. French) text overflow. Fixes #115

## 🔒 1.5.0 - Improve Robustness of Auth [PR #113](https://github.com/Lissy93/dashy/pull/113)
- Use both username + password for generating token, so that a change in either will log the user out
- Prevent privilege escalation by disallowing a user from modifying their user type through the UI
- Improve the isAuthenticated check, by taking account of empty users array 

## ✨ 1.4.8 - Optional Crash Reports [PR #112](https://github.com/Lissy93/dashy/pull/112)
- Adds an optional, off by default method of getting crash reports
- This can be enabled in `appConfig.enableErrorReporting`, and will not be used at all unless explicitly activated by user
- This is needed for when a user raises a bug which is hard to fix
- Also improves robustness of config accumulator, don't throw error when config is missing
- Adds Privacy & Security docs

## ♻️ 1.4.7 - Refactor [PR #110](https://github.com/Lissy93/dashy/pull/110)
- Moves cloud sync dialog into the config menu, and removes icon on homepage
- Fixes typo in Default theme name, Re #106
- Spell checks readme
- Updates the contributor CI action, that generates list of contributors + sponsors

## 📝 1.4.6 - Documentation Updates [PR #108](https://github.com/Lissy93/dashy/pull/108)
- Breaks many of the longer files into several more digestible articles
- Writes repo pages including, Security, Code of Conduct, Legal, Updates license
- Makes an automatically generated Credits page
- Adds a contributing page, with several ways that users can help out
- Implements this changelog, as requested in #87

## 🌐 1.4.5 - Adds German Translations [PR #107](https://github.com/Lissy93/dashy/pull/107)
- German language support, contributed by @Niklashere

## ✨ 1.4.4 - Adds Support for Logo Image [PR #105](https://github.com/Lissy93/dashy/pull/105)
- Adds option in config file for user to specify path to an image
- If found, will display said image in the header

## ✨ 1.4.3 - Auto-Checks for Updates [PR #101](https://github.com/Lissy93/dashy/pull/101) and [PR #102](https://github.com/Lissy93/dashy/pull/102)
- Write a script to compare current version with git master version
- Periodically checks for updates, and displays message to user
- Enables user to disable update-checks in the config file
- Checks not using vulnerable version on project-build

## ✨ 1.4.2 - Adds Multi-Language Support [PR #99](https://github.com/Lissy93/dashy/pull/99)
- Implements vue-i18n, sets object globally
- Extracts all text to a single JSON file
- Auto-detects users language, and applies, if availible
- Builds a form to let user manually select their language
- Lets users language be saved and read from local storage, or config file

## ✨ 1.4.1 - Adds Support for Custom Key Bindings [PR #94](https://github.com/Lissy93/dashy/pull/94)
- Adds new attribute under item for saving numeric key binding
- Listens for keypress, and launches corresponding item, if found

## ✨ 1.4.0 - Builds a Custom Theme Configurator
- Adds property to save custom theme variables
- Builds UI form, with color pickers, a pallette and popup
- Integrates the saving colors, and applying saved colors functionality

## 🔨 1.3.9 - Enable Custom Styesheet in Docker [PR #92](https://github.com/Lissy93/dashy/pull/92)
- Enables the user to pass a custom stylesheet in with Docker
- Adds support for 1-Click deployment to Render.com

## 🌟 1.3.8 - Showcase [#91](https://github.com/Lissy93/dashy/pull/91)
- Adds @Shadowking001's screenshot to showcase

## 🌟 1.3.7 - Showcase [PR #84](https://github.com/Lissy93/dashy/pull/84)
- Adds @dtctek's screenshot to showcase

## ✨ 1.3.6 - Enables User to Hide Unwanted Components [PR #78](https://github.com/Lissy93/dashy/pull/78)
- Adds several additional options to the config, allowing the user to hide structural components that they don't need
- Including hideHeading, hideNav, hideSearch, hideSettings, hideFooter, hideSplashScreen

## ✨ 1.3.5 - Adds Support for Emoji Icons [PR #76](https://github.com/Lissy93/dashy/pull/76)
- Enables user to use emojis for item and section icons
- Adds a handler to convert Unicode, or Shortcode into an Emoji

## 🌟 1.3.4 - Showcase Addition [PR #75](https://github.com/Lissy93/dashy/pull/75)
- Adds @cerealconyogurt's screenshot to the showcase

## 💄 1.3.3 - UI Improvements [PR #73](https://github.com/Lissy93/dashy/pull/73)
- New style of Large item
- 2 new color themes
- Added CSS variables for search label and footer background
- Improves process for auto-checking if font-awesome is needed
- Silences non-critical warnings in production build
- Adds new optional font-face for cyber punk
- Shortens readme, and adds contribute links to showcase

## ⚡️ 1.3.0 - Custom Headers for Status Check [PR #72](https://github.com/Lissy93/dashy/pull/72)
- Enables user to pass custom headers to the status check endpoint
- Enables user to use a different URL for the status check request

## 🌟 1.2.9 - Creates a Showcase Page [PR #68](https://github.com/Lissy93/dashy/pull/68)
- Adds a page in the docs for users to share their screenshots of their dashboard

## ✨ 1.2.8 - Adds Remember-Me Functionality into the Login Form [PR #66](https://github.com/Lissy93/dashy/pull/66)
- Adds a dropdown menu in the login form with various time intervals available
- Adds appropriate expiry into session storage, in order to keep user logged in for their desired time interval

## ✨ 1.2.7 - Implements a Right-Click Context Menu [#62](https://github.com/Lissy93/dashy/pull/62)
- Built a context menu, showing all item opening methods, on right-click
- Made a clickOutside directive, in order to close menu when user clicks away
- Adds launching functionality, user can click to launch

## ⚡️ 1.2.6 - Make Font Assets Local [PR #60](https://github.com/Lissy93/dashy/pull/60)
- Downloaded font files to assets
- Removed all calls to font CDN, replaced with local calls

## 🐛 1.2.5 - Small Fixes, and Efficiency Improvements [PR #57](https://github.com/Lissy93/dashy/pull/57)
- Adds correct license
- Improves service workers, and adds serviceWorkerStatus local storage item
- Adds missing statusCheck and statusCheckInterval docs into Configuring.md
- Adds an About App page, containing info needed to raise a bug report
- Adds TDLR license into main readme
- Introduces app versioning
- Adds safeguards into ConfigAccumalaror, to prevent error being thrown
- Updates PR template
- Improved Webpack build experience, with progress bar and completion notification
- Adds new and improved icons for layout options
- Make the Page Title into a home page link
- Adds missing favicon, fixes #55
- Adds assets to PWA manifest.json
- Documents app commands in readme
- Enable passing website as URL param to the workspace
- Modified items, so that title text doesn't get shortened, 

## ✨ 1.2.4 - Adds Support for Continuous Status Checking [#52](https://github.com/Lissy93/dashy/pull/52)
- Enables user to re-call the status check at a specified interval
- Processes interval in ms, and updates the traffic light when required

## 🐛 1.2.3 - Bug Fix [PR #49](https://github.com/Lissy93/dashy/pull/49)
- Removes duplicate Docker env var, fixes #48

## ✨ 1.2.2 - Better Favicon Support
- Enables user to force direct/ local favicon fetching
- Adds support for additional favicon API, returning high-res app icons
- Adds support for generative icons

## 🐛 1.2.1 - Bugfix [#44](https://github.com/Lissy93/dashy/pull/44)
- Fixes footer positioning on mobile, makes sticky, fixes #42

## ✨ 1.2.0 - Adds Writing Config to Disk from UI Functionality [PR #43](https://github.com/Lissy93/dashy/pull/43)
- Creates a new server endpoint for handling the backing up of a the file
- Adds backup existing file functionality
- Adds writing new file functionality
- Does error checking, testing and adds some security parameters
- Adds a radio button in the UI, so user chan choose save method
- Process config within the UI, convert to YAML, and write changes to disk

## 🐛 1.1.8 - Bugfix [#40](https://github.com/Lissy93/dashy/pull/40)
- Status check tooltip was not visible in Material themes, raised in issue #39

## ✨ 1.1.7 - Adds Workspace View [PR #38](https://github.com/Lissy93/dashy/pull/38)
- Adds a new route, for the workspace view
- Builds the sidebar, which displays the users apps
- Loads the app into the workspace's main iframe when clicked
- Adds some collapsing functionality, better styles, subtle animations and theme support

## ✨ 1.1.6 - Implements Status Indicators, and Monitoring Functionality [PR #34](https://github.com/Lissy93/dashy/pull/34)
- Wrote a Node endpoint for pinging the users desired services
- Added status checking functionality in frontend
- Build small traffic-light component to display status of users services
- Adds animations, and handles errors
- Writes docs, and tests code

## ✨ 1.1.5 - Adds Authentication / Login Functionality [PR #32](https://github.com/Lissy93/dashy/pull/32)
- Enables the user to protect their dashboard behind a login screen
- Creates a Authentication handler to manage the hashing of passwords, and generation of a token
- Build a quick login form, where user can input username and password
- Adds a log out button

## 💄 1.1.4 - Support for Custom HTML Footer [PR #30](https://github.com/Lissy93/dashy/pull/30)
- Enables user to insert structure for the footer defined as HTML

## 🚀 1.1.3 - Adds Support for 1-Click Cloud Deployments [PR #29](https://github.com/Lissy93/dashy/pull/29)
- Support for 1-Click Deploy to Netlify
- Support for 1-Click Deploy to Heroku

## 🔧 1.1.2 - Docker Efficiency Improvements [PR #26](https://github.com/Lissy93/dashy/pull/26)
- Writes a Node health check script, and implements into the Docker container
- Changes default port in docker-compose, as 8080 is commonly used by other apps
- Adds the 1-Click deploy with PWD into the readme
- Updates dependencies
- Adds a getting started guide to the docs
- Adds splash screen for first load
- Deleted unused assets
- Makes linter run as a pre-commit hook
- Fixes lint errors in server.js and validate-config.js

## 🐛 1.1.1 - Bug Fixes [PR #20](https://github.com/Lissy93/dashy/pull/20) + [PR #21](https://github.com/Lissy93/dashy/pull/21)
- Adds issue template
- Bug fixes
    - Improves github PR and issue templates
    - Shortens readme file
    - Adds documentation in the docs folder
    - Fixes Layout tab not showing in portrait #19 
    - Improves mobile performance for both the settings, config and backup pop-ups
    - Fixes issue where theme not applied on load when the settings are hidden
    - Adds minimum dimensions to modalsShortens readme file
    - Adds documentation in the docs folder
    - Adds minimum dimensions to modals

## 🚑️ 1.1.0 - Hotfix [#18](https://github.com/Lissy93/dashy/pull/18)
- Implementing the JSON validator had actually broken the entire JSON editor
- Fixed it by remove explicit use of Ajv, and using a derivative instead

## 📝 1.0.5 - Documentation [PR #16](https://github.com/Lissy93/dashy/pull/16)
- Previously there was very little documentation, this release fixed that
- Wrote specific docs for:
    - Getting Started
    - Configuring
    - Backup & Restore
    - Theming
    - Developing

## ✨ 1.0.0 - Implements Config Validation [PR #13](https://github.com/Lissy93/dashy/pull/13)
- Write a JSON schema for the conf.yml file
- Wrote a validation script to compare users config against schema
- Adds a formatter to print helpful messages about what needs fixing
- Implements validation process into build script
- Implements validation process into UI config configurator's validation

## 🔧 0.9.5 - Brand New Docker Container [PR #12](https://github.com/Lissy93/dashy/pull/12)
- With help from several users, a new container based on Alpine is released
- A sample Docker Compose script is also written, and docs are updated
- A 1-Click button for deploying to Play-with-Docker is added to the Readme

## ✨ 0.9.0 - Adds Hide Settings Functionality [PR #11](https://github.com/Lissy93/dashy/pull/11)
- Enables user to hide settings from UI
- Users preference is saved in local storage
- User can hide other structural elements of the UI from the config

## 💄 0.8.5 - Adds new Built-In Themes [PR #9](https://github.com/Lissy93/dashy/pull/9)
- Adds Minimal-Dark and Minimal-Light theme
- Adds Material-Dark and Material-Light theme
- Adds additional theme docs
- Adds option for sections to have items too

## ✨ 0.8.0 - Implements Custom CSS Editor [PR: #8](https://github.com/Lissy93/dashy/pull/8)
- Adds a page in the config menu
- Adds syntax highlighting, CSS validation and sanitization
- Saves users CSS, and applies styles on page load

## ✨ 0.7.5 - Adds Cloud Backup and Restore Feature [PR #6](https://github.com/Lissy93/dashy/pull/6)
- Creates a form for entering backup ID and decryption password
- Puts form in modal, and adds button to launch form, with custom icon
- Implemented the cryptography stuff for end-to-end data encryption
- Wrote and tested the backend, and deployed as a serverless function on CF workers
- On the frontend, users input is encrypted, and passed to backend cloud function
- Response from the backend is handles appropriately, and message displayed to the user
- Implements the restoring from server functionality, with data integrity checks

## ✨ 0.7.0 - Support for Custom Nav Links [PR #4](https://github.com/Lissy93/dashy/pull/4)
- User can add custom nav bar links from the Config Settings menu
- Better UI styling to the config menu
- New icons inside buttons

## ✨ 0.6.5 - UI Config Editor [PR #3](https://github.com/Lissy93/dashy/pull/3)
Adds the ability for the user to edit their configuration directly from the UI
- Edit all section and item data using a rich JSON editor
- Download/ backup conf.yml directly from the UI
- Edit site meta data: title, description, footer, etc
- Reset all locally stored data to the initial state
- Also includes a new toast component, for subtle notifications

## ✨ 0.6.0 - Navbar, Footer and Background Image
- Adds option for a custom full-size background image
- Made footer customizable
- Fixes error being thrown when navbar links are empty

## ⚡️ 0.5.5 - Improved Theming
- Makes more specific color variables, which inherit base vars
- Makes it possible for users to write their own theme
- Fix some color edge cases
- Adds docs for theming 

## ✨ 0.5.0 - Theme Support
- Converts all SCSS variables to CSS variables
- Implements theme switching functionality
- Adds a dropdown menu, enabling user to select theme
- Adds an initial theme option to `appConfig.theme`
- Saves selected theme to local storage
- Wrote a ton of color themes

## ✨ 0.4.5 - Keyboard Navigation
- Implements arrow key navigation

## ✨ 0.4.0 - Font Awesome Support
- Adds support for Font-Awesome icons
- Auto-loads font-awesome only when needed
- Adds support for SVG icons

## ✨ 0.3.5 - Opening Method
- Shows opening method on hover
- Opening method can be specified in config, as `item[n].target`

## 🔨 0.3.0 - Docker
- Writes a Dockerfile

## 🎨 0.2.5 - Code Quality, Docs and UI
- Huge code quality overhaul, now uses AirBnB style ESLint
- Adds in-code docs, removes unneeded code, moves reusable helpers into utils dir
- Adds a readme, records a demo gif and adds some basic deployment docs
- Removes dependencies which are not 100% necessary

## ✨ 0.2.0 - Collapsible Sections
- Implements collapsing functionality, for less used or very long sections
- Sections can read default state from `section[n].collapsed` within config
- After change, state of each section is stored in local storage

## ⚡️ 0.1.5 - Search and Navigation
- Improves instant search functionality
- Implements keyboard navigation for selecting items
- Launch selected item with enter, or Ctrl + Enter to open in new tab

## 🎉 0.1.0 - Init
Project started. Forked from [Lissy93/Dash](https://github.com/Lissy93/dash)
