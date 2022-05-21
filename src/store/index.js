import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

import mapStore from "@/store/modules/mapStore";
import userStore from "@/store/modules/userStore";

const store = new Vuex.Store({
  modules: {
    mapStore,
    userStore
  },

  plugins: [createPersistedState]
});

export default store;
