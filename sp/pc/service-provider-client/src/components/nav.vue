<template>
    <div class="mynav" id="mynav">
        <Menu theme="dark" width="auto">
            <router-link to="/customerManagement" > 
            <Menu-item name="1">
                <p class="mar8">
                <i class="iconfont icon-ic_store"></i>
                <span class="layout-text">首页</span>
                </p>
            </Menu-item>
            </router-link>
            <router-link to="/goodsIn" > 
            <Menu-item name="7">
                <p class="mar8">
                <i class="iconfont icon-ic_store"></i>
                <span class="layout-text">进货</span>
                </p>
            </Menu-item>
            </router-link>

            <Submenu name="2" v-show="this.$store.state.middleware.navbar">
                <template slot="title">
                                <span style="padding-left: 21px;">
                                    <Icon type="android-phone-portrait"></Icon>
                                    <span class="layout-text">冻参谋首页管理</span>
                                    </span>
                                </template>
                                <router-link to="/hotsortmanage" ><Menu-item name="2-1">热销分类管理</Menu-item></router-link>
                                <router-link to="/hotbrandmanage" ><Menu-item name="2-2">热门品牌管理</Menu-item></router-link>
                                <router-link to="/productrecommendmanage" ><Menu-item name="2-3">单品推荐管理</Menu-item></router-link>
            </Submenu>
<!-- 商城管理 -->
<Submenu name="8" >
                <template slot="title">
                                <span style="margin-left:-10px">
                                    <i class="iconfont icon-suini-shop" style="font-size:12px;"></i>
                                    <span class="layout-text">商城管理</span>
                                    </span>
                                </template>
                                <router-link to="/products" ><Menu-item name="8-1">商品</Menu-item></router-link>
                                <Submenu name="8-2">
                                    <template slot="title">
                                        <span style="position:relative;left:18px">供应商</span>
                                        <Icon type="ios-arrow-down" style="position:relative;left:40px" ></Icon>
                                    </template>
                                    <router-link to="/providers/allproviders" ><MenuItem name="8-2-1">全部</MenuItem></router-link>
                                    <router-link to="/providers/signedproviders" ><MenuItem name="8-2-2">签约</MenuItem></router-link>
                                </Submenu>
                                <!-- <router-link to="/providers" ><Menu-item name="8-2">供应商</Menu-item></router-link> -->
                                <router-link to="/brands" ><Menu-item name="8-3">品牌</Menu-item></router-link>
            </Submenu>
<!-- 商城管理结束 -->
            <Submenu name="3">
                <template slot="title">
                                    <i class="iconfont icon-accountlocation" style="margin-left:-15px;"></i>
                                    <span class="layout-text">客户管理</span>
                                </template>
                                <router-link to="/customerAnalysis" ><Menu-item name="3-1">客户分析</Menu-item></router-link>
                                <router-link to="/customerList" ><Menu-item name="3-2">客户名单</Menu-item></router-link>
            </Submenu>
            <Submenu name="4" >
                <template slot="title">
                                    <i class="iconfont icon-shangpinguanli" style="margin-left:-15px;"></i>
                                    <span class="layout-text">商品管理</span>
                                </template>
                                <router-link to="/goodsmanage" ><Menu-item name="4-1">商品管理</Menu-item></router-link>
            </Submenu>
            <Submenu name="5" >
                <template slot="title">
                                    <Icon type="ios-star" style="margin-left: -42px;"></Icon>
                                    <span class="layout-text">功能</span>
                                </template>
                                <router-link to="/indexmanage" ><Menu-item name="5-1">冻参谋首页管理</Menu-item></router-link>
            </Submenu>
            <router-link to="/settings" > <Menu-item name="6">
                <p class="mar8">
                <i class="iconfont icon-extension"></i>
                <span class="layout-text">设置</span>
                </p>
            </Menu-item></router-link>
        </Menu>
        <div class="contactus">
            <p class="conde">请打开微信扫码二维码</p>
            <p class="text">联系我们</p>
            <div class="wechat"></div>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'nav'
    };
</script>
<style lang="less" >
    .mynav {position: relative;width: 100%;height: 100%;}
    .wechat {display: none;width: 160px;height: 160px;position: absolute;top: -160px;left: 0px;background: url('/Public/pc/dcanmou-client/img/contactus.png');background-size:contain;}
    .contactus{position: absolute;bottom: 36px;left: 20px;;font-size: 14px;background: #1d2027;}
    .contactus:hover .wechat{display: block;}
    .contactus p{font-size: 14px;color: #737887;width: 160px;text-align: center;height: 24px;line-height: 24px; margin-bottom: 8px;}
    .contactus .code{color: #7891b7;margin-bottom: 0;}
    .mynav .ivu-menu-item {font-size: 14px;border-left: 8px solid #1C2438; }
    .mynav {text-align: center}
    .mynav .layout-text{text-align: center;font-size: 14px;}
    .mynav   i {font-size: 14px;  margin-right: 8px;}
    #mynav  .ivu-menu-item-active {
        color: #EAEAEA  ! important;
        background: #1D2027  ! important;
        border-right: none  ! important;
        border-left: 8px solid #3FB4C6;
    }
    #mynav .ivu-menu-submenu-title-icon{display: none;}
    #mynav .ivu-menu-submenu{ border-left:none;background: #1C2438;}
    #mynav .mar8 {margin-left: -50px;} 
   #mynav .ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item {padding-left: 23px;}
   #mynav .ivu-menu-item, .ivu-menu-submenu-title{background: #1C2438 ! important;}
    .ivu-menu-submenu{margin-left: 2px;}
    .ivu-menu-dark{background: #1C2438 ! important;}
</style>