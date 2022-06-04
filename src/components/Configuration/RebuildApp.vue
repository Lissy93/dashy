<template>
  <modal :name="modalName" :resizable="true" width="50%" height="60%" classes="dashy-modal">
    <div class="rebuild-app-container">
      <!-- Title, intro and start button -->
      <h3 class="rebuild-app-title">{{ $t('app-rebuild.title') }}</h3>
      <p>
        {{ $t('app-rebuild.rebuild-note-l1') }}
        {{ $t('app-rebuild.rebuild-note-l2') }}<br>
        {{ $t('app-rebuild.rebuild-note-l3') }}
      </p>
      <Button :click="startBuild" :disabled="loading || !allowRebuild" :disallow="!allowRebuild">
        <template v-slot:text>
          {{ loading ? $t('app-rebuild.rebuilding-status-1') : $t('app-rebuild.rebuild-button') }}
        </template>
        <template v-slot:icon><RebuildIcon /></template>
      </Button>
      <div v-if="!allowRebuild">
        <p class="disallow-rebuild-msg">{{ $t('app-rebuild.error-permission') }}</p>
      </div>
      <!-- Loading animation and text (shown while build is happening) -->
      <div v-if="loading" class="loader-info">
        <LoadingAnimation class="loader" />
        <p class="loading-message">{{ $t('app-rebuild.rebuilding-status-2') }}...</p>
      </div>
      <!-- Build response, and next actions (shown after build is done) -->
      <div class="rebuild-response" v-if="success !== undefined">
        <p v-if="success" class="response-status success">
          ✅ {{ $t('app-rebuild.success-msg') }}
        </p>
        <p v-else class="response-status failure">
          ❌ {{ $t('app-rebuild.fail-msg') }}
        </p>
        <pre class="output"><code>{{ output || error }}</code></pre>
        <p class="rebuild-message">{{ message }}</p>
        <p v-if="success" class="rebuild-message">
           {{ $t('app-rebuild.reload-note') }}
        </p>
        <Button :click="refreshPage" v-if="success">
          <template v-slot:text>{{ $t('app-rebuild.reload-button') }}</template>
          <template v-slot:icon><ReloadIcon /></template>
        </Button>
      </div>
    </div>
  </modal>
</template>

<script>
import axios from 'axios';
import { Progress } from 'rsup-progress';
import Button from '@/components/FormElements/Button';
import RebuildIcon from '@/assets/interface-icons/application-rebuild.svg';
import ReloadIcon from '@/assets/interface-icons/application-reload.svg';
import LoadingAnimation from '@/assets/interface-icons/loader.svg';
import ErrorHandler from '@/utils/ErrorHandler';
import { modalNames, serviceEndpoints } from '@/utils/defaults';
import { isUserAdmin } from '@/utils/Auth';

export default {
  name: 'RebuildApp',
  computed: {
    appConfig() {
      return this.$store.getters.appConfig;
    },
  },
  components: {
    Button,
    RebuildIcon,
    ReloadIcon,
    LoadingAnimation,
  },
  data: () => ({
    modalName: modalNames.REBUILD_APP,
    loading: false,
    success: undefined,
    error: '',
    output: '',
    message: '',
    allowRebuild: true,
    progress: new Progress({ color: 'var(--progress-bar)' }),
  }),
  methods: {
    /* Calls to the rebuild endpoint, to kickoff the app build */
    startBuild() {
      if (!this.allowRebuild) { // Double check user is allowed
        ErrorHandler('Unable to trigger rebuild, insufficient permission');
        return;
      }
      const baseUrl = process.env.VUE_APP_DOMAIN || window.location.origin;
      const endpoint = `${baseUrl}${serviceEndpoints.rebuild}`;
      this.loading = true;
      this.progress.start();
      axios.get(endpoint)
        .then((response) => {
          this.finished(response.data || false);
          this.progress.end();
        })
        .catch((error) => {
          this.finished({ success: false, error });
          this.progress.end();
        });
    },
    /* Called when rebuild is complete, updates UI with either success or fail message */
    finished(responseData) {
      this.loading = false;
      if (responseData) {
        const {
          success, output, error, message,
        } = responseData;
        this.success = success;
        this.output = output;
        this.message = message;
        this.error = error;
      }
      this.$toasted.show(
        (this.success
          ? `✅ ${this.$t('app-rebuild.success-msg')}` : `❌ ${this.$t('app-rebuild.fail-msg')}`),
        { className: `toast-${this.success ? 'success' : 'error'}` },
      );
    },
    refreshPage() {
      location.reload(); // eslint-disable-line no-restricted-globals
    },
  },
  mounted() {
    // Disable rebuild functionality if user not allowed
    if (this.appConfig.allowConfigEdit === false
      || this.appConfig.preventWriteToDisk
      || !isUserAdmin()) {
      this.allowRebuild = false;
    }
  },
};
</script>

<style scoped lang="scss">
.rebuild-app-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1rem;
  color: var(--config-settings-color);
  background: var(--config-settings-background);
  overflow: auto;

  button {
    background: var(--config-settings-background);
    color: var(--config-settings-color);
  }

  p.disallow-rebuild-msg {
    color: var(--danger);
    font-size: 1.2rem;
    margin: 0.2rem auto;
    text-align: center;
  }

  h3.rebuild-app-title {
    text-align: center;
    font-size: 2rem;
    margin: 1rem;
  }
  div.loader-info {
    margin: 0.2rem auto;
    text-align: center;
    svg.loader {
      width: 100px;
    }
    p.loading-message {
      margin: 0;
      font-size: 0.8rem;
      opacity: var(--dimming-factor);
      animation: 3s fadeIn;
      animation-fill-mode: forwards;
      opacity: 0;
      @keyframes fadeIn {
        90% { opacity: 0; }
        95% { opacity: 0.8; }
        100% { opacity: 1; }
      }
    }
  }
  div.rebuild-response {
    width: 80%;
    margin: 0 auto 4rem auto;
    text-align: center;
    p.response-status {
      font-size: 1rem;
      text-align: left;
      &.success {
        color: var(--success);
      }
      &.failure {
        color: var(--danger);
      }
    }
    pre.output {
      padding: 1rem;
      font-size: 0.75rem;
      border-radius: var(--curve-factor-small);
      text-align: left;
      color: var(--white);
      background: var(--black);
      white-space: pre-wrap;
    }
    p.rebuild-message {
      font-size: 1rem;
      text-align: left;
      margin: 0.8rem 0;
      color: var(--config-settings-color);
    }
  }
}
</style>
