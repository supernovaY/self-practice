<template>
  <div>
    <MerchantSubAccount v-if="pagestatus.reload" />
  </div>
</template>

<script>
import MerchantSubAccount from './MerchantSubAccount.vue'

export default {
  components: {
    MerchantSubAccount
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
