import Validator from './Validator.js'
// import cityData from '../data/citydata.json'
import Toast from 'vant/lib/toast'
import axios from 'axios'

// vue实例对象
let $vue = null
function setVue (_vue) {
  $vue = _vue
}
function getVue () {
  return $vue
}

// 城市数据
let cityData = false

/**
 * 日期对象 赋予格式化函数挂载
 */
function dateFormatDefine () {
  window.Date.prototype.Format = function (fmt) {
    const cNumber = ['日', '一', '二', '三', '四', '五', '六']

    const o = {
      'M+': this.getMonth() + 1, // 月份
      'd+': this.getDate(), // 日
      'h+': this.getHours(), // 小时
      'm+': this.getMinutes(), // 分
      's+': this.getSeconds(), // 秒
      'w+': cNumber[this.getUTCDay()], // 星期
      'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
      S: this.getMilliseconds() // 毫秒
    }

    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        (this.getFullYear() + '').substr(4 - RegExp.$1.length)
      )
    }

    for (const k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length === 1
            ? o[k]
            : ('00' + o[k]).substr(('' + o[k]).length)
        )
      }
    }

    return fmt
  }
}
dateFormatDefine()

/**
 * 地址跳转处理
 * @param {Object} url
 */
function urlJump (url) {
  const _ua = $vue.$store.state.browerEnvStatus

  // 内部地址 直接router处理
  if (url[0] === '/') {
    $vue.$router.push(url)
    return
  }

  // 外部地址
  if (Validator.Url.test(url)) {
    // 浙里办App 或者 浙里办小程序内 进行 jssdk 打开新窗口
    if (window.ZWJSBridge) {
      window.ZWJSBridge.openLink({
        url: url
      })
      return
    }

    // 支付宝内 打开新窗口
    if (_ua.alipayh5) {
      window.ap.pushWindow({
        url: url
      })
    }
  }

  // 浏览器跳转
  window.location.href = url
}

/**
 * 数组转关系对象
 * 同时可去重功能
 */
function karrayGet (arr, key, valueKey) {
  const result = {}

  for (const i in arr) {
    result[arr[i][key]] =
      !valueKey || valueKey === true ? arr[i] : arr[i][valueKey]
  }

  return result
}

/**
 * 图片base64压缩
 * 支持input 或者传入base64
 * 等比缩放，不裁剪不变形
 */
function kCompass (opt) {
  const width = opt.width ? opt.width : 800
  const height = opt.height ? opt.height : 800
  const quality = opt.quality ? opt.quality : 0.8

  const result = { code: 200, msg: '', result: {} }

  return new Promise((resolve, reject) => {
    // base64模式
    if (opt.base64) {
      const img = new Image()

      img.onload = function () {
        result.result = kimageCompass(img, { width: width, height: height, quality: quality })
        resolve(result)
      }

      img.src = opt.base64
      return false
    }

    // 输入文件模式
    if (opt.fileinput) {
      if (!opt.fileinput) {
        result.code = 400
        result.msg = '文件不存在'

        reject(result)
        return false
      }

      // 检测文件格式
      if (opt.acceptType && !opt.acceptType.test(opt.fileinput.name)) {
        result.code = 400
        result.msg = '图片格式不支持'

        reject(result)
        return false
      }

      kfilereader(opt.fileinput, { callbackType: 'image' })
        .then((imgdata) => {
          result.result = kimageCompass(
            imgdata,
            { width: width, height: height, quality: quality }
          )

          resolve(result)
        })
    }
  })
}

/**
 * 图压缩 base64图片数据
 */
function kimageCompass (img, opt) {
  opt = opt || {}
  const canvas = document.createElement('canvas')

  if (img.width > opt.width || img.height > opt.height) {
    if (img.width >= img.height) {
      img.height *= opt.width / img.width
      img.width = opt.width
    } else {
      img.width *= opt.height / img.height
      img.height = opt.height
    }
  }

  canvas.width = img.width
  canvas.height = img.height

  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, img.width, img.height)

  ctx.drawImage(img, 0, 0, img.width, img.height)

  return canvas.toDataURL(opt.filetype ? opt.filetype : 'image/jpeg', opt.quality ? opt.quality : 0.8)
}

