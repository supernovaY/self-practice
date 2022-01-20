<template>
  <div>
    <Mourning v-if="pagestatus.reload" />
  </div>
</template>

<script>
import Mourning from './Mourning.vue'

export default {
  components: {
    Mourning
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
