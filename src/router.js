/**
 * This is the router config, which defined the location for
 * each page within the app, and how they should be loaded
 * Note that the page paths are defined in @/utils/config/defaults.js
 */

// Import vue router
import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';
import { nextTick } from 'vue';
import { Progress } from 'rsup-progress';

// Import views, that are not lazy-loaded
import Home from '@/views/Home.vue';

// Import helper functions, config data and defaults
import store from '@/store';
import Keys from '@/utils/StoreMutations';
import { isAuthEnabled, isLoggedIn, isGuestAccessEnabled } from '@/utils/auth/Auth';
import { metaTagData, startingView as defaultStartingView, routePaths } from '@/utils/config/defaults';
import { VIEW_META } from '@/utils/config/ConfigHelpers';
import ErrorHandler from '@/utils/logging/ErrorHandler';

const progress = new Progress({ color: 'var(--progress-bar)' });

/* Returns true if user is already authenticated, or if auth is not enabled */
const isAuthenticated = () => {
  const authEnabled = isAuthEnabled();
  const userLoggedIn = isLoggedIn();
  const guestEnabled = isGuestAccessEnabled();
  return (!authEnabled || userLoggedIn || guestEnabled);
};

/* Resolve landing view from appConfig.startingView at runtime if set */
const resolveStartingView = () => {
  const raw = store.state.config?.appConfig?.startingView || defaultStartingView;
  const view = raw === 'default' ? 'home' : raw;
  return VIEW_META[view] ? view : 'home';
};

/* Returns the meta tags for each route */
const makeMetaTags = (defaultTitle) => {
  const userTitle = import.meta.env.VITE_APP_TITLE || '';
  const title = userTitle ? `${userTitle} | ${defaultTitle}` : defaultTitle;
  return { title, metaTags: metaTagData };
};

/* Build the canonical /<view>/:page?/:section? routes for a given view + component.
 * withSection=false for workspace (no single-section view yet). */
const makeViewRoutes = (basePath, viewName, component, title, withSection = true) => {
  const meta = makeMetaTags(title);
  const routes = [
    { path: basePath, name: viewName, component, meta },
    { path: `${basePath}/:page`, name: `${viewName}-page`, component, meta },
  ];
  if (withSection) {
    routes.push({
      path: `${basePath}/:page/:section`,
      name: `${viewName}-section`,
      component,
      meta,
    });
  }
  return routes;
};

/* Routing mode, can be either 'hash', 'history' or 'abstract' */
const mode = import.meta.env.VITE_APP_ROUTING_MODE || 'history';

/* Map mode string to Vue Router 4 history function */
const history = mode === 'hash'
  ? createWebHashHistory(import.meta.env.BASE_URL)
  : createWebHistory(import.meta.env.BASE_URL);

/* List of all routes, props, components and metadata */
const router = createRouter({
  history,
  routes: [
    {
      path: '/',
      name: 'landing',
      component: Home,
      meta: makeMetaTags('Home Page'),
      beforeEnter: (to, from, next) => {
        const view = resolveStartingView();
        if (!view || view === 'home') next();
        // If user set `startingView`, we redirect to canonical /<view> URL
        else next(`/${view}`);
      },
    },
    // Canonical /<view>/:page?/:section? routes for each view
    ...makeViewRoutes(routePaths.home, 'home', Home, 'Home Page'),
    ...makeViewRoutes(
      routePaths.minimal,
      'minimal',
      () => import('./views/Minimal.vue'),
      'Start Page',
    ),
    ...makeViewRoutes(
      routePaths.workspace,
      'workspace',
      () => import('./views/Workspace.vue'),
      'Workspace',
      false,
    ),
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
          ErrorHandler(`Route not found: '${to.redirectedFrom.fullPath}'`);
        }
        next();
      },
    },
    { // Redirect any not-found routed to the 404 view
      path: '/:pathMatch(.*)*',
      redirect: '/404',
    },
  ],
});

/**
 * On first page load, initialize and wait for the the config loading
 * Then, if auth enabled and user not logged in yet, redirect to login page
 */
router.beforeEach(async (to, from, next) => {
  progress.start();
  try {
    if (!store.state.rootConfig && !store.state.criticalError) {
      await store.dispatch(Keys.INITIALIZE_CONFIG);
    }
    if (to.name !== 'login' && !isAuthenticated()) next({ name: 'login' });
    else next();
  } catch (e) {
    next();
  }
});

/* If title is missing, then apply default page title */
router.afterEach((to) => {
  progress.end();
  nextTick(() => {
    document.title = to.meta.title || 'Dashy';
  });
});

/* Catch navigation + lazy-import failures */
router.onError((err) => {
  progress.end();
  ErrorHandler('Navigation failed. Try hard-reload (Shift + F5)', err);
});

// All done - export the now configured router
export default router;
