/**
 * Created by YYM on 2017.06.10.
 */
import Vue from 'vue';
import App from './App.vue';
import vueResource from 'vue-resource';

import router from './router';
import iView from 'iview';
import 'iview/dist/styles/iview.css';
Vue.use(iView);
Vue.use(vueResource);

new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: { App }
});