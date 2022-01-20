<template>
  <div>
    <Common-PageContainer @scrollLoad="F_scrollLoad" :showToTop="true">
      <template v-slot:content>
        <div class="container">
          <div class="j-flex j-flex-center">
            <div class="dropdownsearch flex">
              <van-sticky>
                <van-search
                  v-model="searchkey"
                  show-action
                  placeholder="请输入搜索订单号"
                  @search="F_waitRunLoad"
                  @clear="F_waitRunLoad">
                  <template #action>
                    <van-button type="default" size="small" @click="F_waitRunLoad" plain>搜索</van-button>
                  </template>
                </van-search>
              </van-sticky>
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
  </div>
</template>

<script>
import { mapState } from 'vuex'
import PayRecordItem from './PayRecordItem.vue'

export default {
  components: {
    PayRecordItem
  },
  data () {
    return {
      // 关键词搜索绑定
      searchkey: '',

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

        userType: '',
        userId: '',

        // 搜素订单号
        keyword: ''
      },

      // setTimeout任务队列 运行 则取消其他
      timeoutlist: [],

      // 数据存放对象
      data: {
        // 列表数据
        list: []
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

  mounted () {
    this.searchdata.userId = this.armyInfo.id
    this.searchdata.userType = this.armyInfo.type
  },

  methods: {
    // 等待运行搜索委托
    F_waitRunLoad () {
      if (this.pagestatus.loading) {
        this.timeoutlist.push(
          setTimeout(() => {
            this.F_waitRunLoad()
          }, 1000)
        )
        return
      }

      this.timeoutlist.map((item) => {
        clearTimeout(item)
      })

      this.timeoutlist = []

      this.F_reset()

      this.searchdata.keyword = this.searchkey

      if (this.searchdata.keyword) {
        this.F_loadData()
      }
    },

    // 滚动加载
    F_scrollLoad () {
      if (
        this.pagestatus.nodata ||
       this.pagestatus.end ||
       this.pagestatus.loading
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
.container{
  background: #FFF;
}

.label-container{
  display: inline-block;
  margin: 0 4px 4px 0;
}

.keywordlist{
  .title{
    font-size: 14px;
  }
}
</style>
