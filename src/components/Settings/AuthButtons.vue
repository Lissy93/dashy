<template>
  <div class="auth-buttons" v-if="authLabel">
    <span v-if="greeting" class="user-type-note">{{ greeting }}</span>
    <button
      type="button"
      class="auth-btn"
      @click="run"
      v-tooltip="tooltip($t(authLabel))"
      tabindex="-2"
    >
      <IconLogout />
      <span>{{ $t(authLabel) }}</span>
    </button>
  </div>
</template>

<script>
import router from '@/router';
import { logout as registerLogout } from '@/utils/auth/Auth';
import { getKeycloakAuth, isKeycloakEnabled } from '@/utils/auth/KeycloakAuth';
import { getOidcAuth, isOidcEnabled } from '@/utils/auth/OidcAuth';
import { localStorageKeys, userStateEnum } from '@/utils/config/defaults';
import IconLogout from '@/assets/interface-icons/user-logout.svg';

const SIGN_OUT_STATES = [
  userStateEnum.loggedIn,
  userStateEnum.keycloakEnabled,
  userStateEnum.oidcEnabled,
];

export default {
  name: 'AuthButtons',
  components: { IconLogout },
  props: {
    userType: Number,
  },
  computed: {
    authLabel() {
      if (SIGN_OUT_STATES.includes(this.userType)) return 'settings.sign-out-tooltip';
      if (this.userType === userStateEnum.guestAccess) return 'settings.sign-in-tooltip';
      return null;
    },
    greeting() {
      if (!SIGN_OUT_STATES.includes(this.userType)) return '';
      const username = localStorage[localStorageKeys.USERNAME];
      return username ? this.$t('settings.sign-in-welcome', { username }) : '';
    },
  },
  methods: {
    run() {
      switch (this.userType) {
        case userStateEnum.loggedIn: return this.logout();
        case userStateEnum.keycloakEnabled: return this.keycloakLogout();
        case userStateEnum.oidcEnabled: return this.oidcLogout();
        case userStateEnum.guestAccess: return this.goToLogin();
        default: return null;
      }
    },
    logout() {
      registerLogout();
      this.$toast(this.$t('login.logout-message'));
      setTimeout(() => router.push({ path: '/login' }), 500);
    },
    keycloakLogout() {
      const keycloak = getKeycloakAuth();
      this.$toast(this.$t('login.logout-message'));
      setTimeout(() => keycloak.logout(), 500);
    },
    oidcLogout() {
      const oidc = getOidcAuth();
      this.$toast(this.$t('login.logout-message'));
      setTimeout(() => oidc.logout(), 500);
    },
    goToLogin() {
      if (isOidcEnabled()) {
        getOidcAuth().userManager.signinRedirect();
      } else if (isKeycloakEnabled()) {
        const kc = getKeycloakAuth();
        kc.keycloakClient.login(kc.loginOptions);
      } else {
        router.push({ path: '/login' });
      }
    },
    tooltip(content) { return { content }; },
  },
};
</script>

<style scoped lang="scss">
.auth-buttons {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  width: 100%;
}

.user-type-note {
  flex: 1;
  min-width: 0;
  font-size: 0.8rem;
  color: var(--settings-text-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.auth-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  height: 1.75rem;
  padding: 0 0.5rem;
  background: var(--background);
  color: var(--settings-text-color);
  border: 1px solid currentColor;
  border-radius: var(--curve-factor);
  font-size: 0.8rem;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;

  svg { width: 1rem; height: 1rem; fill: currentColor; flex-shrink: 0; }

  &:hover, &:focus-visible {
    background: var(--settings-text-color);
    color: var(--background);
    outline: none;
  }
}
</style>
