/**
 * This is the router config, which defined the location for
 * each page within the app, and how they should be loaded
 * Note that the page paths are defined in @/utils/defaults.js
 */

// Import Vue.js and vue router
import Vue from 'vue';
import Router from 'vue-router';
import { Progress } from 'rsup-progress';

// Import views, that are not lazy-loaded
import Home from '@/views/Home.vue';
import ConfigAccumulator from '@/utils/ConfigAccumalator';

// Import helper functions, config data and defaults
import { isAuthEnabled, isLoggedIn, isGuestAccessEnabled } from '@/utils/Auth';
import { metaTagData, startingView, routePaths } from '@/utils/defaults';
import ErrorHandler from '@/utils/ErrorHandler';
import $store from '@/store';
import Keys from '@/utils/StoreMutations';

Vue.use(Router);
const progress = new Progress({ color: 'var(--progress-bar)' });

let appConfig;
let pageInfo;
let configFetched;
let defaultView;

/* Returns true if user is already authenticated, or if auth is not enabled */
const isAuthenticated = () => {
  const authEnabled = isAuthEnabled();
  const userLoggedIn = isLoggedIn();
  const guestEnabled = isGuestAccessEnabled();
  return (!authEnabled || userLoggedIn || guestEnabled);
};

const getConfig = () => {
  const Accumulator = new ConfigAccumulator();
  appConfig = Accumulator.appConfig();
  pageInfo = Accumulator.pageInfo();
  defaultView = (appConfig.startingView || startingView) === 'default' ? 'home' : (appConfig.startingView || startingView);
  configFetched = $store.state.configFetched;
};

getConfig();

/* Returns the meta tags for each route */
const makeMetaTags = (defaultTitle) => ({
  title: pageInfo.title || defaultTitle,
  metaTags: metaTagData,
});

/* Routing mode, can be either 'hash', 'history' or 'abstract' */
const mode = window.extraConf.routingMode || 'history';

/* List of all routes, props, components and metadata */
const router = new Router({
  mode,
  routes: [
    {
      path: '/',
    },
    { // Default home page
      path: routePaths.home,
      name: 'home',
      component: Home,
      meta: makeMetaTags('Home Page'),
    },
    { // View only single section
      path: `${routePaths.home}/:section`,
      name: 'home-section',
      component: Home,
      meta: makeMetaTags('Home Page'),
    },
    { // Workspace view page
      path: routePaths.workspace,
      name: 'workspace',
      component: () => import('./views/Workspace.vue'),
      meta: makeMetaTags('Workspace'),
    },
    { // Minimal view page
      path: routePaths.minimal,
      name: 'minimal',
      component: () => import('./views/Minimal.vue'),
      meta: makeMetaTags('Start Page'),
    },
    { // The login page
      path: routePaths.login,
      name: 'login',
      component: () => import('./views/Login.vue'),
      beforeEnter: (to, from, next) => {
        // If the user already logged in + guest mode not enabled, then redirect home
        if (isAuthenticated() && !isGuestAccessEnabled()) router.push({ path: '/' });
        next();
      },
    },
    { // The about app page
      path: routePaths.about,
      name: 'about', // We lazy load the About page so as to not slow down the app
      component: () => import('./views/About.vue'),
      meta: makeMetaTags('About Dashy'),
    },
    { // The export config page
      path: routePaths.download,
      name: 'download',
      component: () => import('./views/DownloadConfig.vue'),
      meta: makeMetaTags('Download Config'),
    },
    { // Page not found, any non-defined routes will land here
      path: routePaths.notFound,
      name: '404',
      component: () => import('./views/404.vue'),
      meta: makeMetaTags('404 Not Found'),
      beforeEnter: (to, from, next) => {
        if (to.redirectedFrom) { // Log error, if redirected here from another route
          ErrorHandler(`Route not found: '${to.redirectedFrom}'`);
        }
        next();
      },
    },
    { // Redirect any not-found routed to the 404 view
      path: '*',
      redirect: '/404',
    },
  ],
});

/**
 * Before loading a route, check if the user has authentication enabled
 * if so, then ensure that they are correctly logged in as a valid user
 * If not logged in, prevent all access and redirect them to login page
 * */
router.beforeEach(async (to, from, next) => {
  progress.start();
  // Confirm that the config is initialized, if not wait for it to be
  if (!configFetched) {
    await $store.dispatch(Keys.WAIT_FOR_CONFIG);
    getConfig();
  }
  if (to.name !== 'login' && !isAuthenticated()) next({ name: 'login' });
  // If routing to home, redirect to the correct view
  else if (to.path === '/') {
    if (from.name === defaultView) {
      next(false);
      progress.end();
    } else next({ name: defaultView });
  } else next();
});

/* If title is missing, then apply default page title */
router.afterEach((to) => {
  progress.end();
  Vue.nextTick(() => {
    document.title = to.meta.title || 'Dashy';
  });
});

// All done - export the now configured router
export default router;