/**
 * 读取文件 input file 数据
 */
function kfilereader (file, opt) {
  opt = opt || {}
  const filereader = new FileReader()

  return new Promise((resolve, reject) => {
    filereader.onload = function (evt) {
      if (opt.callbackType === 'image') {
        const img = new Image()

        img.onload = function () {
          resolve(img)
        }

        img.src = evt.target.result
        return false
      }

      resolve(evt.target.result)
    }

    filereader.readAsDataURL(file)
  })
}

/**
 * 事件绑定移除 处理
 */
const eventHistory = {}
function kbindEvent (aim, eventName, callback) {
  const eventId = new Date().getTime()
  const fun = function () {
    callback()
  }

  eventHistory[eventId] = { fun: fun, aim: aim, eventName: eventName }

  aim.addEventListener(eventName, fun, false)

  return eventId
}

function kunbindEvent (eventid) {
  const eventData = eventHistory[eventid]

  eventData.aim.removeEventListener(eventData.eventName, eventData.fun, false)

  delete eventHistory[eventid]
}

/**
 * 数据脱敏显示
 * str 脱敏字符串
 * start 开始位置留字符数量
 * end 结束位置留字符数量
 * fixflag 脱敏显示字符
 */
function StringTakeoff (str, start, end, fixflag = '*') {
  const fixStr = []

  const endPoint = str.length - end

  for (let i = 0; i < str.length; i++) {
    if (i < start || (i >= endPoint && str.length > 2)) {
      fixStr.push(str[i])
    } else {
      fixStr.push(fixflag)
    }
  }

  return fixStr.join('')
}

/**
 * 解析url 为对象
 */
function kgetUrlinfo (hash) {
  const list = hash.split('#')

  const r = {}
  let arr = list[0].split('?')

  if (arr.length > 1) {
    arr = arr[1].split('&')
  } else {
    arr = []
  }

  for (let i = 0; i < arr.length; i++) {
    const s = arr[i].split('=')

    if (s.length > 0 && s[0] !== '') {
      if (s.length === 1) {
        s[1] = ''
      }

      r[s[0]] = decodeURIComponent(s[1])
    }
  }

  if (list.length > 1) {
    r.URLHASH = kgetUrlinfo(list[1])
  }

  return r
}

/* 传入对象，进行url拼接处理 */
function KhttpBuildQuery (list) {
  const str = '?'

  const params = []

  for (const i in list) {
    params.push(i + '=' + encodeURIComponent(list[i]))
  }

  return str + params.join('&')
}

/**
 * 加载引入js 文件
 */
const scriptHistory = {}
function loadScript (srcUrl) {
  return new Promise((resolve, reject) => {
    if (scriptHistory[srcUrl]) {
      resolve()
      return
    }

    const script = document.createElement('script')

    script.onload = () => {
      resolve()
    }

    script.onerror = () => {
      reject(new Error('script error'))
    }

    scriptHistory[srcUrl] = true
    script.src = srcUrl
    document.body.appendChild(script)
  })
}

/**
 * 获取当前浏览器环境
 */
