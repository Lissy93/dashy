import { UserManager, WebStorageStateStore } from 'oidc-client-ts';
import ConfigAccumulator from '@/utils/ConfigAccumalator';
import { localStorageKeys } from '@/utils/defaults';
import ErrorHandler from '@/utils/ErrorHandler';
import { statusMsg, statusErrorMsg } from '@/utils/CoolConsole';

const getAppConfig = () => {
  const Accumulator = new ConfigAccumulator();
  const config = Accumulator.config();
  return config.appConfig || {};
};

class OidcAuth {
  constructor() {
    const { auth } = getAppConfig();
    const {
      clientId,
      endpoint,
      scope,
      adminGroup,
      adminRole,
    } = auth.oidc;
    const settings = {
      userStore: new WebStorageStateStore({ store: window.localStorage }),
      authority: endpoint,
      client_id: clientId,
      redirect_uri: `${window.location.origin}`,
      response_type: 'code',
      scope: scope || 'openid profile email roles groups',
      response_mode: 'query',
      filterProtocolClaims: true,
    };

    this.adminGroup = adminGroup;
    this.adminRole = adminRole;
    this.userManager = new UserManager(settings);
  }

  async login() {
    const url = new URL(window.location.href);
    const code = url.searchParams.get('code');

    if (code) {
      await this.userManager.signinCallback(window.location.href);
      window.location.href = '/';
      return;
    }

    const user = await this.userManager.getUser();

    if (user === null) {
      await this.userManager.signinRedirect();
    } else {
      const { roles = [], groups = [] } = user.profile;
      const info = {
        groups,
        roles,
      };
      const isAdmin = (Array.isArray(groups) && groups.includes(this.adminGroup))
                      || (Array.isArray(roles) && roles.includes(this.adminRole))
                      || false;

      statusMsg(`user: ${user.profile.preferred_username}   admin: ${isAdmin}`, JSON.stringify(info));

      localStorage.setItem(localStorageKeys.KEYCLOAK_INFO, JSON.stringify(info));
      localStorage.setItem(localStorageKeys.USERNAME, user.profile.preferred_username);
      localStorage.setItem(localStorageKeys.ISADMIN, isAdmin);
    }
  }

  async logout() {
    localStorage.removeItem(localStorageKeys.USERNAME);
    localStorage.removeItem(localStorageKeys.KEYCLOAK_INFO);
    localStorage.removeItem(localStorageKeys.ISADMIN);

    try {
      await this.userManager.signoutRedirect();
    } catch (reason) {
      statusErrorMsg('logout', 'could not log out. Redirecting to OIDC instead', reason);
      window.location.href = this.userManager.settings.authority;
    }
  }
}

export const isOidcEnabled = () => {
  const { auth } = getAppConfig();
  if (!auth) return false;
  return auth.enableOidc || false;
};

let oidc;

export const initOidcAuth = () => {
  oidc = new OidcAuth();
  return oidc.login();
};

export const getOidcAuth = () => {
  if (!oidc) {
    ErrorHandler("OIDC not initialized, can't get instance of class");
  }
  return oidc;
};
