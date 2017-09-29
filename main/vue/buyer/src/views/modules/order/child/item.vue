<template>
  <div class="item">
    <div class="title">
      <div class="left">
        <div class="title-info">
          <div class="shop-name">
            <div class="iconfont icon">&#xe736;</div>
            <div class="name">山河食品山山河食品山</div>
          </div>
        </div>
        <div class="iconfont icon">&#xe625;</div>
      </div>
      <div class="right">
        <div class="status">交易完成</div>
        <div class="action">采集</div>
      </div>
    </div>
    <div
      @click="$router.push('/order_detail')"
      v-for="i in 2"
      class="goods">
      <div class="thumb"></div>
      <div class="info">
        渝达鸭肠16kg渝达鸭肠16kg渝达鸭肠16kg渝达鸭肠16kg
      </div>
      <div class="data">
        <div class="price">￥2000.00</div>
        <div class="numbers">×2</div>
      </div>
    </div>
    <div class="statistics-bar">
      <span class="sub">（不含运费）</span>
      <span class="price">￥400.00</span>
      <span>共2种商品 合计:</span>
    </div>
    <div class="tool-bar">
      <div class="buttons">
        <div class="button">
          <span>联系卖家</span>
        </div>
        <div class="button">
          <span>再次购买</span>
        </div>
        <div
          @click="$router.push('/comment')"
          class="button">
          <span>订单评价</span>
        </div>
        <div
          @click="$router.push('/re_comment')"
          class="button">
          <span>追加评价</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {}
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
