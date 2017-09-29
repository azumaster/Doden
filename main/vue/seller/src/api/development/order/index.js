const Promise = require('es6-promise').Promise
/**
 * 获取各种类型订单未处理的数量
 */
export function getOrderCount () {
  let data = {
    code: 0,
    message: 'ok',
    data: {
      all_order: 100,
      wait_send_order: 20,
      already_send_order: 40,
      refund_order: 40
    }
  }
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        all: data.data.all_order,
        shipment_pending: data.data.wait_send_order,
        waiting_for_delivery: data.data.already_send_order,
        refund_goods: data.data.refund_order
      })
    }, 3000)
  })
}

/**
 * 获取订单列表
 * @param status
 * @param page
 * @param size
 * @returns {Promise<any>}
 */
export function orderItem (status = 'all', page = 1, size = 20) {
  let data = {
    code: 0,
    message: 0,
    data: {
      total_num: 200,
      list: []
    }
  }
  let type = {
    shipment_pending: 2,
    waiting_for_delivery: 3
  }
  console.log(status)
  let types = [2, 3, 6, 11]
  for (let i = 1; i <= size; i++) {
    if (status === 'all') {
      type[status] = types[Math.floor((Math.random() * types.length))]
    }
    if (status === 'refund_goods') {
      type[status] = [6, 11][Math.floor((Math.random() * [6, 11].length))]
    }
    data.data.list.push(
      {
        order_id: (i * page),
        order_num: '3799-1458383249-8QpsdpZU-' + (i * page),
        time: '2016-03-19 18:27:29',
        order_type: type[status],
        refund_order_type: 1,
        goods_num: 3,
        total_price: 555.00,
        method: 6,
        shop_name: '测试卖人',
        reduced_price: '优惠10元',
        goods_appraise_state: 1,
        goods: [
          {
            id: 123,
            buy_num: 1,
            price: 555.00,
            goods_name: '测试咯哦',
            goods_status: '他咯',
            url: 'Public/Uploads/goodsimg/20160112/59804200_1452568597.jpg'
          },
          {
            id: 123,
            buy_num: 1,
            price: 555.00,
            goods_name: '测试咯哦',
            goods_status: '他咯',
            url: 'Public/Uploads/goodsimg/20160112/59804200_1452568597.jpg'
          },
          {
            id: 123,
            buy_num: 1,
            price: 555.00,
            goods_name: '测试咯哦',
            goods_status: '他咯',
            url: 'Public/Uploads/goodsimg/20160112/59804200_1452568597.jpg'
          },
          {
            id: 123,
            buy_num: 1,
            price: 555.00,
            goods_name: '测试咯哦',
            goods_status: '他咯',
            url: 'Public/Uploads/goodsimg/20160112/59804200_1452568597.jpg'
          }
        ],
        refund_data: {
          refund_goods_num: 1,
          refund_goods_price: 100.00,
          buyer_refund_content: '不想买了',
          buyer_refund_img: [
            'event/public/refund/123646478798.jpg',
            'event/public/refund/123646478790.jpg'
          ],
          seller_refund_content: '买家操作不当导致商品解冻'
        }
      }
    )
  }
  if (status === 'waiting_for_delivery') {
    data.data.list = []
  }
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(data.data)
    }, 500)
  })
}

/**
 * 获取订单详情
 * @param order_no 订单编号
 */
