<template>
  <transition name="slide-fade">
    <div class="kb-sc-info" v-if="!shouldHide">
      <h5>There are keyboard shortcuts! ⌨️🙌</h5>
      <div class="close" title="Hide forever [Esc]" @click="hideWelcomeHelper()">x</div>
      <p title="Press [Esc] to hide this tip forever. See there's even a shortcut for that! 🚀">
        Just start typing to filter. Then use the tab key to cycle through results,
        and press enter to launch the selected item. You can hit Esc at anytime to
        clear the search. Easy 🥳
      </p>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'KeyboardShortcutInfo',
  data() {
    return {
      shouldHide: true, // False = show/ true = hide. Intuitive, eh?
    };
  },
  methods: {
    /**
     * If the session storage item exists, true will be returned
     * Otherwise, if not then false is returned.
     * Note the !! just converts 'false' to false, as strings resolve to true
     */
    shouldHideWelcomeMessage() {
      return !!localStorage.hideWelcomeHelpers;
    },
    /**
     * Sets the session storage to 'true', so that it won't be shown again
     * Then sets the state, also to true, so that it'll be hidden immediatley
     */
    hideWelcomeHelper() {
      localStorage.setItem('hideWelcomeHelpers', true);
      this.shouldHide = true;
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
      window.setTimeout(() => { this.shouldHide = shouldHide; }, 3000);
      window.addEventListener('keyup', (ev) => {
        // User pressed the escape key. Trigger permanent dismissal of dialog
        if (ev.keyCode === 27) this.hideWelcomeHelper();
      });
    } else { // Meh, component not needed.
      // No point wasting valuable bytes of your 32GB Ram, lets kill it
      this.$destroy();
    }
  },
};
</script>

<style scoped lang="scss">

@import '../../src/styles/color-pallet.scss';

.kb-sc-info {
  position: fixed;
  width: 30em;
  bottom: 0;
  right: 10px;
  margin: 0.5em;
  padding: 0.1em 0.3em;
  z-index: 10;
  border-radius: 12px;
  border: 1px solid $header-color;
  -webkit-box-shadow: 2px 1px 5px #130f23;
  box-shadow: 2px 1px 5px #130f23;
  border: 1px solid $ascent;
  color: $ascent;
  background: $header-color;
  cursor: default;
  opacity: 0.94;
  @media screen and (max-width: 600px) {
    display: none;
  }
  h5 { /* The dialog title */
    position: absolute;
    top: -35px;
    left: 20px;
    border: 1px solid $ascent;
    color: $ascent;
    background: $header-color;
    padding: 4px;
    border-radius: 5px;
  }
  .close { /* The little exit icon, in top-right */
    float: right;
    border-radius: 20px;
    width: 1em;
    padding: 0 0 6px 6px;
    height: 1em;
    background: $transparent-black;
    margin-top: 3px;
    border: 1px solid transparent;
    cursor: pointer;
    &:hover {
      border: 1px solid $ascent;
      opacity: 0.6;
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
