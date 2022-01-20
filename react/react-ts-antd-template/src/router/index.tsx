import React, { lazy } from 'react';

// import IndexOne from './index-01';
// import IndexTwo from './index-02';
// import PersonList from './person-manage/person-list';
// import PersonMove from './person-manage/person-move';

// 路由懒加载
const IndexOne = lazy(() => import('./index-01'));
const IndexTwo = lazy(() => import('./index-02'));
const PersonList = lazy(() => import('./person-manage/person-list'));
const PersonMove = lazy(() => import('./person-manage/person-move'));

export interface RoutersMetaIns {
  pageTitle: string;
  [key: string]: any;
}

export interface RouteIns {
  path: string;
  name: string;
  component: any;
  meta: RoutersMetaIns;
  children?: Array<RouteIns>;
}

const Routers: Array<RouteIns> = [
  /********************* 首页一号 *********************/
  {
    name: 'index01', // 页面英文名，唯一
    path: '/index01', // 页面路由地址
    component: IndexOne, // 页面组件
    meta: {
      // 页面自定义的一些参数
      pageTitle: '首页一号', // 页面标题
    },
    children: [],
  },
  /********************* 首页二号 *********************/
  {
    name: 'index02',
    path: '/index02',
    component: IndexTwo,
    meta: {
      pageTitle: '首页二号',
    },
    children: [],
  },
  /********************* 人员管理 start *********************/
  {
    name: 'personList',
    path: '/personManage/personList',
    component: PersonList,
    meta: {
      pageTitle: '人员列表',
    },
    children: [],
  },
  {
    name: 'personMove',
    path: '/personManage/personMove',
    component: PersonMove,
    meta: {
      pageTitle: '人员调动概况',
    },
    children: [],
  },
  /********************* 人员管理 end *********************/
];

export default Routers;
