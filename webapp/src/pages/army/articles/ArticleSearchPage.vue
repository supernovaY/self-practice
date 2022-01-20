<template>
  <div>
    <ArticleSearch v-if="pagestatus.reload" />
  </div>
</template>

<script>
import ArticleSearch from './ArticleSearch.vue'

export default {
  components: {
    ArticleSearch
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
