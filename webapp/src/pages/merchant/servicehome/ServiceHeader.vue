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
            <router-link to="/merchant/service/userinfo">
              <span class="fas fa-user"></span>
            </router-link>
          </div>
        </div>
      </div>

      <Common-PageDevideHeight />

      <div class="j-m">
        <div class="contentbox j-common-content">
          <Common-PageDevideHeight />

          <div class="content">
            <div>
              <div
                class="scan-btn j-flex j-flex-center"
                @click="F_scanQrcode"
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

          <Common-PageDevideHeight />
        </div>
      </div>

      <Common-PageDevideHeight />
      <Common-PageDevideHeight />
    </div>

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

      },

      // 数据存放对象
      data: {
        // 支付金额
        paymoney: '',

        // 消息数量
        message: 0,

        // 商家码
        qrcode: ''
      }
    }
  },

  computed: mapState({
    // 用户信息
    Userinfo (state) {
      return state.localData.Userinfo
    },

    // 商户信息
    merchantInfo (state) {
      return state.localData.merchantInfo
    },

    // 用户头像样式
    userAvatarStyle () {
      return this.Userinfo.avatar ? 'background-image: url(' + this.Userinfo.avatar + ')' : ''
    }
  }),

  deactivated () {

  },

  activated () {
    // 获取消息数量
    this.F_getMessageCount()
  },

  mounted () {

  },

  methods: {
    // 获取消息数量
    async F_getMessageCount () {
      const data = await this.$Api.message.unreadCount(this.Userinfo.id)

      if (data.code === 2000) {
        this.data.message = data.result
      }
    },

    // 扫码验证
    F_scanQrcode () {
      thirdauth.Scan(async (result) => {
        // 老兵码数据
        // {type:0,id:0,userName:''}
        // const scanData = this.$Common.kJsonParse(result)

        // 使用url 接参 浙里办App IOS端 json数据会闪退
        const scanData = this.$Common.kgetUrlinfo(result)

        if (!scanData || !scanData.code) {
          this.$toast('无效二维码')
          return
        }

        // 向页面传参
        this.$store.commit(
          'sendMultyPageParam',
          [
            {
              path: '/merchant/service/scanresult',
              data: {
                action: 'scan',
                qrcodedata: JSON.stringify(scanData)
              }
            }
          ]
        )

        // 跳转扫码结果查询
        this.$router.push('/merchant/service/scanresult')
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
}

.contentbox {
  .content{
    padding: 16px;
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
