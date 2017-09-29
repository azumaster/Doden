import Vue from 'vue';
import Router from 'vue-router';

import whiteList from  '../views/whiteList/whiteList.vue';

Vue.use(Router);

export default new Router({
    routes: [
    	{path: '/',redirect: '/whiteList'},
        {path: '/whiteList', component: whiteList}
    ]
});