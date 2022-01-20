<template>
  <MerchantCouponSearch v-if="pagestatus.reload" />
</template>

<script>
import MerchantCouponSearch from './MerchantCouponSearch.vue'

export default {
  components: {
    MerchantCouponSearch
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
