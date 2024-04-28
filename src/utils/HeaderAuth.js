import axios from 'axios';
import sha256 from 'crypto-js/sha256';
import ConfigAccumulator from '@/utils/ConfigAccumalator';
import { cookieKeys, localStorageKeys, serviceEndpoints } from '@/utils/defaults';
import { InfoHandler, ErrorHandler, InfoKeys } from '@/utils/ErrorHandler';
import { logout as authLogout } from '@/utils/Auth';

const getAppConfig = () => {
  const Accumulator = new ConfigAccumulator();
  const config = Accumulator.config();
  return config.appConfig || {};
};

class HeaderAuth {
  constructor() {
    const { auth } = getAppConfig();
    const {
      userHeader, proxyWhitelist,
    } = auth.headerAuth;
    this.userHeader = userHeader;
    this.proxyWhitelist = proxyWhitelist;
    this.users = auth.users;
  }

  login() {
    return new Promise((resolve, reject) => {
      const baseUrl = process.env.VUE_APP_DOMAIN || window.location.origin;
      axios.get(`${baseUrl}${serviceEndpoints.getUser}`).then((response) => {
        if (!response.data) {
          reject(Error('Error, expected data nout returned'));
        } else if (response.data.errorMsg) {
          reject(response.data.errorMsg);
        } else {
          try {
            this.users.forEach((user) => {
              if (user.user.toLowerCase() === response.data.user.toLowerCase()) { // User found
                const strAndUpper = (input) => input.toString().toUpperCase();
                const sha = strAndUpper(sha256(strAndUpper(user.user) + strAndUpper(user.hash)));
                document.cookie = `${cookieKeys.AUTH_TOKEN}=${sha};`;
                localStorage.setItem(localStorageKeys.USERNAME, user.user);
                InfoHandler(`Successfully signed in as ${response.data.user}`, InfoKeys.AUTH);
                resolve(response.data.user);
              }
            });
          } catch (e) {
            ErrorHandler('Error while trying to login using header authentication', e);
            reject(e);
          }
        }
      });
    });
  }

  // eslint-disable-next-line class-methods-use-this
  logout() {
    authLogout();
  }
}

export const isHeaderAuthEnabled = () => {
  const { auth } = getAppConfig();
  if (!auth) return false;
  return auth.enableHeaderAuth || false;
};

let headerAuth;

export const initHeaderAuth = () => {
  headerAuth = new HeaderAuth();
  return headerAuth.login();
};

// TODO: Find where this is implemented
export const getHeaderAuth = () => {
  if (!headerAuth) {
    ErrorHandler("HeaderAuth not initialized, can't get instance of class");
  }
  return headerAuth;
};
