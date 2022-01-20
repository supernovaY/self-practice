/**
 * 路由:埋点配置
 */
export default {
  // 埋点匹配列表
  list: [
    // 首页
    { cp: 'eq', path: '/', rule: ['index'] },

    // 码上优惠
    { cp: 'eq', path: '/army/ptreatment', rule: ['ptreatment'] }

    // 码上就业
  ],

  rules: {
    // 首页
    index: {
      appid: 'laobingma',
      modelid: 'index_laobingma'
    },

    // 码上优惠
    ptreatment: {
      appid: '',
      modelid: ''
    },

    // 亮码统计埋点
    showqrcode: {
      appid: 'mashangyouhui',
      modelid: 'show_code'
    }
  }
}
