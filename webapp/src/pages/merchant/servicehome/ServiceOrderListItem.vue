<template>
  <div class="c lineto-txtlr noborder">
    <div class="input j-flex j-flex-center">
      <div class="flex">
        <div class="title">
          <div class="j-flex">
            <div class="flex">
              服务编号：{{ orderinfo.serviceCode || '' }}
            </div>

            <div
              v-if="orderinfo.beCharged"
            >
              <van-tag type="primary">代持</van-tag>
            </div>
          </div>
        </div>

        <div class="j-flex">
          <div class="flex">
            <div class="j-fc-gray">
              {{ orderinfo.createTime || '' }}
            </div>
          </div>
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
              text-color="#808DA1"
            >
              {{ labelItem }}
            </van-tag>
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
