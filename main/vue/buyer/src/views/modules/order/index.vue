<template>
  <div class="content" ref="content">
    <div class="tabs" ref="tabs">
      <div
        :class="['tab',routeName === 'all'?'active':'']"
      @click="$router.push('/order')">
        <div class="badge">999</div>
        <span>全部</span>
      </div>
      <div
        :class="['tab',routeName === 'pending_payment'?'active':'']"
        @click="$router.push('/order/pending_payment')">
        <div class="badge">99</div>
        <span>待付款</span>
      </div>
      <div
        :class="['tab',routeName === 'shipment_pending'?'active':'']"
        @click="$router.push('/order/shipment_pending')">
        <div class="badge">9</div>
        <span>待发货</span>
      </div>
      <div
        :class="['tab',routeName === 'waiting_for_delivery'?'active':'']"
        @click="$router.push('/order/waiting_for_delivery')">
        <div class="badge">9</div>
        <span>待收货</span>
      </div>
      <div
        :class="['tab',routeName === 'waiting_for_evaluation'?'active':'']"
        @click="$router.push('/order/waiting_for_evaluation')">
        <div class="badge">9</div>
        <span>待评价</span>
      </div>
    </div>
    <div class="tab-content">
      <transition name="fade" appear>
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        routeName: ''
      }
    },
    watch: {
      $route (route) {
        console.log()
        this.$parent.$data.items.order.path = route.matched[2].path
        this.routeName = route.matched[2].name
      }
    },
    mounted () {
      this.$parent.$data.items.order.path = this.$route.matched[2].path
      this.routeName = this.$route.matched[2].name
    }
  }
</script>
<style
  scoped
  lang="stylus"
  src="@/assets/styl/modules/order/index.styl"></style>
