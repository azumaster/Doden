// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from '../views/comment/index.vue'
import { getConfig } from '../tools/common'
// 加载工具方法插件
// import Tool from '../tools/index'
// 加载模型插件
// import Model from '../tools/model'
// 加载路由
// import router from '../config/router/app'
// 加载公共css文件
// import '@/assets/styl/common.styl'
// 加载animate 动画css库
// import 'animate.css'

Vue.config.productionTip = getConfig('productionTip')
// Vue.use(Model)
// Vue.use(Tool)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
