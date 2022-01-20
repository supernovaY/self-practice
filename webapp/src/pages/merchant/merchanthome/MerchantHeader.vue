<template>
  <div>
    <div class="userinfobox">
      <div class="j-m headeruserinfo">
        <div class="j-flex j-flex-center">
          <div class="mr-8">
            <div class="avatar" :style="userAvatarStyle"></div>
          </div>

          <div class="flex">
            <span class="username">
              {{ merchantInfo.name }}
            </span>
          </div>

          <div class="messageicon">
            <router-link to="/merchant/message">
              <van-badge
                v-show="data.message > 0"
                :content="data.message"
                max="99"
              >
                <span class="fas fa-bell"></span>
              </van-badge>

              <span v-show="data.message <= 0" class="fas fa-bell"></span>
            </router-link>
          </div>

          <div class="fz-20">
            <router-link to="/merchant/userinfo">
              <span class="fas fa-user"></span>
            </router-link>
          </div>
        </div>
      </div>

      <Common-PageDevideHeight />

      <div class="j-m">
        <div class="contentbox j-common-content">
          <div class="toptab">
            <div
              :class="pagestatus.showType == 1 ? 'toptab-itembtn active' : 'toptab-itembtn'"
              @click="pagestatus.showType = 1">
              商家收银台
            </div>

            <div
              v-if="merchantInfo.principal"
              :class="pagestatus.showType == 2 ? 'toptab-itembtn active' : 'toptab-itembtn'"
              @click="pagestatus.showType = 2">
              商家码
            </div>
          </div>

          <!-- 收银台 -->
          <div v-show="pagestatus.showType == 1" class="content">
            <div class="moneyinput j-flex j-flex-center">
              <div class="flex">
                <div class="van-hairline--surround">
                  <div class="j-flex j-flex-center moneyinput-inputbox">
                    <div class="icon">
                      <span class="fas fa-cash-register"></span>
                    </div>

                    <div class="flex">
                      <div
                        class="j-fullcontent"
                        @click="pagestatus.keyboardshow = true"
                      ></div>

                      <input
                        type="text"
                        readonly
                        placeholder="请输入消费金额"
                        v-model="data.paymoney"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- <div class="btn">
                <van-button
                  block
                  type="info"
                  size="small"
                  @click="F_activeScanBtn"
                >确定</van-button>
              </div> -->
            </div>

            <Common-PageDevideHeight />

            <div class="j-fc-gray">
              消费金额为消费者本次购买的全部商品的总金额
            </div>

            <Common-PageDevideHeight />
            <Common-PageDevideHeight />

            <div
              :class="pagestatus.scanbtn ? '' : 'j-disabled-onlycolorgray'"
            >
              <div
                class="scan-btn j-flex j-flex-center"
                @click="F_createOrder"
              >
                <div class="flex">
                  <div>
                    <div class="imgicon-scan"></div>
                  </div>
                  <div class="scan-title">扫一扫</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 商家码 -->
          <div v-show="pagestatus.showType == 2" class="content">
            <div class="qrcode">
              <img ref="qrcode" :src="data.qrcode" />

              <!-- 二维码头像显示 -->
              <div class="j-fullcontent j-flex j-flex-center">
                <div class="flex">
                  <span class="merchant-avatar" :style="merchantAvatar"></span>
                </div>
              </div>
            </div>

            <div class="save-merchantqrcode">
              <span
                class="j-fc-blue"
                @click="$router.push('/merchant/qrcodesave')">
                保存商家码
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>

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
import QRCode from 'qrcode'
import thirdauth from '@/assets/js/thirdauthtool/thirdauth.js'

