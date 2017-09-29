<!--
---- 从底部弹出的对话框
--->
<template>
  <div class="choose-address" v-if="isShow" @click.self="close(bgEvent)">
    <div class="choose-address-content" :style="style">
      <div
        v-if="title"
        class="choose-address-content-title">
        <span>{{ title }}</span>
      </div>
      <div class="address-list">
        <div class="address-item" v-for="item in addressItem">
          <div class="iconfont icon-left">&#xe606;</div>
          <div class="content">
            <div class="concat">杨陈鹏 13123144888</div>
            <div class="address-detail">[默认]四川省成都市武侯区创业了49号,吧啦吧啦吧啦吧啦</div>
          </div>
          <div class="icon-right">
            <div class="iconfont edit" @click="showInputItems = true">&#xe67b;</div>
            <div class="iconfont delete">&#xe68c;</div>
          </div>
        </div>
      </div>
      <div class="choose-address-buttons">
        <div class="button"
             v-for="button in selfButtons"
             :style="button.style?button.style:{}"
             @click="buttonEvents(button.id,button.is_close)">
          <span>{{button.text}}</span>
        </div>
      </div>
    </div>
    <input-items
      :show="showInputItems"
      :inputs-item="inputsItem"
      :bg-event="true"
      title="编辑收货信息"
      @submit="addressInfo"
      @click-area="showDistpicker = true"
      @close="result => showInputItems = result"
    ></input-items>
    <weui-distpicker
      :province="510000"
      :city="510100"
      :area="510104"
      @change="changeDistpicker"
      @cancel="showDistpicker = false"
      @confirm="showDistpicker = false"
      v-if="showDistpicker"
    ></weui-distpicker>
  </div>
</template>
<script>
  import weuiDistpicker from 'weui-distpicker'
  import inputItems from '@components/inputItems.vue'
  export default {
    components: {
      inputItems,
      weuiDistpicker
    },
    name: 'chooseAddress',
    props: ['show', 'title', 'addressItem', 'buttons', 'bgEvent'],
    data () {
      return {
        showDistpicker: false,
        style: {
          bottom: '-23.5rem'
        },
        selfButtons: [
          {text: '关闭'}
        ],
        area: {
          province: {},
          city: {},
          county: {}
        },
        isShow: false,
        showInputItems: false, // 是否显示添加车辆信息弹出层
        inputsItem: [
          {
            id: 'concat-name',
            name: '收货人',
            type: 'text',
            value: '',
            placeholder: '请填写收货人',
            showIconRight: false,
            disabled: false
          },
          {
            id: 'concat-mobile',
            name: '联系电话',
            type: 'text',
            value: '',
            placeholder: '请填写联系电话',
            showIconRight: false,
            disabled: false
          },
          {
            id: 'area',
            name: '所在地区',
            type: 'text',
            value: '',
            placeholder: '请选择所在区域',
            showIconRight: true,
            disabled: true
          },
          {
            id: 'address',
            name: '详细地址',
            type: 'text',
            value: '',
            placeholder: '精确到门牌号',
            showIconRight: false,
            disabled: false
          }
        ]
      }
    },
    watch: {
      show (val) {
        if (!val) {
          this.style.bottom = '-23.5rem'
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
            this.style.bottom = '0rem'
          } else {
            this.style.bottom = '-23.5rem'
          }
        }, 50)
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
        this.style.bottom = '-23.5rem'
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
      },
      addressInfo (data) {
        console.log(data)
      },
      changeDistpicker (data) {
        console.log(data)
        this.inputsItem[2].value =
          data[0].label + ' ' + data[1].label + ' ' + data[2].label
      }
    },
    mounted () {
      this.isShow = this.show
      if (typeof this.buttons !== 'undefined' && this.buttons.length > 0) {
        this.selfButtons = this.buttons
      }
    }
  }
</script>
<style scoped lang="stylus">
  @import '../../assets/styl/function.styl'
  .choose-address
    position fixed
    width 100%
    height 100%
    background-color rgba(0,0,0,0.5)
    top 0
    left 0
    .choose-address-content
      width 100%
      max-height 23.5rem
      position absolute
      bottom -23.5rem
      left 0
      background-color #ffffff
      transition bottom .3s
      .choose-address-content-title
        width 100%
        height 3rem
        display flex
        justify-content center
        align-items center
        border-bottom 1px solid #e9e9e9
        > span
          font-size 1.2rem
      .address-list
        width calc(100% - 2rem)
        max-height 17.5rem
        padding 0 1rem
        overflow-y auto
        text-overflow ellipsis
        -webkit-overflow-scrolling touch
        overflow-scrolling touch
        .address-item
          width 100%
          height 3.5rem
          border-bottom 1px solid #e9e9e9
          display flex
          &:last-child
            border-bottom none
          .icon-left
            width 2rem
            height @height
            display flex
            align-items center
            color #249af9
          .content
            flex 1
            height @height
            display flex
            flex-direction column
            justify-content center
            .concat
              font-size 1rem
              color #333333
            .address-detail
              text-overflow(1)
              font-size 0.9rem
              line-height 1rem
              color #999999
          .icon-right
            width 5rem
            height @height
            display flex
            align-items center
            .edit,.delete
              width 2.5rem
              height 1.5rem
              font-size 1.5rem
              text-align center
              opacity 1
              &:active
                opacity 0.7
            .edit
              border-right 1px solid #e9e9e9
              color #249af9
            .delete
              color #999999
      .choose-address-buttons
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
