import Vue from 'vue';
import Router from 'vue-router';

import waitAudit from  '../views/shopManage/waitAudit/waitAudit.vue';
import waitAuditBody from '../views/shopManage/waitAudit/waitAuditBody.vue';
import auditing from  '../views/shopManage/waitAudit/auditing.vue';
import audited from '../views/shopManage/audited/audited.vue';
import auditedBody from '../views/shopManage/audited/auditedBody.vue';
import auditedMange from '../views/shopManage/audited/manage.vue';
import refused from '../views/shopManage/refused/refused.vue';
import refusedBody from '../views/shopManage/refused/refusedBody.vue';
import refusedManage from '../views/shopManage/refused/manage.vue';
import closed from '../views/shopManage/closed/closed.vue';
import closedBody from '../views/shopManage/closed/closedBody.vue';
import closedReStart from '../views/shopManage/closed/reStart.vue';

Vue.use(Router);

export default new Router({
    routes: [
        {path: '/', redirect: '/waitAudit'},
        {path: '/waitAudit', component: waitAudit, children: [
            {path: '', component: waitAuditBody}, {path: 'auditing', component: auditing}
        ]},
        {path: '/audited', component: audited, children: [
            {path: '', component: auditedBody}, {path: 'manage', component: auditedMange}
        ]},
        {path: '/refused', component: refused, children: [
            {path: '', component: refusedBody}, {path: 'manage', component: refusedManage}
        ]},
        {path: '/closed', component: closed, children: [
            {path: '', component: closedBody}, {path: 'restart', component: closedReStart}
        ]}
    ]
});