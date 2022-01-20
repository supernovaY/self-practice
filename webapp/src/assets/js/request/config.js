import SystemConfig from '../config.js'

let Config

// 开发
if (process.env.NODE_ENV === 'development') {
  // 接口地址配置
  Config = {
    api: '/serviceman-webapp/', // http://10.80.101.41:8180
    fileType: '',
    timeout: 60000,
    method: 'post',
    // 浙里办配置
    appKey: SystemConfig.ZLBConfig.appKey,
    host: SystemConfig.ZLBConfig.host,
    zlbapi: SystemConfig.ZLBConfig.api
  }
}

// 测试服打包
if (process.env.NODE_ENV === 'servertest') {
  // 接口地址配置
  Config = {
    api: '/serviceman-webapp/', // http://10.80.101.41:8180
    fileType: '',
    timeout: 60000,
    method: 'post',
    // 浙里办配置
    appKey: SystemConfig.ZLBConfig.appKey,
    host: SystemConfig.ZLBConfig.host,
    zlbapi: SystemConfig.ZLBConfig.api
  }
}

if (process.env.NODE_ENV === 'production') {
  Config = {
    api: '/serviceman-webapp/',
    fileType: '',
    timeout: 60000,
    method: 'post',
    // 浙里办配置
    appKey: SystemConfig.ZLBConfig.appKey,
    host: SystemConfig.ZLBConfig.host,
    zlbapi: SystemConfig.ZLBConfig.api
  }
}

export default Config
