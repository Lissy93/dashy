<template>
  <form @submit.prevent="searchSubmitted" :class="minimalSearch ? 'minimal' : 'normal'">
    <label for="filter-tiles">{{ $t('search.search-label') }}</label>
    <div class="search-wrap">
      <input
        id="filter-tiles"
        v-model="input"
        ref="filter"
        :placeholder="$t('search.search-placeholder')"
        v-on:input="userIsTypingSomething"
        @keydown.esc="clearFilterInput" />
        <p v-if="(!searchPrefs.disableWebSearch) && input.length > 0" class="web-search-note">
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
import { getSearchEngineFromBang, findUrlForSearchEngine, stripBangs } from '@/utils/Search';
import {
  searchEngineUrls,
  defaultSearchEngine,
  defaultSearchOpeningMethod,
  searchBangs as defaultSearchBangs,
} from '@/utils/defaults';

export default {
  name: 'FilterTile',
  props: {
    minimalSearch: Boolean, // If true, then keep it simple
  },
  data() {
    return {
      input: '', // Users current search term
      akn: new ArrowKeyNavigation(), // Class that manages arrow key naviagtion
      getCustomKeyShortcuts,
    };
  },
  computed: {
    active() {
      return !this.$store.state.modalOpen;
    },
    searchPrefs() {
      return this.$store.getters.webSearch || {};
    },
  },
  mounted() {
    window.addEventListener('keydown', this.handleKeyPress);
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.handleKeyPress);
  },
  methods: {
    /* Call correct function dependending on which key is pressed */
    handleKeyPress(event) {
      const currentElem = document.activeElement.id;
      const { key, keyCode } = event;
      const notAlreadySearching = currentElem !== 'filter-tiles';
      // If a modal is open, then do nothing
      if (!this.active) return;
      if (/^[/:!a-zA-Z]$/.test(key) && notAlreadySearching) {
        // Letter or bang key pressed - start searching
        if (this.$refs.filter) this.$refs.filter.focus();
        this.userIsTypingSomething();
      } else if (/^[0-9]$/.test(key)) {
        // Number key pressed, check if user has a custom binding
        this.handleHotKey(key);
      } else if (keyCode >= 37 && keyCode <= 40) {
      // Arrow key pressed - start navigation
        this.akn.arrowNavigation(keyCode);
      } else if (keyCode === 27) {
      // Esc key pressed - reset form
        this.clearFilterInput();
      }
    },
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
    /* If configured, launch specific app when hotkey pressed */
    handleHotKey(key) {
      const usersHotKeys = this.getCustomKeyShortcuts();
      usersHotKeys.forEach((hotkey) => {
        if (hotkey.hotkey === parseInt(key, 10)) {
          if (hotkey.url) window.open(hotkey.url, '_blank');
        }
      });
    },
    /* Launch search results, with users desired opening method */
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

    /* Launch web search, to correct search engine, passing in users query */
    searchSubmitted() {
      // Get search preferences from appConfig
      const { searchPrefs } = this;
      if (!searchPrefs.disableWebSearch) { // Only proceed if user hasn't disabled web search
        const bangList = { ...defaultSearchBangs, ...(searchPrefs.searchBangs || {}) };
        const openingMethod = searchPrefs.openingMethod || defaultSearchOpeningMethod;
        const searchBang = getSearchEngineFromBang(this.input, bangList);
        const searchEngine = searchPrefs.searchEngine || defaultSearchEngine;
        // Use either search bang, or preffered search engine
        const desiredSearchEngine = searchBang || searchEngine;
        const isCustomSearch = (searchPrefs.searchEngine === 'custom' && searchPrefs.customSearchEngine);
        let searchUrl = isCustomSearch
          ? searchPrefs.customSearchEngine
          : findUrlForSearchEngine(desiredSearchEngine, searchEngineUrls);
        if (searchUrl) { // Append search query to URL, and launch
          searchUrl += encodeURIComponent(stripBangs(this.input, bangList));
          this.launchWebSearch(searchUrl, openingMethod);
          this.clearFilterInput();
        }
      }
    },
  },
};
</script>

<style scoped lang="scss">

@import '@/styles/media-queries.scss';

  form.normal {
    display: flex;
    align-items: center;
    border-radius: 0 0 var(--curve-factor-navbar) 0;
    padding: 0 0.2rem 0.2rem 0;
    background: var(--search-container-background);
    .search-wrap {
      display: flex;
      flex-direction: column;
      width: 100%;
      p.web-search-note {
        margin: 0 0.5rem;
        font-size: 0.8rem;
        color: var(--minimal-view-search-color);
        opacity: var(--dimming-factor);
      }
    }
    label {
        display: inline;
        color: var(--search-label-color);
        margin: 0.5rem;
        display: inline;
        word-break: keep-all;
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
      color: var(--settings-text-color);
      padding: 0 0.3rem 0.1rem 0.3rem;
      font-style: normal;
      font-size: 1rem;
      opacity: var(--dimming-factor);
      border-radius: 50px;
      cursor: pointer;
      right: 0.5rem;
      top: 1rem;
      border: 1px solid var(--settings-text-color);
      margin: 0.25rem;
      &:hover {
        opacity: 1;
        background: var(--background-darker);
      }
    }
  }

  @include tablet {
    form.normal {
      display: block;
      text-align: center;
    }
  }
  @include phone {
    form.nomral {
      flex: 1;
      border-radius: 0;
      text-align: center;
      padding: 0.25rem 0;
      display: block;
    }
  }

  form.minimal {
    display: flex;
    align-items: center;
    label { display: none; }
    .search-wrap {
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
      margin: 0.5rem;
      &:hover {
        opacity: 1;
        color: var(--minimal-view-search-background);
        background: var(--minimal-view-search-color);
      }
    }
  }
</style>
