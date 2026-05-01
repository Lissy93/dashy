<template>
  <ConfirmDialog
    v-model:open="showDialog"
    :title="$t('remote-config.title')"
    :confirmText="$t('remote-config.apply-button')"
    @confirm="apply"
    @cancel="dismiss"
  >
    <template v-if="preview">
      <p class="intro">{{ $t('remote-config.intro') }}</p>
      <p class="warning">{{ $t('remote-config.warning') }}</p>
      <dl class="preview-fields">
        <dt>{{ $t('remote-config.field-title') }}</dt>
        <dd>{{ preview.title }}</dd>
        <dt>{{ $t('remote-config.field-source') }}</dt>
        <dd class="src" :title="preview.url">{{ preview.url }}</dd>
        <dt>{{ $t('remote-config.field-sections') }}</dt>
        <dd>{{ preview.sectionCount }}</dd>
        <dt>{{ $t('remote-config.field-items') }}</dt>
        <dd>{{ preview.itemCount }}</dd>
      </dl>
      <p class="note">{{ $t('remote-config.preview-note') }}</p>
    </template>
  </ConfirmDialog>
  <div v-if="originalConfig" class="preview-pill" role="status">
    <span class="label">{{ $t('remote-config.previewing-banner') }}</span>
    <button type="button" class="revert" @click="revert">
      {{ $t('remote-config.revert-button') }}
    </button>
  </div>
</template>

<script>
import { load as yamlLoad } from 'js-yaml';
import request from '@/utils/request';
import ErrorHandler from '@/utils/logging/ErrorHandler';
import StoreKeys from '@/utils/StoreMutations';
import ConfirmDialog from '@/components/FormElements/ConfirmDialog';

export default {
  name: 'RemoteConfigLoader',
  components: { ConfirmDialog },
  data() {
    return {
      showDialog: false,
      preview: null,
      pendingConfig: null,
      originalConfig: null,
    };
  },
  watch: {
    /* If config gets reloaded via sub-page nav, our snapshot is stale — drop it. */
    '$store.state.currentConfigInfo.confId'() {
      this.originalConfig = null;
    },
  },
  mounted() {
    const url = this.parseUrlParam();
    if (url) this.loadRemoteConfig(url);
  },
  methods: {
    parseUrlParam() {
      const raw = this.$route?.query?.config;
      const value = Array.isArray(raw) ? raw[0] : raw;
      const url = typeof value === 'string' ? value.trim() : '';
      if (!url) return null;
      if (!/^https?:\/\//i.test(url)) {
        this.fail(`Remote config URL must be http(s): '${url}'`, 'error-invalid-url');
        return null;
      }
      return url;
    },
    async loadRemoteConfig(url) {
      let response;
      try {
        response = await request.get(url);
      } catch (err) {
        this.fail(`Failed to fetch remote config: ${url}`, 'error-fetch', err);
        return;
      }
      let parsed;
      try {
        parsed = typeof response.data === 'string' ? yamlLoad(response.data) : response.data;
      } catch (err) {
        this.fail(`Remote config YAML parse failed: ${url}`, 'error-parse', err);
        return;
      }
      if (!this.looksLikeConfig(parsed)) {
        this.fail(`Remote file is not a Dashy config: ${url}`, 'error-not-config');
        return;
      }
      this.pendingConfig = parsed;
      this.preview = this.summarise(url, parsed);
      this.showDialog = true;
    },
    looksLikeConfig(cfg) {
      if (!cfg || typeof cfg !== 'object' || Array.isArray(cfg)) return false;
      return 'pageInfo' in cfg || 'sections' in cfg || 'appConfig' in cfg;
    },
    summarise(url, cfg) {
      const sections = Array.isArray(cfg.sections) ? cfg.sections : [];
      const itemCount = sections.reduce(
        (n, s) => n + (Array.isArray(s.items) ? s.items.length : 0), 0,
      );
      return {
        url,
        title: cfg.pageInfo?.title || '—',
        sectionCount: sections.length,
        itemCount,
      };
    },
    apply() {
      const snapshot = this.$store.state.config;
      try {
        this.$store.commit(StoreKeys.SET_CONFIG, this.pendingConfig);
        this.originalConfig = snapshot;
        this.$toast(this.$t('remote-config.applied-toast'));
      } catch (err) {
        this.fail('Failed to apply remote config', 'error-apply', err);
        return;
      }
      this.cleanup();
    },
    revert() {
      if (!this.originalConfig) return;
      this.$store.commit(StoreKeys.SET_CONFIG, this.originalConfig);
      this.originalConfig = null;
    },
    dismiss() {
      this.cleanup();
    },
    cleanup() {
      this.pendingConfig = null;
      this.preview = null;
      this.stripParam();
    },
    stripParam() {
      if (!this.$route?.query?.config) return;
      const query = { ...this.$route.query };
      delete query.config;
      this.$router.replace({ path: this.$route.path, query, hash: this.$route.hash });
    },
    fail(logMessage, i18nKey, err) {
      ErrorHandler(logMessage, err);
      this.$toast.error(this.$t(`remote-config.${i18nKey}`));
      this.cleanup();
    },
  },
};
</script>

<style scoped lang="scss">
.intro {
  margin: 0 0 0.5rem;
}

.warning {
  margin: 0 0 0.75rem;
  color: var(--danger);
  opacity: 1;
}

.preview-fields {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.4rem 0.75rem;
  margin: 0 0 0.75rem;
  dt {
    font-weight: bold;
    opacity: var(--dimming-factor);
  }
  dd {
    margin: 0;
    word-break: break-word;
    &.src {
      font-family: var(--font-monospace);
      font-size: 0.85rem;
    }
  }
}

.note {
  margin: 0;
  padding: 0.5rem 0.75rem;
  font-size: 0.9rem;
  border-left: 2px solid var(--primary);
  background: color-mix(in srgb, var(--primary), transparent 90%);
}

.preview-pill {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  z-index: 40;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.75rem;
  font-size: 0.9rem;
  color: var(--background);
  background: var(--primary);
  border-radius: var(--curve-factor);
  box-shadow: 0 4px 12px hsl(0deg 0% 0% / 30%);

  .label { font-weight: bold; }

  .revert {
    padding: 0.2rem 0.6rem;
    font-size: 0.85rem;
    color: var(--primary);
    background: var(--background);
    border: none;
    border-radius: var(--curve-factor);
    cursor: pointer;
    &:hover, &:focus-visible {
      background: var(--background-darker);
      outline: none;
    }
  }
}
</style>
