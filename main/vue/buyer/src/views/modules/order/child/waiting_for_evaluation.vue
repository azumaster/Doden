<template>
  <div>
    <template v-for="i in 10">
      <item></item>
    </template>
  </div>
</template>
<script>
  import item from '@modules/order/child/item.vue'
  export default {
    components: {
      item
    },
    data () {
      return {}
    }
  }
</script>
