<template>
  <div>
    <Common-PageContainer>
      <template #content>
        <div class="container">
          <h2>创业意向登记</h2>
          <van-form ref="sform">
            <van-field required :rules="rules.industry" class="arrow ellipsis" readonly clickable name="industryPicker"
              :value="selectedIndustryName" label="创业意向行业:" placeholder="点击选择行业" @click="F_selectIndustry"
            />
            <IndustryPicker ref="industrypicker" :checkedSubId="formdata.industry" @select="F_selectIndustryCallback" />
            <van-field required :rules="rules.startupFund" clearable type="text" v-model="formdata.startupFund" label="创业启动资金：" maxlength="20" placeholder="请输入"/>
            <van-field required :rules="rules.startupAreaCode" readonly :value="selectedAreaName" @click="F_searchLocation" type="text" label="创业地点：" class="arrow" clearable placeholder="请选择"/>
            <city-picker ref="citypicker" @selected="F_selectCity" />
            <van-field required :rules="rules.plan" clearable v-model="formdata.plan" label="创业自我规划：" maxlength="200" placeholder="请输入"/>
            <van-field required :rules="rules.existProblems" clearable v-model="formdata.existProblems" label="当前存在问题：" maxlength="200" placeholder="请输入"/>
          <Common-PageDevideHeight />
          </van-form>
          <div class="btn-box" v-if="isAdd">
            <van-button type="info" @click="F_submitData('new')">完成</van-button>
          </div>
          <div class="btn-box" v-else>
            <van-button type="info" plain @click="delIntention()">删除</van-button>
            <van-button type="info" @click="F_submitData()">完成</van-button>
          </div>
        </div>
        <Common-PageFooter />
      </template>
    </Common-PageContainer>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import IndustryPicker from '@/components/pickerindustry/IndustryPicker.vue'
import CityPicker from '@/components/citypicker/CityPicker.vue'
export default {
  components: {
    IndustryPicker,
    CityPicker
  },
  data () {
    return {
      isAdd: false,
      selectedAreaName: '', // 选中的创业地点名称
      selectedIndustryName: '', // 选中的行业名称
      formdata: {
        industry: '',
        startupFund: '',
        startupAreaCode: '',
        plan: '',
        existProblems: ''
      },
      showIndustryPicker: false,
      rules: {
        industry: [{ required: true, message: '请选择创业意向行业' }],
        startupFund: [{ required: true, message: '请填写创业启动资金' }],
        startupAreaCode: [{ required: true, message: '请选择创业地点' }],
        plan: [{ required: true, message: '请填写创业自我规划' }],
        existProblems: [{ required: true, message: '请填写当前存在问题' }]
      }
    }
  },
  computed: {
    ...mapState({
      // 当前军人用户信息
      armyInfo (state) {
        return state.localData.armyInfo
      }
    })
  },
  mounted () {
    const _id = this.$route.params.id
    if (_id) {
      if (this.$route.params.id === 'new') {
        this.isAdd = true
      } else {
        this.getDetail()
      }
    }
  },
  methods: {
    async getDetail () { // 加载创业意向详情
      this.$Common.showLoading(true)
      const data = await this.$Api.army.startup.getStartupIntentionDetail(this.$route.params.id)
      this.$Common.showLoading(false)
      if (data.code === 2000 && data.result) {
        this.formdata = data.result
        this.selectedAreaName = data.result.startupAreaCodeName
        this.selectedIndustryName = data.result.industryName
      }
    },
    // 行业选择
    F_selectIndustry () {
      this.$refs.industrypicker.F_show()
    },
    // 行业选择回调
    F_selectIndustryCallback (data) {
      this.selectedIndustryName = data.labels[data.labels.length - 1]
      this.formdata.industry = data.value
    },
    F_searchLocation () {
      this.$refs.citypicker.F_show()
    },
    F_selectCity (citydata) {
      const citylist = []
      citydata.map((item) => {
        if (item.area_code) {
          citylist.push(item.area_name)
        }
      })
      this.selectedAreaName = citylist.join('')
      this.formdata.startupAreaCode = citydata[citylist.length - 1].area_code
    },
    // 提交表单数据
    F_submitData () {
      this.$refs.sform.validate().then(async () => {
        this.$Common.showLoading(true)
        this.formdata.soldierId = this.armyInfo.id
        const submitResult = await this.$Api.army.startup.saveSartupIntention(this.formdata)
        this.$Common.showLoading(false)
        // 保存成功
        if (submitResult.code === 2000) {
          this.$router.back()
          return
        }
        this.$toast(submitResult.message)
      })
    },
    delIntention () {
      this.$dialog.confirm({
        title: '删除',
        message: '确认删除此创业意向吗？'
      }).then(async () => {
        this.$Common.showLoading(true)
        const data = await this.$Api.army.startup.removeStartupIntention(this.$route.params.id)
        this.$Common.showLoading(false)
        if (data.code === 2000) {
          this.$toast('删除成功')
          this.$router.back()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/variables.scss";
.container{
  overflow: hidden;
  background: #FFF;
  h2 {
    margin: 0;
    padding: 15px 16px 5px;
    font-size: 22px;
    font-weight: bold;
  }
  .btn-box{
    display: flex;
    padding: 20px 16px;
    margin: 0 -5px;
    button{
      display: block;
      width: 100%;
      margin: 0 5px;
    }
  }
}
</style>
