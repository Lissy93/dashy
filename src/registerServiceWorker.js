/* eslint-disable no-console */

import { register } from 'register-service-worker';
import { sessionStorageKeys } from './utils/defaults';

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

const registerServiceWorker = () => {
  if (process.env.NODE_ENV === 'production') {
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
  } else { // Not in production, don't use SW
    setSwStatus({ devMode: true });
  }
};

export default registerServiceWorker;
