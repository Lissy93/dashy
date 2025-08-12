/**
 * Mixin for all homepages (default home, minimal home, workspace, etc)
 */

import Defaults, { localStorageKeys, iconCdns } from '@/utils/defaults';
import Keys from '@/utils/StoreMutations';
import { searchTiles } from '@/utils/Search';
import { checkItemVisibility } from '@/utils/CheckItemVisibility';

const HomeMixin = {
  props: {
    subPageInfo: Object,
  },
  computed: {
    sections() {
      return this.$store.getters.sections;
    },
    appConfig() {
      return this.$store.getters.appConfig;
    },
    pageInfo() {
      return this.$store.getters.pageInfo;
    },
    isEditMode() {
      return this.$store.state.editMode;
    },
    modalOpen() {
      return this.$store.state.modalOpen;
    },
    pageId() {
      return this.$store.state.currentConfigInfo?.confId || 'home';
    },
  },
  data: () => ({
    searchValue: '',
  }),
  watch: {
    async $route() {
      this.loadUpConfig();
    },
    pageInfo: {
      handler(newPageInfo) {
        if (newPageInfo && newPageInfo.title) {
          document.title = newPageInfo.title;
        }
      },
      immediate: true,
    },
  },
  async created() {
    this.loadUpConfig();
  },
  methods: {
    /* When page loaded / sub-page changed, initiate config fetch */
    async loadUpConfig() {
      const subPage = this.determineConfigFile();
      await this.$store.dispatch(Keys.INITIALIZE_CONFIG, subPage);
    },
    /* Based on the current route, get which config to display, null will use default */
    determineConfigFile() {
      const pagePath = this.$router.currentRoute.path;
      const isSubPage = new RegExp((/(home|workspace|minimal)\/[a-zA-Z0-9-]+/g)).test(pagePath);
      const subPageName = isSubPage ? pagePath.split('/').pop() : null;
      return subPageName;
    },
    /* TEMPORARY: If on sub-page, check if custom theme is set and return it */
    getSubPageTheme() {
      if (!this.pageId || this.pageId === 'home') {
        return null;
      } else {
        const themeStoreKey = `${localStorageKeys.THEME}-${this.pageId}`;
        return localStorage[themeStoreKey] || null;
      }
    },
    setTheme() {
      // const theme = this.getSubPageTheme() || GetTheme();
      // ApplyLocalTheme(theme);
      // ApplyCustomVariables(theme);
    },
    updateModalVisibility(modalState) {
      this.$store.commit('SET_MODAL_OPEN', modalState);
    },
    /* Updates local data with search value, triggered from filter comp */
    searching(searchValue) {
      this.searchValue = searchValue || '';
    },
    /* Returns a unique ID based on the page and section name */
    makeSectionId(section) {
      const normalize = (str) => (
        str ? str.trim().toLowerCase().replace(/[^a-zA-Z0-9]/g, '-')
          : `unnamed-${(`000${Math.floor(Math.random() * 1000)}`).slice(-3)}`
      );
      return `${this.pageId || 'unknown-page'}-${normalize(section.name)}`;
    },
    /* Returns true if there is one or more sections in the config */
    checkTheresData(sections) {
      const localSections = localStorage[localStorageKeys.CONF_SECTIONS];
      return (sections && sections.length >= 1) || (localSections && localSections.length >= 1);
    },
    /* Returns only the tiles that match the users search query */
    filterTiles(allTiles) {
      if (!allTiles) {
        return [];
      }
      const visibleTiles = allTiles.filter((tile) => checkItemVisibility(tile));
      return searchTiles(visibleTiles, this.searchValue, this.areWidgets(allTiles));
    },
    /* Checks if titles are widgets */
    areWidgets(allTiles) {
      return Array.isArray(allTiles) && allTiles.length > 0 && !('title' in allTiles[0]);
    },
    /* Checks if any sections or items use icons from a given CDN */
    checkIfIconLibraryNeeded(prefix) {
      if (!this.sections) return false;
      let isNeeded = false; // Will be set to true if prefix found in icon name
      this.sections.forEach((section) => {
        if (section && section.icon && section.icon.includes(prefix)) isNeeded = true;
        if (section && section.items) {
          section.items.forEach((item) => {
            if (item.icon && item.icon.includes(prefix)) isNeeded = true;
          });
        }
      });
      return isNeeded;
    },
    /* Checks if any of the icons are Font Awesome glyphs */
    checkIfFontAwesomeNeeded() {
      if (this.appConfig.enableFontAwesome === false) return false;
      if (this.appConfig.enableFontAwesome) return true;
      let isNeeded = this.checkIfIconLibraryNeeded('fa-');
      const currentTheme = localStorage[localStorageKeys.THEME]; // Some themes require FA
      if (['material', 'material-dark'].includes(currentTheme)) isNeeded = true;
      return isNeeded;
    },
    /* Injects font-awesome's script tag, only if needed */
    initiateFontAwesome() {
      if (this.checkIfFontAwesomeNeeded()) {
        const fontAwesomeScript = document.createElement('script');
        const faKey = this.appConfig.fontAwesomeKey || Defaults.fontAwesomeKey;
        fontAwesomeScript.setAttribute('src', `${iconCdns.fa}/${faKey}.js`);
        document.head.appendChild(fontAwesomeScript);
      }
    },
    /* Checks if any of the icons are Material Design Icons */
    checkIfMdiNeeded() {
      const userOverride = this.appConfig.enableMaterialDesignIcons;
      if (userOverride === false) return false;
      return userOverride || this.checkIfIconLibraryNeeded('mdi-');
    },
    /* Injects Material Design Icons, only if needed */
    initiateMaterialDesignIcons() {
      if (this.checkIfMdiNeeded()) {
        const mdiStylesheet = document.createElement('link');
        mdiStylesheet.setAttribute('rel', 'stylesheet');
        mdiStylesheet.setAttribute('href', iconCdns.mdi);
        document.head.appendChild(mdiStylesheet);
      }
    },
    /* Returns true if there is more than 1 sub-result visible during searching */
    checkIfResults(sections) {
      if (!sections) return false;
      else {
        let itemsFound = true;
        sections.forEach((section) => {
          if (section.widgets && section.widgets.length > 0) itemsFound = false;
          if (section.filteredItems.length > 0) itemsFound = false;
        });
        return itemsFound;
      }
    },
    /* If user has a background image, then generate CSS attributes */
    getBackgroundImage() {
      if (this.appConfig && this.appConfig.backgroundImg) {
        return `background: url('${this.appConfig.backgroundImg}') no-repeat center fixed;background-size:cover;`;
      }
      return '';
    },
    /* Extracts the site name from domain, used for the searching functionality */
    getDomainFromUrl(url) {
      if (!url) return '';
      const urlPattern = /^(?:https?:\/\/)?(?:w{3}\.)?([a-z\d.-]+)\.(?:[a-z.]{2,10})(?:[/\w.-]*)*/;
      const domainPattern = url.match(urlPattern);
      return domainPattern ? domainPattern[1] : '';
    },
  },
};

export default HomeMixin;
