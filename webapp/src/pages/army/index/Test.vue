<template>
  <div>
    <Common-PageContainer>
      <template #content>

        <Common-PageDevideHeight />

        <van-button round type="info" size="large" @click="F_saveBase64ToPhone">
          保存base图片
        </van-button>

        <Common-PageDevideHeight />

        <a :href="data.ImgData" download="test.jpg">
          <img style="display: block; width: 100px; height: 100px;" :src="data.ImgData" />
        </a>

        <Common-PageDevideHeight />

        <van-button round type="info" size="large" @click="F_pay">
          跳转支付
        </van-button>

        <Common-PageDevideHeight />
        <Common-PageDevideHeight />
        <Common-PageDevideHeight />

        <div class="j-m">
          <a href="zwfw://dos/accept/notice?">浙里办App 用户须知页</a>

          <a @click="F_jumpToZKB">打开浙里办App 代码触发跳转</a>

          <br /><br />

          <a
            href="zwfw://platformapi/startapp?appId=20000067&url=http://www.baidu.com"
            >打开浙里办App a标签触发跳转</a
          >

          <br /><br />

          <a @click="F_jumpToAlipay">打开支付宝 并打开 支付宝的指定页面</a>

          <br /><br />

          <a :href="alipayJumpUrl"
            >打开支付宝 并打开 支付宝的指定页面 a链接标签触发</a
          >

          <br /><br />

          <a href="alipays://platformapi/startapp?appId=20000056">打开支付宝支付码</a>

          <Common-PageDevideHeight />

          <!-- ios高德地图导航跳转 -->
          <a href="iosamap://navi?sourceApplication=applicationName&poiname=fangheng&poiid=BGVIS&lat=36.547901&lon=104.258354&dev=1&style=2">高德地图</a>

          <Common-PageDevideHeight />

          <!-- 浙里办App 唤起地图 内置方法 -->
          <a href="zwfw://openThirdMap?longitude=119.908949&latitude=31.014303&locationName=长兴体育中心">浙里办App 唤起地图 内置方法</a>

          <Common-PageDevideHeight />

          <van-button round type="info" size="large" @click="F_authLogin">
            授权登录
          </van-button>

          <!-- 加载动画 -->
          <Common-ListLoading v-show="pagestatus.loading" />

          <Common-PageFooter />
        </div>

        <div style="height: 100px;"></div>
      </template>

      <template v-slot:fixbottom>
        <div class="j-m">
          <Common-PageDevideHeight />

          <van-button round type="info" size="large" @click="F_scan">
            扫一扫
          </van-button>

          <Common-PageDevideHeight />
        </div>
      </template>
    </Common-PageContainer>

    <div ref="qrcodeMaker">

    </div>
  </div>
</template>

<script>
import thirdauth from '@/assets/js/thirdauthtool/thirdauth'
import { mapState } from 'vuex'
import html2canvas from 'html2canvas'

export default {
  data () {
    return {
      // 页面状态控制
      pagestatus: {
        loading: false,

        // 是否显示脱敏
        takeoff: true
      },

      // 数据存放对象
      data: {
        datalist: [],

        // base64图片数据
        ImgData: '',

        // 合成二维码图片数据
        qrcodeData: ''
      },

      alipayJumpUrl:
        'alipays://platformapi/startapp?appId=20000067&url=' +
        encodeURIComponent(window.location.href)
    }
  },

  computed: mapState({
    GET: 'GET',
    Userinfo: 'armyInfo',
    browerEnvStatus: 'browerEnvStatus'
  }),

  mounted () {
    console.log(this.armyInfo)

    // console.log(this.$Common.StringTakeoff('330324119408160011',3,15));

    setTimeout(() => {
      // alert(JSON.stringify(this.browerEnvStatus))

      if (
        this.browerEnvStatus.alipay &&
        !this.browerEnvStatus.alipayminiprogram
      ) {
        // alert(11111)
        // this.F_jumpToZKB()
      }
    }, 1000)

    for (let i = 0; i < 10; i++) {
      this.data.datalist.push(1)
    }

    console.log(this.GET)
    console.log(this.$route.query)

    // if (this.GET.ticket || this.$route.query.ticket) {
    //   const ticket = this.GET.ticket || this.$route.query.ticket
    //   alert(ticket)
    // }
  },
  methods: {
    // 创建合成商家码
    F_createQrcodeCover () {
      html2canvas(document.body).then(function (canvas) {
        document.body.appendChild(canvas)
      })
    },

    // 浙里办App 保存base64图片
    F_saveBase64ToPhone () {
      const ImgData = ''

      this.data.ImgData = ImgData

      window.ZWJSBridge.saveImage({
        url: ImgData
      }).then((result) => {
        console.log(result)
      }).catch((error) => {
        console.log(error)
      })
    },

    // 跳转支付宝
    F_pay () {
      const url = 'https://qr.alipay.com/bax08657ajb73xvp9ggf8054'

      // 'alipays://platformapi/startapp?appId=2018090361258298&page=pages%2Findex%2Findex&query=url=https%253A%252F%252Fmapi.zjzwfw.gov.cn%252Fweb%252Fmgop%252Fgov-open%252Fzj%252F200900301%252F3.1.13%252Findex.html%253Fdebug%253Dtrue%26type%3Dmini'

      window.my.redirectTo({
        url: '/index/index' + this.$Common.KhttpBuildQuery({
          url: url
        })
      })
    },

    // 跳转支付宝
    F_jumpToAlipay () {
      setTimeout(() => {
        window.ZWJSBridge.openLink({
          url: this.alipayJumpUrl
        })
        // location.href = this.alipayJumpUrl
      }, 1000)
    },

    // 跳转浙里办
    F_jumpToZKB () {
      setTimeout(() => {
        location.href = 'zwfw://'
      }, 1000)
    },

    // 授权登录
    F_authLogin () {
      thirdauth.authLogin()
    },

    // 滚动加载触发
    F_scrollLoad (bottomDistance) {
      if (!this.pagestatus.loading) {
        console.log('滚动加载触发', bottomDistance)
        this.pagestatus.loading = true

        this.$store.commit('requestLoading', true)

        setTimeout(() => {
          this.data.datalist.push(1)
          this.pagestatus.loading = false

          this.$store.commit('requestLoading', false)
        }, 2000)
      }
    },

    // 跳转url
    F_jump (url) {
      this.$router.push(url)
    },

    // 扫码
    F_scan () {
      thirdauth.Scan(text => {
        alert(text)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.inlinetext {
  display: inline-block;
  margin-left: 8px;
}

.commonbox {
  margin: 0;
  padding: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  background: #fff;
  border-radius: 4px;
}

.userinfobox {
  margin: 0;
  padding: 16px 0;
  background: #000;
  color: #fff;

  .avatar {
    display: inline-block;
    width: 30px;
    height: 30px;
    background-color: #0570db;
    border-radius: 50%;
  }

  .qrcode {
    text-align: center;

    img {
      display: inline-block;
      width: 60%;
    }
  }
}
</style>
