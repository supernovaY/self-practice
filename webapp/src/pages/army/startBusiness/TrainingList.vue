<template>
  <div>
    <Common-PageContainer @scrollLoad="F_scrollLoad" :showToTop="true">
      <template v-slot:content>
        <div class="container">
          <div class="j-flex j-flex-center">
            <div class="dropdownsearch flex">
              <van-sticky>
                <van-dropdown-menu active-color="#1492FF">
                  <van-dropdown-item ref="dropdownmenuarea" :title="selectedAreaName" @opened="F_searchLocation" />
                  <van-dropdown-item
                    :title="data.searchLabelShow.trainingType"
                    v-model="searchdata.trainingType"
                    :options="data.trainingType"
                    @change="(value) => { F_changeDropmenuTitle(value, 'trainingType') }"
                  />
                  <van-dropdown-item
                    :title="data.searchLabelShow.trainingStatus"
                    v-model="searchdata.trainingStatus"
                    :options="data.trainingStatus"
                    @change="(value) => { F_changeDropmenuTitle(value, 'trainingStatus') }"
                  />
                </van-dropdown-menu>
              </van-sticky>
            </div>
            <div class="searchbtn" @click="F_jumpToSearch">
              <span class="fas fa-search"></span>
            </div>
          </div>
          <div class="form-group nomargin-t">
            <TrainingListItem
              v-for="(item,index) in data.list"
              :key="index"
              :article="item" />
          </div>
          <!-- 到底加载结束 -->
          <Common-ListEnd v-if="pagestatus.end" />
          <!-- 无数据 -->
          <van-empty v-if="pagestatus.nodata" description="暂无数据" />
          <!-- 加载动画 -->
          <Common-ListLoading v-show="pagestatus.loading" />
        </div>
        <Common-PageFooter />
      </template>
    </Common-PageContainer>
    <CityPicker ref="citypicker" :cityLevel="1" @selected="F_selectCity" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import CityPicker from '@/components/citypicker/CityPicker.vue'
import TrainingListItem from './TrainingListItem.vue'

export default {
  components: {
    CityPicker,
    TrainingListItem
  },
  data () {
    return {
      selectedAreaName: '',
      pagestatus: { // 页面状态
        loading: false, // 列表数据加载中
        end: false, // 到底了
        nodata: false // 无数据
      },
      searchdata: { // 搜索对象
        start: 0,
        limit: 20,
        areaCode: '',
        trainingType: '0', // 培训类型
        trainingStatus: '0' // 状态
      },
      data: { // 数据存放对象
        list: [],
        searchLabelShow: { // 标签显示
          trainingType: '培训类型',
          trainingStatus: '状态'
        },
        trainingType: [{ text: '全部', value: '0' }],
        trainingStatus: [{ text: '全部', value: '0' }]
      }
    }
  },
  computed: {
    ...mapState({
      userId () { // 老兵ID
        return this.armyInfo.id
      },
      armyInfo (state) { // 当前军人用户信息
        return state.localData.armyInfo
      },
      Userinfo (state) { // 当前军人用户信息
        return state.localData.Userinfo
      },
      // 用户选择的当前城市信息
      userSelectCity (state) {
        return state.sessionData.userSelectCity
      },
      browerEnvStatus: 'browerEnvStatus' // 浏览器环境参数
    })
  },
  watch: {
    'searchdata.trainingType' () { // 监听类型改变
      this.F_reset()
    },
    'searchdata.trainingStatus' () { // 监听时间类型变化
      this.F_reset()
    }
  },
  activated () { // 子页面keepalive控制
    this.$store.commit('sendMultyPageParam', [
      { path: '/army/startbusiness/trainingsearch', data: { action: 'reload' } }
    ])
  },
  mounted () {
    this.F_loadTypeList()
    this.F_loadStatusList()
    // this.searchdata.userId = this.userId
    // this.searchdata.userType = this.armyInfo.type
    this.searchdata.areaCode = this.userSelectCity.area_code
    this.selectedAreaName = this.userSelectCity.area_name
    this.F_loadData()
  },
  methods: {
    async F_loadTypeList () { // 加载类型列表
      const data = await this.$Api.common.category('TRANING_TYPE')
      if (data.code === 2000) {
        data.result.map((item, index) => {
          item.value &&
            this.data.trainingType.push({
              text: item.label,
              value: item.value
            })
        })
      }
    },
    async F_loadStatusList () { // 加载状态列表
      const data = await this.$Api.common.category('TRANING_STATUS')
      if (data.code === 2000) {
        data.result.map((item, index) => {
          item.value &&
            this.data.trainingStatus.push({
              text: item.label,
              value: item.value
            })
        })
      }
    },
    F_changeDropmenuTitle (value, key) { // 修改下拉搜索选择标题
      let name = ''
      const datalist = this.data[key]
      for (let i = 0; i < datalist.length; i++) {
        const item = datalist[i]
        if (value === item.value) {
          name = item.defaultname ? item.defaultname : item.text
          break
        }
      }
      this.data.searchLabelShow[key] = name
      this.searchdata[key] = value
    },
    F_urlJump (item) { // 消息跳转
    },
    F_jumpUrl (id) {
      this.$router.push('/army/startbusiness/trainingdetail/' + id)
    },
    F_jumpToSearch () { // 跳转搜索页面
      this.$router.push('/army/startbusiness/trainingsearch')
    },
    F_scrollLoad () { // 滚动加载
      if (
        this.pagestatus.loading ||
        this.pagestatus.end ||
        this.pagestatus.nodata
      ) {
        return
      }
      this.F_loadData()
    },
    F_reset () { // 重置列表
      this.data.list = []
      this.searchdata.start = 0
      this.pagestatus.nodata = false
      this.pagestatus.end = false
      this.pagestatus.loading = false
      this.F_loadData()
    },
    async F_loadData () { // 加载消息数据
      this.pagestatus.loading = true
      const searchdata = Object.assign({}, this.searchdata)
      if (searchdata.trainingType === '') {
        delete searchdata.trainingType
      }
      const data = await this.$Api.army.startup.getStartupTrainingList(searchdata)
      this.pagestatus.loading = false
      if (data.code !== 2000) {
        this.$toast('数据请求失败')
        return
      }
      const list = data.result.records
      if (this.searchdata.start === 0 && (!list || list.length <= 0)) {
        this.pagestatus.nodata = true
        return
      }
      if (!list || list.length < this.searchdata.limit) {
        this.pagestatus.end = true
      }
      this.searchdata.start += this.searchdata.limit
      list.map(item => {
        this.data.list.push(item)
      })
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
        this.searchdata.areaCode = citydata[2].area_code
        this.selectedAreaName = citydata[2].area_name
      } else if (citydata[1] && citydata[1].area_code) {
        this.searchdata.areaCode = citydata[1].area_code
        this.selectedAreaName = citydata[1].area_name
      } else if (citydata[0] && citydata[0].area_code) {
        this.searchdata.areaCode = citydata[0].area_code
        this.selectedAreaName = citydata[0].area_name
      }
      this.F_reset()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/variables.scss';
.container {
  background: #fff;
}
.searchbtn {
  margin: 0 16px 0 100px;
  padding: 6px 20px;
  background: rgba(128, 141, 161, 0.1);
  border-radius: 17px;
  font-size: 14px;
}
.dropdownsearch .van-dropdown-menu ::v-deep .van-dropdown-menu__bar {
  box-shadow: none;
}
</style>
