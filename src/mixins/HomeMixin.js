/**
 * Mixin for all homepages (default home, minimal home, workspace, etc)
 */

import Defaults, { localStorageKeys, iconCdns } from '@/utils/defaults';
import Keys from '@/utils/StoreMutations';
import { searchTiles } from '@/utils/Search';
import { checkItemVisibility } from '@/utils/CheckItemVisibility';
import { GetTheme, ApplyLocalTheme, ApplyCustomVariables } from '@/utils/ThemeHelper';

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
      return (this.subPageInfo && this.subPageInfo.pageId) ? this.subPageInfo.pageId : 'home';
    },
  },
  data: () => ({
    searchValue: '',
  }),
  async mounted() {
    await this.getConfigForRoute();
  },
  watch: {
    async $route() {
      await this.getConfigForRoute();
      this.setTheme();
    },
  },
  methods: {
    async getConfigForRoute() {
      this.$store.commit(Keys.SET_CURRENT_SUB_PAGE, this.subPageInfo);
      if (this.subPageInfo && this.subPageInfo.confPath) { // Get config for sub-page
        await this.$store.dispatch(Keys.INITIALIZE_MULTI_PAGE_CONFIG, this.subPageInfo.confPath);
      } else { // Otherwise, use main config
        this.$store.commit(Keys.USE_MAIN_CONFIG);
      }
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
      const theme = this.getSubPageTheme() || GetTheme();
      ApplyLocalTheme(theme);
      ApplyCustomVariables(theme);
    },
    updateModalVisibility(modalState) {
      this.$store.commit('SET_MODAL_OPEN', modalState);
    },
    /* Updates local data with search value, triggered from filter comp */
    searching(searchValue) {
      this.searchValue = searchValue || '';
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
      return searchTiles(visibleTiles, this.searchValue);
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
