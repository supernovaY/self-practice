<template>
  <div class="contianer">
    <div class="more" @click="F_moreJump">更多</div>

    <van-tabs color="#1989fa" v-model="pagestatus.showType" sticky>
      <van-tab title="最新政策" name="policyList">
        <div class="form-group nomargin-t">
          <ArticleListItem
            v-for="(item,index) in data.policyList"
            :key="index"
            :article="item" />
        </div>

        <!-- 加载中 -->
        <Common-ListLoading v-if="pagestatus.loadingPolicy" />

        <!-- 无数据 -->
        <van-empty v-if="pagestatus.nodataPolicy" description="暂无数据" />
      </van-tab>

      <van-tab title="政策解读" name="policyRealize">
        <div class="form-group nomargin-t">
          <ArticleListItem
            v-for="(item,index) in data.policyRealize"
            :key="index"
            :article="item" />
        </div>

        <!-- 加载中 -->
        <Common-ListLoading v-if="pagestatus.loadingPolicyRealize" />

        <!-- 无数据 -->
        <van-empty v-if="pagestatus.nodataPolicyRealize" description="暂无数据" />
      </van-tab>

      <van-tab disabled></van-tab>

      <van-tab disabled></van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ArticleListItem from '../articles/ArticleListItem.vue'

export default {
  components: {
    ArticleListItem
  },
  data () {
    return {
      // 显示条数控制
      limit: 6,
      start: 0,

      // 页面状态
      pagestatus: {
        // 当前显示的类型 更多的时候跳转
        showType: '',

        // 是否已经加载数据
        loaded: {
          policyList: false,
          policyRealize: false
        },

        // 最新政策加载动画
        loadingPolicy: false,
        nodataPolicy: false,

        // 政策解读加载动画
        loadingPolicyRealize: false,
        nodataPolicyRealize: false
      },

      // 数据存放对象
      data: {
        // 最新政策
        policyList: [],

        // 政策解读
        policyRealize: [],

        // 类型列表
        typeId: {
          policyList: 1,
          policyRealize: 2
        }
      }
    }
  },

  computed: mapState({
    // url参数解析
    GET: 'GET',

    // 当前军人用户信息
    armyInfo (state) {
      return state.localData.armyInfo
    },

    // 当前军人用户信息
    userInfo (state) {
      return state.localData.Userinfo
    },

    // 浏览器环境参数
    browerEnvStatus: 'browerEnvStatus'
  }),

  watch: {
    'pagestatus.showType' (newV) {
      console.log(newV)
      this.F_loadArticle()
    }
  },

  mounted () {
    this.pagestatus.showType = 'policyList'
  },

  methods: {
    // 重新加载数据
    F_reset () {
      this.data.policyList = []
      this.data.policyRealize = []

      this.pagestatus.loaded.policyList = false
      this.pagestatus.loaded.policyRealize = false

      this.F_loadArticle()
    },

    // 更多跳转
    F_moreJump () {
      const url = this.pagestatus.showType === 'policyList'
        ? '/army/policy/policy/policylist'
        : '/army/policy/policyrealize/policyrealizelist'

      this.$router.push(url)
    },

    // 加载文章数据
    async F_loadArticle () {
      const type = this.pagestatus.showType
      const articleType = this.data.typeId[type]

      // 已经加载过
      if (this.pagestatus.loaded[type]) {
        return
      }

      this.pagestatus.loaded[type] = true

      if (articleType === 1) {
        this.pagestatus.loadingPolicy = true
      }

      if (articleType === 2) {
        this.pagestatus.loadingPolicyRealize = true
      }

      const listdata = await this.$Api.army.policy.getList({
        userId: this.armyInfo.id,
        userType: this.armyInfo.type,
        articleType: articleType,
        orderByType: 'desc',
        column: 'create_time',
        limit: this.limit,
        start: this.start
      })

      if (articleType === 1) {
        this.data.policyList = listdata.result.records || []

        this.pagestatus.loadingPolicy = false

        this.pagestatus.nodataPolicy = this.data.policyList.length <= 0
        return
      }

      if (articleType === 2) {
        this.data.policyRealize = listdata.result.records || []

        this.pagestatus.loadingPolicyRealize = false

        this.pagestatus.nodataPolicyRealize = this.data.policyRealize.length <= 0
      }

      // const tempdata = {
      //   id: 1,
      //   policyTitle: '省退役军人事务厅召开党史学习教育动员部署会',
      //   policyTypeId: 1,
      //   policyLabel: '就业,财务'.split(','),
      //   createTime: '2021-5-10'
      // }

      // for (var i = 0; i < this.limit; i++) {
      //   this.data.policyList.push(tempdata)

      //   this.data.policyRealize.push(tempdata)
      // }
    }
  }
}
</script>

<style lang="scss" scoped>
.contianer {
  position: relative;
  background: #FFF;

  .more {
    position: absolute;
    right: 16px;
    top: 16px;
    color: #808da1;
    z-index: 1;
  }
}
</style>

<style scoped>
.van-tabs >>> .van-tab .van-tab__text--ellipsis{
  font-size: 14px;
}

.van-tabs >>> .van-tab.van-tab--active .van-tab__text--ellipsis{
  font-size: 16px;
}
</style>
