<template>
  <div>
    <Common-PageContainer>
      <template #content>
        <div class="container">
          <van-cell-group>
            <van-cell title="订单号" :value="orderinfo.orderCode" />
            <van-cell title="支付状态">
              <template #default>
                <!-- 已支付 -->
                <span v-if="orderinfo.payStatus == 2" class="j-fc-blue">
                  已支付
                </span>

                <!-- 已退款 -->
                <span v-if="orderinfo.payStatus == 4" class="j-fc-red">
                  {{ orderinfo.payStatusStr }}
                </span>

                <!-- 退款中 -->
                <span v-if="orderinfo.payStatus == 3" class="j-fc-red">
                  {{ orderinfo.payStatusStr }}
                </span>

                <!-- 其他状态 -->
                <span
                  v-if="orderinfo.payStatus != 2 && orderinfo.payStatus != 3 && orderinfo.payStatus != 4"
                  class="j-fc-gray"
                >
                  {{ orderinfo.payStatusStr }}
                </span>
              </template>
            </van-cell>

            <van-cell title="支付类型">
              <template #default>
                <span>{{ orderinfo.payTypeStr }}</span>
              </template>
            </van-cell>

            <van-cell title="支付时间" :value="orderinfo.payTime" />
            <van-cell title="消费金额" :value="orderinfo.totalAmount + '元'" />
            <van-cell title="优惠金额" :value="orderinfo.discountsTotalAmount + '元'" />
            <van-cell title="支付金额" :value="orderinfo.realAmount + '元'" />

            <van-cell
              v-if="orderinfo.payStatus == 3 || orderinfo.payStatus == 4"
              title="退款类型"
            >
              <template #default>
                <span>{{ orderinfo.refundTypeStr }}</span>
              </template>
            </van-cell>

            <van-cell
              title="退款金额"
              :value="orderinfo.refundAmount + '元'"
              v-if="orderinfo.payStatus == 3 || orderinfo.payStatus == 4"
            />

            <van-cell
              v-if="data.discountdetail.id"
              title="折扣情况"
              :value="data.discountdetail.discountNum + '折'"
            />

            <van-cell
              v-if="data.coupondiscount.id"
              title="优惠券抵扣金额"
              :value="data.coupondiscount.amount + '元'"
            />

            <van-cell title="结算人" :value="orderinfo.name" />
          </van-cell-group>

          <Common-PageDevideHeight />
          <Common-PageDevideHeight />

          <div
            class="j-m"
            v-if="orderinfo.payStatus == 2 && merchantInfo.principal"
          >
            <div class="j-flex">
              <div class="flex">
                <van-button
                  type="info"
                  block
                  plain
                  @click="pagestatus.partRefund = true"
                >
                  部分退款
                </van-button>
              </div>

              <div class="btn-divide"></div>

              <div class="flex">
                <van-button
                  type="info"
                  block
                  @click="F_refundOrder"
                >
                  全额退款
                </van-button>
              </div>
            </div>
          </div>

          <Common-PageDevideHeight />
          <Common-PageDevideHeight />
        </div>

        <Common-PageFooter />
      </template>
    </Common-PageContainer>

    <!-- 部分退款 -->
    <van-dialog
      v-model="pagestatus.partRefund"
      title="退款金额"
      show-cancel-button
      :beforeClose="F_cancelPartRefund"
      @cancel="data.refundmoney = ''"
      @confirm="F_refundPartMoney"
    >
      <div class="form-group refund-confirm">
        <div class="c noborder">
          <div class="input normal j-flex j-flex-center">
            <div class="imgicon"></div>

            <div class="yuanicon">
              <span class="fas fa-yen-sign"></span>
            </div>

            <div class="flex" @click="pagestatus.keyboardshow = true">
              <input
                type="text"
                v-model="data.refundmoney"
                disabled
                placeholder="点击输入退款金额"
              />
            </div>
          </div>
        </div>

        <div class="c lineto-txtlr noborder">
          <div class="input j-flex">
            <div class="tip-icon j-fc-blue">
              <span class="fas fa-info-circle"></span>
            </div>
            <div class="j-fc-gray tip-text">
              部分退款不退回已使用的优惠券
            </div>
          </div>
        </div>
      </div>
    </van-dialog>

    <van-number-keyboard
      theme="custom"
      v-model="data.refundmoney"
      :show="pagestatus.keyboardshow"
      :maxlength="6"
      @blur="pagestatus.keyboardshow = false"
      close-button-text="完成"
      :extra-key="['00', '.']"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {
      // 页面状态
      pagestatus: {
        // 部分退款
        partRefund: false,

        // 数字键盘
        keyboardshow: false
      },

      // 订单信息
      orderinfo: {},

      // 数据存放
      data: {
        // 折扣情况
        discountdetail: {},

        // 优惠券优先
        coupondiscount: {},

        // 部分退款
        refundmoney: ''
      }
    }
  },

  computed: mapState({
    // 商户机构信息存放
    merchantInfo (state) {
      return state.localData.merchantInfo
    }
  }),

  watch: {
    '$route.params.orderid' () {
      this.F_loadData()
    }
  },

  mounted () {
    this.F_loadData()
  },

  methods: {
    // 取消部分退款
    F_cancelPartRefund (action, done) {
      if (action === 'cancel') {
        done(true)
        return
      }

      if (!this.data.refundmoney) {
        this.$toast('进输入退款金额')
        done(false)
        return
      }

      if (this.data.refundmoney > this.orderinfo.realAmount) {
        this.$toast('退款金额不能大于收款金额')
        done(false)
        return
      }

      done(true)
    },

    // 加载订单详情数据
    async F_loadData () {
      this.$Common.showLoading(true)

      const data = await this.$Api.merchant.getOrderDetail(
        this.$route.params.id
      )

      this.$Common.showLoading(false)

      // console.log('订单详情', data)

      if (data.code === 2000) {
        this.orderinfo = data.result

        // 折扣数据提取 discountType = 0 为优惠券抵扣 1为折扣
        this.orderinfo.discounts.map((item) => {
          if (item.discountType === 0) {
            this.data.coupondiscount = item
          }

          if (item.discountType === 1) {
            this.data.discountdetail = item
          }
        })
        return
      }

      this.$toast('订单数据加载失败')
    },

    // 全额退款
    F_refundOrder () {
      this.$dialog.confirm({
        title: '退款确认',
        message: '确定将支付金额（' + this.orderinfo.realAmount + '元)退回吗'
      }).then(() => {
        this.F_refundOrderConfirm()
      }).catch(() => {
        // on cancel
      })
    },

    // 全额退款确认
    async F_refundOrderConfirm () {
      this.$Common.showLoading(true)

      // refundType:
      const data = await this.$Api.merchant.refundOrder({
        orderId: this.orderinfo.id,
        refundAmount: this.orderinfo.realAmount
      })

      this.$Common.showLoading(false)

      if (data.code === 2000) {
        this.$toast('退款成功')

        this.F_loadData()
        return
      }

      this.$toast(data.message)
    },

    // 部分退款
    async F_refundPartMoney () {
      // 金额大于 或者 为输入金额
      if (
        !this.data.refundmoney ||
        this.data.refundmoney > this.orderinfo.realAmount
      ) {
        return
      }

      this.$Common.showLoading(true)

      // refundType:
      const data = await this.$Api.merchant.refundOrder({
        orderId: this.orderinfo.id,
        refundAmount: this.data.refundmoney
      })

      this.$Common.showLoading(false)

      if (data.code === 2000) {
        this.$toast('退款成功')

        this.F_loadData()
        return
      }

      this.$toast(data.message)
    }
  }
}
</script>

<style lang="scss" scoped>
.container{
  background: #FFF;
}

.van-number-keyboard{
  z-index: 100000;
}

.btn-divide{
  width: 10px;
}

.refund-confirm{
  input{
    font-size: 20px;
  }

  .yuanicon{
    margin-right: 10px;
  }

  .tip-icon{
    margin-right: 8px;
  }
  .tip-text{
    font-size: 12px;
  }
}
</style>
