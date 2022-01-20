<template>
  <div>
    <Common-PageContainer>
      <template v-slot:content>
        <div ref="canvascontaner"></div>

        <div class="mixqrcode-show j-m">
          <Common-PageDevideHeight />
          <Common-PageDevideHeight />

          <img :src="data.cover" />

          <Common-PageDevideHeight />
          <Common-PageDevideHeight />

          <div class="j-m">
            <!-- 浙里办显示保存按钮 -->
            <div class="savetip" v-if="browerEnvStatus.zlb">
              <van-button
                type="info"
                size="normal"
                plain
                block
                @click="F_saveImage">
                保存到手机
              </van-button>
            </div>

            <!-- 支付宝/小程序/其他 提示长按保存 -->
            <div class="savetip j-fc-gray" v-if="!browerEnvStatus.zlb">
              <span class="fas fa-info-circle"></span> 长按图片，点击 “保存图片” 到手机
            </div>
          </div>

          <Common-PageDevideHeight />
          <Common-PageDevideHeight />
        </div>

        <Common-PageFooter />
      </template>
    </Common-PageContainer>

    <!-- 二维码合成生成 工具dom容器 -->
    <div class="cover-maker">
      <div ref="covermixer" style="width: 1080PX; position: relative;">
        <img ref="templateimg" :src="data.templateimg" crossOrigin style="width: 100%; display: block;" />

        <div class="qrcode-container j-flex j-flex-vtc">
          <div class="flex">
            <div>
              <img ref="qrcode" :src="data.qrcode" />
            </div>

            <div class="j-fullcontent">
              <div style="position: relative; width: 100%; height: 100%;" class="j-flex j-flex-center">
                <div class="flex">
                  <div style="text-align: center;">
                    <div class="merchant-avatar" :style="merchantAvatarStyle"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="merchantname">{{ data.merchantinfo.name }}</div>

          <div style="height: 27PX;"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import QRCode from 'qrcode'
import html2canvas from 'html2canvas'

export default {
  data () {
    return {
      // 页面状态控制
      pagestatus: {

      },

      // 数据存放
      data: {
        // 商家信息
        merchantinfo: {},

        // 二维码图片数据
        qrcode: '',

        // 合成图片数据
        cover: '',

        // 模板地图
        templateimg: '',

        // 上传后的二维码地址
        saveImgUrl: ''
      }
    }
  },

  computed: mapState({
    GET: 'GET',

    // 商家头像信息
    merchantAvatar () {
      return this.data.merchantinfo.logo ? this.data.merchantinfo.logo : ''
    },

    // 头像样式
    merchantAvatarStyle () {
      let style = []

      if (
        this.merchantAvatar
      ) {
        style = [
          'background-image: url(',
          this.merchantAvatar,
          ')'
        ]
      }

      return style.join('')
    },

    // 商户机构信息存放
    merchantInfo (state) {
      return state.localData.merchantInfo
    },

    avatar (state) {
      return state.localData.Userinfo.avatar
    },

    // 登录用户信息
    Userinfo (state) {
      return state.localData.Userinfo
    },

    // 底图模板图片文件地址
    merchantqrcover (state) {
      return state.zlbConfig.merchantqrcover
    },

    // 浏览器环境参数
    browerEnvStatus: 'browerEnvStatus'
  }),

  mounted () {
    this.$Common.showLoading(true)

    this.F_loadMerchantInfo()
  },

  methods: {
    // 加载图片资源
    F_loadResource (callback) {
      let loadcount = 0

      // 需要预加载的资源数量
      const source = this.merchantAvatar ? 2 : 1

      const loaded = function () {
        loadcount++

        if (loadcount >= source) {
          callback()
        }
      }

      // 地图加载完毕
      this.$refs.templateimg.onload = () => {
        loaded()
      }
      this.data.templateimg = this.merchantqrcover

      // 头像加载完毕
      const avatar = new Image()
      avatar.crossOrigin = true
      avatar.onload = () => {
        loaded()
      }
      avatar.src = this.merchantAvatar
    },

    // 获取商家信息
    async F_loadMerchantInfo () {
      const data = await this.$Api.merchant.getMerchantInfo(this.merchantInfo.id)

      if (data.code === 2000) {
        this.data.merchantinfo = data.result

        this.F_loadResource(() => {
          this.F_createQrcode()
        })
        return
      }

      this.$toast('信息加载失败')
    },

    // 初始化二维码
    F_createQrcode () {
      const url = window.location.href.split('#')[0].split('?')[0] +
        (this.GET.debug ? '?debug=true' : '') +
        '#/army/pay/payinputmeny' +
        this.$Common.KhttpBuildQuery({
          merchantid: this.merchantInfo.id
        })

      // console.log(url)

      this.$refs.qrcode.onload = () => {
        setTimeout(() => {
          this.F_mixUpCover()
        }, 1000)
      }

      // 延迟处理 防止页面 卡顿
      QRCode.toDataURL(url, {
        errorCorrectionLevel: 'H',
        margin: 1,
        color: { dark: '#000' },
        width: 1080
      }).then(url => {
        // console.log(url)
        this.data.qrcode = url
      })
    },

    // 合成图片
    async F_mixUpCover () {
      const canvas = await html2canvas(this.$refs.covermixer, {
        windowWidth: 1080,
        useCORS: true
      })

      this.$Common.showLoading(false)

      // this.$refs.canvascontaner.appendChild(canvas)
      const imgdata = canvas.toDataURL('image/png')

      // console.log(imgdata)
      this.data.cover = imgdata
    },

    // 浙里办内无长按保存 需要先上传到服务器
    // 调用api 保存文件到相册
    async F_saveImage () {
      // 已上传重复点击保存
      if (this.data.saveImgUrl) {
        this.F_saveToPhone()
        return
      }

      this.$Common.showLoading(true)

      const data = await this.$Api.common.uploadBase64Image(this.data.cover)

      this.$Common.showLoading(false)

      if (data.code === 2000) {
        this.data.saveImgUrl = data.result
        this.F_saveToPhone()
        return
      }

      this.$toast('保存失败，图片地址获取失败')
    },

    // 保存到手机
    F_saveToPhone () {
      if (this.browerEnvStatus.zlb) {
        window.ZWJSBridge.saveImage({
          url: this.data.saveImgUrl
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/variables.scss';

.savetip{
  font-size: 12px;
  text-align: center;
}

.mixqrcode-show{
  background: #FFF;

  img{
    width: 80%;
    display: block;
    margin: 0 auto;
    box-shadow: 0 5px 16px rgba(0,0,0,.1);
  }
}

.cover-maker{
  width: 1080PX;
  opacity: 0;

  .qrcode-container{
    position: absolute;
    background: rgba(255,255,255,1);
    left: 158PX;
    width: 764PX;
    height: 870PX;
    top: 538PX;

    img{
      width: 90%;
      display: block;
      margin: 35PX auto;
    }

    .merchantname{
      font-size: 50PX;
      padding: 16PX;
      text-align: center;
      color: #000;
    }

    .merchant-avatar{
      width: 50PX;
      height: 50PX;
      display: inline-block;
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
      background-image: url(../../../assets/img/ic_mrtx@3x.png);
      margin: 0;
      padding: 10PX;
      border-radius: 10PX;
      border: 8PX solid #FFF;
    }
  }
}
</style>
