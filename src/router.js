/**
 * This is the router config, which defined the location for
 * each page within the app, and how they should be loaded
 * Note that the page paths are defined in @/utils/defaults.js
 */

// Import Vue.js and vue router
import Vue from 'vue';
import Router from 'vue-router';

// Import views
import Home from '@/views/Home.vue';
import Login from '@/views/Login.vue';
import Workspace from '@/views/Workspace.vue';
import Minimal from '@/views/Minimal.vue';
import DownloadConfig from '@/views/DownloadConfig.vue';

// Import helper functions, config data and defaults
import { isAuthEnabled, isLoggedIn, isGuestAccessEnabled } from '@/utils/Auth';
import { config } from '@/utils/ConfigHelpers';
import { metaTagData, startingView, routePaths } from '@/utils/defaults';

Vue.use(Router);

/* Returns true if user is already authenticated, or if auth is not enabled */
const isAuthenticated = () => {
  const authEnabled = isAuthEnabled();
  const userLoggedIn = isLoggedIn();
  const guestEnabled = isGuestAccessEnabled();
  return (!authEnabled || userLoggedIn || guestEnabled);
};

/* Get the users chosen starting view from app config, or return default */
const getStartingView = () => config.appConfig.startingView || startingView;

/**
 * Returns the component that should be rendered at the base path,
 * Defaults to Home, but the user can change this to Workspace of Minimal
 */
const getStartingComponent = () => {
  const usersPreference = getStartingView();
  switch (usersPreference) {
    case 'default': return Home;
    case 'minimal': return Minimal;
    case 'workspace': return Workspace;
    default: return Home;
  }
};

/* Returns the meta tags for each route */
const makeMetaTags = (defaultTitle) => ({
  title: config.pageInfo.title || defaultTitle,
  metaTags: metaTagData,
});

/* List of all routes, props, components and metadata */
const router = new Router({
  routes: [
    { // The default view can be customized by the user
      path: '/',
      name: `landing-page-${getStartingView()}`,
      component: getStartingComponent(),
      props: config,
      meta: makeMetaTags('Home Page'),
    },
    { // Default home page
      path: routePaths.home,
      name: 'home',
      component: Home,
      props: config,
      meta: makeMetaTags('Home Page'),
    },
    { // Workspace view page
      path: routePaths.workspace,
      name: 'workspace',
      component: Workspace,
      props: config,
      meta: makeMetaTags('Workspace'),
    },
    { // Minimal view page
      path: routePaths.minimal,
      name: 'minimal',
      component: Minimal,
      props: config,
      meta: makeMetaTags('Start Page'),
    },
    { // The login page
      path: routePaths.login,
      name: 'login',
      component: Login,
      props: {
        appConfig: config.appConfig,
      },
      beforeEnter: (to, from, next) => {
        // If the user already logged in + guest mode not enabled, then redirect home
        if (isAuthenticated() && !isGuestAccessEnabled()) router.push({ path: '/' });
        next();
      },
    },
    { // The about app page
      path: routePaths.about,
      name: 'about', // We lazy load the About page so as to not slow down the app
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
      meta: makeMetaTags('About Dashy'),
    },
    { // The export config page
      path: routePaths.download,
      name: 'download',
      component: DownloadConfig,
      props: config,
      meta: makeMetaTags('Download Config'),
    },
  ],
});

/**
 * Before loading a route, check if the user has authentication enabled
 * if so, then ensure that they are correctly logged in as a valid user
 * If not logged in, prevent all access and redirect them to login page
 * */
router.beforeEach((to, from, next) => {
  if (to.name !== 'login' && !isAuthenticated()) next({ name: 'login' });
  else next();
});

/* If title is missing, then apply default page title */
router.afterEach((to) => {
  Vue.nextTick(() => {
    document.title = to.meta.title || 'Dashy';
  });
});

// All done - export the now configured router
export default router;
