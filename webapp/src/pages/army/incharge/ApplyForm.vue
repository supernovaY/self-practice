<template>
  <div>
    <Common-PageContainer>
      <template v-slot:content>
        <van-form ref="sform">
          <div class="headertip">
            <div class="j-m j-flex j-flex-center">
              <div class="infoicon">
                <span class="j-fc-blue fas fa-info-circle"></span>
              </div>

              <div>请确保信息真实有效，提交信息后我们会进行核实核对。</div>
            </div>
          </div>

          <van-radio-group
            v-model="formdata.relationType"
            class="form-group nomargin-t relationcheck">
            <div class="c lineto-txt lineto-txtlr">
              <div class="input j-flex j-flex-center">
                <div class="label-msg auto-width important-front">
                  退役军人与您的关系
                </div>

                <div class="mr-8">
                  <van-tag
                    type="primary"
                    size="large"
                    color="rgba(128,141,161,0.10)"
                    text-color="#808DA1"
                    >单选</van-tag
                  >
                </div>
              </div>
            </div>

            <div
              v-for="(item,index) in data.relationType"
              :key="index"
              class="c lineto-txtlr">
              <div class="input j-flex j-flex-center">
                <div class="flex">
                  <van-radio :name="item.value">{{ item.text }}</van-radio>
                </div>
              </div>
            </div>
          </van-radio-group>

          <van-field
            required
            clearable
            v-model="formdata.phone"
            type="number"
            label="您的联系方式"
            maxlength="11"
            placeholder="请输入"
            :rules="[{ pattern: Validator.Mobile, message: '请正确填写您的联系方式' }]"
          />

          <Common-PageDevideHeight />

          <van-field
            v-model="formdata.applyReason"
            required
            clearable
            rows="2"
            autosize
            label="申请代持原因"
            type="textarea"
            maxlength="50"
            placeholder="请输入申请代持原因"
            show-word-limit
            :rules="[{ required: true, message: '请填写申请代持原因' }]"
          />

          <Common-PageDevideHeight />

          <van-field
            required
            clearable
            v-model="formdata.soldierName"
            label="退役军人姓名"
            maxlength="15"
            placeholder="请输入"
            :rules="[{ required: true, message: '请填写退役军人姓名' }]"
          />

          <van-field
            required
            clearable
            v-model="formdata.soldierCardNo"
            label="退役军人身份证"
            maxlength="18"
            placeholder="请输入"
            :rules="rules.idcard"
          />
        </van-form>

        <div class="form-group">
          <div class="c lineto-txt lineto-txtlr">
            <div class="input j-flex j-flex-center">
              <div class="label-msg auto-width important-front">
                <span class="relationcheck">添加附件（退役军人本人信息）</span>
              </div>
            </div>
          </div>

          <div class="c lineto-txt lineto-txtlr">
            <div class="input uploadcontainer">
              <div class="j-flex j-flex-center">
                <div class="flex">
                  <ImgSelector
                    ref="cardPersona"
                    @selectimg="F_imgSelect('cardPersona')"
                    titlename="身份证人面像">
                    <img src="../../../assets/img/img_fj1@3x.png" />
                  </ImgSelector>
                </div>

                <div class="dividewidth"></div>

                <div class="flex">
                  <ImgSelector
                    ref="cardEmblem"
                    @selectimg="F_imgSelect('cardEmblem')"
                    titlename="身份证国徽面">
                    <img src="../../../assets/img/img_fj2@3x.png" />
                  </ImgSelector>
                </div>
              </div>

              <div class="divideheight"></div>

              <div class="j-flex j-flex-center">
                <div class="flex">
                  <ImgSelector
                    ref="holdCard"
                    @selectimg="F_imgSelect('holdCard')"
                    titlename="手持身份证半身照">
                    <img src="../../../assets/img/img_fj3@3x.png" />
                  </ImgSelector>
                </div>

                <div class="dividewidth"></div>

                <div class="flex">
                  <ImgSelector
                    ref="householdRegister"
                    @selectimg="F_imgSelect('householdRegister')"
                    titlename="户口簿本人页">
                    <img src="../../../assets/img/img_fj4@3x.png" />
                  </ImgSelector>
                </div>
              </div>

              <div class="divideheight"></div>

              <div class="j-flex j-flex-center">
                <div class="flex">
                  <ImgSelector
                    ref="demobilizerCertificate"
                    @selectimg="F_imgSelect('demobilizerCertificate')"
                    titlename="退役证">
                    <img src="../../../assets/img/img_fj5@3x.png" />
                  </ImgSelector>
                </div>

                <div class="dividewidth"></div>

                <div class="flex">

                </div>
              </div>
            </div>
          </div>
        </div>

        <Common-PageFooter />

        <div class="j-common-bottomheightfix"></div>
      </template>

      <template #fixbottom>
        <div class="j-m">
          <Common-PageDevideHeight />

          <van-button type="info" size="large" @click="F_submitData">
            提交代持申请
          </van-button>

          <Common-PageDevideHeight />
        </div>
      </template>
    </Common-PageContainer>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Validator from '@/assets/js/Validator.js'
import ImgSelector from './ImgSelector.vue'

