import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
const _import = require('./_import_' + process.env.NODE_ENV)
export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'main',
      component: _import('main'),
      meta: {
        title: '找冻品网'
      },
      children: [
        {
          path: 'order',
          name: 'order',
          component: _import('order/index'),
          meta: {
            title: '订单'
          },
          children: [
            {
              path: '',
              redirect: 'all'
            },
            {
              path: ':type',
              name: 'all',
              component: _import('order/child/all'),
              meta: {
                title: '全部订单'
              }
            },
            {
              path: ':type',
              name: 'shipment_pending',
              component: _import('order/child/all'),
              meta: {
                title: '待发货'
              }
            },
            {
              path: ':type',
              name: 'waiting_for_delivery',
              component: _import('order/child/all'),
              meta: {
                title: '待收货'
              }
            },
            {
              path: ':type',
              name: 'refund_refund_goods',
              component: _import('order/child/all'),
              meta: {
                title: '退款/退货'
              }
            }
          ]
        }
      ]
    },
    {
      path: '/order_detail/:order_no',
      name: 'order_detail',
      component: _import('order/order_detail'),
      meta: {
        title: '订单详情'
      }
    },
    {
      path: '/order_detail_bak/:order_no',
      name: 'order_detail_bak',
      component: _import('order/order_detail_bak'),
      meta: {
        title: '订单详情'
      }
    },
    {
      path: '/help',
      name: 'help',
      component: _import('help'),
      meta: {
        title: '帮助中心'
      }
    },
    { path: '*', component: _import('components/notFoundComponent') },
    { path: '/test', component: _import('test') }
  ]
})
