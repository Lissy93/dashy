# Changelog

## 1.4.5
## 1.4.4
## 1.4.3
## 1.4.2
## 1.4.1
## 1.4.0
## 1.3.9
## 1.3.8 - Builds a Custom Theme Configurator
- Adds property to enable the user

## 1.3.7 - Enable Custom Styesheet in Docker [PR #92](https://github.com/Lissy93/dashy/pull/92)
- Enables the user to pass a custom stylesheet in with Docker
- Adds support for 1-Click deployment to Render.com

## 1.3.6 - Showcase [#91](https://github.com/Lissy93/dashy/pull/91)
- Adds @Shadowking001's screenshot to showcase

## 1.3.5 - Showcase [PR #84](https://github.com/Lissy93/dashy/pull/84)
- Adds @dtctek's screenshot to showcase

## 1.3.4 - Enables User to Hide Unwanted Components [PR #78](https://github.com/Lissy93/dashy/pull/78)
- Adds several additional options to the config, allowing the user to hide structural components that they don't need
- Including hideHeading, hideNav, hideSearch, hideSettings, hideFooter, hideSplashScreen

## 1.3.3 - Adds Support for Emoji Icons [PR #76](https://github.com/Lissy93/dashy/pull/76)
- Enables user to use emojis for item and section icons
- Adds a handler to convert Unicode, or Shortcode into an Emoji

## 1.3.2 - Showcase Addition [PR #75](https://github.com/Lissy93/dashy/pull/75)
- Adds @cerealconyogurt's screenshot to the showcase

## 1.3.1 - UI Improvements [PR #73](https://github.com/Lissy93/dashy/pull/73)
- New style of Large item
- 2 new color themes
- Added CSS variables for search label and footer background
- Improves process for auto-checking if font-awesome is needed
- Silences non-critical warnings in production build
- Adds new optional font-face for cyber punk
- Shortens readme, and adds contribute links to showcase

## 1.3.0 - Custom Headers for Status Check [PR #72](https://github.com/Lissy93/dashy/pull/72)
- Enables user to pass custom headers to the status check endpoint
- Enables user to use a different URL for the status check request

## 1.2.9 - Creates a Showcase Page [PR #68](https://github.com/Lissy93/dashy/pull/68)
- Adds a page in the docs for users to share their screenshots of their dashboard

## 1.2.8 - Adds Remember-Me Functionality into the Login Form [PR #66](https://github.com/Lissy93/dashy/pull/66)
- Adds a dropdown menu in the login form with various time intervals available
- Adds appropriate expiry into session storage, in order to keep user logged in for their desired time interval

## 1.2.7 - Implements a Right-Click Context Menu [#62](https://github.com/Lissy93/dashy/pull/62)
- Built a context menu, showing all item opening methods, on right-click
- Made a clickOutside directive, in order to close menu when user clicks away
- Adds launching functionality, user can click to launch

## 1.2.6 - Make Font Assets Local [PR #60](https://github.com/Lissy93/dashy/pull/60)
- Downloaded font files to assets
- Removed all calls to font CDN, replaced with local calls

## 1.2.5 - Small Fixes, and Efficiency Improvements [PR #57](https://github.com/Lissy93/dashy/pull/57)
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

## 1.2.4 - Adds Support for Continuous Status Checking [#52](https://github.com/Lissy93/dashy/pull/52)
- Enables user to re-call the status check at a specified interval
- Processes interval in ms, and updates the traffic light when required

## 1.2.3 - Bug Fix [PR #49](https://github.com/Lissy93/dashy/pull/49)
- Removes duplicate Docker env var, fixes #48

## 1.2.2 - Better Favicon Support
- Enables user to force direct/ local favicon fetching
- Adds support for additional favicon API, returning high-res app icons
- Adds support for generative icons

## 1.2.1 - Bugfix [#44](https://github.com/Lissy93/dashy/pull/44)
- Fixes footer positioning on mobile, makes sticky, fixes #42

## 1.2.0 - Adds Writing Config to Disk from UI Functionality [PR #43](https://github.com/Lissy93/dashy/pull/43)
- Creates a new server endpoint for handling the backing up of a the file
- Adds backup existing file functionality
- Adds writing new file functionality
- Does error checking, testing and adds some security parameters
- Adds a radio button in the UI, so user chan choose save method
- Process config within the UI, convert to YAML, and write changes to disk

## 1.1.8 - Bugfix [#40](https://github.com/Lissy93/dashy/pull/40)
- Status check tooltip was not visible in Material themes, raised in issue #39

## 1.1.7 - Adds Workspace View [PR #38](https://github.com/Lissy93/dashy/pull/38)
- Adds a new route, for the workspace view
- Builds the sidebar, which displays the users apps
- Loads the app into the workspace's main iframe when clicked
- Adds some collapsing functionality, better styles, subtle animations and theme support

## 1.1.6 - Implements Status Indicators, and Monitoring Functionality [PR #34](https://github.com/Lissy93/dashy/pull/34)
- Wrote a Node endpoint for pinging the users desired services
- Added status checking functionality in frontend
- Build small traffic-light component to display status of users services
- Adds animations, and handles errors
- Writes docs, and tests code

## 1.1.5 - Adds Authentication / Login Functionality [PR #32](https://github.com/Lissy93/dashy/pull/32)
- Enables the user to protect their dashboard behind a login screen
- Creates a Authentication handler to manage the hashing of passwords, and generation of a token
- Build a quick login form, where user can input username and password
- Adds a log out button

## 1.1.4 - Support for Custom HTML Footer [PR #30](https://github.com/Lissy93/dashy/pull/30)
- Enables user to insert structure for the footer defined as HTML

