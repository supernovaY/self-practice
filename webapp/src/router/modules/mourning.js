const ArmyMourning = () => import('@/pages/army/mourning/MourningPage')
const ArmyMourningMartyrDetail = () => import('@/pages/army/mourning/MartyrDetail')
const ArmyMourningMartyrSearch = () => import('@/pages/army/mourning/MartyrSearchPage')
const ArmyMourningAnniversarySearch = () => import('@/pages/army/mourning/AnniversarySearchPage')
const ArmyMourningAnniversaryDetail = () => import('@/pages/army/mourning/AnniversaryDetail')
const ArmyMourningWorship = () => import('@/pages/army/mourning/Worship')

export default [
  {
    path: '/army/mourning/index',
    component: ArmyMourning,
    meta: { title: '码上追思', keepAlive: true }
  },
  {
    path: '/army/mourning/martyr/search',
    component: ArmyMourningMartyrSearch,
    meta: { title: '烈士纪念搜索', keepAlive: true }
  },
  {
    path: '/army/mourning/anniversary/search',
    component: ArmyMourningAnniversarySearch,
    meta: { title: '纪念设施搜索', keepAlive: true }
  },
  {
    path: '/army/mourning/martyrdetail',
    component: ArmyMourningMartyrDetail,
    meta: { title: '烈士纪念' }
  },
  {
    path: '/army/mourning/anniversarydetail',
    component: ArmyMourningAnniversaryDetail,
    meta: { title: '详情' }
  },
  {
    path: '/army/mourning/worship',
    component: ArmyMourningWorship,
    meta: { title: '纪念祭扫' }
  }
]
