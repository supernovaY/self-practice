<template>
  <div>
    <Common-PageContainer>
      <template #content>
        <div class="container">
          <div class="headerbk"></div>

          <div class="content">
            <div class="topheightfix"></div>

            <div class="merchantname j-common-txtoverflow">
              <span class=""><span class="fas fa-store"></span> {{ data.merchantInfo.name }}</span>
            </div>
            <div class="form-group form-group-box form-group-box-shadow">
              <div class="c noborder">
                <Common-PageDevideHeight />

                <div class="input j-flex j-flex-center">
                  <div class="icon-mrfix">
                    <span class="imgicon imgicon-paymoney"></span>
                  </div>

                  <div class="flex labelname">消费金额</div>

                  <div class="right-text"></div>
                </div>

                <div class="input normal j-flex j-flex-center">
                  <div class="imgicon"></div>

                  <div class="yuanicon">
                    <span class="fas fa-yen-sign"></span>
                  </div>

                  <div class="flex">
                    <input
                      type="text"
                      v-model="data.paymoney"
                      readonly
                      placeholder="点击输入订单金额"
                      @click="pagestatus.keyboardshow = true"
                    />
                  </div>
                </div>
              </div>

              <div class="c lineto-txtlr">
                <div class="input coupon-tiptext">
                  <div class="j-fc-gray">
                    消费金额为您本次购买的全部商品的总金额
                  </div>
                </div>

                <div class="input">
                  <Common-PageDevideHeight />

                  <van-button
                    block
                    type="info"
                    :disabled="pagestatus.paybtn"
                    @click="F_jumpToPayConfirm">
                    下一步
                  </van-button>

                  <Common-PageDevideHeight />
                  <Common-PageDevideHeight />
                </div>
              </div>
            </div>
          </div>

          <Common-PageDevideHeight />
          <Common-PageDevideHeight />
          <Common-PageDevideHeight />
        </div>

        <Common-PageFooter />
      </template>
    </Common-PageContainer>

    <van-number-keyboard
      theme="custom"
      v-model="data.paymoney"
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
      // 页面状态控制
      pagestatus: {
        loading: false,

        // 数字键盘
        keyboardshow: false,

        // 支付按钮是否可点击
        paybtn: true
      },

      // 数据存放对象
      data: {
        // 订单金额
        paymoney: '',

        // 商家信息
        merchantInfo: {}
      }
    }
  },

  computed: mapState({
    GET: 'GET',
    browerEnvStatus: 'browerEnvStatus',

    // 当前军人用户信息
    armyInfo (state) {
      return state.localData.armyInfo
    },

    // 当前用户信息
    Userinfo (state) {
      return state.localData.Userinfo
    }
  }),

  watch: {
    // 监听商家变化
    '$route.query.merchantid' (newV) {
      this.pagestatus.paybtn = !newV

      if (this.pagestatus.paybtn) {
        this.F_loadMerchantInfo()
      } else {
        this.data.merchantInfo.name = ''
      }
    }
  },

  mounted () {
    if (!this.$route.query.merchantid) {
      this.$toast('无效商家码，无法付款')
      return
    }

    this.F_loadMerchantInfo()
    this.pagestatus.paybtn = false
  },

  methods: {
    // 加载商家信息
    async F_loadMerchantInfo () {
      const data = await this.$Api.army.merchant.getMerchantInfo(this.$route.query.merchantid)

      console.log(data)

      if (data.code === 2000) {
        this.data.merchantInfo = data.result
        return
      }

      this.pagestatus.paybtn = true
      this.$toast('商家信息加载失败')
    },

    // 跳转支付确认页
    async F_jumpToPayConfirm () {
      if (this.data.paymoney === '') {
        this.$toast('请输入订单金额')
        this.pagestatus.keyboardshow = true
        return
      }

      this.$Common.showLoading(true)

      const data = await this.$Api.merchant.createPayOrder({
        amount: this.data.paymoney,
        merchantId: this.$route.query.merchantid, // 测试商户ID2
        exServicemanId: this.armyInfo.id,
        // 订单创建类型 商家扫码收款1 用户扫码支付2
        orderType: 2
      })

      this.$Common.showLoading(false)

      if (data.code !== 2000) {
        this.$toast(data.message)
        return
      }

      this.$router.push('/army/pay/payconfirm' +
        this.$Common.KhttpBuildQuery({
          orderid: data.result
        })
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.container{
  background: #FFF;
}

.paybtn-divide{
  width: 10px;
}

.content{
  position: relative;
  z-index: 1;

  .merchantname{
    font-size: 18px;
    text-align: center;
    margin: 0 14px 0 14px;
    color:#FFF
  }

  .input{
    line-height: 1.6;
  }

  input{
    font-size: 16px;
  }

  .yuanicon{
    font-size: 16px;
    margin-right: 12px;
  }

  .topheightfix{
    height: 20px;
  }

  .icon-mrfix{
    margin-right: 8px;
  }

  .labelname{
    font-size: 16px;
  }

  .right-text{
    font-size: 14px;
  }

  .coupon-tiptext{
    font-size: 12px;
  }

  .right-mrfix{
    margin-right: 8px;
  }
}

.imgicon{
  display: block;
  width: 16px;
  height: 16px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}

.imgicon-paymoney{
  background-image: url(../../../assets/img/ic_xfje@3x.png);
}

.headerbk{
  background: url(../../../assets/img/img_zfqr_top@3x.png) no-repeat center top;
  background-size: 100% auto;
  position: absolute;
  left: 0;
  right: 0;
  width: 100%;
  height: 200px;
}
</style>
