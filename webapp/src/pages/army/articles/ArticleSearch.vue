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
                  placeholder="请输入政策名称进行搜索"
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
              class="j-fc-gray"
              v-show="data.searchHistory.length <= 0"
            >
              暂无搜索记录
            </div>

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
            <ArticleListItem
              v-for="(item,index) in data.list"
              :key="index"
              :article="item" />
          </div>

          <!-- 到底加载结束 -->
          <Common-ListEnd v-if="pagestatus.end" />

          <!-- 无数据 -->
          <van-empty v-if="pagestatus.nodata" description="暂无消息" />

          <!-- 加载动画 -->
          <Common-ListLoading v-show="pagestatus.loading" />
        </div>

        <Common-PageFooter />
      </template>
    </Common-PageContainer>
  </div>
</template>

<script>
import ArticleListItem from '../articles/ArticleListItem.vue'
import { mapState } from 'vuex'

export default {
  components: {
    ArticleListItem
  },
  data () {
    return {
      // 搜索关键词绑定
      searchkey: '',

      // 当前进入页面的搜索类型
      type: '',

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

        // 1政策类型 2政策解读
        articleType: 1,

        // 类型id
        policyTypeId: '',

        // 搜索关键词
        keyword: '',

        // 排序字段
        column: 'create_time',

        // 排序 desc倒叙 asc正序
        order: 'desc',

        // 老兵ID
        userId: '',

        // 军人类型 1代持 和 0本人
        userType: 0
      },

      // setTimeout任务队列 运行 则取消其他
      timeoutlist: [],

      // 数据存放对象
      data: {
        // 列表数据
        list: [],

        // 搜索历史记录
        searchHistory: [],

        // 文章类型
        articleType: {
          policy: 1,
          policyrealize: 2
        },

        // 历史记录key值
        historyKey: {
          policy: this.$Config.searchHistory.policy,
          policyrealize: this.$Config.searchHistory.policyrealize
        }
      }
    }
  },

  computed: mapState({
    // 老兵ID
    userId () {
      return this.armyInfo.id
    },

    // 当前军人用户信息
    armyInfo (state) {
      return state.localData.armyInfo
    }
  }),

  mounted () {
    this.type = this.$route.params.type

    this.searchdata.userId = this.userId
    this.searchdata.userType = this.armyInfo.type
    this.searchdata.articleType = this.data.articleType[this.type] || 1

    this.F_loadHistoryKeyWord()
  },

  methods: {
    // 保存搜索关键词
    async F_saveHistoryKeyWord (keyword) {
      const data = await this.$Api.common.saveSearchHistory(
        keyword,
        this.data.historyKey[this.type]
      )

      if (data.code === 2000) {
        this.F_loadHistoryKeyWord()
      }
    },

    // 加载关键词数据
    async F_loadHistoryKeyWord () {
      const data = await this.$Api.common.getSearchHistory(
        this.data.historyKey[this.type]
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

      this.searchdata.keyword = this.searchkey

      if (this.searchdata.keyword) {
        // 记录搜索关键词
        this.F_saveHistoryKeyWord(this.searchdata.keyword)

        this.F_loadData()
      }
    },

    // 设置搜索关键词
    F_setSearchKeyWord (keyword) {
      this.searchdata.keyword = keyword
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

      const data = await this.$Api.army.policy.getList(searchdata)

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
