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
                  placeholder="请输入搜索服务机构名称"
                  @search="F_waitRunLoad"
                  @clear="F_waitRunLoad">
                  <template #action>
                    <van-button type="default" size="small" @click="F_waitRunLoad" plain>搜索</van-button>
                  </template>
                </van-search>
              </van-sticky>
            </div>
          </div>

          <div
            v-show="data.list.length <= 0 && !pagestatus.loading"
            class="keywordlist j-m">
            <div class="title">历史搜索</div>
            <Common-PageDevideHeight />

            <div
              v-for="(item,index) in data.searchHistory"
              :key="index"
              class="label-container">
              <van-tag
                type="primary"
                size="large"
                color=" rgba(128,141,161,0.10)"
                text-color="#404956"
                @click="F_setSearchKeyWord(item)"
                >{{ item }}</van-tag
              >
            </div>
          </div>

          <Common-PageDevideHeight />

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
          <van-empty v-if="pagestatus.nodata" description="暂无相关信息" />

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
import ListItemService from './ListItemService.vue'

export default {
  components: {
    ListItemService
  },
  data () {
    return {
      // 搜索关键词
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

        // 查询类型 1为服务机构 2为商户类型
        businessType: 1,

        // 军人ID 和 代持类型
        userId: '',
        userType: '',

        // 地区码
        treatmentAreaCode: '',

        // 纬度
        longitude: '',

        // 经度
        latitude: '',

        // 搜索名称
        name: ''
      },

      // setTimeout任务队列 运行 则取消其他
      timeoutlist: [],

      // 数据存放对象
      data: {
        // 列表数据
        list: [],

        // 搜索历史记录
        searchHistory: [],

        // 搜索关键词记录ID
        historyKey: this.$Config.searchHistory.armysearchservice
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
    }
  },

  mounted () {
    this.searchdata.userId = this.armyInfo.id
    this.searchdata.userType = this.armyInfo.type

    // 如果已经定位 则 直接加载数据
    if (this.mapLocation.lng) {
      this.searchdata.latitude = this.mapLocation.lat
      this.searchdata.longitude = this.mapLocation.lng
    }

    // console.log(this.$route.params.type)
    this.F_loadHistoryKeyWord()
  },

  methods: {
    // 保存搜索关键词
    async F_saveHistoryKeyWord (keyword) {
      const data = await this.$Api.common.saveSearchHistory(
        keyword,
        this.data.historyKey
      )

      if (data.code === 2000) {
        this.F_loadHistoryKeyWord()
      }
    },

    // 加载关键词数据
    async F_loadHistoryKeyWord () {
      const data = await this.$Api.common.getSearchHistory(
        this.data.historyKey
      )

      if (data.code === 2000 && data.result) {
        this.data.searchHistory = data.result
      }
    },

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

      this.searchdata.name = this.searchkey

      if (this.searchdata.name) {
        // 记录搜索关键词
        this.F_saveHistoryKeyWord(this.searchdata.name)

        this.F_loadData()
      }
    },

    // 设置搜索关键词
    F_setSearchKeyWord (keyword) {
      this.searchdata.name = keyword
      this.searchkey = keyword

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
      this.pagestatus.loading = true

      const searchdata = Object.assign({}, this.searchdata)

      if (searchdata.policyTypeId === '') {
        delete searchdata.policyTypeId
      }

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
