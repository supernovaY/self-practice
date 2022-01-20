<template>
  <div>
    <Message v-if="pagestatus.reload" />
  </div>
</template>

<script>
import Message from './Message.vue'

export default {
  components: {
    Message
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

    if (pageParam && pageParam.action === 'reload') {
      this.pagestatus.reload = false

      setTimeout(() => {
        this.pagestatus.reload = true
      }, 500)
    } else {
      this.pagestatus.reload = true
    }
  }
}
</script>

<style>
</style>
