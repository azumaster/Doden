import Vue from 'vue';
import Router from 'vue-router';

import manageExchangeTicket from  '../views/manageExchangeTicket/manageExchangeTicket.vue';
import using from '../views/manageExchangeTicket/using.vue';
import waitAdd from '../views/manageExchangeTicket/waitAdd.vue';
import stopedUse from '../views/manageExchangeTicket/stopedUse.vue';
import exchangeHistory from '../views/exchangeHistory/exchangeHistory.vue';
import exchangeHistoryBody from '../views/exchangeHistory/exchangeHistoryBody.vue';
import addExchangeTicket from '../views/addExchangeTicket/addExchangeTicket.vue';
import addExchangeTicketBody from '../views/addExchangeTicket/addExchangeTicketBody.vue';
import addTicket from '../views/stopADD/add.vue';
import addbody from '../views/stopADD/addbody.vue';
Vue.use(Router);

export default new Router({
    routes: [
    	{path: '/',redirect: '/manageExchangeTicket'},
        {path: '/manageExchangeTicket', component: manageExchangeTicket, children: [
            {path: '', component: using}, {path: 'waitAdd', component: waitAdd},{path: 'stopedUse', component: stopedUse}
        ]},
        {path: '/exchangeHistory',component: exchangeHistory,children:[{path:'',component: exchangeHistoryBody}]},
        {path: '/addExchangeTicket', component: addExchangeTicket,children: [{path:'', component:addExchangeTicketBody}]},
        {path: '/addTicket',component:addTicket,children: [{path:'', component:addbody}]}
    ]
});