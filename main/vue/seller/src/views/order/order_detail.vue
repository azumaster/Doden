<template>
  <div class="body">
    <div class="body-content">
      <div class="top-status">
        <div
          class="status-item">
          <template v-if="order_no">
            <div class="status-item-left">
              订单编号: {{order_no}}
            </div>
            <div class="status-item-right">
              <span>复制编号</span>
            </div>
          </template>
        </div>
        <div class="status-item">
          <div class="status-item-left">
            <span style="color: #249af9">
              {{order_states[orderData.order_state]}}
            </span>
          </div>
        </div>
      </div>
      <div class="time-axis">
        <template v-for="(progress, key) in orderData.progress_list">
          <div
            class="item"
            v-if="!isEmptyObject(progress)"
            :class="{'real-last': key === 'order_create_data'}">
            <div class="status">
              <div class="status-node">
                <div class="mark">
                  <div class="hollow-circle">
                    <div class="solid-circle"></div>
                  </div>
                </div>
                <div class="top"></div>
                <div class="bottom"></div>
              </div>
              <div class="status-text">
                {{progress.state_name}} {{progress.time}}
              </div>
            </div>
            <template
              v-if="key === 'order_create_data'">
              <div
                class="item-content">
                <div class="goods-info">
                  <div class="shop-title">
                    <div class="desc">购买商品</div>
                    <div class="name">
                      <div class="iconfont">&#xe736;</div>
                      <div class="text">{{progress.buyer_name}}</div>
                    </div>
                  </div>
                  <div
                    v-for="goods in progress.goods_info"
                    class="goods-item">
                    <div class="thumb"></div>
                    <div class="title">{{goods.goods_name}}</div>
                    <div class="price-nums">
                      <div class="price">￥{{goods.unit_price}}</div>
                      <div class="nums">×{{goods.buy_num}}</div>
                    </div>
                  </div>
                  <div class="statistics">
                    <span class="sub">(不含运费)</span>
                    <span class="price">￥{{Number(progress.all_price).toFixed(2)}}</span>
                    <span>
                    共{{progress.buy_kind_num}}件商品
                    {{
                      Number(progress.order_reduce) > 0
                      ? '优惠'+Number(progress.order_reduce).toFixed(2)+'元'
                        : ''
                      }} 合计:
                  </span>
                  </div>
                </div>
                <div class="pay-method">
                  <div class="left">支付方式</div>
                  <div class="right">{{progress.pay_way}}</div>
                </div>
                <template
                  v-if="Number(progress.get_goods_way) === 2">
                  <div class="receiving-mode">
                    <div class="receiving-item">
                      <div class="item-title">收货方式:</div>
                      <div class="item-text">
                        <div class="call">
                          <div class="iconfont">&#xe60a;</div>
                          <span>联系司机</span>
                        </div>
                        <span>买家找车</span>
                      </div>
                    </div>
                    <div class="receiving-item">
                      <div class="item-title">司机电话:</div>
                      <div class="item-text">
                        {{progress.get_goods_data.buyer_find_car.car_tel}}
                      </div>
                    </div>
                    <div class="receiving-item">
                      <div class="item-title">车牌号码:</div>
                      <div class="item-text">
                        {{progress.get_goods_data.buyer_find_car.car_num}}
                      </div>
                    </div>
                    <div class="receiving-item">
                      <div class="item-title">装车时间:</div>
                      <div class="item-text">
                        {{progress.get_goods_data.buyer_find_car.car_time}}
                      </div>
                    </div>
                    <div class="receiving-item">
                      <div class="item-title">装车位置:</div>
                      <div class="item-text">
                        {{progress.get_goods_data.buyer_find_car.car_address}}
                      </div>
                    </div>
                  </div>
                </template>
                <template
                  v-if="Number(progress.get_goods_data) === 3">
                  <div class="receiving-mode">
                    <div class="receiving-item">
                      <div class="item-title">收货方式:</div>
                      <div class="item-text">卖家找车</div>
                    </div>
                    <div class="receiving-item">
                      <div class="item-title">收货信息:</div>
                      <div class="item-text">
                        {{progress.get_goods_data.seller_find_car.buyer_name}}
                        {{progress.get_goods_data.seller_find_car.buyer_tel}}
                      </div>
                    </div>
                    <div class="receiving-item">
                      <div class="item-text">
                        {{progress.get_goods_data.seller_find_car.buyer_address}}
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </template>
            <template
            v-if="
            key === 'refunds_data'">
              <div class="item-content">
                <div class="goods-info">
                  <div class="shop-title">
                    <div class="desc">退款商品</div>
                  </div>
                  <div
                    v-for="i in 3"
                    class="goods-item">
                    <div class="thumb"></div>
                    <div class="title">
                      渝达鸭肠16kg渝达鸭肠16kg渝达鸭肠16kg渝达鸭肠16kg渝达鸭肠16kg
                    </div>
                    <div class="price-nums">
                      <div class="price">￥200.00</div>
                      <div class="nums">×5</div>
                    </div>
                  </div>
                  <div class="statistics">
                    <span class="sub">(退款总金额)</span>
                    <span class="price">
                      ￥{{progress.refund_data_info.refunds_total_price}}
                    </span>
                    <span>
                      共{{progress.refund_data_info.buy_kind_num}}件商品
                      {{
                      Number(progress.refund_data_info.order_reduce) > 0
                        ? '优惠'+Number(progress.refund_data_info.order_reduce).toFixed(2)+'元'
                        : ''
                      }} 合计:
                    </span>
                  </div>
                  <div class="return-reason">
                    <span>买家退款原因</span>
                    <p>
                      {{progress.refund_data_info.refunds_reason}}
                    </p>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </template>

      </div>
    </div>
    <div class="body-footer">

    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        order_no: '',
        orderData: {},
        order_states: {
          2: '待发货',
          3: '等待买家收货',
          4: '交易成功',
          5: '交易关闭',
          6: '买家申请退款',
          8: '可提现',
          9: '提现中',
          10: '已提现',
          11: '买家申请退货',
          12: '卖家已同意退货',
          13: '买家已退货',
          14: '卖家申请取消订单'
        }
      }
    },
    methods: {
      getData (orderNo) {
        this.$auxiliary.loading.show()
        this.$api.order.orderDetail(orderNo).then(r => {
          this.$auxiliary.loading.hide()
          this.orderData = r
          console.log(this.orderData)
        })
      }
    },
    created () {
      this.order_no = this.$route.params.order_no
      this.getData(this.order_no)
    }
  }
</script>
<style scoped lang="stylus" src="@styl/modules/order/order_detail.styl"></style>
