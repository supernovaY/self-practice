import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import Home from '@/views/Home.vue';
import Vuex from '@/views/Vuex.vue';
import ElementPlus from '@/views/ElementPlus.vue';
import ThemeChange from '@/views/Theme.vue';
import children from '@/views/children.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/vuex',
    component: Vuex
  },
  {
    path: '/children',
    component: children
  },
  {
    path: '/axios',
    component: () => import('@/views/Axios.vue') // 懒加载组件
  },
  {
    path: '/theme',
    component: ThemeChange
  }
];
const router = createRouter({
  history: createWebHashHistory(),
  routes
});
export default router;
