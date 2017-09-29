<template>
  <div class="body">
    <div class="body-content">
      <template
        v-for="item in items">
        <div
          :class="['item',item.open?'open':'']"
          @click="item.open = !item.open">
          <div class="item-title">
            <div class="icon"></div>
            <div class="title">
              关于找货
            </div>
            <div class="iconfont icon-right right">&#xe608;</div>
            <div class="iconfont icon-right down">&#xe610;</div>
          </div>
          <transition name="fade">
            <div
              v-show="item.open"
              class="item-content">
              <div class="question-item" v-for="i in 5">
                <div class="question">
                  {{i}}、问: 我下单了,谁给我发货
                </div>
                <div class="answer">
                  答: 卖家会根据您下单时填写的装车信息（卖家找车/买家找车）把货物装到物流车上，然后由物流司机负责给您送货。
                </div>
              </div>
            </div>
          </transition>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'help',
    data () {
      return {
        items: [
          {open: false},
          {open: false},
          {open: false},
          {open: false},
          {open: false},
          {open: false},
          {open: false}
        ]
      }
    },
    methods: {
      click (e) {
        console.log(e)
      }
    }
  }
</script>
<style scoped lang="stylus" src="@styl/modules/help.styl"></style>
<style scoped lang="stylus">
  .fade-enter-active
    transition: opacity .5s
  .fade-enter
    opacity 0
</style>
