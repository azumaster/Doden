<template>
  <div id="brands">
    <div class="dcanmou_so_area" style="margin-left:30px;">
      <input class="dcm_ipt" placeholder="     请输入供应商名">
      <button class="dcm_so_btn">搜索</button>
    </div>
    <Tabs :tabs="tabs"></Tabs>
    <router-view></router-view>
    <Footer></Footer>
  </div>
</template>
<script>
import Footer from './../../../components/footer.vue';
import Tabs from '../../../components/tabs.vue';
export default {
  name: "brands",
  components: {Footer, Tabs},
  data: function () {
            return {
                tabs: [{key:'brands/', name:'已置顶品牌'},
                        {key:'brands/onShelfBrands', name:'已上架品牌'},
                        {key:'brands/underShelfBrands', name:'未上架品牌'}
                ]
            };
        }
}
</script>
<style lang="less" >
@bgcolor: #45C8DC;
#brands{
  width: 100%;
  height: 100%;
  padding-top: 20px;
  margin-right: 50px;
.ivu-tabs-bar{margin-bottom: 0px}
.ivu-tabs-nav .ivu-tabs-ink-bar{left: 0px;}
.ivu-tabs-nav .ivu-tabs-tab{margin-left: 0px;}
.ivu-tabs-bar{padding-left: 30px;}
}
</style>