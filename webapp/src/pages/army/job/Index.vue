<template>
  <div>
    <Common-PageContainer :showToTop="true" @scrollLoad="F_scrollLoad">
      <template #content>
        <!-- 图片轮播 -->
        <div class="container">
          <Common-PageDevideHeight />
          <div class="j-m" v-if="banner && banner.length > 0">
            <div class="cover-swiper">
              <div class="couver-count">
                <span class="far fa-image"></span> {{ banner.length }}
              </div>
              <div>
                <van-swipe :autoplay="3000" indicator-color="white">
                  <template v-for="(item, index) in banner">
                    <van-swipe-item v-if="item.bannerPhoto" :key="index">
                      <div :style="'background-image: url(' + item.bannerPhoto + ');'" class="img"></div>
                    </van-swipe-item>
                  </template>
                </van-swipe>
              </div>
            </div>
          </div>
          <div class="menucontainer j-flex">
            <router-link to="/army/job/policyquery/1" class="menuitem">
              <div>
                <span class="icon-img icon-search"></span>
              </div>
              <div class="menuname j-fc-deepgray">政策查询</div>
            </router-link>
            <!-- <router-link to="/army/job/caselist" class="menuitem">
              <div>
                <span class="icon-img icon-case"></span>
              </div>
              <div class="menuname j-fc-deepgray">就业案例</div>
            </router-link> -->
            <router-link to="/army/job/guidancelist" class="menuitem">
              <div>
                <span class="icon-img icon-guidance"></span>
              </div>
              <div class="menuname j-fc-deepgray">职业指导</div>
            </router-link>
            <router-link to="/army/job/traininglist" class="menuitem">
              <div>
                <span class="icon-img icon-training"></span>
              </div>
              <div class="menuname j-fc-deepgray">教育培训</div>
            </router-link>
            <router-link to="/army/job/mytrack" class="menuitem">
              <div>
                <span class="icon-img icon-track"></span>
              </div>
              <div class="menuname j-fc-deepgray">我的足迹</div>
            </router-link>
          </div>
        </div>
        <Common-PageDevideHeight />
        <!-- 招聘列表 招聘会信息 -->
        <JobList ref="jobList" v-if="pagestatus.reload" />

        <Common-PageFooter />
      </template>
    </Common-PageContainer>

    <!-- 城市选择组件 -->
    <van-popup v-model="pagestatus.showCitySelect" position="bottom">
      <van-picker
        ref="citypicker"
        show-toolbar
        title="选择城市"
        :columns="data.cityData"
        value-key="area_name"
        @confirm="F_confirmCity"
        @cancel="pagestatus.showCitySelect = false"
      />
    </van-popup>
  </div>
</template>

<script>

import { mapState } from 'vuex'
import JobList from './JobList.vue'

