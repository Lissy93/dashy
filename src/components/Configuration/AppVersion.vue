<template>
  <div class="app-version" v-if="isVersionValid()">
    <!-- Current Version -->
    <p>
      {{ $t('updates.app-version-note') }} {{ appVersion }}
    </p>
    <div v-if="checksEnabled">
      <!-- Results haven't come in yet, either still checking, or error -->
      <p v-if="!finished">
        {{ error ? 'Error checking for updates.' : 'Chcekcing for Updates...' }}
      </p>
      <!-- App is up-to-date -->
      <p v-if="finished && isUpToDate" class="up-to-date">
        ✅ {{ $t('updates.up-to-date') }}
      </p>
      <!-- An update is available, but not too out-of-date -->
      <p  v-else-if="finished && !veryOutOfDate" class="update-availible">
        ⚠️{{ $t('updates.out-of-date') }}: <b>{{ latestVersion }}</b>
      </p>
      <!-- Update available, app is VERY out of date, show some additional info -->
      <p  v-else-if="finished && veryOutOfDate" class="big-update-availible">
        ❗ {{ $t('updates.out-of-date') }}: <b>{{ latestVersion }}</b>
        <span class="please-update">
          {{ $t('updates.unsupported-version-l1') }}.<br>
          {{ $t('updates.unsupported-version-l2') }} {{ latestVersion }}
        </span>
      </p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { Progress } from 'rsup-progress';
import ErrorHandler from '@/utils/ErrorHandler';

export default {
  name: 'AppInfoModal',
  computed: {
    appConfig() {
      return this.$store.getters.appConfig;
    },
  },
  data() {
    return {
      appVersion: process.env.VUE_APP_VERSION, // Current version, from package.json
      progress: new Progress({ color: 'var(--progress-bar)' }),
      latestVersion: '', // Will store latest version, when request returns
      checksEnabled: true, // Should we check for updates
      isUpToDate: true, // Is current version === latest version
      veryOutOfDate: false, // If the app is more than 5 versions out of date
      finished: false, // Set to true when request is done
      error: false, // Set to true if checkig fails
    };
  },
  mounted() {
    if (!this.appVersion || (this.appConfig && this.appConfig.disableUpdateChecks)) {
      // Either current version isn't found, or user disabled checks
      this.checksEnabled = false;
    } else {
      this.checkVersion(); // Trigger the check
    }
  },
  methods: {
    /* Gets the apps latest version from Dashy's git repo */
    checkVersion() {
      const packageUrl = 'https://raw.githubusercontent.com/Lissy93/dashy/master/package.json';
      this.progress.start();
      axios.get(packageUrl).then((response) => {
        if (response && response.data && response.data.version) {
          this.latestVersion = response.data.version;
          this.isUpToDate = this.checkIfUpToDate(this.appVersion, this.latestVersion);
          this.finished = true;
          this.progress.end();
        }
      }).catch(() => {
        this.error = true;
        this.progress.end();
      });
    },
    /* Compares the current version, with the package.json version */
    checkIfUpToDate(currentVersion, latestVersion) {
      const parse = (version) => parseInt(version.replaceAll('.', ''), 10);
      const difference = parse(latestVersion) - parse(currentVersion);
      if (difference > 5) this.veryOutOfDate = true;
      return difference <= 0;
    },
    /* Checks that the input version is correctly parsed */
    isVersionValid() {
      const isValid = !Number.isNaN(parseInt(this.appVersion.replaceAll('.', ''), 10));
      if (!isValid) { // If invalid, then record an error
        ErrorHandler(
          'Unable to check for updates, because current version is unavailible.'
          + ` ${this.appVersion} is not a valid version.`,
        );
      }
      return isValid;
    },
  },
};
</script>

<style scoped lang="scss">

div.app-version {
  color: var(--settings-text-color);
  text-align: center;
  p {
    margin: 0.5rem auto;
    color: var(--transparent-white-50);
    cursor: default;
    &.up-to-date {
      color: var(--success);
      font-weight: bold;
      opacity: 0.8;
    }
    &.update-availible {
      color: var(--warning);
      opacity: 0.8;
    }
    &.big-update-availible {
      color: var(--danger);
      .please-update {
        font-size: 0.8rem;
        color: var(--danger);
        display: block;
      }
    }
  }
}

</style>
