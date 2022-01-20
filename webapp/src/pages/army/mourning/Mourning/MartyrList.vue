<template>
  <div>
    <div class="j-flex j-flex-center">
      <div class="dropdownsearch flex">
        <van-sticky>
          <van-dropdown-menu
            active-color="#1492FF">

            <!-- 地区搜索 -->
            <van-dropdown-item
              ref="dropdownmenuarea"
              :title="data.labelShow.areaCode"
              @opened="F_searchLocation"
            />

            <!-- 牺牲时间搜索 -->
            <van-dropdown-item
              ref="dropdownyearrange"
              :title="data.labelShow.yearRange"
              @opened="F_showyearPicker"
            />
          </van-dropdown-menu>
        </van-sticky>
      </div>

      <div class="searchbtn" @click="F_jumpToSearch">
        <span class="fas fa-search"></span>
      </div>
    </div>

    <div class="j-flex listcontent">
      <MartyrListItem
        v-for="(item,index) in data.list"
        :key="index"
        :item="item">
      </MartyrListItem>
    </div>

    <!-- 到底加载结束 -->
    <Common-ListEnd v-if="pagestatus.end" />

    <!-- 无数据 -->
    <van-empty v-if="pagestatus.nodata" description="暂无相关信息" />

    <!-- 加载动画 -->
    <Common-ListLoading v-show="pagestatus.loading" />

    <CityPicker ref="citypicker" @selected="F_selectCity" :cityLevel="0" />
    <YearRangePicker ref="yearrangepicker" @selected="F_yearRangeselect"></YearRangePicker>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import CityPicker from '@/components/citypicker/CityPicker.vue'
import MartyrListItem from './MartyrListItem.vue'
import YearRangePicker from '@/components/daterangepicker/YearRangePicker.vue'

export default {
  components: {
    CityPicker,
    MartyrListItem,
    YearRangePicker
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

        // 地区码
        areaCode: '',

        // 年份搜索范围
        startYear: '',
        endYear: ''
      },

      // 数据存放对象
      data: {
        list: [],

        // 标签显示
        labelShow: {
          areaCode: '籍贯',
          yearRange: '牺牲时间'
        },
        defaultLabelShow: {
          areaCode: '籍贯',
          yearRange: '牺牲时间'
        }
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
    // 监听热度排序修改
    'searchdata.yearRange' () {
      this.F_reset()
    }
  },

  mounted () {
    this.F_loadData()

    this.F_loadDicCategory()
  },

  methods: {
    // 加载字典表数据
    async F_loadDicCategory () {

    },

    // 跳转搜索
    F_jumpToSearch () {
      this.$Common.keepAliveMark()
      this.$router.push('/army/mourning/martyr/search')
    },

    // 搜索地区
    F_searchLocation (citydata) {
      // console.log(this.$refs.dropdownmenuarea)
      setTimeout(() => {
        this.$refs.dropdownmenuarea.toggle()
      }, 10)

      this.$refs.citypicker.F_show()
    },

    // 选年份时间
    F_showyearPicker () {
      setTimeout(() => {
        this.$refs.dropdownyearrange.toggle()
      }, 10)

      this.$refs.yearrangepicker.F_show()
    },

    // 时间选择
    F_yearRangeselect (data) {
      console.log(data)

      this.searchdata.startYear = data[0]
      this.searchdata.endYear = data[1]

      this.data.labelShow.yearRange = [
        data[0] + '年',
        data[1] + '年'
      ].join('-')

      this.F_reset()
    },

    // 修改下拉搜索选择标题
    F_changeDropmenuTitle (value, key) {
      console.log(value)
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
      console.log(citydata)
      let CityData = false

      citydata.map((item, index) => {
        if (item.area_code) {
          CityData = item
        }
      })

      this.searchdata.areaCode = CityData.area_code
      this.data.labelShow.areaCode = CityData.area_name

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

    // 加载消息数据
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

      const data = await this.$Api.mourn.listMartyrs(searchdata)

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

      // this.pagestatus.loading = true

      // setTimeout(() => {
      //   const tempdata = {
      //     id: 1,
      //     img: '/img/img_jsbd_top@3x.329b011a.png',
      //     name: '江姐',
      //     type: '烈士',
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
@import '@/assets/css/variables.scss';

.listcontent{
  flex-wrap: wrap;
}

.searchbtn{
  margin: 0 0 0 120px;
  padding: 6px 10px;
  background: rgba(128,141,161,0.10);
  border-radius: 17px;
  font-size: 14px;
}
</style>

<style scoped>
.dropdownsearch >>> .van-dropdown-menu .van-dropdown-menu__bar{
  box-shadow: none;
}

.dropdownsearch >>> .van-dropdown-menu__title{
  padding: 0 6px;
}
</style>
