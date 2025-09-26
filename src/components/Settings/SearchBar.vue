<template>
  <div class = "search-settings-row">
    <form
      @submit.prevent="searchSubmitted"
      :class="minimalSearch ? 'minimal' : 'normal'"
    >
      <label for="filter-tiles">
        {{ $t('search.search-label') }}
      </label>
      <div class="search-wrap">
        <input
          id="filter-tiles"
          v-model="input"
          ref="filter"
          :placeholder="$t('search.search-placeholder')"
          v-on:input="userIsTypingSomething"
          @keydown.esc="clearFilterInput"
        />
        <p v-if="showOpenItemNote" class="web-search-note">
          Press Enter to open the item
        </p>
        <p v-else-if="showWebSearchNote" class="web-search-note">
          {{ $t('search.enter-to-search-web') }}
        </p>
      </div>
      <i
        v-if="input.length > 0"
        class="clear-search"
        :title="$t('search.clear-search-tooltip')"
        @click="clearFilterInput"
      >x</i>
    </form>
    <div class="settings-block">
      <button
        @click="showSearchPanel = !showSearchPanel"
        class="settings-toggle"
        type="button"
        v-tooltip="showSearchPanel ? $t('Hide Search Options') : $t('Show Search Options')"
      >
        <IconConfigEditor />
      </button>
      <div v-show="showSearchPanel" class="floating-search-panel">
        <label class="theme-label">
          <input
            type="checkbox"
            :checked="searchPrefs.disableWebSearch"
            @change="toggleDisableWebSearch"
          />
          Disable Web Search
        </label>
        <label class="theme-label">
          <input
            type="checkbox"
            :checked="goToLinkEnabled"
            @change="goToLinkEnabled = $event.target.checked"
          />
          Go to Link (auto-detect links)
        </label>
        <label class="theme-label">
          <input
            type="checkbox"
            :checked="advancedSearch.enabled"
            @change="toggleAdvancedEnabled"
          />
          Advanced Search
        </label>
        <div v-if="advancedSearch.enabled" class="advanced-fields">
          <p class="adv-hint">Match only in selected fields:</p>
          <div class="field-grid">
            <label v-for="f in fieldList" :key="f.key" class="field-check">
              <input
                type="checkbox"
                :checked="advancedSearch.fields[f.key]"
                @change="toggleField(f.key, $event)"
              />
              {{ f.label }}
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import router from '@/router';
import ArrowKeyNavigation from '@/utils/ArrowKeyNavigation';
import ErrorHandler from '@/utils/ErrorHandler';
import IconConfigEditor from '@/assets/interface-icons/config-editor.svg';
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
  components: {
    IconConfigEditor,
  },
  data() {
    return {
      input: '',
      akn: new ArrowKeyNavigation(),
      getCustomKeyShortcuts,
      showSearchPanel: false,
    // goToLinkEnabled is now managed by Vuex/appConfig
    };
  },
  computed: {
    active() {
      return !this.$store.state.modalOpen;
    },
    searchPrefs() {
      return this.$store.getters.webSearch || {};
    },
    showOpenItemNote() {
      // Show when Enter will open an exact match item (advanced on + matches)
      const input = (this.input || '').trim();
      if (input.length === 0) return false;
      // If Go-to-Link would intercept, don't show
      if (this.goToLinkEnabled && this.isUrlLike(input)) return false;
      const adv = this.$store.getters.advancedSearch || {};
      if (!adv.enabled) return false;
      const exactItems = this.getExactMatchItemsList();
      return !!(exactItems && exactItems.length > 0);
    },
    showWebSearchNote() {
      // Only show hint when pressing Enter will actually search the web
      const input = (this.input || '').trim();
      if (input.length === 0) return false;
      // If Go-to-Link would intercept, then Enter does not search web
      if (this.goToLinkEnabled && this.isUrlLike(input)) return false;
      // If web search is disabled, don't show
      if (this.searchPrefs && this.searchPrefs.disableWebSearch) return false;
      // If advanced search is enabled and there are exact matches,
      //   Enter opens tile instead of web search
      const adv = this.$store.getters.advancedSearch || {};
      if (adv.enabled) {
        const exactItems = this.getExactMatchItemsList();
        if (exactItems && exactItems.length > 0) return false;
      }
      return true;
    },
    goToLinkEnabled: {
      get() {
        return this.$store.getters.goToLinkEnabled;
      },
      set(value) {
        this.$store.commit('setGoToLinkEnabled', value);
        // Also update appConfig in store for persistence
        const newAppConfig = {
          ...this.$store.getters.appConfig,
          goToLinkEnabled: value,
        };
        this.$store.commit('SET_APP_CONFIG', newAppConfig);
      },
    },
    advancedSearch() {
      const adv = this.$store.getters.advancedSearch || {};
      return { enabled: !!adv.enabled, fields: adv.fields || {} };
    },
    fieldList() {
      return [
        { key: 'title', label: 'Title' },
        { key: 'description', label: 'Description' },
        { key: 'provider', label: 'Provider' },
        { key: 'url', label: 'URL' },
        { key: 'tags', label: 'Tags' },
        { key: 'domain', label: 'Domain' },
      ];
    },
  },
  mounted() {
    window.addEventListener('keydown', this.handleKeyPress);
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.handleKeyPress);
  },
  methods: {
    // Selection utilities for Advanced Search tile navigation (Exact Match only)
    getExactMatchItemsList() {
      const container = document.querySelector('.exact-match-block');
      if (!container) return [];
      return Array.from(container.querySelectorAll('.item'));
    },
    setSelectionClass(el) {
      const items = this.getExactMatchItemsList();
      items.forEach(i => i.classList.remove('tile--selected'));
      if (el) el.classList.add('tile--selected');
    },
    clearSelectionHighlight() {
      const items = this.getExactMatchItemsList();
      items.forEach(i => i.classList.remove('tile--selected'));
    },
    updateDefaultSelection() {
      const adv = this.$store.getters.advancedSearch || {};
      if (!adv.enabled) return;
      if (!this.input || this.input.trim().length === 0) { this.clearSelectionHighlight(); return; }
      const items = this.getExactMatchItemsList();
      if (!items || items.length === 0) { this.clearSelectionHighlight(); return; }
      const focused = items.find(i => i === document.activeElement);
      if (focused) { this.setSelectionClass(focused); return; }
      const first = items[0];
      if (first) this.setSelectionClass(first);
    },
    toggleDisableWebSearch(event) {
      const value = event.target.checked;
      const newAppConfig = {
        ...this.$store.getters.appConfig,
        webSearch: {
          ...this.$store.getters.appConfig.webSearch,
          disableWebSearch: value,
        },
      };
      this.$store.commit('setDisableWebSearch', value);
      this.$store.commit('SET_APP_CONFIG', newAppConfig);
    },
    toggleAdvancedEnabled(event) {
      const enabled = event.target.checked;
      this.$store.commit('setAdvancedSearch', { enabled });
      // If enabling and no fields chosen yet, default to title + url
      if (enabled) {
        const currentFields = (this.advancedSearch.fields || {});
        const anyChosen = Object.values(currentFields).some(Boolean);
        if (!anyChosen) {
          const defaults = { title: true, url: true };
          this.$store.commit('setAdvancedSearch', { fields: defaults });
        }
      }
      const newAppConfig = {
        ...this.$store.getters.appConfig,
        advancedSearch: {
          ...this.advancedSearch,
          enabled,
          fields: (this.$store.getters.advancedSearch.fields || {}),
        },
      };
      this.$store.commit('SET_APP_CONFIG', newAppConfig);
    },
    toggleField(fieldKey, event) {
      const { checked } = event.target;
      const current = this.advancedSearch.fields || {};
      const fields = { ...current, [fieldKey]: checked };
      this.$store.commit('setAdvancedSearch', { fields });
      const newAppConfig = {
        ...this.$store.getters.appConfig,
        advancedSearch: { ...this.advancedSearch, fields },
      };
      this.$store.commit('SET_APP_CONFIG', newAppConfig);
      this.userIsTypingSomething();
    },
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
        // Arrow key pressed
        const adv = this.$store.getters.advancedSearch || {};
        if (adv.enabled) {
          const itemsArr = this.getExactMatchItemsList();
          if (!itemsArr || itemsArr.length === 0) {
            // No exact matches -> fall back to default navigation
            this.akn.arrowNavigation(keyCode);
            return;
          }
          const focusedEl = itemsArr.find(i => i === document.activeElement);
          let idx = focusedEl ? itemsArr.indexOf(focusedEl) : -1;
          const move = (delta) => {
            if (idx === -1) idx = 0; // no focus yet -> first
            else idx = (idx + delta + itemsArr.length) % itemsArr.length; // wrap
            const el = itemsArr[idx];
            if (el) {
              el.focus();
              el.scrollIntoView({ block: 'nearest', inline: 'nearest' });
              this.setSelectionClass(el);
            }
          };
          if (keyCode === 37) { // Left
            event.preventDefault();
            move(-1);
          } else if (keyCode === 39) { // Right
            event.preventDefault();
            move(1);
          } else if (keyCode === 38 || keyCode === 40) {
            // For now, ignore up/down in advanced mode to keep UX simple
            event.preventDefault();
          }
        } else {
          // Default navigation behavior
          this.akn.arrowNavigation(keyCode);
        }
      } else if (keyCode === 27) {
      // Esc key pressed - reset form
        this.clearFilterInput();
      }
    },
    /* Emmits users's search term up to parent */
    userIsTypingSomething() {
      this.$emit('user-is-searchin', this.input);
      this.$nextTick(() => this.updateDefaultSelection());
    },
    /* Resets everything to initial state, when user is finished */
    clearFilterInput() {
      this.input = ''; // Clear input model
      this.userIsTypingSomething(); // Emmit new empty value
      document.activeElement.blur(); // Remove focus
      this.akn.resetIndex(); // Reset current element index
      this.clearSelectionHighlight();
    },
    /* If configured, launch specific app when hotkey pressed */
    handleHotKey(key) {
      const sections = this.$store.getters.sections || [];
      const usersHotKeys = this.getCustomKeyShortcuts(sections);
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
      const { searchPrefs, goToLinkEnabled } = this;
      const input = this.input.trim();
      // 1. If "Go to Link" is enabled and input is URL-like, always open as link
      if (goToLinkEnabled && this.isUrlLike(input)) {
        window.open(this.normalizeUrl(input), '_blank');
        this.clearFilterInput();
        return;
      }
      // 1.5 Advanced Search override: if enabled and user has typed something,
      // and there are matched tiles on the page, pressing Enter should open the
      // selected tile (focused) or the first matched tile instead of web search
      const adv = this.$store.getters.advancedSearch || {};
      if ((adv.enabled === true) && input.length > 0) {
        const items = this.getExactMatchItemsList();
        if (!items || items.length === 0) {
          // No exact matches -> allow normal web search flow below
        } else {
          const focused = items.find(i => i === document.activeElement);
          const first = items[0];
          const targetEl = focused || first;
          if (targetEl) {
            targetEl.click();
            this.clearFilterInput();
            this.clearSelectionHighlight();
            return;
          }
        }
      }
      // 2. If not URL-like, or "Go to Link" is disabled, only search if web search is enabled
      if (!searchPrefs.disableWebSearch) {
        const bangList = { ...defaultSearchBangs, ...(searchPrefs.searchBangs || {}) };
        const openingMethod = searchPrefs.openingMethod || defaultSearchOpeningMethod;
        const searchBang = getSearchEngineFromBang(input, bangList);
        const searchEngine = searchPrefs.searchEngine || defaultSearchEngine;
        const desiredSearchEngine = searchBang || searchEngine;
        const isCustomSearch = (searchPrefs.searchEngine === 'custom' && searchPrefs.customSearchEngine);
        let searchUrl = isCustomSearch
          ? searchPrefs.customSearchEngine
          : findUrlForSearchEngine(desiredSearchEngine, searchEngineUrls);
        if (searchUrl) {
          searchUrl += encodeURIComponent(stripBangs(input, bangList));
          this.launchWebSearch(searchUrl, openingMethod);
          this.clearFilterInput();
        }
      }
    },
    // Utility: Detect if input is a URL or domain-like string
    isUrlLike(input) {
      // Matches URLs with protocol, www, or domain.tld (e.g., youtube.com)
      const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[a-zA-Z]{2,}(\/.*)?$/;
      return urlPattern.test(input.trim());
    },
    // Utility: Normalize input to a full URL (adds https:// if missing)
    normalizeUrl(input) {
      let url = input.trim();
      if (!/^https?:\/\//.test(url)) {
        url = `https://${url}`;
      }
      return url;
    },
  },
};
</script>

