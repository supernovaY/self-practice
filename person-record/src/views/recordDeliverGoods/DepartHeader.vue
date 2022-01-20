<script>
import { defineComponent,ref } from 'vue'
export default defineComponent ({
  name: "DepartHeader",
  setup(){
    const activeIndex = ref('/depart/recordDepartGoods')
    return {
      activeIndex,
    }
  },
});
</script>

<template>
  <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
    menu-trigger="hover"
    router
  >
    <el-menu-item index="/depart/recordDepartGoods">录入发货数据</el-menu-item>
    <el-menu-item index="/depart/departGoodsList">发货数据列表</el-menu-item>
  </el-menu>
  <router-view></router-view>
</template>

<style scoped lang="scss">
.head {
  display: flex;
  justify-content: space-between;
  height: 10vh;
  align-items: center;
}
</style>
