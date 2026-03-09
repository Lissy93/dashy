<template>
  <modal
    :name="modalName"
    :resizable="true"
    width="50%"
    height="80%"
    classes="dashy-modal edit-app-config"
    @closed="modalClosed"
  >
  <div class="edit-app-config-inner" v-if="allowViewConfig">
  <h3>{{ $t('interactive-editor.menu.edit-app-config-btn') }}</h3>
  <div class="app-config-intro">
    <p class="use-caution">
      {{ $t('interactive-editor.edit-app-config.warning-msg-title') }}
    </p>
    {{ $t('interactive-editor.edit-app-config.warning-msg-l1') }}
    {{ $t('interactive-editor.edit-app-config.warning-msg-l2') }}
    <a href="https://dashy.to/docs/configuring#appconfig-optional">
      {{ $t('interactive-editor.edit-app-config.warning-msg-docs') }}
    </a>
    {{ $t('interactive-editor.edit-app-config.warning-msg-l3') }}
  </div>
  <SaveCancelButtons :saveClick="saveToState" :cancelClick="cancelEditing" />
  <div class="json-editor-wrap">
    <textarea
      v-model="jsonString"
      class="app-config-editor"
      spellcheck="false"
    />
    <p v-if="jsonError" class="json-error">{{ jsonError }}</p>
  </div>
  <SaveCancelButtons :saveClick="saveToState" :cancelClick="cancelEditing" />
  </div>
  <AccessError v-else />
  </modal>
</template>

<script>
import StoreKeys from '@/utils/StoreMutations';
import { modalNames } from '@/utils/defaults';
import AccessError from '@/components/Configuration/AccessError';
import SaveCancelButtons from '@/components/InteractiveEditor/SaveCancelButtons';

export default {
  name: 'EditAppConfig',
  data() {
    return {
      jsonString: '',
      jsonError: '',
      modalName: modalNames.EDIT_APP_CONFIG,
    };
  },
  components: {
    SaveCancelButtons,
    AccessError,
  },
  mounted() {
    this.jsonString = JSON.stringify(this.appConfig, null, 2);
  },
  computed: {
    appConfig() {
      return this.$store.getters.appConfig;
    },
    allowViewConfig() {
      return this.$store.getters.permissions.allowViewConfig;
    },
  },
  methods: {
    saveToState() {
      this.jsonError = '';
      let parsed;
      try {
        parsed = JSON.parse(this.jsonString);
      } catch (e) {
        this.jsonError = `Invalid JSON: ${e.message}`;
        return;
      }
      this.$store.commit(StoreKeys.SET_APP_CONFIG, parsed);
      this.$modal.hide(this.modalName);
      this.$store.commit(StoreKeys.SET_MODAL_OPEN, false);
      this.$store.commit(StoreKeys.SET_EDIT_MODE, true);
    },
    cancelEditing() {
      this.$modal.hide(this.modalName);
    },
    modalClosed() {
      this.$store.commit(StoreKeys.SET_MODAL_OPEN, false);
    },
  },
};
</script>

<style lang="scss">
@import '@/styles/style-helpers.scss';
@import '@/styles/media-queries.scss';

.edit-app-config-inner {
  padding: 1rem;
  background: var(--interactive-editor-background);
  color: var(--interactive-editor-color);
  height: 100%;
  overflow-y: auto;
  @extend .scroll-bar;
  h3 {
    font-size: 1.4rem;
    margin: 0.5rem;
  }
  .json-editor-wrap {
    margin: 0.5rem 0;
    .app-config-editor {
      width: 100%;
      min-height: 20rem;
      padding: 0.5rem;
      font-family: monospace;
      font-size: 0.9rem;
      color: var(--interactive-editor-color);
      background: var(--interactive-editor-background);
      border: 1px solid var(--interactive-editor-color);
      border-radius: var(--curve-factor);
      resize: vertical;
      tab-size: 2;
    }
    .json-error {
      color: var(--warning);
      margin: 0.25rem 0;
      font-size: 0.85rem;
    }
  }
  .app-config-intro {
    padding: 0.5rem;
    font-size: 0.9rem;
    color: var(--interactive-editor-color);
    background: var(--interactive-editor-background-darker);
    border-radius: var(--interactive-editor-color);
    p.use-caution {
      color: var(--warning);
      margin: 0;
      font-weight: bold;
    }
    a {
      color: var(--interactive-editor-color);
    }
  }
}
</style>
