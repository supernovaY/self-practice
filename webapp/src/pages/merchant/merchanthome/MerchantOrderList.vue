<template>
  <div>
    <div class="j-flex j-flex-center">
      <div class="dropdownsearch-fixed"></div>

      <div class="flex dropdownsearch">
        <van-dropdown-menu
          active-color="#1492FF"
          :overlay="false"
        >
          <!-- 支付状态搜索 -->
          <van-dropdown-item
            :title="data.searchLabelShow.payStatus"
            v-model="searchdata.payStatus"
            :options="data.payStatus"
            @change="(value) => { F_changeDropmenuTitle(value, 'payStatus') }"
          />

          <!-- 搜索时间 -->
          <van-dropdown-item
            ref="dropdownmenudate"
            title="时间"
            @opened="F_searchDate"
          />
        </van-dropdown-menu>
      </div>

      <div class="searchbtn j-searchbtn">
        <span
          class="fas fa-search"
          @click="$router.push('/merchant/searchorder')"></span>
      </div>
    </div>

    <div
      v-if="merchantInfo.principal"
      class="j-m data-couter"
    >
      <div class="j-flex j-flex-center">
        <div class="flex">
          <div class="data-couter-item">
            <img src="../../../assets/img/img_skjl1@3x.png" />
            <div class="datashow j-flex j-flex-center">
              <div class="flex">
                <div class="title">收款总额</div>
                <div class="counternumber">{{ data.total }}元</div>
              </div>
            </div>
          </div>
        </div>
        <div class="data-couter-w"></div>
        <div class="flex">
          <div class="data-couter-item">
            <img src="../../../assets/img/img_skjl2@3x.png" />
            <div class="datashow j-flex j-flex-center">
              <div class="flex">
                <div class="title">优惠总金额</div>
                <div class="counternumber">{{ data.discount }}元</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="form-group nomargin-t">
      <MerchantOrderListItem
        v-for="(item,index) in data.list"
        :key="index"
        :orderinfo="item" />
    </div>

    <!-- 到底加载结束 -->
    <Common-ListEnd v-if="pagestatus.end" />

    <!-- 无数据 -->
    <van-empty v-if="pagestatus.nodata" description="暂无订单" />

    <!-- 加载动画 -->
    <Common-ListLoading v-show="pagestatus.loading" />

    <!-- 日期时间段搜索 -->
    <DaterangePicker ref="daterangepicker" @selected="F_selectDate" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import MerchantOrderListItem from './MerchantOrderListItem.vue'
import DaterangePicker from '@/components/daterangepicker/DaterangePciker.vue'

export default {
  components: {
    MerchantOrderListItem,
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

        // 日期选择控制
        showdateselector: false
      },

      // 搜索对象
      searchdata: {
        start: 0,
        limit: 20,

        // 支付状态
        payStatus: '',

        // 商户id
        id: '',

        // 搜索时间
        startTime: '',
        endTime: ''
      },

      // 数据存放对象
      data: {
        list: [],

        // 数据统计
        total: 0,
        discount: 0,

        // 标签显示
        searchLabelShow: {
          payStatus: '支付状态',
          timerange: '时间'
        },

        // 支付状态
        payStatus: [
          {
            text: '全部',
            value: '',
            defaultname: '支付状态'
          }
        ]
      }
    }
  },

  activated () {
    this.F_search()
  },

  computed: mapState({
    // 商户机构信息存放
    merchantInfo (state) {
      return state.localData.merchantInfo
    }
  }),

  watch: {
    // 监听状态修改
    'searchdata.payStatus' () {
      this.F_search()
    }
  },

  mounted () {
    // 设置搜索商户ID
    this.searchdata.id = this.merchantInfo.id

    // 支付状态处理
    const payStatus = this.$Config.enumConfig.payorderstatus

    for (const i in payStatus) {
      this.data.payStatus.push({
        text: payStatus[i],
        value: i
      })
    }

    this.F_search()
  },

  methods: {
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

    // 加载统计数据
    async F_loadCountData () {
      const codition = {
        id: this.searchdata.id
      }

      if (this.searchdata.startTime) {
        codition.startTime = this.searchdata.startTime
        codition.endTime = this.searchdata.endTime
      }

      const data = await this.$Api.merchant.getCountData(codition)

      if (data.code === 2000) {
        this.data.total = data.result.totalAmount
        this.data.discount = data.result.discountTotalAmount
        return
      }

      this.$toast('获取统计数据失败')
    },

    // 搜索关键词
    F_search () {
      // 如果为主账号 则 显示统计数据
      if (this.merchantInfo.principal) {
        this.F_loadCountData()
      }

      this.F_reset()
    },

    // 日期选择完毕回调
    F_selectDate (daterange) {
      // console.log(daterange)
      this.pagestatus.showdateselector = false

      this.searchdata.startTime = daterange.date1.Format('yyyy-MM-dd 00:00:00')
      this.searchdata.endTime = daterange.date2.Format('yyyy-MM-dd 23:59:59')

      this.F_search()
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

      const data = await this.$Api.merchant.getOrderList(condition)

      this.pagestatus.loading = false

      if (data.code !== 2000) {
        if (this.searchdata.start === 0) {
          this.pagestatus.nodata = true
        }

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
  margin: 0 16px 0 35%;
}

.data-couter{
  .data-couter-item{
    position: relative;

    img{
      width: 100%;
      display: block;
    }

    .datashow{
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      color: #FFF;
      text-align: center;

      .title{
        margin-bottom: 8px;
      }

      .counternumber{
        font-size: 18px;
      }
    }
  }

  .data-couter-w{
    width: 10px;
  }
}
</style>

<style scoped>
.dropdownsearch >>> .van-dropdown-menu .van-dropdown-menu__bar{
  box-shadow: none;
}
</style>
