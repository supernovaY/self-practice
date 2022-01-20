<template>
  <div>
    <Common-PageContainer>
      <template #content>
        <div class="headercontainer">
          <ApplicabilityTraining
            v-if="!pagestatus.loading && pagestatus.reload && data.trainingList.length"
            :msgList="data.trainingList"
          />
          <HeaderUserInfo
            v-if="pagestatus.reload"
            ref="headeruserinfo"
            @exchangeuser="F_exchangeUser"
          />

          <Common-PageDevideHeight />

          <div class="j-m">
            <!-- 证书 -->
            <!-- <CertList v-if="pagestatus.reload" /> -->
          </div>

          <Common-PageDevideHeight />
          <Common-PageDevideHeight />

          <div class="j-m">
            <div class="j-flex j-flex-center">
              <div class="flex">
                <span class="j-fc-deepgray usualapp-title">
                  常用应用
                </span>
              </div>

              <div
                class="j-fc-blue location-iconmr"
                @click="pagestatus.showCitySelect = true"
              >
                <span class="fas fa-map-marker-alt"></span>
                {{ userSelectCity.area_name || '定位中' }}
                <span class="fas fa-angle-right"></span>
              </div>
            </div>

            <Common-PageDevideHeight />

            <!-- 加载动画 -->
            <Common-ListLoading v-show="pagestatus.loading" />

            <MenuList
              v-if="!pagestatus.loading && pagestatus.reload"
              :menuList="data.menuList"
            />
          </div>

          <Common-PageDevideHeight />
          <Common-PageDevideHeight />
        </div>

        <Common-PageDevideHeight />

        <!-- 最新政策 政策解读 -->
        <ArticleList v-if="pagestatus.reload" />

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

    <!-- 切换身份 -->
    <van-action-sheet
      v-model="pagestatus.exchangeUser"
      :actions="data.exchangeUser"
      cancel-text="取消"
      close-on-click-action
      @select="F_exchangeUserConfirm"
    />
  </div>
</template>

<script>
// import thirdauth from '@/assets/js/thirdauthtool/thirdauth'
import { mapState } from 'vuex'
import ApplicabilityTraining from './ApplicabilityTraining.vue'
import MenuList from './MenuList.vue'
import HeaderUserInfo from './HeaderUserInfo.vue'
import ArticleList from './ArticleList.vue'

export default {
  components: {
    ApplicabilityTraining,
    MenuList,
    HeaderUserInfo,
    ArticleList
    // CertList
  },

  data () {
    return {
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
        // 适应性培训数据
        trainingList: [],
        // 菜单数据
        menuList: [],

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
    // 页面已经初始化 进入keepalive
    setTimeout(() => {
      this.pagestatus.keepalive = true
    }, 100)

    // this.F_loadTrainingData() 为不影响当前功能，暂时隐藏适应性培训消息

    this.F_initCityData()

    this.F_initPageData()
  },

  methods: {
    // 页面初始化需要处理的东西
    F_initPageData () {
      this.pagestatus.loading = true

      this.F_loadMyArmyList()

      // 存在用户已选城市数据 则直接加载菜单数据
      if (this.userSelectCity.area_code) {
        this.F_loadMenuData()
      }
    },

    // 城市数据 直到三级 目前限制为浙江省
    async F_initCityData () {
      const data = await this.$Common.getProvinceData()
      this.data.cityData = [data]
    },

    // 加载代持军人列表数据
    async F_loadMyArmyList (showExchange) {
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
        if (!meIsArmy) {
          const UserArmyDefaultData = {
            id: '',
            userName: '',
            type: 0,
            name: '本人'
          }

          if (!meIsArmy && this.armyInfo.type === 0) {
            UserArmyDefaultData.className = 'j-fc-blue'
            UserArmyDefaultData.disabled = true
          }

          this.data.exchangeUser.push(UserArmyDefaultData)
        }

        // 显示切换窗口
        this.pagestatus.exchangeUser = !!showExchange
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

    // 切换身份
    F_exchangeUser () {
      this.F_loadMyArmyList(true)
    },

    // 确认身份切换
    F_exchangeUserConfirm (item) {
      // console.log(item)
      const armyInfo = Object.assign({}, item)

      delete armyInfo.name
      delete armyInfo.className
      delete armyInfo.disabled

      this.pagestatus.exchangeUser = false

      this.$store.commit('updateLocalData', {
        armyInfo: armyInfo
      })
    },

    // 加载我的菜单数据
    async F_loadMenuData () {
      const data = await this.$Api.army.getMyApplication({
        userId: this.armyInfo.id,
        appAreaCode: this.userSelectCity.area_code,
        authorityType: this.browerEnv,
        userType: this.armyInfo.type
      })

      this.pagestatus.loading = false

      // console.log('菜单数据', data)
      if (data.result.apps) {
        this.data.menuList = []

        data.result.apps.map((item) => {
          if (item.active === 1) {
            this.data.menuList.push(item)
          }
        })
      }
    },

    // 加载适应性培训数据
    async F_loadTrainingData () {
      this.data.trainingList = []
      const data = await this.$Api.army.getApplicabilityTraining()
      this.pagestatus.loading = false
      if (data.result && data.result.length > 0) {
        this.data.trainingList = data.result
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.headercontainer {
  background: #fff;
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
