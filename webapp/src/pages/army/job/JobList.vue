/* eslint-disable vue/valid-v-bind */
<template>
  <div class="container">
    <van-tabs color="#1492FF" v-model="pagestatus.showType" sticky>
      <van-tab title="招聘列表" name="jobList">
        <van-sticky class="condition-box">
          <div class="condition">
            <div class="tools">
              <ul class="type">
                <li v-if="jobIntention.list.length === 0 ">暂未添加求职意向</li>
                <li v-else @click="tabJobIntention(index, item.stationId)" :class="index === jobIntention.active ? 'active' : ''"
                    v-for="(item, index) in jobIntention.list" :key="index">
                  {{item.stationName}}
                </li>
              </ul>
              <ul class="action">
                <li class="edit" @click="navJobIntention"></li>
                <li class="search" @click="navJobSearch"></li>
              </ul>
            </div>
            <ul class="filter">
              <li @click="changeTabFlag(item.value)" v-for="(item, index) in tabData" :key="index" :class="searchJob.tabFlag ===  item.value ? 'active' : ''">{{item.label}}</li>
              <li class="options">
                <job-filter @confirmSearchJob="searchJobList" />
              </li>
            </ul>
          </div>
        </van-sticky>
        <div class="form-group nomargin-t">
          <job-item v-for="(item,index) in data.jobList" :key="index" :detail="item" />
        </div>

        <!-- 加载中 -->
        <Common-ListLoading v-if="pagestatus.loadingJob" />

        <!-- 无数据 -->
        <van-empty v-if="pagestatus.nodataJob" description="暂无数据" />
      </van-tab>

      <van-tab title="招聘会信息" name="fairList">
        <div class="j-flex j-flex-center">
          <div class="dropdownsearch flex">
            <van-sticky>
              <van-dropdown-menu
                active-color="#1492FF">
                <!-- 地区搜索 -->
                <van-dropdown-item ref="dropdownmenuarea" :title="selectedAreaName" @opened="F_searchLocation" />
                <!-- 状态排序搜索 -->
                <van-dropdown-item :title="data.searchLabelShow.jobFairStatus" v-model="searchFair.jobFairStatus" @change="(value) => { F_changeDropmenuTitle(value, 'jobFairStatus') }" :options="data.jobFairStatus" />
                <!-- 招聘形式排序搜索 -->
                <van-dropdown-item :title="data.searchLabelShow.jobFairType" v-model="searchFair.jobFairType" @change="(value) => { F_changeDropmenuTitle(value, 'jobFairType') }" :options="data.jobFairType" />
              </van-dropdown-menu>
            </van-sticky>
          </div>
          <div
            class="searchbtn"
            @click="$router.push('/army/job/jobfairsearch')">
            <span class="fas fa-search"></span>
          </div>
        </div>
        <div class="form-group nomargin-t">
          <job-fair-item
            v-for="(item, index) in data.fairList"
            :key="index"
            :detail="item" />
        </div>

        <!-- 加载中 -->
        <Common-ListLoading v-if="pagestatus.loadingFair" />

        <!-- 无数据 -->
        <van-empty v-if="pagestatus.nodataFair" description="暂无数据" />
      </van-tab>
      <CityPicker ref="citypicker" :cityLevel="1" @selected="F_selectCity" />
    </van-tabs>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import JobItem from './JobItem.vue'
import JobFairItem from './JobFairItem.vue'
import JobFilter from './JobFilter.vue'
import CityPicker from '@/components/citypicker/CityPicker.vue'

