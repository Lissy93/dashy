/* eslint-disable no-multi-spaces */
// Import core framework and essential utils
import { createApp } from 'vue';

// Import component Vue plugins, used throughout the app
import VModal from '@febe95/vue-js-modal'; // Modal component (Vue 3 fork)
import VSelect from 'vue-select';       // Select dropdown component
import JsonViewer from 'vue3-json-viewer'; // JSON tree viewer

// Import base Dashy components and utils
import Dashy from '@/App.vue';          // Main Dashy Vue app
import store from '@/store';            // Store, for local state management
import router from '@/router';          // Router, for navigation
import serviceWorker from '@/utils/InitServiceWorker'; // Service worker initialization
import i18n from '@/utils/i18n';                      // i18n instance (exported so non-component callers can t())
import ErrorReporting from '@/utils/logging/ErrorReporting';  // Error reporting initializer (off)
import clickOutside from '@/directives/ClickOutside'; // Directive for closing popups, modals, etc
import tooltip from '@/directives/Tooltip';           // Custom tooltip directive
import { initKeycloakAuth, isKeycloakEnabled } from '@/utils/auth/KeycloakAuth';
import { initHeaderAuth, isHeaderAuthEnabled } from '@/utils/auth/HeaderAuth';
import { initOidcAuth, isOidcEnabled } from '@/utils/auth/OidcAuth';
import Keys from '@/utils/StoreMutations';
import ErrorHandler from '@/utils/logging/ErrorHandler';
import Toast from '@/utils/Toast';
import '@/utils/patchResizeObserver';

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

/* Handle failures of third-party auth initialization */
const handleAuthFailure = (provider, err) => {
  ErrorHandler(`Failed to authenticate with ${provider}`, err);
  store.commit(Keys.CRITICAL_ERROR_MSG, `Authentication failed (${provider}). See console for details.`);
  mount();
};

router.isReady().then(() => {
  if (isOidcEnabled()) {
    initOidcAuth().then(mount).catch((e) => handleAuthFailure('OIDC', e));
  } else if (isKeycloakEnabled()) {
    initKeycloakAuth().then(mount).catch((e) => handleAuthFailure('Keycloak', e));
  } else if (isHeaderAuthEnabled()) {
    initHeaderAuth().then(mount).catch((e) => handleAuthFailure('Header Auth', e));
  } else {
    mount();
  }
});
