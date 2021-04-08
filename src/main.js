import Vue from 'vue';

import VTooltip from 'v-tooltip'; // A Vue directive for Popper.js, tooltip component
import VModal from 'vue-js-modal'; // Modal component
import VSelect from 'vue-select'; // Select dropdown component

import App from './App.vue';
import router from './router';
import './registerServiceWorker';

Vue.use(VTooltip);
Vue.use(VModal);
Vue.component('v-select', VSelect);

Vue.config.productionTip = false;

new Vue({
  router,
  render: (awesome) => awesome(App),
}).$mount('#app');
