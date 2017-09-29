import Vue from 'vue';
import Vuex from 'vuex';
import editor from './modules/editor';
import loader from './modules/loader';
import middleware from "./modules/middleware";
Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        showPutaway: false,
        showType: false
    },
    modules: {
      editor,
      loader,
      middleware,
    },
});

export default store;
