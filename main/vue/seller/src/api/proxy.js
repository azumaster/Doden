/**
 * Api入口,如果是Vue插件,则以插件方式暴露
 * @type {boolean}
 */
// 利用代理获取对象调用的属性
export default new Proxy({}, {
  get (target, key, receiver) {
    try {
      if (key === 'install') {
        return null
      }
      return require(`@api/${process.env.NODE_ENV}/${key}/index.js`)
    } catch (e) {
      console.error(e)
    }
  }
})
