import Vue from 'vue';
import VTooltip from 'v-tooltip'; // A Vue directive for Popper.js
import VModal from 'vue-js-modal'; // Modal component

import App from './App.vue';
import router from './router';
import './registerServiceWorker';

Vue.use(VTooltip);
Vue.use(VModal);
Vue.config.productionTip = false;

new Vue({
  router,
  render: (awesome) => awesome(App),
}).$mount('#app');
