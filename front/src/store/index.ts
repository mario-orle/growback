import Vue from "vue";
import Vuex from "vuex";
import { setToken } from "./mutations/set-token";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: "",
  },
  mutations: {
    setToken,
  },
  actions: {},
  modules: {},
});
