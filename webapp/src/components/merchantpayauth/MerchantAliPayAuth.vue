<template>
  <van-popup
    v-model="pagestatus.show"
    round
    position="bottom"
    closeable
    close-icon-position="top-right"
    :style="{ height: '80%' }">

    <div class="container j-flex j-flex-vtc">
      <div class="title">支付宝商户授权</div>

      <div class="flex">
        <div class="j-fullcontent">
          <div class="j-fullscrollcontent">
            111111
          </div>
        </div>

      </div>
    </div>

  </van-popup>
</template>

<script>
/**
 * 支付宝商家授权
 */
export default {
  name: 'MerchantAliPayAuth',

  data () {
    return {
      // 页面状态控制
      pagestatus: {
        show: false
      },

      // 数据存放对象
      data: {

      }
    }
  },

  mounted () {

  },

  methods: {
    // 查询用户商户机构信息
    async F_loadUserMerchantServiceInfo () {
      const data = await this.$Api.userinfo.checkMyMerchantService()

      // @hasmerchantservice 如果有机构 服务商身份则上传事件
      // console.log('商户机构信息', data)

      let flag = false

      if (data.code === 2000) {
        flag = (data.result.merchantList && data.result.merchantList.length > 0) ||
          (data.result.serviceOrgList && data.result.serviceOrgList.length > 0)

        this.data.merchant = data.result.merchantList || []
        this.data.service = data.result.serviceOrgList || []
      }

      this.$emit('hasmerchantservice', flag)
    },

    // 打开窗口
    F_show () {
      // 如果为单个 商户 或者 单个机构 则直接跳转
      if (this.data.merchant.length === 0 && this.data.service.length === 1) {

      }

      if (this.data.merchant.length === 1 && this.data.service.length === 0) {

      }

      // 多个则进行选择 自行跳转
      this.pagestatus.show = true
    },

    // 隐藏窗口
    F_hide () {
      this.pagestatus.show = false
    },

    // 选择身份 并跳转
    F_confirmSelect (merchantinfo, type) {
      this.$store.commit('updateLocalData', {
        merchantInfo: {
          id: merchantinfo.id,
          type: type,
          name: merchantinfo.name,
          principal: merchantinfo.principal
        }
      })

      this.$router.push('/merchant')
    }
  }
}
</script>

<style lang="scss" scoped>
.title{
  font-size: 18px;
  text-align: center;
  padding: 16px 0;
}

.container{
  width: 100%;
  height: 100%;
}
</style>
