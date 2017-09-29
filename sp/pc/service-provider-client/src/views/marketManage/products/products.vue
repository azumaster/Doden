<template>
  <div id="products" class="products">
    <div class="search">
      <Input  placeholder="请输入商品名" style="width: 256px; height: 38px;"></Input>
      <Button type="primary" style="position: relative; left: -16px; background: #45c8dc; border-color: #45c8dc; height: 38px; width: 62px;">搜索</Button>
    </div>
    <Menu></Menu>
    <router-view></router-view>
  </div>
</template>

<script>
  import Menu from './productsMenu.vue';

  export default {
      name: 'product',
      components: { Menu }
  }
</script>
