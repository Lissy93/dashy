/**
 * This is the router config, which defined the location for
 * each page within the app, and how they should be loaded
 * Note that the page paths are defined in @/utils/config/defaults.js
 */

// Import vue router
import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';
import { Progress } from 'rsup-progress';

// Import views, that are not lazy-loaded
import Home from '@/views/Home.vue';

// Import helper functions, config data and defaults
import store from '@/store';
import i18n from '@/utils/i18n';
import Keys from '@/utils/StoreMutations';
import { isAuthEnabled, isLoggedIn, isGuestAccessEnabled } from '@/utils/auth/Auth';
import { startingView as defaultStartingView, routePaths } from '@/utils/config/defaults';
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

/* Build the canonical /<view>/:page?/:section? routes for a given view + component.
 * withSection=false for workspace (no single-section view yet). Page meta is
 * owned by App.vue's watcher via PageMeta.js — routes don't carry titles. */
const makeViewRoutes = (basePath, viewName, component, withSection = true) => {
  const routes = [
    { path: basePath, name: viewName, component },
    { path: `${basePath}/:page`, name: `${viewName}-page`, component },
  ];
  if (withSection) {
    routes.push({
      path: `${basePath}/:page/:section`,
      name: `${viewName}-section`,
      component,
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
      beforeEnter: (to, from, next) => {
        const view = resolveStartingView();
        if (!view || view === 'home') next();
        // If user set `startingView`, we redirect to canonical /<view> URL
        else next(`/${view}`);
      },
    },
    // Canonical /<view>/:page?/:section? routes for each view
    ...makeViewRoutes(routePaths.home, 'home', Home),
    ...makeViewRoutes(routePaths.minimal, 'minimal', () => import('./views/Minimal.vue')),
    ...makeViewRoutes(routePaths.workspace, 'workspace', () => import('./views/Workspace.vue'), false),
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
    },
    { // The export config page
      path: routePaths.download,
      name: 'download',
      component: () => import('./views/DownloadConfig.vue'),
    },
    { // Page not found, any non-defined routes will land here
      path: routePaths.notFound,
      name: '404',
      component: () => import('./views/404.vue'),
      meta: { theme: 'dashy-docs' },
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
 * On first page load, initialize and wait for the the config loading.
 * Also guards against silently leaving an active edit session for a
 * different config (unsaved edits would otherwise become untethered
 * from whatever page the user switched to).
 */
router.beforeEach(async (to, from, next) => {
  progress.start();
  try {
    if (!store.state.rootConfig && !store.state.criticalError) {
      await store.dispatch(Keys.INITIALIZE_CONFIG);
    }
    // If in edit mode and navigating to a DIFFERENT page, confirm + cancel edit.
    const pageChanged = from.params?.page !== to.params?.page;
    if (store.state.editMode && pageChanged) {
       
      const ok = confirm(i18n.global.t('interactive-editor.menu.leave-while-editing-confirm'));
      if (!ok) {
        progress.end();
        next(false);
        return;
      }
      // Discard edits for the page we're leaving and exit edit mode.
      await store.dispatch(Keys.INITIALIZE_CONFIG, store.state.currentConfigInfo.confId);
      store.commit(Keys.SET_EDIT_MODE, false);
    }
    if (to.name !== 'login' && !isAuthenticated()) next({ name: 'login' });
    else next();
  } catch (e) {
    ErrorHandler('Navigation guard failed', e);
    next();
  }
});

/* Stop the loading progress bar once navigation settles */
router.afterEach(() => {
  progress.end();
});

/* Catch navigation + lazy-import failures */
router.onError((err) => {
  progress.end();
  ErrorHandler('Navigation failed. Try hard-reload (Shift + F5)', err);
});

// All done - export the now configured router
export default router;
