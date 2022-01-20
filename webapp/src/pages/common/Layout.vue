<template>
  <div>
    <div v-if="pagestatus.init">
      <router-view></router-view>

      <!-- 全局加载动画 -->
      <Common-RequestLoading v-show="requestLoading" />

      <!-- 码上咨询 -->
      <!-- <Common-ContactUs /> -->
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import thirdauth from '@/assets/js/thirdauthtool/thirdauth'
import ArmyInfoDeal from '@/assets/js/armyinfodeal/armyinfodeal.js'
import dataCounter from '@/assets/js/datacounter/counter.js'

export default {
  data () {
    return {
      pagestatus: {
        init: false
      },

      // 登录检测
      LoginCheck: ''
    }
  },

  computed: mapState({
    // 链接地址解析参数
    GET: 'GET',

    // 是否显示全局加载动画
    requestLoading: 'requestLoading',

    // 用户信息
    Userinfo (state) {
      return state.localData.Userinfo
    },

    // 用户信息
    armyInfo (state) {
      return state.localData.armyInfo
    },

    // 浏览器环境参数
    browerEnvStatus: 'browerEnvStatus',

    // 当前所在环境
    browerEnv: 'browerEnv',

    // 上次使用的ticket
    lastTicket (state) {
      return state.sessionData.lastTicket
    },

    // 页面跳转地址
    JumpUrl (state) {
      return state.sessionData.JumpUrl
    }
  }),

  watch: {
    '$route.meta.title' (newV) {
      // console.log('监听路由变化修改标题', this)
      if (newV) {
        this.F_setPageTitle(newV)
      }
    },

    // 监听地址变化 触发全局事件的函数
    '$route.fullPath' () {
      // console.log('触发全局地址修改')
      this.$Common.clearIntervalAutoPageChange()

      // dataCounter.visitCounter()
    },

    // 监听初始化
    'pagestatus.init' (newV) {
      if (newV) {
        // 首页专用统计
        dataCounter.requestCounter(dataCounter.getRule('index'))
      }
    }
  },

  beforeCreate () {
    // 初始化common内部对vue 的访问
    this.$Common.setVue(this)

    // 初始化第三方 支付宝微信浙里办等插件
    thirdauth.initSDK(this)
  },

  created () {},

  async mounted () {
    console.log('路由对象', this.$route)
    this.F_setPageTitle(this.$route.meta.title)

    console.log('当前环境', this.browerEnvStatus)

    // 加载系统配置
    this.F_initWebConfig()
  },

  methods: {
    // 跳转地址处理
    F_jumpDeal () {
      if (!this.browerEnvStatus.zlb) {
        console.log('清理定时器' + this.LoginCheck)
        clearInterval(this.LoginCheck)
      }

      // 跳转地址
      if (this.GET.sp) {
        window.location.href = this.GET.sp
        return
      }

      // 路由跳转地址
      const loginRedirectUrl = this.$store.getters.loginRedirectUrl
      if (loginRedirectUrl) {
        // console.log(loginRedirectUrl)
        const merchantUrl = '/army/pay/payinputmeny'
        // 如果扫商家码进入 如果没有老兵信息 则不跳转 直接到首页
        if (loginRedirectUrl.indexOf(merchantUrl) !== -1 && !this.armyInfo.id) {

        } else {
          this.$router.push(loginRedirectUrl)
        }
      }

      // 传参页面action处理
      if (this.GET.action) {
        switch (this.GET.action) {
          case 'jumpurl':
            if (this.GET.url && this.JumpUrl !== this.GET.url + this.GET.t) {
              this.$router.push(this.GET.url)
            }

            // 记录后不再跳转
            this.$store.commit('updateSessionData', {
              JumpUrl: this.GET.url + this.GET.t
            })
            break
        }
      }
    },

    // 跳转授权
    F_jumpToAuthLogin (from) {
      // alert(from)
      thirdauth.authLogin('layout登录' + from)
    },

    // 登录处理
    async F_loginDeal () {
      console.log('链接参数对象', this.GET)

      // 如果链接中带有 ticket数据 则使用链接的ticket
      const localTicket = this.GET.ticket

      console.log('ticket', localTicket)

      // 用户返回 造成tiket重复触发登录
      if (this.lastTicket === localTicket) {
        console.log('进入重复ticket处理')

        // 老兵信息初始化
        ArmyInfoDeal(() => {
          this.F_jumpDeal()
          this.pagestatus.init = true
        })
        return
      }

      this.$Common.showLoading(true)

      const ticket = localTicket

      console.log('重新登录 触发用户数据清理')

      // console.log('登录令牌', ticket)
      const logininfo = await this.$Api.common.login({
        authorityType: this.browerEnv,
        ticket: ticket
      })

      this.$Common.showLoading(false)

      console.log('登录返回数据', logininfo)

      if (logininfo.code !== 2000) {
        this.F_jumpToAuthLogin(1)
        return
      }

      // 更新cookie
      this.$store.commit('updateLocalData', {
        Userinfo: logininfo.result,
        cookie: logininfo.result.token,
        ticket: logininfo.result.authority
      })

      // 更新上次ticket
      this.$store.commit('updateSessionData', {
        // 记录上次ticket
        lastTicket: this.GET.ticket
      })

      // 老兵信息初始化
      ArmyInfoDeal(() => {
        this.F_jumpDeal()
        this.pagestatus.init = true
      })
    },

    // 设置页面标题
    F_setPageTitle (title) {
      thirdauth.setTitle(title)
    },

    // 初始化 全站配置参数
    async F_initWebConfig () {
      const data = await this.$Api.common.category(
        this.$Config.enumConfig.sytemConfig
      )

      if (data.code === 2000) {
        const systemConfig = {}

        data.result.map((item) => {
          if (item.label !== '请选择') {
            systemConfig[item.label] = item.value
          }
        })

        console.log('网站配置', systemConfig)

        this.$store.commit('updateValue', { zlbConfig: systemConfig })
      }

      console.log('当前环境值', this.browerEnv)

      // 登录 ticket 登录处理
      if (this.GET.ticket) {
        if (!this.browerEnvStatus.zlb) {
          this.F_TimeChecker()
        }
        this.F_loginDeal()
        return
      }

      // 老兵信息初始化
      if (!this.browerEnvStatus.zlb) {
        this.F_TimeChecker()
      }
      ArmyInfoDeal(() => {
        this.F_jumpDeal()
        this.pagestatus.init = true
      })
    },

    // 跳转导致页面空白 返回页面依然空白
    F_TimeChecker () {
      this.LoginCheck = setInterval(() => {
        console.log(this.LoginCheck)
        this.$store.commit('updateFromLocal')

        setTimeout(async () => {
          const data = await this.$Api.userinfo.getRealName()

          if (data.code === 2000) {
            this.F_jumpDeal()
            this.pagestatus.init = true
          }
        }, 100)
      }, 5000)
    }
  }
}
</script>
