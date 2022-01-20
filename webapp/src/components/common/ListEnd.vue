<template>
  <div class="list-end">
    <Common-PageDevideHeight />
    <van-divider dashed>
      <span class="j-fc-gray">{{ tiptext }}</span>
    </van-divider>
    <Common-PageDevideHeight />
  </div>
</template>

<script>
/**
 * 全局通用手机端页面列表加载
 */
export default {
  name: 'Common-ListEnd',

  props: {
    tiptext: {
      type: String,
      default: '我到底了'
    }
  }
}
</script>

<style lang="scss" scoped>
.list-end{
  width: 50%;
  margin: 0 auto;
}

.van-divider{
  font-size: 12px;
}
</style>
