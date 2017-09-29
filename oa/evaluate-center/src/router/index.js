import Vue from 'vue';
import Router from 'vue-router';

import evaluateMain from '../views/evaluateMange/evaluateMain.vue'
import evaluateManage from '../views/evaluateMange/evaluateMange.vue';
import deleteEvaluate from '../views/evaluateMange/editorEvaluate.vue';
import evaluateLogs from '../views/evaluateMange/evaluateLogs.vue'

import tradeOrderMain from '../views/tradeOrder/tradeOrderMain.vue';
import tradeOrder from '../views/tradeOrder/tradeOrder.vue';
import tradeDetail from '../views/tradeOrder/tradeDetail.vue';
import financeOA from '../views/financeOA/financeoa.vue';

import evaluatedata from './../views/evaluatedata/evaluatedata.vue';
import providers from './../views/evaluatedata/providers.vue';
import buyers from './../views/evaluatedata/buyers.vue';

import orderData from './../views/orderData/oderData.vue';
import order from './../views/orderData/order.vue';
import orderCatch from './../views/orderData/orderCatch.vue';
import orderOperate from './../views/orderData/orderOperate.vue';

Vue.use(Router);

export default new Router({
    routes: [
        {path: '/', redirect: '/evaluateMain'},
        {path: '/evaluateMain', component: evaluateMain, children: [{path: '', component: evaluateManage} ,{path: 'editorEvaluate',component: deleteEvaluate}, {path: 'evaluateLogs', component: evaluateLogs}]},
        {path: '/tradeOrderMain', component: tradeOrderMain, children: [{path: '', component: tradeOrder}, {path: 'tradeDetail', component: tradeDetail}]},
        {path: '/financeOA', component: financeOA},
        {path: '/evaluatedata', component: evaluatedata, children: [{path: '', component: providers}, {path: 'buyers', component: buyers}]},
        {path: '/orderData', component: orderData, children: [
            {path: '', component: order}, {path: 'catch', component: orderCatch}, {path: 'operate', component: orderOperate}
        ]},
    ]
});