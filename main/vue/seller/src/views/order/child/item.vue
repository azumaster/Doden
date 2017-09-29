<template>
  <div class="item">
    <div class="title">
      <div class="left">
        <div class="title-info">
          <div class="shop-name">
            <div class="iconfont icon">&#xe60b;</div>
            <div class="name">{{shop_name}}</div>
          </div>
        </div>
        <!--<div class="iconfont icon">&#xe625;</div>-->
      </div>
      <div class="right">
        <div
          class="status"
          v-if="order_type >= 0"
          :style="{color: order_types[order_type].color}">{{order_types[order_type].text}}</div>
        <div
          v-if="method == 1"
          class="action">自行协商</div>
        <div
          v-if="method == 2"
          class="action">集中采购</div>
      </div>
    </div>
    <template v-for="(item,idx) in goods">
      <div
        v-waves
        v-if="idx < 3"
        @click="$router.push(`/order_detail/${order_no}`)"
        class="goods">
        <div class="thumb">
          <img :src="item.url" :alt="item.goods_name">
        </div>
        <div class="info">{{item.goods_name}}</div>
        <div class="data">
          <div class="price">￥{{item.price}}</div>
          <div class="numbers">×{{item.buy_num}}</div>
        </div>
      </div>
    </template>
    <div
      v-if="goods.length > 3"
      class="show-more"
      @click="$router.push(`/order_detail/${order_no}`)">
      <div class="show-more-text">查看更多</div>
      <div class="iconfont show-more-icon">&#xe610;</div>
    </div>
    <template
    v-if="refund_data">
      <div
        v-if="refund_order_type === 5 ||
        refund_order_type === 1"
        class="return-reason">
        <span>买家退货原因</span>
        <p>{{refund_data.buyer_refund_content}}</p>
        <span>退货凭证</span>
        <div
          v-if="refund_data.buyer_refund_img &&
          refund_data.buyer_refund_img.length > 0"
          class="return-voucher">
          <div
            v-for="img in refund_data.buyer_refund_img"
            class="thumb">
            <img :src="img">
          </div>
        </div>
      </div>
      <div
        v-if="refund_order_type === 4 ||
        refund_order_type === 6"
        class="return-reason">
        <span>卖家拒绝原因</span>
        <p>{{ refund.seller_refund_content }}</p>
      </div>
      <div
        v-if="refund_order_type === 9"
        class="return-reason">
        <span>卖家取消订单原因</span>
        <p>{{ refund.seller_refund_content }}</p>
      </div>
    </template>
    <div class="statistics-bar">
      <span class="sub">（不含运费）</span>
      <span class="price">￥{{Number(total_price).toFixed(2)}}</span>
      <span>共{{goods?goods.length:0}}种商品 合计:</span>
    </div>
    <div class="tool-bar">
      <div
        v-if="order_type === 9 ||
        order_type === 10"
        class="buttons">
        <div
          v-if="goods_appraise_state === 1"
          class="button">
          <span>查看评论</span>
        </div>
      </div>
      <div
        v-if="order_type === 8"
        class="buttons">
        <div
          v-if="goods_appraise_state === 1"
          class="button">
          <span>查看评论</span>
        </div>
        <div class="button" style="border-color: #249af9;">
          <span style="color: #249af9;">去提现</span>
        </div>
      </div>
      <div
        v-if="order_type === 2"
        class="buttons">
        <div class="button">
          <span>确认发货</span>
        </div>
        <div class="button">
          <span>取消订单</span>
        </div>
        <div class="button">
          <span>联系买家</span>
        </div>
      </div>
      <div
        v-if="order_type === 3"
        class="buttons">
        <div class="button">
          <span>提醒收货</span>
        </div>
        <div class="button">
          <span>联系买家</span>
        </div>
      </div>
      <div
        v-if="order_type === 6"
        class="buttons">
        <div class="button">
          <span>同意退款</span>
        </div>
        <div class="button">
          <span>拒绝退款</span>
        </div>
        <div class="button">
          <span>联系买家</span>
        </div>
      </div>
      <div
        v-if="order_type === 11"
        class="buttons">
        <template v-if="refund_order_type === 4">
          <div class="button" style="background-color: #eeeeee">
            <span style="color: #eeeeee">拒绝退款</span>
          </div>
          <div class="button">
            <span>联系买家</span>
          </div>
        </template>
        <template v-if="refund_order_type === 5">
          <div class="button">
            <span>拒绝退货</span>
          </div>
          <div class="button">
            <span>同意退货</span>
          </div>
          <div class="button">
            <span>联系买家</span>
          </div>
        </template>
        <template v-if="refund_order_type === 6">
          <div class="button">
            <span>联系买家</span>
          </div>
          <div class="button" style="background-color: #eeeeee">
            <span style="color: #eeeeee">拒绝退货</span>
          </div>
        </template>
        <template v-if="refund_order_type === 7">
          <div class="button">
            <span>联系买家</span>
          </div>
          <div class="button" style="background-color: #eeeeee">
            <span style="color: #eeeeee">同意退货</span>
          </div>
        </template>
        <template v-if="refund_order_type === 8">
          <div class="button">
            <span>联系买家</span>
          </div>
          <div class="button">
            <span>同意退款</span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      // 订单编号
      order_no: {
        type: String
      },
      // 店铺名称
      shop_name: {
        type: String
      },
      // (0:其他；1:自行协商;2:集中采购)
      method: {
        type: Number,
        default: 0
      },
      // 订单状态
      order_type: {
        type: Number
      },
      // 订单商品
      goods: {
        type: Array,
        default: null
      },
      // 订单总价
      total_price: {
        type: Number,
        default: 0
      },
      // 买家联系电话
      tel: {
        type: String
      },
      // 退货时的订单状态
      refund_order_type: {
        type: Number
      },
      // 订单是否被评价
      goods_appraise_state: {
        type: Number,
        default: 2
      },
      // 退款退货原因数据
      refund_data: {
        default: null
      }
    },
    data () {
      return {
        order_types: {
          2: {text: '待发货', color: '#fb3338'},
          3: {text: '待收货', color: '#fb3338'},
          6: {text: '退款', color: '#fb3338'},
          8: {text: '可提现', color: '#fb3338'},
          9: {text: '提现中', color: '#fb3338'},
          10: {text: '已提现', color: '#666'},
          11: {text: '退货', color: '#fb3338'},
          13: {text: '交易关闭', color: '#666'}
        }
      }
    },
    methods: {},
    created () {
    },
    mounted () {
    },
    updated () {
    }
  }
</script>
<style scoped lang="stylus" src="@styl/modules/order/child/item.styl"></style>