export function orderDetail (orderNo = '') {
  let data = {
    code: 0,
    message: 'ok',
    data: {
      order_id: 123456789,
      order_num: '547414848799243IU5ynwH-0',
      order_state: 2,
      goods_appraise_state: 1,
      method: 0,
      progress_list: {
        seller_withdraw: {
          state_name: '提现完成',
          time: '2017-06-06 23:00:00'
        },
        seller_apply_withdraw: {
          state_name: '卖家申请提现',
          time: '2017-06-06 23:00:00'
        },
        buyer_get_goods: {
          state_name: '买家确认收货',
          time: '2017-06-06 23:00:00'
        },
        seller_agree_refund: {
          state_name: '卖家退款',
          time: '2017-06-06 23:00:00'
        },
        buyer_send_data: {
          state_name: '买家退货',
          time: '2017-06-06 23:00:00',
          buyer_send_car: {
            buyer_send_car_tel: '18641028121',
            buyer_send_car_num: '川A243333',
            buyer_send_car_adress: '这里那里',
            buyer_send_car_time: '2017-06-06 23:00:00'
          }
        },
        seller_agree_return: {
          state_name: '卖家同意退货',
          time: '2017-06-06 23:00:00'
        },
        seller_refuse_return: {
          state_name: '卖家拒绝退货',
          time: '2017-06-06 23:00:00',
          seller_refuse_return_reason: '商品已打包'
        },
        buyer_return_goods_data: {
          state_name: '买家申请退货',
          time: '2017-06-06 23:00:00',
          buyer_return_goods_data_info: [
            {
              buy_kind_num: 4,
              order_reduce: '优惠10.00元',
              all_price: 1000.00,
              return_total_price: 10.00,
              return_goods: [
                {
                  return_goods_img: '213546879731434.jpg',
                  return_goods_reduce: '减10元',
                  return_goods_name: '鸡翅',
                  return_goods_guige: '1斤10个',
                  return_goods_price: 234.00,
                  return_goods_buy_num: 2,
                  return_goods_num: 1
                }
              ],
              return_reason: '就是不想买了',
              return_reason_img: [
                '147984654654.jpg',
                '1479846546544.jpg'
              ]
            }
          ]
        },
        seller_send_data: {
          state_name: '卖家发货',
          time: '2017-06-06 23:00:00',
          seller_send_car: {
            seller_car_tel: '18614028121',
            seller_car_num: '川A243333'
          }
        },
        seller_refuse_refund: {
          state_name: '卖家拒绝退款',
          time: '2017-06-06 23:00:00',
          refuse_reason: '商品已打包'
        },
        refunds_data: {
          state_name: '买家申请退款',
          time: '2017-06-06 23:00:00',
          refund_data_info: [
            {
              buy_kind_num: 4,
              order_reduce: '优惠10.00元',
              all_price: 1000.00,
              refunds_total_price: 10.00,
              refunds_goods: [
                {
                  refunds_goods_img: '213546879731434.jpg',
                  refunds_goods_reduce: '减10元',
                  refunds_goods_name: '鸡翅',
                  refunds_goods_guige: '1斤10个',
                  refunds_goods_price: 234.00,
                  refunds_goods_buy_num: 2,
                  refunds_goods_num: 1
                }
              ],
              refunds_reason: '就是不想买了'
            }
          ]
        },
        pay_success_data: {
          state_name: '支付成功',
          time: '2017-06-06 23:00:00'
        },
        order_create_data: {
          state_name: '创建订单',
          time: '2017-09-11 20:18:21',
          buyer_name: '测试买的',
          buy_kind_num: 4,
          order_reduce: '优惠10.00元',
          all_price: 1000.00,
          goods_info: [
            {
              goods_name: '一个酸奶牛',
              unit_price: 250.00,
              goods_guige: '1斤4盒',
              buy_num: 2,
              reduced_price: '减10元'
            }
          ],
          pay_way: '支付宝',
          get_goods_way: 2,
          get_goods_data: {
            buyer_find_car: {
              car_tel: '18614028121',
              car_num: '川A243333',
              car_time: '2017-06-06 23:00:00',
              car_address: '你猜'
            },
            seller_find_car: {
              buyer_name: '王小二',
              buyer_tel: '1386666888',
              buyer_address: '不猜'
            }
          }
        }
      }
    }
  }
  if (!orderNo) {
    data = {
      code: 1,
      message: '缺少订单编号',
      data: []
    }
  }
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(data.data)
    }, 1000)
  })
}
