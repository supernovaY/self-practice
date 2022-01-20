<template>
  <div>
    <Common-PageContainer @scrollLoad="F_scrollLoad" :showToTop="true">
      <template v-slot:content>
        <div class="container">
          <div class="j-flex j-flex-center">
            <div class="dropdownsearch flex">
              <van-sticky>
                <van-dropdown-menu active-color="#1492FF">
                  <van-dropdown-item
                    :title="data.searchLabelShow.policyTypeId"
                    v-model="searchdata.policyTypeId"
                    :options="data.policyTypeId"
                    @change="(value) => { F_changeDropmenuTitle(value, 'policyTypeId') }"
                  />

                  <van-dropdown-item
                    :title="data.searchLabelShow.orderByType"
                    v-model="searchdata.orderByType"
                    :options="data.orderByType"
                    @change="(value) => { F_changeDropmenuTitle(value, 'orderByType') }"
                  />
                </van-dropdown-menu>
              </van-sticky>
            </div>

            <div class="searchbtn" @click="F_jumpToSearchPolicy">
              <span class="fas fa-search"></span>
            </div>
          </div>

          <div class="form-group nomargin-t">
            <ArticleListItem
              v-for="(item,index) in data.list"
              :key="index"
              :article="item" />
          </div>

          <!-- 到底加载结束 -->
          <Common-ListEnd v-if="pagestatus.end" />

          <!-- 无数据 -->
          <van-empty v-if="pagestatus.nodata" description="无政策信息" />

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

        // 排序字段
        column: 'create_time',

        // 排序 desc倒叙 asc正序
        orderByType: '',

        // 用户ID
        userId: '',

        // 军人类型 1代持 和 0本人
        userType: 0
      },

      // 数据存放对象
      data: {
        list: [],

        // 标签显示
        searchLabelShow: {
          policyTypeId: '政策类型',
          orderByType: '时间排序'
        },

        // 政策类型列表
        policyTypeId: [
          { text: '全部', value: '', defaultname: '政策类型' }
          // { text: '就业', value: 1 },
          // { text: '帮扶', value: 2 },
          // { text: '补助', value: 3 },
          // { text: '权益', value: 4 },
          // { text: '其他', value: 5 }
        ],

        // 时间排序
        orderByType: [
          { text: '全部', value: '', defaultname: '时间排序' },
          { text: '时间倒序', value: 'desc' },
          { text: '时间顺序', value: 'asc' }
        ],

        // 文章类型
        articleType: {
          policy: 1,
          policyrealize: 2
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
    },

    // 当前军人用户信息
    Userinfo (state) {
      return state.localData.Userinfo
    },

    // 浏览器环境参数
    browerEnvStatus: 'browerEnvStatus'
  }),

  watch: {
    // 监听类型改变
    'searchdata.policyTypeId' () {
      this.F_reset()
    },

    // 监听时间类型变化
    'searchdata.orderByType' () {
      this.F_reset()
    }
  },

  activated () {
    // 子页面keepalive控制
    this.$store.commit(
      'sendMultyPageParam',
      [
        { path: '/army/policy/policy/policysearch', data: { action: 'reload' } },
        { path: '/army/policy/policyrealize/policyrealizesearch', data: { action: 'reload' } }
      ]
    )
  },

  mounted () {
    // console.log(this.$route.params)
    this.F_loadTypeList()

    this.searchdata.articleType = this.data.articleType[this.$route.params.type] || 1
    this.searchdata.userId = this.userId
    this.searchdata.userType = this.armyInfo.type

    this.F_loadData()
  },

  methods: {
    // 加载类型列表
    async F_loadTypeList () {
      const data = await this.$Api.common.category(this.$Config.enumConfig.policy.type)

      // console.log(data)
      if (data.code === 2000) {
        data.result.map((item, index) => {
          item.value && this.data.policyTypeId.push({
            text: item.label,
            value: item.value
          })
        })
      }
    },

    // 修改下拉搜索选择标题
    F_changeDropmenuTitle (value, key) {
      // console.log(value)
      let name = ''
      const datalist = this.data[key]

      for (let i = 0; i < datalist.length; i++) {
        const item = datalist[i]

        if (value === item.value) {
          name = item.defaultname ? item.defaultname : item.text
          break
        }
      }

      this.data.searchLabelShow[key] = name
      this.searchdata[key] = value
    },

    // 消息跳转
    F_urlJump (item) {

    },

    // 跳转搜索页面
    F_jumpToSearchPolicy () {
      const type = this.$route.params.type
      let url = '/army/policy/' + type

      url += type === 'policy' ? '/policysearch' : '/policyrealizesearch'

      this.$router.push(url)
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

      this.F_loadData()
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

      // setTimeout(() => {
      //   const tempdata = {
      //     id: 1,
      //     policyTitle: '省退役军人事务厅召开党史学习教育动员部署会',
      //     policyTypeId: 1,
      //     policyLabel: '就业,财务'.split(','),
      //     createTime: '2021-5-10'
      //   }

      //   for (let i = 0; i < this.searchdata.limit; i++) {
      //     this.data.list.push(tempdata)
      //   }

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

.searchbtn{
  margin: 0 16px 0 100px;
  padding: 6px 16px;
  background: rgba(128,141,161,0.10);
  border-radius: 17px;
  font-size: 14px;
}
</style>

<style scoped>
.dropdownsearch >>> .van-dropdown-menu .van-dropdown-menu__bar{
  box-shadow: none;
}
</style>