export default {
  components: {
    JobList
  },

  data () {
    return {
      banner: [],
      // 页面状态控制
      pagestatus: {
        // 是否已经进入keepalive
        keepalive: false,

        // 菜单加载等待动画
        loading: false,

        // 是否显示城市选择
        showCitySelect: false,

        // 身份切换显示
        exchangeUser: false,

        // 刷新控制组件 重新使用
        reload: true
      },

      // 数据存放对象
      data: {
        // 菜单数据
        menuList: [
          // { name: '码上优待', img: logo, icon: 'img-icon-1', url: '/army/ptreatment' },
          // { name: '码上查询', img: logo, icon: 'img-icon-1', url: 'https://www.baidu.com' },
          // { name: '码上就业', img: logo, icon: 'img-icon-1', url: '' },
          // { name: '码上创业', img: logo, icon: 'img-icon-1', url: '' },
          // { name: '码上就医', img: logo, icon: 'img-icon-1', url: '' },
          // { name: '码上办事', img: logo, icon: 'img-icon-1', url: '' },
          // { name: '码上追思', img: logo, icon: 'img-icon-1', url: '' },
          // { name: '码上学习', img: logo, icon: 'img-icon-1', url: '' },
          // { name: '老兵优惠', img: logo, icon: 'img-icon-1', url: '' },
          // { name: '优先就诊', img: logo, icon: 'img-icon-1', url: '' },
          // { name: '我要咨询', img: logo, icon: 'img-icon-1', url: '' }
        ],

        // 最新政策
        articleNew: [],

        // 政策解读
        articleRead: [],

        // 我的代持军人数据
        representList: [
          { name: '', idcard: '' },
          { name: '', idcard: '' },
          { name: '', idcard: '' }
        ],

        // 城市数据 使用浙江的城市
        cityData: [],

        // 可切换的身份
        exchangeUser: []
      }
    }
  },

  computed: mapState({
    // url参数解析
    GET: 'GET',

    // 用户信息
    Userinfo (state) {
      return state.localData.Userinfo
    },

    // 当前军人信息
    armyInfo (state) {
      return state.localData.armyInfo
    },

    // 代持军人列表信息
    armyList (state) {
      return state.localData.armyList
    },

    // 浏览器环境参数
    browerEnvStatus: 'browerEnvStatus',

    // 当前所在环境
    browerEnv: 'browerEnv',

    // 地图定位信息
    mapLocation (state) {
      return state.localData.mapLocation
    },

    // 用户选择的城市信息
    userSelectCity () {
      return this.$store.getters.userSelectCity
    }
  }),

  watch: {
    // 城市地区变化
    'userSelectCity.area_code' () {
      this.F_loadMenuData()
    },

    // 代持选择修改
    'armyInfo.id' () {
      this.F_loadMenuData()

      this.pagestatus.reload = false

      setTimeout(() => {
        this.pagestatus.reload = true
      }, 500)
    }
  },

  activated () {
    const pageParam = this.$store.getters.pageParam(this)

    if (this.pagestatus.keepalive) {
      // 用户对自己的常用应用进行了编辑
      if (pageParam && pageParam.action === 'updateMyApplication') {
        this.F_loadMenuData()
      }

      // 一些keepalive的页面重置处理
      this.$store.commit(
        'sendMultyPageParam',
        [
          { path: '/army/message', data: { action: 'reload' } },
          { path: '/army/policy/policy/policylist', data: { action: 'reload' } },
          { path: '/army/policy/policyrealize/policyrealizelist', data: { action: 'reload' } },
          { path: '/army/ptreatment', data: { action: 'reload' } }
        ]
      )
    }
  },

  mounted () {
    this.getBanner()

    // 页面已经初始化 进入keepalive
    setTimeout(() => {
      this.pagestatus.keepalive = true
    }, 100)

    this.F_initCityData()

    this.F_initPageData()
  },

  methods: {
    // 滚动加载
    F_scrollLoad () {
      this.$refs.jobList.F_scrollLoad()
    },
    // 页面初始化需要处理的东西
    F_initPageData () {
      this.pagestatus.loading = true

      // this.F_loadMyArmyList()

      // 存在用户已选城市数据 则直接加载菜单数据
      if (this.userSelectCity.area_code) {
        this.F_loadMenuData()
      }
    },

    // 加载Banner列表
    async getBanner () {
      const data = await this.$Api.army.job.getJobBanner()
      if (data.code === 2000 && data.result && data.result) {
        this.banner = data.result
      }
    },

    // 城市数据 直到三级 目前限制为浙江省
    F_initCityData () {
      // const cityData = Object.assign(
      //   this.$Common.getCityByCode(this.$Config.cityCode)
      // )

      // // 去除街道级别
      // cityData.children.map((item) => {
      //   item.children.unshift({
      //     area_code: '',
      //     area_name: '请选择',
      //     parent_code: 0,
      //     level: 0
      //   })

      //   item.children.map((sunItem) => {
      //     delete sunItem.children
      //   })
      // })

      this.data.cityData = [this.$Common.getProvinceData()]
    },

    // 加载代持军人列表数据
    async F_loadMyArmyList () {
      this.$Common.showLoading(true)

      // 我的老兵代持数据
      const armyListData = await this.$Api.army.user.getMyArmyList({
        userId: this.Userinfo.id
      })

      this.$Common.showLoading(false)

      if (armyListData.code === 2000) {
        // 无代持信息
        if (armyListData.result.length <= 0) {
          return
        }

        this.data.exchangeUser = []

        // 自己是否为军人
        let meIsArmy = false

        armyListData.result.map((item) => {
          item.name = item.type === 0 ? '本人' : item.userName

          if (item.id === this.armyInfo.id) {
            item.className = 'j-fc-blue'
            item.disabled = true
          }

          // 自己为军人
          if (item.type === 0) {
            meIsArmy = true
          }

          this.data.exchangeUser.push(item)
        })

        // 用户不是老兵 且当前为代持 插入本人切换
        if (!meIsArmy && this.armyInfo.type !== 0) {
          const UserArmyDefaultData = {
            id: '',
            userName: '',
            type: 0,
            name: '本人'
          }

          // UserArmyDefaultData.className = 'j-fc-blue'
          // UserArmyDefaultData.disabled = true

          this.data.exchangeUser.push(UserArmyDefaultData)
        }

        // 显示切换窗口
        this.pagestatus.exchangeUser = true
        this.$store.commit('updateLocalData', { armyList: armyListData.result })
        return
      }

      this.$toast('代持军人数据请求失败')
    },

    // 确认选择城市
    F_confirmCity (evt) {
      // console.log(evt)

      const cityData = this.$refs.citypicker.getValues()

      // console.log(cityData)

      this.pagestatus.showCitySelect = false

      const selectedCity = !cityData[2].area_code ? cityData[1] : cityData[2]

      // 更新城市选择信息
      this.$store.commit('updateSessionData', {
        userSelectCity: {
          province: cityData[0],
          city: cityData[1],
          district: cityData[2],
          area_name: selectedCity.area_name,
          area_code: selectedCity.area_code,
          level: selectedCity.level
        }
      })
    },
    // 加载我的菜单数据
    async F_loadMenuData () {
      this.data.menuList = []

      const data = await this.$Api.army.getMyApplication({
        userId: this.armyInfo.id,
        appAreaCode: this.userSelectCity.area_code,
        authorityType: this.browerEnv,
        userType: this.armyInfo.type
      })

      this.pagestatus.loading = false

      // console.log('菜单数据', data)
      if (data.result.apps) {
        data.result.apps.map((item) => {
          if (item.active === 1) {
            this.data.menuList.push(item)
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/variables.scss";
.container{
  background: #fff;
  .menucontainer{
    background: #FFFFFF;
    padding: 0 10px;
    justify-content: space-around;
    .menuitem{
      padding: 16px 0;
      text-align: center;
      &:active{
        opacity: .5;
      }

      .menuname{
        font-size: 14px;
        margin-top: 4px;
      }

      .icon-img{
        display: inline-block;
        width: 36px;
        height: 36px;
        background-position: center center;
        background-repeat: no-repeat;
        background-size: contain;
      }
    }
    .icon-search{
      background-image: url(../../../assets/img/job/icon_search@3x.png);
    }
    .icon-case{
      background-image: url(../../../assets/img/job/icon_case@3x.png);
    }
    .icon-guidance{
      background-image: url(../../../assets/img/job/icon_guidance@3x.png);
    }
    .icon-training{
      background-image: url(../../../assets/img/job/icon_training@3x.png);
    }
    .icon-track{
      background-image: url(../../../assets/img/job/icon_track@3x.png);
    }
  }
}
.cover-swiper{
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  .couver-count{
    position: absolute;
    z-index: 1;
    right: 16px;
    top: 16px;
    color: #FFF;
    background: rgba(0,0,0,.5);
    border-radius: 10px;
    padding: 4px 12px;
    font-size: 14px;
  }
  .img{
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    height: 90px;
  }
}
.inlinetext {
  display: inline-block;
  margin-left: 8px;
}

.location-iconmr {
  margin-right: 10px;
}

.usualapp-title {
  font-size: 22px;
}
</style>
