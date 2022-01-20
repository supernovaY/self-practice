<template>
  <div>
    <Common-PageContainer>
      <template #content>
        <div class="container">
          <div class="header-timer">
            <div class="headbkfix"></div>

            <div class="timeshow">
              {{ data.timeshow }}
            </div>

            <Common-PageDevideHeight />
            <Common-PageDevideHeight />
          </div>

          <div class="j-m">
            <div class="qrcode">
              <img ref="qrcode" :src="data.qrcode" />

              <Common-PageDevideHeight />

              <div class="usagetip">
                <div class="text">
                  使用浙江省老兵码，享受各项福利优惠
                </div>
              </div>

              <div class="bottomheightfix"></div>
            </div>
          </div>
        </div>

        <Common-PageFooter />
      </template>
    </Common-PageContainer>
  </div>
</template>

<script>
import QRCode from 'qrcode'
import { mapState } from 'vuex'
import armyinfodeal from '@/assets/js/armyinfodeal/armyinfodeal.js'
import dataCounter from '@/assets/js/datacounter/counter.js'

export default {
  data () {
    return {
      // 定时任务ID
      checktimer: false,

      // 页面状态控制
      pagestatus: {
        loading: false
      },

      // 数据存放对象
      data: {
        // 二维码数据
        qrcode: '',

        // 时间显示
        timeshow: ''
      }
    }
  },

  computed: mapState({
    GET: 'GET',

    // 当然使用的代持军人信息
    armyInfo (state) {
      return state.localData.armyInfo
    },

    browerEnvStatus: 'browerEnvStatus',

    // 用户信息
    Userinfo (state) {
      return state.localData.Userinfo
    }
  }),

  beforeDestroy () {
    // 取消定时时间任务
    // clearInterval(this.timeShowTimer)

    // 取消扫码支付的查询
    // clearInterval(this.checktimer)

    // 停止二维码刷新
    // clearInterval(this.refreshchecktimer)
  },

  mounted () {
    console.log(this.$route)
    this.F_startTimeShow()

    this.F_createQrcode()

    // 开启检查二维码被扫检测
    this.$Common.setTimerInterval(
      setInterval(() => {
        this.F_scanerChecker()
      }, 2000)
    )

    // 开启二维码一分钟刷新
    this.F_timerRefreshQrcode()
  },

  methods: {
    // 检测二维码是否被扫
    async F_scanerChecker () {
      const data = await this.$Api.pay.checkMyWaitPayOrder()

      if (data.code === 2000 && data.result) {
        // 埋点处理后 跳转
        dataCounter.showQrcodeCount(() => {
          this.F_jumpToPay(data.result)
        })
      }

      // this.F_jumpToPay(9)
    },

    // 跳转支付确认页
    F_jumpToPay (orderid) {
      // console.log(orderid)

      const param = Object.assign({ orderid: orderid }, this.$route.query)

      this.$router.push(
        '/army/pay/payconfirm' + this.$Common.KhttpBuildQuery(param)
      )
    },

    // 老兵码按时刷新 1分钟
    F_timerRefreshQrcode () {
      this.$Common.setTimerInterval(
        setInterval(() => {
          this.F_createQrcode()
        }, 60000)
      )
    },

    // 初始化时间跳动
    F_startTimeShow () {
      this.data.timeshow = new Date().Format('M月dd日 hh:mm:ss')

      this.$Common.setTimerInterval(
        setInterval(() => {
          this.data.timeshow = new Date().Format('M月dd日 hh:mm:ss')
        }, 1000)
      )
    },

    // 初始化二维码
    F_createQrcode () {
      // 更新老兵列表
      armyinfodeal(async () => {
        // 码引擎对接 生成老兵码接口 后续使用
        const QrcodeData = await this.$Api.army.createArmyQrcode({
          soldierId: this.armyInfo.id || this.Userinfo.id,
          userType: this.armyInfo.type,
          login: this.armyInfo.type !== 0
        })

        // console.log(QrcodeData)
        this.pagestatus.loading = false

        // 不可以生成老兵码
        if (QrcodeData.code !== 2000) {
          this.$toast('当前无法生成老兵码')
          return
        }

        const qrcodeJsonData = Object.assign({}, this.armyInfo)
        // qrcodeJsonData.t = parseInt(new Date().getTime() / 1000)

        // 码引擎code
        qrcodeJsonData.code = QrcodeData.result

        // ios端使用json 数据会导致闪退 改用url 数据
        // const codeContent = JSON.stringify(qrcodeJsonData)
        const codeContent = this.$Common.KhttpBuildQuery(qrcodeJsonData)
        console.log(codeContent)

        // 延迟处理 防止页面 卡顿
        setTimeout(() => {
          // this.$Common.KhttpBuildQuery(this.Userinfo)
          QRCode.toDataURL(codeContent, {
            errorCorrectionLevel: 'H',
            margin: 1,
            color: { dark: '#404956' },
            width: 1080
          }).then(url => {
            // console.log(url)
            this.data.qrcode = url
          })
        }, 1000)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/variables.scss';

.container {
  background: #FFF;
}

.header-timer{
  text-align: center;
  background: url(../../../assets/img/img_sy_top@3x.png) no-repeat center top;
  background-size: 100% auto;

  .headbkfix{
    height: 160px;
  }

  .timeshow{
    font-size: 24px;
  }
}

.qrcode {
  background: url(../../../assets/img/img_lbmbg@3x.png) no-repeat center bottom;
  background-size: 100% auto;
  text-align: center;

  .bottomheightfix{
    height: 100px;
  }

  img {
    display: inline-block;
    width: 60%;
  }

  .usagetip {
    position: relative;
    text-align: center;
    margin: 0 5%;

    &::after {
      content: '';
      display: block;
      position: absolute;
      transform: skewX(-23deg);
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      color: $--color-primary;
      background: rgba(20, 146, 255, 0.1);
    }

    .text {
      position: relative;
      z-index: 1;
      color: $--color-primary;
      line-height: 26px;
    }
  }
}
</style>