<style scoped lang="scss">

@import '@/styles/media-queries.scss';

  .search-settings-row {
    display: flex;
    // flex-direction: column;
    align-items: center;
    // width: 100%;
  }
  form.normal {
    display: flex;
    align-items: center;
    // border-radius: 0 0 var(--curve-factor-navbar) 0;
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

  .settings-block {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0.5rem 0;
    width: 100%;
    position: relative;

    border-radius: 0 0 var(--curve-factor-navbar) 0;
    padding: 0 0.2rem 0.2rem 0;
    background: var(--search-container-background);
    .settings-toggle {
      background: var(--settings-background);
      color: var(--settings-text-color);
      border: none;
      padding: 0.5rem;
      margin: 0.5rem 0.5rem 0.5rem 0;
      border-radius: var(--curve-factor);
      cursor: pointer;
      &:hover {
        background: var(--settings-text-color);
        color: var(--settings-background);
      }
    }

    .settings-toggle svg {
      width: 1rem;
      height: 1rem;
      fill: currentColor;
      display: block;
    }

    .floating-search-panel {
      position: absolute;
      top: 100%;
      left: 0;
      min-width: 180px;
      max-width: max-content;
      background: var(--settings-background);
      border: 1px solid var(--settings-text-color);
      border-radius: var(--curve-factor);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      z-index: 10;
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
  .theme-label {
    color: var(--settings-text-color);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
  }
  .advanced-fields {
    padding: 0.4rem 0.6rem 0.6rem 0.6rem;
    border-top: 1px solid var(--settings-text-color);
    .adv-hint {
      margin: 0.2rem 0 0.4rem 0;
      font-size: 0.7rem;
      opacity: 0.7;
      color: var(--settings-text-color);
    }
    .field-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
      gap: 0.25rem 0.5rem;
    }
    .field-check {
      display: flex;
      align-items: center;
      gap: 0.3rem;
      font-size: 0.7rem;
      color: var(--settings-text-color);
      input { margin: 0; }
    }
  }
</style>
