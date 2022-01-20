<template>
  <div>
    <Common-PageContainer>
      <template #content>
        <div class="container">
          <van-cell-group>
            <van-cell title="订单号" :value="orderinfo.orderno" />
            <van-cell title="支付状态">
              <template #default>
                <span>已支付</span>
                <span class="j-fc-blue">已退款</span>
              </template>
            </van-cell>

            <van-cell title="支付类型">
              <template #default>
                <span>{{ orderinfo.paytype == 1 ? '线上支付' : '线下支付' }}</span>
              </template>
            </van-cell>

            <van-cell title="支付时间" :value="orderinfo.refuntdate" />
            <van-cell title="消费金额" :value="orderinfo.ordermoney" />
            <van-cell title="优惠金额" :value="orderinfo.discount" />
            <van-cell title="支付金额" :value="orderinfo.paymoney" />

            <van-cell title="退款类型">
              <template #default>
                <span>{{ orderinfo.refundtype == 1 ? '全额退款' : '部分退款' }}</span>
              </template>
            </van-cell>

            <van-cell title="退款金额" :value="orderinfo.refundmoney" />
            <van-cell title="折扣情况" :value="orderinfo.peroff" />
            <van-cell title="优惠券抵扣金额" value="10元" />
            <van-cell title="结算人" value="退役军人" />
          </van-cell-group>

          <Common-PageDevideHeight />
          <Common-PageDevideHeight />

          <div class="j-m">
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
        refundmoney: ''
      }
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
    // 加载订单详情数据
    F_loadData () {
      this.$Common.showLoading(true)

      const orderinfo = {
        orderno: '33465202103311354000',
        createDate: '2021-05-13 10:16',
        ordermoney: '320.00元',
        paytype: 1,
        paymoney: '100.00元',
        discount: '220.00元',
        refundtype: 1,
        refuntdate: '2021-05-13 10:16',
        refundmoney: '100.00元',
        peroff: '9折',

        coupon: { id: '1', name: '余杭优惠券3', start_time: '2021-05-12 14:02:07', end_time: '2021-05-12 14:02:07', discount_amount: '10.00', threshold_amount: '11.00', area_code: '22222', serviceman_type: '1,2,3,4', give_out_time: '2021-05-12 14:02:07', rel_type: '1', give_out_count: '100', merchant_type: '1,2,3,4', create_time: '2021-05-12 14:02:07', create_user: '1', update_time: '2021-05-12 14:02:07', update_user: '1', active: '0', use_status: 2 },

        merchant: {
          name: '外婆家',
          phone: '18757382422',
          address: '瓜山东苑',
          opentime: '08:00～10:00'
        }
      }

      setTimeout(() => {
        this.$Common.showLoading(false)

        this.orderinfo = orderinfo
      }, 1000)
    },

    // 全额退款
    F_refundOrder () {
      this.$dialog.confirm({
        title: '退款确认',
        message: '确定将支付金额（200元)退回吗'
      }).then(() => {
        // on confirm
      }).catch(() => {
        // on cancel
      })
    },

    // 部分退款
    F_refundPartMoney () {

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
