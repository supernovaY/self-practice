<template>
  <div>
    <Common-PageContainer>
      <template #content>
        <div class="container">
          <Coupon
            :coupon="coupon"
            :showbtn="false"
            :showexpire="false"
            :showexpiredate="false"
          />

          <van-cell-group>
            <van-cell title="关联订单号" :value="orderinfo.orderCode" />
            <van-cell title="核销时间" :value="orderinfo.useTime" />
            <van-cell title="抵扣金额" :value="orderinfo.discountAmount + '元'" />
          </van-cell-group>
        </div>

        <Common-PageFooter />
      </template>
    </Common-PageContainer>
  </div>
</template>

<script>
import Coupon from '@/components/coupon/Coupon.vue'

export default {
  components: {
    Coupon
  },
  data () {
    return {
      // 订单信息
      orderinfo: {},

      coupon: {}
    }
  },

  watch: {
    '$route.params.orderid' () {
      this.F_loadData()
    }
  },

  mounted () {
    this.F_loadData()
  },

  methods: {
    async F_loadData () {
      this.$Common.showLoading(true)

      const data = await this.$Api.merchant.getCouponOrderDetail(
        this.$route.params.id
      )

      this.$Common.showLoading(false)

      // console.log('订单详情', data)

      if (data.code === 2000) {
        this.orderinfo = data.result

        this.coupon = Object.assign({}, data.result)

        // 强制设置为可用状态
        this.coupon.active = true
        this.coupon.status = 2
        return
      }

      this.$toast('订单数据加载失败')
    }
  }
}
</script>

<style lang="scss" scoped>
.container{
  background: #FFF;
}

</style>
