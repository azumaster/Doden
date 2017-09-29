/**
 * Api入口,Vue插件
 * @type {boolean}
 */
import proxy from './proxy'
let Api = {}
// 申请成为Vue插件
Api.install = function (Vue, options) {
  Vue.prototype.$api = proxy
}
export default Api
