<template>
  <div class="c lineto-txtlr noborder">
    <div
      class="input addon j-flex j-flex-center"
      @click="$router.push('/merchant/orderdetail/' + orderinfo.id)">
      <div class="flex">
        <div class="title">
          订单号：{{ orderinfo.orderCode || '' }}
        </div>

        <div class="j-flex">
          <div class="flex">
            <div class="j-fc-gray">
              支付金额：{{ orderinfo.realAmount || '' }}元
            </div>

            <!-- 已支付 -->
            <div v-if="orderinfo.payStatus == 2" class="j-fc-gray">
              已支付：{{ orderinfo.payTypeStr || '' }}
            </div>

            <!-- 已退款 -->
            <div v-if="orderinfo.payStatus == 4" class="j-fc-blue">
              {{ orderPayStatus }}
            </div>

            <!-- 退款中 -->
            <div v-if="orderinfo.payStatus == 3" class="j-fc-red">
              {{ orderPayStatus }}
            </div>

            <!-- 其他状态 -->
            <div
              v-if="orderinfo.payStatus != 2 && orderinfo.payStatus != 3 && orderinfo.payStatus != 4"
              class="j-fc-gray"
            >
              {{ orderPayStatus }}
            </div>

            <div class="j-fc-gray">
              {{ orderinfo.payTime || '' }}
            </div>

            <div>
              <div
                v-for="(labelItem,labelIndex) in orderinfo.discountDetails"
                :key="labelIndex"
                class="label-container">
                <van-tag
                  type="primary"
                  size="large"
                  color=" rgba(128,141,161,0.10)"
                  text-color="#808DA1">
                  {{ labelItem.indexOf('折') !== -1 ? parseFloat(labelItem) + '折' : labelItem }}
                </van-tag>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    orderinfo: {
      type: Object,
      default () {
        return {}
      },
      required: true
    }
  },

  computed: {
    // 支付状态对应文字
    orderPayStatus () {
      return this.$Config.enumConfig.payorderstatus[this.orderinfo.payStatus]
    }
  }
}
</script>

<style lang="scss" scoped>
.title{
  font-size: 14px;
}

.label-container{
  display: inline-block;
  margin: 0 4px 4px 0;
}

.van-tag--large {
  font-size: 12px;
}
</style>
