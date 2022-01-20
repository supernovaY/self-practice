<template>
  <div>
    <Common-PageContainer>
      <template v-slot:content>
        <div class="form-group nomargin-t">
          <form ref="formavatar">
            <label class="c check-c">
              <div class="input j-flex j-flex-center">
                <div class="flex">
                  商家logo
                </div>

                <div class="useravatar">
                  <div class="avatar" :style="userAvatarStyle"></div>
                  <input
                    type="file"
                    accept="image/*"
                    @change="F_uploadAvatar"
                  />
                </div>
              </div>
            </label>
          </form>
        </div>

        <van-form ref="sform">
          <van-field
            v-model="formdata.name"
            required
            name="name"
            label="名称"
            placeholder="请输入商户名称"
            :rules="[{ required: true, message: '请填写商户名称' }]"
          />

          <van-field
            v-model="formdata.openTime"
            required
            name="openTime"
            label="营业时间"
            placeholder="请输入营业时间"
            :rules="[{ required: true, message: '请填写营业时间' }]"
          />

          <van-field
            v-model="formdata.phone"
            required
            name="phone"
            label="联系方式"
            placeholder="请输入联系手机号/电话"
            :rules="[{ required: true, validator: F_rulePhoneAndMobile, message: '请正确填写联系手机号/电话号码' }]"
          />

          <van-field
            v-model="formdata.address"
            required
            name="address"
            label="地址"
            placeholder="请输入具体详细地址"
            :rules="[{ required: true, message: '请填写具体详细地址' }]"
          />

          <van-field
            v-model="formdata.zfb_app_id"
            name="zfb_app_id"
            label="支付宝应用ID"
            placeholder="请输入支付宝应用appid"
          />

          <van-field
            v-model="formdata.zfb_public_key"
            name="zfb_public_key"
            label="支付宝公钥"
            placeholder="请输入支付宝公钥"
          />

          <van-field
            required
            readonly
            :value="data.mapLocation.name"
            :is-link="true"
            label="地图位置"
            placeholder="请输入选择地图位置"
            @click="F_selectPostion"
          />

          <!-- <van-field
            v-model="formdata.detail"
            type="textarea"
            name="validator"
            maxlength="500"
            show-word-limit
            rows="8"
            label="详情"
            placeholder="请输入详细信息"
            :rules="[{ validator, message: '请输入正确内容' }]"
          /> -->

          <!-- 商家图片 -->
          <div class="j-m bkwhite-container">
            <Common-PageDevideHeight />
            <div class="j-fc-deepgray">商家图片：</div>
            <Common-PageDevideHeight />

            <div>
              <van-uploader
                v-model="data.fileList"
                multiple
                :max-count="6"
                :after-read="F_afterReadFile"
              />
            </div>

            <Common-PageDevideHeight />
            <Common-PageDevideHeight />

            <van-button
              block
              type="info"
              @click="F_submitData"
            >
              完成
            </van-button>
            <Common-PageDevideHeight />
          </div>
        </van-form>

        <Common-PageFooter />
      </template>
    </Common-PageContainer>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Validator from '@/assets/js/Validator.js'