export default {
  data () {
    return {
      // 页面状态控制
      pagestatus: {
        keyboardshow: false,

        // 显示类型 1扫一扫 2商家码
        showType: 1,

        // 扫一扫是否可用
        scanbtn: false
      },

      // 数据存放对象
      data: {
        // 支付金额
        paymoney: '',

        // 消息数量
        message: 0,

        // 商家码
        qrcode: '',

        // 商家信息
        merchantinfo: {}
      }
    }
  },

  computed: mapState({
    GET: 'GET',

    // 用户头像样式
    userAvatarStyle () {
      return this.Userinfo.avatar ? 'background-image: url(' + this.Userinfo.avatar + ')' : ''
    },

    // 商家头像
    merchantAvatar () {
      let style = []

      if (
        this.data.merchantinfo.images &&
        this.data.merchantinfo.images.length > 0
      ) {
        style = [
          'background-image: url(',
          this.data.merchantinfo.images[0].url,
          ')'
        ]
      }

      return style.join('')
    },

    // 商户信息
    merchantInfo (state) {
      return state.localData.merchantInfo
    },

    // 用户信息
    Userinfo (state) {
      return state.localData.Userinfo
    }
  }),

  watch: {
    // 金额发生改变 置灰扫一扫
    'data.paymoney' (newV) {
      const paymoney = parseFloat(newV)
      this.pagestatus.scanbtn = paymoney && paymoney > 0
    },

    // 切换更新列表
    'pagestatus.showType' () {
      this.$emit('reset')
    }
  },

  deactivated () {

  },

  activated () {
    // 获取消息数量
    this.F_getMessageCount()

    this.data.paymoney = ''
  },

  mounted () {
    this.F_loadMerchantInfo()
    this.F_createQrcode()
  },

  methods: {
    // 获取商家信息
    async F_loadMerchantInfo () {
      const data = await this.$Api.merchant.getMerchantInfo(this.merchantInfo.id)

      if (data.code === 2000) {
        this.data.merchantinfo = data.result
        return
      }

      this.$toast('商家信息加载失败')
    },

    // 校验检测二维码是否可用
    async F_checkQrcode (qrcodedata, callback) {
      const data = await this.$Api.common.checkQrcode({
        code: qrcodedata.code,
        userType: qrcodedata.type,
        soldierId: qrcodedata.id
      })

      if (data.code === 2000) {
        callback()
        return
      }

      this.$toast('无效老兵码')

      this.pagestatus.errorStr = '老兵码认证失败'
      this.pagestatus.success = false
    },

    // 确认收款金额 后 激活扫一扫按钮
    F_activeScanBtn () {
      const paymoney = parseFloat(this.data.paymoney)
      this.pagestatus.scanbtn = paymoney && paymoney > 0
    },

    // 创建收款订单
    F_createOrder () {
      if (!this.pagestatus.scanbtn) {
        this.$toast('请输入收款金额')
        return
      }

      thirdauth.Scan((result) => {
        // alert(result)

        // 兼容IOS 使用 url编码传参数据
        const scanData = this.$Common.kgetUrlinfo(result)

        if (!scanData && !scanData.code) {
          this.$toast('无效二维码')
        }

        this.F_checkQrcode(scanData, async () => {
          const data = await this.$Api.merchant.createPayOrder({
            amount: this.data.paymoney,
            merchantId: this.merchantInfo.id,
            exServicemanId: scanData.id,
            // 订单创建类型 商家扫码收款1 用户扫码支付2
            orderType: 1
          })

          if (data.code === 2000) {
            this.$toast('收款订单创建成功，请提醒客户确认支付')
            return
          }

          this.$toast(data.message)
        })
      })
    },

    // 获取消息数量
    async F_getMessageCount () {
      const data = await this.$Api.message.unreadCount(this.Userinfo.id)

      if (data.code === 2000) {
        this.data.message = data.result
      }
    },

    // 初始化二维码
    F_createQrcode () {
      const url = window.location.href.split('#')[0].split('?')[0] +
        (this.GET.debug ? '?debug=true' : '') +
        '#/army/pay/payinputmeny' +
        this.$Common.KhttpBuildQuery({
          merchantid: this.merchantInfo.id
        })

      console.log(url)

      // 延迟处理 防止页面 卡顿
      setTimeout(() => {
        // this.$Common.KhttpBuildQuery(this.Userinfo)
        QRCode.toDataURL(url, {
          errorCorrectionLevel: 'H',
          margin: 1,
          color: { dark: '#404956' },
          width: 1080
        }).then(url => {
          // console.log(url)
          this.data.qrcode = url
        })
      }, 500)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/variables.scss';

.mr-8{
  margin-right: 8px;
}

.dividewidth-10{
  width: 10px;
}

.fz-20{
  font-size: 20px;
}

.save-merchantqrcode{
  text-align: center;
  margin-top: 10px;
  font-weight: bold;
}

.userinfobox {
  margin: 0;
  padding: 16px 0 0 0;
  background: url(../../../assets/img/img_sy_top@3x.png) no-repeat center top;
  background-size: 100% auto;

  .messageicon {
    margin: 0 20px 0 8px;
    font-size: 20px;
  }

  .username {
    display: inline-block;
    min-width: 45px;
    font-size: 14px;
  }

  .headeruserinfo {
    color: #fff;

    a {
      color: #fff;
    }
  }

  .avatar {
    display: inline-block;
    width: 30px;
    height: 30px;
    background: url(../../../assets/img/ic_mrtx@3x.png) no-repeat center center;
    background-size: cover;
    border-radius: 50%;
    border: 1px solid #fff;
    box-sizing: border-box;
  }

  .qrcode {
    text-align: center;
    position: relative;

    img {
      display: inline-block;
      width: 60%;
    }

    .merchant-avatar{
      display: inline-block;
      width: 35px;
      height: 35px;
      background: url(../../../assets/img/ic_mrtx@3x.png) no-repeat center center;
      border-radius: 4px;
      background-size: cover;
      border: 3px solid #FFF;
      box-sizing: border-box;
    }
  }
}

.contentbox {
  .content{
    padding: 16px;
  }

  .moneyinput{
    input{
      outline: none;
      border: none;
      font-size: 14px;
    }

    .btn{
      width: 50px;
      margin-left: 10px;
    }

    .icon{
      margin-right: 8px;
      font-size: 16px;
      color: $--color-gray;
    }

    .moneyinput-inputbox{
      padding: 10px 12px;
    }
  }

  .toptab{
    background: #F3FAFF;

    .toptab-itembtn{
      font-size: 14px;
      padding: 12px 16px;
      display: inline-block;
      color: $--color-gray;

      &:active{
        opacity: .5;
        background: #FFF;
      }

      &.active{
        background: #FFF;
        color: #1492FF;
      }
    }
  }

  .scan-btn{
    width: 126px;
    height: 126px;
    margin: 0 auto;
    background-image: linear-gradient(180deg, #83C5FF 0%, #1492FF 92%);
    border: 1px solid #FFFFFF;
    box-shadow: 0 6px 8px 0 rgba(75,119,238,0.36);
    border-radius: 50%;
    text-align: center;

    &:active{
      opacity: .5;
    }

    .imgicon-scan{
      display: inline-block;
      width: 36px;
      height: 36px;
      margin-bottom: 8px;
      background-position: center;
      background-repeat: no-repeat;
      background-size: contain;
      background-image: url(../../../assets/img/ic_sm@3x.png);
    }

    .scan-title{
      color: #FFF;
      font-size: 18px;
    }
  }
}
</style>

<style scoped>
.van-hairline--surround::after{
  border-radius: 8px;
}
</style>
