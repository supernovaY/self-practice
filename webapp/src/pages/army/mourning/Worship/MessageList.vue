<template>
  <div>
    <div class="j-m count-title">
      共有 <span class="j-fc-blue">{{ data.total }}</span> 人寄语
    </div>
    <div class="form-group">
      <MessageListItem
        v-for="(item,index) in data.list"
        :key="index"
        :item="item">
      </MessageListItem>
    </div>

    <!-- 到底加载结束 -->
    <Common-ListEnd v-if="pagestatus.end" />

    <!-- 无数据 -->
    <van-empty v-if="pagestatus.nodata" description="暂无相关信息" />

    <!-- 加载动画 -->
    <Common-ListLoading v-show="pagestatus.loading" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import MessageListItem from './MessageListItem.vue'

export default {
  components: {
    MessageListItem
  },

  props: ['martyr'],

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
        martyrCode: ''
      },

      // 数据存放对象
      data: {
        list: [],

        // 总共条数
        total: 0
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
    // 监听热度排序修改
    'searchdata.yearRange' () {
      this.F_reset()
    }
  },

  mounted () {},

  methods: {
    // 设置烈士信息
    F_setMartyr (martyr) {
      this.searchdata.martyrCode = martyr.martyrCode
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
      if (
        this.pagestatus.loading ||
        this.pagestatus.end ||
        this.pagestatus.nodata
      ) {
        return
      }

      this.pagestatus.loading = true

      const searchdata = Object.assign({}, this.searchdata)

      const data = await this.$Api.mourn.listWords(searchdata)

      this.pagestatus.loading = false

      if (data.code !== 2000) {
        this.$toast('数据请求失败')
        return
      }

      const list = data.result.records
      this.data.total = data.result.total

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
      //     name: '王杰烈士陵园',
      //     level: '国家级重点纪念设施',
      //     address: '祥符街道祥园路37号北软中天园西南门',
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
@import '@/assets/css/variables.scss';

.count-title{
  font-size: 16px;
  font-weight: bold;
}
</style>
