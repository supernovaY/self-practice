<template>
  <div>
    <Common-PageContainer>
      <template v-slot:content>
        <div class="header">
          <div class="step-container">
            <Common-PageDevideHeight />

            <div class="j-m">
              <div class="j-flex">
                <div class="step step-1">
                  <div>
                    <div class="iconblock iconblock-img iconblock-checked"></div>
                    <div class="text-name">申请提交</div>
                  </div>
                </div>

                <div class="flex">
                  <img class="arrow" src="../../../assets/img/img_jt@3x.png" />
                </div>

                <div :class="pagestatus.checkStatus > 0 ? 'step step-2-ok' : 'step step-2'">
                  <div>
                    <div
                      v-if="pagestatus.checkStatus > 0"
                      class="iconblock iconblock-img iconblock-checked"></div>

                    <div
                      v-if="pagestatus.checkStatus <= 0"
                      class="iconblock iconblock-color j-fc-blue">2</div>

                    <div class="text-name">审核中</div>
                  </div>
                </div>

                <div class="flex">
                  <img class="arrow" src="../../../assets/img/img_jt@3x.png" />
                </div>

                <div :class="pagestatus.checkStatus >= 1 ? 'step step-3-ok' : 'step step-3'">
                  <div>
                    <div
                      v-if="pagestatus.checkStatus == 1"
                      class="iconblock iconblock-img iconblock-fail"></div>
                    <div
                      v-if="pagestatus.checkStatus == 2"
                      class="iconblock iconblock-img iconblock-checked"></div>

                    <div
                      v-if="pagestatus.checkStatus <= 0"
                      class="iconblock iconblock-color j-fc-blue">3</div>

                    <div v-if="pagestatus.checkStatus <= 0" class="text-name">审核结果</div>
                    <div v-if="pagestatus.checkStatus == 1" class="text-name">申请失败</div>
                    <div v-if="pagestatus.checkStatus == 2" class="text-name">申请通过</div>
                  </div>
                </div>
              </div>
            </div>

            <Common-PageDevideHeight />

            <div class="j-m">
              <div v-if="pagestatus.checkStatus <= 0" class="step-result-content">
                <div>您的代持申请已提交，目前正在审核中</div>
                <div>您可在首页消息中心 “<span class="fas fa-bell"></span>” 查看申请进度</div>
                <div>如有问题，可联系户籍所在退役军人服务中心</div>
              </div>

              <div v-if="pagestatus.checkStatus == 2" class="step-result-content">
                <div>您的代持申请已通过</div>
                <div>如有问题，可联系</div>
                <div>户籍所在退役军人服务中心</div>
              </div>

              <div v-if="pagestatus.checkStatus == 1" class="step-result-content ">
                <div v-html="data.failmessage"></div>
                <div>{{ data.suggest || '' }}</div>
              </div>
            </div>

            <Common-PageDevideHeight />

            <div class="appyinfo-overlap"></div>
          </div>
        </div>

        <!-- 申请信息 -->
        <div class="j-m">
          <div class="appyinfo">
            <div class="title j-m">申请信息</div>

            <div class="form-group nomargin-b">
              <div class="c lineto-txtlr">
                <div class="input j-flex j-flex-center">
                  <div class="label-msg auto-width important-front">
                    退役军人与您的关系：
                  </div>

                  <div class="flex right-txt">
                    {{ data.relationType[data.applyinfo.relationType] || '' }}
                  </div>
                </div>
              </div>

              <div class="c lineto-txtlr">
                <div class="input j-flex j-flex-center">
                  <div class="label-msg auto-width important-front">
                    您的联系方式：
                  </div>

                  <div class="flex right-txt">
                    {{ $Common.StringTakeoff(data.applyinfo.phone || '',3,4) }}
                  </div>
                </div>
              </div>

              <div class="c lineto-txtlr">
                <div class="input reason-nopadding-bottom j-flex j-flex-center">
                  <div class="label-msg auto-width important-front">
                    申请代持原因：
                  </div>

                  <div class="flex right-txt">

                  </div>
                </div>

                <div class="input reason-nopadding-top">
                  {{ data.applyinfo.applyReason || '' }}
                </div>
              </div>

              <div class="c lineto-txtlr">
                <div class="input j-flex j-flex-center">
                  <div class="label-msg auto-width important-front">
                    退役军人的身份证号码：
                  </div>

                  <div class="flex right-txt">
                    {{ $Common.StringTakeoff(data.applyinfo.soldierCardNo || '',3,3) }}
                  </div>
                </div>
              </div>

              <div class="c lineto-txtlr noborder">
                <div class="input j-flex j-flex-center">
                  <div class="label-msg auto-width important-front">
                    附件（退役军人本人信息）：
                  </div>

                  <div class="flex right-txt">

                  </div>
                </div>

                <div class="input armyphotosinfo">
                  <div class="j-flex">
                    <div class="flex">
                      <div
                        class="picbackground"
                        v-if="data.applyinfo.cardPersona"
                        :style="data.applyinfo.cardPersona ? {'background-image':'url(' + data.applyinfo.cardPersona + ')'} : ''"></div>

                      <img
                        v-if="!data.applyinfo.cardPersona"
                        src="../../../assets/img/img_fj1@3x.png"
                        title="身份证人像面" />
                    </div>

                    <div class="img-dividewidth"></div>

                    <div class="flex">
                      <div
                        class="picbackground"
                        v-if="data.applyinfo.cardEmblem"
                        :style="data.applyinfo.cardEmblem ? {'background-image':'url(' + data.applyinfo.cardEmblem + ')'} : ''"></div>

                      <img
                        v-if="!data.applyinfo.cardEmblem"
                        src="../../../assets/img/img_fj2@3x.png"
                        title="身份证国徽面" />
                    </div>
                  </div>

                  <div class="img-divideheight"></div>

                  <div class="j-flex">
                    <div class="flex">
                      <div
                        class="picbackground"
                        v-if="data.applyinfo.holdCard"
                        :style="data.applyinfo.holdCard ? {'background-image':'url(' + data.applyinfo.holdCard + ')'} : ''"></div>

                      <img
                        v-if="!data.applyinfo.holdCard"
                        src="../../../assets/img/img_fj3@3x.png"
                        title="手持身份证半身照" />
                    </div>

                    <div class="img-dividewidth"></div>

                    <div class="flex">
                      <div
                        class="picbackground"
                        v-if="data.applyinfo.householdRegister"
                        :style="data.applyinfo.householdRegister ? {'background-image':'url(' + data.applyinfo.householdRegister + ')'} : ''"></div>

                      <img
                        v-if="!data.applyinfo.householdRegister"
                        src="../../../assets/img/img_fj4@3x.png"
                        title="户口簿本人页" />
                    </div>
                  </div>

                  <div class="img-divideheight"></div>

                  <div class="j-flex">
                    <div class="flex">
                      <div
                        class="picbackground"
                        v-if="data.applyinfo.demobilizerCertification"
                        :style="data.applyinfo.demobilizerCertification ? {'background-image':'url(' + data.applyinfo.demobilizerCertification + ')'} : ''"></div>

                      <img
                        v-if="!data.applyinfo.demobilizerCertification"
                        src="../../../assets/img/img_fj5@3x.png"
                        title="退役证" />
                    </div>

                    <div class="img-dividewidth"></div>

                    <div class="flex">

                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Common-PageDevideHeight />

            <div class="j-m">
              <van-button
                v-if="pagestatus.checkStatus == 1"
                type="info"
                block
                @click="$router.push('/army/incharge?editid=' + data.applyinfo.id)"
              >重新申请</van-button>
            </div>
          </div>
        </div>

        <Common-PageFooter />
      </template>
    </Common-PageContainer>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 状态控制
      pagestatus: {
        checkStatus: 0,
        checkStep: 0
      },

      // 数据存放
      data: {
        // 关系枚举
        relationType: {},

        // 申请信息
        applyinfo: {},

        // 失败原因
        failmessage: '',
        suggest: ''
      }
    }
  },

  watch: {
    '$route.params.id' () {
      this.F_loadProcessInfo()
    }
  },

  mounted () {
    this.F_loadRelation()
  },

  methods: {
    // 修改步骤
    F_changeStep (step) {
      this.pagestatus.checkStatus = this.pagestatus.checkStatus === 1 ? 2 : 1
    },

    // 加载关系数据
    async F_loadRelation () {
      const data = await this.$Api.common.category(
        this.$Config.enumConfig.armyrelocation
      )

      this.F_loadProcessInfo()

      if (data.code === 2000) {
        data.result.map((item, index) => {
          if (item.value) {
            this.data.relationType[item.value] = item.label
          }
        })
        return
      }

      this.$toast('关系类型数据加载失败')
    },

    // 加载申请详情
    async F_loadProcessInfo () {
      this.$Common.showLoading(true)

      const data = await this.$Api.army.incharge.getProcessInfo(
        this.$route.params.id
      )

      this.$Common.showLoading(false)

      if (data.code === 2000) {
        const result = data.result

        this.data.applyinfo = result.chargeApply
        this.pagestatus.checkStatus = result.checkStatus || 0

        const failmessage = result.message.split(':')

        this.data.failmessage = failmessage.join('<br>')
        this.data.suggest = result.suggest
        return
      }

      this.$toast('申请信息请求失败')
    }
  }
}
</script>

