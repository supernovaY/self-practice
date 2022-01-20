<template>
  <div>
    <Common-PageContainer>
      <template #content>
        <div class="container">
          <h2>添加求职意向</h2>
          <van-form ref="sform">
            <van-field
              class="arrow ellipsis"
              required
              readonly
              clickable
              name="picker"
              :value="showformdata.industry"
              label="意向行业"
              placeholder="点击选择行业"
              @click="F_selectIndustry"
              :rules="[{ required: true, message: '请选择意向行业' }]"
            />
            <!-- 行业选择组件 -->
            <IndustryPicker
              ref="industrypicker"
              :checkedSubId="formdata.industry"
              @select="F_selectIndustryCallback">
            </IndustryPicker>

            <van-field
              class="arrow"
              required
              clickable
              readonly
              type="text"
              label="意向岗位"
              :value="showformdata.stationId"
              placeholder="点击选择岗位"
              @click="F_selectJob"
              :rules="[{ required: true, message: '请选择意向岗位' }]"
            />
            <!-- 岗位类型选择 -->
            <PickerJob
              ref="pickerjob"
              @select="F_selectJobTypeCallback">
            </PickerJob>

            <van-field
              class="arrow"
              required
              clickable
              readonly
              type="text"
              label="意向薪资"
              :value="showformdata.salaryLimit"
              placeholder="点击选择薪资"
              @click="showSalaryPicker"
              :rules="[{ required: true, message: '请选择意向薪资' }]"
            />
            <PickerSalary @confirmSalary="updateSalary" ref="pickersalary" />

            <van-field
              class="arrow"
              required
              clickable
              readonly
              type="text"
              label="工作地点"
              :value="showformdata.areacode"
              placeholder="点击选择工作地点"
              @click="$refs.citypicker.F_show()"
              :rules="[{ required: true, message: '请选择工作地点' }]"
            />

            <van-field
              class="arrow"
              required
              clickable
              readonly
              type="text"
              label="工作类型"
              :value="showformdata.jobType"
              placeholder="点击选择工作类型"
              @click="pagestatus.jobstationtypeshow = true"
              :rules="[{ required: true, message: '请选择工作类型' }]"
            />
          <Common-PageDevideHeight />
          </van-form>

          <div v-if="pagestatus.formtype == 'add'" class="btn-box">
            <van-button type="info" @click="F_submitData">完成</van-button>
          </div>

          <div v-if="pagestatus.formtype == 'edit'" class="btn-box">
            <van-button type="info" plain @click="F_del">删除</van-button>
            <van-button type="info" @click="F_submitData">完成</van-button>
          </div>
        </div>
        <Common-PageFooter />
      </template>
    </Common-PageContainer>

    <!-- 城市选择 -->
    <CityPicker
      ref="citypicker"
      :cityLevel="1"
      @selected="F_selectCity"></CityPicker>

    <!-- 岗位类型 -->
    <van-popup v-model="pagestatus.jobstationtypeshow" position="bottom">
      <van-picker
        ref="jobstationtype"
        show-toolbar
        title="选择岗位"
        :columns="data.jobStationType"
        value-key="label"
        @confirm="F_selectJobStation"
        @cancel="pagestatus.jobstationtypeshow = false"
      />
    </van-popup>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import IndustryPicker from '@/components/pickerindustry/IndustryPicker.vue'
import PickerJob from '@/components/pickerjob/PickerJob.vue'
import PickerSalary from '@/components/pickersalary/PickerSalary.vue'
import CityPicker from '@/components/citypicker/CityPicker.vue'

