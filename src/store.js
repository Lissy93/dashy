/* eslint-disable no-param-reassign */
import Vue from 'vue';
import Vuex from 'vuex';
import Keys from '@/utils/StoreMutations';
import ConfigAccumulator from '@/utils/ConfigAccumalator';
import { componentVisibility } from '@/utils/ConfigHelpers';

Vue.use(Vuex);

const { UPDATE_CONFIG } = Keys;

const store = new Vuex.Store({
  state: {
    config: {},
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
      return state.config.sections || [];
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
