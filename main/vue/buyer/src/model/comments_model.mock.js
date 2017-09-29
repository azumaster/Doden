/**
 * 评论相关接口
 */
import { get, post } from '../tools/http'
let Promise = require('es6-promise').Promise
/**
 * 获取订单里面的所有商品
 * @param sub_order_no
 * @returns {Promise<any>}
 */
export function allGoodsOnOrder (subOrderNo = '') {
  return new Promise((resolve, reject) => {
    return get('all_goods_on_order', {sub_order_no: subOrderNo})
      .then((r) => {
        resolve(r)
      })
      .catch((e) => {
        reject(e)
      })
  })
}
/**
 * 获取微信jsSDK配置
 * @param localPageUrl
 * @returns {Promise<any>}
 */
export function jsSdkConfig (localPageUrl = '') {
  return new Promise((resolve, reject) => {
    return get('js_sdk_config', {signPageUrl: localPageUrl})
      .then(r => {
        resolve(r)
      })
      .catch(e => {
        reject(e)
      })
  })
}
/**
 * 订单评价写入
 * @param data
 * @returns {Promise<any>}
 */
export function createOrderComment (data = {}) {
  return new Promise((resolve, reject) => {
    return post('create_order_comment', data)
      .then(r => {
        resolve(r)
      })
      .catch(e => {
        reject(e)
      })
  })
}

