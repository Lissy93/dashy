<template>
  <modal :name="modalName" :resizable="true" width="60%" height="60%" classes="dashy-modal">
    <div class="about-modal">
      <router-link to="/about" class="title"><h2>App Info</h2></router-link>
      <!-- App Version -->
      <h3>Version</h3>
      <AppVersion class="app-version" />
      <!-- Error Log -->
      <h3>Error Log</h3>
      <pre v-if="errorLog" class="logs"><code>{{ errorLog }}</code></pre>
      <p v-else>No recent errors detected :)</p>
      <!-- Service Worker Status -->
      <h3>Service Worker Status</h3>
      <pre class="logs"><code v-html="serviceWorkerInfo">{{ serviceWorkerInfo }}</code></pre>
      <!-- Config Validation Status -->
      <h3>Config Validation Status</h3>
      <pre class="logs"><code>{{getIsConfigValidStatus()}}</code></pre>
      <hr />
      <!-- Help Links -->
      <h3>Help & Support</h3>
      <ul>
        <li><a href="https://github.com/Lissy93/dashy/discussions">Get Support</a></li>
        <li><a href="https://github.com/Lissy93/dashy/issues/new/choose">Report a Bug</a></li>
      </ul>
      <span class="small-note">Please include the following info in your bug report: </span>
      <a class="info" @click="showInfo = !showInfo">{{ showInfo ? 'Hide' : 'Show'}} system info</a>
      <div class="system-info" v-if="showInfo">
        <h4>System Info</h4>
        <code><b>Dashy Version:</b> V {{appVersion}}</code><br>
        <code><b>Browser:</b> {{systemInfo.browser}}</code><br>
        <code><b>Is Mobile?</b> {{systemInfo.isMobile ? 'Yes' : 'No'}}</code><br>
        <code><b>OS:</b> {{systemInfo.os}}</code><br>
      </div>
      <!-- About App -->
      <h3>About</h3>
      <p class="about-text">
        Source: <a href="https://github.com/lissy93/dashy">github.com/lissy93/dashy</a><br>
        Documentation: <a href="https://dashy.to/docs">dashy.to/docs</a>
      </p>
      <!-- License -->
      <h3>License</h3>
      <p>Licensed under MIT X11. Copyright © 2021</p>
      <br><br>
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
      errorLog: this.getErrorLog(),
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
    getErrorLog() {
      return sessionStorage.getItem(sessionStorageKeys.ERROR_LOG) || '';
    },
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

div.about-modal {
  background: var(--about-page-background);
  color: var(--about-page-color);
  overflow-y: auto;
  padding: 0 1rem;
  height: 100%;
  p, ul li, a {
    font-size: 1rem;
  }

  a.title {
    text-decoration: none;
    h2 {
      font-size: 1.8rem;
      text-align: center;
      margin: 1rem;
    }
  }
  h3 {
    font-size: 1.3rem;
    margin: 1rem 0 0.2rem 0;
    color: var(--about-page-accent);
  }
  p.small-note {
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
  a.info {
    text-decoration: underline;
    margin-left: 0.2rem;
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
  .app-version {
    text-align: left;
  }
  pre.logs {
    max-height: 200px;
    overflow-y: auto;
    padding: 1rem;
    font-size: 0.75rem;
    border-radius: var(--curve-factor-small);
    text-align: left;
    color: var(--white);
    background: var(--black);
    white-space: pre-wrap;
  }
}

</style>
