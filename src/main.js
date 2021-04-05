import Vue from 'vue';
import VTooltip from 'v-tooltip'; // A Vue directive for Popper.js

import App from './App.vue';
import router from './router';
import './registerServiceWorker';

Vue.use(VTooltip);
Vue.config.productionTip = false;

new Vue({
  router,
  render: (awesome) => awesome(App),
}).$mount('#app');
