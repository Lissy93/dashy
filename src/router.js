import Vue from 'vue';
import Router from 'vue-router';

import Home from '@/views/Home.vue';
import Login from '@/views/Login.vue';
import Workspace from '@/views/Workspace.vue';
import DownloadConfig from '@/views/DownloadConfig.vue';
import { isLoggedIn } from '@/utils/Auth';
import ConfigAccumulator from '@/utils/ConfigAccumalator';
import { metaTagData } from '@/utils/defaults';

Vue.use(Router);

const Accumulator = new ConfigAccumulator();
const config = {
  appConfig: Accumulator.appConfig(),
  pageInfo: Accumulator.pageInfo(),
  sections: Accumulator.sections(),
};

const capitalize = (s) => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

/* Create routes for any additional config files */
const makeRoutesForAdditionalPages = () => {
  const additionalPages = config.appConfig.additionalConfigFiles || [];
  const additionalRoutes = [];
  // For each additional page, create a route
  additionalPages.forEach((additionalConfig) => {
    const additionalAccumulator = new ConfigAccumulator(additionalConfig);
    const routeName = additionalConfig.split('.')[0];
    additionalRoutes.push({
      path: `/home/${routeName}`,
      name: `home-${routeName}`,
      component: Home,
      props: {
        appConfig: additionalAccumulator.appConfig(),
        pageInfo: additionalAccumulator.pageInfo(),
        sections: additionalAccumulator.sections(),
      },
      meta: {
        title: capitalize(routeName) || 'Home Page',
        metaTags: metaTagData,
      },
    });
  });
  return additionalRoutes;
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
      alias: '/home',
      component: Home,
      props: config,
      meta: {
        title: config.pageInfo.title || 'Home Page',
        metaTags: metaTagData,
      },
    },
    {
      path: '/workspace',
      name: 'workspace',
      component: Workspace,
      props: config,
      meta: {
        title: config.pageInfo.title || 'Dashy Workspace',
        metaTags: metaTagData,
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
    {
      path: '/download',
      name: 'download',
      component: DownloadConfig,
      props: config,
      meta: {
        title: config.pageInfo.title || 'Download Dashy Config',
        metaTags: metaTagData,
      },
    },
    ...makeRoutesForAdditionalPages(),
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
