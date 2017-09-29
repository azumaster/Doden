<template> 
  <div id="providers">
    <div class="dcanmou_so_area" style="margin-left:30px;">
      <input class="dcm_ipt" placeholder="     请输入供应商名">
      <button class="dcm_so_btn">搜索</button>
    </div>
    <router-view></router-view>
    <Footer></Footer>
  </div>
</template>
<script>
import Footer from './../../../components/footer.vue';
export default {
  name: "providers",
  components: {Footer},
  
}
</script>
<style lang="less" >
#providers{
  width: 100%;
  height: 100%;
  padding-top: 20px;
}
</style>
