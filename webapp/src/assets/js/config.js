export default {
  // 项目引入应用, 'job'就业 'startbusiness'创业 'mourning'追思
  apps: ['job', 'startbusiness', 'mourning'],
  // 浙里办接入配置
  ZLBConfig: {
    appKey: '1qafm03b+2001820920+kvuwea',
    host: process.env.NODE_ENV === 'development' ? '/' : 'https://mapi.zjzwfw.gov.cn/',
    api: 'mgop.zjhc.zjlbm.v2'
  },

  zlbJSBridgedd: '//jssdk.yyhj.zjzwfw.gov.cn/jsbridge/v2.0.0/bridge.min.js', // 浙里办 jssdk配置
  zlbJSBridge: '//assets.zjzwfw.gov.cn/assets/ZWJSBridge/1.0.1/zwjsbridge.js', // 浙里办 jssdk配置

  // 支付宝h5 jssdk
  alipayh5jssdk: 'https://gw.alipayobjects.com/as/g/h5-lib/alipayjsapi/3.1.1/alipayjsapi.min.js',

  // 支付宝小程序jssdk
  alipayJSSdk: 'https://appx/web-view.min.js',
  wxJSSdk: '',

  // 客户端类型列表
  userAgent: {
    // 支付宝H5
    alipay: 'alipay',
    // 支付宝小程序
    alipayminiprogrm: 'alipayminiprogrm',
    // 微信H5
    wx: 'wx',
    // 微信小程序
    wxminiprogram: 'wxminiprogram',
    // 浙里办App
    zlb: 'ZLB',
    // 浙里办支付宝小程序
    zlbminiprogram: 'ZLB_ALI'
  },

  // 城市 目前使用 浙江省
  cityCode: '330000000000',

  // 地图配置
  mapConfig: {
    // 高德js引入配置
    gaode:
      'https://webapi.amap.com/maps?v=1.4.15&key=6513742bb7625d49dcc6b149b16e5a52&plugin=AMap.Autocomplete,AMap.PlaceSearch,AMap.Geocoder,AMap.Geolocation,AMap.CitySearch',

    // 腾讯地图配置
    tencent: '',

    // 百度地图配置
    bmap: '',

    // 天地图
    tdmap: ''
  },

  // 枚举字典表参数配置
  enumConfig: {
    // 性别
    gender: { 0: '女', 1: '男', 2: '其他' },

    // 军人家人关系
    armyrelocation: 'SOLDIER_RELATIONTYPE',

    // 订单支付状态
    payorderstatus: {
      0: '未支付',
      1: '支付中',
      2: '已支付',
      3: '退款中',
      4: '已退款',
      5: '支付失败'
    },

    // 订单支付类型
    paytype: {
      0: '线下支付',
      1: '支付宝支付'
    },

    // 政策文章
    policy: {
      // 政策类型
      type: 'POLICY_TYPE'
    },

    // 服务机构类型
    serviceType: 'SERVICE_ORG_TYPE',

    // 商家类型
    merchantType: 'MERCHANT_TYPE',

    // 系统配置 浙里办AppId/省份控制
    sytemConfig: 'SYSTEM_CONFIG',

    // 地图字典数据
    mapType: 'MAP_TYPE'
  },

  // 搜索记录存放ID 隔离配置
  searchHistory: {
    // 政策
    policy: 1,
    // 政策解读
    policyrealize: 2,

    // 军人搜索机构
    armysearchservice: 5,
    // 军人搜索
    armysearchmerchant: 6,

    // 商家订单搜索
    merchantorder: 3,
    // 优惠券核销
    merchantcoupon: 4
  }
}
