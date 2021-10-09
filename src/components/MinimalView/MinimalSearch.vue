<template>
  <form @submit.prevent="searchSubmitted">
    <div class="minimal-search-wrap">
      <input
        id="filter-tiles"
        v-model="input"
        ref="filter"
        class="minimal-search"
        :placeholder="$t('search.search-placeholder')"
        v-on:input="userIsTypingSomething"
        @keydown.esc="clearFilterInput"
      />
      <p v-if="webSearchEnabled && input.length > 0" class="web-search-note">
        {{ $t('search.enter-to-search-web') }}
      </p>
    </div>
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
import {
  searchEngineUrls,
  defaultSearchEngine,
  defaultSearchOpeningMethod,
} from '@/utils/defaults';

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
  computed: {
    appConfig() {
      return this.$store.getters.appConfig;
    },
    webSearchEnabled() {
      if (this.appConfig && this.appConfig.webSearch) {
        return !this.appConfig.webSearch.disableWebSearch;
      }
      return true;
    },
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
    /* Launches a given app when hotkey pressed */
    handleHotKey(key) {
      const usersHotKeys = this.getCustomKeyShortcuts();
      usersHotKeys.forEach((hotkey) => {
        if (hotkey.hotkey === parseInt(key, 10)) {
          if (hotkey.url) window.open(hotkey.url, '_blank');
        }
      });
    },
    /* Filter results as user types */
    startFiltering(event) {
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
    },
    /* Open web search results in users desired method */
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
    /* If web search enabled, then launch search results when enter is pressed */
    searchSubmitted() {
      // Get search preferences from appConfig
      const searchPrefs = this.appConfig.webSearch || {};
      if (this.webSearchEnabled) { // Only proceed if user hasn't disabled web search
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
  mounted() {
    window.addEventListener('keydown', this.startFiltering);
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.startFiltering);
  },
};
</script>

<style scoped lang="scss">

@import '@/styles/media-queries.scss';

  form {
    display: flex;
    align-items: center;
    .minimal-search-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      p.web-search-note {
        margin: 0;
        color: var(--minimal-view-search-color);
        opacity: var(--dimming-factor);
      }
    }
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
