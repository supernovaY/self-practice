// const path = require('path')

// function resolve (dir) {
//   path.join(__dirname, dir)
// }

module.exports = {
  // 使用相对目录 任意目录可运行
  publicPath: './',
  // outputDir: process.env.NODE_ENV === 'production' ? 'build' : 'test',

  // 是否生成.map文件
  productionSourceMap: false,

  devServer: {
    proxy: {
      '/serviceman-webapp/': {
        // 要访问的跨域的域名
        // target: 'http://10.80.240.29:9180', // 罗 下
        // target: 'http://10.80.240.10:9180', // 楼
        // target: 'http://10.80.240.35:9180', // 李旦
        // target: 'http://10.80.240.33:9180', // 金阳善
        // target: 'http://10.80.18.91:9180', // 测试服
        // target: 'https://yjs.tyjrswt.zj.gov.cn:8086',
        ws: false, // 是否启用websockets
        secure: false, // 使用的是http协议则设置为false，https协议则设置为true
        // 开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样客户端端和服务端进行数据的交互就不会有跨域问题
        changOrigin: true
      },

      // 浙里办正式服服务器直连
      '/serviceman-webapp1/': {
        target: 'https://yjs.tyjrswt.zj.gov.cn:8086',
        ws: false,
        secure: false,
        changOrigin: true
      },

      // 浙里办服务请求转发
      '/h5/mgop': {
        target: 'https://mapi.zjzwfw.gov.cn',
        ws: false,
        secure: false,
        changOrigin: true
      }
    }
  }

  // chainWebpack: (config) => {
  //   config.resolve.alias
  //     .set('@', resolve('./src'))
  // },

  // lintOnSave: false // 取消变量声明未使用 报错/
}
