<template>
  <div>
    <Common-PageContainer>
      <template #content>
        <div class="container">
          <div class="headerbk"></div>

          <div
            v-if="pagestatus.showcouponunabled"
            class="headertip"
          >
            <div class="j-m j-flex">
              <div class="tipicon">
                <span class="fas fa-info-circle"></span>
              </div>
              <div class="flex">余杭区优惠券 无法使用</div>
            </div>
          </div>

          <div class="content">
            <div class="topheightfix"></div>

            <div class="form-group form-group-box">
              <div class="c lineto-txtlr">
                <div class="input j-flex j-flex-center">
                  <div class="icon-mrfix">
                    <span class="imgicon imgicon-paymoney"></span>
                  </div>

                  <div class="flex labelname">消费金额</div>

                  <div class="right-text">
                    {{ parseFloat(data.orderinfo.totalAmount) }}元
                  </div>
                </div>
              </div>
            </div>

            <div class="form-group form-group-box form-group-box-shadow">
              <div class="c lineto-txtlr">
                <div class="input j-flex j-flex-center">
                  <div class="icon-mrfix">
                    <span class="imgicon imgicon-discount"></span>
                  </div>

                  <div class="flex labelname">折扣优惠</div>

                  <div class="right-text">
                    {{ discount || '无折扣优惠' }}
                  </div>
                </div>
              </div>

              <div class="c noborder lineto-txtlr">
                <div class="input addon j-flex j-flex-center">
                  <div class="flex">
                    <div>
                      <div
                        @click="F_showCouponSelect"
                        class="j-flex j-flex-center">
                        <div class="icon-mrfix">
                          <span class="imgicon imgicon-package"></span>
                        </div>

                        <div class="flex labelname">优惠券</div>

                        <div class="right-text">
                          <van-button
                            v-if="data.coupons.length <= 0"
                            size="small"
                            round
                            type="warning"
                            :disabled="true"
                          >
                            当前无可用优惠券
                          </van-button>
                        </div>
                      </div>

                      <!-- 用户有可用优惠券 -->
                      <div
                        v-if="data.coupons.length > 0"
                        class="j-fc-gray coupon-tiptext"
                      >
                        您可以在选择优惠券页选择其他优惠券或取消选择
                      </div>

                    </div>
                  </div>
                </div>

                <div v-if="data.coupon.id">
                  <Coupon
                    :showbtn="false"
                    :coupon="data.coupon"
                  />
                </div>
              </div>
            </div>

            <div class="form-group form-group-box form-group-box-shadow">
              <div class="c lineto-txtlr">
                <div class="input j-flex j-flex-center">
                  <div class="flex labelname">支付金额</div>

                  <div class="right-text">已优惠：</div>
                  <div class="right-text right-mrfix j-fc-blue">
                    {{ dicountmoney }}元
                  </div>

                  <div class="right-text">需支付：</div>
                  <div class="right-text j-fc-blue">
                    {{ finalpaymoney }}元
                  </div>
                </div>
              </div>
            </div>

            <div class="j-m bottom-paytip j-fc-gray">
              最后付款以支付金额为准
            </div>
          </div>

          <Common-PageDevideHeight />
          <Common-PageDevideHeight />
          <Common-PageDevideHeight />

          <div class="j-m">
            <div class="j-flex j-flex-center">
              <div class="flex">
                <van-button
                  plain
                  block
                  type="info"
                  @click="F_payOffline"
                >线下支付</van-button>
              </div>

              <div class="paybtn-divide"></div>

              <div class="flex">
                <van-button block type="info" @click="F_onlinePay">
                  <span class="fab fa-alipay"></span> 线上支付
                </van-button>
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

    <SelectCoupon
      ref="selectcoupon"
      :coupons="data.coupons"
      @select="F_selectCoupon"
    />

    <!-- 支付宝H5支付表单数据html存放 -->
    <div ref="payform" v-html="data.alipayh5formhtml" class="alipayh5formhtml"></div>
  </div>
</template>

<script>
// import thirdauth from '@/assets/js/thirdauthtool/thirdauth'
import { mapState } from 'vuex'
import Coupon from '@/components/coupon/Coupon.vue'
import SelectCoupon from '../mycoupons/SelectCoupon.vue'

