<script>
import { defineComponent, ref } from 'vue'
import Header from './Header.vue'
import saleHeader from '../recordDeliverGoods/DepartHeader.vue'
import {
  Location,
  Document,
  Menu as IconMenu,
  Setting,
} from '@element-plus/icons'

export default defineComponent({
  components: {
    Location,
    Document,
    Setting,
    IconMenu,
    Header,
    saleHeader
  },
  setup() {
    const isCollapse = ref(true)
    const handleOpen = (key, keyPath) => {
      console.log(key, keyPath)
    }
    const handleClose = (key, keyPath) => {
      console.log(key, keyPath)
    }
    return {
      isCollapse,
      handleOpen,
      handleClose,
    }
  },
})
</script>

<template>
  <el-container class="inner-container" style="height: 100vh; width: 100vw;">
    <!--  侧边栏  -->
    <el-aside style="height:100vh;width: 15rem;background-color:#545c64;">
      <el-menu
        active-text-color="#ffd04b"
        background-color="#545c64"
        class="el-menu-vertical-demo"
        default-active="2"
        text-color="#fff"
        @open="handleOpen"
        @close="handleClose"
        router
      >
        <el-sub-menu>
          <el-menu-item-group style="padding-top:3vh;text-align: center;height: 10vh;">
            <template #title><span style="color:#fff;font-size: 16px;">青为-仓库系统</span></template>
          </el-menu-item-group>
        </el-sub-menu>
        <el-menu-item index="/depart/recordDepartGoods">
          <el-icon><setting /></el-icon>
          <template #title>录入发货数据</template>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <Header></Header>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
      <el-footer></el-footer>
    </el-container>
  </el-container>
</template>

<style scoped lang="scss">
.el-menu {
  font-size: 14px;
  border-right: 2px solid #545c64;
  .el-icon {
    font-size: 14px;
    margin-right: 10px;
  }
}
.inner-container{
  position: absolute;
  left: 0;
  top: 0;
  right: -17px;
  bottom: 0;
  overflow-x: hidden;
  overflow-y: scroll;
}
</style>
