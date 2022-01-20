<template>
  <div>
    <Common-PageContainer @scrollLoad="F_scrollLoad" :showToTop="true">
      <template v-slot:content>
        <div class="container">
          <div class="j-flex j-flex-center">
            <div class="dropdownsearch flex">
              <van-sticky>
                <van-search
                  v-model="searchdata.code"
                  show-action
                  placeholder="请输入订单号"
                  @search="F_waitRunLoad"
                  @clear="F_waitRunLoad">
                  <template #action>
                    <van-button type="default" size="small" @click="F_waitRunLoad" plain>搜索</van-button>
                  </template>
                </van-search>
              </van-sticky>
            </div>
          </div>

          <Common-PageDevideHeight />

          <div class="form-group nomargin-t">
            <MerchantOrderListItem
              v-for="(item,index) in data.list"
              :key="index"
              :orderinfo="item"
            />
          </div>

          <!-- 到底加载结束 -->
          <Common-ListEnd v-if="pagestatus.end" />

          <!-- 无数据 -->
          <van-empty v-if="pagestatus.nodata" description="未搜索到相关信息" />

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
import MerchantOrderListItem from '@/pages/merchant/merchanthome/MerchantOrderListItem.vue'

export default {
  components: {
    MerchantOrderListItem
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

        // 搜索的关键词
        code: '',

        // 商户id
        id: ''
      },

      // setTimeout任务队列 运行 则取消其他
      timeoutlist: [],

      // 数据存放对象
      data: {
        // 列表数据
        list: [],

        // 搜索历史记录
        searchHistory: [],

        historyKey: this.$Config.searchHistory.merchantorder
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

      if (this.searchdata.code) {
        this.F_loadData()
      }
    },

    // 设置搜索关键词
    F_setSearchKeyWord (keyword) {
      this.searchdata.code = keyword

      this.F_reset()

      this.F_loadData()
    },

    // 滚动加载
    F_scrollLoad () {
      if (this.pagestatus.loading || this.pagestatus.end || this.pagestatus.nodata) {
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
      this.pagestatus.loading = true

      const data = await this.$Api.merchant.getOrderList(this.searchdata)

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
