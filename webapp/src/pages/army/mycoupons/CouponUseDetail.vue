<template>
  <div>
    <Common-PageContainer>
      <template #content>
        <div class="container">
          <van-cell-group>
            <van-cell title="关联订单号" :value="orderinfo.orderCode" />
            <van-cell title="使用时间" :value="orderinfo.useTime" />
            <van-cell title="抵扣金额" :value="orderinfo.discountAmount + '元'" />

            <van-cell title="支付类型">
              <template #default>
                <span>{{ $Config.enumConfig.paytype[orderinfo.payType] || '' }}</span>
              </template>
            </van-cell>

            <van-cell title="支付金额" :value="orderinfo.realAmount + '元'" />
            <van-cell title="消费金额" :value="orderinfo.totalAmount + '元'" />

            <van-cell title="商家名称" :value="orderinfo.name" />

            <van-cell title="联系方式">
              <template #default>
                <Common-PhoneCall :telephone="orderinfo.phone || ''" />
              </template>
            </van-cell>

            <van-cell title="地址" :value="orderinfo.address" />
            <van-cell title="营业时间" :value="orderinfo.openTime" />
          </van-cell-group>
        </div>

        <Common-PageFooter />
      </template>
    </Common-PageContainer>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 订单信息
      orderinfo: {}
    }
  },

  watch: {
    // 页面参数
    '$route.params.id' () {
      this.F_loadData()
    }
  },

  mounted () {
    this.F_loadData()
  },

  methods: {
    async F_loadData () {
      this.$Common.showLoading(true)

      const data = await this.$Api.army.getUsedCouponDetai(
        this.$route.params.id
      )

      this.$Common.showLoading(false)

      if (data.code === 2000) {
        this.orderinfo = data.result
        return
      }

      this.$toast('优惠券使用详情数据获取失败')
    }
  }
}
</script>

<style lang="scss" scoped>
.container{
  background: #FFF;
}
</style>
