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
              <span v-if="pagestatus.takeoff">
                {{ Userinfo.userName }}
              </span>

              <span v-if="!pagestatus.takeoff">
                {{ data.realname }}
              </span>
            </span>

            <span
              class="inlinetext"
              @click="pagestatus.takeoff = !pagestatus.takeoff"
            >
              <span v-show="!pagestatus.takeoff" class="far fa-eye"></span>
              <span v-show="pagestatus.takeoff" class="far fa-eye-slash"></span>
            </span>
          </div>

          <div class="messageicon">
            <router-link to="/army/message">
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
            <router-link to="/army/userinfo">
              <span class="fas fa-user"></span>
            </router-link>
          </div>
        </div>
      </div>

      <Common-PageDevideHeight />

      <div class="j-m">
        <div class="contentbox">
          <!-- 代持标记 -->
          <div
            v-if="armyInfo.type == 1"
            class="incharge-flag"
          >
            <div class="tip-txt">非本人</div>
          </div>

          <!-- 老兵码生成中加载 -->
          <div
            v-show="pagestatus.loading"
            class="qrcode-loading j-flex j-flex-center"
          >
            <div class="flex">
              <Common-ListLoading />
            </div>
          </div>

          <div v-show="!pagestatus.loading">
            <!-- 退役军人码可用 -->
            <div v-if="armyInfo.id && pagestatus.forceUnableQrcode">
              <div class="datetimetext">
                {{ data.timeshow }}
              </div>

              <Common-PageDevideHeight />

              <div class="qrcode">
                <img ref="qrcode" :src="data.qrcode" />
              </div>

              <Common-PageDevideHeight />

              <div class="usagetip">
                <div class="text">
                  使用浙江省老兵码，享受各项福利优惠
                </div>
              </div>
            </div>

            <!-- 退役军人码不可用 -->
            <div v-if="!armyInfo.id || !pagestatus.forceUnableQrcode">
              <Common-PageDevideHeight />

              <div class="j-fc-red error-message-title">
                <span class="fas fa-info-circle"></span> {{ data.errorMsg.title || '系统中未包含您的信息' }}
              </div>

              <Common-PageDevideHeight />

              <div class="error-message-text">
                <div v-html="data.errorMsg.submessage"></div>

                <!-- <div>请携带身份证和相关退役证明到</div>
                <div class="j-fc-blue">户籍所在地退役军人服务站</div>
                <div>进行信息采集或核实核对</div>
                <div>采集后将会自动生成老兵码</div> -->
              </div>
            </div>

            <Common-PageDevideHeight />
            <Common-PageDevideHeight />

            <div class="j-flex">
              <div v-show="armyInchargeCount > 0" class="flex">
                <van-button type="info" block plain @click="F_exchangeUser">
                  <span class="fas fa-exchange-alt"></span> 切换身份
                </van-button>
              </div>

              <div v-show="armyInchargeCount > 0" class="dividewidth-10"></div>

              <div class="flex">
                <router-link to="/army/incharge">
                  <van-button type="info" block>
                    <span class="fab fa-gratipay"></span> 家人代持
                  </van-button>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
      // 页面状态控制
      pagestatus: {
        // 是否显示脱敏
        takeoff: true,

        // 老兵码生成中状态
        loading: true,

        // 强制老兵码无法生成
        forceUnableQrcode: true,

        // 是否加载OK
        inited: false
      },

      // 数据存放对象
      data: {
        // 二维码数据
        qrcode: '',

        // 时间显示
        timeshow: '',

        // 消息数量
        message: 0,

        // 没有脱敏的姓名信息
        realname: '',

        // 老兵码错误信息
        errorMsg: {
          title: '',
          submessage: ''
        }
      }
    }
  },

  computed: mapState({
    // url参数解析
    GET: 'GET',

    // 用户头像样式
    userAvatarStyle () {
      return this.Userinfo.avatar ? 'background-image: url(' + this.Userinfo.avatar + ')' : ''
    },

    // 老兵代持数量
    armyInchargeCount () {
      let count = 0

      this.armyList.map((item) => {
        if (item.type !== 0) {
          count++
        }
      })

      return count
    },

    // 用户信息
    Userinfo (state) {
      return state.localData.Userinfo
    },

    // 当然使用的代持军人信息
    armyInfo (state) {
      return state.localData.armyInfo
    },

    // 代持军人列表信息
    armyList (state) {
      return state.localData.armyList
    },

    // 浏览器环境参数
    browerEnvStatus: 'browerEnvStatus'
  }),

  deactivated () {
    // console.log('取消定时任务')

    // 取消定时时间任务
    // clearInterval(this.timeShowTimer)

    // 取消二维码被扫
    // clearInterval(this.checktimer)

    // 停止二维码刷新
    // clearInterval(this.refreshchecktimer)
  },

  activated () {
    // 重新开始时间任务
    this.F_startTimeShow()

    // 获取消息数量
    this.F_getMessageCount()

    // 开启检查二维码被扫检测
    this.$Common.setTimerInterval(
      setInterval(() => {
        this.F_scanerChecker()
      }, 2000)
    )

    // 开启二维码一分钟刷新
    this.F_timerRefreshQrcode()

    if (this.inited) {
      this.F_createQrcode()
    }
  },

  mounted () {
    this.F_createQrcode()

    this.F_loadRealName()

    setTimeout(() => {
      this.inited = true
    }, 500)
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
    },

    // 跳转支付确认页
    F_jumpToPay (orderid) {
      // console.log(orderid)

      const param = Object.assign({ orderid: orderid }, this.$route.query)

      this.$router.push(
        '/army/pay/payconfirm' + this.$Common.KhttpBuildQuery(param)
      )
    },

    // 获取消息数量
    async F_getMessageCount () {
      const data = await this.$Api.message.unreadCount(this.Userinfo.id)

      if (data.code === 2000) {
        this.data.message = data.result
      }
    },

    // 获取我的真实姓名
    async F_loadRealName () {
      const data = await this.$Api.userinfo.getRealName()

      if (data.code === 2000) {
        this.data.realname = data.result
      }
    },

    // 切换身份
    F_exchangeUser () {
      this.$emit('exchangeuser')
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

    // 老兵码按时刷新 1分钟
    F_timerRefreshQrcode () {
      this.$Common.setTimerInterval(
        setInterval(() => {
          this.F_createQrcode()
        }, 60000)
      )
    },

    // 初始化二维码
    F_createQrcode () {
      armyinfodeal(async () => {
        // 码引擎对接 生成老兵码接口 后续使用
        const QrcodeData = await this.$Api.army.createArmyQrcode({
          soldierId: this.armyInfo.id || this.Userinfo.id,
          userType: this.armyInfo.type,
          login: this.armyInfo.type !== 0
        })

        console.log(QrcodeData)
        this.pagestatus.loading = false

        // 不可以生成老兵码
        if (QrcodeData.code !== 2000) {
          // 您的信息不完整:请携带身份证和相关退役证明到户籍所在地退役军人服务站/服务中心进行信息采集或核实核对，采集后将会自动生成老兵码
          const tipRawData = QrcodeData.message.split(':')

          this.data.errorMsg.submessage = tipRawData.length > 1 ? tipRawData[1] : ''

          // 设置标题
          this.data.errorMsg.title = tipRawData[0]

          this.pagestatus.forceUnableQrcode = false
          return
        }

        // this.pagestatus.loading = true
        this.pagestatus.forceUnableQrcode = true

        // 延迟处理 防止页面 卡顿
        setTimeout(() => {
          // this.$Common.KhttpBuildQuery(this.Userinfo)
          // const codeContent = location.href + this.$Common.KhttpBuildQuery({ ticket: '123' })

          const qrcodeJsonData = Object.assign({}, this.armyInfo)
          // qrcodeJsonData.t = parseInt(new Date().getTime() / 1000)

          // 码引擎code
          qrcodeJsonData.code = QrcodeData.result

          // ios端使用json 数据会导致闪退 改用url 数据
          // const codeContent = JSON.stringify(qrcodeJsonData)
          const codeContent = this.$Common.KhttpBuildQuery(qrcodeJsonData)

          // console.log(codeContent)

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

.mr-8{
  margin-right: 8px;
}

.dividewidth-10{
  width: 10px;
}

.fz-20{
  font-size: 20px;
}

.datetimetext {
  text-align: center;
  font-size: 18px;
  font-weight: bold;
}

.error-message-title{
  font-size: 20px;
  text-align: center;
}

.userinfobox {
  margin: 0;
  padding: 16px 0;
  background: url(../../../assets/img/img_sy_top@3x.png) no-repeat center top;
  background-size: 100% auto;

  .messageicon {
    margin: 0 20px 0 8px;
    font-size: 20px;
  }

  .username {
    display: inline-block;
    min-width: 45px;
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

  .contentbox {
    position: relative;
    background: url(../../../assets/img/img_sy_ewmbg@3x.png) no-repeat center
      bottom #ffffff;
    background-size: contain;
    box-shadow: 0 4px 8px 0 rgba(20, 146, 255, 0.16);
    border-radius: 4px;
    padding: 16px;
    overflow: hidden;

    .incharge-flag{
      position: absolute;
      left: 0;
      top: 0;

      &:after{
        display: block;
        content:" ";
        position: absolute;
        top: 0;
        left: 0;
        width: 100px;
        height: 150px;
        background: $--color-red;
        transform: rotate(45deg) translateX(-90px) translateY(-40px);
      }

      .tip-txt{
        position: relative;
        z-index: 1;
        color: #FFF;
        font-size: 14px;
        transform: rotate(-45deg) translateX(-9px) translateY(11px);
      }
    }

    .qrcode-loading{
      min-height: 150px;
    }

    .usagetip {
      position: relative;
      text-align: center;

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

  .qrcode {
    text-align: center;

    img {
      display: inline-block;
      width: 60%;
    }
  }

  .error-message-text{
    font-size: 16px;
    text-align: center;
    line-height: 1.6;
    margin: 0 30px;
  }
}
</style>