function getUseragent () {
  const userAgent = window.navigator.userAgent.toLowerCase()

  const userFrom = {
    // 支付宝
    alipay: userAgent.indexOf('alipay') > -1,

    // 支付宝app内h5
    alipayh5: userAgent.indexOf('alipay') > -1 && userAgent.indexOf('miniprogram') === -1,

    // 支付宝小程序
    alipayminiprogram:
      userAgent.indexOf('miniprogram') > -1 && userAgent.indexOf('alipay') > -1,

    // 微信
    wx: userAgent.indexOf('micromessenger') > -1,

    // 微信小程序
    wxminiprogram: userAgent.indexOf('miniprogram') > -1,

    // 浙里办App
    zlb: userAgent.indexOf('dtdreamweb') > -1,

    // 浙里办支付宝小程序
    zlbminiprogram:
      userAgent.indexOf('miniprogram') > -1 && userAgent.indexOf('alipay') > -1,

    // 是否为手机
    isMobile: /android|iphone|symbianos|windows phone|ipad|ipod/.test(userAgent),

    // 是否为安卓
    isAndroid: userAgent.indexOf('android') > -1 || userAgent.indexOf('adr') > -1,

    // 是否为ios
    isIOS: /\(i[^;]+;( U;)? cpu.+mac os x/.test(userAgent)
  }

  return userFrom
}

/**
 * 全局加载动画
 */
function showLoading (show) {
  if (!$vue) {
    return
  }

  $vue.$store.commit('requestLoading', show)
}

/**
 * 距离信息处理
 * unit 默认en英文 cn中文
 */
function distanceFormat (distance, unit = 'en') {
  let distanceStr = ''

  const unitList = {
    cn: {
      m: '米',
      km: '千米'
    },
    en: {
      m: 'm',
      km: 'km'
    }
  }

  if (distance < 1000) {
    distanceStr += distance + unitList[unit].m
  } else {
    distanceStr += parseFloat((distance / 1000).toFixed(2)) + unitList[unit].km
  }

  return distanceStr
}

/**
 * @param {Object} dataurl
 * @param {Object} filename
 * 将base64转换为文件
 */
function dataURLtoFile (dataurl, filename) {
  const arr = dataurl.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1]); let n = bstr.length; const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }

  return new File([u8arr], filename + '.' + mime.split('/')[1], { type: mime })
}

/**
 * @param {Object} callback
 * 加载城市数据json
 */
function loadCityData (callback) {
  axios.get('data/citydata.json').then((data) => {
    cityData = data.data
    callback()
  }).catch(() => {
    loadCityData(callback)
  })
}

/**
 * 通过城市ID获取城市数据
 */
function getCityByCode (callback, citycode) {
  const callbackRun = () => {
    if (!citycode) {
      callback(cityData)
      return
    }

    for (let i = 0; i < cityData.length; i++) {
      if (cityData[i].area_code === citycode) {
        callback(cityData[i])
        return
      }

      const city = cityData[i].children
      for (let j = 0; j < city.length; j++) {
        if (city[j].area_code === citycode) {
          callback(city[j])
          return
        }

        const district = city[j].children
        for (let k = 0; k < district.length; k++) {
          if (district[k].area_code === citycode) {
            callback(district[j])
            return
          }
        }
      }
    }
  }

  if (!cityData) {
    loadCityData(() => {
      callbackRun()
    })
  } else {
    callbackRun()
  }
}

/**
 * 获取当前服务端控制的省份数据
 * 并且去除四级数据
 */
let provinceCityData = false
function getProvinceData () {
  return new Promise((resolve, reject) => {
    if (!provinceCityData) {
      getCityByCode((data) => {
        // 省份配置信息 如果服务端没有则从本地配置取
        provinceCityData = JSON.parse(JSON.stringify(data))

        // 去除街道级别
        provinceCityData.children.map((item) => {
          item.children.unshift({
            area_code: '',
            area_name: '请选择',
            parent_code: 0,
            level: 0
          })

          item.children.map((sunItem) => {
            delete sunItem.children
          })
        })

        // console.log('省份数据', provinceCityData)
        resolve(provinceCityData)
      }, $vue.$store.state.zlbConfig.cityCode || this.$Config.cityCode)

      return
    }

    // console.log('省份数据', provinceCityData)
    resolve(provinceCityData)
  })
}

/**
 * @param {Object} json
 * json 字符串转换 防止报错
 */
