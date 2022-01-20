<template>
  <div>
    <div class="j-m orderlist-title">
      服务记录
    </div>

    <div class="j-flex j-flex-center">
      <div class="dropdownsearch-fixed"></div>

      <div class="dropdownsearch">
        <van-dropdown-menu
          active-color="#1492FF"
          :overlay="false"
        >
          <!-- 搜索时间 -->
          <van-dropdown-item
            ref="dropdownmenudate"
            title="时间"
            @opened="F_searchDate"
          />
        </van-dropdown-menu>
      </div>

      <div class="searchbtn flex">
        <van-search
          v-model="data.searchkeyword"
          show-action
          clearable
          placeholder="请输入搜索服务编号"
          @search="F_search">
          <template #action>
            <van-button type="default" size="small" @click="F_search" plain>搜索</van-button>
          </template>
        </van-search>
      </div>
    </div>

    <!-- 数据统计 -->
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
                <div class="title">服务总人次</div>
                <div class="counternumber">{{ data.peoplecount }}人</div>
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
                <div class="title">服务总次数</div>
                <div class="counternumber">{{ data.timecount }}次</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="form-group nomargin-t">
      <ServiceOrderListItem
        v-for="(item,index) in data.list"
        :key="index"
        :orderinfo="item"
      />
    </div>

    <!-- 到底加载结束 -->
    <Common-ListEnd v-if="pagestatus.end" />

    <!-- 无数据 -->
    <van-empty v-if="pagestatus.nodata" description="未查询到相关数据" />

    <!-- 加载动画 -->
    <Common-ListLoading v-show="pagestatus.loading" />

    <!-- 日期时间段搜索 -->
    <DaterangePicker ref="daterangepicker" @selected="F_selectDate" />
  </div>
</template>

<script>
import { mapState } from 'vuex'

import ServiceOrderListItem from './ServiceOrderListItem.vue'
import DaterangePicker from '@/components/daterangepicker/DaterangePciker.vue'

export default {
  components: {
    ServiceOrderListItem,
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

        // 日期选择显示控制
        showdateselector: false
      },

      // 搜索对象
      searchdata: {
        start: 0,
        limit: 20,

        // 商户ID
        id: '',

        // 查询订单号
        code: '',

        // 搜索时间段
        startTime: '',
        endTime: ''
      },

      // 数据存放对象
      data: {
        list: [],

        searchkeyword: '',

        // 数据统计
        peoplecount: 0,
        timecount: 0
      }
    }
  },

  computed: mapState({
    // 商户机构信息存放
    merchantInfo (state) {
      return state.localData.merchantInfo
    }
  }),

  mounted () {
    // 设置搜索商户ID
    this.searchdata.id = this.merchantInfo.id

    this.F_search()
  },

  methods: {
    // 加载统计数据
    async F_loadCountData () {
      const codition = {
        id: this.searchdata.id,
        code: this.searchdata.code
      }

      if (this.searchdata.startTime) {
        codition.startTime = this.searchdata.startTime
        codition.endTime = this.searchdata.endTime
      }

      const data = await this.$Api.service.getCountData(codition)

      if (data.code === 2000) {
        this.data.peoplecount = data.result.serviceUsers
        this.data.timecount = data.result.serviceTimes
        return
      }

      this.$toast('获取统计数据失败')
    },

    // 搜索关键词
    F_search () {
      this.searchdata.code = this.data.searchkeyword

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
      if (this.pagestatus.nodata || this.pagestatus.end || this.pagestatus.loading) {
        return
      }

      this.pagestatus.loading = true

      const condition = Object.assign({}, this.searchdata)

      if (!this.searchdata.startTime) {
        delete condition.startTime
        delete condition.endTime
      }

      const data = await this.$Api.service.getOrderList(condition)

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
.orderlist-title{
  font-size: 20px;
  line-height: 1.6;
}

.van-search{
  padding:  10px 0;
}

.searchbtn{
  margin: 0 16px 0 20px;
}

.dropdownsearch-fixed{
  width: 16px;
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
