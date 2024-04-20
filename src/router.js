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

// Import helper functions, config data and defaults
import { isAuthEnabled, isLoggedIn, isGuestAccessEnabled } from '@/utils/Auth';
import { metaTagData, startingView as defaultStartingView, routePaths } from '@/utils/defaults';
import ErrorHandler from '@/utils/ErrorHandler';

Vue.use(Router);
const progress = new Progress({ color: 'var(--progress-bar)' });

/* Returns true if user is already authenticated, or if auth is not enabled */
const isAuthenticated = () => {
  const authEnabled = isAuthEnabled();
  const userLoggedIn = isLoggedIn();
  const guestEnabled = isGuestAccessEnabled();
  return (!authEnabled || userLoggedIn || guestEnabled);
};

// Get the default starting view from environmental variable
const startingView = process.env.VUE_APP_STARTING_VIEW || defaultStartingView;

/**
 * Returns the component that should be rendered at the base path,
 * Defaults to Home, but the user can change this to Workspace of Minimal
 */
const getStartingComponent = () => {
  switch (startingView) {
    case 'minimal': return () => import('./views/Minimal.vue');
    case 'workspace': return () => import('./views/Workspace.vue');
    default: return Home;
  }
};

/* Returns the meta tags for each route */
const makeMetaTags = (defaultTitle) => {
  const userTitle = process.env.VUE_APP_TITLE || '';
  const title = userTitle ? `${userTitle} | ${defaultTitle}` : defaultTitle;
  return { title, metaTags: metaTagData };
};

/* Routing mode, can be either 'hash', 'history' or 'abstract' */
const mode = process.env.VUE_APP_ROUTING_MODE || 'history';

/* List of all routes, props, components and metadata */
const router = new Router({
  mode,
  routes: [
    // ...makeMultiPageRoutes(pages),
    { // The default view can be customized by the user
      path: '/',
      name: `landing-page-${startingView}`,
      component: getStartingComponent(),
      meta: makeMetaTags('Home Page'),
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
  if (to.name !== 'login' && !isAuthenticated()) next({ name: 'login' });
  else next();
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
