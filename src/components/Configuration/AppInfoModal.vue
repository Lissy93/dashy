<template>
  <modal :name="modalName" :resizable="true" width="55%" height="80%" classes="dashy-modal">
    <div class="about-modal">
      <router-link to="/about" class="title"><h2>App Info</h2></router-link>
      <!-- Error Log -->
      <h3>Error Log</h3>
      <pre v-if="errorLog" class="logs"><code>{{ errorLog }}</code></pre>
      <p v-else>No recent errors detected :)</p>
      <hr />
      <!-- Getting Help -->
      <h3>Help & Support</h3>
      For getting support with running or configuring Dashy, see the <a href="https://github.com/Lissy93/dashy/discussions">Discussions</a>
      <!-- Please help out :) -->
      <h3>Supporting Dashy</h3>
      For ways that you can get involved, check out the <a href="https://github.com/Lissy93/dashy/blob/master/docs/contributing.md">Contributing</a> page.
      <!-- Bug Reports -->
      <h3>Report a Bug</h3>
      If you think you've found a bug, then please <a href="https://github.com/Lissy93/dashy/issues/new/choose">raise an Issue</a>.
      <!-- Source and Docs Links -->
      <h3>More Info</h3>
      Source: <a href="https://github.com/lissy93/dashy">github.com/lissy93/dashy</a><br>
      Documentation: <a href="https://dashy.to/docs">dashy.to/docs</a>
      <!-- Privacy & Security -->
      <h3>Privacy & Security</h3>
      For a break-down of how your data is managed by Dashy, see
      the <a href="https://github.com/Lissy93/dashy/blob/master/docs/privacy.md">Privacy Policy</a>.<br>
      For advise in securing your dashboard, you can reference the
      <a href="https://github.com/Lissy93/dashy/blob/master/docs/management.md">Management Docs</a>.<br>
      If you've found a potential security issue, report it following our
      <a href="https://github.com/Lissy93/dashy/blob/master/.github/SECURITY.md">Security Policy</a>
      <!-- License -->
      <h3>License</h3>
      Licensed under <a href="https://github.com/Lissy93/dashy/blob/master/LICENSE">MIT X11</a>.
      Copyright <a href="https://aliciasykes.com">Alicia Sykes</a> © 2021.<br>
      For licenses for third-party modules, please see <a href="https://github.com/Lissy93/dashy/blob/master/.github/LEGAL.md">Legal</a>.<br>
      For the full list of contributors and thanks, see <a href="https://github.com/Lissy93/dashy/blob/master/docs/credits.md">Credits</a>.
      <!-- App Version -->
      <h3>Version</h3>
      <AppVersion class="app-version" />
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
      errorLog: this.getErrorLog(),
    };
  },
  methods: {
    getErrorLog() {
      return sessionStorage.getItem(sessionStorageKeys.ERROR_LOG) || '';
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
    font-size: 1.2rem;
    margin: 0.75rem 0 0.2rem 0;
    color: var(--about-page-accent);
  }
  a {
    color: var(--about-page-accent);
  }
  a.info {
    text-decoration: underline;
    margin-left: 0.2rem;
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

<style lang="scss">
div.about-modal {
  .app-version {
    text-align: left;
    display: flex;
    align-items: self-end;
    p { margin: 0; }
  }
}
</style>
