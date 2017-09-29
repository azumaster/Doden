<!--
---- 首页框架文件
--->
<template>
  <div class="body">
    <div
      class="main-content"
      :class="{full:full}">
      <transition name="fade" appear>
        <router-view></router-view>
      </transition>
    </div>
    <div
      class="toolbar"
      :class="{full:full}">
      <div
        v-waves
        v-for="(item, idx) in items"
        :class="['item',item.active?'active':'']"
        @click="jump(item.path)">
          <div class="iconfont icon">
            <div
              class="badge"
              v-if="item.badge > 0">{{item.badge > 99 ? '...' : item.badge}}</div>
            <span v-html="item.icon"></span>
            <span class="active" v-html="item.icon_active"></span>
          </div>
          <div class="text">{{item.name}}</div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        full: false,
        items: {
          home: {
            name: '首页',
            icon: '&#xe801;',
            icon_active: '&#xe802;',
            path: '/',
            active: false,
            badge: 0
          },
          cart: {
            name: '购物车',
            icon: '&#xe803;',
            icon_active: '&#xe804;',
            path: '/cart',
            active: false,
            badge: 99
          },
          order: {
            name: '订单',
            icon: '&#xe805;',
            icon_active: '&#xe806;',
            path: '/order',
            active: false,
            badge: 0
          },
          collection: {
            name: '常购',
            icon: '&#xe807;',
            icon_active: '&#xe808;',
            path: '/',
            active: false,
            badge: 0
          },
          main: {
            name: '我的',
            icon: '&#xe809;',
            icon_active: '&#xe809;',
            path: '/',
            active: false,
            badge: 0
          }
        }
      }
    },
    watch: {
      $route (route) {
        if (
          route.matched[1].name &&
          route.matched[1].name === 'cart') {
          this.full = true
        } else {
          this.full = false
        }
        for (let i in this.items) {
          // 解决路由层级不同意
          if (route.matched.length >= 2) {
            if (i === route.matched[1].name) {
              // todo full值未更新
              this.items[i].active = true
            } else {
              this.items[i].active = false
            }
          } else {
            console.log('路由未找到')
          }
        }
      }
    },
    methods: {
      jump (idx) {
        this.$router.push(idx)
      }
    },
    created () {
      if (this.$route.matched.length >= 2) {
        let name = this.$route.matched[1].name
        this.items[name].active = true
        this.full = (name === 'cart')
      } else {
        console.log('路由未找到')
      }
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
  src="@/assets/styl/main.styl"></style>
