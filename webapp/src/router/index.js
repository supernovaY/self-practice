import Vue from 'vue'
import Router from 'vue-router'
import Common from '@/assets/js/common.js'
import Config from '@/assets/js/config.js'

// 根据配置引入路由
const ArmyRouter = []
Config.apps.forEach(item => {
  const _router = require('@/router/modules/' + item)
  ArmyRouter.push(..._router.default)
})

// 获取原型对象上的push函数
const originalPush = Router.prototype.push
// 修改原型对象中的push方法
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

const Layout = () => import('@/pages/common/Layout')
const Page404 = () => import('@/pages/common/404')
const MapPositionSelect = () => import('@/pages/merchant/merchantuserinfo/MapPositionSelect')
const Test = () => import('@/pages/army/index/Test')
const MerchantLayout = () => import('@/pages/merchant/MerchantLayout')
const ServiceUserinfoEdit = () => import('@/pages/merchant/serviceuserinfo/ServiceUserinfoEditPage')
const ServiceUserinfoDetail = () => import('@/pages/merchant/serviceuserinfo/ServiceInfoDetail')
const ServiceUserinfo = () => import('@/pages/merchant/serviceuserinfo/ServiceUserinfo')
const SverviceScanResult = () => import('@/pages/merchant/servicescaner/ServiceScaner')
const ServiceEditSubAccount = () => import('@/pages/merchant/servicesubaccount/ServiceEditSubAccount')
const ServiceAddSubAccount = () => import('@/pages/merchant/servicesubaccount/ServiceAddSubAccount')
const ServiceSubAccount = () => import('@/pages/merchant/servicesubaccount/ServiceSubAccount')
const MerchantEditSubAccount = () => import('@/pages/merchant/merchantsubaccount/MerchantEditSubAccount')
const MerchantAddSubAccount = () => import('@/pages/merchant/merchantsubaccount/MerchantAddSubAccount')
const MerchantSubAccount = () => import('@/pages/merchant/merchantsubaccount/MerchantSubAccount')
const MerchantUserinfoEdit = () => import('@/pages/merchant/merchantuserinfo/MerchantUserinfoEditPage')
const MerchantInfoDetail = () => import('@/pages/merchant/merchantuserinfo/MerchantInfoDetail')
const MerchantUserinfo = () => import('@/pages/merchant/merchantuserinfo/MerchantUserinfo')
const MerchantCouponUseDetail = () => import('@/pages/merchant/merchantordersearch/MerchantCuponDetail')
const MerchantSearchCoupon = () => import('@/pages/merchant/merchantordersearch/MerchantCouponSearchPage')
const MerchantOrderDetail = () => import('@/pages/merchant/merchantordersearch/MerchantOrderDetail')
const MerchantPayNotify = () => import('@/pages/merchant/merchantpaynotify/MerchantPayNotify')
const MerchantSearchOrder = () => import('@/pages/merchant/merchantordersearch/MerchantOrderSearchPage')
const MerchantHome = () => import('@/pages/merchant/home/Home')
const MerchantQrcodeSave = () => import('@/pages/merchant/merchantsaveqrcode/SaveQrcode')

