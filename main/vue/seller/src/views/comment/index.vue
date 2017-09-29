<template>
  <div class="body" v-show="loaded">
    <div class="comment-box" v-for="(product, idx) in goods">
      <div class="goods-info">
        <div class="thumb">
          <img :src="image_base_uri + product.pic + '@150w_90Q'" alt="">
        </div>
        <div class="info">
          <div class="title">{{product.name}}</div>
          <div class="price">
            {{product.price}}元*{{product.buy_num}}{{product.meter_unit}}={{product.total_price}}元
          </div>
        </div>
      </div>
      <div class="tools">
        <div
          v-for="(item,key) in product.info.evaluation"
          :class="['button',product.info.evaluationStatus == key?'active':'']"
          @click="product.info.evaluationStatus = key">{{item}}
        </div>
        <div class="upload-picture" @click="uploadImage(idx)">
          <i class="iconfont icon-paizhao"></i>
        </div>
      </div>
      <div class="comment-text-area">
        <textarea v-model="product.info.content" placeholder="请在此评价商品(100字以内)"></textarea>
      </div>
      <div class="upload-img">
        <div class="img" v-for="(img,idx) in product.info.images">
          <img :src="img.localId" alt="">
          <div class="remove" @click="product.info.images.splice(idx,1)">×</div>
        </div>
      </div>
    </div>
    <div class="service">
      <div class="service-box">
        <div class="service-title">发货速度</div>
        <div class="service-items">
          <div
            v-for="(item, key) in deliverySpeed.speed"
            :class="['service-item', key == deliverySpeed.status ? 'active' : '']"
            @click="deliverySpeed.status = key">{{ item }}
          </div>
        </div>
      </div>
      <div class="service-box">
        <div class="service-title">服务态度</div>
        <div class="service-items">
          <div v-for="(item, key) in service.speed"
               :class="['service-item', key == service.status ? 'active' :'']"
               @click="service.status = key"
          >{{ item }}
          </div>
        </div>
      </div>
    </div>
    <div class="submit" @click="submit">提交</div>
    <div class="notice">评价会影响卖家的信誉度,也是其他买家的重要参考</div>
    <ui-confirm-at-bottom
      :title="confirmAtBottomData.title"
      :message="confirmAtBottomData.message"
      :buttons="confirmAtBottomData.buttons"
      :show="showConfirmAtBottom"
      @goBack="goBack"
      @continue="_continue"
    @close="res => showConfirmAtBottom = res"></ui-confirm-at-bottom>
  </div>
