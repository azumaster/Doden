<template>
  <div class="input-items" v-if="isShow" @click.self="close(bgEvent)">
    <div class="input-items-content":style="style">
      <div
        v-if="title"
        class="title">
        <span>{{title}}</span>
      </div>
      <div>
        <template v-for="input in selfInputsItems">
          <div
            @click="itemClickEvent(input.id,input.disabled)"
            :class="['item',input.disabled?'click-effect':'']">
            <div class="item-name">
              <span>{{input.name}}</span>
            </div>
            <div class="item-input">
              <input
                v-if="input.type === 'text'"
                v-model.trim="input.value"
                :disabled="input.disabled ? 'disabled' : false"
                type="text"
                :style="input.style?input.style:{}"
                :placeholder="input.placeholder ?input.placeholder:''" />

              <input
                v-if="input.type === 'datetime-local'"
                :value="input.value"
                v-model="input.value"
                :disabled="input.disabled ? 'disabled' : false"
                type="text"
                ontouchstart="(this.type='datetime-local')"
                :style="input.style?input.style:{}"
                :placeholder="input.placeholder ?input.placeholder:''" />

              <input
                v-if="input.type === 'date'"
                :value="input.value"
                v-model="input.value"
                :disabled="input.disabled ? 'disabled' : false"
                type="date"
                :style="input.style?input.style:{}"
                :placeholder="input.placeholder ?input.placeholder:''" />

              <input
                v-if="input.type === 'month'"
                :value="input.value"
                v-model="input.value"
                :disabled="input.disabled ? 'disabled' : false"
                type="month"
                :style="input.style?input.style:{}"
                :placeholder="input.placeholder ?input.placeholder:''" />

              <input
                v-if="input.type === 'week'"
                :value="input.value"
                v-model="input.value"
                :disabled="input.disabled ? 'disabled' : false"
                type="week"
                :style="input.style?input.style:{}"
                :placeholder="input.placeholder ?input.placeholder:''" />

              <input
                v-if="input.type === 'time'"
                :value="input.value"
                v-model="input.value"
                :disabled="input.disabled ? 'disabled' : false"
                type="time"
                :style="input.style?input.style:{}"
                :placeholder="input.placeholder ?input.placeholder:''" />

              <input
                v-if="input.type === 'number'"
                v-model.trim="input.value"
                :disabled="input.disabled ? 'disabled' : false"
                type="number"
                :style="input.style?input.style:{}"
                :placeholder="input.placeholder ?input.placeholder:''" />

              <input
                v-if="input.type === 'tel'"
                v-model.trim="input.value"
                :disabled="input.disabled ? 'disabled' : false"
                type="tel"
                :style="input.style?input.style:{}"
                :placeholder="input.placeholder ?input.placeholder:''" />

              <input
                v-if="input.type === 'color'"
                v-model.trim="input.value"
                :disabled="input.disabled ? 'disabled' : false"
                type="color"
                :style="input.style?input.style:{}"
                :placeholder="input.placeholder ?input.placeholder:''" />

              <input
                v-if="input.type === 'search'"
                v-model.trim="input.value"
                :disabled="input.disabled ? 'disabled' : false"
                type="search"
                :style="input.style?input.style:{}"
                :placeholder="input.placeholder ?input.placeholder:''" />

              <input
                v-if="input.type === 'url'"
                v-model.trim="input.value"
                :disabled="input.disabled ? 'disabled' : false"
                type="url"
                :style="input.style?input.style:{}"
                :placeholder="input.placeholder ?input.placeholder:''" />

              <input
                v-if="input.type === 'email'"
                v-model.trim="input.value"
                :disabled="input.disabled ? 'disabled' : false"
                type="email"
                :style="input.style?input.style:{}"
                :placeholder="input.placeholder ?input.placeholder:''" />
            </div>
            <div
              v-if="input.showIconRight"
              class="iconfont item-icon-right">&#xe625;</div>
          </div>
        </template>
      </div>
      <div class="buttons">
        <div class="button"
             v-for="button in selfButtons"
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
    name: 'inputItems',
    props: ['title', 'show', 'inputsItem', 'bgEvent'],
    data () {
      return {
        test: '',
        style: {
          bottom: '-80%'
        },
        selfInputsItems: [],
        selfButtons: [
          {
            text: '关闭'
          },
          {
            id: 'submit',
            text: '保存',
            is_close: false,
            style: {
              backgroundColor: '#249af9',
              color: '#ffffff'
            }
          }
        ],
        isShow: false
      }
    },
    watch: {
      show (val) {
        if (!val) {
          this.style.bottom = '-80%'
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
            this.style.bottom = '0'
          } else {
            this.style.bottom = '-80%'
          }
        }, 50)
        return val
      },
      buttons (val) {
        if (val.length > 0) {
          this.selfButtons = val
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
        this.style.bottom = '-80%'
        setTimeout(() => {
          this.isShow = false
          this.$emit('close', false)
        }, 50)
        return false
      },
      itemClickEvent (buttonId, isEvent = false) {
        console.log(buttonId)
        if (!isEvent) {
          return false
        }
        this.$emit('click-' + buttonId, buttonId)
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
        if (buttonId === 'submit') {
          let data = []
          for (let i in this.selfInputsItems) {
            data.push({
              id: this.selfInputsItems[i].id,
              value: this.selfInputsItems[i].value
            })
          }
          this.$emit(buttonId, this.selfInputsItems)
        } else {
          this.$emit(buttonId, buttonId)
        }
        // 是否关闭
        if (isClose) {
          this.close()
        }
      }
    },
    mounted () {
      if (!this.inputsItem || this.inputsItem.length < 1) {
        throw new Error('data [inputsItem] is undefined or empty ')
      }
      this.selfInputsItems = this.inputsItem
      this.isShow = this.show
//      if (typeof this.buttons !== 'undefined' && this.buttons.length > 0) {
//        this.selfButtons = this.buttons
//      }
    }
  }
</script>
<style scoped lang="stylus">
  @import "../../assets/styl/function.styl"
  .input-items
    position fixed
    width 100%
    height 100%
    background-color rgba(0,0,0,0.5)
    top 0
    left 0
    .input-items-content
      width 100%
      max-height 80%
      position absolute
      bottom 0
      left 0
      background-color #ffffff
      overflow-y auto
      overflow-scrolling touch
      -webkit-overflow-scrolling touch
      flex-direction column
      align-items center
      transition bottom .3s
      .title
        width @width
        height 3rem
        background-color #ffffff
        display flex
        justify-content center
        align-items center
        border-bottom 1px solid #e9e9e9
        >span
          font-size 1rem
          color #333
      .item
        width calc(100% - 2rem)
        height 3rem
        background-color #ffffff
        border-bottom 1px solid #e9e9e9
        margin-left 1rem
        display flex
        align-items center
        &:last-child
          border-bottom none
        .item-name
          width 6rem
          flex-row-vertical-center()
          text-overflow(1)
          >span
            font-size 1rem
        .item-input
          flex 1
          display flex
          justify-content center
          align-items center
          input
            width 100%
            height 2rem
            font-size 0.9rem
            text-align right
        .item-icon-right
          width 1rem
          font-size 1rem
          color #999999
          display flex
          flex-direction row-reverse
          align-items center
      .buttons
        width: 100%;
        height: 3.5rem;
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
