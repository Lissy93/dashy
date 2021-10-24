/* eslint-disable no-param-reassign */
import Vue from 'vue';
import Vuex from 'vuex';
import Keys from '@/utils/StoreMutations';
import ConfigAccumulator from '@/utils/ConfigAccumalator';
import { componentVisibility } from '@/utils/ConfigHelpers';
import filterUserSections from '@/utils/CheckSectionVisibility';

Vue.use(Vuex);

const {
  INITIALIZE_CONFIG,
  UPDATE_CONFIG,
  SET_MODAL_OPEN,
  SET_LANGUAGE,
  UPDATE_ITEM,
  SET_EDIT_MODE,
  UPDATE_PAGE_INFO,
  UPDATE_APP_CONFIG,
  UPDATE_SECTION,
} = Keys;

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
      state.editMode = editMode;
    },
    [UPDATE_ITEM](state, payload) {
      const { itemId, newItem } = payload;
      const newConfig = state.config;
      newConfig.sections.forEach((section, secIndex) => {
        section.items.forEach((item, itemIndex) => {
          if (item.id === itemId) {
            newConfig.sections[secIndex].items[itemIndex] = newItem;
          }
        });
      });
      state.config = newConfig;
    },
    [UPDATE_PAGE_INFO](state, newPageInfo) {
      const newConfig = state.config;
      newConfig.pageInfo = newPageInfo;
      state.config = newConfig;
    },
    [UPDATE_APP_CONFIG](state, newAppConfig) {
      const newConfig = state.config;
      newConfig.appConfig = newAppConfig;
      state.config = newConfig;
    },
    [UPDATE_SECTION](state, payload) {
      const { sectionIndex, sectionData } = payload;
      const newConfig = { ...state.config };
      newConfig.sections[sectionIndex] = sectionData;
      state.config = newConfig;
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
