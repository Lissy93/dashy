<template>
  <transition name="slide-fade">
    <div class="kb-sc-info" v-if="!shouldHide">
      <h5>{{ popupContent.title }}</h5>
      <div class="close" title="Hide forever [Esc]" @click="hideWelcomeHelper()">x</div>
      <p :title="popupContent.hoverText">{{ popupContent.message }}</p>
      <p :title="popupContent.hoverText">{{ popupContent.messageContinued }}</p>
      <div class="action-buttons">
        <button @click="exportConfig">Export Local Config</button>
        <button @click="saveConfig">Save Changes to Disk</button>
        <button @click="resetLocalConfig">Reset Local Changes</button>
        <button @click="hideWelcomeHelper">Dismiss this Notification</button>
      </div>
    </div>
  </transition>
</template>

<script>

import { localStorageKeys, modalNames } from '@/utils/defaults';
import StoreKeys from '@/utils/StoreMutations';
import configSavingMixin from '@/mixins/ConfigSaving';

export default {
  name: 'KeyboardShortcutInfo',
  mixins: [configSavingMixin],
  data() {
    return {
      shouldHide: true, // False = show/ true = hide. Intuitive, eh?
      timeDelay: 2000, // Short delay in ms before popup appears
      popupContent: {
        title: '⚠️ You\'re using a local config',
        message: `This means that your settings are saved in this browser only,
        and won't persist across devices.`,
        messageContinued: `To ensure you don't loose your changes,
        it's recommended to download a copy of your config, so you can restore it later.`,
        hoverText: 'Press [Esc] to hide this warning',
      },
    };
  },
  methods: {
    exportConfig() {
      this.$modal.show(modalNames.EXPORT_CONFIG_MENU);
      this.shouldHide = true;
    },
    saveConfig() {
      const localConfig = this.$store.state.config;
      this.writeConfigToDisk(localConfig);
      this.shouldHide = true;
    },
    resetLocalConfig() {
      const msg = `${this.$t('config.reset-config-msg-l1')} `
      + `${this.$t('config.reset-config-msg-l2')}\n\n${this.$t('config.reset-config-msg-l3')}`;
      const isTheUserSure = confirm(msg); // eslint-disable-line no-alert, no-restricted-globals
      if (isTheUserSure) {
        localStorage.clear();
        this.$toasted.show(this.$t('config.data-cleared-msg'));
        this.$store.dispatch(StoreKeys.INITIALIZE_CONFIG);
        this.shouldHide = true;
      }
    },
    /**
     * Returns true if the key exists in session storage, otherwise false
     * And the !! just converts 'false' to false, as strings resolve to true
     */
    shouldHideWelcomeMessage() {
      return !!localStorage[localStorageKeys.HIDE_INFO_NOTIFICATION];
    },
    /**
     * Update session storage, so that it won't be shown again
     * Trigger the hide function, and remove the event listerner
     */
    hideWelcomeHelper() {
      this.shouldHide = true;
      localStorage.setItem(localStorageKeys.HIDE_INFO_NOTIFICATION, true);
      window.removeEventListener('keyup', this.keyPressEvent);
    },
    /* Passed to window function, to add/ remove event listener */
    keyPressEvent(event) {
      if (event.keyCode === 27) this.hideWelcomeHelper();
    },
  },
  /**
   * Once mounted, if it's the users first time here, then we wait 3 seconds,
   * and show the helpfull little keyboard shortcut dialog.
   * Then we listen for the Esc key to be pressed, and hide the dialog.
   */
  mounted() {
    const shouldHide = this.shouldHideWelcomeMessage();
    if (!shouldHide) {
      window.setTimeout(() => { this.shouldHide = shouldHide; }, this.timeDelay);
      window.addEventListener('keyup', this.keyPressEvent);
    } else { // Meh, component not needed.
      // No point wasting valuable bytes of your 32GB Ram, lets kill it
      this.$destroy();
    }
  },
};
</script>

<style scoped lang="scss">

@import '@/styles/media-queries.scss';

.kb-sc-info {
  position: fixed;
  width: 30em;
  bottom: 0;
  right: 10px;
  margin: 0.5em;
  padding: 0.1em 0.3em;
  z-index: 6;
  border-radius: 12px;
  border: 1px solid var(--welcome-popup-background);
  -webkit-box-shadow: 2px 1px 5px #130f23;
  box-shadow: 2px 1px 5px #130f23;
  border: 1px solid var(--welcome-popup-text-color);
  color: var(--welcome-popup-text-color);
  background: var(--welcome-popup-background);
  cursor: default;
  opacity: 0.94;
  @include phone {
    display: none;
  }
  h5 { /* The dialog title */
    position: absolute;
    top: -35px;
    left: 20px;
    border: 1px solid var(--welcome-popup-text-color);
    color: var(--welcome-popup-text-color);
    background: var(--welcome-popup-background);
    padding: 4px;
    border-radius: var(--curve-factor);
  }
  .close { /* The little exit icon, in top-right */
    float: right;
    border-radius: 20px;
    width: 1em;
    padding: 0 0 6px 6px;
    height: 1em;
    background: var(--transparent-50);
    margin-top: 3px;
    border: 1px solid transparent;
    cursor: pointer;
    &:hover {
      border: 1px solid var(--welcome-popup-text-color);
      opacity: var(--dimming-factor);
    }
  }
}
.action-buttons {
  display: flex;
  justify-content: space-around;
  margin-top: 1em;
  button {
    padding: 0.2rem;
    background: var(--welcome-popup-background);
    color: var(--welcome-popup-text-color);
    border: 1px solid var(--welcome-popup-text-color);
    border-radius: var(--curve-factor);
    transition: all 0.2s ease-in-out;
    &:hover {
      background: var(--welcome-popup-text-color);
      color: var(--welcome-popup-background);
    }
  }
}
/* Animations, animations everywhere */
.slide-fade-enter-active {
  transition: all 1s ease;
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(.93,.01,.89,.5);
}
.slide-fade-enter, .slide-fade-leave-to {
  transform: translateY(35em);
  opacity: 0;
}
</style>
