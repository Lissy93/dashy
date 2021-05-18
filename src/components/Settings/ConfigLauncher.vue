<template>
  <div class="config-options">
    <!-- Button and label -->
    <span>Config</span>
    <div class="config-buttons">
      <IconSpanner v-tooltip="tooltip('Update configuration locally')" @click="showEditor()" />
    </div>

    <!-- Modal containing all the configuration options -->
    <modal :name="modalName" :resizable="true" width="60%" height="80%"
      @closed="$emit('modalChanged', false)">
      <ConfigContainer :config="combineConfig()" />
    </modal>
  </div>
</template>

<script>

import IconSpanner from '@/assets/interface-icons/config-editor.svg';
import ConfigContainer from '@/components/Configuration/ConfigContainer';
import { topLevelConfKeys, localStorageKeys } from '@/utils/defaults';

export default {
  name: 'ConfigLauncher',
  data() {
    return {
      modalName: 'CONF-EDITOR',
    };
  },
  components: {
    IconSpanner,
    ConfigContainer,
  },
  props: {
    sections: Array,
    pageInfo: Object,
    appConfig: Object,
  },
  methods: {
    showEditor: function show() {
      this.$modal.show(this.modalName);
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

<style lang="scss">
  .vm--modal {
    box-shadow: 0 40px 70px -2px hsl(0deg 0% 0% / 60%), 1px 1px 6px var(--primary);
  }
  .vm--overlay {
    background: #00000080;
  }
</style>
