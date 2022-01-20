<template>
  <div>
    <Common-PageContainer>
      <template #content>
        <div class="container">
          <h2>个人信息</h2>
          <van-form ref="sform">
            <van-field readonly :value="data.armyinfo.userName" type="text" label="姓名：" maxlength="10" placeholder="请输入"/>

            <van-field
              readonly
              :value="data.soldierYear[ formdata.soldierYear ] ? data.soldierYear[ formdata.soldierYear ].label : ''"
              type="text"
              label="服役年限："
              maxlength="10"
              placeholder=""
            />

            <van-field
              readonly
              :value="data.armyinfo.birthDay"
              label="出生年月："
            />

            <van-field
              required
              clearable
              v-model="formdata.contactPhone"
              type="number"
              label="联系方式："
              maxlength="50"
              placeholder="请输入联系手机号码"
              :rules="[{ pattern: Validator.Mobile, message: '请正确输入联系手机号码' }]"
            />

            <van-field
              @click="pagestatus.showServiceYearPicker = true"
              required
              class="arrow"
              readonly
              clickable
              :value="showformdata.workExperience"
              label="工作经验："
              placeholder="点击选择工作经验"
              :rules="[{ required: true, message: '请选择工作经验' }]"
            />

            <van-popup v-model="pagestatus.showServiceYearPicker" position="bottom">
              <van-picker
                show-toolbar
                :columns="data.workExperience"
                @confirm="F_workYearSelect"
                @cancel="pagestatus.showServiceYearPicker = false"
              />
            </van-popup>

            <van-field required name="monitor" label="当过班长：">
              <template #input>
                <van-radio-group v-model="formdata.ifMonitor" direction="horizontal">
                  <van-radio name="1">是</van-radio>
                  <van-radio name="0">否</van-radio>
                </van-radio-group>
              </template>
            </van-field>

            <van-field
              class="arrow"
              required
              readonly
              @click="pagestatus.showEducationPicker = true"
              clickable name="educationPicker"
              :value="showformdata.mineducation"
              label="学历："
              placeholder="点击选择学历"
            />
            <van-popup v-model="pagestatus.showEducationPicker" position="bottom">
              <van-picker
                show-toolbar
                :columns="data.mineducation"
                @confirm="F_onEducationConfirm"
                @cancel="pagestatus.showEducationPicker = false"
              />
            </van-popup>

            <van-field required name="monitor" label="持有驾照：">
              <template #input>
                <van-checkbox-group v-model="showformdata.driveLincense" direction="horizontal">
                  <van-checkbox
                    v-for="(item,index) in data.driveLincense"
                    :key="index"
                    :name="item.value"
                    @click="F_selectDriverCert(item)">
                    {{ item.label }}
                  </van-checkbox>
                </van-checkbox-group>
              </template>
            </van-field>

            <van-field v-model="formdata.advantge" clearable type="textarea" label="个人优势：" maxlength="200" placeholder="请输入"/>
          </van-form>
        </div>

        <Common-PageDevideHeight />

        <div class="container">
          <h2>工作经验 <i class="van-icon van-icon-add-o" @click="addWork"></i></h2>
          <div
            class="box"
            v-for="(item, index) in formdata.workExperienceList"
            :key="index">
            <van-field
              clearable
              type="text"
              label="公司名称："
              maxlength="20"
              placeholder="请输入"
              v-model="item.enterpriseName"
            />

            <div class="time-box">
              <van-field
                type="text"
                label="在职时间："
                @click="F_showWorkTimePicker('start',index)"
                :value="item.jobStartTime"
                readonly
                placeholder="开始时间"
              />

              <van-field
                class="inline"
                type="text"
                label="-"
                @click="F_showWorkTimePicker('end',index)"
                :value="item.jobEndTime"
                readonly
                placeholder="结束时间"
              />
            </div>

            <van-field
              clearable
              type="text"
              label="岗位名称："
              maxlength="20"
              placeholder="请输入"
              v-model="item.stationName"
            />

            <van-field v-model="item.workContent" clearable type="textarea" label="内容：" maxlength="200" placeholder="请输入"/>

            <van-button
              v-if="item.deleteEnable"
              @click="F_delWorkItem(item,index)"
              class="btn-noradio"
              type="danger"
              block>
              <span class="far fa-trash-alt"></span> 删除
            </van-button>
          </div>
        </div>

        <div v-if="armyInfo.id" class="btn-box">
          <van-button type="info" @click="F_submitData()">保存</van-button>
        </div>

        <Common-PageFooter />
      </template>
    </Common-PageContainer>

    <van-popup v-model="pagestatus.showStartPicker" position="bottom">
      <van-datetime-picker
        v-model="data.workDateStart"
        type="year-month"
        :formatter="yearMonthFormatter"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="onStartMonthConfirm"
        @cancel="pagestatus.showStartPicker = false"
      />
    </van-popup>

    <van-popup v-model="pagestatus.showEndPicker" position="bottom">
      <van-datetime-picker
        v-model="data.workDateEnd"
        type="year-month"
        :formatter="yearMonthFormatter"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="onEndMonthConfirm"
        @cancel="pagestatus.showEndPicker = false"
      />
    </van-popup>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Validator from '@/assets/js/Validator.js'

