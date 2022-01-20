import { mgop } from '@aligov/jssdk-mgop'
import Config from './config.js'
import Common from '../common.js'
import thirdauth from '../thirdauthtool/thirdauth.js'

// 获取url中的参数
function parseUrl (url) {
  return Common.kgetUrlinfo(url)
}

/**
 * @param {Object} opt
 * 浙里办请求接入
 */
function request (opt) {
  let url = ''

  if (opt.url.indexOf('?') === -1) {
    url = Config.zlbapi + opt.url.replace(/\//g, '')
  } else {
    url = Config.zlbapi + opt.url.split('?')[0].replace(/\//g, '')
    // console.log('请求参数', opt.url.split('?')[0].replace(/\//g, ''))
  }

  console.log(url)
  let data

  if (opt.data) {
    data = opt.data
  } else {
    data = parseUrl(opt.url)
  }

  opt.method = opt.method ? opt.method.toUpperCase() : 'GET'

  const Cookie = Common.getVue().$store.state.localData.cookie
  data.UserCookie = 'JSESSIONID=' + Cookie

  console.log(data)
  // console.log(Cookie)

  return new Promise((resolve, reject) => {
    mgop({
      api: url,
      type: opt.method,
      data: data,
      host: Config.host,
      timeout: Config.timeout,
      dataType: 'JSON',
      appKey: Config.appKey, // 必须
      onSuccess: data => {
        if (data.data.code !== 2000) {
          // 未登录 跳转授权登录
          if (data.data.code === 5104) {
            // Common.getVue().$toast('登录超时')

            setTimeout(() => {
              thirdauth.authLogin()
            }, 1000)
            return
          }
        }

        resolve(data.data)
      },
      onFail: err => {
        reject(err)
      }
    })
  })
}

export default request
