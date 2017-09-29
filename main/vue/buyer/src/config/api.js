import basic from './basic'
let baseApi = basic.baseApi
console.log('baseApi:', baseApi)
export default {
  // 获取订单全部商品
  all_goods_on_order: `${baseApi}?m=buyers&c=Appraise&a=goodsList`,
  // 获取jsSDK签名配置
  js_sdk_config: `${baseApi}/index.php?m=FrontPublic&c=WeSdk&a=js_sdk_signature`,
  // 订单评价写入
  create_order_comment: `${baseApi}?m=Buyers&c=BuyOrderMain&a=orderAppraise`,
  // 追加评论
  re_comment: `${baseApi}?m=buyers&c=Appraise&a=supplemental`
}
