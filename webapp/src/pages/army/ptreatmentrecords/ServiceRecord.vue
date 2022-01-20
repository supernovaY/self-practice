<template>
  <div>
    <Common-PageContainer @scrollLoad="F_scrollLoad" :showToTop="true">
      <template #content>
        <div class="container">
          <div class="j-flex j-flex-center">
            <div class="dropdownsearch-fixed"></div>

            <div class="dropdownsearch">
              <van-sticky>
                <van-dropdown-menu
                  active-color="#1492FF">

                  <!-- 服务类型搜索 -->
                  <van-dropdown-item
                    :title="data.searchLabelShow.serviceType"
                    v-model="searchdata.serviceType"
                    :options="data.serviceType"
                    @change="(value) => { F_changeDropmenuTitle(value, 'serviceType') }" />

                    <!-- 搜索时间 -->
                    <van-dropdown-item
                      ref="dropdownmenudate"
                      title="时间"
                      @opened="F_searchDate" />
                </van-dropdown-menu>
              </van-sticky>
            </div>

            <div class="flex"></div>

            <div class="searchbtn">
              <span
                class="fas fa-search"
                @click="$router.push('/army/servicerecords/search')"></span>
            </div>
          </div>

          <div class="form-group nomargin-t">
            <ServiceRecordItem
             v-for="(item,index) in data.list"
             :key="index"
             :service="item" />
          </div>

          <!-- 到底加载结束 -->
          <Common-ListEnd v-if="pagestatus.end" />

          <!-- 无数据 -->
          <van-empty v-if="pagestatus.nodata" description="未搜索到相关服务记录" />

          <!-- 加载动画 -->
          <Common-ListLoading v-show="pagestatus.loading" />
        </div>
        <Common-PageFooter />
      </template>
    </Common-PageContainer>

    <!-- 日期时间段搜索 -->
    <DaterangePicker ref="daterangepicker" @selected="F_selectDate" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ServiceRecordItem from './ServiceRecordItem.vue'
import DaterangePicker from '@/components/daterangepicker/DaterangePciker.vue'

export default {
  components: {
    ServiceRecordItem,
    DaterangePicker
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
        nodata: false,

        showdateselector: false
      },

      // 搜索对象
      searchdata: {
        start: 0,
        limit: 20,

        userType: '',
        userId: '',

        // 类型id
        serviceType: '',

        // 搜素订单号
        keyword: '',

        startTime: '',
        endTime: ''
      },

      // 数据存放对象
      data: {
        list: [],

        // 标签显示
        searchLabelShow: {
          serviceType: '服务类型',
          timerange: '时间'
        },

        // 服务机构类型
        serviceType: []
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
    'searchdata.serviceType' () {
      this.F_reset()
    }
  },

  activated () {
    // 下级搜索页面 keepalive 控制
    // 子页面 keepalive的页面重置处理
    this.$store.commit(
      'sendMultyPageParam',
      [
        { path: '/army/servicerecords/search', data: { action: 'reload' } }
      ]
    )
  },

  mounted () {
    this.searchdata.userId = this.armyInfo.id
    this.searchdata.userType = this.armyInfo.type

    this.F_loadDicCategory()

    this.F_loadData()
  },

  methods: {
    // 加载商户类型字典表
    async F_loadDicCategory () {
      // 机构类型
      const merchantType = await this.$Api.common.category(
        this.$Config.enumConfig.serviceType
      )

      if (merchantType.code === 2000) {
        merchantType.result.map((item, index) => {
          item.value && this.data.serviceType.push({
            text: item.label,
            value: item.value
          })
        })
      }
    },

    // 日期选择完毕回调
    F_selectDate (daterange) {
      // console.log(daterange)
      this.pagestatus.showdateselector = false

      this.searchdata.startTime = daterange.date1.Format('yyyy-MM-dd 00:00:00')
      this.searchdata.endTime = daterange.date2.Format('yyyy-MM-dd 23:59:59')

      this.F_reset()
    },

    // 搜索时间段
    F_searchDate () {
      this.$refs.dropdownmenudate.toggle()
      this.$refs.daterangepicker.F_show()
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
        this.pagestatus.nodata ||
        this.pagestatus.end ||
        this.pagestatus.loading
      ) {
        return
      }

      this.pagestatus.loading = true

      const condition = Object.assign({}, this.searchdata)

      if (!this.searchdata.startTime) {
        delete condition.startTime
        delete condition.endTime
      }

      const data = await this.$Api.army.service.getServiceOrder(condition)

      this.pagestatus.loading = false

      if (data.code !== 2000) {
        if (this.searchdata.start === 0) {
          this.pagestatus.nodata = true
        }

        this.$toast('数据请求失败')
        return
      }

      if (
        this.searchdata.start === 0 &&
        (
          !data.result ||
          !data.result.records ||
          data.result.records.length <= 0
        )
      ) {
        this.pagestatus.nodata = true
        return
      }

      const list = data.result.records

      if (!list || list.length < this.searchdata.limit) {
        this.pagestatus.end = true
      }

      this.searchdata.start += this.searchdata.limit
      list.map((item) => {
        this.data.list.push(item)
      })
    },

    // 修改下拉搜索选择标题
    F_changeDropmenuTitle (value, key) {
      // console.log(value)
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

    // 滚动加载触发
    F_scrollLoad () {
      if (
        this.pagestatus.loading ||
        this.pagestatus.end ||
        this.pagestatus.nodata
      ) {
        return
      }

      this.F_loadData()
    }
  }
}
</script>

<style lang="scss" scoped>
.container{
  background: #FFF;
}

.dropdownsearch-fixed{
  width: 10px;
}

.dropdownsearch{
  width: 155px;
}

.searchbtn{
  margin: 0 16px 0 4px;
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
</style>
