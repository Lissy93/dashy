import Keycloak from 'keycloak-js';
import ConfigAccumulator from '@/utils/ConfigAccumalator';
import { localStorageKeys } from '@/utils/defaults';
import ErrorHandler from '@/utils/ErrorHandler';

const getAppConfig = () => {
  const Accumulator = new ConfigAccumulator();
  const config = Accumulator.config();
  return config.appConfig || {};
};

class KeycloakAuth {
  constructor() {
    const { auth } = getAppConfig();
    const {
      serverUrl, realm, clientId, legacySupport,
    } = auth.keycloak;
    const url = legacySupport ? `${serverUrl}/auth` : serverUrl;
    const initOptions = {
      url, realm, clientId, onLoad: 'login-required',
    };

    this.keycloakClient = Keycloak(initOptions);
  }

  login() {
    return new Promise((resolve, reject) => {
      this.keycloakClient.init({ onLoad: 'login-required' })
        .then((auth) => {
          if (auth) {
            this.storeKeycloakInfo();
            return resolve();
          } else {
            return reject(new Error('Not authenticated'));
          }
        })
        .catch((reason) => reject(reason));
    });
  }

  logout() {
    localStorage.removeItem(localStorageKeys.USERNAME);
    localStorage.removeItem(localStorageKeys.KEYCLOAK_INFO);
    this.keycloakClient.logout();
  }

  storeKeycloakInfo() {
    if (this.keycloakClient.tokenParsed && typeof this.keycloakClient.tokenParsed === 'object') {
      const {
        groups,
        realm_access: realmAccess,
        resource_access: resourceAccess,
        azp: clientId,
        preferred_username: preferredUsername,
      } = this.keycloakClient.tokenParsed;

      const realmRoles = realmAccess.roles || [];

      let clientRoles = [];
      if (Object.hasOwn(resourceAccess, clientId)) {
        clientRoles = resourceAccess[clientId].roles || [];
      }

      const roles = [...realmRoles, ...clientRoles];

      const info = {
        groups,
        roles,
      };

      localStorage.setItem(localStorageKeys.KEYCLOAK_INFO, JSON.stringify(info));
      localStorage.setItem(localStorageKeys.USERNAME, preferredUsername);
    }
  }
}

export const isKeycloakEnabled = () => {
  const { auth } = getAppConfig();
  if (!auth) return false;
  return auth.enableKeycloak || false;
};

let keycloak;

export const initKeycloakAuth = () => {
  keycloak = new KeycloakAuth();
  return keycloak.login();
};

export const getKeycloakAuth = () => {
  if (!keycloak) {
    ErrorHandler("Keycloak not initialized, can't get instance of class");
  }
  return keycloak;
};
