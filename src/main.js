import Vue from 'vue';
import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import router from './router';
import './registerServiceWorker';
import VueMasonry from './lib/vue-masonry-css'; // Thank you @PaulCollett 🙌 https://git.io/JeeYC

Vue.use(Element);
Vue.use(VueMasonry);
Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
