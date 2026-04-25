<template>
  <section>
    <SearchBar
      v-if="searchVisible"
      ref="SearchBar"
      @user-is-searchin="userIsTypingSomething"
    />
    <div class="options-outer" v-click-outside="closePanel">
      <button
        type="button"
        class="options-trigger"
        :class="{ open: panelOpen }"
        @click.stop="togglePanel"
        v-tooltip="$t('settings.options-tooltip')"
        :aria-label="$t('settings.options-tooltip')"
        :aria-expanded="panelOpen"
        tabindex="-2"
      >
        <IconOptions />
      </button>
      <transition name="panel-fade">
        <OptionsPanel v-if="panelOpen" @close="closePanel" />
      </transition>
    </div>

    <modal
      :name="modalNames.CONF_EDITOR"
      :resizable="true"
      width="80%"
      height="85%"
      classes="dashy-modal"
      @closed="onConfigClosed"
    >
      <ConfigContainer :config="combinedConfig" />
    </modal>
    <modal
      :name="modalNames.LANG_SWITCHER"
      :resizable="true"
      width="35%"
      height="60%"
      classes="dashy-modal"
    >
      <LanguageSwitcher />
    </modal>

    <AppInfoModal />
  </section>
</template>

<script>
import SearchBar from '@/components/Settings/SearchBar';
import OptionsPanel from '@/components/Settings/OptionsPanel';
import AppInfoModal from '@/components/Configuration/AppInfoModal';
import ConfigContainer from '@/components/Configuration/ConfigContainer';
import LanguageSwitcher from '@/components/Settings/LanguageSwitcher';
import Keys from '@/utils/StoreMutations';
import { topLevelConfKeys, localStorageKeys, modalNames } from '@/utils/config/defaults';
import IconOptions from '@/assets/interface-icons/config-open-settings.svg';

export default {
  name: 'SettingsContainer',
  components: {
    SearchBar,
    OptionsPanel,
    AppInfoModal,
    ConfigContainer,
    LanguageSwitcher,
    IconOptions,
  },
  data: () => ({ panelOpen: false, modalNames }),
  computed: {
    searchVisible() {
      return this.$store.getters.visibleComponents.searchBar;
    },
    combinedConfig() {
      const app = this.$store.getters.appConfig;
      return {
        [topLevelConfKeys.APP_CONFIG]: {
          ...app,
          theme: localStorage[localStorageKeys.THEME] || app.theme,
        },
        [topLevelConfKeys.PAGE_INFO]: this.$store.getters.pageInfo,
        [topLevelConfKeys.SECTIONS]: this.$store.getters.sections,
      };
    },
  },
  methods: {
    userIsTypingSomething(q) { this.$emit('user-is-searchin', q); },
    clearFilterInput() {
      if (this.$refs.SearchBar) this.$refs.SearchBar.clearFilterInput();
    },
    togglePanel() { this.panelOpen = !this.panelOpen; },
    closePanel() { this.panelOpen = false; },
    onConfigClosed() { this.$store.commit(Keys.SET_MODAL_OPEN, false); },
  },
};
</script>

<style scoped lang="scss">
section {
  position: relative;
  display: flex;
  align-items: stretch;
  background: linear-gradient(0deg, var(--background) 0%, var(--background-darker) 100%);
  box-shadow: var(--settings-container-shadow);
}

.options-outer {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
  padding: 0.25rem 0.5rem;
  background: var(--settings-background);
  border-radius: var(--curve-factor-navbar) 0 0;
}

.options-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  padding: 0.3rem;
  background: var(--background-darker);
  border: 1px solid transparent;
  border-radius: var(--curve-factor);
  color: var(--settings-text-color);
  cursor: pointer;
  opacity: var(--dimming-factor);

  svg {
    width: 100%;
    height: 100%;
    fill: currentColor;
  }

  &:hover, &.open, &:focus-visible {
    opacity: 1;
    background: var(--primary);
    color: var(--background);
    outline: none;
  }
}

.panel-fade-enter-active,
.panel-fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.panel-fade-enter-from,
.panel-fade-leave-to {
  opacity: 0;
  transform: translateY(-0.25rem);
}

@media (prefers-reduced-motion: reduce) {
  .panel-fade-enter-active,
  .panel-fade-leave-active { transition: none; }
}
</style>
