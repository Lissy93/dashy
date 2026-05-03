import sha256 from 'crypto-js/sha256';
import request from '@/utils/request';
import ConfigAccumulator from '@/utils/config/ConfigAccumalator';
import { cookieKeys, localStorageKeys, serviceEndpoints } from '@/utils/config/defaults';
import { InfoHandler, ErrorHandler, InfoKeys } from '@/utils/logging/ErrorHandler';
import { logout as authLogout } from '@/utils/auth/Auth';

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
      const baseUrl = import.meta.env.VITE_APP_DOMAIN || window.location.origin;
      request.get(`${baseUrl}${serviceEndpoints.getUser}`).then((response) => {
        if (!response.data) {
          reject(Error('Error, expected data not returned'));
        } else if (response.data.errorMsg) {
          reject(response.data.errorMsg);
        } else {
          try {
            this.users.forEach((user) => {
              if (user.user.toLowerCase() === response.data.user.toLowerCase()) {
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
      }).catch(reject);
    });
  }

   
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