export default {
  data () {
    return {
      // 表单校验对象
      Validator: Validator,

      // 状态控制
      pagestatus: {
        // add添加 or edit编辑
        formtype: 'add',

        // 是否显示工作经验选择
        showServiceYearPicker: false,

        // 学历选择显示
        showEducationPicker: false,

        // 工作经历时间选择
        showStartPicker: false,
        showEndPicker: false
      },

      // 表单对象
      formdata: {
        // 服役年限 默认1
        soldierYear: '',

        // 工作年限
        workExperience: '',

        // 学历
        mineducation: '',

        // 是否当过班长
        ifMonitor: '0',

        // 工作经验
        workExperienceList: [],

        // 个人优势
        advantge: '',

        // 联系电话
        contactPhone: ''
      },

      // 部分表单回显使用
      showformdata: {
        // 工作年限
        workExperience: '',

        // 学历
        mineducation: '',

        // 驾照
        driveLincense: []
      },

      // 数据存放
      data: {
        // 军人详情信息
        armyinfo: {},

        // 驾照 JOB_DRIVER_CERT
        driveLincense: [],

        // 工作经验字段表数据
        workExperience: [],

        // 服役年限范围映射
        soldierYearRange: {
          1: [0, 2],
          2: [3, 5],
          3: [6, 10],
          4: [10, 1000]
        },
        // 军人年限 字典表数据 JOB_SOLDIER_YEAR
        soldierYear: {},

        // 学历数据
        mineducation: [],

        // 编辑数据
        editData: {},

        // 工作经历日期选择绑定
        workDateStart: new Date(),
        workDateEnd: new Date(),
        editWorkIndex: 0
      },

      minDateDefault: new Date(1930, 0, 1),
      minDate: new Date(1930, 0, 1),
      maxDateDefault: new Date(),
      maxDate: new Date()
    }
  },

  computed: mapState({
    // 用户信息
    armyInfo (state) {
      return state.localData.armyInfo
    },

    // 登录用户信息
    Userinfo (state) {
      return state.localData.Userinfo
    },

    // 浏览器环境参数
    browerEnvStatus: 'browerEnvStatus'
  }),

  watch: {
    // 监听路由 ID变化
    '$route.params.id' (newV) {
      this.F_initForm()
    }
  },

  mounted () {
    this.F_initForm()
  },

  methods: {
    // 选择驾照
    F_selectDriverCert (item) {
      if (item.value === '0') {
        // 选择了无
        this.showformdata.driveLincense = ['0']
      } else {
        // 选择了 其他
        this.showformdata.driveLincense.map((item, index) => {
          if (item === '0' || item === 0) {
            this.showformdata.driveLincense.splice(index, 1)
          }
        })
      }
    },

    // 初始化表单
    F_initForm () {
      if (this.$route.params.id === '1' || this.$route.params.id === 1) {
        this.pagestatus.formtype = 'edit'
      } else {
        this.pagestatus.formtype = 'add'
      }

      this.F_getPersonalInfo()
      this.F_loadDicData()

      // 添加时 无法删除的一个工作经验
      if (this.pagestatus.formtype === 'add') {
        this.formdata.workExperienceList = [{
          showStartPicker: false,
          showEndPicker: false,
          // 企业名称
          enterpriseName: '',

          // 开始结束时间
          jobStartTime: '',
          jobEndTime: '',

          // 岗位名称
          stationName: '',

          // 工作内容
          workContent: '',

          // 能否删除
          deleteEnable: true
        }]
      }

      if (this.pagestatus.formtype === 'edit') {
        this.F_loadEditData()
      }
    },

    // 加载编辑信息
    async F_loadEditData () {
      this.$Common.showLoading(true)
      const data = await this.$Api.army.job.getResumeAndExpirence(
        this.armyInfo.id
      )
      this.$Common.showLoading(false)

      // console.log(data)
      if (data.code !== 2000) {
        this.$toast('编辑信息加载失败')
        return
      }

      this.data.editData = data.result

      // 初始化表单值 和显示
      const baseInfo = data.result.armyInfo
      const workExperienceList = data.result.workExperienceList

      // 驾照
      this.showformdata.driveLincense = baseInfo.driveLincense.split(',')

      // 个人优势
      this.formdata.advantge = baseInfo.advantge

      // 工作经验年限
      this.showformdata.workExperience = baseInfo.workExperienceName
      this.formdata.workExperience = baseInfo.workExperience

      // 联系方式
      this.formdata.contactPhone = baseInfo.contactPhone

      // 学历
      this.formdata.mineducation = baseInfo.mineducation
      this.showformdata.mineducation = baseInfo.mineducationName

      // 是否为班长
      this.formdata.ifMonitor = '' + baseInfo.ifMonitor

      // 工作经验列表
      if (workExperienceList && workExperienceList.length > 0) {
        data.result.workExperienceList.map((item, index) => {
          item.deleteEnable = true
          item.showStartPicker = false
          item.showEndPicker = false

          item.jobStartTime = this.$Common.kstrToDate(item.jobStartTime).Format('yyyy-MM')
          item.jobEndTime = this.$Common.kstrToDate(item.jobEndTime).Format('yyyy-MM')
          this.formdata.workExperienceList.push(item)
        })
      }
    },

    // 获取军人信息
    async F_getPersonalInfo () {
      this.$Common.showLoading(true)

      const data = await this.$Api.userinfo.getPersonalInfo({
        userId: this.armyInfo.id || this.Userinfo.id,
        userType: this.armyInfo.type
      })

      this.$Common.showLoading(false)

      if (data.code === 2000) {
        this.data.armyinfo = data.result || {}

        // 初始化服役年限处理
        this.F_soldierYearDeal()
      }
    },

    // 加载字典表数据
    async F_loadDicData () {
      // 加载工作经验
      const workExperienceData = await this.$Api.common.categoryNoHead('JOB_EXPERIENCE')

      if (workExperienceData.code === 2000) {
        workExperienceData.result.map((item) => {
          this.data.workExperience.push({
            text: item.label,
            value: item.value
          })
        })
      }

      // 加载学历列表数据
      const educationData = await this.$Api.common.categoryNoHead('JOB_EDUCATION')
      if (educationData.code === 2000) {
        educationData.result.reverse()

        educationData.result.map((item) => {
          this.data.mineducation.push({
            text: item.label,
            value: item.value
          })
        })
      }

      // 加载驾照数据
      const driveLincenseData = await this.$Api.common.categoryNoHead('JOB_DRIVER_CERT')
      if (educationData.code === 2000) {
        this.data.driveLincense = driveLincenseData.result
      }
    },

    // 军人服役年限处理
    async F_soldierYearDeal () {
      const data = await this.$Api.common.category('JOB_SOLDIER_YEAR')

      if (data.code === 2000) {
        data.result.map((item) => {
          if (item.value) {
            this.data.soldierYear[item.value] = item
          }
        })
      }

      const ArmyInfo = this.data.armyinfo

      // 存在军人服役时间
      if (ArmyInfo.enrollDt && ArmyInfo.demobilizeDt) {
        let startYear = ArmyInfo.enrollDt
        let endYear = ArmyInfo.demobilizeDt

        // 日期转换 ios特殊处理
        if (this.browerEnvStatus.isIOS) {
          startYear = startYear.replace(/-/g, '/')
          endYear = endYear.replace(/-/g, '/')
        }

        const startYearDate = parseInt(new Date(startYear).Format('yyyy'))
        const endYearDate = parseInt(new Date(endYear).Format('yyyy'))

        const yearCount = endYearDate - startYearDate
        for (const i in this.data.soldierYearRange) {
          const compareItem = this.data.soldierYearRange[i]

          if (yearCount >= compareItem[0] && yearCount <= compareItem[1]) {
            this.formdata.soldierYear = i
          }
        }

        // 无匹配年限 则默认1
        if (!this.formdata.soldierYear) {
          // 默认值1 3年以下
          this.formdata.soldierYear = 1
        }
        return
      }

      // 默认值1 3年以下
      this.formdata.soldierYear = 1
    },

    // 工作经验时间选择
    F_workYearSelect (item) {
      // console.log(item)
      this.formdata.workExperience = item.value
      this.showformdata.workExperience = item.text

      this.pagestatus.showServiceYearPicker = false
    },

    // 学历选择回调
    F_onEducationConfirm (item) {
      this.formdata.mineducation = item.value
      this.showformdata.mineducation = item.text
      this.pagestatus.showEducationPicker = false
    },

    onIndustryConfirm (val) {
      this.formdata.industry = val
      this.showIndustryPicker = false
    },

    yearMonthFormatter (type, val) {
      if (type === 'year') {
        return `${val}年`
      } else if (type === 'month') {
        return `${val}月`
      }
      return val
    },

    // 选择工作经验时间 处理最小可选日期
    // type start end
    F_showWorkTimePicker (type, index) {
      this.data.editWorkIndex = index

      const item = this.formdata.workExperienceList[index]

      if (type === 'start') {
        if (item.jobEndTime) {
          this.maxDate = this.$Common.kstrToDate(item.jobEndTime)
        } else {
          this.maxDate = this.maxDateDefault
        }

        this.minDate = this.minDateDefault

        this.pagestatus.showStartPicker = true
      }

      if (type === 'end') {
        this.maxDate = this.maxDateDefault

        if (item.jobStartTime) {
          this.minDate = this.$Common.kstrToDate(item.jobStartTime)
        } else {
          this.minDate = this.minDateDefault
        }

        this.pagestatus.showEndPicker = true
      }
    },

    // 工作经验 开始时间选择回调
    onStartMonthConfirm (val) {
      // console.log(this.data.workDateStart)
      const index = this.data.editWorkIndex

      this.formdata.workExperienceList[index].jobStartTime = val.Format('yyyy-MM')
      this.pagestatus.showStartPicker = false

      this.data.workDateEnd = new Date()
    },

    // 工作经验结束时间选择回调
    onEndMonthConfirm (val) {
      console.log(this.data.workDateEnd)
      const index = this.data.editWorkIndex

      this.formdata.workExperienceList[index].jobEndTime = val.Format('yyyy-MM')
      this.pagestatus.showEndPicker = false

      this.data.workDateStart = new Date()
    },

    // 删除
    F_delWorkItem (item, index) {
      this.$dialog.confirm({
        title: '删除确认',
        message: '是否删除该条工作经验？'
      }).then(() => {
        this.formdata.workExperienceList.splice(index, 1)
      }).catch(() => {})
    },

    // 添加工作经验
    addWork () {
      this.formdata.workExperienceList.push({
        showStartPicker: false,
        showEndPicker: false,

        // 企业名称
        enterpriseName: '',

        // 开始结束时间
        jobStartTime: '',
        jobEndTime: '',

        // 岗位名称
        stationName: '',

        // 工作内容
        workContent: '',

        // 能否删除
        deleteEnable: true
      })
    },

    // 提交数据表单
    F_submitData () {
      this.$refs.sform.validate().then(async () => {
        const formdata = this.formdata
        const showformdata = this.showformdata

        const sdata = {
          armyInfo: {
            // 军人ID
            soldierId: this.armyInfo.id,
            // 是否当过班长
            ifMonitor: formdata.ifMonitor,
            // 优势
            advantge: formdata.advantge || '',
            // 联系手机
            contactPhone: formdata.contactPhone,
            // 驾照
            driveLincense: showformdata.driveLincense.join(','),
            // 学历
            mineducation: formdata.mineducation,
            // 服役年限
            soldierYear: formdata.soldierYear,
            // 工作经验时间
            workExperience: formdata.workExperience
          },

          // 工作经历
          workExperienceList: []
        }

        if (this.pagestatus.formtype === 'edit') {
          sdata.armyInfo.id = this.data.editData.armyInfo.id
        }

        // 工作经历
        for (const i in formdata.workExperienceList) {
          const tempData = JSON.parse(JSON.stringify(formdata.workExperienceList[i]))

          if (tempData.jobStartTime === '' || tempData.jobEndTime === '') {
            this.$toast('请填写工作经验时间')
            return
          }

          tempData.jobStartTime = new Date(tempData.jobStartTime).Format('yyyy/MM/dd')
          tempData.jobEndTime = new Date(tempData.jobEndTime).Format('yyyy/MM/dd')
          sdata.workExperienceList.push(tempData)
        }

        // console.log(sdata)

        this.$Common.showLoading(true)
        const data = await this.$Api.army.job.saveResumeAndWorkExperience(sdata)
        this.$Common.showLoading(false)
        console.log(data)

        if (data.code === 2000) {
          this.$router.back()
          this.$toast('保存成功')
          return
        }

        this.$toast('保存失败，错误信息：' + data.message)
      }).catch((e) => {
        this.$toast(e[0].message)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.btn-noradio{
  border-radius: 0;
}
.van-checkbox--horizontal{
  margin-bottom: 8px;
}

.container{
  overflow: hidden;
  background: #FFF;
  h2 {
    position: relative;
    margin: 0;
    padding: 15px 16px 5px;
    font-size: 22px;
    font-weight: bold;
    color: #404956;
    .van-icon {
      position: absolute;
      right: 16px;
    }
  }
  .time-box{
    display: flex;
    .inline{
      width: 300px;
      ::v-deep{
        .van-field__label{
          width: 20px;
        }
      }
    }
  }
}
.btn-box{
  display: flex;
  padding: 20px 16px;
  button{
    display: block;
    width: 100%;
    margin: 0 5px;
  }
}
</style>
