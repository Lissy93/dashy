/* eslint-disable no-multi-spaces */
// Import core framework and essential utils
import Vue from 'vue';
import VueI18n from 'vue-i18n'; // i18n for localization

// Import component Vue plugins, used throughout the app
import VTooltip from 'v-tooltip';       // A Vue directive for Popper.js, tooltip component
import VModal from 'vue-js-modal';      // Modal component
import VSelect from 'vue-select';       // Select dropdown component
import VTabs from 'vue-material-tabs';  // Tab view component, used on the config page
import Toasted from 'vue-toasted';      // Toast component, used to show confirmation notifications
import TreeView from 'vue-json-tree-view';

// Import base Dashy components and utils
import Dashy from '@/App.vue';          // Main Dashy Vue app
import store from '@/store';            // Store, for local state management
import router from '@/router';          // Router, for navigation
import serviceWorker from '@/utils/InitServiceWorker'; // Service worker initialization
import { messages } from '@/utils/languages';         // Language texts
import ErrorReporting from '@/utils/ErrorReporting';  // Error reporting initializer (off)
import clickOutside from '@/directives/ClickOutside'; // Directive for closing popups, modals, etc
import { toastedOptions, tooltipOptions, language as defaultLanguage } from '@/utils/defaults';
import { initKeycloakAuth, isKeycloakEnabled } from '@/utils/KeycloakAuth';
import { initHeaderAuth, isHeaderAuthEnabled } from '@/utils/HeaderAuth';
import Keys from '@/utils/StoreMutations';
import ErrorHandler from '@/utils/ErrorHandler';

// Initialize global Vue components
Vue.use(VueI18n);
Vue.use(VTooltip, tooltipOptions);
Vue.use(VModal);
Vue.use(VTabs);
Vue.use(TreeView);
Vue.use(Toasted, toastedOptions);
Vue.component('v-select', VSelect);
Vue.directive('clickOutside', clickOutside);

// When running in dev mode, enable Vue performance tools
const isDevMode = process.env.NODE_ENV === 'development';
Vue.config.performance = isDevMode;
Vue.config.productionTip = isDevMode;

// Setup i18n translations
const i18n = new VueI18n({
  locale: defaultLanguage,
  fallbackLocale: defaultLanguage,
  messages,
});

// Checks if service worker not disable, and if so will registers it
serviceWorker();

// Checks if user enabled error reporting, and if so will initialize it
ErrorReporting(Vue, router);

// Render function
const render = (awesome) => awesome(Dashy);

// Mount the app, with router, store i18n and render func
const mount = () => new Vue({
  store, router, render, i18n,
}).$mount('#app');

store.dispatch(Keys.INITIALIZE_CONFIG).then(() => {
  if (isKeycloakEnabled()) { // If Keycloak is enabled, initialize auth
    initKeycloakAuth()
      .then(() => mount())
      .catch((e) => {
        ErrorHandler('Failed to authenticate with Keycloak', e);
      });
  } else if (isHeaderAuthEnabled()) { // If header auth is enabled, initialize auth
    initHeaderAuth()
      .then(() => mount())
      .catch((e) => {
        ErrorHandler('Failed to authenticate with server', e);
      });
  } else { // If no third-party auth, just mount the app as normal
    mount();
  }
});
