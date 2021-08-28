<template>
  <form @submit.prevent="searchSubmitted">
    <label for="filter-tiles">{{ $t('search.search-label') }}</label>
    <input
      id="filter-tiles"
      v-model="input"
      ref="filter"
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
import router from '@/router';
import ArrowKeyNavigation from '@/utils/ArrowKeyNavigation';
import ErrorHandler from '@/utils/ErrorHandler';
import { getCustomKeyShortcuts } from '@/utils/ConfigHelpers';
import { searchEngineUrls, defaultSearchEngine, defaultSearchOpeningMethod } from '@/utils/defaults';

export default {
  name: 'FilterTile',
  inject: ['config'],
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
    launchWebSearch(url, method) {
      switch (method) {
        case 'newtab':
          window.open(url, '_blank');
          break;
        case 'sametab':
          window.open(url, '_self');
          break;
        case 'workspace':
          router.push({ name: 'workspace', query: { url } });
          break;
        default:
          ErrorHandler(`Unknown opening method: ${method}`);
          window.open(url, '_blank');
      }
    },
    searchSubmitted() {
      // Get search preferences from appConfig
      const { appConfig } = this.config;
      const searchPrefs = appConfig.webSearch || {};
      if (!searchPrefs.disableWebSearch) { // Only proceed if user hasn't disabled web search
        const openingMethod = searchPrefs.openingMethod || defaultSearchOpeningMethod;
        // Get search engine, and make URL
        const searchEngine = searchPrefs.searchEngine || defaultSearchEngine;
        let searchUrl = searchEngineUrls[searchEngine];
        if (!searchUrl) ErrorHandler(`Search engine not found - ${searchEngine}`);
        if (searchEngine === 'custom' && searchPrefs.customSearchEngine) {
          searchUrl = searchPrefs.customSearchEngine;
        }
        // Append users encoded query onto search URL, and launch
        searchUrl += encodeURIComponent(this.input);
        this.launchWebSearch(searchUrl, openingMethod);
      }
    },
  },
};
</script>

<style scoped lang="scss">

@import '@/styles/media-queries.scss';

  section {
    display: flex;
    align-items: center;
    align-items: stretch;
    background: linear-gradient(0deg, var(--background) 0%, var(--background-darker) 100%);
  }
  form {
    display: flex;
    align-items: center;
    border-radius: 0 0 var(--curve-factor-navbar) 0;
    padding: 0 0.2rem 0.2rem 0;
    background: var(--search-container-background);
    label {
        display: inline;
        color: var(--search-label-color);
        margin: 0.5rem;
        display: inline;
    }
    input {
      display: inline-block;
      width: 200px;
      height: 1rem;
      padding: 0.5rem;
      margin: 0.5rem;
      outline: none;
      border: none;
      border-radius: var(--curve-factor);
      background: var(--search-field-background);
      color: var(--settings-text-color);
      border: 1px solid var(--outline-color);
      &:focus {
        border-color: var(--settings-text-color);
        opacity: var(--dimming-factor);
      }
    }
    .clear-search {
      //position: absolute;
      color: var(--settings-text-color);
      padding: 0 0.4rem;
      font-style: normal;
      font-size: 1rem;
      opacity: var(--dimming-factor);
      border-radius: 50px;
      cursor: pointer;
      right: 0.5rem;
      top: 1rem;
      border: 1px solid var(--settings-text-color);
      font-size: 1rem;
      margin: 0.5rem;
      &:hover {
        opacity: 1;
        background: var(--background-darker);
      }
    }
  }

  @include tablet {
    form {
      display: block;
      text-align: center;
    }
  }
  @include phone {
    form {
      flex: 1;
      border-radius: 0;
      text-align: center;
      padding: 0.25rem 0;
      display: block;
    }
  }
</style>