function kJsonParse (json) {
  try {
    return JSON.parse(json)
  } catch (e) {
    return false
  }
}

/**
 * 折扣数字转中文
 */
function kToChineseDiscount (discount) {
  if (discount < 1) {
    discount = discount * 100
  } else if (discount < 10) {
    discount = discount * 10
  } else if (discount === 10) {
    // 无折扣
    return false
  }

  return (discount || '0') + '折'
}

/**
 * 打开地图导航
 * @param name 地点名称
 * @param lng 经度
 * @param lat 维度
 */
function openMapNav (name = '', lng = '', lat = '') {
  const _ua = $vue.$store.state.browerEnvStatus
  if (_ua.zlb) {
    window.ZWJSBridge.openLink({
      url: `zwfw://openThirdMap?longitude=${lng}&latitude=${lat}&locationName=${name}`
    })
  }
}

/**
 * 时间定时器 自动清理
 */
let IntervalList = {}
function setTimerInterval (id) {
  IntervalList[id] = true
}

/**
 * 自动清理函数
 */
function clearIntervalAutoPageChange () {
  for (const i in IntervalList) {
    clearInterval(i)
  }

  IntervalList = {}
}

/**
 * 复制文本
 * @param text 被复制的文本
 */
function copyText (text = '') {
  if (text) {
    const id = 'input-' + (new Date()).getTime()
    const target = document.createElement('input')
    target.id = id
    target.style.opacity = '0'
    document.body.appendChild(target)
    const input = document.getElementById(id)
    input.value = text
    input.select()
    document.execCommand('copy')
    target.parentElement.removeChild(target)
    Toast('复制成功')
  }
}

/**
 * 字符串创建 日期对象
 * 处理IOS内 - 不兼容
 */
function kstrToDate (str) {
  const _ua = $vue.$store.state.browerEnvStatus

  if (_ua.isIOS) {
    str = str.replace(/-/g, '/')
  }

  return new Date(str)
}

/**
 * 子页面 keepalive 处理
 * 给自己传参 保留keepalive
 */
function keepAliveMark () {
  // 一些keepalive的页面重置处理
  $vue.$store.commit(
    'sendMultyPageParam',
    [
      { path: $vue.$route.path, data: { action: 'keepAlive' } }
    ]
  )
}

/**
 * @param {Object} str
 * 去除首尾空格
 */
function strTrim (str) {
  return str.replace(/(^\s*)|(\s*$)/g, '')
}

/**
 * @param low Number
 * @param top Number
 * 显示薪资范围文本
 */
function showSalaryLabel (low, top) {
  return (low >= 10 ? (low / 10) + '万' : low + '千') + (top >= 10 ? (top === 99999 ? '以上' : '-' + (top / 10) + '万') : '-' + top + '千')
}

export default {
  $vue: $vue,
  setVue: setVue,
  getVue: getVue,
  getUseragent: getUseragent,
  loadScript: loadScript,
  KhttpBuildQuery: KhttpBuildQuery,
  kgetUrlinfo: kgetUrlinfo,
  StringTakeoff: StringTakeoff,
  karrayGet: karrayGet,
  kbindEvent: kbindEvent,
  kunbindEvent: kunbindEvent,
  kCompass: kCompass,
  showLoading: showLoading,
  urlJump: urlJump,
  distanceFormat: distanceFormat,
  getCityByCode: getCityByCode,
  getProvinceData: getProvinceData,
  dataURLtoFile: dataURLtoFile,
  kJsonParse: kJsonParse,
  kToChineseDiscount: kToChineseDiscount,
  openMapNav: openMapNav,
  clearIntervalAutoPageChange: clearIntervalAutoPageChange,
  setTimerInterval: setTimerInterval,
  copyText: copyText,
  kstrToDate: kstrToDate,
  keepAliveMark: keepAliveMark,
  strTrim: strTrim,
  showSalaryLabel: showSalaryLabel
}
