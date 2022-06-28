import axios from 'axios';
import yaml from 'js-yaml';
import { register } from 'register-service-worker';
import { sessionStorageKeys } from '@/utils/defaults';
import { statusMsg, statusErrorMsg } from '@/utils/CoolConsole';

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
    statusErrorMsg('Service Worker Status', 'Error Updating SW Status', e);
  }
};

/**
 * Checks if service workers should be enabled
 * Disable if not running in production
 * Or disable if user specified to disable
 */
const shouldEnableServiceWorker = async () => {
  const conf = yaml.load((await axios.get('/conf.yml')).data);
  if (conf && conf.appConfig && conf.appConfig.enableServiceWorker) {
    setSwStatus({ disabledByUser: false });
    return true;
  } else if (process.env.NODE_ENV !== 'production') {
    setSwStatus({ devMode: true });
    return false;
  }
  setSwStatus({ disabledByUser: true });
  return false;
};

/* Calls to the print status function */
const printSwStatus = (msg) => {
  statusMsg('Service Worker Status', msg);
};

const swUrl = `${process.env.BASE_URL || '/'}service-worker.js`;

/* If service worker enabled, then register it, and print message when status changes */
const registerServiceWorker = async () => {
  if (await shouldEnableServiceWorker()) {
    register(swUrl, {
      ready() {
        setSwStatus({ ready: true });
        printSwStatus(
          'Dashy is being served from cache by a service worker.\n'
          + 'For more details, visit https://goo.gl/AFskqB',
        );
      },
      registered() {
        setSwStatus({ registered: true });
        printSwStatus('Service worker has been registered.');
      },
      cached() {
        setSwStatus({ cached: true });
        printSwStatus('App has been cached for offline use.');
      },
      updatefound() {
        setSwStatus({ updateFound: true });
        printSwStatus('New content is downloading...');
      },
      updated() {
        setSwStatus({ updated: true });
        printSwStatus('New content is available; please refresh the page.');
      },
      offline() {
        setSwStatus({ offline: true });
        printSwStatus('No internet connection found. Dashy is running in offline mode.');
      },
      error(error) {
        setSwStatus({ error: true });
        statusErrorMsg('Service Worker Status', 'Error during SW registration', error);
      },
    });
  }
};

export default registerServiceWorker;
