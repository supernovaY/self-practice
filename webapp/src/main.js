import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import Config from './assets/js/config'
import Common from './assets/js/common'
import 'amfe-flexible/index.js'
import '@/assets/css/font-awesome.min.css'
import Vant from 'vant'
import 'vant/lib/index.css'
import API from '@/assets/js/api.js'

import '@/assets/css/app.scss'

import VConsole from 'vconsole'

Vue.prototype.$Config = Config
Vue.prototype.$Common = Common
Vue.prototype.$Api = API

Vue.config.productionTip = false

// 注册vant框架
Vue.use(Vant)
/* eslint-disable no-new */
new VConsole()

// alert(process.env.NODE_ENV)

// 自动注册全局组件
const componentsContext = require.context('./components/common', true, /.vue$/)
componentsContext.keys().forEach(component => {
  // 获取文件中的 default 模块
  const componentConfig = componentsContext(component).default
  Vue.component(componentConfig.name, componentConfig)
})

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
