import Vue from 'vue';
import Router from 'vue-router';

import survey from './../views/statistics/survey.vue';
import seller from './../views/rankingList/seller.vue';
import buyer from  './../views/rankingList/buyer.vue';
import goods from './../views/rankingList/goods.vue';

Vue.use(Router);

export default new Router({
    routes: [
        {path: '/', component: survey},
        {path: '/seller', component: seller},
        {path: '/buyer', component: buyer},
        {path: '/goods', component: goods}
    ]
});