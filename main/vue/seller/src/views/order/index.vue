<template>
  <div class="content" ref="content">
    <div class="tabs" ref="tabs">
      <template v-for="tab in tabs">
        <div
          v-waves
          :class="['tab',routeName === tab.path?'active':'']"
          @click="$router.push(tab.path)">
          <div class="badge" v-if="typeCount[tab.path] > 0 && tab.path !== 'all'">{{typeCount[tab.path]}}</div>
          <span>{{tab.title}}</span>
        </div>
      </template>
    </div>
    <div class="tab-content" ref="scroll">
      <transition name="fade" appear>
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex'
  export default {
    data () {
      return {
        routeName: 'all',
        tabs: [
          {
            title: '全部订单',
            path: 'all'
          },
          {
            title: '待发货',
            path: 'shipment_pending'
          },
          {
            title: '待收货',
            path: 'waiting_for_delivery'
          },
          {
            title: '退款/退货',
            path: 'refund_goods'
          }
        ]
      }
    },
    computed: {
      ...mapGetters([
        'typeCount'
      ])
    },
    watch: {
      $route (route) {
        this.$parent.$data.items.order.path = route.path
        this.routeName = route.params.type
        this.$store.dispatch('refreshTypeCount')
      }
    },
    methods: {
    },
    mounted () {
//      this.scroll = this.$refs.scroll
      this.$parent.$data.items.order.path = this.$route.path
      this.routeName = this.$route.params.type ? this.$route.params.type : 'all'
    }
  }
</script>
<style
  scoped
  lang="stylus"
  src="@/assets/styl/modules/order/index.styl"></style>
