import Api from '../api.js'
import Common from '../common.js'
// import Config from '../config.js'
import CounterConfig from './config.js'

/**
 * 埋点统计请求
 */
function visitCounter () {
  const $vue = Common.getVue()

  console.log($vue.$route, $vue.$router)
  console.log($vue.$store.state)

  // const path = $vue.route.path

  // nessartDataChecker(() => {

  // })
}

/**
 * 必要数据检测是否完毕
 * 请求延迟触发
 * 1.经纬度
 * 2.城市代码
 */
function nessartDataChecker (callback) {
  const $vue = Common.getVue()

  const localData = $vue.$store.state.localData

  if (
    localData.mapLocation &&
    localData.mapLocation.lat &&
    localData.mapLocation.lng &&
    (localData.mapCityData.province && localData.mapCityData.province.area_code)
  ) {
    callback()
    return
  }

  setTimeout(() => {
    nessartDataChecker(callback)
  }, 1000)
}

/**
 * 请求记录统计数据
 */
function requestCounter (rule, callback) {
  // console.log('埋点统计', rule)
  const $vue = Common.getVue()

  nessartDataChecker(async () => {
    const localData = $vue.$store.state.localData

    await Api.common.visitCounter({
      appCode: rule.appid,
      modelCode: rule.modelid,
      longitude: localData.mapLocation.lng,
      latitude: localData.mapLocation.lat,
      exServicemanId: localData.armyInfo.id || '',
      areaCode: localData.mapCityData.city.area_code || (localData.mapCityData.district.area_code || localData.mapCityData.province.area_code)
    })

    if (callback) {
      callback()
    }
  })
}

/**
 * 菜单点击埋点入口处理
 */
function menuEnterCount (appid, callback) {
  requestCounter({
    appid: appid,
    modelid: CounterConfig.rules.index.modelid
  }, callback)
}

/**
 * @param {Object} callback
 * 亮码 码上优惠埋点
 */
function showQrcodeCount (callback) {
  requestCounter(CounterConfig.rules.showqrcode, callback)
}

/**
 * 获取规则对象
 */
function getRule (ruleName) {
  return CounterConfig.rules[ruleName] || false
}

export default {
  visitCounter: visitCounter,
  requestCounter: requestCounter,
  getRule: getRule,
  menuEnterCount: menuEnterCount,
  showQrcodeCount: showQrcodeCount
}
