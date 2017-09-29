<template>
  <div
    class="load-more"
    ref="loadMore">
    <template v-if="haveData">
      <template v-if="baseline">
        <div class="baseline"></div>
        <div class="baseline-text">
          <div class="text">我是有底线的</div>
        </div>
      </template>
      <template v-else>
        <div class="iconfont icon">&#xe76a;</div>
        <div
          v-if="message"
          class="text">{{message}}</div>
      </template>
    </template>
    <template v-else>
      <div class="text">暂无数据</div>
    </template>
  </div>
</template>
<script>
  export default {
    props: {
      scroll: {
        default: null
      },
      message: {
        type: String,
        default: ''
      },
      disabled: {
        type: Boolean,
        default: false
      },
      baseline: {
        type: Boolean,
        default: false
      },
      haveData: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        height: 0,
        scrollDomHeight: 0
      }
    },
    watch: {
      scroll (dom) {
        this.scrollDomHeight = dom.clientHeight
        dom.addEventListener('scroll', this._scroll)
      }
    },
    methods: {
      _scroll (e) {
        if (this.disabled || this.baseline) {
          return false
        }
        let scrollHeight = e.target.scrollHeight
        let scrollTop = e.target.scrollTop
        let distance = scrollHeight - (scrollTop + this.scrollDomHeight)
        if (distance <= (this.height * 1.5)) {
          this.$emit('load-more')
        }
      }
    },
    mounted () {
      this.height = this.$refs.loadMore.clientHeight
    }
  }
</script>
<style scoped lang="stylus">
  .load-more
    width 100%
    height 3rem
    background-color #eeeeee
    display flex
    align-items center
    justify-content center
    position relative
    .baseline
      width 90%
      height 1px
      background-color #dddddd
    .baseline-text
      width 100%
      height 100%
      position absolute
      top: 0
      left: 0
      display flex
      justify-content center
      align-items center
      background-color transparent
      >.text
        font-size .8rem
        color #cccccc
        background-color #eeeeee
    &.hidden
      visibility hidden
    .icon
      width 2rem
      height 2rem
      font-size 1rem
      display flex
      justify-content center
      align-items center
      color #999999
      animation: loading 1s infinite;
      -webkit-animation: loading 1s infinite;
    .text
      max-width 8rem
      height 2rem
      display flex
      justify-content center
      align-items center
      color #999999
      font-size .8rem
  @keyframes loading
    0%
      transform rotate(0deg)
      -webkit-transform rotate(0deg)
    100%
      transform rotate(360deg)
      -webkit-transform rotate(360deg)
  @-webkit-keyframes loading
    0%
      transform rotate(0deg)
      -webkit-transform rotate(0deg)
    100%
      transform rotate(360deg)
      -webkit-transform rotate(360deg)
</style>
