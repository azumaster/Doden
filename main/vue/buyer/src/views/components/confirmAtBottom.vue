<!--
---- 从底部弹出的对话框
--->
<template>
  <div class="confirm-at-bottom" v-if="isShow" @click.self="close(bgEvent)">
    <div class="confirm-at-bottom-content" :style="contentStyle">
      <div
        v-if="title"
        class="confirm-at-bottom-content-title">
        <span>{{ title }}</span>
      </div>
      <div
        class="confirm-at-bottom-content-desc">{{message}}</div>
      <div class="confirm-at-bottom-content-buttons">
        <div class="button"
             v-for="button in _buttons"
              :style="button.style?button.style:{}"
              @click="buttonEvents(button.id,button.is_close)">
          <span>{{button.text}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'confirmAtBottom',
    props: ['show', 'title', 'message', 'buttons', 'bgEvent'],
    data () {
      return {
        contentStyle: {
          bottom: '-15rem'
        },
        _buttons: [
          {text: '关闭'}
        ],
        isShow: false
      }
    },
    watch: {
      show (val) {
        if (!val) {
          this.style.bottom = '-15rem'
          setTimeout(() => {
            this.isShow = val
          }, 50)
        } else {
          this.isShow = val
        }
      },
      isShow (val) {
        setTimeout(() => {
          if (val) {
            this.contentStyle.bottom = '0rem'
          } else {
            this.contentStyle.bottom = '-15rem'
          }
        }, 50)
      },
      buttons (val) {
        if (val.length > 0) {
          this._buttons = val
        }
      }
    },
    methods: {
      /**
       *  组件内关闭并通知父组件
       */
      close (bgEvent = false) {
        if (bgEvent) {
          return false
        }
        this.contentStyle.bottom = '-15rem'
        setTimeout(() => {
          this.$emit('close', false)
        }, 50)
        return false
      },
      /**
       *  按钮事件通知父组件
       */
      buttonEvents (buttonId, isClose = false) {
        /**
         * 如果没有传ID,则默认为关闭
         */
        if (!buttonId) {
          this.close()
          return false
        }
        // 通知父组件
        this.$emit(buttonId, buttonId)
        // 是否关闭
        if (isClose) {
          this.close()
        }
      }
    },
    mounted () {
      this.isShow = this.show
      if (typeof this.buttons !== 'undefined' && this.buttons.length > 0) {
        this._buttons = this.buttons
      }
    }
  }
</script>
<style scoped lang="stylus">
  .confirm-at-bottom
    position fixed
    width 100%
    height 100%
    background-color rgba(0,0,0,0.5)
    top 0
    left 0
    .confirm-at-bottom-content
      width 100%
      max-height 15rem
      position absolute
      bottom 0
      left 0
      background-color #ffffff
      display flex
      flex-direction column
      align-items center
      transition bottom .5s
      .confirm-at-bottom-content-title
        width 100%
        height 3rem
        display flex
        justify-content center
        align-items center
        > span
          font-size 1.3rem
      .confirm-at-bottom-content-desc
        font-size: 1rem
        width 90%
        max-height 9rem
        overflow-y auto
        overflow-scrolling touch
        padding 1rem 0
        text-align center
        line-height 1.2rem
      .confirm-at-bottom-content-buttons
        width: 100%;
        height: 3rem;
        border-top 1px solid #efefef
        display flex
        flex-direction row
        .button
          flex 1
          height 100%
          display flex
          justify-content center
          align-items center
          opacity 1
          &:active
            opacity 0.5

</style>
