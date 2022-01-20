const ArmyJobIndex = () => import('@/pages/army/job/Index')
const ArmyJobSearch = () => import('@/pages/army/job/JobSearch')
const ArmyJobDetail = () => import('@/pages/army/job/JobDetail')
const ArmyCompanyDetail = () => import('@/pages/army/job/CompanyDetail')
const ArmyJobIntentionList = () => import('@/pages/army/job/IntentionList')
const ArmyJobIntentionUpdate = () => import('@/pages/army/job/IntentionUpdate')
const ArmyJobResumeUpdate = () => import('@/pages/army/job/ResumeUpdate')
const ArmyJobFairSearch = () => import('@/pages/army/job/JobFairSearch')
const ArmyJobFairDetail = () => import('@/pages/army/job/JobFairDetail')
const ArmyJobGuidanceList = () => import('@/pages/army/job/GuidanceList')
const ArmyJobGuidanceDetail = () => import('@/pages/army/job/GuidanceDetail')
const ArmyJobTrainingList = () => import('@/pages/army/job/TrainingList')
const ArmyTrainingSearch = () => import('@/pages/army/job/TrainingSearch')
const ArmyJobTrainingDetail = () => import('@/pages/army/job/TrainingDetail')
const ArmyJobCharacter = () => import('@/pages/army/job/Character')
const ArmyJobSocialTraining = () => import('@/pages/army/job/SocialTraining')
const ArmyJobMyTrack = () => import('@/pages/army/job/MyTrack')
const ArmyPolicyQuery = () => import('@/pages/army/articles/TabsPolicyQuery')

export default [
  {
    path: '/army/job',
    component: ArmyJobIndex,
    meta: { title: '码上就业', keepAlive: true }
  },
  {
    path: '/army/job/jobsearch',
    component: ArmyJobSearch,
    meta: { title: '招聘岗位', keepAlive: true }
  },
  {
    path: '/army/job/jobfairsearch',
    component: ArmyJobFairSearch,
    meta: { title: '招聘会', keepAlive: true }
  },
  {
    path: '/army/job/jobdetail/:id',
    component: ArmyJobDetail,
    meta: { title: '查看详情' }
  },
  {
    path: '/army/job/companydetail/:id',
    component: ArmyCompanyDetail,
    meta: { title: '查看详情' }
  },
  {
    path: '/army/job/policyquery/:policyTypeId',
    component: ArmyPolicyQuery,
    meta: { title: '政策查询', keepAlive: true }
  },
  {
    path: '/army/job/intentionlist',
    component: ArmyJobIntentionList,
    meta: { title: '求职意向' }
  },
  {
    path: '/army/job/intentionupdate/:id',
    component: ArmyJobIntentionUpdate,
    meta: { title: '求职意向' }
  },
  {
    path: '/army/job/resumeupdate/:id',
    component: ArmyJobResumeUpdate,
    meta: { title: '个人简历' }
  },
  {
    path: '/army/job/jobfairdetail/:id',
    component: ArmyJobFairDetail,
    meta: { title: '查看详情' }
  },
  {
    path: '/army/job/guidancelist',
    component: ArmyJobGuidanceList,
    meta: { title: '职业指导', keepAlive: true }
  },
  {
    path: '/army/job/guidancedetail/:id',
    component: ArmyJobGuidanceDetail,
    meta: { title: '查看详情' }
  },
  {
    path: '/army/job/character',
    component: ArmyJobCharacter,
    meta: { title: '职业性格测试' }
  },
  {
    path: '/army/job/traininglist',
    component: ArmyJobTrainingList,
    meta: { title: '教育培训', keepAlive: true }
  },
  {
    path: '/army/job/trainingsearch',
    component: ArmyTrainingSearch,
    meta: { title: '教育培训', keepAlive: true }
  },
  {
    path: '/army/job/trainingdetail/:id',
    component: ArmyJobTrainingDetail,
    meta: { title: '培训详情' }
  },
  {
    path: '/army/job/socialtraining',
    component: ArmyJobSocialTraining,
    meta: { title: '社会培训' }
  },
  {
    path: '/army/job/mytrack',
    component: ArmyJobMyTrack,
    meta: { title: '我的足迹', keepAlive: true }
  }
]
