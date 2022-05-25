import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

import mapStore from "@/store/modules/mapStore";
import userStore from "@/store/modules/userStore";
import qnaStore from "@/store/modules/qnaStore";

const store = new Vuex.Store({
  modules: {
    mapStore,
    userStore,
    qnaStore,
  },

  plugins: [createPersistedState({
    //주목! : 여기에 쓴 모듈만 저장됩니다.
    paths: ["userStore", "qnaStore"]
  })]
});

export default store;
