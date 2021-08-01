import Vue from 'vue';
import Router from 'vue-router';

import Home from '@/views/Home.vue';
import Login from '@/views/Login.vue';
import Workspace from '@/views/Workspace.vue';
import DownloadConfig from '@/views/DownloadConfig.vue';
import { isLoggedIn } from '@/utils/Auth';
import { config } from '@/utils/ConfigHelpers';
import { metaTagData } from '@/utils/defaults';

Vue.use(Router);

/**
 * Checks if the current user is either authenticated,
 * or if authentication is not enabled
 * @returns true if user logged in, or user management not enabled
 */
const isAuthenticated = () => {
  const users = config.appConfig.auth;
  return (!users || users.length === 0 || isLoggedIn(users));
};

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
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
