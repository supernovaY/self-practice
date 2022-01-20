import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '@/views/home/Home.vue';
import DepartHeader from '@/views/recordDeliverGoods/DepartHeader.vue';
import RecordDepartGoods from '@/views/recordDeliverGoods/RecordDepartGoods.vue';
import DepartGoodsList from '@/views/recordDeliverGoods/DepartGoodsList.vue';

const routes = [
  {
    path: '/',
    component: Home,
    children:[
      {
        path: '/depart',
        component: DepartHeader,
        redirect: '/depart/recordDepartGoods',
        children:[
          {name: 'recordDepartGoods',path: 'recordDepartGoods', component: RecordDepartGoods,},
          {name: 'departGoodsList',path: 'departGoodsList', component: DepartGoodsList,},
        ]
      },
    ]
  },
  // {
  //   path: '/children',
  //   component: children
  // },
  // {
  //   path: '/axios',
  //   component: () => import('@/views/Axios.vue') // 懒加载组件
  // },
];
const router = createRouter({
  history: createWebHashHistory(),
  routes
});
export default router;
