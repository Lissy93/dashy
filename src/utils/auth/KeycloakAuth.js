import ConfigAccumulator from '@/utils/config/ConfigAccumalator';
import { localStorageKeys } from '@/utils/config/defaults';
import ErrorHandler from '@/utils/logging/ErrorHandler';

const getAppConfig = () => {
  const Accumulator = new ConfigAccumulator();
  const config = Accumulator.config();
  return config.appConfig || {};
};

const isKeycloakGuestAccessEnabled = () => {
  const { auth } = getAppConfig();
  return auth && auth.enableGuestAccess;
};

class KeycloakAuth {
  constructor(Keycloak) {
    const { auth } = getAppConfig();
    const {
      serverUrl, realm, clientId, idpHint, legacySupport,
    } = auth.keycloak;
    if (typeof clientId === 'number' && !Number.isSafeInteger(clientId)) {
      ErrorHandler(
        'Keycloak clientId appears invalid. ',
        'You passed it as a number, and it is too long to be parsed without loosing precision. '
        + 'Wrap it in quotes in your conf.yml (e.g. clientId: "12345") to force it to be a string.',
      );
    }
    const url = legacySupport ? `${serverUrl}/auth` : serverUrl;
    const initOptions = { url, realm, clientId };
    const loginOptions = idpHint ? { idpHint } : {};

    this.loginOptions = loginOptions;
    this.keycloakClient = Keycloak(initOptions);
  }

  login() {
    return new Promise((resolve, reject) => {
      this.keycloakClient.init({ onLoad: 'check-sso' })
        .then((auth) => {
          if (auth) {
            this.storeKeycloakInfo();
            return resolve();
          } else if (isKeycloakGuestAccessEnabled()) {
            // Don't redirect, allow guest access
            return resolve();
          } else {
            return this.keycloakClient.login(this.loginOptions);
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

export const initKeycloakAuth = async () => {
  const { default: Keycloak } = await import('keycloak-js');
  keycloak = new KeycloakAuth(Keycloak);
  return keycloak.login();
};

export const getKeycloakAuth = () => {
  if (!keycloak) {
    ErrorHandler("Keycloak not initialized, can't get instance of class");
  }
  return keycloak;
};
