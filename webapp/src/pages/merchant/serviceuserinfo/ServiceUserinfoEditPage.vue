<template>
  <ServiceUserinfoEdit v-if="pagestatus.reload" ref="merchanteditform" />
</template>

<script>
import ServiceUserinfoEdit from './ServiceUserinfoEdit.vue'

export default {
  components: {
    ServiceUserinfoEdit
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
      this.$refs.merchanteditform.F_selectPostionCallback(pageParam.data)
    }
  },

  mounted () {
    this.$store.getters.pageParam(this)
  }
}
</script>
