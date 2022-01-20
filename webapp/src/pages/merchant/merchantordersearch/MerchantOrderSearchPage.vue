<template>
  <MerchantOrderSearch v-if="pagestatus.reload" />
</template>

<script>
import MerchantOrderSearch from './MerchantOrderSearch.vue'

export default {
  components: {
    MerchantOrderSearch
  },

  data () {
    return {
      // 页面状态
      pagestatus: {
        // 控制组件重新加载
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
  },

  mounted () {
    this.$store.getters.pageParam(this)
  }
}
</script>
