<script>
import { defineComponent, reactive, toRefs } from 'vue'
export default defineComponent ({
  name: "Header",
  setup(){
    const state = reactive({
      url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
    })

    return {
      ...toRefs(state),
    }
  },
});
</script>

<template>
  <div class="head">
    <div>首页</div>
    <div style="display: flex;">
      <el-image
      style="width: 32px; height: 32px;margin-right: 5px;"
      :src="url"
      />
      <el-button type="primary" size="mini">退出登录</el-button>
  </div>
  </div>
</template>

<style scoped lang="scss">
.head {
  display: flex;
  justify-content: space-between;
  height: 10vh;
  align-items: center;
}
</style>
