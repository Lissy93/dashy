/* eslint-disable no-param-reassign */
import Vue from 'vue';
import Vuex from 'vuex';
import Keys from '@/utils/StoreMutations';
import ConfigAccumulator from '@/utils/ConfigAccumalator';
import { componentVisibility } from '@/utils/ConfigHelpers';
import { applyItemId } from '@/utils/MiscHelpers';
import filterUserSections from '@/utils/CheckSectionVisibility';
import { InfoHandler, InfoKeys } from '@/utils/ErrorHandler';

Vue.use(Vuex);

const {
  INITIALIZE_CONFIG,
  UPDATE_CONFIG,
  SET_MODAL_OPEN,
  SET_LANGUAGE,
  SET_ITEM_LAYOUT,
  SET_ITEM_SIZE,
  UPDATE_ITEM,
  SET_EDIT_MODE,
  UPDATE_PAGE_INFO,
  UPDATE_APP_CONFIG,
  UPDATE_SECTION,
  REMOVE_SECTION,
  COPY_ITEM,
  REMOVE_ITEM,
  INSERT_ITEM,
} = Keys;

const editorLog = (logMessage) => {
  InfoHandler(logMessage, InfoKeys.EDITOR);
};

const store = new Vuex.Store({
  state: {
    config: {},
    editMode: false, // While true, the user can drag and edit items + sections
    modalOpen: false, // KB shortcut functionality will be disabled when modal is open
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
  },
  mutations: {
    [UPDATE_CONFIG](state, config) {
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
        editorLog(editMode ? 'Edit session started' : 'Edit session ended');
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
            editorLog('Item updated');
          }
        });
      });
      state.config = newConfig;
    },
    [UPDATE_PAGE_INFO](state, newPageInfo) {
      const newConfig = state.config;
      newConfig.pageInfo = newPageInfo;
      state.config = newConfig;
      editorLog('Page info updated');
    },
    [UPDATE_APP_CONFIG](state, newAppConfig) {
      const newConfig = state.config;
      newConfig.appConfig = newAppConfig;
      state.config = newConfig;
      editorLog('App config updated');
    },
    [UPDATE_SECTION](state, payload) {
      const { sectionIndex, sectionData } = payload;
      const newConfig = { ...state.config };
      newConfig.sections[sectionIndex] = sectionData;
      state.config = newConfig;
      editorLog('Section updated');
    },
    [REMOVE_SECTION](state, payload) {
      const { sectionIndex, sectionName } = payload;
      const newConfig = { ...state.config };
      if (newConfig.sections[sectionIndex].name === sectionName) {
        newConfig.sections.splice(sectionIndex, 1);
        editorLog('Section removed');
      }
      state.config = newConfig;
    },
    [INSERT_ITEM](state, payload) {
      const { newItem, targetSection } = payload;
      const config = { ...state.config };
      config.sections.forEach((section) => {
        if (section.name === targetSection) {
          section.items.push(newItem);
          editorLog('New item added');
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
          if (appendTo === 'Begining') {
            section.items.unshift(newItem);
          } else {
            section.items.push(newItem);
          }
          editorLog('Item copied');
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
              editorLog('Item removed');
            }
          });
        }
      });
      state.config = config;
    },
    [SET_ITEM_LAYOUT](state, layout) {
      state.config.appConfig.layout = layout;
    },
    [SET_ITEM_SIZE](state, iconSize) {
      state.config.appConfig.iconSize = iconSize;
    },
  },
  actions: {
    /* Called when app first loaded. Reads config and sets state */
    [INITIALIZE_CONFIG]({ commit }) {
      const deepCopy = (json) => JSON.parse(JSON.stringify(json));
      const config = deepCopy(new ConfigAccumulator().config());
      commit(UPDATE_CONFIG, config);
    },
  },
  modules: {},
});

export default store;
