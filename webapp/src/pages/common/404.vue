<template>
  <Common-PageContainer>
    <template v-slot:content>
      <van-empty image="error" description="您访问的页面不存在" />
    </template>
  </Common-PageContainer>
</template>

<script>
export default {
  name: 'Page404',

  data () {
    return {}
  }
}
</script>

<style lang="scss" scoped>
.nodata {
  &:hover {
    background: #42b983;
  }
}
</style>
