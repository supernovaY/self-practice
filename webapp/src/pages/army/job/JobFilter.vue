<template>
  <van-dropdown-menu>
    <van-dropdown-item title="筛选" ref="item">
      <van-field
        class="arrow"
        readonly
        clickable
        name="picker"
        :value="salaryLabel"
        label="薪资区间："
        placeholder="点击选择薪资区间"
        @click="showSalaryPicker"
      />
      <PickerSalary @confirmSalary="updateSalary" ref="pickersalary" />
      <van-field name="checkboxEducation" label="学历要求：">
        <template #input>
          <van-checkbox-group v-model="form.mineducation" direction="horizontal">
            <van-checkbox v-for="(item, index) in data.mineducation" :key="index" :name="item.value">{{ item.label }}</van-checkbox>
          </van-checkbox-group>
        </template>
      </van-field>
      <van-field name="checkboxService" label="服役年限：">
        <template #input>
          <van-checkbox-group v-model="form.soldierYear" direction="horizontal">
            <van-checkbox v-for="(item, index) in data.serviceYear" :key="index" :name="item.value">{{ item.label }}</van-checkbox>
          </van-checkbox-group>
        </template>
      </van-field>
      <van-field name="radioMonitor" label="当过班长：">
        <template #input>
          <van-radio-group v-model="form.ifMonitor" direction="horizontal">
            <van-radio name="1">是</van-radio>
            <van-radio name="0">否</van-radio>
          </van-radio-group>
        </template>
      </van-field>
      <van-field name="checkboxAge" label="年龄要求：">
        <template #input>
          <van-checkbox-group v-model="form.age" direction="horizontal">
            <van-checkbox v-for="(item, index) in data.age" :key="index" :name="item.value">{{ item.label }}</van-checkbox>
          </van-checkbox-group>
        </template>
      </van-field>
      <van-field name="checkboxWork" label="工作经验：">
        <template #input>
          <van-checkbox-group v-model="form.workExperience" direction="horizontal">
            <van-checkbox v-for="(item, index) in data.workExperience" :key="index" :name="item.value">{{ item.label }}</van-checkbox>
          </van-checkbox-group>
        </template>
      </van-field>
      <van-field name="checkboxLicence" label="驾驶证：">
        <template #input>
          <van-checkbox-group v-model="form.driveLincense" direction="horizontal">
            <van-checkbox @click="F_selectDriverCert(item)" v-for="(item, index) in data.driveLincense" :key="index" :name="item.value">{{ item.label }}</van-checkbox>
          </van-checkbox-group>
        </template>
      </van-field>
      <van-field readonly :value="selectedAreaName" @click="F_searchLocation" clearable type="text" label="工作所在地：" class="arrow" placeholder="请选择"/>
      <city-picker ref="citypicker" @selected="F_selectCity" />
      <div class="btn-box">
        <van-button type="info" plain @click="onReset">重置</van-button>
        <van-button type="info" @click="onSearchJob">确定</van-button>
      </div>
    </van-dropdown-item>
  </van-dropdown-menu>
</template>

