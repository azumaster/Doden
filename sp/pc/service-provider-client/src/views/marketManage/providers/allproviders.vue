<template>
  <div id="allproviders">
     <Tabs :tabs="tabs"></Tabs>
    <router-view></router-view>
    <Footer></Footer>
  </div>
</template>
<script>
import Footer from './../../../components/footer.vue';
import Tabs from '../../../components/tabs.vue';
export default {
  name: 'allproviders',
   components: {Footer, Tabs},
  data () {
      return {
           tabs: [{key:'providers/allproviders', name:'已上架供应商'},
                        {key:'providers/allproviders/allprovidersUndershelf', name:'未上架供应商'}
                ]
      }
  },
  created () { 
  }
}
</script>
<style lang="less" >
@checkcolor: #12b571; @bgcolor: #45c8dc;
#allproviders{
    .ivu-tabs-nav .ivu-tabs-ink-bar{left: 0px;}
    font-size: 14px;
    padding-right: 50px;
    margin-bottom: 60px;
    .ivu-tabs-nav .ivu-tabs-tab{margin-left: 0px;}
    .ivu-tabs-nav-container{margin-left: 30px;}
    .ivu-tabs-tab-disabled{ position: relative;right: -100%;}
    .inner{margin-left: 30px;}
    // 开关样式
    .ivu-switch-checked { border-color: @checkcolor; background-color: @checkcolor;}
    .txt{padding-right: 60px;padding-left: 20px;}
    .dcm_so_btn{margin-right: 20px;}
    // 设置表头背景色
    .ivu-table-header .ivu-table-column-center{background: #f0f0f0}
    // 选中之后，选择框的样式
    .ivu-checkbox-checked .ivu-checkbox-inner {border-color: @checkcolor;background-color: @checkcolor;}
    .ivu-table{font-size: 14px;} //表格字体
    // 让分页在右边
    .pageBar{width: 100%;
        ul{float: right}
    }
    tr.ivu-table-row-hover td{background-color:#fff}
}
</style>
