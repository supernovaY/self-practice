<template>
  <div>
    <div class="j-flex j-flex-center">
      <div class="dropdownsearch-fixed"></div>
      <div class="dropdownsearch flex">
        <van-sticky>
          <van-dropdown-menu
            active-color="#1492FF">
            <!-- 地区搜索 -->
            <van-dropdown-item ref="dropdownmenuarea" :title="selectedAreaName" @opened="F_searchLocation" />
            <!-- 等级排序搜索 -->
            <van-dropdown-item
              :title="data.searchLabelShow.armyParkLevel"
              @change="(value) => { F_changeDropmenuTitle(value, 'armyParkLevel') }"
              v-model="searchdata.armyParkLevel"
              :options="data.armyParkLevel"
            />
            <!-- 距离排序搜索 -->
            <van-dropdown-item
              :title="data.searchLabelShow.distance"
              @change="(value) => { F_changeDropmenuTitle(value, 'distance') }"
              v-model="searchdata.distance"
              :options="data.distance"
            />
          </van-dropdown-menu>
        </van-sticky>
      </div>
      <div
        class="searchbtn"
        @click="$router.push('/army/startbusiness/parksearch')">
        <span class="fas fa-search"></span>
      </div>
    </div>

    <div class="form-group nomargin-t">
      <park-list-item
        v-for="(item,index) in data.list"
        :key="index"
        :detail="item"
      />
    </div>
    <!-- 到底加载结束 -->
    <Common-ListEnd v-if="pagestatus.end" />
    <!-- 无数据 -->
    <van-empty v-if="pagestatus.nodata" description="暂无军创园数据" />
    <!-- 加载动画 -->
    <Common-ListLoading v-show="pagestatus.loading" />
    <CityPicker ref="citypicker" :cityLevel="1" @selected="F_selectCity" />
    <!-- 距离 营业状态 -->
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ParkListItem from './ParkListItem.vue'
import CityPicker from '@/components/citypicker/CityPicker.vue'

export default {
  components: {
    ParkListItem,
    CityPicker
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
        distance: '0', // 距离
        areaCode: '', // 地区码
        armyParkName: '', // 军创园名称
        armyParkLevel: '0', // 军创园等级
        longitude: '', // 经度
        latitude: '' // 纬度
      },
      data: {
        list: [],
        searchLabelShow: { // 标签显示
          area: '地区',
          armyParkLevel: '等级',
          distance: '距离'
        },
        distance: [{ text: '全部', value: '0' }], // 距离
        armyParkLevel: [{ text: '全部', value: '0' }] // 等级
      }
    }
  },

  computed: mapState({
    // 当前军人用户信息
    armyInfo (state) {
      return state.localData.armyInfo
    },
    // 当前用户信息
    Userinfo (state) {
      return state.localData.Userinfo
    },
    // 浏览器环境参数
    browerEnvStatus: 'browerEnvStatus',
    // 地图定位信息
    mapLocation (state) {
      return state.localData.mapLocation
    },
    // 用户选择的当前城市信息
    userSelectCity (state) {
      return state.sessionData.userSelectCity
    }
  }),

  watch: {
    'mapLocation.lng' () {
      this.searchdata.latitude = this.mapLocation.lat
      this.searchdata.longitude = this.mapLocation.lng

      if (this.searchdata.start === 0) {
        this.F_loadData()
      }
    },
    'searchdata.armyParkLevel' () { // 监听等级改变
      this.F_reset()
    },
    'searchdata.distance' () { // 监听搜索距离改变
      this.F_reset()
    }
  },

  mounted () {
    this.F_loadLevelList()
    this.F_loadDistanceList()
    // this.searchdata.userId = this.armyInfo.id
    // this.searchdata.userType = this.armyInfo.type
    this.searchdata.areaCode = this.userSelectCity.area_code
    this.selectedAreaName = this.userSelectCity.area_name

    this.F_loadDicCategory()
  },

  methods: {
    async F_loadLevelList () { // 加载等级列表
      const data = await this.$Api.common.category('AREA_LEVEL')
      if (data.code === 2000) {
        data.result.map((item, index) => {
          item.value &&
            this.data.armyParkLevel.push({
              text: item.label,
              value: item.value
            })
        })
      }
    },
    async F_loadDistanceList () { // 加载距离列表
      const data = await this.$Api.common.category('DISTANCE')
      if (data.code === 2000) {
        data.result.map((item, index) => {
          item.value &&
            this.data.distance.push({
              text: item.label,
              value: item.value
            })
        })
      }
    },
    // 加载字典表数据
    async F_loadDicCategory () {
      // 如果已经定位 则 直接加载数据
      if (this.mapLocation.lng) {
        this.searchdata.latitude = this.mapLocation.lat
        this.searchdata.longitude = this.mapLocation.lng

        this.F_loadData()
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
      this.searchdata[key] = value
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
    },

    // 滚动加载
    F_scrollLoad () {
      if (
        this.pagestatus.loading ||
        this.pagestatus.end ||
        this.pagestatus.nodata
      ) {
        return
      }

      this.F_loadData()
    },

    // 重置列表
    F_reset () {
      this.data.list = []
      this.searchdata.start = 0

      this.pagestatus.nodata = false
      this.pagestatus.end = false
      this.pagestatus.loading = false

      this.F_loadData()
    },

    // 加载军创园列表数据
    async F_loadData () {
      this.pagestatus.loading = true

      const searchdata = Object.assign({}, this.searchdata)

      const data = await this.$Api.army.startup.getArmyParkList(searchdata)

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
      list.map((item) => {
        this.data.list.push(item)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.searchbtn{
  margin: 0 16px 0 80px;
  padding: 6px 20px;
  background: rgba(128,141,161,0.10);
  border-radius: 17px;
  font-size: 14px;
}

.dropdownsearch-fixed{
  width: 2px;
}
</style>

<style lang="scss" scoped>
.dropdownsearch .van-dropdown-menu ::v-deep .van-dropdown-menu__bar{
  box-shadow: none;
  justify-content: flex-start;
  .van-dropdown-menu__item{
    width: 60px;
  }
}
.notice{
  position: relative;
  background: #FFFBE8;
  padding: 10px 20px 10px 30px;
  font-size: 14px;
  color: #ED6A0C;
  line-height: 1.5;
  margin: 0 16px;
  &:before{
    position: absolute;
    left: 10px;
    top: 8px;
    content: "\F0E0";
    font-size: 16px;
    font-family: "vant-icon";
    color: #ED6A0C;
    display: inline-block;
  }
}
</style>
