<template>
  <div>
    <Common-PageContainer @scrollLoad="F_scrollLoad" :showToTop="true">
      <template #content>
        <div class="container">
          <!-- <div class="headertip">
            <div class="j-m j-flex">
              <div class="infoicon">
                <span class="fas fa-info-circle"></span>
              </div>

              <div class="flex">
                无论线上或者线下支付，退款时请让商家在应用内发起退款；这样能保证您使用的优惠券能被退回
              </div>
            </div>
          </div> -->

          <div class="j-flex j-flex-center">
            <div class="dropdownsearch-fixed"></div>

            <div class="dropdownsearch">
              <van-sticky>
                <van-dropdown-menu
                  active-color="#1492FF">

                  <!-- 商户类型搜索 -->
                  <van-dropdown-item
                    :title="data.searchLabelShow.serviceType"
                    v-model="searchdata.serviceType"
                    :options="data.serviceType"
                    @change="(value) => { F_changeDropmenuTitle(value, 'serviceType') }" />

                    <!-- 支付状态搜索 -->
                    <!-- <van-dropdown-item
                      :title="data.searchLabelShow.status"
                      v-model="searchdata.status"
                      :options="data.status"
                      @change="(value) => { F_changeDropmenuTitle(value, 'status') }" /> -->

                    <!-- 搜索时间 -->
                    <van-dropdown-item
                      ref="dropdownmenudate"
                      title="时间"
                      @opened="F_searchDate"
                    />
                </van-dropdown-menu>
              </van-sticky>
            </div>

            <div class="flex"></div>

            <div class="searchbtn j-searchbtn">
              <span
                class="fas fa-search"
                @click="$router.push('/army/payrecords/search')"></span>
            </div>
          </div>

          <div class="form-group nomargin-t">
            <PayRecordItem
             v-for="(item,index) in data.list"
             :key="index"
             :service="item" />
          </div>

          <!-- 到底加载结束 -->
          <Common-ListEnd v-if="pagestatus.end" />

          <!-- 无数据 -->
          <van-empty v-if="pagestatus.nodata" description="未搜索到相关订单" />

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
import PayRecordItem from './PayRecordItem.vue'
import DaterangePicker from '@/components/daterangepicker/DaterangePciker.vue'

export default {
  components: {
    PayRecordItem,
    DaterangePicker
  },

  props: {
    paystatus: {
      default: ''
    }
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

        status: '',

        startTime: '',
        endTime: ''
      },

      // 数据存放对象
      data: {
        list: [],

        // 标签显示
        searchLabelShow: {
          serviceType: '商户类型',
          status: '支付状态',
          timerange: '时间'
        },

        // 支付状态
        status: [
          { text: '全部', value: '', defaultname: '支付状态' }
        ],

        // 商户类型
        serviceType: [
          { text: '全部', value: '', defaultname: '商户类型' }
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
    // 监听类型
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
        { path: '/army/payrecords/search', data: { action: 'reload' } }
      ]
    )
  },

  mounted () {
    this.searchdata.userId = this.armyInfo.id
    this.searchdata.userType = this.armyInfo.type

    this.searchdata.status = this.paystatus

    // 支付状态处理
    const payStatus = this.$Config.enumConfig.payorderstatus
    for (const i in payStatus) {
      this.data.status.push({
        text: payStatus[i],
        value: i
      })
    }

    this.F_loadDicCategory()

    this.F_loadData()
  },

  methods: {
    // 加载商户类型字典表
    async F_loadDicCategory () {
      // 机构类型
      const merchantType = await this.$Api.common.category(
        this.$Config.enumConfig.merchantType
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

    // 重置列表
    F_reset () {
      this.data.list = []
      this.searchdata.start = 0

      this.pagestatus.nodata = false
      this.pagestatus.end = false
      this.pagestatus.loading = false

      this.F_loadData()
    },

    // 搜索时间段
    F_searchDate () {
      this.$refs.dropdownmenudate.toggle()
      this.$refs.daterangepicker.F_show()
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

      const data = await this.$Api.army.merchant.getMerchantOrderList(condition)

      this.pagestatus.loading = false

      if (data.code !== 2000) {
        if (this.searchdata.start === 0) {
          this.pagestatus.nodata = true
        }

        this.$toast('数据请求失败')
        return
      }

      if (this.searchdata.start === 0 && !data.result) {
        this.pagestatus.nodata = true
        return
      }

      const list = data.result ? data.result.records : []

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
    },

    // 修改下拉搜索选择标题
    F_changeDropmenuTitle (value, key) {
      // console.log(value)
      let name = ''
      const datalist = this.data[key]

      for (let i = 0; i < datalist.length; i++) {
        const item = datalist[i]

        if (value === item.value) {
          name = item.defaultname || item.text
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
@import '@/assets/css/variables.scss';

.container{
  background: #FFF;
}

.dropdownsearch-fixed{
  width: 10px;
}

.dropdownsearch{
  width: 160px;
}

.searchbtn{
  margin: 0 16px 0 4px;
}

.headertip {
  background: $--color-lightpink;
  color: $--color-red;
  padding: 12px 0;
  line-height: 1.2;

  .infoicon {
    width: 24px;
    margin-right: 0.1rem;
    font-size: 16px;
  }
}
</style>

<style scoped>
.dropdownsearch >>> .van-dropdown-menu .van-dropdown-menu__bar{
  box-shadow: none;
}
</style>
