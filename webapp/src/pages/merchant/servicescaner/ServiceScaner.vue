<template>
  <div>
    <Common-PageContainer>
      <template #content>
        <div class="container">
          <div class="userinfobox">
            <div class="top-bkheightfix"></div>

            <div class="j-m">
              <div class="contentbox j-common-content">
                <!-- 认证成功 -->
                <div
                  v-show="pagestatus.success && !pagestatus.loading"
                  class="success result-show"
                >
                  <div
                    v-if="data.scanresult.beCharge"
                    class="toptab-bar j-flex j-flex-center"
                  >
                    <div class="j-fc-blue">
                      <span class="fas fa-info-circle"></span>
                    </div>
                    <div class="flex">
                      <span class="j-fc-deepgray">该老兵为家人代持</span>
                    </div>
                  </div>

                  <div class="content">
                    <Common-PageDevideHeight />
                    <div class="icon j-fc-blue">
                      <span class="fas fa-check-circle"></span>
                    </div>

                    <div class="message-tip">老兵码认证成功</div>
                  </div>
                </div>

                <!-- 认证失败 -->
                <div
                  v-show="!pagestatus.success && !pagestatus.loading"
                  class="fail result-show"
                >
                  <div class="content">
                    <Common-PageDevideHeight />
                    <div class="j-fc-red icon">
                      <span class="fas fa-info-circle"></span>
                    </div>

                    <div class="message-tip" v-html="pagestatus.errorStr"></div>
                  </div>
                </div>

                <div v-show="pagestatus.loading">
                  <Common-PageDevideHeight />
                  <Common-ListLoading />
                </div>

                <Common-PageDevideHeight />
              </div>
            </div>

            <Common-PageDevideHeight />
            <Common-PageDevideHeight />
          </div>

          <Common-PageDevideHeight />
          <Common-PageDevideHeight />

          <div>
            <div
              class="scan-btn j-flex j-flex-center"
              @click="F_scan"
            >
              <div class="flex">
                <div>
                  <div class="imgicon-scan"></div>
                </div>
                <div class="scan-title">点击继续扫码</div>
              </div>
            </div>
          </div>

          <Common-PageDevideHeight />
          <Common-PageDevideHeight />
          <Common-PageDevideHeight />
          <Common-PageDevideHeight />
          <Common-PageDevideHeight />
        </div>
        <Common-PageFooter />
      </template>
    </Common-PageContainer>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import thirdauth from '@/assets/js/thirdauthtool/thirdauth.js'

export default {
  data () {
    return {
      // 页面状态控制
      pagestatus: {
        // 认证中 第一次进入页面
        loading: false,

        // 认证是否成功
        success: false,

        // 错误信息
        errorStr: '请扫码进行老兵认证'
      },

      data: {
        // 扫码认证结果
        scanresult: {}
      }
    }
  },

  computed: mapState({
    // 商户机构信息存放
    merchantInfo (state) {
      return state.localData.merchantInfo
    },

    // 浏览器环境参数
    browerEnvStatus: 'browerEnvStatus',

    // 当前所在环境
    browerEnv: 'browerEnv'
  }),

  mounted () {
    const pageParam = this.$store.getters.pageParam(this)

    // console.log('扫码接参数据', pageParam)

    // 接收页面参数
    if (pageParam && pageParam.action === 'scan') {
      this.pagestatus.loading = true
      const qrcodedata = JSON.parse(pageParam.qrcodedata)

      // 检测老兵码是否有效
      this.F_checkQrcode(qrcodedata, () => {
        this.F_createServiceOrder(qrcodedata.id)
      })
    }
  },

  methods: {
    F_test () {
      // const qrcodeData = this.$Common.kJsonParse('sssss')

      // if (!qrcodeData) {
      //   this.pagestatus.errorStr = '无效二维码'
      //   this.pagestatus.success = false
      //   return
      // }

      this.F_createServiceOrder(1)
    },

    /**
     * 校验检测二维码是否可用
     */
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

      this.pagestatus.loading = false
      this.pagestatus.errorStr = '老兵码认证失败'
      this.pagestatus.success = false
    },

    // 扫码
    F_scan () {
      thirdauth.Scan((result) => {
        // const scanData = this.$Common.kJsonParse(result)

        const scanData = this.$Common.kgetUrlinfo(result)

        if (!scanData && scanData.code) {
          this.$toast('无效二维码')

          this.pagestatus.errorStr = '老兵码认证失败'
          this.pagestatus.success = false
          return
        }

        this.F_checkQrcode(scanData, () => {
          this.F_createServiceOrder(scanData.id)
        })
      })
    },

    // 创建服务记录
    async F_createServiceOrder (armyid) {
      this.$Common.showLoading(true)

      const data = await this.$Api.service.createServiceOrder({
        serviceOrgId: this.merchantInfo.id,
        exServicemanId: armyid
      })

      this.$Common.showLoading(false)
      this.pagestatus.loading = false

      if (data.code === 2000) {
        this.data.scanresult = data.result
        this.pagestatus.success = true
        return
      }

      const errList = ['老兵码认证失败']

      // 非本地区 老兵认证失败
      if (data.code === 5355) {
        errList.push('<br>')
        errList.push(data.message)
      }

      this.pagestatus.success = false
      this.pagestatus.errorStr = errList.join('')
      this.$toast('扫码认证失败，' + data.message)
    }
  }
}
</script>

<style lang="scss" scoped>
.container{
  background: #FFF;
}

.top-bkheightfix{
  height: 60px;
}

.userinfobox {
  margin: 0;
  padding: 16px 0 0 0;
  background: url(../../../assets/img/img_sy_top@3x.png) no-repeat center top;
  background-size: 100% auto;
}

.contentbox {
  .content{
    padding: 16px;
  }

  .toptab-bar{
    background: #F3FAFF;
    padding: 14px 16px;
    font-size: 14px;
    text-align: left;

    .j-fc-blue{
      margin-right: 8px;
    }
  }

  .result-show{
    text-align: center;

    .icon{
      font-size: 60px;
    }

    .message-tip{
      font-size: 18px;
      line-height: 1.6;
      margin-top: 10px;
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
    font-size: 14px;
  }
}
</style>
