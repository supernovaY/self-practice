<template>
  <div>
    <div class="j-flex j-flex-center">
      <div class="dropdownsearch-fixed"></div>
      <div class="dropdownsearch flex">
        <van-sticky>
          <van-dropdown-menu
            active-color="#1492FF">
            <van-dropdown-item
              :title="data.searchLabelShow.treatmentType"
              v-model="searchdata.treatmentType"
              :options="data.treatmentType"
              @change="(value) => { F_changeDropmenuTitle(value, 'treatmentType') }" />

            <!-- 地区搜索 -->
            <van-dropdown-item ref="dropdownmenuarea" title="区域" @opened="F_searchLocation" />

            <!-- 热度排序搜索 -->
            <van-dropdown-item
              :title="data.searchLabelShow.orderByType"
              v-model="searchdata.orderByType"
              :options="data.orderByType"
              @change="(value) => { F_changeDropmenuTitle(value, 'orderByType') }" />

            <!-- 距离排序搜索 -->
            <van-dropdown-item
              title="距离"
              v-model="searchdata.distance"
              :options="data.distance"
            />
          </van-dropdown-menu>
        </van-sticky>
      </div>

      <div
        class="searchbtn"
        @click="$router.push('/army/ptreatment/searchservice')">
        <span class="fas fa-search"></span>
      </div>
    </div>

    <div class="form-group nomargin-t">
      <ListItemService
        v-for="(item,index) in data.list"
        :key="index"
        :service="item"
      />
    </div>

    <!-- 到底加载结束 -->
    <Common-ListEnd v-if="pagestatus.end" />

    <!-- 无数据 -->
    <van-empty v-if="pagestatus.nodata" description="暂无服务优待" />

    <!-- 加载动画 -->
    <Common-ListLoading v-show="pagestatus.loading" />

    <CityPicker ref="citypicker" @selected="F_selectCity" />

    <!-- 距离 营业状态 -->
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ListItemService from './ListItemService.vue'
import CityPicker from '@/components/citypicker/CityPicker.vue'

export default {
  components: {
    ListItemService,
    CityPicker
  },

  data () {
    return {
      // 页面状态
      pagestatus: {
        // 列表数据加载中
        loading: false,

        // 到底了
        end: false,

        // 无数据
        nodata: false
      },

      // 搜索对象
      searchdata: {
        start: 0,
        limit: 20,

        // 查询类型 1为服务机构 2为商户类型
        businessType: 1,

        // 类型
        treatmentType: '',

        // 军人ID 和 代持类型
        userId: '',
        userType: '',

        // 距离
        distance: '',

        // 地区码
        treatmentAreaCode: '',

        // 纬度
        longitude: '',

        // 经度
        latitude: '',

        // 排序字段
        column: 'hot',

        orderByType: ''
      },

      // 数据存放对象
      data: {
        list: [],

        // 标签显示
        searchLabelShow: {
          treatmentType: '服务类型',
          area: '区域',
          orderByType: '热度',
          distance: '距离'
        },

        // 距离
        distance: [
          { text: '全部', value: '' },
          { text: '1000米以内', value: 1000 },
          { text: '2000米以内', value: 2000 },
          { text: '3000米以内', value: 3000 },
          { text: '4000米以内', value: 4000 },
          { text: '5000米以内', value: 5000 }
        ],

        // 服务类型列表
        treatmentType: [
          { text: '全部', value: '', defaultname: '服务类型' }
        ],

        // 热度排序
        orderByType: [
          { text: '全部', value: '' },
          { text: '热度倒序', value: 'desc' },
          { text: '热度顺序', value: 'asc' }
        ],

        // 时间排序
        timeOrder: [
          { text: '全部', value: '' },
          { text: '时间倒序', value: 'desc' },
          { text: '时间顺序', value: 'asc' }
        ]
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
    }
  }),

  watch: {
    // 监听定位结束
    'mapLocation.lng' () {
      this.searchdata.latitude = this.mapLocation.lat
      this.searchdata.longitude = this.mapLocation.lng

      if (this.searchdata.start === 0) {
        this.F_loadData()
      }
    },

    // 监听热度排序修改
    'searchdata.orderByType' () {
      this.F_reset()
    },

    // 监听距离修改
    'searchdata.distance' () {
      this.F_reset()
    },

    // 监听类型
    'searchdata.treatmentType' () {
      this.F_reset()
    }
  },

  mounted () {
    this.searchdata.userId = this.armyInfo.id
    this.searchdata.userType = this.armyInfo.type

    this.F_loadDicCategory()
  },

  methods: {
    // 加载字典表数据
    async F_loadDicCategory () {
      // 机构类型
      const serviceType = await this.$Api.common.category(
        this.$Config.enumConfig.serviceType
      )

      if (serviceType.code === 2000) {
        serviceType.result.map((item, index) => {
          item.value && this.data.treatmentType.push({
            text: item.label,
            value: item.value
          })
        })
      }

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
      // console.log(value)
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

    // 完成城市选择
    F_selectCity (citydata) {
      this.searchdata.treatmentAreaCode = citydata[2].area_code || citydata[1].area_code

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

    // 加载数据
    async F_loadData () {
      if (
        this.pagestatus.loading ||
        this.pagestatus.end ||
        this.pagestatus.nodata
      ) {
        return
      }

      this.pagestatus.loading = true

      const searchdata = Object.assign({}, this.searchdata)

      const data = await this.$Api.army.getMerchantServiceList(searchdata)

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

      // setTimeout(() => {
      //   const tempdata = {
      //     id: 1,
      //     img: '/img/img_jsbd_top@3x.329b011a.png',
      //     name: '省退役军人事务厅召开党史学习教育动员部署会',
      //     labels: '就业,财务'.split(','),
      //     createTime: '2021-5-10'
      //   }

      //   for (let i = 0; i < this.searchdata.limit; i++) {
      //     this.data.list.push(tempdata)
      //   }

      //   console.log(this.data.list)

      //   this.pagestatus.loading = false
      // }, 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
.searchbtn{
  margin: 0 16px 0 4px;
  padding: 6px 10px;
  background: rgba(128,141,161,0.10);
  border-radius: 17px;
  font-size: 14px;
}

.dropdownsearch-fixed{
  width: 2px;
}
</style>

<style scoped>
.dropdownsearch >>> .van-dropdown-menu .van-dropdown-menu__bar{
  box-shadow: none;
}
</style>
