<template>
  <div>
    <MartyrSearch v-if="pagestatus.reload" />
  </div>
</template>

<script>
import MartyrSearch from './MartyrSearch.vue'

export default {
  components: {
    MartyrSearch
  },

  data () {
    return {
      // 页面状态
      pagestatus: {
        // 控制重新加载
        reload: false
      }
    }
  },

  activated () {
    const pageParam = this.$store.getters.pageParam(this)

    // 从子页面返回 不触发刷新
    if (pageParam && pageParam.action === 'keepAlive') {
      this.pagestatus.reload = true
    } else {
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
