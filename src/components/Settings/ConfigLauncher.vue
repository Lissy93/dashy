<template>
  <div class="config-options">
    <!-- Button and label -->
    <span>{{ $t('settings.config-launcher-label') }}</span>
    <div class="config-buttons">
      <IconSpanner @click="showEditor()" tabindex="-2"
        v-tooltip="tooltip('Update configuration')" />
    </div>

    <!-- Modal containing all the configuration options -->
    <modal :name="modalNames.CONF_EDITOR" :resizable="true" width="60%" height="85%"
      @closed="$emit('modalChanged', false)" classes="dashy-modal">
      <ConfigContainer :config="combineConfig()" />
    </modal>

    <!-- Modal for manually changing locale -->
    <modal :name="modalNames.LANG_SWITCHER" classes="dashy-modal"
      :resizable="true" width="30%" height="25%">
      <LanguageSwitcher />
    </modal>

  </div>
</template>

<script>

import IconSpanner from '@/assets/interface-icons/config-editor.svg';
import ConfigContainer from '@/components/Configuration/ConfigContainer';
import LanguageSwitcher from '@/components/Settings/LanguageSwitcher';
import { topLevelConfKeys, localStorageKeys, modalNames } from '@/utils/defaults';

export default {
  name: 'ConfigLauncher',
  data() {
    return {
      modalNames,
    };
  },
  components: {
    IconSpanner,
    ConfigContainer,
    LanguageSwitcher,
  },
  props: {
    sections: Array,
    pageInfo: Object,
    appConfig: Object,
  },
  methods: {
    showEditor: function show() {
      // TODO: If users first time, then show note explaining that config is only stored locally
      this.$modal.show(modalNames.CONF_EDITOR);
      this.$emit('modalChanged', true);
    },
    combineConfig() {
      const conf = {};
      conf[topLevelConfKeys.APP_CONFIG] = this.appConfig;
      conf[topLevelConfKeys.PAGE_INFO] = this.pageInfo;
      conf[topLevelConfKeys.SECTIONS] = this.sections;
      conf[topLevelConfKeys.APP_CONFIG].theme = localStorage[localStorageKeys.THEME]
        || conf[topLevelConfKeys.APP_CONFIG].theme;
      return conf;
    },
    tooltip(content) {
      return { content, trigger: 'hover focus', delay: 250 };
    },
  },
};
</script>

<style scoped lang="scss">
.config-options {
  display: flex;
  flex-direction: column;
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
</style>