const ArmyServiceDetail = () => import('@/pages/army/service/ServiceDetail')
const ArmyMerchantDetail = () => import('@/pages/army/merchant/MerchantDetail')
const ArmyPayInputMoney = () => import('@/pages/army/pay/PayInputMoney')
const ArmyPayConfirm = () => import('@/pages/army/pay/PayConfirm')
const ArmyPayRecordsDetail = () => import('@/pages/army/ptreatmentrecords/PayRecordsDetail')
const ArmyPayRecordsSearch = () => import('@/pages/army/ptreatmentrecords/PayRecordsSearchPage')
const ArmyPayRecords = () => import('@/pages/army/ptreatmentrecords/PayRecordPage')
const ArmyServiceRecordsSearch = () => import('@/pages/army/ptreatmentrecords/ServiceRecordsSearchPage')
const ArmyServiceRecords = () => import('@/pages/army/ptreatmentrecords/ServiceRecordPage')
const ArmyCouponsUseDetail = () => import('@/pages/army/mycoupons/CouponUseDetail')
const ArmyMyCoupons = () => import('@/pages/army/mycoupons/MyCouponsPage')
const ArmyMyCouponsMessage = () => import('@/pages/army/mycoupons/CouponMessage')
const ArmySearchMerchant = () => import('@/pages/army/ptreatment/SearchMerchantPage')
const ArmySearchService = () => import('@/pages/army/ptreatment/SearchServicePage')
const ArmyPtreatmentIndex = () => import('@/pages/army/ptreatment/PtreatmentIndex')
const ArmyArticleReader = () => import('@/pages/army/articles/ArticleReader')
const ArmyArticleSearch = () => import('@/pages/army/articles/ArticleSearchPage')
const ArmyPolicyList = () => import('@/pages/army/articles/PolicyListPage')
const ArmyMessage = () => import('@/pages/army/message/MessagePage')
const ArmySuggestion = () => import('@/pages/army/suggestion/Suggestion')
const ArmySuggestionResponse = () => import('@/pages/army/suggestion/Response')
const ArmyInChargeApplyProgress = () => import('@/pages/army/incharge/ApplyProgress')
const ArmyInCharge = () => import('@/pages/army/incharge/InCharge')
const ArmyUserinfo = () => import('@/pages/army/userinfo/Userinfo')
const ArmyLayout = () => import('@/pages/army/ArmyLayout')
const ArmyIndex = () => import('@/pages/army/index/ArmyIndex')
const ArmyApplicabilityTrainingDetail = () => import('@/pages/army/index/ApplicabilityTrainingDetail')
const ArmyQrcode = () => import('@/pages/army/qrcode/ArmyQrcode')
const ArmyMarketApplication = () => import('@/pages/army/marketapplication/MarketApplication')
const ArmyAllApplication = () => import('@/pages/army/allapplication/ArmyAllApplication')

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      component: Layout,
      children: [
        {
          path: '/merchant',
          component: MerchantLayout,
          children: [
            {
              path: '/merchant',
              component: MerchantHome,
              meta: { title: '首页', keepAlive: true }
            },
            {
              path: '/merchant/qrcodesave',
              component: MerchantQrcodeSave,
              meta: { title: '保存商家码' }
            },
            {
              path: '/merchant/service/userinfo/edit',
              component: ServiceUserinfoEdit,
              meta: { title: '服务机构信息', keepAlive: true }
            },
            {
              path: '/merchant/service/userinfo/detail',
              component: ServiceUserinfoDetail,
              meta: { title: '服务机构信息' }
            },
            {
              path: '/merchant/service/userinfo',
              component: ServiceUserinfo,
              meta: { title: '服务机构信息' }
            },
            {
              path: '/merchant/service/scanresult',
              component: SverviceScanResult,
              meta: { title: '服务确认' }
            },
            {
              path: '/merchant/service/subaccount/edit/:id',
              component: ServiceEditSubAccount,
              meta: { title: '账号管理' }
            },
            {
              path: '/merchant/service/subaccount/add',
              component: ServiceAddSubAccount,
              meta: { title: '账号管理' }
            },
            {
              path: '/merchant/service/subaccount',
              component: ServiceSubAccount,
              meta: { title: '账号管理' }
            },
            {
              path: '/merchant/subaccount/edit/:id',
              component: MerchantEditSubAccount,
              meta: { title: '账号管理' }
            },
            {
              path: '/merchant/subaccount/add',
              component: MerchantAddSubAccount,
              meta: { title: '账号管理' }
            },
            {
              path: '/merchant/subaccount',
              component: MerchantSubAccount,
              meta: { title: '账号管理' }
            },
            {
              path: '/merchant/usedcoupondetail/:id',
              component: MerchantCouponUseDetail,
              meta: { title: '核销详情' }
            },
            {
              path: '/merchant/searchcoupon',
              component: MerchantSearchCoupon,
              meta: { title: '搜索核销优惠券', keepAlive: true }
            },
            {
              path: '/merchant/paynotify/:id',
              component: MerchantPayNotify,
              meta: { title: '收款' }
            },
            {
              path: '/merchant/orderdetail/:id',
              component: MerchantOrderDetail,
              meta: { title: '收款详情' }
            },
            {
              path: '/merchant/searchorder',
              component: MerchantSearchOrder,
              meta: { title: '搜索订单', keepAlive: true }
            },
            {
              path: '/merchant/message',
              component: ArmyMessage,
              meta: { title: '消息', keepAlive: true, userType: 'merchant' }
            },
            {
              path: '/merchant/suggestion',
              component: ArmySuggestion,
              meta: { title: '意见反馈', userType: 'merchant' }
            },
            {
              path: '/merchant/suggestionresponse',
              component: ArmySuggestionResponse,
              meta: { title: '意见反馈', userType: 'merchant' }
            },
            {
              path: '/merchant/userinfo/detail',
              component: MerchantInfoDetail,
              meta: { title: '商家详情' }
            },
            {
              path: '/merchant/userinfo/edit',
              component: MerchantUserinfoEdit,
              meta: { title: '商家信息', keepAlive: true }
            },
            {
              path: '/merchant/userinfo',
              component: MerchantUserinfo,
              meta: { title: '商家信息' }
            },
            {
              path: '/merchant/userinfo/selectmappostion',
              component: MapPositionSelect,
              meta: { title: '更换地址' }
            }
          ]
        },

        {
          path: '/',
          component: ArmyLayout,
          children: [
            {
              path: '/',
              component: ArmyIndex,
              meta: { title: '浙里老兵', keepAlive: true }
            },
            {
              path: '/army/index/applicabilitytraining/:id',
              component: ArmyApplicabilityTrainingDetail,
              meta: { title: '培训详情' }
            },
            {
              path: '/army/marketapplication/qsearch',
              component: ArmyMarketApplication,
              meta: { title: '码上查询', type: 1 }
            },
            {
              path: '/army/marketapplication/hospital',
              component: ArmyMarketApplication,
              meta: { title: '码上就医', type: 2 }
            },
            {
              path: '/army/service/servicedetail/:id',
              component: ArmyServiceDetail,
              meta: { title: '查看详情' }
            },
            {
              path: '/army/merchant/merchantdetail/:id',
              component: ArmyMerchantDetail,
              meta: { title: '查看详情' }
            },
            {
              path: '/army/pay/payconfirm',
              component: ArmyPayConfirm,
              meta: { title: '支付确认' }
            },
            {
              path: '/army/pay/payinputmeny',
              component: ArmyPayInputMoney,
              meta: { title: '支付确认' }
            },
            {
              path: '/army/payrecords/detail/:orderid',
              component: ArmyPayRecordsDetail,
              meta: { title: '消费详情' }
            },
            {
              path: '/army/payrecords/search',
              component: ArmyPayRecordsSearch,
              meta: { title: '消费记录', keepAlive: true }
            },
            {
              path: '/army/payrecords',
              component: ArmyPayRecords,
              meta: { title: '消费记录', keepAlive: true }
            },
            {
              path: '/army/servicerecords/search',
              component: ArmyServiceRecordsSearch,
              meta: { title: '服务记录', keepAlive: true }
            },
            {
              path: '/army/servicerecords',
              component: ArmyServiceRecords,
              meta: { title: '服务记录', keepAlive: true }
            },
            {
              path: '/army/mycoupons/usedetail/:id',
              component: ArmyCouponsUseDetail,
              meta: { title: '使用详情' }
            },
            {
              path: '/army/mycoupons',
              component: ArmyMyCoupons,
              meta: { title: '我的优惠券', keepAlive: true }
            },
            {
              path: '/army/ptreatment/searchmerchant',
              component: ArmySearchMerchant,
              meta: { title: '码上优惠', keepAlive: true }
            },
            {
              path: '/army/ptreatment/searchservice',
              component: ArmySearchService,
              meta: { title: '码上优惠', keepAlive: true }
            },
            {
              path: '/army/ptreatment',
              component: ArmyPtreatmentIndex,
              meta: { title: '码上优惠', keepAlive: true }
            },
            {
              path: '/army/policy/reader/:articleid',
              component: ArmyArticleReader,
              meta: { title: '查看详情' }
            },
            {
              path: '/army/policy/:type/policyrealizesearch',
              component: ArmyArticleSearch,
              meta: { title: '政策解读', keepAlive: true }
            },
            {
              path: '/army/policy/:type/policyrealizelist',
              component: ArmyPolicyList,
              meta: { title: '政策解读', keepAlive: true }
            },
            {
              path: '/army/policy/:type/policysearch',
              component: ArmyArticleSearch,
              meta: { title: '最新政策', keepAlive: true }
            },
            {
              path: '/army/policy/:type/policylist',
              component: ArmyPolicyList,
              meta: { title: '最新政策', keepAlive: true }
            },
            {
              path: '/army/message',
              component: ArmyMessage,
              meta: { title: '消息', keepAlive: true }
            },
            {
              path: '/army/couponmessage',
              component: ArmyMyCouponsMessage,
              meta: { title: '优惠券提醒' }
            },
            {
              path: '/army/suggestion',
              component: ArmySuggestion,
              meta: { title: '意见反馈', userType: 'army' }
            },
            {
              path: '/army/suggestionresponse',
              component: ArmySuggestionResponse,
              meta: { title: '意见反馈', userType: 'army' }
            },
            {
              path: '/army/incharge/applyprocess/:id',
              component: ArmyInChargeApplyProgress,
              meta: { title: '家人代持' }
            },
            {
              path: '/army/incharge',
              component: ArmyInCharge,
              meta: { title: '家人代持' }
            },
            {
              path: '/army/userinfo',
              component: ArmyUserinfo,
              meta: { title: '个人中心' }
            },
            {
              path: '/army/qrcode',
              component: ArmyQrcode,
              meta: { title: '我的老兵码' }
            },
            {
              path: '/army/allapplication',
              component: ArmyAllApplication,
              meta: { title: '常用应用' }
            },
            ...ArmyRouter,
            { path: '/army/test', component: Test, meta: { title: '老兵码测试' } },
            {
              path: '*',
              component: Page404,
              meta: { title: '访问错误，页面不存在' }
            }
          ]
        }
      ]
    }
  ]
})

// 监听路由 并且 实现 页面跳转加载动画
router.beforeEach((to, from, next) => {
  Common.showLoading(true)
  /* 必须调用 `next` */
  next()
})

router.afterEach((to, from) => {
  Common.showLoading(false)
})

export default router
