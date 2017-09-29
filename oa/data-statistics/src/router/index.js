import Vue from 'vue';
import Router from 'vue-router';

import consultStatistics from './../views/consultStatistics/consultStatistics.vue';
import goodsStatistics from './../views/goodsStatistics/goodsStatistics.vue';
import shopStatistics from './../views/shopStatistics/shopStatistics.vue';
import sellStatistics from './../views/sellStatistics/sellStatistics.vue';
import evaluatedata from './../views/evaluatedata/evaluatedata.vue';
import providers from './../views/evaluatedata/providers.vue';
import buyers from './../views/evaluatedata/buyers.vue';
Vue.use(Router);

export default new Router({
    routes: [
        {path: '/', component: consultStatistics},
        {path: '/goodsStatistics', component: goodsStatistics},
        {path: '/shopStatistics', component: shopStatistics},
        {path: '/sellStatistics', component: sellStatistics},
        {path: '/evaluatedata', component: evaluatedata, children: [{path: '', component: providers}, {path: 'buyers', component: buyers}]},
        {path: '/order', component: evaluatedata, children: [{path: '', component: providers}, {path: 'buyers', component: buyers}]}
    ]
});