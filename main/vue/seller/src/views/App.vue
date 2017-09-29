<!--
---- 首页框架文件
--->
<template>
  <transition name="fade" appear>
    <div id="view">
      <router-view></router-view>
    </div>
  </transition>
</template>

<script>
  export default {
    created () {
    }
  }
</script>
