<template>
  <div>
    <template v-for="item in data">
      <item
      :order_no="item.order_num"
      :shop_name="item.shop_name"
      :method="item.method"
      :order_type="item.order_type"
      :goods="item.goods"
      :total_price="item.total_price"
      :tel="item.tel"
      :refund_order_type="item.refund_order_type"
      :goods_appraise_state="item.goods_appraise_state"
      :refund_data="item.refund_data"
      ></item>
    </template>
    <ui-load-more
      :message="message[isFirst[type]]"
      @load-more="loadMore"
      :disabled="disabledLoadMore[type]"
      :scroll="scroll"
      :haveData="haveData[type]"
      :baseline="afterNotData[type]"></ui-load-more>
  </div>
</template>
<script>
  import uiLoadMore from '@components/loadMoreView.vue'
  import item from './item.vue'
  export default {
    components: {
      item,
      uiLoadMore
    },
    data () {
      return {
        // 订单类型
        type: 'all',
        data: [],
        message: {
          1: '订单载入中...',
          2: '加载中...',
          3: '正在刷新订单...'
        },
        /**
         * 字段说明
         * all 全部订单
         * shipment_pending 待发货订单
         * waiting_for_delivery 收货订单
         * refund_goods 退款/退货订单
         */
        // 是否是第一次加载,如果是则显示loading
        haveData: {
          all: true,
          shipment_pending: true,
          waiting_for_delivery: true,
          refund_goods: true
        },
        // 是否是第一次加载,如果是则显示loading
        isFirst: {
          all: 1,
          shipment_pending: 1,
          waiting_for_delivery: 1,
          refund_goods: 1
        },
        // 当前页码 默认为第一页
        pages: {
          all: 1,
          shipment_pending: 1,
          waiting_for_delivery: 1,
          refund_goods: 1
        },
        // 订单状态
        status: {
          all: 0,
          shipment_pending: 2,
          waiting_for_delivery: 3,
          refund_goods: 5
        },
        // 订单数据
        items: {
          all: [],
          shipment_pending: [],
          waiting_for_delivery: [],
          refund_goods: []
        },
        // 滚动窗口节点
        scroll: null,
        // 是否禁用加载更多组件
        disabledLoadMore: {
          all: false,
          shipment_pending: false,
          waiting_for_delivery: false,
          refund_goods: false
        },
        // 是否是最后一页
        afterNotData: {
          all: false,
          shipment_pending: false,
          waiting_for_delivery: false,
          refund_goods: false
        }
      }
    },
    watch: {
      $route (route) {
        this.type = route.params.type
        this.pages[this.type] = 1
        this.disabledLoadMore[this.type] = false
        this.afterNotData[this.type] = false
        this.items[this.type] = []
        this.haveData[this.type] = true
        if (this.isFirst[this.type] > 1) {
          this.isFirst[this.type] = 3
        }
        this.getItems(this.type, this.pages[this.type])
      }
    },
    methods: {
      /**
       * 获取列表数据
       * @param status 订单类型
       * @param page 页码
       * @param size 每页显示条数
       */
      getItems (status, page, size = 10) {
        // 加载之前禁用加载更多组件, 防滑动进行多次请求
        this.disabledLoadMore[this.type] = true
        this.data = this.items[status]
        this.$api.order.orderItem(
          status,
          page,
          size).then(r => {
            if (r.list.length > 0) {
              this.isFirst[status] = 2
            } else if ( // 如果没有数据则给出提示
              r.list.length < 1 &&
              this.isFirst[status] !== 2) {
              this.haveData[status] = false
              return false
            }
            // 储存数据
            this.items[status] = this.items[status]
                                        .concat(r.list)
            // 渲染数据到列表
            this.data = this.items[status]
            // 解除当前列表的加载更多组件禁用状态
            this.disabledLoadMore[this.type] = false
            // 当前这次请求是否是最后一页
            if (r.total_num <= (size * page) ||
              (r.list && r.list.length < 1)) {
              this.afterNotData[status] = true
              return false
            } else {
              this.pages[status] += 1
            }
          }
        )
      },
      // 加载更多
      loadMore () {
        this.getItems(this.type, this.pages[this.type])
      }
    },
    mounted () {
      this.scroll = this.$parent.$refs.scroll
    },
    created () {
      this.type = this.$route.params.type
      this.getItems(
        this.type,
        this.pages[this.type]
      )
    }
  }
</script>
