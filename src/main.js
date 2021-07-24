// Import core framework and essential utils
import Vue from 'vue';
import VueI18n from 'vue-i18n'; // i18n for localization

// Import component Vue plugins, used throughout the app
import VTooltip from 'v-tooltip'; // A Vue directive for Popper.js, tooltip component
import VModal from 'vue-js-modal'; // Modal component
import VSelect from 'vue-select'; // Select dropdown component
import VTabs from 'vue-material-tabs'; // Tab view component, used on the config page
import Toasted from 'vue-toasted'; // Toast component, used to show confirmation notifications

// Import base Dashy components and utils
import Dashy from '@/App.vue';
import router from '@/router';
import registerServiceWorker from '@/registerServiceWorker';
import clickOutside from '@/utils/ClickOutside';
import { toastedOptions } from '@/utils/defaults';
import { messages } from '@/utils/languages';

Vue.use(VueI18n);
Vue.use(VTooltip);
Vue.use(VModal);
Vue.use(VTabs);
Vue.use(Toasted, toastedOptions);
Vue.component('v-select', VSelect);
Vue.directive('clickOutside', clickOutside);

Vue.config.productionTip = false;

// Setup i18n translations
const i18n = new VueI18n({
  locale: 'en-GB',
  fallbackLocale: 'en-GB',
  messages,
});

// Register Service Worker
registerServiceWorker();

// Render function
const render = (awesome) => awesome(Dashy);

// All done, now just initialize main Vue app!
new Vue({ router, render, i18n }).$mount('#app');
