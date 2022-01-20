<template>
  <div>
    <Common-PageContainer @scrollLoad="F_scrollLoad" :showToTop="true">
      <template #content>
        <div class="container">
          <div class="headertip">
            <div class="j-m j-flex j-flex-center">
              <div class="infoicon">
                <span class="fas fa-bell"></span>
              </div>

              <div class="flex">优惠券无法叠加使用</div>
            </div>
          </div>

          <div class="j-flex j-flex-center">
            <div class="dropdownsearch-fixed"></div>

            <div class="dropdownsearch">
              <van-dropdown-menu
                active-color="#1492FF">
                <van-dropdown-item
                  :title="data.searchLabelShow.status"
                  v-model="searchdata.status"
                  :options="data.status"
                  @change="(value) => { F_changeDropmenuTitle(value, 'status') }" />
              </van-dropdown-menu>
            </div>
            <div class="flex"></div>
          </div>

          <div>
            <Coupon
             v-for="(item,index) in data.list"
             :key="index"
             :coupon="item" />
          </div>

          <!-- 到底加载结束 -->
          <Common-ListEnd v-if="pagestatus.end" />

          <!-- 无数据 -->
          <van-empty v-if="pagestatus.nodata" description="暂无优惠券" />

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
import Coupon from '@/components/coupon/Coupon.vue'

export default {
  components: {
    Coupon
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

        // 0：可用  1：已使用 2：已失效 3:暂时不可用
        status: '',

        userType: '',
        userId: ''
      },

      // 数据存放对象
      data: {
        list: [],

        // 标签显示
        searchLabelShow: {
          status: '优惠券类型'
        },

        // 1: '暂时不可使用',
        // 2: '可用',
        // 3: '已过期',
        // 4: '已使用',

        status: [
          { text: '全部', value: '', defaultname: '优惠券类型' },
          { text: '可用优惠券', value: 0 },
          { text: '已失效优惠券', value: 2 },
          { text: '已使用优惠券', value: 1 }
        ]
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
    // 搜索状态监听
    'searchdata.status' () {
      this.F_reset()
    }
  },

  mounted () {
    this.searchdata.userId = this.armyInfo.id
    this.searchdata.userType = this.armyInfo.type

    this.F_reset()
  },

  methods: {
    // 重置列表
    F_reset () {
      this.data.list = []
      this.searchdata.start = 0

      this.pagestatus.nodata = false
      this.pagestatus.end = false
      this.pagestatus.loading = false

      this.F_loadData()
    },

    // 加载数据
    async F_loadData () {
      this.pagestatus.loading = true

      // 加载优惠券列表
      const data = await this.$Api.army.getCouponList(
        this.searchdata
      )

      this.pagestatus.loading = false

      if (data.code !== 2000) {
        this.$toast('数据请求失败')
        return
      }

      if (this.searchdata.start === 0 && (!data.result || data.result.records.length <= 0)) {
        this.pagestatus.nodata = true
        return
      }

      const list = data.result.records

      if (!list || list.length < this.searchdata.limit) {
        this.pagestatus.end = true
      }

      this.searchdata.start += this.searchdata.limit
      list.map((item) => {
        item.createTime = item.sendTime

        this.data.list.push(item)
      })
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

    // 滚动加载触发
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

    // 跳转url
    F_jump (url) {
      this.$router.push(url)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/variables.scss';

.container{
  background: #FFF;
}

.dropdownsearch-fixed{
  width: 10px;
}

.headertip {
  background: #EEEEEE;
  color: $--color-deepgray;
  padding: 12px 0;

  .infoicon {
    width: 24px;
    margin-right: 0.1rem;
    font-size: 16px;
  }
}
</style>

<style scoped>
.dropdownsearch >>> .van-dropdown-menu .van-dropdown-menu__bar{
  box-shadow: none;
}
</style>
