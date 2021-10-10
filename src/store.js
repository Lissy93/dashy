/* eslint-disable no-param-reassign */
import Vue from 'vue';
import Vuex from 'vuex';
import Keys from '@/utils/StoreMutations';
import ConfigAccumulator from '@/utils/ConfigAccumalator';
import { componentVisibility } from '@/utils/ConfigHelpers';
import filterUserSections from '@/utils/CheckSectionVisibility';

Vue.use(Vuex);

const { UPDATE_CONFIG, SET_MODAL_OPEN } = Keys;

const store = new Vuex.Store({
  state: {
    config: {},
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
  },
  mutations: {
    [UPDATE_CONFIG](state, config) {
      state.config = config;
    },
    [SET_MODAL_OPEN](state, modalOpen) {
      state.modalOpen = modalOpen;
    },
  },
  actions: {
    initializeConfig({ commit }) {
      const Accumulator = new ConfigAccumulator();
      const config = Accumulator.config();
      commit(UPDATE_CONFIG, config);
    },
  },
  modules: {},
});

export default store;
