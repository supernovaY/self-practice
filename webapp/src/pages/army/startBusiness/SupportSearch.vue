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
          <Common-PageDevideHeight />
          <div class="form-group nomargin-t">
            <SupportListItem
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
import { mapState } from 'vuex'
import SupportListItem from './SupportListItem.vue'

export default {
  components: {
    SupportListItem
  },
  data () {
    return {
      pagestatus: { // 页面状态
        loading: false, // 列表数据加载中
        end: false, // 到底了
        nodata: false // 无数据
      },
      searchdata: { // 搜索对象
        start: 0,
        limit: 20,
        areaCode: '',
        supportType: 0, // 全部
        keyword: '' // 标题关键字
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
    // this.searchdata.userId = this.userId
    // this.searchdata.userType = this.armyInfo.type
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
      const data = await this.$Api.army.startup.getArmySupportList(searchdata)
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
    F_jumpUrl (id) {
      this.$router.push('/army/startbusiness/supportdetail/' + id)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/variables.scss';
.container {
  background: #fff;
  .flex{
    position: relative;
  }
  .datetext{
    position: absolute;
    right: 0;
    bottom: 0;
    font-size: 12px;
    color: $--color-menugray;
  }
  .title{
    font-size: 18px;
  }
  .label-container{
    font-size: 12px;
    margin-right: 5px;
    display: inline-block;
    .van-tag{
      padding: 2px 8px;
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
