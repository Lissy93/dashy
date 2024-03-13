/* eslint-disable no-param-reassign, prefer-destructuring */
import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import yaml from 'js-yaml';
import Keys from '@/utils/StoreMutations';
import ConfigAccumulator from '@/utils/ConfigAccumalator';
import { componentVisibility } from '@/utils/ConfigHelpers';
import { applyItemId } from '@/utils/SectionHelpers';
import filterUserSections from '@/utils/CheckSectionVisibility';
import ErrorHandler, { InfoHandler, InfoKeys } from '@/utils/ErrorHandler';
import { isUserAdmin } from '@/utils/Auth';
import { localStorageKeys } from './utils/defaults';

Vue.use(Vuex);

const {
  INITIALIZE_CONFIG,
  INITIALIZE_MULTI_PAGE_CONFIG,
  SET_CONFIG,
  SET_REMOTE_CONFIG,
  SET_CURRENT_SUB_PAGE,
  SET_MODAL_OPEN,
  SET_LANGUAGE,
  SET_ITEM_LAYOUT,
  SET_ITEM_SIZE,
  SET_THEME,
  SET_CUSTOM_COLORS,
  UPDATE_ITEM,
  USE_MAIN_CONFIG,
  SET_EDIT_MODE,
  SET_PAGE_INFO,
  SET_APP_CONFIG,
  SET_SECTIONS,
  SET_PAGES,
  UPDATE_SECTION,
  INSERT_SECTION,
  REMOVE_SECTION,
  COPY_ITEM,
  REMOVE_ITEM,
  INSERT_ITEM,
  UPDATE_CUSTOM_CSS,
  CONF_MENU_INDEX,
} = Keys;

