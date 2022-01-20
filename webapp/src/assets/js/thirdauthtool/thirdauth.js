import Common from '../common'
import Config from '../config'

// 浏览器环境
const browerEnvStatus = Common.getUseragent()

// 当前环境
const browerEnv = []

// 用来获取配置数据的 vue实例对象
let $vue

/**
 * 设置标题
 */
function setTitle (title) {
  window.document.title = title

  if (browerEnvStatus.zlbminiprogram || browerEnvStatus.zlb) {
    setTimeout(() => {
      if (window.ZWJSBridge) {
        // 通过sdk修改标题
        window.ZWJSBridge.setTitle({
          title: title
        })
      }
    }, 500)
  }
}

/**
 * 授权登录处理
 */
async function authLogin (from) {
  console.log(from ? '授权登录触发' + from : '授权登录触发')
  ZLBauthLoginJump()
}

/**
 * 跳转浙里办登录
 */
function ZLBauthLoginJump () {
  // https://puser.zjzwfw.gov.cn/sso/mobile.do?action=oauth&scope=1&servicecode=zjlbm&goto=https://mapi.zjzwfw.gov.cn/web/mgop/gov-open/zj/2001820920/1.0.0.1/index.html

  // 调试版本跳转地址
  let debugUrl = ''
  const rawUrl = window.location.href.split('#')[0].split('?')[0]
  const GET = $vue.$store.state.GET

  // 加入登录跳转页面
  if ($vue.$route.fullPath !== '/') {
    $vue.$store.commit('updateLocalData', {
      loginRedirectUrl: $vue.$route.fullPath
    })
  }

  // 测试版本
  if (GET.debug) {
    debugUrl = rawUrl + '?debug=true'
  }

  // 服务接入码
  const servicecode = $vue.$store.state.zlbConfig.servicecode || 'zjlbm'
  let url = ''

  // 浙里办支付宝小程序
  if (browerEnvStatus.zlbminiprogram || browerEnvStatus.alipayh5) {
    url = 'https://puser.zjzwfw.gov.cn/sso/alipay.do?action=ssoLogin&servicecode=' + servicecode + (GET.debug ? '&goto=' + encodeURIComponent(debugUrl) : '')

    console.log(url)

    // 清空用户缓存数据
    $vue.$store.commit('clearLocalData')

    // 浙里办内授权 关闭自身 打开新窗口
    if (browerEnvStatus.zlb) {
      openWin(url)

      window.ZWJSBridge.close().then((result) => {
        console.log(result)
      }).catch((error) => {
        console.log(error)
      })
    } else {
      window.location.href = url
    }
    return
  }

  // 浙里办 浙里办App 授权登录
  url = 'https://puser.zjzwfw.gov.cn/sso/mobile.do?action=oauth&scope=1&servicecode=' + servicecode + (GET.debug ? '&goto=' + encodeURIComponent(debugUrl) : '')

  console.log(url)

  // 清空用户缓存数据
  $vue.$store.commit('clearLocalData')

  // 浙里办内授权 关闭自身 打开新窗口
  if (browerEnvStatus.zlb) {
    openWin(url)

    window.ZWJSBridge.close().then((result) => {
      console.log(result)
    }).catch((error) => {
      console.log(error)
    })
  } else {
    window.location.href = url
  }
}

/**
 * 扫一扫
 */
function Scan (callback) {
  // 浙里办 App 浙里办支付宝 小程序
  if (
    browerEnvStatus.zlb ||
    browerEnvStatus.zlbminiprogram
  ) {
    window.ZWJSBridge.scan({
      type: 'qrCode'
    }).then(data => {
      // data =>{"text" : "扫描到的内容"}
      callback(data.text)
    })
  }

  if (browerEnvStatus.alipayh5) {
    window.ap.scan({}, function (res) {
      if (res.code) {
        callback(res.code)
      }
    })
  }
}

/**
 * 打开新窗口页面
 */
function openWin (url) {
  // 浙里办APP 小程序
  if (browerEnvStatus.zlb || browerEnvStatus.zlbminiprogram) {
    window.ZWJSBridge.openLink({
      url: url
    })
    return
  }

  // 支付宝H5
  if (browerEnvStatus.alipayh5) {
    window.ap.pushWindow({
      url: url
    })
    return
  }

  window.location.href = url
}

/**
 * 初始化浙里办SDK
 */
function initZlbJSSdk () {
  if (window.ZWJSBridge && window.ZWJSBridge.onReady) {
    window.ZWJSBridge.onReady(() => {
      console.log('初始化完成后，执行bridge方法')
    })

    return
  }

  setTimeout(initZlbJSSdk, 500)
}

/**
 * 初始化SDK 加载
 */
function initSDK (_vue) {
  console.log(browerEnvStatus)

  // 设置获取数据的vue实例
  $vue = _vue

  // 当前浏览器环境环境
  let _envFlag = Config.userAgent.zlb

  // 客户端类型列表
  // userAgent: {
  //   alipay: '支付宝',
  //   alipayminiprogrm: '支付宝小程序',
  //   wx: '微信',
  //   wxminiprogram: '微信小程序',
  //   zlb: '浙里办App',
  //   zlbminiprogram: '浙里办支付宝小程序'
  // }

  // 浙里办App
  if (browerEnvStatus.zlb || browerEnvStatus.zlbminiprogram) {
    browerEnv.push(Config.userAgent.zlb)
    _envFlag = Config.userAgent.zlb

    // 加载 dd依赖 后加载zlbJSBridge
    Common.loadScript(Config.zlbJSBridgedd).then(() => {
      Common.loadScript(Config.zlbJSBridge).then(() => {
        // console.log(ZWJSBridge)
        initZlbJSSdk()
      })
    })
  }

  // 浙里办支付宝小程序
  if (browerEnvStatus.zlbminiprogram) {
    browerEnv.push(Config.userAgent.zlbminiprogram)
    _envFlag = Config.userAgent.zlbminiprogram
  }

  // 支付宝小程序 webview jssdk
  if (browerEnvStatus.alipayminiprogram) {
    Common.loadScript(Config.alipayJSSdk).then(() => {})
  }

  // 支付宝H5内加载 支付宝h5 jssdk
  if (browerEnvStatus.alipayh5) {
    // h5 内环境设置为浙里办小程序 使用统一线下收单支付
    _envFlag = Config.userAgent.zlbminiprogram

    Common.loadScript(Config.alipayh5jssdk).then(() => {})
  }

  // 共享环境数据到vuex
  _vue.$store.commit('updateValue', { browerEnv: _envFlag })
  _vue.$store.commit('updateValue', { browerEnvStatus: browerEnvStatus })
}

export default {
  browerEnvStatus: browerEnvStatus,
  initSDK: initSDK,
  Scan: Scan,
  setTitle: setTitle,
  authLogin: authLogin,
  openWin: openWin,
  ZLBauthLoginJump: ZLBauthLoginJump
}
