<template>
  <div class="j-m">
    <div class="j-common-content searchdropdown-fix">
      <van-tabs color="#1989fa" v-model="pagestatus.showType">
        <van-tab title="收款记录" name="orderList">
          <div class="form-group nomargin-t">
            <MerchantOrderList ref="orderList" />
          </div>
        </van-tab>

        <van-tab title="优惠券核销" name="couponList">
          <div class="form-group nomargin-t">
            <MerchantCouponList ref="couponList" />
          </div>
        </van-tab>

        <van-tab disabled></van-tab>

        <van-tab disabled></van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import MerchantOrderList from './MerchantOrderList.vue'
import MerchantCouponList from './MerchantCouponList.vue'

export default {
  components: {
    MerchantOrderList,
    MerchantCouponList
  },

  data () {
    return {
      // 页面状态控制
      pagestatus: {
        // 当前显示的列表类型
        showType: 'orderList'
      }
    }
  },

  methods: {
    // 加载数据
    F_loadData () {
      this.$refs[this.pagestatus.showType].F_loadData()
    },

    // 重置列表
    F_reset () {
      this.$refs.[this.pagestatus.showType].F_reset()
    }
  }
}
</script>

<style scoped>
.searchdropdown-fix >>> .van-popup--top{
  width: auto;
  left: 16px;
  right: 16px;
}
</style>
