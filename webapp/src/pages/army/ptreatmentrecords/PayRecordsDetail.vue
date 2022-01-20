<template>
  <div>
    <Common-PageContainer>
      <template #content>
        <div class="container">
          <div class="form-group nomargin-t nomargin-b">
            <PayRecordItem :service="orderinfo" :clickjump="false" :showrighticon="false"></PayRecordItem>
          </div>
        </div>

        <van-cell-group title="订单信息">
          <van-cell title="订单号" :value="orderinfo.orderCode" />

          <van-cell
            v-if="orderinfo.payStatus === 4"
            title="退款类型"
          >
            <template #default>
              <span>{{ orderinfo.refundType == 1 ? '部分退款' : '全额退款' }}</span>
            </template>
          </van-cell>

          <van-cell
            v-if="orderinfo.payStatus === 4"
            title="支付时间"
            :value="orderinfo.payTime"
          />

          <van-cell title="支付类型">
            <template #default>
              <span>
                {{ $Config.enumConfig.paytype[orderinfo.payType] || '' }}
              </span>
            </template>
          </van-cell>
        </van-cell-group>

        <van-cell-group title="优惠信息">
          <van-cell
            title="优惠金额"
            :value="orderinfo.discountsTotalAmount ? parseFloat(orderinfo.discountsTotalAmount) + '元' : ''"
          />

          <van-cell title="折扣情况" :value="orderinfo.discount + '折'" />
        </van-cell-group>

        <div class="container">
          <div v-if="orderinfo.coupon">
            <div class="form-head">优惠券</div>
            <Coupon
              :coupon="orderinfo.coupon"
              :showbtn="false"
            />
            <Common-PageDevideHeight />
          </div>
        </div>

        <div class="form-head">商家信息</div>
        <Common-PageDevideHeight />
        <div class="container">
          <van-cell-group>
            <van-cell title="商家名称" :value="orderinfo.name" />

            <van-cell title="联系方式">
              <template #default>
                <Common-PhoneCall :telephone="orderinfo.phone || ''" />
              </template>
            </van-cell>

            <van-cell title="地址" :value="orderinfo.address" />
            <van-cell title="营业时间" :value="orderinfo.openTime" />
          </van-cell-group>

          <div v-if="orderinfo.payStatus === 0" class="j-m">
            <Common-PageDevideHeight />
            <Common-PageDevideHeight />
            <Common-PageDevideHeight />

            <van-button type="info" size="large" @click="F_goPay">
              去支付
            </van-button>

            <Common-PageDevideHeight />
            <Common-PageDevideHeight />
            <Common-PageDevideHeight />
          </div>
        </div>

        <Common-PageFooter />
      </template>
    </Common-PageContainer>
  </div>
</template>

<script>
import Coupon from '@/components/coupon/Coupon.vue'
import PayRecordItem from './PayRecordItem.vue'

export default {
  components: {
    Coupon,
    PayRecordItem
  },
  data () {
    return {
      // 订单信息
      orderinfo: {}
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
    // 跳转继续支付
    F_goPay () {
      this.$router.push(
        '/army/pay/payconfirm' +
        this.$Common.KhttpBuildQuery({
          orderid: this.orderinfo.id
        })
      )
    },

    // 加载订单详情
    async F_loadData () {
      this.$Common.showLoading(true)

      const data = await this.$Api.army.merchant.getMerchantOrderDetail(
        this.$route.params.orderid
      )

      this.$Common.showLoading(false)

      if (data.code === 2000) {
        if (data.result.coupon) {
          data.result.coupon.active = true
          data.result.coupon.status = 2
          data.result.coupon.createTime = data.result.coupon.sendTime
        }

        data.result.label = []

        if (data.result.coupon) {
          data.result.label.push('优惠券')
        }

        if (data.result.discount) {
          data.result.label.push(data.result.discount + '折')
        }

        // 处理图片
        data.result.icon = data.result.image
        this.orderinfo = data.result
        return
      }

      this.$toast('订单数据请求失败')
    }
  }
}
</script>

<style lang="scss" scoped>
.container{
  background: #FFF;
}

</style>
