<template>
  <div class="cart-box">
    <div class="cart-title">
      <div class="left"></div>
      <div class="center">
        <span>{{edit?'请选择要删除的商品':'购物车'}}</span>
      </div>
      <div class="right" @click="_edit()">
        <span>{{edit?'完成':'编辑'}}</span>
      </div>
    </div>
    <div class="cart-content scroll">
      <template v-if="!productData.length">
        <div class="not-product">
          <div class="img">
            <img src="/static/images/cart-not-product.png" alt="">
          </div>
          <div class="not-product-desc">
            购物车尽然是空的,去商城看看吧!!
          </div>
        </div>
      </template>
      <template v-for="(item, idx) in productData">
        <div class="goods-list">
          <div class="shop-name">
            <div
              :class="['iconfont','get-all',item.select?'active':'']"
              @click="shopSelect(idx)">
              <span>&#xe670;</span>
              <span class="active">&#xe7c0;</span>
            </div>
            <div class="shop-name-text">
              {{ item.shop_name }}
            </div>
          </div>
          <template v-for="(product,index) in item.products">
            <div class="goods-item">
              <div v-if="!product.effective && !edit" class="can-not-action"></div>
              <div
                :class="['iconfont','select-checkbox',product.select?'active':'']"
                @click="productSelect(idx,index)">
                <span>&#xe670;</span>
                <span class="active">&#xe7c0;</span>
              </div>
              <div class="thumb"></div>
              <div class="goods-data">
                <div class="title">{{product.name}}</div>
                <div class="action-bar">
                  <div class="price">￥{{(product.price * product.nums).toFixed(2)}}元</div>
                  <div class="sum-total">
                    <div
                      class="left"
                      @click="increase(idx,index)">
                      <span>﹢</span>
                    </div>
                    <div class="center">
                      <span>{{product.nums}}</span>
                    </div>
                    <div
                      class="right"
                      @click="reduce(idx, index)">
                      <span>﹣</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </template>
    </div>
    <div class="cart-toolbar">
      <div
        :class="['iconfont','cart-select-all',selectAll ? 'active' :'']"
      @click="_selectAll(!selectAll)">
        <span>&#xe670;</span>
        <span class="active">&#xe7c0;</span>
        <div class="get-all-text">全选</div>
      </div>
      <div class="cart-toolbar-content">
        <template v-if="!edit">
          <div class="real-total">
            <span class="sub">(不含运费)</span>
            <span>
            合计: <span style="color: red;">￥{{totalPrice.toFixed(2)}}元</span>
          </span>
          </div>
          <div class="total">
          <span>
            总额: {{totalPrice.toFixed(2)}}元 优惠0元
          </span>
          </div>
        </template>
        <template v-else>
          <div class="add-to-collection">
            <span>加入常购</span>
          </div>
        </template>
      </div>
      <div class="cart-go-pay" @click="pay">
        <span>{{edit?'删除':'结算'}}</span>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        selectAll: false,
        totalPrice: 0,
        edit: false, // 编辑模式
        productData: [
          {
            select: false,
            shop_name: '四川省成都市海霸王市场',
            products: [
              {
                select: false,
                thumb: '',
                name: '渝达鸭肠16kg渝达鸭肠16kg渝达鸭肠16kg',
                price: 100.00,
                nums: 5,
                effective: true
              },
              {
                select: false,
                thumb: '',
                name: '渝达鸭肠16kg渝达鸭肠16kg渝达鸭肠16kg',
                price: 100.00,
                nums: 5,
                effective: true
              }
            ]
          },
          {
            select: false,
            shop_name: '四川省成都市海霸王市场1',
            products: [
              {
                select: false,
                thumb: '',
                name: '渝达鸭肠16kg渝达鸭肠16kg渝达鸭肠16kg1',
                price: 100.00,
                nums: 5,
                effective: true
              }
            ]
          },
          {
            select: false,
            shop_name: '四川省成都市海霸王市场3',
            products: [
              {
                select: false,
                thumb: '',
                name: '渝达鸭肠16kg渝达鸭肠16kg渝达鸭肠16kg3',
                price: 100.00,
                nums: 5,
                effective: false
              },
              {
                select: false,
                thumb: '',
                name: '渝达鸭肠16kg渝达鸭肠16kg渝达鸭肠16kg3',
                price: 100.00,
                nums: 5,
                effective: false
              },
              {
                select: false,
                thumb: '',
                name: '渝达鸭肠16kg渝达鸭肠16kg渝达鸭肠16kg1',
                price: 100.00,
                nums: 5,
                effective: true
              }
            ]
          }
        ]
      }
    },
    methods: {
      /**
       * 去支付/删除
       */
      pay () {
        // 编辑模式,当前操作为删除商品
        if (this.edit) {
          this.$tool.common.confirm({
            content: '确定删除所选商品吗,删除之后不可恢复',
            okBtn: '确定',
            cancelBtn: '关闭',
            title: '警告'
          }, () => {
            this.productData =
              this.productData.filter((val, key) => {
                if (val.select) {
                  return !val.select
                }
                this.productData[key].products =
                  this.productData[key].products.filter((val) => {
                    return !val.select
                  })
                return true
              })
            this.watchData()
          })
        } else { // 非编辑模式
          this.$router.push('/settlement')
        }
      },
      /**
       * 编辑
       */
      _edit () {
        this.edit = !this.edit
        if (this.edit) {
          return false
        }
        for (let i in this.productData) {
          for (let idx in this.productData[i].products) {
            if (!this.productData[i].products[idx].effective) {
              this.productData[i].products[idx].select = false
            }
          }
        }
      },
      /**
       * 减少一个商品数量
       */
      reduce (idx, index) {
        let nums = this.productData[idx].products[index].nums
        if (nums < 1) {
          this.$tool.common.toast('不能再减了')
          return false
        } else if (nums === 1) {
          this.$tool.common.confirm({
            content: '你确定要删除该商品吗?',
            okBtn: '确定',
            cancelBtn: '关闭',
            title: '提示'
          }, () => {
            this.productData[idx].products.splice(index, 1)
            this.watchData()
          })
        } else {
          --this.productData[idx].products[index].nums
          this.watchData()
        }
      },
      /**
       * 商品增加一个数量
       */
      increase (idx, index) {
        ++this.productData[idx].products[index].nums
        this.watchData()
      },
      /**
       *  全选/全不选
       */
      _selectAll (val) {
        for (let item in this.productData) {
          this.productData[item].select = val
          for (let product in this.productData[item].products) {
            if (
              !this.productData[item].products[product].effective &&
              !this.edit) {
              continue
            }
            this.productData[item].products[product].select = val
          }
        }
        this.watchData()
      },
      /**
       * 店铺选中则该店铺下面的商品全部选中,反之同理
       * @param idx
       */
      shopSelect (idx) {
        let select = !this.productData[idx].select
        this.productData[idx].select = select
        for (let i in this.productData[idx].products) {
          if (!this.productData[idx].products[i].effective && !this.edit) {
            continue
          }
          this.productData[idx].products[i].select = select
        }
        this.watchData()
      },
      /**
       * 店铺下面商品选中
       * @param idx
       * @param index
       * @returns {boolean}
       */
      productSelect (idx, index) {
        this.productData[idx].products[index].select = !this.productData[idx].products[index].select
        for (let i in this.productData[idx].products) {
          if (!this.productData[idx].products[i].select) {
            this.productData[idx].select = false
            this.watchData()
            return false
          }
        }
        this.productData[idx].select = true
        this.watchData()
      },
      /**
       * 手动监听数据变化,当用户单个选中时
       * (全部选中则全选状态发送变化,只要有一个未选中则全选状态为未选中状态)
       * @returns {boolean}
       */
      watchData () {
        let totalPrice = 0
        let isHaveAllSelect = true
        for (let item in this.productData) {
          if (!this.productData[item].select) {
            this.selectAll = false
          }
          for (let product in this.productData[item].products) {
            if (!this.productData[item].products[product].effective) {
              continue
            }
            if (!this.productData[item].products[product].select) {
              this.selectAll = false
              isHaveAllSelect = false
            } else {
              totalPrice += this.productData[item].products[product].price *
                this.productData[item].products[product].nums
            }
          }
        }
        this.totalPrice = totalPrice
        this.selectAll = isHaveAllSelect
      }
    },
    created () {
      this.watchData()
    },
    mounted () {
    },
    updated () {
    }
  }
</script>
<style
  scoped
  lang="stylus"
  src="@/assets/styl/modules/cart/index.styl"></style>
