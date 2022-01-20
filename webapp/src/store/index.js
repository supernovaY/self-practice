import Vue from 'vue'
import vuex from 'vuex'

Vue.use(vuex)

// 本地存储数据存放键值
const localKey = 'retireArmyQrcodeData'

// 初始化存储数据
function initData () {
  const state = {
    // 存放本地存储的数据
    localData: {
      // 上次授权码
      ticket: '',
      // 登录尝试次数
      logintry: 0,

      // 浙里办强制cookie
      cookie: '',

      // 商户机构信息存放
      merchantInfo: {
        name: '',
        id: -1
      },

      // 当前军人用户信息存放
      // 如果为本人 type=0 时 信息和 Userinfo 保持一致
      armyInfo: {
        id: '',
        userName: '',
        type: 0
      },

      // 代持军人列表
      armyList: [],

      // 当前登录用户信息
      Userinfo: {
        id: false,
        userName: '',
        avatar: ''
      },

      // 地图定位数据
      mapLocation: {
        timestamp: 0,
        city: '',
        district: '',
        province: '',
        lng: '',
        lat: ''
      },

      // 地图定位后 映射 城市数据
      mapCityData: {
        province: {},
        city: {},
        district: {}
      },

      // 页面传参数据存放对象
      pageParam: {},

      // 登录后 重定向跳转地址
      loginRedirectUrl: ''
    },

    // 当次会话数据
    sessionData: {
      // 页面参数跳转
      JumpUrl: '',

      // 上次授权tikcet
      lastTicket: '',

      // 用户选择的城市信息
      userSelectCity: {
        province: {},
        city: {},
        district: {},
        area_name: '',
        area_code: '',
        level: 0
      }
    },

    // 全局url接参数据
    GET: {},

    // 浏览器运行环境
    browerEnv: '',
    browerEnvStatus: {},

    // 全局加载动画控制
    requestLoading: false,

    // 浙里办配置 系统配置
    zlbConfig: {
      // 应用
      servicecode: '',

      // 全局省份控制
      cityCode: ''
    },

    // 使用的地图类型 gaodemap=高德地图 bmap=百度地图 tencentmap=腾讯地图
    mapType: '',

    // 创业/求职行业数据
    allIndustry: []
  }

  const initData = localStorage[localKey]
    ? JSON.parse(localStorage[localKey])
    : {}

  const initSessionData = sessionStorage[localKey]
    ? JSON.parse(sessionStorage[localKey])
    : {}

  state.localData = Object.assign(state.localData, initData)
  state.sessionData = Object.assign(state.sessionData, initSessionData)

  return state
}

export default new vuex.Store({
  state: initData(),
  mutations: {
    updateValue (state, payload) {
      state[Object.keys(payload)] = payload[Object.keys(payload)]
    },

    // 清空本地缓存数据
    clearLocalData (state) {
      // 过滤字段处理 不被重置
      const filter = ['loginRedirectUrl']
      const filterData = {}

      filter.map((item) => {
        filterData[item] = state.localData[item]
      })

      state.localData = {}

      for (const i in filterData) {
        state.localData[i] = filterData[i]
      }

      localStorage[localKey] = JSON.stringify(state.localData)
    },

    // 更新本地存储数据
    updateLocalData (state, payload) {
      for (const i in payload) {
        state.localData[i] = payload[i]
      }

      localStorage[localKey] = JSON.stringify(state.localData)
    },

    // 更新session存储数据
    updateSessionData (state, payload) {
      for (const i in payload) {
        state.sessionData[i] = payload[i]
      }

      sessionStorage[localKey] = JSON.stringify(state.sessionData)
    },

    // 更新本地数据到变量
    updateFromLocal (state) {
      const payload = JSON.parse(localStorage[localKey])      for (const i in payload) {
        state.localData[i] = payload[i]
      }
    },

    // 设置url参数数据
    setGetParam (state, data) {
      console.log('设置GET参数', data)
      state.GET = data
    },

    // 显示全局加载动画
    requestLoading (state, flag) {
      state.requestLoading = flag
    },

    // 更新地图定位信息
    updateMapLocation (state, data) {
      state.localData.mapLocation = data

      localStorage[localKey] = JSON.stringify(state.localData)
    },

    // 向指定页面传参数据
    sendPageParam (state, data) {
      state.localData.pageParam[data.path] = data.data
      localStorage[localKey] = JSON.stringify(state.localData)
    },

    // 向指定多页面传参数据
    sendMultyPageParam (state, datas = []) {
      datas.map((item) => {
        state.localData.pageParam[item.path] = item.data
      })

      localStorage[localKey] = JSON.stringify(state.localData)
    }
  },

  getters: {
    // 获取用户选择城市code 数组列表
    // [省,市,区]
    userSelectCityCode (state) {
      const citylist = []
      const userCidyData = state.sessionData.userSelectCity

      if (userCidyData.province && userCidyData.province.area_code) {
        citylist.push(userCidyData.province.area_code)
      }

      if (userCidyData.city && userCidyData.city.area_code) {
        citylist.push(userCidyData.province.area_code)
      }

      if (userCidyData.district && userCidyData.district.area_code) {
        citylist.push(userCidyData.province.area_code)
      }

      return citylist
    },

    // 获取用定位 城市code 数组列表
    // [省,市,区]
    userMapLocationCityCode (state) {
      const citylist = []

      const mapCityData = state.localData.mapCityData

      if (mapCityData.province && mapCityData.province.area_code) {
        citylist.push(mapCityData.province.area_code)
      }

      if (mapCityData.city && mapCityData.city.area_code) {
        citylist.push(mapCityData.province.area_code)
      }

      if (mapCityData.district && mapCityData.district.area_code) {
        citylist.push(mapCityData.province.area_code)
      }

      return citylist
    },

    // 用户选择的城市信息
    userSelectCity (state) {
      return state.sessionData.userSelectCity
    },

    // 获取我的 页面传参数据
    pageParam: (state) => (_vue) => {
      const path = _vue.$route.path
      const data = state.localData.pageParam[path] ? state.localData.pageParam[path] : false

      if (data === false) {
        return data
      }

      delete state.localData.pageParam[path]
      localStorage[localKey] = JSON.stringify(state.localData)
      return data
    },

    // 登录跳转地址
    loginRedirectUrl (state) {
      const url = state.localData.loginRedirectUrl

      state.localData.loginRedirectUrl = ''

      localStorage[localKey] = JSON.stringify(state.localData)
      return url
    }
  }
})