export default {
  data () {
    return {
      // 提交表单对象
      formdata: {
        // 机构ID
        id: '',

        // 商家logo
        logo: '',

        // 名称
        name: '',

        // 地区码
        areaCode: '',

        // 营业时间
        openTime: '',

        // 手机号
        phone: '',

        // 地址
        address: '',

        // 经度
        longitude: '',

        // 纬度
        latitude: '',

        // 图片
        images: [],

        // 支付宝配置
        zfb_app_id: '',
        zfb_public_key: ''
      },

      // 表单正则
      Validator: Validator,

      data: {
        // 地图位置数据
        mapLocation: {
          address: ''
        },

        // 商家信息
        merchantinfo: {},

        // 上传的图片列表
        fileList: []
      }
    }
  },

  computed: mapState({
    // 商户机构信息存放
    merchantInfo (state) {
      return state.localData.merchantInfo
    },

    // 用户头像样式
    userAvatarStyle () {
      return this.formdata.logo ? 'background-image: url(' + this.formdata.logo + ')' : ''
    },

    // 浏览器环境参数
    browerEnvStatus: 'browerEnvStatus'
  }),

  mounted () {
    this.F_loadMerchantInfo()
  },

  methods: {
    // 手机 座机校验支持
    F_rulePhoneAndMobile (val) {
      return Validator.Mobile.test(val) || Validator.Phone.test(val)
    },

    // 加载机构详情信息
    async F_loadMerchantInfo () {
      this.$Common.showLoading(true)

      const data = await this.$Api.merchant.getMerchantInfo(this.merchantInfo.id)

      this.$Common.showLoading(false)
      console.log('商家详情数据', data)

      if (data.code === 2000) {
        this.data.merchantinfo = data.result

        this.data.merchantinfo.images.map((item) => {
          this.data.fileList.push({
            url: item.url
          })
        })

        for (var i in this.formdata) {
          this.formdata[i] = this.data.merchantinfo[i]
        }

        // 设置地区 到最后一个
        if (this.formdata.areaCode) {
          const acreaList = this.formdata.areaCode.split(',')
          this.formdata.areaCode = acreaList[acreaList.length - 1]
        }

        this.formdata.zfb_app_id = this.data.merchantinfo.zfbAppId
        this.formdata.zfb_public_key = this.data.merchantinfo.zfbPublicKey

        this.data.mapLocation.lng = this.data.merchantinfo.longitude
        this.data.mapLocation.lat = this.data.merchantinfo.latitude
        return
      }

      this.$toast('商户信息加载失败')
    },

    // 图片文件读取后触发
    F_afterReadFile () {
      // console.log(this.data.fileList)
    },

    // 地图位置选择回调
    F_selectPostionCallback (positionData) {
      console.log('接收到地图信息', positionData)
      this.data.mapLocation = positionData

      this.formdata.latitude = positionData.serverData.lat
      this.formdata.longitude = positionData.serverData.lng
    },

    // 选择地图位置
    F_selectPostion () {
      const url = '/merchant/userinfo/selectmappostion' +
        this.$Common.KhttpBuildQuery({
          redirectUrl: this.$route.path,
          lng: this.data.mapLocation.lng || '',
          lat: this.data.mapLocation.lat || ''
        })

      this.$router.push(url)
    },

    // 上传图片
    F_uploadImgs (finish) {
      this.formdata.images = []
      let uploadStatus = true
      let uploadIndex = 0

      const total = this.data.fileList.length

      this.data.fileList.map(async (item) => {
        if (item.url) {
          this.formdata.images.push(item.url)
        } else {
          const imgdata = await this.$Common.kCompass({
            fileinput: item.file,
            width: 1080,
            height: 1080
          })

          const urlData = await this.$Api.common.uploadBase64Image(
            imgdata.result
          )

          if (urlData.code === 2000) {
            item.url = urlData.result
            this.formdata.images.push(urlData.result)
          } else {
            uploadStatus = false
            this.$toast('图片上传失败')
            this.$Common.showLoading(false)
          }
        }

        uploadIndex++

        if (uploadIndex >= total && uploadStatus) {
          finish()
        }
      })
    },

    // 上传头像
    F_uploadAvatar (evt) {
      const fileinput = evt.target

      const files = fileinput.files

      if (files.length > 0) {
        this.$Common.kCompass({
          fileinput: files[0],
          width: 200,
          height: 200
        }).then(async (result) => {
          this.$Common.showLoading(true)

          const avatarUrl = await this.$Api.common.uploadBase64Image(
            result.result
          )

          this.$Common.showLoading(false)

          if (avatarUrl.code === 2000) {
            this.formdata.logo = avatarUrl.result
            return
          }

          this.$Common.showLoading(false)
          this.$toast('图片上传失败，请重试')
        }).catch(() => {

        })
      }
    },

    // 提交
    F_submitData () {
      this.$refs.sform.validate()
        .then(() => {
          this.$Common.showLoading(true)

          this.F_uploadImgs(async () => {
            const submitResult = await this.$Api.merchant.updateMerchantInfo(
              this.formdata
            )

            this.$Common.showLoading(false)

            // 成功
            if (submitResult.code === 2000) {
              this.$router.back()
              // this.$router.push('/merchant/userinfo')
              return
            }

            this.$toast(submitResult.message)
          })
        })
        .catch((err) => {
          this.$toast(err[0].message)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.useravatar {
  input {
    display: none;
  }

  .avatar {
    background: url(../../../assets/img/ic_mrtx@3x.png) no-repeat center center;
    background-size: cover;
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 4px;
  }
}

.bkwhite-container{
  background: #FFF;
}
</style>
