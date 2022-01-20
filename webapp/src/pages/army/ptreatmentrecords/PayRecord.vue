<template>
  <div class="contianer j-flex j-flex-vtc">
    <div class="content">
      <div class="more" @click="F_renfundTipDialog">
        <span class="fas fa-info-circle"></span> 退款说明
      </div>

      <van-tabs color="#1989fa" v-model="pagestatus.showType" sticky>
        <van-tab title="全部" name="all"></van-tab>

        <van-tab title="未支付" name="unpay"></van-tab>

        <van-tab title="已支付" name="paysuccess"></van-tab>

        <van-tab title="已退付" name="refund"></van-tab>

        <van-tab disabled></van-tab>
        <van-tab disabled></van-tab>
        <van-tab disabled></van-tab>
      </van-tabs>
    </div>

    <div class="flex">
      <!-- 全部 -->
      <PayRecord v-show="pagestatus.showType === 'all'"></PayRecord>

      <!-- 未支付 -->
      <PayRecord
        v-if="data.payStatus.unpay.loaded === true"
        v-show="pagestatus.showType === 'unpay'"
        :paystatus="'0'"></PayRecord>

      <!-- 已支付 -->
      <PayRecord
        v-if="data.payStatus.paysuccess.loaded === true"
        v-show="pagestatus.showType === 'paysuccess'"
        :paystatus="'2'"></PayRecord>

      <!-- 已退款 -->
      <PayRecord
        v-if="data.payStatus.refund.loaded === true"
        v-show="pagestatus.showType === 'refund'"
        :paystatus="'4'"></PayRecord>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import PayRecord from './PayRecordList.vue'

export default {
  components: {
    PayRecord
  },
  data () {
    return {
      pagestatus: {
        showType: 'all'
      },

      data: {
        // 支付状态
        payStatus: {
          // 全部
          all: { loaded: true, status: '' },

          // 未支付
          unpay: { loaded: true, status: '0' },

          // 已支付
          paysuccess: { loaded: true, status: '2' },

          // 已退款
          refund: { loaded: true, status: '4' }
        }
      }
    }
  },

  computed: mapState({
    // url参数解析
    GET: 'GET',

    // 当前军人用户信息
    armyInfo (state) {
      return state.localData.armyInfo
    },

    // 当前军人用户信息
    userInfo (state) {
      return state.localData.Userinfo
    },

    // 浏览器环境参数
    browerEnvStatus: 'browerEnvStatus'
  }),

  watch: {
    'pagestatus.showType' (newV) {
      // console.log(newV)
      this.data.payStatus[newV].loaded = true
    }
  },

  mounted () {

  },

  methods: {
    // 退款弹窗说明
    F_renfundTipDialog () {
      const html = '<div style="text-align: left;">1.您需要与商家进行沟通之后，由商家为您进行退款<br><br>2.若您使用了优惠券，退款时商家在应用内发起全额退款时，您使用的优惠券也会被退回<br><br>3.已支付的订单在支付30天之后无法退款</div>'
      this.$dialog.alert({
        title: '退款说明',
        message: html
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.contianer {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: #FFF;

  .content{
    position: relative;
  }

  .more {
    position: absolute;
    right: 16px;
    top: 14px;
    color: #808da1;
    z-index: 1;
  }
}
</style>

<style scoped>
.van-tabs >>> .van-tab .van-tab__text--ellipsis{
  font-size: 14px;
}

.van-tabs >>> .van-tab.van-tab--active .van-tab__text--ellipsis{
  font-size: 16px;
}
</style>
