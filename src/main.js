/* eslint-disable no-multi-spaces */
// Import core framework and essential utils
import Vue from 'vue';
import VueI18n from 'vue-i18n'; // i18n for localization
import Keycloak from 'keycloak-js';

// Import component Vue plugins, used throughout the app
import VTooltip from 'v-tooltip';       // A Vue directive for Popper.js, tooltip component
import VModal from 'vue-js-modal';      // Modal component
import VSelect from 'vue-select';       // Select dropdown component
import VTabs from 'vue-material-tabs';  // Tab view component, used on the config page
import Toasted from 'vue-toasted';      // Toast component, used to show confirmation notifications

// Import base Dashy components and utils
import Dashy from '@/App.vue';          // Main Dashy Vue app
import router from '@/router';          // Router, for navigation
import store from '@/store';            // Store, for local state management
import serviceWorker from '@/utils/InitServiceWorker'; // Service worker initialization
import clickOutside from '@/utils/ClickOutside';      // Directive for closing popups, modals, etc
import { messages } from '@/utils/languages';         // Language texts
import ErrorReporting from '@/utils/ErrorReporting';  // Error reporting initializer (off)
import { toastedOptions, tooltipOptions, language as defaultLanguage } from '@/utils/defaults';
import { isKeycloakEnabled, getKeycloakConfig } from '@/utils/Auth'; // Keycloak auth config

// Initialize global Vue components
Vue.use(VueI18n);
Vue.use(VTooltip, tooltipOptions);
Vue.use(VModal);
Vue.use(VTabs);
Vue.use(Toasted, toastedOptions);
Vue.component('v-select', VSelect);
Vue.directive('clickOutside', clickOutside);

Vue.config.productionTip = false; // Disable annoying console message

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
  router, render, i18n, store,
}).$mount('#app');

// If Keycloak not enabled, then proceed straight to the app
if (!isKeycloakEnabled()) {
  mount();
} else { // Keycloak is enabled, redirect to KC login page
  const { serverUrl, realm, clientId } = getKeycloakConfig();
  const initOptions = {
    url: `${serverUrl}/auth`, realm, clientId, onLoad: 'login-required',
  };
  const keycloak = Keycloak(initOptions);
  keycloak.init({ onLoad: initOptions.onLoad }).then((auth) => {
    if (!auth) {
      // Not authenticated, reload to Keycloak login page
      window.location.reload();
    } else {
      // Yay - user successfully authenticated with Keycloak, render the app!
      mount();
    }
  });
}
