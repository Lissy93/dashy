/* eslint-disable no-param-reassign */
import Vue from 'vue';
import Vuex from 'vuex';
import Keys from '@/utils/StoreMutations';
import ConfigAccumulator from '@/utils/ConfigAccumalator';
import { componentVisibility } from '@/utils/ConfigHelpers';
import { applyItemId } from '@/utils/SectionHelpers';
import filterUserSections from '@/utils/CheckSectionVisibility';
import { InfoHandler, InfoKeys } from '@/utils/ErrorHandler';

Vue.use(Vuex);

const {
  INITIALIZE_CONFIG,
  SET_CONFIG,
  SET_MODAL_OPEN,
  SET_LANGUAGE,
  SET_ITEM_LAYOUT,
  SET_ITEM_SIZE,
  SET_THEME,
  SET_CUSTOM_COLORS,
  UPDATE_ITEM,
  SET_EDIT_MODE,
  SET_PAGE_INFO,
  SET_APP_CONFIG,
  SET_SECTIONS,
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
    config: {},
    editMode: false, // While true, the user can drag and edit items + sections
    modalOpen: false, // KB shortcut functionality will be disabled when modal is open
    navigateConfToTab: undefined, // Used to switch active tab in config modal
  },
  getters: {
    config(state) {
      return state.config;
    },
    pageInfo(state) {
      return state.config.pageInfo || {};
    },
    appConfig(state) {
      return state.config.appConfig || {};
    },
    sections(state) {
      return filterUserSections(state.config.sections || []);
    },
    theme(state) {
      return state.config.appConfig.theme;
    },
    webSearch(state, getters) {
      return getters.appConfig.webSearch || {};
    },
    visibleComponents(state, getters) {
      return componentVisibility(getters.appConfig);
    },
    // eslint-disable-next-line arrow-body-style
    getSectionByIndex: (state, getters) => (index) => {
      return getters.sections[index];
    },
    getItemById: (state, getters) => (id) => {
      let item;
      getters.sections.forEach(sec => {
        const foundItem = sec.items.find((itm) => itm.id === id);
        if (foundItem) item = foundItem;
      });
      return item;
    },
    getParentSectionOfItem: (state, getters) => (itemId) => {
      let foundSection;
      getters.sections.forEach((section) => {
        section.items.forEach((item) => {
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
      state.config = config;
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
        section.items.forEach((item, itemIndex) => {
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
        if (section.name === sectionName) {
          section.items.forEach((item, index) => {
            if (item.id === itemId) {
              section.items.splice(index, 1);
              InfoHandler('Item removed', InfoKeys.EDITOR);
            }
          });
        }
      });
      state.config = config;
    },
    [SET_THEME](state, theme) {
      const newConfig = { ...state.config };
      newConfig.appConfig.theme = theme;
      state.config = newConfig;
      InfoHandler('Theme updated', InfoKeys.VISUAL);
    },
    [SET_CUSTOM_COLORS](state, customColors) {
      const newConfig = { ...state.config };
      newConfig.appConfig.customColors = customColors;
      state.config = newConfig;
      InfoHandler('Color palette updated', InfoKeys.VISUAL);
    },
    [SET_ITEM_LAYOUT](state, layout) {
      state.config.appConfig.layout = layout;
      InfoHandler('Layout updated', InfoKeys.VISUAL);
    },
    [SET_ITEM_SIZE](state, iconSize) {
      state.config.appConfig.iconSize = iconSize;
      InfoHandler('Item size updated', InfoKeys.VISUAL);
    },
    [UPDATE_CUSTOM_CSS](state, customCss) {
      state.config.appConfig.customCss = customCss;
      InfoHandler('Custom colors updated', InfoKeys.VISUAL);
    },
    [CONF_MENU_INDEX](state, index) {
      state.navigateConfToTab = index;
    },
  },
  actions: {
    /* Called when app first loaded. Reads config and sets state */
    [INITIALIZE_CONFIG]({ commit }) {
      const deepCopy = (json) => JSON.parse(JSON.stringify(json));
      const config = deepCopy(new ConfigAccumulator().config());
      commit(SET_CONFIG, config);
    },
  },
  modules: {},
});

export default store;
