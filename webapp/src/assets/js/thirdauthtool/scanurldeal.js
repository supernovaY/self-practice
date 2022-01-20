import Validator from '../Validator.js'
import Common from '../common.js'

// 特殊域名处理
const Domains = [
  // 本服务域名 即 内部地址
  window.location.hostname

  // 支付宝协议地址
  // 'alipays://',

  // 浙里办政务App
  // 'zwfw://'
]

/**
 * 校验是否为域名地址
 * @param {Object} url
 */
function isUrl (url) {
  return Validator.Url.test(url)
}

/**
 * 扫一扫 结果处理
 */
function scan (qrcodecentent) {
  const result = {
    datatype: 'text',
    jumptype: '',
    urlparam: {}
  }

  if (isUrl(qrcodecentent)) {
    return {
      datatype: 'url',
      jumptype: 'self',
      rawdata: qrcodecentent,
      urlparam: Common.kgetUrlinfo(qrcodecentent)
    }
  } else {

  }

  return result
}

export default scan
