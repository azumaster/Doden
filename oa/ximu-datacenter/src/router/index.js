import Vue from 'vue';
import Router from 'vue-router';

import user from  '../views/user/user.vue';
import area from  '../views/area/area.vue';
import areabody from  '../views/area/areabody.vue';
import payspread from  '../views/area/payspread.vue';
import pay from  '../views/pay/pay.vue';
Vue.use(Router);

export default new Router({
    routes: [
    	{path: '/',redirect: '/user'},
        {path: '/user', component: user},
        {path: '/area', component: area,children: [{path: '', component:areabody},{path:'payspread',component:payspread}]},
        {path: '/pay', component: pay},
    ]
});