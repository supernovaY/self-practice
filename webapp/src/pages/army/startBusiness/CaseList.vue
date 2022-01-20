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
                  placeholder="请输入关键词搜索"
                  @search="F_waitRunLoad"
                  @clear="F_waitRunLoad"
                />
              </van-sticky>
            </div>
          </div>
          <Common-PageDevideHeight />
          <div class="form-group nomargin-t">
            <ul class="list">
              <li @click="navDetail('1')">
                <div class="video"></div>
                <div class="text">
                  <h3>我该如何挑选适合我的工作?</h3>
                  <div class="info">
                    <span class="time">2021-03-24 11:00</span>
                  </div>
                </div>
              </li>
              <li>
                <div class="video"></div>
                <div class="text">
                  <h3>我该如何挑选适合我的工作呢，怎么样才能够避雷?</h3>
                  <div class="info">
                    <span class="time">2021-03-24 11:00</span>
                  </div>
                </div>
              </li>
            </ul>
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
import { mapState } from 'vuex'

export default {
  components: {
  },
  data () {
    return {
      activeType: 1,
      type: '', // 当前进入页面的搜索类型
      pagestatus: { // 页面状态
        loading: false, // 列表数据加载中
        end: false, // 到底了
        nodata: false // 无数据
      },
      searchdata: { // 搜索对象
        start: 0,
        limit: 20,
        articleType: 1, // 1政策类型 2政策解读
        policyTypeId: '', // 类型id
        keyword: '', // 搜索关键词
        column: 'create_time', // 排序字段
        order: 'desc', // 排序 desc倒叙 asc正序
        userId: '', // 老兵ID
        userType: 0 // 军人类型 1代持 和 0本人
      },
      timeoutlist: [], // setTimeout任务队列 运行 则取消其他
      data: { // 数据存放对象
        list: [], // 列表数据
        searchHistory: [], // 搜索历史记录
        articleType: {
          policy: 1,
          policyrealize: 2
        }
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
    this.type = this.$route.params.type
    this.searchdata.userId = this.userId
    this.searchdata.userType = this.armyInfo.type
    this.searchdata.articleType = this.data.articleType[this.type] || 1
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
    },
    navDetail (id) {
      this.$router.push(`/army/startbusiness/casedetail/${id}`)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/variables.scss";
.container{
  background: #FFF;
  .header{
    position: relative;
    h2{
      margin: 0;
      padding: 16px;
      font-size: 22px;
    }
    .link{
      position: absolute;
      top: 20px;
      right: 16px;
      color: $--color-primary;
      text-decoration: underline;
      .van-icon{
        vertical-align: middle;
      }
    }
  }
  ::v-deep .van-tab{
    font-size: 18px;
    color: #808DA1;
    line-height: 1;
    &.van-tab--active{
      font-size: 22px;
      color: #404956;
    }
  }
}
.list{
  &>li{
    position: relative;
    padding: 16px;
    overflow: hidden;
    &:after{
      content: " ";
      display: block;
      height: 0.02667rem;
      position: absolute;
      background: #ebedf0;
      left:16px;
      right: 16px;
      bottom: 0;
      transform: scaleY(0.5);
      &:last-child:after{
        display: none;
      }
    }
    .video{
      float: left;
      border-radius: 4px;
      width: 88px;
      height: 64px;
    }
    .text{
      padding-left: 104px;
      h3{
        margin: 0;
        padding: 0 0 10px;
        line-height: 1.5;
        font-weight: normal;
      }
      .info{
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        color: $--color-menugray;
      }
    }
  }
}
</style>
