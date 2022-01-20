<template>
  <div class="list-loading">
    <Common-PageDevideHeight />
    <van-loading color="#1989fa" size="24px" />
    <Common-PageDevideHeight />
  </div>
</template>

<script>
/**
 * 全局通用手机端页面列表加载
 */
export default {
  name: 'Common-ListLoading'
}
</script>

<style lang="scss" scoped>
.list-loading {
  text-align: center;
}
</style>
