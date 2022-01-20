const ArmyStartBusinessIndex = () => import('@/pages/army/startBusiness/Index')
const ArmyParkSearch = () => import('@/pages/army/startBusiness/ParkSearch')
const ArmyParkDetail = () => import('@/pages/army/startBusiness/ParkDetail')
const ArmyBusinessIntentionList = () => import('@/pages/army/startBusiness/IntentionList')
const ArmyBusinessIntentionUpdate = () => import('@/pages/army/startBusiness/IntentionUpdate')
const ArmyBusinessCaseList = () => import('@/pages/army/startBusiness/CaseList')
const ArmyBusinessCaseDetail = () => import('@/pages/army/startBusiness/CaseDetail')
const ArmyBusinessSupport = () => import('@/pages/army/startBusiness/SupportList')
const ArmyBusinessSupportSearch = () => import('@/pages/army/startBusiness/SupportSearch')
const ArmyBusinessSupportDetail = () => import('@/pages/army/startBusiness/SupportDetail')
const ArmyBusinessTraining = () => import('@/pages/army/startBusiness/TrainingList')
const ArmyBusinessTrainingDetail = () => import('@/pages/army/startBusiness/TrainingDetail')
const ArmyBusinessTrainingSearch = () => import('@/pages/army/startBusiness/TrainingSearch')
const ArmyBusinessOnline = () => import('@/pages/army/startBusiness/Online')
const ArmyPolicyQuery = () => import('@/pages/army/articles/TabsPolicyQuery')

export default [
  {
    path: '/army/startbusiness',
    component: ArmyStartBusinessIndex,
    meta: { title: '码上创业', keepAlive: true }
  },
  {
    path: '/army/startbusiness/parksearch',
    component: ArmyParkSearch,
    meta: { title: '军创园', keepAlive: true }
  },
  {
    path: '/army/startbusiness/parkdetail/:id',
    component: ArmyParkDetail,
    meta: { title: '查看详情' }
  },
  {
    path: '/army/startbusiness/intentionlist',
    component: ArmyBusinessIntentionList,
    meta: { title: '创业意向' }
  },
  {
    path: '/army/startbusiness/intentionupdate/:id',
    component: ArmyBusinessIntentionUpdate,
    meta: { title: '创业意向' }
  },
  {
    path: '/army/startbusiness/policyquery/:policyTypeId',
    component: ArmyPolicyQuery,
    meta: { title: '政策查询', keepAlive: true }
  },
  {
    path: '/army/startbusiness/case',
    component: ArmyBusinessCaseList,
    meta: { title: '创业案例', keepAlive: true }
  },
  {
    path: '/army/startbusiness/casedetail/:id',
    component: ArmyBusinessCaseDetail,
    meta: { title: '查看详情' }
  },
  {
    path: '/army/startbusiness/online',
    component: ArmyBusinessOnline,
    meta: { title: '业务办理' }
  },
  {
    path: '/army/startbusiness/support',
    component: ArmyBusinessSupport,
    meta: { title: '创业扶持', keepAlive: true }
  },
  {
    path: '/army/startbusiness/supportsearch',
    component: ArmyBusinessSupportSearch,
    meta: { title: '创业扶持', keepAlive: true }
  },
  {
    path: '/army/startbusiness/supportdetail/:id',
    component: ArmyBusinessSupportDetail,
    meta: { title: '查看详情' }
  },
  {
    path: '/army/startbusiness/training',
    component: ArmyBusinessTraining,
    meta: { title: '创业培训', keepAlive: true }
  },
  {
    path: '/army/startbusiness/trainingdetail/:id',
    component: ArmyBusinessTrainingDetail,
    meta: { title: '培训详情' }
  },
  {
    path: '/army/startbusiness/trainingsearch',
    component: ArmyBusinessTrainingSearch,
    meta: { title: '创业培训', keepAlive: true }
  }
]
