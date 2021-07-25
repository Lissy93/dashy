<template>
  <modal :name="modalName" :resizable="true" width="40%" height="60%" classes="dashy-modal">
    <div class="about-modal">
      <router-link to="/about">
      <h2>Dashy</h2>
      </router-link>
      <AppVersion />
      <h3>Service Worker Status</h3>
      <code v-html="serviceWorkerInfo">{{ serviceWorkerInfo }}</code>
      <br>
      <h3>Config Validation Status</h3>
      <code>{{getIsConfigValidStatus()}}</code>
      <br>
      <h3>Help & Support</h3>
      <ul>
        <li><a href="https://git.io/JnqPR">Report a Bug</a></li>
        <li><a href="https://git.io/JnDxL">Request a Feature</a></li>
        <li><a href="https://git.io/JnDxs">Ask a Question</a></li>
        <li><a href="https://git.io/JnDxn">Leave Feedback</a></li>
        <li><a href="https://github.com/Lissy93/dashy/discussions">Join the Discussion</a></li>
      </ul>
      <p class="small-note">Please include the following info in your bug report:</p>
      <a @click="showInfo = !showInfo">{{ showInfo ? 'Hide' : 'Show'}} system info</a>
      <div class="system-info" v-if="showInfo">
        <h4>System Info</h4>
        <code><b>Dashy Version:</b> V {{appVersion}}</code><br>
        <code><b>Browser:</b> {{systemInfo.browser}}</code><br>
        <code><b>Is Mobile?</b> {{systemInfo.isMobile ? 'Yes' : 'No'}}</code><br>
        <code><b>OS:</b> {{systemInfo.os}}</code><br>
      </div>
      <h3>About</h3>
      <p class="about-text">
        Documentation and Source Code available on
        <a href="https://github.com/lissy93/dashy">GitHub</a>
      </p>
      <h3>License</h3>
      <code>Licensed under MIT X11. Copyright © 2021</code>
    </div>
  </modal>
</template>

<script>
import AppVersion from '@/components/Configuration/AppVersion';
import { modalNames, sessionStorageKeys } from '@/utils/defaults';

export default {
  name: 'AppInfoModal',
  components: {
    AppVersion,
  },
  data() {
    return {
      modalName: modalNames.ABOUT_APP,
      appVersion: process.env.VUE_APP_VERSION,
      systemInfo: this.getSystemInfo(),
      serviceWorkerInfo: 'Checking...',
      showInfo: false,
    };
  },
  mounted() {
    setTimeout(() => {
      this.serviceWorkerInfo = this.getSwStatus();
    }, 100);
  },
  methods: {
    getIsConfigValidStatus() {
      const isValidVar = process.env.VUE_APP_CONFIG_VALID;
      if (isValidVar === undefined) return 'Config validation status is missing';
      return `Config is ${isValidVar ? 'Valid' : 'Invalid'}`;
    },
    getSwStatus() {
      const sessionData = sessionStorage[sessionStorageKeys.SW_STATUS];
      const swInfo = sessionData ? JSON.parse(sessionData) : {};
      let swStatus = '';
      if (swInfo.registered) swStatus += 'Service worker registered<br>';
      if (swInfo.ready) swStatus += 'Dashy is being served from service worker<br>';
      if (swInfo.cached) swStatus += 'Content has been cached for offline use<br>';
      if (swInfo.updateFound) swStatus += 'New content is downloading<br>';
      if (swInfo.updated) swStatus += 'New content is available; please refresh<br>';
      if (swInfo.offline) swStatus += 'No internet connection found. App is running in offline mode<br>';
      if (swInfo.error) swStatus += 'Error during service worker registration<br>';
      if (swInfo.devMode) swStatus += 'App running in dev mode, no need for service worker<br>';
      if (swStatus.length === 0) swStatus += 'No service worker info available';
      return swStatus;
    },
    getSystemInfo() {
      const { userAgent } = navigator;

      // Find Operating System
      let os = 'Unknown';
      if (userAgent.indexOf('Win') !== -1) os = 'Windows';
      else if (userAgent.indexOf('Mac') !== -1) os = 'MacOS';
      else if (userAgent.indexOf('Android') !== -1) os = 'Android';
      else if (userAgent.indexOf('iPhone') !== -1) os = 'iOS';
      else if (userAgent.indexOf('Linux') !== -1) os = 'Linux';
      else if (userAgent.indexOf('X11') !== -1) os = 'UNIX';

      // Find Browser
      let browser = 'Unknown';
      if (userAgent.indexOf('Opera') !== -1) browser = 'Opera';
      else if (userAgent.indexOf('Chrome') !== -1) browser = 'Chrome';
      else if (userAgent.indexOf('Safari') !== -1) browser = 'Safari';
      else if (userAgent.indexOf('Firefox') !== -1) browser = 'Firefox';
      else if (userAgent.indexOf('MSIE') !== -1) browser = 'IE';
      else browser = 'Unknown';

      const isMobile = !!navigator.userAgent.match(/iphone|android|blackberry/ig) || false;

      return {
        os,
        browser,
        userAgent,
        isMobile,
      };
    },
  },
};
</script>

<style scoped lang="scss">

span.options-label {
  color: var(--settings-text-color);
}

.display-options {
  color: var(--settings-text-color);
  svg {
    path {
      fill: var(--settings-text-color);
    }
    width: 1rem;
    height: 1rem;
    margin: 0.2rem;
    padding: 0.2rem;
    text-align: center;
    background: var(--background);
    border: 1px solid currentColor;
    border-radius: var(--curve-factor);
    cursor: pointer;
    &:hover, &.selected {
      background: var(--settings-text-color);
      path { fill: var(--background); }
    }
  }
}

div.about-modal {
  background: var(--about-page-background);
  color: var(--about-page-color);
  padding: 1rem;
  height: 100%;
  hr {
    border-color: var(--about-page-accent);
  }
  h2 {
    text-decoration: none;
    font-size: 1.8rem;
    text-align: center;
    margin: 0.2rem;
  }
  h3 {
    font-size: 1.3rem;
    margin: 0.75rem 0 0.2rem 0;
    color: var(--about-page-accent);
  }
  p.small-note {
    font-size: 0.9rem;
    margin: 0.2rem 0;
  }
  p.about-text {
    margin: 0.2rem 0;
  }
  a {
    color: var(--about-page-accent);
  }
  ul {
    margin-top: 0.2rem;
  }
  .system-info {
    font-size: 0.8rem;
    background: var(--black);
    color: var(--white);
    border-radius: var(--curve-factor-small);
    padding: 0.5rem;
    border: 1px solid var(--white);
    width: fit-content;
    h4 {
      font-size: 0.8rem;
      margin: 0 0 0.2rem 0;
      text-decoration: underline;
    }
  }
}

</style>
