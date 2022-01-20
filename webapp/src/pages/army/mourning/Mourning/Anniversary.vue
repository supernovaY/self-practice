<template>
  <div>
    <div class="j-flex j-flex-center dropdownsearch-fixed">
      <div class="dropdownsearch flex">
        <van-sticky>
          <van-dropdown-menu
            active-color="#1492FF"
            :overlay="false">

            <!-- 地区搜索 -->
            <van-dropdown-item
              ref="dropdownmenuarea"
              :title="data.labelShow.areaCode"
              @opened="F_searchLocation"
            />

            <!-- 牺牲时间搜索 -->
            <van-dropdown-item
              :title="data.labelShow.level"
              v-model="searchdata.remembranceLevel"
              :options="data.level"
              @change="(value) => { F_changeDropmenuTitle(value, 'level') }" />
          </van-dropdown-menu>
        </van-sticky>
      </div>

      <div class="searchbtn" @click="F_jumpToSearch">
        <span class="fas fa-search"></span>
      </div>
    </div>

    <div class="form-group">
      <AnniversaryListItem
        v-for="(item,index) in data.list"
        :key="index"
        :item="item">
      </AnniversaryListItem>
    </div>

    <!-- 到底加载结束 -->
    <Common-ListEnd v-if="pagestatus.end" />

    <!-- 无数据 -->
    <van-empty v-if="pagestatus.nodata" description="暂无相关信息" />

    <!-- 加载动画 -->
    <Common-ListLoading v-show="pagestatus.loading" />

    <CityPicker ref="citypicker" @selected="F_selectCity" :cityLevel="0" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import CityPicker from '@/components/citypicker/CityPicker.vue'
import AnniversaryListItem from './AnniversaryListItem.vue'

export default {
  components: {
    CityPicker,
    AnniversaryListItem
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

        // 搜索级别
        remembranceLevel: '',

        // 搜素名称
        name: ''
      },

      // 数据存放对象
      data: {
        list: [],

        // 设施级别
        level: [],

        // 标签显示
        labelShow: {
          areaCode: '区域',
          level: '级别'
        },
        defaultLabelShow: {
          areaCode: '区域',
          level: '级别'
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
    // 监听搜索级别
    'searchdata.remembranceLevel' () {
      this.F_reset()
      this.F_loadData()
    }
  },

  mounted () {
    this.F_loadData()
    this.F_loadDicCategory()
  },

  methods: {
    // 跳转搜索
    F_jumpToSearch () {
      this.$Common.keepAliveMark()
      this.$router.push('/army/mourning/anniversary/search')
    },

    // 加载字典表数据
    async F_loadDicCategory () {
      const levelsData = await this.$Api.common.category('MOURNING_ANNIVERSARY')

      if (levelsData.code === 2000) {
        levelsData.result.map((item, index) => {
          item.text = item.label
        })

        levelsData.result[0].text = '全部'
        this.data.level = levelsData.result
      }
    },

    // 搜索地区
    F_searchLocation (citydata) {
      // console.log(this.$refs.dropdownmenuarea)
      setTimeout(() => {
        this.$refs.dropdownmenuarea.toggle()
      }, 10)

      this.$refs.citypicker.F_show()
    },

    // 修改下拉搜索选择标题
    F_changeDropmenuTitle (value, key) {
      console.log(value, key)
      let name = ''
      const datalist = this.data[key]

      for (let i = 0; i < datalist.length; i++) {
        const item = datalist[i]

        if (value === item.value) {
          name = item.value === '' ? this.data.defaultLabelShow[key] : item.text
          break
        }
      }

      this.data.labelShow[key] = name
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
      this.F_loadData()
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

      const data = await this.$Api.mourn.listRemembrances(searchdata)

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
      //     name: '王杰烈士陵园',
      //     level: '国家级重点纪念设施',
      //     address: '祥符街道祥园路37号北软中天园西南门',
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
  margin: 0 0 0 90px;
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

.dropdownsearch-fixed >>> .van-popup--top{
  width: auto;
  left: 16px;
  right: 16px;
}
</style>
