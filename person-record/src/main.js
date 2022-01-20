import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'
import router from './router'
import ElementPlus,{ ElMessage,ElMessageBox } from 'element-plus'
import qs from "qs";

import 'element-plus/lib/theme-chalk/index.css'
const app = createApp(App)

app.config.globalProperties.$axios = axios
app.config.globalProperties.$qs = qs

axios.defaults.baseURL = 'http://10.111.1.23:3000'

// // 请求前的处理
// axios.interceptors.request.use(config=>{
//     if(config.method=='post'){
//         config.data = {
//             ...config.data,
//             "paramsName": params,
//         }
//     }else if(config.method=='get'){
//         config.params = {
//             "paramsName":params,
//             ...config.params
//         }
//     }
//     return config;
// },err=>{
//     return Promise.reject(err);
// });
//
// // 请求后的处理
// axios.interceptors.response.use(
//     (response) => {
//         /**
//          * 根据你的项目实际情况来对 config 做处理
//          * 这里对 config 不做任何处理，直接返回
//          */
//         return response
//     },
//     (error) => {
//         if (error.response && error.response.data) {
//             const code = error.response.status
//             const msg = error.response.data.message
//             $elMsg.error(`Code: ${code}, Message: ${msg}`)
//             console.error(`[axios Error]`, error.response)
//         } else {
//             ElMessage.error(`${error}`)
//         }
//         return Promise.reject(error)
//     }
// )

app.config.globalProperties.$elMsg = ElMessage;
app.config.globalProperties.$elMsgBox = ElMessageBox;
app.use(ElementPlus).use(router).mount('#app2')