<style lang="scss" scoped>
.header{
  background: url(../../../assets/img/img_jsbd_top@3x.png) no-repeat center bottom;
  background-size: cover;
}

.reason-nopadding-top{
  padding-top: 0;
}
.reason-nopadding-bottom{
  padding-bottom: 0;
}

.armyphotosinfo{
  .img-dividewidth{
    width: 10px;
  }

  .img-divideheight{
    height: 10px;
  }

  img{
    display: block;
    width: 100%;
  }

  .picbackground{
    height: 90px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
}

.step-container{
  text-align: center;
  color: #FFF;

  .step-result-content{
    font-size: 14px;
    margin: 10px;
    line-height: 1.6;
  }

  .step-1{
    margin-right: 10px;
  }

  .step-2{
    margin: 5px 10px;
  }
  .step-2-ok{
    margin: 0 10px;
  }

  .step-3{
    margin: 5px 0 5px 10px;
  }
  .step-3-ok{
    margin-left: 10px;
  }

  .arrow{
    max-width: 100%;
    display: inline-block;
    margin-top: 15px;
  }

  .text-name {
    font-size: 14px;
  }

  .iconblock {
    display: inline-block;
    width: 26px;
    height: 26px;
  }

  .iconblock-img{
    margin-bottom: 4px;
  }

  .iconblock-color{
    background: #FFF;
    opacity: .7;
    border-radius: 50%;
    line-height: 26px;
    margin: 5px 5px 9px 5px;
  }

  .iconblock-checked{
    background: url(../../../assets/img/ic_bzwc@3x.png) no-repeat center center;
    background-size: contain;
    width: 36px;
    height: 36px;
  }

  .iconblock-fail{
    background: url(../../../assets/img/ic_bzsb@3x.png) no-repeat center center;
    background-size: contain;
    width: 36px;
    height: 36px;
  }
}

.appyinfo-overlap{
  height: 50px;
}

.appyinfo{
  background: #FFF;
  box-shadow: 0 2px 8px 0 rgba(180,193,203,0.50);
  border-radius: 4px;
  padding: 24px 0;
  position: relative;
  top: -50px;

  .title{
    font-size: 22px;
  }
}
</style>
