// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from '@views/App.vue'
import config from '@config/basic'

import mixins from '@mixins'
Vue.mixin(mixins)

import Api from '@api/plugin'
Vue.use(Api)
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)
// import { getConfig } from '../tools/common'
// 加载工具方法插件
// import Tool from '../tools/index'
// 加载模型插件
// import Model from '../tools/model'
// 加载路由
import router from '@router'
// 加载store
import store from '@store'
// 加载weui.css
// import 'weui/dist/style/weui.min.css'
// 加载公共css文件
import '@/assets/styl/common.styl'
// 加载stylus公共函数库
// import '@styl/function.styl'
// 加载animate 动画css库
// import 'animate.css'
import VueAuxiliary from 'vue-auxiliary'
Vue.use(VueAuxiliary)

Vue.config.productionTip = config.productionTip
// Vue.use(Model)
// Vue.use(Tool)

import './directive'
// 设置网页标题
router.beforeEach((to, from, next) => {
  to.matched.some((record, index, arr) => {
    if (index === arr.length - 1) {
      document.title = record.meta.title ? record.meta.title : '找冻品网'
    }
  })
  next()
})
// 注册全局组件
import '@components'
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
