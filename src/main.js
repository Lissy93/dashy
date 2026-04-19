/* eslint-disable no-multi-spaces */
// Import core framework and essential utils
import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';

// Import component Vue plugins, used throughout the app
import VModal from '@febe95/vue-js-modal'; // Modal component (Vue 3 fork)
import VSelect from 'vue-select';       // Select dropdown component
import JsonViewer from 'vue3-json-viewer'; // JSON tree viewer

// Import base Dashy components and utils
import Dashy from '@/App.vue';          // Main Dashy Vue app
import store from '@/store';            // Store, for local state management
import router from '@/router';          // Router, for navigation
import serviceWorker from '@/utils/InitServiceWorker'; // Service worker initialization
import { messages } from '@/utils/languages';         // Language texts
import ErrorReporting from '@/utils/logging/ErrorReporting';  // Error reporting initializer (off)
import clickOutside from '@/directives/ClickOutside'; // Directive for closing popups, modals, etc
import tooltip from '@/directives/Tooltip';           // Custom tooltip directive
import { language as defaultLanguage } from '@/utils/config/defaults';
import { initKeycloakAuth, isKeycloakEnabled } from '@/utils/auth/KeycloakAuth';
import { initHeaderAuth, isHeaderAuthEnabled } from '@/utils/auth/HeaderAuth';
import { initOidcAuth, isOidcEnabled } from '@/utils/auth/OidcAuth';
import Keys from '@/utils/StoreMutations';
import ErrorHandler from '@/utils/logging/ErrorHandler';
import Toast from '@/utils/Toast';
import '@/utils/patchResizeObserver';

// Setup i18n translations
const i18n = createI18n({
  legacy: true,
  locale: defaultLanguage,
  fallbackLocale: defaultLanguage,
  messages,
});

// Create the Vue 3 app instance
const app = createApp(Dashy);

// Register plugins
app.use(store);
app.use(router);
app.use(i18n);
app.use(VModal);
app.use(JsonViewer);
app.use(Toast);

// Register global components and directives
app.component('v-select', VSelect);
app.directive('clickOutside', clickOutside);
app.directive('tooltip', tooltip);

app.config.errorHandler = (err, instance, info) => {
  ErrorHandler(`Vue error in ${info}`, err);
};

window.addEventListener('unhandledrejection', (event) => {
  ErrorHandler('Unhandled promise rejection', event.reason);
});

const isDevMode = import.meta.env.DEV;
app.config.performance = isDevMode;

serviceWorker();

// Checks if user enabled error reporting, and if so will initialize it
ErrorReporting(app, router);

// Mount the app
const mount = () => app.mount('#app');

store.dispatch(Keys.INITIALIZE_CONFIG).then(() => {
  if (isOidcEnabled()) {
    initOidcAuth()
      .then(() => mount())
      .catch((e) => {
        ErrorHandler('Failed to authenticate with OIDC', e);
      });
  } else if (isKeycloakEnabled()) { // If Keycloak is enabled, initialize auth
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
