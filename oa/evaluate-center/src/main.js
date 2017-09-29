/**
 * Created by YYm on 2017.04.14.
 */
import Vue from 'vue';
import App from './App.vue';
import vueResource from 'vue-resource';
import router from './router';
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import  store  from './store';
import Base64 from 'js-base64';
Vue.use(iView);
Vue.use(Base64);
Vue.use(vueResource);
new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App }
});