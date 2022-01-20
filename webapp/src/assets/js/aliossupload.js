// import axios from 'axios'
import $api from './api.js'
import Common from './common.js'

// 上传令牌配置
let token = false

// 获取上传令牌数据
async function getAliossToken (callback) {
  const tokenData = await $api.common.getUploadTicket()

  if (tokenData.code === 2000) {
    console.log(token)
    token = tokenData.result

    token.timestamp = new Date().getTime()

    callback()
    return
  }

  Common.getVue().$toast('上传令牌获取失败')
}

// 检查令牌是否可用有效
function checkUploadToken (callback) {
  if (!token || token.timestamp <= new Date().getTime() - 600 * 1000) {
    getAliossToken(callback)
    return
  }

  callback()
}

// 上传base64数据
function uploadBase64 (base64data) {
  const file = Common.dataURLtoFile(base64data, 'uploadimg')
  const formdata = new FormData()

  formdata.append('file', file)

  return upload(formdata)
}

// 上传文件
function uploadFile () {
  return upload({})
}

// 执行上传
function upload (formdataObject) {
  return new Promise((resolve, reject) => {
    checkUploadToken()
  })
}

export default {
  uploadBase64: uploadBase64,
  uploadFile: uploadFile
}
