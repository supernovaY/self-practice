<template>
  <div>
    <van-tabs color="#1989fa" v-model="pagestatus.showType">
      <van-tab title="服务优待" name="service">
        <RecommendService
          v-if="pagestatus.reload"
          ref="service" />
      </van-tab>

      <van-tab title="推荐商户" name="merchant">
        <RecommendMerchant
         v-if="pagestatus.reload"
         ref="merchant" />
      </van-tab>

      <van-tab disabled></van-tab>

      <van-tab disabled></van-tab>
    </van-tabs>
  </div>
</template>

<script>
import RecommendService from './RecommendService.vue'
import RecommendMerchant from './RecommendMerchant.vue'

export default {
  components: {
    RecommendService,
    RecommendMerchant
  },

  data () {
    return {
      // 页面状态
      pagestatus: {
        // 当前tab切换类型
        showType: 'service',

        // 控制组件重新加载
        reload: true
      }
    }
  },

  activated () {
    const pageParam = this.$store.getters.pageParam(this)

    if (pageParam && pageParam.action === 'reload') {
      this.pagestatus.reload = false

      this.pagestatus.showType = 'service'

      setTimeout(() => {
        this.pagestatus.reload = true
      }, 500)
    }
  },

  mounted () {
    // 提前消除初始化的接参
    this.$store.getters.pageParam(this)
  },

  methods: {
    F_loadData () {
      this.$refs[this.pagestatus.showType].F_loadData()
    }
  }
}
</script>

<style scoped>
.van-tabs >>> .van-tab .van-tab__text--ellipsis{
  font-size: 14px;
}

.van-tabs >>> .van-tab.van-tab--active .van-tab__text--ellipsis{
  font-size: 16px;
}
</style>
