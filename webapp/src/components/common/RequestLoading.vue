<template>
  <div class="request-loading">
    <div class="loading-animation j-flex j-flex-vtc">
      <div class="flex"></div>
      <van-loading color="#1989fa" />
      <div class="flex"></div>
    </div>
  </div>
</template>

<script>
/**
 * 全页面加载动画
 */
export default {
  name: 'Common-RequestLoading'
}
</script>

<style lang="scss" scoped>
.request-loading {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 99;
  background-color: rgba(0, 0, 0, 0.2);

  .loading-animation {
    width: 100%;
    height: 100%;
    text-align: center;
  }
}
</style>
