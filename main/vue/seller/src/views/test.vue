<template>
  <div class="test">
  </div>
</template>
<script>
  import {mapGetters} from 'vuex'
  export default {
    computed: {
      ...mapGetters([
        'typeCount'
      ])
    },
    created () {
      console.log(this.typeCount)
      console.log(this.$store.dispatch('refreshTypeCount'))
      console.log(this.typeCount)
    }
  }
</script>
<style>

</style>
