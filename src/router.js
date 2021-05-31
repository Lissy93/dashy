import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import conf from '../public/conf.yml'; // Main site configuration
import { pageInfo as defaultPageInfo, localStorageKeys } from './utils/defaults';

Vue.use(Router);

const { sections, pageInfo, appConfig } = conf;
let localPageInfo;
try {
  localPageInfo = JSON.parse(localStorage[localStorageKeys.PAGE_INFO]);
} catch (e) {
  localPageInfo = undefined;
}

let localAppConfig;
try {
  localAppConfig = JSON.parse(localStorage[localStorageKeys.APP_CONFIG]);
} catch (e) {
  localAppConfig = undefined;
}

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      props: {
        sections: sections || [],
        pageInfo: localPageInfo || pageInfo || defaultPageInfo,
        appConfig: localAppConfig || appConfig || {},
      },
      meta: {
        title: 'Home Page',
        metaTags: [
          {
            name: 'description',
            content: 'A simple static homepage for you\'re server',
          },
        ],
      },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
    },
  ],
});

const defaultTitle = 'Speed Dial';
router.afterEach((to) => {
  Vue.nextTick(() => {
    document.title = to.meta.title || defaultTitle;
  });
});

export default router;
