<template>
  <div>
    <Common-PageContainer :showToTop="true" @scrollLoad="F_scrollLoad">
      <template #content>
        <MerchantHeader @reset="F_resetList" />

        <Common-PageDevideHeight />

        <MerchantDataList ref="orderData" />

        <Common-PageFooter />
      </template>
    </Common-PageContainer>
  </div>
</template>

<script>
import MerchantHeader from './MerchantHeader.vue'
import MerchantDataList from './MerchantDataList.vue'

export default {
  components: {
    MerchantHeader,
    MerchantDataList
  },

  data () {
    return {
      // 页面状态控制
      pagestatus: {

      },

      // 轮询订单当时查询计时器ID
      timerpayordercheck: false
    }
  },

  deactivated () {
    // 取消查询收款结果的定时任务
    // clearInterval(this.timerpayordercheck)
  },

  activated () {
    // 一些keepalive的页面重置处理
    this.$store.commit(
      'sendMultyPageParam',
      [
        { path: '/merchant/searchorder', data: { action: 'reload' } },
        { path: '/merchant/searchcoupon', data: { action: 'reload' } },
        { path: '/merchant/message', data: { action: 'reload' } }
      ]
    )

    this.F_timerLoadPayOrderCheck()
  },

  mounted () {

  },

  methods: {
    // 定时查询收款结果
    F_timerLoadPayOrderCheck () {
      this.$Common.setTimerInterval(
        setInterval(async () => {
          const data = await this.$Api.merchant.getPaySuccessTimer()

          if (data.code === 2000) {
            this.$router.push('/merchant/paynotify/' + data.result)
          }
        }, 5000)
      )
    },

    // 刷新重置列表
    F_resetList () {
      this.$refs.orderData.F_reset()
    },

    // 页面滚动 给到下级组件
    F_scrollLoad () {
      this.$refs.orderData.F_loadData()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

<style scoped>
.van-tabs >>> .van-tab .van-tab__text--ellipsis{
  font-size: 14px;
}

.van-tabs >>> .van-tab.van-tab--active .van-tab__text--ellipsis{
  font-size: 16px;
}
</style>