</template>
<script>
  import weChatSDK from '../../vendor/weChatJsSDK/jweixin-1.2.0'
  import confirmAtBottom from '../components/confirmAtBottom.vue'
  export default {
    name: 'submitComment',
    components: {
      'ui-confirm-at-bottom': confirmAtBottom
    },
    data () {
      return {
        confirmAtBottomData: {
          title: '评价成功',
          message: '',
          buttons: [
            {id: 'goBack', text: '返回', is_close: true},
            {id: 'continue', text: '再评一单', is_close: true}
          ]
        },
        showConfirmAtBottom: false,
        loaded: false,
        image_base_uri: this.$tool.common.getConfig('AliOssPictureCdn'),
        deliverySpeed: {
          status: '',
          speed: {
            '1': '龟速',
            '2': '较慢',
            '3': '一般',
            '4': '及时',
            '5': '神速'
          }
        },
        service: {
          status: '',
          speed: {
            '1': '冷漠',
            '2': '冷淡',
            '3': '一般',
            '4': '友善',
            '5': '热情'
          }
        },
        goods: [],
        order_no: '',
        weChatApiList: [
          'chooseImage',
          'uploadImage'
        ],
        next_order_no: '',
        localIds: []
      }
    },
    methods: {
      // 返回上一页
      goBack () {
        window.history.go(-1)
      },
      // 在评价一单
      _continue () {
//        this.$tool.common.showLoading()
//        let url = window.location.href
//        url = url.split('#')
//        window.location.href = url[0] + '#' + this.next_order_no
        this.order_no = this.next_order_no
        this.deliverySpeed.status = ''
        this.service.status = ''
        this.$tool.common.showLoading()
        this.getData()
      },
      /**
       *  提交数据
       */
      submit () {
        // 组装数据
        let data = {}
        data.goods_appraises = []
        data.shop_appraises = {}
        let evaluation = {
          'praise': '5',
          'commonly': '3',
          'bad': '1'
        }
        for (let i in this.goods) {
          if (this.goods[i].info.evaluationStatus === '') {
            this.$tool.common.toast('还有商品没点评哦')
            return false
          }
          let goodsAppraises = {}
          goodsAppraises.goods_id = this.goods[i].goods_id
          goodsAppraises.img = this.goods[i].info.images
          goodsAppraises.content = this.goods[i].info.content
          goodsAppraises.quality = evaluation[this.goods[i].info.evaluationStatus]
          data.goods_appraises.push(goodsAppraises)
        }
        if (this.deliverySpeed.status === '') {
          this.$tool.common.toast('为了能够给您带来更好的服务,请点评一下发货速度')
          return false
        }
        if (this.service.status === '') {
          this.$tool.common.toast('为了能够给您带来更好的服务,请点评一下商家服务态度')
          return false
        }
        data.shop_appraises.delivery_speed = this.deliverySpeed.status
        data.shop_appraises.sell_service = this.service.status
        data.sub_order_no = this.order_no
        this.$tool.common.showLoading()
        this.$model.comments.createOrderComment(data)
          .then(r => {
            if (parseInt(r.code) === 0) {
              this.confirmAtBottomData.message = `本次评论获得${r.data.reward}个积分`
              this.next_order_no = r.data.next_order_no
              if (!this.next_order_no) {
                this.confirmAtBottomData.buttons.pop()
              }
              // 必须写在confirmAtBottomData参数赋值之后
              this.showConfirmAtBottom = true
            }
          })
      },
      /**
       * 获取订单数据
       */
      getData () {
        this.$model.comments.allGoodsOnOrder(this.order_no).then(r => {
          for (let i in r.data) {
            r.data[i].info = {
              evaluationStatus: '',
              evaluation: {
                'praise': '好评',
                'commonly': '中评',
                'bad': '差评'
              },
              images: [],
              content: ''
            }
          }
          this.goods = r.data
          this.loaded = true
        })
      },
      // 获取微信jsSDK 签名配置
      weChatConfig () {
        this.$model.comments.jsSdkConfig(window.location.href)
          .then(r => {
            let signInfo = r.signPackage
            weChatSDK.config({
              debug: false,
              appId: signInfo.appId,
              timestamp: signInfo.timestamp,
              nonceStr: signInfo.nonceStr,
              signature: signInfo.signature,
              jsApiList: this.weChatApiList
            })
          })
          .catch(e => {

          })
      },
      /**
       * 上传图片
       * @param idx 商品索引
       */
      uploadImage (idx) {
        // 获取剩余可传图片数量
        let _this = this
        let count = (5 - this.goods[idx].info.images.length)
        if (count <= 0) {
          this.$tool.common.toast('一个商品最多可传5张图片')
          return false
        }
        weChatSDK.chooseImage({
          count: count,
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {
            _this.localIds = res.localIds // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
            _this.upload(idx)
          }
        })
      },
      upload (idx) {
        if (this.localIds.length < 1) {
          return false
        }
        let _this = this
        let localId = this.localIds.shift()
        weChatSDK.uploadImage({
          localId: localId, // 需要上传的图片的本地ID，由chooseImage接口获得
          isShowProgressTips: 1, // 默认为1，显示进度提示
          success: function (res) {
            _this.goods[idx].info.images.push({
              picture_add: res.serverId,
              localId: localId
            })
            _this.upload(idx)
          }
        })
      }
    },
    // 初始化数据
    created () {
      // 获取微信配置
      this.weChatConfig()
      // Begin->订单号暂时从URL中获取,通过#分割
      let url = window.location.href
      url = url.split('#')
      this.order_no = url[1]
      // End
      // 获取订单数据
      this.getData()
    }
  }
</script>
<style
  scoped
  lang="stylus"
  src="@/assets/styl/modules/comment/index.styl"></style>
