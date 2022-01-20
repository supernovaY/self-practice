<template>
  <div>
    <PolicyList v-if="pagestatus.reload" />
  </div>
</template>

<script>
import PolicyList from './PolicyList.vue'

export default {
  components: {
    PolicyList
  },

  data () {
    return {
      // 页面状态
      pagestatus: {
        // 控制重新加载
        reload: true
      }
    }
  },

  activated () {
    const pageParam = this.$store.getters.pageParam(this)

    if (pageParam && pageParam.action === 'reload') {
      this.pagestatus.reload = false

      setTimeout(() => {
        this.pagestatus.reload = true
      }, 500)
    }
  }
}
</script>

<style>
</style>
