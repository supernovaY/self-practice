<template>
  <div>
    <Common-PageContainer @scrollLoad="F_scrollLoad" :showToTop="true">
      <template v-slot:content>
        <div class="container">
          <div class="j-flex j-flex-center">
            <div class="dropdownsearch flex">
              <van-sticky>
                <van-search
                  v-model="searchdata.keyword"
                  show-action
                  placeholder="请输入搜索政策关键词"
                  @search="F_waitRunLoad"
                  @clear="F_waitRunLoad"
                >
                  <template #action>
                    <van-button type="default" size="small" @click="F_waitRunLoad" plain>搜索</van-button>
                  </template>
                </van-search>
                <van-tabs color="#1492FF" v-model="activeType" @change="changeTabs">
                  <van-tab :title="policyName + '政策'"></van-tab>
                  <van-tab title="政策解读"></van-tab>
                  <van-tab disabled></van-tab>
                </van-tabs>
              </van-sticky>
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
          <van-empty v-if="pagestatus.nodata" description="暂无数据" />
          <!-- 加载动画 -->
          <Common-ListLoading v-show="pagestatus.loading" />
        </div>
        <Common-PageFooter />
      </template>
    </Common-PageContainer>
  </div>
</template>

<script>
import ArticleListItem from './ArticleListItem.vue'
import { mapState } from 'vuex'

export default {
  components: {
    ArticleListItem
  },
  data () {
    return {
      activeType: 0,
      policyName: '',
      pagestatus: { // 页面状态
        loading: false, // 列表数据加载中
        end: false, // 到底了
        nodata: false // 无数据
      },
      searchdata: { // 搜索对象
        start: 0,
        limit: 20,
        articleType: 1, // 1政策 2政策解读
        policyTypeId: 0, // 1就业政策，2创业政策
        keyword: '', // 搜索关键词
        column: 'create_time', // 排序字段
        order: 'desc', // 排序 desc倒叙 asc正序
        userId: '', // 老兵ID
        userType: 0 // 军人类型 1代持 和 0本人
      },
      timeoutlist: [], // setTimeout任务队列 运行 则取消其他
      data: { // 数据存放对象
        list: []
      }
    }
  },
  computed: {
    ...mapState({
      userId () { // 老兵ID
        return this.armyInfo.id
      },
      armyInfo (state) { // 当前军人用户信息
        return state.localData.armyInfo
      }
    })
  },
  mounted () {
    this.searchdata.userId = this.userId
    this.searchdata.userType = this.armyInfo.type
    const _policyTypeId = this.$route.params.policyTypeId
    this.searchdata.policyTypeId = parseInt(_policyTypeId)
    if (_policyTypeId === '1') {
      this.policyName = '就业'
    } else if (_policyTypeId === '2') {
      this.policyName = '创业'
    }
    this.F_loadData()
  },
  methods: {
    F_waitRunLoad () { // 等待运行搜索委托
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
      if (this.searchdata.keyword) {
        this.F_loadData()
      }
    },
    F_scrollLoad () { // 滚动加载
      if (
        this.pagestatus.loading ||
        this.pagestatus.end ||
        this.pagestatus.nodata
      ) {
        return
      }
      this.F_loadData()
    },
    F_reset () { // 重置列表
      this.data.list = []
      this.searchdata.start = 0

      this.pagestatus.nodata = false
      this.pagestatus.end = false
      this.pagestatus.loading = false
    },
    async F_loadData () { // 加载消息数据
      this.pagestatus.loading = true
      const searchdata = Object.assign({}, this.searchdata)
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
    },
    changeTabs (index) {
      this.searchdata.articleType = (index + 1)
      this.searchdata.keyword = ''
    }
  },
  watch: {
    'searchdata.articleType' (val) {
      this.activeType = parseInt(val) - 1
      this.F_reset()
      this.searchdata.keyword = ''
      this.F_loadData()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/variables.scss";
.container{
  background: #FFF;
  ::v-deep .van-tab{
    font-size: 18px;
    color: $--color-menugray;
    line-height: 1;
    &.van-tab--active{
      font-size: 22px;
      color: $--color-deepgray;
    }
  }
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
