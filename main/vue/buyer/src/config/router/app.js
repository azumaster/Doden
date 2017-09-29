import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
// 首页框架
import main from '@views/main.vue'
// 评论首页
import comment from '@modules/comment/index.vue'
// 追加评价
import reComment from '@modules/comment/re_comment.vue'
// 购物车首页
import cart from '@modules/cart/index.vue'
// 结算
import settlement from '@modules/cart/settlement.vue'

// 订单首页
import order from '@modules/order/index.vue'
// 全部订单
import orderAll from '@modules/order/child/all.vue'
// 待付款订单
import pendingPayment from '@modules/order/child/pending_payment.vue'
// 待发货
import shipmentPending from '@modules/order/child/shipment_pending.vue'
// 待收货
import waitingForDelivery from '@modules/order/child/waiting_for_delivery.vue'
// 待评价
import waitingForEvaluation from '@modules/order/child/waiting_for_evaluation.vue'
// 订单详情
import orderDetail from '@modules/order/order_detail.vue'

// 帮助中心
import help from '@modules/help.vue'

// 404页面
import notFound from '@components/notFoundComponent.vue'
import test from '@views/test.vue'
export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'main',
      component: main,
      meta: {
        title: '找冻品网'
      },
      children: [
        {
          path: 'cart',
          name: 'cart',
          component: cart,
          meta: {
            title: '购物车'
          }
        },
        {
          path: 'order',
          name: 'order',
          component: order,
          meta: {
            title: '订单'
          },
          children: [
            {
              path: '',
              name: 'all',
              component: orderAll,
              meta: {
                title: '全部订单'
              }
            },
            {
              path: 'pending_payment',
              name: 'pending_payment',
              component: pendingPayment,
              meta: {
                title: '待付款'
              }
            },
            {
              path: 'shipment_pending',
              name: 'shipment_pending',
              component: shipmentPending,
              meta: {
                title: '待发货'
              }
            },
            {
              path: 'waiting_for_delivery',
              name: 'waiting_for_delivery',
              component: waitingForDelivery,
              meta: {
                title: '待收货'
              }
            },
            {
              path: 'waiting_for_evaluation',
              name: 'waiting_for_evaluation',
              component: waitingForEvaluation,
              meta: {
                title: '待评价'
              }
            }
          ]
        }
      ]
    },
    {
      path: '/order_detail',
      name: 'order_detail',
      component: orderDetail,
      meta: {
        title: '订单详情'
      }
    },
    {
      path: '/settlement',
      name: 'settlement',
      component: settlement,
      meta: {
        title: '确认订单'
      }
    },
    {
      path: '/comment',
      name: 'comment',
      component: comment,
      meta: {
        title: '订单评论'
      }
    },
    {
      path: '/re_comment',
      name: 're_comment',
      component: reComment,
      meta: {
        title: '追加评论'
      }
    },
    {
      path: '/help',
      name: 'help',
      component: help,
      meta: {
        title: '帮助中心'
      }
    },
    { path: '*', component: notFound },
    { path: '/test', component: test }
  ]
})
