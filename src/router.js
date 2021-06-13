import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Login from './views/Login.vue';
import conf from '../public/conf.yml'; // Main site configuration
import { pageInfo as defaultPageInfo, localStorageKeys } from './utils/defaults';
import { isLoggedIn } from './utils/Auth';

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

const config = {
  sections: sections || [],
  pageInfo: localPageInfo || pageInfo || defaultPageInfo,
  appConfig: localAppConfig || appConfig || {},
};

const isAuthenticated = () => {
  const users = config.appConfig.auth;
  return (!users || isLoggedIn(users));
};

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      props: config,
      meta: {
        title: pageInfo.title || 'Home Page',
        metaTags: [
          {
            name: 'description',
            content: 'A simple static homepage for you\'re server',
          },
        ],
      },
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      props: {
        appConfig: config.appConfig,
      },
      beforeEnter: (to, from, next) => {
        if (isAuthenticated()) router.push({ path: '/' });
        next();
      },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.name !== 'login' && !isAuthenticated()) next({ name: 'login' });
  else next();
});

const defaultTitle = 'Dashy';
router.afterEach((to) => {
  Vue.nextTick(() => {
    document.title = to.meta.title || defaultTitle;
  });
});

export default router;
