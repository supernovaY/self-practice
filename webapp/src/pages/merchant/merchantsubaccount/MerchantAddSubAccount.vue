<template>
  <div>
    <Common-PageContainer>
      <template v-slot:content>
        <van-form ref="sform">
          <van-field
            v-model="formdata.name"
            required
            name="name"
            label="姓名"
            placeholder="请输入姓名"
            :rules="[{ required: true, message: '请填写姓名' }]"
          />

          <van-field
            v-model="formdata.phone"
            required
            name="phone"
            label="联系方式"
            placeholder="请输入联系手机号"
            :rules="[{ required: true, pattern:Validator.Mobile, message: '请正确填写联系手机号' }]"
          />

          <van-field
            v-model="formdata.cardNo"
            required
            name="cardNo"
            label="身份证号"
            placeholder="请输入身份证号"
            :rules="rules.idcard"
          />

          <!-- 商家图片 -->
          <div class="j-m bkwhite-container">
            <Common-PageDevideHeight />
            <Common-PageDevideHeight />

            <van-button block type="info" @click="F_submitData">
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
        name: '',
        cardNo: '',
        phone: '',
        id: ''
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
    // 商户机构信息存放
    merchantInfo (state) {
      return state.localData.merchantInfo
    }
  }),

  mounted () {
    // 设置搜索商户ID
    this.formdata.id = this.merchantInfo.id
  },

  methods: {
    // 提交表单数据
    F_submitData () {
      this.$refs.sform.validate()
        .then(async () => {
          this.$Common.showLoading(true)

          const submitResult = await this.$Api.merchant.addSubAccount(
            this.formdata
          )

          this.$Common.showLoading(false)

          // 成功
          if (submitResult.code === 2000) {
            this.$router.back()
            return
          }

          this.$toast(submitResult.message)
        })
        .catch((err) => {
          this.$toast(err[0].message)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.bkwhite-container{
  background: #FFF;
}
</style>
