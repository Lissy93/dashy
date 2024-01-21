<template>
  <transition name="slide-fade">
    <div class="kb-sc-info" v-if="!shouldHide">
      <h5>There are keyboard shortcuts! ⌨️🙌</h5>
      <div class="close" title="Hide forever [Esc]" @click="hideWelcomeHelper()">x</div>
      <p title="Press [Esc] to hide this tip forever. See there's even a shortcut for that! 🚀">
        Just start typing to filter. Then use the tab key to cycle through results,
        and press enter to launch the selected item, or alt + enter to open in a modal.
        You can hit Esc at anytime to clear the search. Easy 🥳
      </p>
    </div>
  </transition>
</template>

<script>

import { localStorageKeys } from '@/utils/defaults';

export default {
  name: 'KeyboardShortcutInfo',
  data() {
    return {
      shouldHide: true, // False = show/ true = hide. Intuitive, eh?
      timeDelay: 3000, // Short delay in ms before popup appears
    };
  },
  methods: {
    /**
     * Returns true if the key exists in session storage, otherwise false
     * And the !! just converts 'false' to false, as strings resolve to true
     */
    shouldHideWelcomeMessage() {
      return !!localStorage[localStorageKeys.HIDE_WELCOME_BANNER];
    },
    /**
     * Update session storage, so that it won't be shown again
     * Trigger the hide function, and remove the event listerner
     */
    hideWelcomeHelper() {
      this.shouldHide = true;
      localStorage.setItem(localStorageKeys.HIDE_WELCOME_BANNER, true);
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