const store = new Vuex.Store({
  state: {
    config: {}, // The current config, rendered to the UI
    remoteConfig: {}, // The configuration stored on the server
    editMode: false, // While true, the user can drag and edit items + sections
    modalOpen: false, // KB shortcut functionality will be disabled when modal is open
    currentConfigInfo: undefined, // For multi-page support, will store info about config file
    navigateConfToTab: undefined, // Used to switch active tab in config modal
  },
  getters: {
    config(state) {
      return state.config;
    },
    pageInfo(state) {
      if (!state.config) return {};
      return state.config.pageInfo || {};
    },
    appConfig(state) {
      if (!state.config) return {};
      return state.config.appConfig || {};
    },
    sections(state) {
      return filterUserSections(state.config.sections || []);
    },
    pages(state) {
      return state.remoteConfig.pages || [];
    },
    theme(state) {
      let localTheme = null;
      if (state.currentConfigInfo?.pageId) {
        const themeStoreKey = `${localStorageKeys.THEME}-${state.currentConfigInfo?.pageId}`;
        localTheme = localStorage[themeStoreKey];
      } else {
        localTheme = localStorage[localStorageKeys.THEME];
      }
      return localTheme || state.config.appConfig.theme;
    },
    webSearch(state, getters) {
      return getters.appConfig.webSearch || {};
    },
    visibleComponents(state, getters) {
      return componentVisibility(getters.appConfig);
    },
    /* Make config read/ write permissions object */
    permissions(state, getters) {
      const appConfig = getters.appConfig;
      const perms = {
        allowWriteToDisk: true,
        allowSaveLocally: true,
        allowViewConfig: true,
      };
      // Disable saving changes locally, only
      if (appConfig.preventLocalSave) {
        perms.allowSaveLocally = false;
      }
      // Disable saving changes to disk, only
      if (appConfig.preventWriteToDisk || !isUserAdmin()) {
        perms.allowWriteToDisk = false;
      }
      // Legacy Option: Will be removed in V 2.1.0
      if (appConfig.allowConfigEdit === false) {
        perms.allowWriteToDisk = false;
      }
      // Disable everything
      if (appConfig.disableConfiguration
        || (appConfig.disableConfigurationForNonAdmin && !isUserAdmin())) {
        perms.allowWriteToDisk = false;
        perms.allowSaveLocally = false;
        perms.allowViewConfig = false;
      }
      return perms;
    },
    // eslint-disable-next-line arrow-body-style
    getSectionByIndex: (state, getters) => (index) => {
      return getters.sections[index];
    },
    getItemById: (state, getters) => (id) => {
      let item;
      getters.sections.forEach(sec => {
        if (sec.items) {
          const foundItem = sec.items.find((itm) => itm.id === id);
          if (foundItem) item = foundItem;
        }
      });
      return item;
    },
    getParentSectionOfItem: (state, getters) => (itemId) => {
      let foundSection;
      getters.sections.forEach((section) => {
        (section.items || []).forEach((item) => {
          if (item.id === itemId) foundSection = section;
        });
      });
      return foundSection;
    },
    layout(state) {
      return state.config.appConfig.layout || 'auto';
    },
    iconSize(state) {
      return state.config.appConfig.iconSize || 'medium';
    },
  },
  mutations: {
    [SET_CONFIG](state, config) {
      if (!config.appConfig) config.appConfig = {};
      state.config = config;
    },
    [SET_REMOTE_CONFIG](state, config) {
      const notNullConfig = config || {};
      if (!notNullConfig.appConfig) notNullConfig.appConfig = {};
      state.remoteConfig = notNullConfig;
    },
    [SET_LANGUAGE](state, lang) {
      const newConfig = state.config;
      newConfig.appConfig.language = lang;
      state.config = newConfig;
    },
    [SET_MODAL_OPEN](state, modalOpen) {
      state.modalOpen = modalOpen;
    },
    [SET_EDIT_MODE](state, editMode) {
      if (editMode !== state.editMode) {
        InfoHandler(editMode ? 'Edit session started' : 'Edit session ended', InfoKeys.EDITOR);
        state.editMode = editMode;
      }
    },
    [UPDATE_ITEM](state, payload) {
      const { itemId, newItem } = payload;
      const newConfig = { ...state.config };
      newConfig.sections.forEach((section, secIndex) => {
        (section.items || []).forEach((item, itemIndex) => {
          if (item.id === itemId) {
            newConfig.sections[secIndex].items[itemIndex] = newItem;
            InfoHandler('Item updated', InfoKeys.EDITOR);
          }
        });
      });
      state.config = newConfig;
    },
    [SET_PAGE_INFO](state, newPageInfo) {
      const newConfig = state.config;
      newConfig.pageInfo = newPageInfo;
      state.config = newConfig;
      InfoHandler('Page info updated', InfoKeys.EDITOR);
    },
    [SET_APP_CONFIG](state, newAppConfig) {
      const newConfig = state.config;
      newConfig.appConfig = newAppConfig;
      state.config = newConfig;
      InfoHandler('App config updated', InfoKeys.EDITOR);
    },
    [SET_PAGES](state, multiPages) {
      const newConfig = state.config;
      newConfig.pages = multiPages;
      state.config = newConfig;
      InfoHandler('Pages updated', InfoKeys.EDITOR);
    },
    [SET_SECTIONS](state, newSections) {
      const newConfig = state.config;
      newConfig.sections = newSections;
      state.config = newConfig;
      InfoHandler('Sections updated', InfoKeys.EDITOR);
    },
    [UPDATE_SECTION](state, payload) {
      const { sectionIndex, sectionData } = payload;
      const newConfig = { ...state.config };
      newConfig.sections[sectionIndex] = sectionData;
      state.config = newConfig;
      InfoHandler('Section updated', InfoKeys.EDITOR);
    },
    [INSERT_SECTION](state, newSection) {
      const newConfig = { ...state.config };
      newSection.items = [];
      newConfig.sections.push(newSection);
      state.config = newConfig;
      InfoHandler('New section added', InfoKeys.EDITOR);
    },
    [REMOVE_SECTION](state, payload) {
      const { sectionIndex, sectionName } = payload;
      const newConfig = { ...state.config };
      if (newConfig.sections[sectionIndex].name === sectionName) {
        newConfig.sections.splice(sectionIndex, 1);
        InfoHandler('Section removed', InfoKeys.EDITOR);
      }
      state.config = newConfig;
    },
    [INSERT_ITEM](state, payload) {
      const { newItem, targetSection } = payload;
      const config = { ...state.config };
      config.sections.forEach((section) => {
        if (section.name === targetSection) {
          if (!section.items) section.items = [];
          section.items.push(newItem);
          InfoHandler('New item added', InfoKeys.EDITOR);
        }
      });
      config.sections = applyItemId(config.sections);
      state.config = config;
    },
    [COPY_ITEM](state, payload) {
      const { item, toSection, appendTo } = payload;
      const config = { ...state.config };
      const newItem = { ...item };
      config.sections.forEach((section) => {
        if (section.name === toSection) {
          if (!section.items) section.items = [];
          if (appendTo === 'beginning') {
            section.items.unshift(newItem);
          } else {
            section.items.push(newItem);
          }
          InfoHandler('Item copied', InfoKeys.EDITOR);
        }
      });
      config.sections = applyItemId(config.sections);
      state.config = config;
    },
    [REMOVE_ITEM](state, payload) {
      const { itemId, sectionName } = payload;
      const config = { ...state.config };
      config.sections.forEach((section) => {
        if (section.name === sectionName && section.items) {
          section.items.forEach((item, index) => {
            if (item.id === itemId) {
              section.items.splice(index, 1);
              InfoHandler('Item removed', InfoKeys.EDITOR);
            }
          });
        }
      });
      config.sections = applyItemId(config.sections);
      state.config = config;
    },
    [SET_THEME](state, themOps) {
      const { theme, pageId } = themOps;
      const newConfig = { ...state.config };
      newConfig.appConfig.theme = theme;
      state.config = newConfig;
      const themeStoreKey = pageId ? `${localStorageKeys.THEME}-${pageId}` : localStorageKeys.THEME;
      localStorage.setItem(themeStoreKey, theme);
      InfoHandler('Theme updated', InfoKeys.VISUAL);
    },
    [SET_CUSTOM_COLORS](state, customColors) {
      const newConfig = { ...state.config };
      newConfig.appConfig.customColors = customColors;
      state.config = newConfig;
      InfoHandler('Color palette updated', InfoKeys.VISUAL);
    },
    [SET_ITEM_LAYOUT](state, layout) {
      const newConfig = { ...state.config };
      newConfig.appConfig.layout = layout;
      state.config = newConfig;
      InfoHandler('Layout updated', InfoKeys.VISUAL);
    },
    [SET_ITEM_SIZE](state, iconSize) {
      const newConfig = { ...state.config };
      newConfig.appConfig.iconSize = iconSize;
      state.config = newConfig;
      InfoHandler('Item size updated', InfoKeys.VISUAL);
    },
    [UPDATE_CUSTOM_CSS](state, customCss) {
      state.config.appConfig.customCss = customCss;
      InfoHandler('Custom colors updated', InfoKeys.VISUAL);
    },
    [CONF_MENU_INDEX](state, index) {
      state.navigateConfToTab = index;
    },
    [SET_CURRENT_SUB_PAGE](state, subPageObject) {
      if (!subPageObject) {
        // Set theme back to primary when navigating to index page
        const defaulTheme = localStorage.getItem(localStorageKeys.PRIMARY_THEME);
        if (defaulTheme) state.config.appConfig.theme = defaulTheme;
      }
      state.currentConfigInfo = subPageObject;
    },
    [USE_MAIN_CONFIG](state) {
      if (state.remoteConfig) {
        state.config = state.remoteConfig;
      } else {
        this.dispatch(Keys.INITIALIZE_CONFIG);
      }
    },
  },
  actions: {
    /* Called when app first loaded. Reads config and sets state */
    async [INITIALIZE_CONFIG]({ commit }) {
      // Get the config file from the server and store it for use by the accumulator
      commit(SET_REMOTE_CONFIG, yaml.load((await axios.get('/conf.yml')).data));
      const deepCopy = (json) => JSON.parse(JSON.stringify(json));
      const config = deepCopy(new ConfigAccumulator().config());
      commit(SET_CONFIG, config);
    },
    /* Fetch config for a sub-page (sections and pageInfo only) */
    async [INITIALIZE_MULTI_PAGE_CONFIG]({ commit, state }, configPath) {
      axios.get(configPath).then((response) => {
        const subConfig = yaml.load(response.data);
        const pageTheme = subConfig.appConfig?.theme;
        subConfig.appConfig = state.config.appConfig; // Always use parent appConfig
        if (pageTheme) subConfig.appConfig.theme = pageTheme; // Apply page theme override
        commit(SET_CONFIG, subConfig);
      }).catch((err) => {
        ErrorHandler(`Unable to load config from '${configPath}'`, err);
      });
    },
  },
  modules: {},
});

export default store;
