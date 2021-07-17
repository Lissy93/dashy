/* eslint-disable no-console */

import { register } from 'register-service-worker';
import { sessionStorageKeys } from './utils/defaults';
import conf from '../public/conf.yml';

/* Sets a local storage item with the state from the SW lifecycle */
const setSwStatus = (swStateToSet) => {
  const initialSwState = {
    ready: false,
    registered: false,
    cached: false,
    updateFound: false,
    updated: false,
    offline: false,
    error: false,
    devMode: false,
    disabledByUser: false,
  };
  const sessionData = sessionStorage[sessionStorageKeys.SW_STATUS];
  const currentSwState = sessionData ? JSON.parse(sessionData) : initialSwState;
  try {
    const newSwState = { ...currentSwState, ...swStateToSet };
    sessionStorage.setItem(sessionStorageKeys.SW_STATUS, JSON.stringify(newSwState));
  } catch (e) {
    console.warn('Error setting SW data', e);
  }
};

/**
 * Checks if service workers should be enabled
 * Disable if not running in production
 * Or disable if user specified to disable
 */
const shouldEnableServiceWorker = () => {
  let shouldEnable = true;
  if (conf && conf.appConfig) { // Check if app Config available
    if (conf.appConfig.disableServiceWorker) { // Disable if user requested
      shouldEnable = false;
      setSwStatus({ disabledByUser: true });
    }
  }
  if (process.env.NODE_ENV !== 'production') {
    shouldEnable = false; // Disable if not in production
    setSwStatus({ devMode: true });
  }
  return shouldEnable;
};

const registerServiceWorker = () => {
  if (shouldEnableServiceWorker()) {
    register(`${process.env.BASE_URL}service-worker.js`, {
      ready() {
        setSwStatus({ ready: true });
        console.log(
          'App is being served from cache by a service worker.\n'
          + 'For more details, visit https://goo.gl/AFskqB',
        );
      },
      registered() {
        setSwStatus({ registered: true });
        console.log('Service worker has been registered.');
      },
      cached() {
        setSwStatus({ cached: true });
        console.log('Content has been cached for offline use.');
      },
      updatefound() {
        setSwStatus({ updateFound: true });
        console.log('New content is downloading.');
      },
      updated() {
        setSwStatus({ updated: true });
        console.log('New content is available; please refresh.');
      },
      offline() {
        setSwStatus({ offline: true });
        console.log('No internet connection found. App is running in offline mode.');
      },
      error(error) {
        setSwStatus({ error: true });
        console.error('Error during service worker registration:', error);
      },
    });
  }
};

export default registerServiceWorker;
