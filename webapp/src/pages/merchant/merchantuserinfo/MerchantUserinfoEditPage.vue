<template>
  <MerchantUserinfoEdit v-if="pagestatus.reload" ref="merchanteditform" />
</template>

<script>
import MerchantUserinfoEdit from './MerchantUserinfoEdit.vue'

export default {
  components: {
    MerchantUserinfoEdit
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

    // 地图位置选择回调接参
    if (pageParam && pageParam.action === 'mapselectposition') {
      console.log('接收到地图选择参数', pageParam)
      this.$refs.merchanteditform.F_selectPostionCallback(pageParam.data)
    }
  },

  mounted () {
    this.$store.getters.pageParam(this)
  }
}
</script>
