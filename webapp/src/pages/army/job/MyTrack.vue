<template>
  <div>
    <Common-PageContainer @scrollLoad="F_scrollLoad" :showToTop="true">
      <template v-slot:content>
        <div class="container">
          <div class="j-flex j-flex-center">
            <div class="dropdownsearch flex">
              <van-sticky>
                <van-tabs color="#1492FF" v-model="activeType" @click="changeTab">
                  <van-tab title="申请记录"></van-tab>
                  <van-tab title="岗位收藏"></van-tab>
                  <van-tab title="浏览记录"></van-tab>
                </van-tabs>
                <van-search
                  v-model="searchdata.name"
                  show-action
                  placeholder="请输入关键词搜索"
                  @search="F_waitRunLoad"
                  @clear="F_waitRunLoad"
                >
                  <template #action>
                    <van-button type="default" size="small" @click="F_waitRunLoad" plain>搜索</van-button>
                  </template>
                </van-search>
              </van-sticky>
            </div>
          </div>
          <div class="form-group nomargin-t">
            <job-item v-for="(item,index) in data.list" :key="index" :detail="item" :type="searchdata.type" />
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
import JobItem from './JobItem.vue'
import { mapState } from 'vuex'

export default {
  components: {
    JobItem
  },
  data () {
    return {
      activeType: 0,
      pagestatus: { // 页面状态
        loading: false, // 列表数据加载中
        end: false, // 到底了
        nodata: false // 无数据
      },
      searchdata: { // 搜索对象
        start: 0,
        limit: 10,
        name: '', // 搜索关键词
        type: 1 // 1：申请记录 2：岗位搜藏 3：浏览记录
      },
      timeoutlist: [], // setTimeout任务队列 运行 则取消其他
      data: { // 数据存放对象
        list: [], // 列表数据
        searchHistory: [] // 搜索历史记录
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
      if (this.searchdata.name) {
        this.F_reset()
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
      this.F_loadData()
    },
    async F_loadData () { // 加载消息数据
      this.pagestatus.loading = true
      const searchdata = Object.assign({}, this.searchdata)
      const data = await this.$Api.army.job.getFootPrints(searchdata)
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
    changeTab (val) {
      this.searchdata.type = val + 1
      this.F_reset()
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
      font-weight: bold;
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
