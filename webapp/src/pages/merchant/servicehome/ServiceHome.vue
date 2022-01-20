<template>
  <div>
    <Common-PageContainer :showToTop="true" @scrollLoad="F_scrollLoad">
      <template #content>
        <div class="container">
          <ServiceHeader />

          <ServiceOrderList
            ref="orderData"
            v-if="pagestatus.reloadOrderList"
          />
        </div>
        <Common-PageFooter />
      </template>
    </Common-PageContainer>
  </div>
</template>

<script>
import ServiceHeader from './ServiceHeader.vue'
import ServiceOrderList from './ServiceOrderList.vue'

export default {
  components: {
    ServiceHeader,
    ServiceOrderList
  },

  data () {
    return {
      // 页面状态控制
      pagestatus: {
        reloadOrderList: false
      }
    }
  },

  activated () {
    this.pagestatus.reloadOrderList = false

    setTimeout(() => {
      this.pagestatus.reloadOrderList = true
    }, 600)
  },

  mounted () {
    this.pagestatus.reloadOrderList = true
  },

  methods: {
    F_scrollLoad () {
      this.$refs.orderData.F_loadData()
    }
  }
}
</script>

<style lang="scss" scoped>
.container{
  background: #FFF;
}
</style>

<style scoped>
.van-tabs >>> .van-tab .van-tab__text--ellipsis{
  font-size: 14px;
}

.van-tabs >>> .van-tab.van-tab--active .van-tab__text--ellipsis{
  font-size: 16px;
}
</style>