<script>
import PickerSalary from '@/components/pickersalary/PickerSalary.vue'
import CityPicker from '@/components/citypicker/CityPicker.vue'
export default {
  components: {
    PickerSalary,
    CityPicker
  },
  props: {
  },
  data () {
    return {
      salaryLabel: '',
      selectedAreaName: '',
      initForm: {
        salaryLowerLimit: '',
        salaryTopLimit: '',
        mineducation: [],
        soldierYear: [],
        ifMonitor: '',
        age: [],
        workExperience: [],
        driveLincense: [],
        workAreaCode: ''
      },
      form: {},
      showPicker: false,
      data: {
        mineducation: [],
        serviceYear: [],
        age: [],
        workExperience: [],
        driveLincense: []
      }
    }
  },
  mounted () {
    this.form = JSON.parse(JSON.stringify(this.initForm))
    this.F_loadDicData()
  },
  methods: {
    showSalaryPicker () {
      this.$refs.pickersalary.F_show()
    },
    onSalaryConfirm (val) {
      this.form.salary = val[0].label + ' - ' + val[1].label
      this.showPicker = false
    },
    onSalaryChange (picker, values) {
      const _options = JSON.parse(JSON.stringify(this.salaryOptions))
      let _index = 0
      _options.forEach((item, index) => {
        if (item.value === values[0].value) {
          _index = index
        }
      })
      _options.splice(0, _index + 1)
      picker.setColumnValues(1, _options)
    },
    onSearchJob () {
      this.$refs.item.toggle()
      this.$emit('confirmSearchJob', this.form)
    },
    onReset () {
      this.form = JSON.parse(JSON.stringify(this.initForm))
      this.salaryLabel = ''
      this.selectedAreaName = ''
    },
    F_searchLocation () {
      this.$refs.citypicker.F_show()
    },
    F_selectCity (citydata) {
      if (citydata[2] && citydata[2].area_code) {
        this.form.workAreaCode = citydata[2].area_code
        this.selectedAreaName = citydata[2].area_name
      } else if (citydata[1] && citydata[1].area_code) {
        this.form.workAreaCode = citydata[1].area_code
        this.selectedAreaName = citydata[1].area_name
      } else if (citydata[0] && citydata[0].area_code) {
        this.form.workAreaCode = citydata[0].area_code
        this.selectedAreaName = citydata[0].area_name
      }
    },
    // 加载字典表数据
    async F_loadDicData () {
      // 加载学历列表数据
      const educationData = await this.$Api.common.categoryNoHead('JOB_EDUCATION')
      if (educationData.code === 2000) {
        educationData.result.reverse()
        this.data.mineducation = educationData.result
      }

      // 加载服役年限
      const serviceYearData = await this.$Api.common.categoryNoHead('JOB_SOLDIER_YEAR')
      if (serviceYearData.code === 2000) {
        this.data.serviceYear = serviceYearData.result
      }

      // 加载年龄区间
      const ageData = await this.$Api.common.categoryNoHead('AGE_STATISTIC')
      if (ageData.code === 2000) {
        this.data.age = ageData.result
      }

      // 加载工作经验
      const workExperienceData = await this.$Api.common.categoryNoHead('JOB_EXPERIENCE')
      if (workExperienceData.code === 2000) {
        this.data.workExperience = workExperienceData.result
      }

      // 加载驾照数据
      const driveLincenseData = await this.$Api.common.categoryNoHead('JOB_DRIVER_CERT')
      if (driveLincenseData.code === 2000) {
        this.data.driveLincense = driveLincenseData.result
      }
    },
    updateSalary (params) {
      this.form.salaryLowerLimit = params.min
      this.form.salaryTopLimit = params.max
      this.salaryLabel = this.$Common.showSalaryLabel(params.min, params.max)
    },
    F_selectDriverCert (item) {
      if (item.value === '0') { // 选择了无
        this.form.driveLincense = ['0']
      } else { // 选择了 其他
        this.form.driveLincense.map((item, index) => {
          if (item === '0' || item === 0) {
            this.form.driveLincense.splice(index, 1)
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/variables.scss";
.van-dropdown-menu{
  ::v-deep {
    .van-dropdown-menu__bar{
      height: auto;
      background: none;
      z-index: 9;
      .van-dropdown-menu__title{
        color: rgba(255, 255, 255, 0.8);
        font-size: 14px;
        line-height: 1;
        padding-bottom: 5px;
        &:after{
          margin: 0;
          border: none;
          margin-top: -3px;
          transform: rotate(0);
          width: 0;
          height: 0;
          margin-left: 5px;
          border-bottom: 6px solid #fff;
          border-left: 6px solid transparent;
        }
        &.van-dropdown-menu__title--active{
          color: #fff;
        }
      }
    }
    .van-checkbox__icon, .van-radio__icon{
      display: none;
    }
    .van-checkbox, .van-radio{
      font-size: 12px;
      background: #f2f2f2;
      padding: 2px 8px;
      border-radius: 12px;
      margin: 0px 10px 8px 0;
      &[aria-checked="true"]{
        background: $--color-primary;
        .van-checkbox__label, .van-radio__label{
          color: #fff;
        }
      }
      .van-checkbox__label, .van-radio__label{
        margin: 0;
      }
    }
    .van-field__label{
      width: 85px;
    }
  }
}
.btn-box{
  display: flex;
  padding: 8px;
  button{
    width: 100%;
    margin: 8px;
  }
}
</style>