## 1.1.3 - Adds Support for 1-Click Cloud Deployments [PR #29](https://github.com/Lissy93/dashy/pull/29)
- Support for 1-Click Deploy to Netlify
- Support for 1-Click Deploy to Heroku

## 1.1.2 - Docker Efficiency Improvements [PR #26](https://github.com/Lissy93/dashy/pull/26)
- Writes a Node health check script, and implements into the Docker container
- Changes default port in docker-compose, as 8080 is commonly used by other apps
- Adds the 1-Click deploy with PWD into the readme
- Updates dependencies
- Adds a getting started guide to the docs
- Adds splash screen for first load
- Deleted unused assets
- Makes linter run as a pre-commit hook
- Fixes lint errors in server.js and validate-config.js

## 1.1.1 - Bug Fixes [PR #20](https://github.com/Lissy93/dashy/pull/20) + [PR #21](https://github.com/Lissy93/dashy/pull/21)
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

## 1.1.0 - Hotfix [#18](https://github.com/Lissy93/dashy/pull/18)
- Implementing the JSON validator had actually broken the entire JSON editor
- Fixed it by remove explicit use of Ajv, and using a derivative instead

## 1.0.5 - Documentation [PR #16](https://github.com/Lissy93/dashy/pull/16)
- Previously there was very little documentation, this release fixed that
- Wrote specific docs for:
    - Getting Started
    - Configuring
    - Backup & Restore
    - Theming
    - Developing

## 1.0.0 - Implements Config Validation [PR #13](https://github.com/Lissy93/dashy/pull/13)
- Write a JSON schema for the conf.yml file
- Wrote a validation script to compare users config against schema
- Adds a formatter to print helpful messages about what needs fixing
- Implements validation process into build script
- Implements validation process into UI config configurator's validation

## 0.9.5 - Brand New Docker Container [PR #12](https://github.com/Lissy93/dashy/pull/12)
- With help from several users, a new container based on Alpine is released
- A sample Docker Compose script is also written, and docs are updated
- A 1-Click button for deploying to Play-with-Docker is added to the Readme

## 0.9.0 - Adds Hide Settings Functionality [PR #11](https://github.com/Lissy93/dashy/pull/11)
- Enables user to hide settings from UI
- Users preference is saved in local storage
- User can hide other structural elements of the UI from the config

## 0.8.5 - Adds new Built-In Themes [PR #9](https://github.com/Lissy93/dashy/pull/9)
- Adds Minimal-Dark and Minimal-Light theme
- Adds Material-Dark and Material-Light theme
- Adds additional theme docs
- Adds option for sections to have items too

## 0.8.0 - Implements Custom CSS Editor [PR: #8](https://github.com/Lissy93/dashy/pull/8)
- Adds a page in the config menu
- Adds syntax highlighting, CSS validation and sanitization
- Saves users CSS, and applies styles on page load

## 0.7.5 - Adds Cloud Backup and Restore Feature [PR #6](https://github.com/Lissy93/dashy/pull/6)
- Creates a form for entering backup ID and decryption password
- Puts form in modal, and adds button to launch form, with custom icon
- Implemented the cryptography stuff for end-to-end data encryption
- Wrote and tested the backend, and deployed as a serverless function on CF workers
- On the frontend, users input is encrypted, and passed to backend cloud function
- Response from the backend is handles appropriately, and message displayed to the user
- Implements the restoring from server functionality, with data integrity checks

## 0.7.0 - Support for Custom Nav Links [PR #4](https://github.com/Lissy93/dashy/pull/4)
- User can add custom nav bar links from the Config Settings menu
- Better UI styling to the config menu
- New icons inside buttons

## 0.6.5 - UI Config Editor [PR #3](https://github.com/Lissy93/dashy/pull/3)
Adds the ability for the user to edit their configuration directly from the UI
- Edit all section and item data using a rich JSON editor
- Download/ backup conf.yml directly from the UI
- Edit site meta data: title, description, footer, etc
- Reset all locally stored data to the initial state
- Also includes a new toast component, for subtle notifications

## 0.6.0
- Adds option for a custom full-size background image
- Made footer customizable
- Fixes error being thrown when navbar links are empty

## 0.5.5
- Makes more specific color variables, which inherit base vars
- Makes it possible for users to write their own theme
- Fix some color edge cases
- Adds docs for theming 

## 0.5.0
- Converts all SCSS variables to CSS variables
- Implements theme switching functionality
- Adds a dropdown menu, enabling user to select theme
- Adds an initial theme option to `appConfig.theme`
- Saves selected theme to local storage
- Wrote a ton of color themes

## 0.4.5
- Implements arrow key navigation

## 0.4.0
- Adds support for Font-Awesome icons
- Auto-loads font-awesome only when needed
- Adds support for SVG icons

## 0.3.5
- Shows opening method on hover
- Opening method can be specified in config, as `item[n].target`

## 0.3.0
- Docker support

## 0.2.5
- Huge code quality overhaul, now uses AirBnB style ESLint
- Adds in-code docs, removes unneeded code, moves reusable helpers into utils dir
- Adds a readme, records a demo gif and adds some basic deployment docs
- Removes dependencies which are not 100% necessary

## 0.2.0
- Implements collapsing functionality, for less used or very long sections
- Sections can read default state from `section[n].collapsed` within config
- After change, state of each section is stored in local storage

## 0.1.5
- Improves instant search functionality
- Implements keyboard navigation for selecting items
- Launch selected item with enter, or Ctrl + Enter to open in new tab

## 0.1.0
Project started. Forked from [Lissy93/Dash](https://github.com/Lissy93/dash)