export default {
  components: {
    IndustryPicker,
    PickerJob,
    PickerSalary,
    CityPicker
  },

  data () {
    return {
      // 页面状态控制
      pagestatus: {
        // 当前表单模式 add添加 edit编辑
        formtype: 'add',

        // 是否显示意向工资
        moneyshow: false,

        // 工作类型选择显示
        jobstationtypeshow: false
      },

      // 表单数据
      formdata: {
        // 军人ID
        armyId: '',

        // 行业
        industry: '',

        // 岗位意向
        stationId: '',

        // 薪资下限
        salaryLowerLimit: '',

        // 薪资上限
        salaryTopLimit: '',

        // 意向工作地
        areacode: '',

        // 岗位工作类型
        jobType: ''
      },

      // 表单显示使用
      showformdata: {
        // 行业
        industry: '',

        // 薪资下限
        salaryLimit: '',

        // 岗位意向
        stationId: '',

        // 意向工作地
        areacode: '',

        // 岗位工作类型
        jobType: ''
      },

      // 数据存放
      data: {
        // 工资意向范围
        moneyList: [],

        // 岗位类型
        jobStationType: []
      }
    }
  },

  computed: mapState({
    // 当前军人用户信息
    armyInfo (state) {
      return state.localData.armyInfo
    }
  }),

  watch: {
    // 监听路由 ID变化
    '$route.params.id' () {
      this.F_initForm()
    }
  },

  mounted () {
    this.F_initForm()

    this.F_loadDicData()
  },

  methods: {
    // 初始化表单
    F_initForm () {
      this.formdata.armyId = this.armyInfo.id

      if (this.$route.params.id === 'new') {
        // 新增
        this.pagestatus.formtype = 'add'
      } else {
        // 编辑
        this.pagestatus.formtype = 'edit'
        this.F_loadEditData()
      }
    },

    // 编辑数据加载
    async F_loadEditData () {
      const data = await this.$Api.army.job.getIntentionDetail(
        this.$route.params.id
      )

      if (data.code === 2000) {
        for (const i in this.formdata) {
          this.formdata[i] = data.result[i]
        }

        // 显示数据 字段映射
        const showKeys = {
          // 行业
          industry: 'industryName',

          // 岗位意向
          stationId: 'stationName',

          // 意向工作地
          areacode: 'areaName',

          // 岗位工作类型
          jobType: 'jobTypeName'
        }

        for (const i in showKeys) {
          this.showformdata[i] = data.result[showKeys[i]]
        }

        // 金额显示处理
        this.showformdata.salaryLimit = this.$Common.showSalaryLabel(data.result.salaryLowerLimit, data.result.salaryTopLimit)
        return
      }

      this.$toast('求职意向数据加载失败')
    },

    // 加载字典表选项数据
    async F_loadDicData () {
      // 加载岗位工作类型
      const stationId = await this.$Api.common.categoryNoHead('JOB_STATION_TYPE')
      if (stationId.code === 2000) {
        this.data.jobStationType = stationId.result
      }
    },

    // 选择城市回调
    F_selectCity (citydata) {
      // console.log(citydata)
      const citylist = []

      citydata.map((item) => {
        if (item.area_code) {
          citylist.push(item.area_name)
        }
      })

      this.showformdata.areacode = citylist.join('')
      this.formdata.areacode = citydata[citylist.length - 1].area_code
    },

    // 岗位类型选择
    F_selectJobStation (item) {
      this.pagestatus.jobstationtypeshow = false
      const selectItem = this.$refs.jobstationtype.getValues()
      this.showformdata.jobType = selectItem[0].label
      this.formdata.jobType = selectItem[0].value
    },

    // 打开岗位选择窗口
    F_selectJob () {
      this.$refs.pickerjob.F_show()
    },

    // 岗位类型选择回调
    F_selectJobTypeCallback (data) {
      this.formdata.stationId = data.value
      this.showformdata.stationId = data.labels[data.labels.length - 1]
    },

    // 行业选择
    F_selectIndustry () {
      this.$refs.industrypicker.F_show()
    },

    // 行业选择回调
    F_selectIndustryCallback (data) {
      this.showformdata.industry = data.labels[data.labels.length - 1]
      this.formdata.industry = data.value
    },

    // 删除求职意向
    F_del () {
      this.$dialog.confirm({
        title: '删除确认',
        message: '是否删除该条求职意向？'
      }).then(async () => {
        this.$Common.showLoading(true)
        const data = await this.$Api.army.job.delJobIntention(
          this.$route.params.id
        )
        this.$Common.showLoading(false)

        if (data.code === 2000) {
          this.$toast('删除成功')
          this.$router.back()
          return
        }

        this.$toast('删除失败，错误信息：' + data.message)
      }).catch(() => {
        // on cancel
      })
    },

    // 提交信息
    F_submitData () {
      this.$refs.sform.validate().then(async () => {
        console.log(this.formdata)
        const sdata = Object.assign({}, this.formdata)

        if (this.pagestatus.formtype === 'edit') {
          sdata.id = this.$route.params.id
        }

        this.$Common.showLoading(true)

        const data = await this.$Api.army.job.addEditJobIntention(sdata)

        if (data.code === 2000) {
          this.$toast('保存成功')
          this.$router.back()
          return
        }

        this.$toast('保存失败，错误信息：' + data.message)
      }).catch(() => {

      })
    },
    showSalaryPicker () {
      this.$refs.pickersalary.F_show()
    },
    updateSalary (params) {
      this.formdata.salaryLowerLimit = params.min
      this.formdata.salaryTopLimit = params.max
      this.showformdata.salaryLimit = this.$Common.showSalaryLabel(params.min, params.max)
    }
  }
}
</script>

<style lang="scss" scoped>
.container{
  overflow: hidden;
  background: #FFF;
  h2 {
    margin: 0;
    padding: 15px 16px 5px;
    font-size: 22px;
    font-weight: bold;
    color: #404956;
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
