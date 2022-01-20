<template>
  <div>
    <!-- 商家端 -->
    <MerchantHome v-if="merchantType == 'merchant'" />

    <!-- 服务机构端 -->
    <ServiceHome v-if="merchantType == 'service'" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import MerchantHome from '../merchanthome/MerchantHome.vue'
import ServiceHome from '../servicehome/ServiceHome.vue'

export default {
  components: {
    MerchantHome,
    ServiceHome
  },

  computed: mapState({
    // 用户类型 merchant商家 service服务机构
    merchantType (state) {
      return state.localData.merchantInfo.type
    },

    // 商户信息
    merchantInfo (state) {
      return state.localData.merchantInfo
    }
  }),

  mounted () {
    // 暂时初始化默认进商户 =
    if (!this.merchantType) {
      const merchantInfo = Object.assign({}, this.merchantInfo)
      merchantInfo.type = 'service'
      this.$store.commit('updateLocalData', { merchantInfo: merchantInfo })
    }
  }
}
</script>

<style>
</style>
