# Credits

## Sponsors
<!-- sponsors --><!-- sponsors -->
## Contributors
<!-- readme: contributors -start -->
<!-- readme: contributors -end -->

## Helpful Users
<!-- readme: collaborators -start -->
<!-- readme: collaborators -end -->

## Bots
<!-- readme: liss-bot,bots -start -->
<!-- readme: liss-bot,bots -end -->

## Dependencies 🔗

This app definitely wouldn't have been quite so possible without the making use of the following package and components. Full credit and big kudos to their respective authors, who've done an amazing job in building and maintaining them.

##### Core
At it's core, the application uses [Vue.js](https://github.com/vuejs/vue), as well as it's services. Styling is done with [SCSS](https://github.com/sass/sass), JavaScript is currently [Babel](https://github.com/babel/babel), (but I am in the process of converting to [TypeScript](https://github.com/Microsoft/TypeScript)), linting is done with [ESLint](https://github.com/eslint/eslint), the config is defined in [YAML](https://github.com/yaml/yaml), and there is a simple [Node.js](https://github.com/nodejs/node) server to serve up the static app.

##### Utilities
- [`crypto-js`](https://github.com/brix/crypto-js) - Encryption implementations by @evanvosberg and community `MIT`
- [`axios`](https://github.com/axios/axios) - Promise based HTTP client by @mzabriskie and community `MIT`
- [`ajv`](https://github.com/ajv-validator/ajv) - JSON schema Validator by @epoberezkin and community `MIT`
- [`vue-i18n`](https://github.com/kazupon/vue-i18n) - Internationalization plugin by @kazupon and community `MIT`

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
- [`vue-swatches`](https://github.com/saintplay/vue-swatches) - Color palete picker by @saintplay `MIT`

##### Backup & Sync Server
Although the app is purely frontend, there is an optional cloud backup and restore feature. This is built as a serverless function on [Cloudflare workers](https://workers.cloudflare.com/) using [KV](https://developers.cloudflare.com/workers/runtime-apis/kv) and [web crypto](https://developers.cloudflare.com/workers/runtime-apis/web-crypto)

##### External Services
The 1-Click deploy demo uses [Play-with-Docker Labs](https://play-with-docker.com/). Code is hosted on [GitHub](https://github.com), Docker image is hosted on [DockerHub](https://hub.docker.com/), and the demos are hosted on [Netlify](https://www.netlify.com/).

---

> This page is auto-generated, using [contribute-list](https://github.com/marketplace/actions/contribute-list) by @akhilmhdh.