export default {
  components: {
    ImgSelector
  },

  data () {
    return {
      // 表单数据对象
      formdata: {
        // 申请人与退伍军人关系 1父母 2子女 3配偶
        relationType: '1',

        // 申请人联系方式
        phone: '',

        // 代持原因
        applyReason: '',

        // 退役军人姓名
        soldierName: '',

        // 退役军人身份证号
        soldierCardNo: '',

        // 身份证人像面图片地址
        cardPersona: '',

        // 身份证国徽面图片地址
        cardEmblem: '',

        // 手持身份证半身照图片地址
        holdCard: '',

        // 户口本图片地址
        householdRegister: '',

        // 退役证图片地址
        demobilizerCertificate: ''
      },

      // 正则对象
      Validator: Validator,

      rules: {
        // 身份证校验
        idcard: [
          {
            require: true,
            message: '请正确填写退役军人身份证号',
            validator: (value, rule) => {
              return Validator.IsIdCard(value)
            }
          }
        ]
      },

      // 数据存放
      data: {
        // 关系类型
        relationType: [],

        // 图片校验列表
        checkList: {
          // 身份证人像面图片地址
          cardPersona: '身份证人像面',

          // 身份证国徽面图片地址
          cardEmblem: '身份证国徽面',

          // 手持身份证半身照图片地址
          holdCard: '手持身份证半身照',

          // 户口本图片地址
          householdRegister: '户口簿本人页',

          // 退役证图片地址
          demobilizerCertificate: '退役证'
        }
      }
    }
  },

  computed: mapState({
    GET: 'GET',
    Userinfo: 'armyInfo',
    browerEnvStatus: 'browerEnvStatus'
  }),

  mounted () {
    this.F_loadRelation()

    // 如果为编辑代持则补充数据
    if (this.$route.query.editid) {
      this.F_editAutoFill()
    }
  },

  methods: {
    // 加载编辑信息 自动填充
    async F_editAutoFill () {
      const data = await this.$Api.army.incharge.getProcessInfo(
        this.$route.query.editid
      )

      if (data.code === 2000) {
        const formdata = data.result.chargeApply

        for (const i in formdata) {
          if (typeof (this.formdata[i]) !== 'undefined') {
            this.formdata[i] = '' + formdata[i]
          }

          // 退役军人证 字段不一样
          if (i === 'demobilizerCertification') {
            this.formdata.demobilizerCertificate = '' + formdata[i]
          }
        }

        for (const i in this.data.checkList) {
          if (this.formdata[i]) {
            this.$refs[i].imgbase64 = this.formdata[i]
          }
        }

        // 带上ID
        this.formdata.lastId = this.$route.query.editid
      }
    },

    // 加载关系类型
    async F_loadRelation () {
      const data = await this.$Api.common.category(
        this.$Config.enumConfig.armyrelocation
      )

      if (data.code === 2000) {
        data.result.map((item, index) => {
          item.value && this.data.relationType.push({
            text: item.label,
            value: item.value
          })
        })
        return
      }

      this.$toast('关系类型数据加载失败')
    },

    // 选择了新图片 重置已上传的数据如果中间发生网络问题
    F_imgSelect (datakey) {
      this.formdata[datakey] = ''

      // 临时共享数据图片数据
      // this.$emit('sharedata', { key: 'formdata', value: this.formdata })
    },

    // 上传图片
    async F_uploadImgs (finish) {
      for (const i in this.data.checkList) {
        const uploadData = this.$refs[i].imgbase64
        if (!this.formdata[i] && uploadData) {
          const urlData = await this.$Api.common.uploadBase64Image(
            uploadData
          )

          // console.log(urlData)

          if (urlData.code === 2000) {
            this.formdata[i] = urlData.result
          } else {
            this.$toast(this.data.checkList[i] + '上传失败')
          }
        }
      }

      finish()
    },

    // 提交表单数据
    async F_submitData () {
      this.$refs.sform.validate()
        .then(() => {
          if (!this.formdata.relationType) {
            this.$toast('请选择退役军人与您的关系')
            return
          }

          this.$Common.showLoading(true)

          this.F_uploadImgs(async () => {
            for (const i in this.data.checkList) {
              if (!this.formdata[i]) {
                this.$toast('请上传' + this.data.checkList[i])

                this.$Common.showLoading(false)
                return
              }
            }

            const submitResult = await this.$Api.army.incharge.apply(this.formdata)

            this.$Common.showLoading(false)

            // 申请成功
            if (submitResult.code === 2000) {
              this.$router.push('/army/incharge/applyprocess/' + submitResult.result)
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
.mr-8 {
  margin-left: 8px;
}

.headertip {
  background: #e8f4ff;
  color: #323233;
  padding: 12px 0;

  .infoicon {
    width: 24px;
    margin-right: 0.1rem;
    font-size: 16px;
  }
}

.relationcheck {
  color: #646566;
}

.van-tag--large {
  font-size: 12px;
}

/* 图片上传 */
.uploadcontainer{
  .dividewidth {
    width: 15px;
  }

  .divideheight {
    height: 8px;
  }

  img {
    width: 100%;
    display: block;
  }
}
</style>