export default {
  components: {
    JobItem,
    JobFairItem,
    JobFilter,
    CityPicker
  },
  data () {
    return {
      selectedAreaName: '',
      intentionActive: 0,
      tabData: [
        { value: 0, label: '推荐' },
        { value: 1, label: '附近' },
        { value: 2, label: '最新' },
        { value: 3, label: '战略合作企业岗位' }
      ],
      pagestatus: { // 页面状态
        showType: 'jobList',
        loaded: { // 是否已经加载数据
          job: false,
          fair: false
        },
        loadingJob: false, // 招聘会列表加载动画
        nodataJob: false,
        loadingFair: false, // 招聘会加载动画
        nodataFair: false
      },
      data: { // 数据存放对象
        jobList: [], // 招聘列表
        fairList: [], // 招聘会列表
        typeId: { // 类型列表
          jobList: 1,
          fairList: 2
        },
        searchLabelShow: { // 标签显示
          area: '地区',
          jobFairStatus: '状态',
          jobFairType: '招聘形式'
        },
        jobFairType: [{ text: '全部', value: '' }],
        jobFairStatus: [{ text: '全部', value: '' }]
      },
      searchJob: { // 招聘列表搜索条件
        start: 0,
        limit: 10,
        tabFlag: 0, // 0推荐
        stationType: '', // 意向岗位信息id
        longitude: '',
        latitude: '',
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
      searchFair: { // 招聘会搜索条件
        start: 0,
        limit: 10,
        areaCode: '', // 地区码
        jobFairType: '', // 招聘会类型
        jobFairStatus: '' // 招聘会状态
      },
      jobIntention: {
        active: 0,
        list: []
      }
    }
  },
  computed: {
    ...mapState({
      GET: 'GET', // url参数解析
      armyInfo (state) { // 当前军人用户信息
        return state.localData.armyInfo
      },
      userInfo (state) { // 当前军人用户信息
        return state.localData.Userinfo
      },
      browerEnvStatus: 'browerEnvStatus', // 浏览器环境参数
      // 地图定位信息
      mapLocation (state) {
        return state.localData.mapLocation
      },
      userSelectCity (state) { // 用户选择的当前城市信息
        return state.sessionData.userSelectCity
      }
    })
  },
  async mounted () {
    this.searchFair.areaCode = this.userSelectCity.area_code
    this.selectedAreaName = this.userSelectCity.area_name
    this.searchJob.latitude = this.mapLocation.lat
    this.searchJob.longitude = this.mapLocation.lng
    await this.F_jobIntention() // 先获取stationId
    this.F_loadJobData()
    this.F_loadFairData()
    this.F_loadJobFairStatusOption()
    this.F_loadJobFairTypeOption()
  },
  methods: {
    navJobIntention () {
      this.$router.push('/army/job/intentionlist')
    },
    navJobSearch () {
      this.$router.push('/army/job/jobsearch')
    },
    changeTabFlag (val) {
      this.searchJob.tabFlag = val
      this.F_resetJob()
    },
    tabJobIntention (index, id) {
      this.jobIntention.active = index
      this.searchJob.stationType = id
      this.F_resetJob()
    },
    // 加载招聘列表数据
    async F_loadJobData () {
      if (this.jobIntention.list.length && !this.searchJob.stationType) {
        this.searchJob.stationType = this.jobIntention.list[0].stationId
      }

      this.pagestatus.loadingJob = true

      const searchJob = Object.assign({}, this.searchJob)

      const data = await this.$Api.army.job.getJobStationList(searchJob)

      this.pagestatus.loadingJob = false

      if (data.code !== 2000) {
        this.$toast('数据请求失败')
        return
      }

      const list = data.result.records

      if (this.searchJob.start === 0 && (!list || list.length <= 0)) {
        this.pagestatus.nodataJob = true
        return
      }

      if (!list || list.length < this.searchJob.limit) {
        this.pagestatus.loaded.job = true
      }

      this.searchJob.start += this.searchJob.limit
      list.map((item) => {
        this.data.jobList.push(item)
      })
    },
    searchJobList (params) {
      this.searchJob = Object.assign(this.searchJob, params)
      this.F_resetJob()
    },
    // 重置招聘列表
    F_resetJob () {
      this.data.jobList = []
      this.searchJob.start = 0

      this.pagestatus.nodataJob = false
      this.pagestatus.loaded.job = false
      this.pagestatus.loadingJob = false

      this.F_loadJobData()
    },
    // 加载招聘会列表数据
    async F_loadFairData () {
      this.pagestatus.loadingFair = true

      const searchFair = Object.assign({}, this.searchFair)

      const data = await this.$Api.army.job.getJobFairList(searchFair)

      this.pagestatus.loadingFair = false

      if (data.code !== 2000) {
        this.$toast('数据请求失败')
        return
      }

      const list = data.result.records

      if (this.searchFair.start === 0 && (!list || list.length <= 0)) {
        this.pagestatus.nodataFair = true
        return
      }

      if (!list || list.length < this.searchFair.limit) {
        this.pagestatus.loaded.fair = true
      }

      this.searchFair.start += this.searchFair.limit
      list.map((item) => {
        this.data.fairList.push(item)
      })
    },
    // 重置招聘会列表
    F_resetFair () {
      this.data.fairList = []
      this.searchFair.start = 0

      this.pagestatus.nodataFair = false
      this.pagestatus.loaded.fair = false
      this.pagestatus.loadingFair = false

      this.F_loadFairData()
    },
    // 滚动加载
    F_scrollLoad () {
      if (this.pagestatus.showType === 'jobList') {
        if (
          this.pagestatus.loadingJob ||
          this.pagestatus.loaded.job ||
          this.pagestatus.nodataJob
        ) {
          return
        }
        this.F_loadJobData()
      } else if (this.pagestatus.showType === 'fairList') {
        if (
          this.pagestatus.loadingFair ||
          this.pagestatus.loaded.fair ||
          this.pagestatus.nodataFair
        ) {
          return
        }
        this.F_loadFairData()
      }
    },

    // 搜索地区
    F_searchLocation (citydata) {
      console.log(this.$refs.dropdownmenuarea)

      setTimeout(() => {
        this.$refs.dropdownmenuarea.toggle()
      }, 10)

      this.$refs.citypicker.F_show()
    },
    // 完成城市选择
    F_selectCity (citydata) {
      if (citydata[2] && citydata[2].area_code) {
        this.searchFair.areaCode = citydata[2].area_code
        this.selectedAreaName = citydata[2].area_name
      } else if (citydata[1] && citydata[1].area_code) {
        this.searchFair.areaCode = citydata[1].area_code
        this.selectedAreaName = citydata[1].area_name
      } else if (citydata[0] && citydata[0].area_code) {
        this.searchFair.areaCode = citydata[0].area_code
        this.selectedAreaName = citydata[0].area_name
      }
      this.F_resetFair()
    },
    // 加载意向岗位列表
    F_jobIntention () {
      return this.$Api.army.job.jobIntention(this.armyInfo.id).then(data => {
        if (data.code === 2000 && data.result) {
          this.jobIntention.list = data.result
        }
      })
    },
    // 加载招聘岗位列表
    async getJobList () {
      const data = await this.$Api.army.job.getJobStationList()
      if (data.code === 2000 && data.result) {
        this.jobIntention.list = data.result
      }
    },
    async F_loadJobFairStatusOption () { // 加载招聘会状态数据
      const data = await this.$Api.common.category('JOB_FAIR_STATUS')
      if (data.code === 2000) {
        data.result.map((item, index) => {
          item.value &&
            this.data.jobFairStatus.push({
              text: item.label,
              value: item.value
            })
        })
      }
    },
    async F_loadJobFairTypeOption () { // 加载招聘会类型数据
      const data = await this.$Api.common.category('JOB_FAIR_TYPE')
      if (data.code === 2000) {
        data.result.map((item, index) => {
          item.value &&
            this.data.jobFairType.push({
              text: item.label,
              value: item.value
            })
        })
      }
    },
    // 修改下拉搜索选择标题
    F_changeDropmenuTitle (value, key) {
      let name = ''
      const datalist = this.data[key]

      for (let i = 0; i < datalist.length; i++) {
        const item = datalist[i]

        if (value === item.value) {
          name = item.text
          break
        }
      }

      this.data.searchLabelShow[key] = name
      this.searchFair[key] = value
    }
  },
  watch: {
    'searchFair.jobFairStatus' () {
      this.F_resetFair()
    },
    'searchFair.jobFairType' () {
      this.F_resetFair()
    }
  }
}
</script>

<style lang="scss" scoped>
  .j-flex-center{
    border-top: 1px solid #E7E7E7;
  }
  .van-tab{
    color: #808DA1;
    .van-tab__text{
      font-size: 14px;
    }
    .van-tab--active{
      font-size: 14px;
      color: #404956;
    }
  }
  .more {
    position: absolute;
    right: 16px;
    top: 16px;
    color: #808da1;
    z-index: 1;
  }
  .condition-box{
    ::v-deep .van-sticky--fixed{
      top: 44px;
    }
  }
  .condition{
    background: #0882EB;
    height: 100px;
    font-size: 14px;
    color: rgba(255,255,255,0.80);
    .tools{
      display: flex;
      justify-content: space-between;
      .type{
        font-size: 16px;
        color: rgba(255,255,255,0.80);
        padding: 6px;
        &>li{
          padding: 10px;
          display: inline-block;
          transition: all .1s;
          &.active{
            font-size: 20px;
            color: #fff;
          }
        }
      }
      .action{
        &>li{
          vertical-align: middle;
          padding: 16px;
          display: inline-block;
          &.edit{
            width: 16px;
            height: 16px;
            background: url("../../../assets/img/icon_edit_white@3x.png") center center/16px no-repeat;
          }
          &.search{
            width: 20px;
            height: 20px;
            background: url("../../../assets/img/icon_search_white@3x.png") center center/20px no-repeat;
          }
        }
      }
    }
    .filter{
      position: relative;
      padding: 6px;
      &>li{
        display: inline-block;
        padding: 10px;
        &.active{
          color: #fff;
          font-weight: bold;
        }
      }
      .options{
        position: absolute;
        right: 10px;
      }
    }
  }
  .searchbtn {
    margin: 0 16px 0 30px;
    padding: 6px 20px;
    background: rgba(128, 141, 161, 0.1);
    border-radius: 17px;
    font-size: 14px;
  }
  .dropdownsearch .van-dropdown-menu ::v-deep .van-dropdown-menu__bar {
    box-shadow: none;
  }
</style>
