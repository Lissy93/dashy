<template>
  <modal :name="modalName" :resizable="true" width="50%" height="60%" classes="dashy-modal">
    <div class="rebuild-app-container">
      <!-- Title, intro and start button -->
      <h3 class="rebuild-app-title">Rebuild Application</h3>
      <p>
        A rebuild is required for changes written to the conf.yml file to take effect.
        This should happen automatically, but if it hasn't, you can manually trigger it here.<br>
        This is not required for modifications stored locally.
      </p>
      <Button :click="startBuild" :disabled="loading">
        <template v-slot:text>{{ loading ? 'Building...' : 'Start Build' }}</template>
        <template v-slot:icon><RebuildIcon /></template>
      </Button>
      <!-- Loading animation and text (shown while build is happening) -->
      <div v-if="loading" class="loader-info">
        <LoadingAnimation class="loader" />
        <p class="loading-message">This may take a few minutes...</p>
      </div>
      <!-- Build response, and next actions (shown after build is done) -->
      <div class="rebuild-response" v-if="success !== undefined">
        <p v-if="success" class="response-status success">✅ Build completed succesfully</p>
        <p v-else class="response-status failure">❌ Build operation failed</p>
        <pre class="output"><code>{{ output || error }}</code></pre>
        <p class="rebuild-message">{{ message }}</p>
        <p v-if="success" class="rebuild-message">
          A page reload is now required for changes to take effect
        </p>
        <Button :click="refreshPage" v-if="success">
          <template v-slot:text>Reload Page</template>
          <template v-slot:icon><ReloadIcon /></template>
        </Button>
      </div>
    </div>
  </modal>
</template>

<script>
import axios from 'axios';
import Button from '@/components/FormElements/Button';
import { modalNames } from '@/utils/defaults';
import RebuildIcon from '@/assets/interface-icons/application-rebuild.svg';
import ReloadIcon from '@/assets/interface-icons/application-reload.svg';
import LoadingAnimation from '@/assets/interface-icons/loader.svg';

export default {
  name: 'RebuildApp',
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
  }),
  methods: {
    startBuild() {
      const baseUrl = process.env.VUE_APP_DOMAIN || window.location.origin;
      const endpoint = `${baseUrl}/config-manager/rebuild`;
      this.loading = true;
      axios.get(endpoint)
        .then((response) => {
          this.finished(response.data || false);
        })
        .catch((error) => {
          this.finished({ success: false, error });
        });
    },
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
        (this.success ? '✅ Build Completed Succesfully' : '❌ Build Failed'),
        { className: `toast-${this.success ? 'success' : 'error'}` },
      );
    },
    refreshPage() {
      location.reload(); // eslint-disable-line no-restricted-globals
    },
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
