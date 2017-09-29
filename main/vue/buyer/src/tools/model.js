/**
 *  创建数据模型工厂工具,该方法主要用于获取各个模型类,通过 this.$model.模型类文件名 调用。  模型类文件名命名  [模型类文件名_model.js]
 *  创建时间 2017-08-03
 *  版本: v.0.0.1.08
 *  创建人 : 杨陈鹏
 *  **********************************************以下是每次版本更新说明******************************************
 *  ********************************************** v.0.0.1.08 ******************************************
 *  ** 创建数据模型工厂工具
 */

let Model = {}
Model.config = {}

let model = new Proxy({}, {
  get (target, key, receiver) {
    try {
      let mock = ''
      if (process.env.NODE_ENV === 'development') {
        mock = '.mock'
      }
      return require(`../model/${key}_model${mock}`)
    } catch (e) {
      console.error(e)
    }
  }
})

Model.install = function (Vue, options) {
  Vue.prototype.$model = model
}
module.exports = Model
