NN<template>
  <div id="app2">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {},
  created () {
    // 解析Url参数
    const GET = this.$Common.kgetUrlinfo(window.location.href)

    let _GET = Object.assign({}, GET)
    _GET = Object.assign(_GET, GET.URLHASH)

    this.$store.commit('setGetParam', _GET)
  },
  mounted () {

  }
}
</script>

<style>
</style>
