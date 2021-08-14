<template>
  <form>
    <input
      id="filter-tiles"
      v-model="input"
      ref="filter"
      class="minimal-search"
      :placeholder="$t('search.search-placeholder')"
      v-on:input="userIsTypingSomething"
      @keydown.esc="clearFilterInput" />
      <i v-if="input.length > 0"
        class="clear-search"
        :title="$t('search.clear-search-tooltip')"
        @click="clearFilterInput">x</i>
  </form>
</template>

<script>

import ArrowKeyNavigation from '@/utils/ArrowKeyNavigation';
import { getCustomKeyShortcuts } from '@/utils/ConfigHelpers';

export default {
  name: 'MinimalSearch',
  props: {
    active: Boolean,
  },
  data() {
    return {
      input: '', // Users current search term
      akn: new ArrowKeyNavigation(), // Class that manages arrow key naviagtion
      getCustomKeyShortcuts,
    };
  },
  mounted() {
    window.addEventListener('keydown', (event) => {
      const currentElem = document.activeElement.id;
      const { key, keyCode } = event;
      /* If a modal is open, then do nothing */
      if (!this.active) return;
      if (/^[a-zA-Z]$/.test(key) && currentElem !== 'filter-tiles') {
        /* Letter key pressed - start searching */
        if (this.$refs.filter) this.$refs.filter.focus();
        this.userIsTypingSomething();
      } else if (/^[0-9]$/.test(key)) {
        /* Number key pressed, check if user has a custom binding */
        this.handleHotKey(key);
      } else if (keyCode >= 37 && keyCode <= 40) {
      /* Arrow key pressed - start navigation */
        this.akn.arrowNavigation(keyCode);
      } else if (keyCode === 27) {
      /* Esc key pressed - reset form */
        this.clearFilterInput();
      }
    });
  },
  methods: {
    /* Emmits users's search term up to parent */
    userIsTypingSomething() {
      this.$emit('user-is-searchin', this.input);
    },
    /* Resets everything to initial state, when user is finished */
    clearFilterInput() {
      this.input = ''; // Clear input model
      this.userIsTypingSomething(); // Emmit new empty value
      document.activeElement.blur(); // Remove focus
      this.akn.resetIndex(); // Reset current element index
    },
    handleHotKey(key) {
      const usersHotKeys = this.getCustomKeyShortcuts();
      usersHotKeys.forEach((hotkey) => {
        if (hotkey.hotkey === parseInt(key, 10)) {
          if (hotkey.url) window.open(hotkey.url, '_blank');
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">

@import '@/styles/media-queries.scss';

  form {
    display: flex;
    align-items: center;
    input {
      display: inline-block;
      width: 80%;
      max-width: 400px;
      font-size: 1.2rem;
      padding: 0.5rem 1rem;
      margin: 1rem auto;
      outline: none;
      border: 1px solid var(--outline-color);
      border-radius: var(--curve-factor);
      background: var(--minimal-view-search-background);
      color: var(--minimal-view-search-color);
      &:focus {
        border-color: var(--minimal-view-search-color);
        opacity: var(--dimming-factor);
      }
    }
    .clear-search {
      //position: absolute;
      color: var(--minimal-view-search-color);
      padding: 0.15rem 0.5rem 0.2rem 0.5rem;
      font-style: normal;
      font-size: 1rem;
      opacity: var(--dimming-factor);
      border-radius: 50px;
      cursor: pointer;
      right: 0.5rem;
      top: 1rem;
      border: 1px solid var(--minimal-view-search-color);
      font-size: 1rem;
      margin: 0.5rem;
      &:hover {
        opacity: 1;
        color: var(--minimal-view-search-background);
        background: var(--minimal-view-search-color);
      }
    }
  }

</style>
