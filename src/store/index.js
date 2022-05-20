import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

import mapStore from "@/store/modules/mapStore";

const store = new Vuex.Store({
  modules: {
    mapStore
  },

  plugins: [createPersistedState]
});

export default store;
