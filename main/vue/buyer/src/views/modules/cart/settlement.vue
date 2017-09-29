<template>
  <div class="content">
    <!--<div class="content-head">-->
      <!--<div class="left"></div>-->
      <!--<div class="center">-->
        <!--<span>请确认订单</span>-->
      <!--</div>-->
      <!--<div-->
        <!--@click="$router.push('/help')"-->
        <!--class="right">-->
        <!--<span>帮助</span>-->
      <!--</div>-->
    <!--</div>-->
    <div
      @click="$router.push('/help')"
      class="help">帮助</div>
    <div class="content-body">
      <div class="hint">支付方式</div>
      <div class="list">
        <div v-waves class="item">
          <div class="item-content">
            <div class="item-content-box">
              <div class="iconfont icon active">
                <span>&#xe670;</span>
                <span class="active">&#xe7c0;</span>
              </div>
              <div class="text">在线支付</div>
            </div>
          </div>
        </div>
        <div v-waves class="item">
          <div class="item-content">
            <div class="item-content-box child">
              <div class="iconfont icon">
                <span>&#xe670;</span>
                <span class="active">&#xe7c0;</span>
              </div>
              <div class="text">微信支付</div>
              <div class="hint">查看余额</div>
            </div>
          </div>
        </div>
        <div v-waves class="item">
          <div class="item-content">
            <div class="item-content-box child">
              <div class="iconfont icon active">
                <span>&#xe670;</span>
                <span class="active">&#xe7c0;</span>
              </div>
              <div class="text">银行卡快捷支付</div>
              <div class="hint">查看余额</div>
            </div>
          </div>
        </div>
        <div v-waves class="item">
          <div class="item-content">
            <div class="item-content-box">
              <div class="iconfont icon">
                <span>&#xe670;</span>
                <span class="active">&#xe7c0;</span>
              </div>
              <div class="text">
                <span>集采后支付</span>
                <span class="sub">(什么是集采)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="hint">收货方式</div>
      <div class="list">
        <div class="item">
          <div class="item-content">
            <div class="item-content-box">
              <div
                @click="logisticsMode = 2"
                :class="['iconfont', 'icon',logisticsMode === 2?'active':'']">
                <span>&#xe670;</span>
                <span class="active">&#xe7c0;</span>
              </div>
              <div
                @click="logisticsMode = 2"
                class="text">买家找车</div>
            </div>
            <div class="item-content-box">
              <div
                @click="logisticsMode = 3"
                :class="['iconfont', 'icon',logisticsMode === 3?'active':'']">
                <span>&#xe670;</span>
                <span class="active">&#xe7c0;</span>
              </div>
              <div
                @click="logisticsMode = 3"
                class="text">
                <span>卖家找车</span>
              </div>
            </div>
          </div>
        </div>
        <template v-if="logisticsMode === 2">
          <div class="item" @click="showInputItems = true">
            <div class="item-content">
              <div class="item-content-box child">
                <div class="text">四川省成都市海霸王市场</div>
                <div class="hint">请输入车辆信息</div>
                <div class="iconfont icon-right">&#xe67b;</div>
              </div>
            </div>
          </div>
          <div class="item">
            <div class="item-content">
              <div class="item-content-box child">
                <div
                  class="text"
                  style="font-size: 0.9rem;color: #999;">司机电话</div>
                <div class="hint">13123144888</div>
              </div>
            </div>
          </div>
          <div class="item">
            <div class="item-content">
              <div class="item-content-box child">
                <div
                  class="text"
                  style="font-size: 0.9rem;color: #999;">车牌号码</div>
                <div class="hint">川A888888</div>
              </div>
            </div>
          </div>
          <div class="item">
            <div class="item-content">
              <div class="item-content-box child">
                <div
                  class="text"
                  style="font-size: 0.9rem;color: #999;">装货位置</div>
                <div class="hint">冻库C2门口</div>
              </div>
            </div>
          </div>
          <div class="item">
            <div class="item-content">
              <div class="item-content-box child">
                <div
                  class="text"
                  style="font-size: 0.9rem;color: #999;">装车时间</div>
                <div class="hint">2017-09-16 9:00</div>
              </div>
            </div>
          </div>
          <div class="item" @click="showInputItems = true">
            <div class="item-content">
              <div class="item-content-box child">
                <div class="text">四川省成都市青白江市场</div>
                <div class="hint">请输入车辆信息</div>
                <div class="iconfont icon-right">&#xe67b;</div>
              </div>
            </div>
          </div>
          <div class="item">
            <div class="item-content">
              <div class="item-content-box child">
                <div
                  class="text"
                  style="font-size: 0.9rem;color: #999;">司机电话</div>
                <div class="hint">13123144888</div>
              </div>
            </div>
          </div>
          <div class="item">
            <div class="item-content">
              <div class="item-content-box child">
                <div
                  class="text"
                  style="font-size: 0.9rem;color: #999;">车牌号码</div>
                <div class="hint">川A888888</div>
              </div>
            </div>
          </div>
          <div class="item">
            <div class="item-content">
              <div class="item-content-box child">
                <div
                  class="text"
                  style="font-size: 0.9rem;color: #999;">装货位置</div>
                <div class="hint">冻库C2门口</div>
              </div>
            </div>
          </div>
          <div class="item">
            <div class="item-content">
              <div class="item-content-box child">
                <div
                  class="text"
                  style="font-size: 0.9rem;color: #999;">装车时间</div>
                <div class="hint">2017-09-16 9:00</div>
              </div>
            </div>
          </div>
        </template>
        <template v-if="logisticsMode === 3">
          <div
            v-waves
            class="logistics-item"
            @click="showChooseAddress = true">
            <div class="iconfont icon">&#xe60c;</div>
            <div class="content">
              <div class="concat">
                杨陈鹏  13123144888
              </div>
              <div class="address-detail">
                四川省 成都市 成都市 武侯区创业路49号 火炬大厦对面,火炬大厦对面,火炬大厦对面,火炬大厦对面
              </div>
            </div>
            <div class="iconfont icon-right">&#xe625;</div>
          </div>
        </template>
      </div>
    </div>
    <div class="content-footer">
      <div class="pay-info">
        <div class="pay-total">
          <span>合计: </span>
          <span class="price">190.00元</span>
        </div>
        <div class="desc">
          <span>(不含运费)</span>
        </div>
      </div>
      <div class="pay-button">
        <span>去支付</span>
      </div>
    </div>
    <input-items
    :show="showInputItems"
    :inputs-item="inputsItem"
    :bg-event="true"
    @submit="getCartInfo"
    @close="result => showInputItems = result"
    ></input-items>
    <choose-address
      :show="showChooseAddress"
      :address-item="addressItem"
      :bg-event="false"
      title="请选择收货地址"
      @data="r => address = r"
      @close="result => showChooseAddress = result"
    ></choose-address>
  </div>
