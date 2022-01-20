import axios from 'axios'
import thirdauth from '../thirdauthtool/thirdauth.js'
import Common from '../common.js'
import Config from './config.js'

// create an axios instance
const service = axios.create({
  baseURL: Config.api,
  headers: {
    Accept: '*/*'
  },
  timeout: Config.timeout,
  withCredentials: true
})

service.interceptors.request.use(
  config => {
    // if (store.getters.token) {
    //   // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
    //   // config.headers['X-Token'] = getToken()
    // }

    // const state = Common.getVue().$store.state

    // // 登录验证
    // config.headers['X-Ticket'] = state.ticket ? state.ticket : ''

    // // 平台来源
    // config.headers['X-Platform'] = process.env.NODE_ENV === 'development'
    //   ? 'zlb' : state.browerEnv

    // console.log(config)

    config.url += Config.fileType
    // config.method = Config.method
    return config
  },
  error => {
    Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    if (response.status === 200) {
      // 登录超时
      if (response.data.code === 5104) {
        thirdauth.authLogin('接口请求登录超时触发登录')
        return
      }
      // if (response.data.code !== 2000) {
      // 未登录 跳转授权登录

      // Common.getVue().$toast('请求发生错误，错误信息' + response.data.message)
      // }

      return Promise.resolve(response.data)
    } else {
      Common.getVue().$toast('网络错误，请求失败')
      Common.showLoading(false)
      return Promise.reject(response)
    }
  },
  error => {
    Common.getVue().$toast('网络错误，请求失败')
    Common.showLoading(false)
    return Promise.reject(error)
  }
)

export default service
