<template>
  <div class="c lineto-txtlr noborder">
    <div
      class="input addon j-flex j-flex-center"
      @click="$router.push('/merchant/usedcoupondetail/' + orderinfo.id)">
      <div class="flex">
        <div class="title">
          关联订单号：{{ orderinfo.code }}
        </div>

        <div class="j-flex">
          <div class="flex">
            <div class="j-fc-gray">
              {{ orderinfo.name }}
            </div>

            <div class="j-fc-gray">
              抵扣金额：{{ orderinfo.discountAmount }}元
            </div>

            <div class="j-fc-gray">
              核销时间：{{ orderinfo.useTime }}
            </div>

            <div>
              <div
                v-for="(labelItem,labelIndex) in orderinfo.labels"
                :key="labelIndex"
                class="label-container">
                <van-tag
                  type="primary"
                  size="large"
                  color=" rgba(128,141,161,0.10)"
                  text-color="#808DA1"
                  >{{ labelItem }}</van-tag
                >
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
