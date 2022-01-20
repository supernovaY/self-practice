<template>
  <div>
    <Common-PageContainer>
      <template v-slot:content>
        <van-form>
          <van-field
            label="身份证号"
            v-model="formdata.name"
            disabled
          />

          <van-field
            v-model="formdata.address"
            required
            name="idcard"
            label="新身份证号"
            placeholder="请输入新身份证号"
            :rules="rules.idcard"
          />

          <!-- 商家图片 -->
          <div class="j-m bkwhite-container">
            <Common-PageDevideHeight />
            <Common-PageDevideHeight />

            <van-button block type="info">
              保存
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
        name: '330324*****0011',
        runtime: '',
        phone: '',
        address: '',
        detail: ''
      },

      // 表单正则
      Validator: Validator,

      rules: {
        // 身份证校验
        idcard: [
          {
            require: true,
            message: '请正确输入身份证号',
            validator: (value, rule) => {
              return Validator.IsIdCard(value)
            }
          }
        ]
      }
    }
  },

  computed: mapState({
    // 登录用户信息
    userInfo (state) {
      return state.localData.Userinfo
    },

    // 用户头像样式
    userAvatarStyle () {
      return this.avatar ? 'background-image: url(' + this.avatar + ')' : ''
    },

    // 浏览器环境参数
    browerEnvStatus: 'browerEnvStatus'
  }),

  mounted () {
    console.log(this.userInfo)

    // console.log(alioss)
    // alioss.uploadBase64()
  },

  methods: {
    // 身份证认证
    F_idcardCheck (value) {
      return Validator.IsIdCard(value)
    },

    // 图片文件读取后触发
    F_afterReadFile () {
      console.log(this.data.fileList)
    },

    // 地图位置选择回调
    F_selectPostionCallback (positionData) {
      console.log('接收到地图信息', positionData)
      this.data.mapLocation = positionData
    },

    // 选择地图位置
    F_selectPostion () {
      const url = '/merchant/userinfo/selectmappostion' +
        this.$Common.KhttpBuildQuery({
          redirectUrl: this.$route.path,
          lng: this.data.mapLocation.lng || '',
          lat: this.data.mapLocation.lat || '',
          keyword: this.data.mapLocation.name || ''
        })

      this.$router.push(url)
    },

    // 上传头像
    F_uploadAvatar (evt) {
      const fileinput = evt.target

      const files = fileinput.files

      console.log(files)
    }
  }
}
</script>

<style lang="scss" scoped>
.bkwhite-container{
  background: #FFF;
}
</style>
