/**
 * Created by YYM on 2017.06.20.
 */
import 'normalize.css';
import 'font-awesome/css/font-awesome.css';
import 'cropperjs/dist/cropper.css';
import 'babel-polyfill';
import Vue from 'vue';
import App from './App.vue';
import vueResource from 'vue-resource';
import store from './store';
import router from './router';
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import './components';
import Dialog from  './common/dialog.js';
import Base from './common/base.js';

Vue.use(iView);
Vue.use(vueResource);
Vue.prototype.$dialog = Dialog;
Vue.mixin(Base);
new Vue({
	store,
    el: '#app',
    router,
    template: '<App/>',
    components: { App }
});