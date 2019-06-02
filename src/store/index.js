import Vue from 'vue';
import Vuex from 'vuex';
import loginStore from './modules/loginStore'

Vue.use(Vuex);
const store = new Vuex.Store({
  // strict: process.env.NODE_ENV !== 'production',
  modules: {
    loginStore
  }
});

export default store;