export default {
  components: {
    Coupon,
    SelectCoupon
  },
  data () {
    return {
      // 页面状态控制
      pagestatus: {
        loading: false,

        // 查看订单是否可支付
        canpay: false,

        // 是否提示 当前选择的优惠券无法使用
        showcouponunabled: false
      },

      // 表单提交对象
      formdata: {
        // 优惠券ID
        couponid: ''
      },

      // 数据存放对象
      data: {
        // 优惠券信息
        coupon: {},

        // 订单信息
        orderinfo: {},

        // 商家信息
        merchantinfo: {},

        // 订单可使用的优惠券列表
        coupons: [],

        // 支付宝H5支付表单html数据
        alipayh5formhtml: '',

        // 继续支付订单 支付宝tradeno暂存
        alipaytradenod: ''
      }
    }
  },

  computed: mapState({
    GET: 'GET',
    browerEnvStatus: 'browerEnvStatus',

    // 折扣信息
    discount () {
      return this.data.orderinfo.discount || this.data.orderinfo.discount === 0
        ? this.data.orderinfo.discount + '折'
        : '无折扣'
    },

    // 最终优惠金额
    dicountmoney () {
      let discountMoney = 0

      if (this.data.orderinfo.discountsTotalAmount) {
        discountMoney += parseFloat(this.data.orderinfo.discountsTotalAmount)
      }

      // 用户选择优惠券
      if (this.data.coupon.id) {
        discountMoney += this.data.coupon.discountAmount
      }

      return parseFloat(discountMoney || 0).toFixed(2)
    },

    // 最终须支付金额
    finalpaymoney () {
      let finalmoney = this.data.orderinfo.realAmount

      // 用户选择优惠券
      if (this.data.coupon.id) {
        finalmoney -= this.data.coupon.discountAmount
      }

      return parseFloat(finalmoney || 0).toFixed(2)
    }
  }),

  watch: {
    // 监听订单变化
    '$route.query.orderid' () {
      this.F_loadPayOrderInfo()
    }
  },

  mounted () {
    // 加载支付订单信息
    if (this.$route.query.orderid) {
      this.F_loadPayOrderInfo()
    } else {
      this.$toast('无待支付订单信息，请重新扫码或者出示老兵码付款')
    }
  },
  methods: {
    // 获取支付订单信息
    async F_loadPayOrderInfo () {
      this.$Common.showLoading(true)

      const data = await this.$Api.army.merchant.getMerchantOrderDetail(
        this.$route.query.orderid
      )

      this.$Common.showLoading(false)

      if (data.code === 2000) {
        // 订单状态不为0 则无法进行支付
        if (data.result.payStatus !== 0) {
          this.$toast('当前订单无法再次支付')

          this.F_errorOrderJump()
          return
        }

        this.data.orderinfo = data.result

        this.F_loadCouponData()
        return
      }

      this.$toast('订单数据请求失败')
    },

    // 加载优惠券数据
    async F_loadCouponData () {
      const data = await this.$Api.army.getPayOrderCouponList(
        this.$route.query.orderid
      )

      if (data.code === 2000) {
        this.data.coupons = data.result || []

        this.data.coupons.sort((a, b) => {
          return b.discountAmount - a.discountAmount
        })

        console.log(this.data.coupons)

        // 用户选择了优惠券 并且优惠券 在列表中 自动选择上
        if (this.$route.query.couponid) {
          this.data.coupons.map((item) => {
            if (item.id === parseInt(this.$route.query.couponid)) {
              this.data.coupon = item
            }
          })
        }

        // console.log('优惠券', this.data.coupon)

        // 用户有优惠券 自动选择 面额最大的一张
        if (!this.data.coupon.id && this.data.coupons.length > 0) {
          this.data.coupon = this.data.coupons[0]
        }

        // 如果选择了 优惠券 则勾选上 列表的选择项
        if (this.data.coupon && this.data.coupon.id) {
          this.$refs.selectcoupon.F_setDefaultCoupon(
            this.data.coupon
          )
        }
        return
      }

      this.$toast('优惠券信息获取失败')
    },

    // 显示优惠券选择
    F_showCouponSelect () {
      if (this.data.coupons.length <= 0) {
        return
      }

      this.$refs.selectcoupon.F_show()
    },

    // 优惠券选择回调
    F_selectCoupon (coupon) {
      this.data.coupon = coupon

      // console.log('选择了优惠券', coupon)
    },

    /**
     * 线上支付
     */
    F_onlinePay () {
      // this.F_alipayH5pay()

      if (this.browerEnvStatus.zlb) {
        this.F_alipayH5pay()
        return
      }

      this.F_alipayCreatePayOrder()
    },

    // 支付宝 H5支付 浙里办App内
    async F_alipayH5pay () {
      this.$Common.showLoading(true)

      // location.protocol + '//' + location.host
      let domainUrl = location.href.split('#')[0].split('?')[0]

      // 支付成功跳转地址
      const redirectUrlPram = {}
      const quitUrlParam = {}

      // 调试模式
      if (this.GET.debug) {
        domainUrl += '?debug=true'
      }

      redirectUrlPram.action = 'jumpurl'
      redirectUrlPram.url = '/army/ptreatment'
      redirectUrlPram.t = new Date().getTime()

      const redirectUrlParamStr = this.$Common.KhttpBuildQuery(redirectUrlPram)
      const redirectUrl = domainUrl + (domainUrl.indexOf('?') !== -1 ? redirectUrlParamStr.replace('?', '&') : redirectUrlParamStr)

      // 取消支付跳转地址
      quitUrlParam.action = 'jumpurl'
      quitUrlParam.url = '/army/pay/payconfirm' + this.$Common.KhttpBuildQuery(this.$route.query)
      quitUrlParam.t = new Date().getTime()
      const quitUrlParamStr = this.$Common.KhttpBuildQuery(quitUrlParam)
      const quitUrl = domainUrl + (domainUrl.indexOf('?') !== -1 ? quitUrlParamStr.replace('?', '&') : quitUrlParamStr)

      // console.log(redirectUrl, quitUrl)

      const data = await this.$Api.pay.payOfflineOrder({
        // 订单ID
        orderId: this.data.orderinfo.id,

        // 优惠券ID
        couponDetailId: this.data.coupon.id || '',

        // 线上支付类型 支付宝
        payType: 1,

        // 支付完成跳转地址
        returnUrl: redirectUrl,

        // 用户取消支付跳转地址
        quitUrl: quitUrl
      })

      if (data.code !== 2000) {
        this.$Common.showLoading(false)
        this.$toast(data.message)
        return
      }

      console.log(redirectUrl, quitUrl)

      // const h5PayFormHtml = '<form action="" method="post"></form>'
      this.data.alipayh5formhtml = data.result

      // 等待表单
      setTimeout(() => {
        this.$Common.showLoading(false)

        const $form = this.$refs.payform.querySelector('form')

        if ($form) {
          $form.submit()
          return
        }

        this.$toast('支付订单创建失败')
      }, 100)
    },

    // 支付宝线下收单支付 支付宝小程序内 支付宝H5内使用
    async F_alipayCreatePayOrder () {
      let data = {}

      // 如果用户已经生成的支付订单 则直接继续使用 原tradeno
      if (this.data.alipaytradenod) {
        data = {
          result: this.data.alipaytradenod
        }
      } else {
        // alert('线下收单')
        this.$Common.showLoading(true)

        data = await this.$Api.pay.payOfflineOrder({
          // 订单ID
          orderId: this.data.orderinfo.id,

          // 优惠券ID
          couponDetailId: this.data.coupon.id || '',

          // 线上支付类型 1支付宝
          payType: 1

          // 支付完成跳转地址
          // returnUrl: redirectUrl,

          // 用户取消支付跳转地址
          // quitUrl: quitUrl
        })

        this.$Common.showLoading(false)

        if (data.code !== 2000) {
          this.$toast(data.message)
          return
        }
      }

      console.log(data)

      // 支付宝h5内 进行支付唤起测试
      if (this.browerEnvStatus.alipayh5) {
        window.ap.tradePay({
          tradeNO: data.result
        }, (res) => {
          if (res.resultCode === 9000 || res.resultCode === '9000') {
            this.$toast('支付成功')

            this.F_finishPayJump()
          } else {
            this.data.alipaytradenod = data.result
          }
        })
        return
      }

      window.my.tradePay({
        tradeNO: data.result,
        success: (res) => {
          if (res.resultCode === 9000 || res.resultCode === '9000') {
            this.$toast('支付成功')

            this.F_finishPayJump()
          } else {
            this.data.alipaytradenod = data.result
          }
        },
        fail: (res) => {
          this.data.alipaytradenod = data.result
        }
      })
    },

    // 线下支付
    F_payOffline () {
      this.$dialog.confirm({
        title: '线下支付确认',
        message: '请与商家核实支付金额<span class="j-fc-red">（合计¥' + this.finalpaymoney + '）</span>并在线下完成支付。'
      }).then(async () => {
        this.$Common.showLoading(true)

        const data = await this.$Api.pay.payOfflineOrder({
          // 订单ID
          orderId: this.data.orderinfo.id,

          // 优惠券ID
          couponDetailId: this.data.coupon.id || '',

          // 线下支付类型
          payType: 0
        })

        this.$Common.showLoading(false)

        if (data.code === 2000) {
          this.$toast('支付成功')
          this.F_finishPayJump()
          return
        }

        this.$toast(data.message)
      }).catch(() => {

      })
    },

    // 支付完成跳转
    F_finishPayJump () {
      setTimeout(() => {
        this.$router.push('/army/ptreatment')
      }, 1000)
    },

    // 订单无法支付 统一跳转处理
    F_errorOrderJump () {
      setTimeout(() => {
        this.$router.back()
      }, 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
.alipayh5formhtml{
  display: none;
}

.container{
  background: #FFF;
}

.paybtn-divide{
  width: 10px;
}

.content{
  position: relative;
  z-index: 1;

  .input{
    line-height: 1.6;
  }

  .topheightfix{
    height: 65px;
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
    text-align: center;
    margin-top: 4px;
    font-size: 12px;
  }

  .right-mrfix{
    margin-right: 8px;
  }

  .bottom-paytip{
    text-align: right;
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
.imgicon-discount{
  background-image: url(../../../assets/img/ic_zkxx@3x.png);
}
.imgicon-package{
  background-image: url(../../../assets/img/ic_yhq@3x.png);
}

.headertip{
  position: absolute;
  left: 0;
  right: 0;
  z-index: 1;
  padding: 10px 0;
  font-size: 14px;
  background: rgba(0,0,0,.2);
  color: #FFF;

  .tipicon{
    margin-right: 10px;
  }
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
