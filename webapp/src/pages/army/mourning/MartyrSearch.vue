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
                  placeholder="请输入英烈姓名进行搜索"
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

          <div class="j-m j-flex listcontent">
            <MartyrListItem
              v-for="(item,index) in data.list"
              :key="index"
              :item="item" />
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
import MartyrListItem from './Mourning/MartyrListItem.vue'
import { mapState } from 'vuex'

export default {
  components: {
    MartyrListItem
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

        // 地区码
        areaCode: '',

        // 年份搜索范围
        startYear: '',
        endYear: '',

        // 搜索名称
        name: ''
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

      this.searchdata.name = this.searchkey

      if (this.searchdata.name) {
        this.F_loadData()
      }
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

      const data = await this.$Api.mourn.listMartyrs(searchdata)

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

      // this.pagestatus.loading = true

      // setTimeout(() => {
      //   const tempdata = {
      //     id: 1,
      //     img: '/img/img_jsbd_top@3x.329b011a.png',
      //     name: '江姐',
      //     type: '烈士',
      //     createTime: '2021-5-10'
      //   }

      //   for (let i = 0; i < this.searchdata.limit; i++) {
      //     this.data.list.push(tempdata)
      //   }

      //   console.log(this.data.list)

      //   this.pagestatus.loading = false
      // }, 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
.container{
  background: #FFF;
}

.listcontent{
  flex-wrap: wrap;
}
</style>