</template>
<script>
  import inputItems from '@components/inputItems.vue'
  import chooseAddress from '@components/chooseAddress'
  export default {
    components: {
      inputItems,
      chooseAddress
    },
    data () {
      return {
        showInputItems: false, // 是否显示添加车辆信息弹出层
        inputsItem: [
          {
            id: 'mobile',
            name: '司机电话',
            type: 'text',
            value: '',
            placeholder: '请填写司机联系电话',
            disabled: false
          },
          {
            id: 'cart-number',
            name: '车牌号码',
            type: 'text',
            value: '',
            placeholder: '请填写车牌号码',
            disabled: false
          },
          {
            id: 'location',
            name: '装货位置',
            type: 'text',
            value: '',
            placeholder: '请填写车辆停放位置',
            disabled: false
          },
          {
            id: 'time',
            name: '装车时间',
            type: 'datetime-local',
            value: '',
            placeholder: '请选择获取装车时间',
            disabled: false,
            style: {
              textAlign: 'right',
              direction: 'rtl'
            }
          }
        ],
        logisticsMode: 3, // 物流方式，1未选择,2买家找车,3卖家找车
        showChooseAddress: false, // 是否显示选择收货地址弹出层
        address: {},
        addressItem: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
      }
    },
    methods: {
      getCartInfo (data) {
        this.showInputItems = false
        console.log('data:', data)
      }
    }
  }
</script>
<style
  scoped
  lang="stylus"
  src="@styl/modules/cart/settlement.styl"></style>
