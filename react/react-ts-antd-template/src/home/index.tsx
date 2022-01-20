import React, { useState, useEffect } from 'react';
import { Loading } from '@/components';
import Aside from './components/aside';
import THeader from './components/header';
import ContentMain from './components/content';
import { Constant } from '@/common';
import { GlobalContext, globalValues } from '@/global-context';
import './index.less';

import { Layout } from 'antd';
const { Content } = Layout;

const regPath = /#/;

function Home(props: any) {
  // 路由变化监听器
  useEffect(() => {
    props.history.listen((route: any, type: any) => {
      console.log(11111, '监听到路由变化：', route, type);
    });
  }, []);
  // 更新全局变量的方法
  const updateGlobalData = (data: Record<string, any>) => {
    console.log('home/index.tsx -- updateGlobalData:', data);
    setGlobalData((preState: any) => {
      return {
        ...preState,
        globalValues: Object.assign({}, preState.globalValues, data),
      };
    });
  };
  // 全局 context 变量
  const [globalData, setGlobalData] = useState({
    globalValues,
    updateGlobalData,
  } as any);

  // 登录状态 1: 接口成功； -1 接口失败
  const [loginStatus, setLoginStatus] = useState(1);
  const [menuUrl, setMenuUrl] = useState('');

  // 根据点击的菜单，渲染页面
  const handleRenderPage = (item: any) => {
    const { path } = item;
    // 如果没有 path, 不做操作，提示找不到页面
    if (!path) {
      const nfPath = `/#/not-found?_t=${+new Date()}`;
      // window.location.hash = nfPath.slice(nfPath.indexOf('#'));
      const routePath = nfPath.slice(nfPath.indexOf('#') + 1);
      props.history.push(routePath);
      setMenuUrl(nfPath);
      return;
    }
    // path 带#号，截取 hash 值，切换本项目内的hash路由
    if (regPath.test(path)) {
      // window.location.hash = path.slice(path.indexOf('#'));
      const routePath = path.slice(path.indexOf('#') + 1);
      props.history.push(routePath);
      setMenuUrl(path);
      return;
    }
    // path 不带#号，清空 hash --- 这是原先因为可能加载 iframe 页面做的工作
    window.location.hash = '';
  };

  // 点击菜单项
  const clickMenu = (item: any) => {
    console.log('home clicked menu: ', item);
    sessionStorage.setItem('pageName', item.menuName || '');
    handleRenderPage(item);
  };

  // 渲染主体区域内容
  const renderContentMain = () => {
    return (
      <Layout style={{ height: '100%' }} className="container_layout" id="ContentLayout">
        <Content className="content_main">{menuUrl ? <ContentMain /> : null}</Content>
      </Layout>
    );
  };

  // 进入页面流程失败
  const renderErrorTip = () => {
    return loginStatus === -1 ? <div>进入页面流程失败的展示和逻辑的组件</div> : null;
  };

  // 侧边栏请求报错的回调 - 展示报错信息
  const asideErrorCb = () => {
    setLoginStatus(-1);
  };

  return (
    <GlobalContext.Provider value={globalData}>
      {/* 页面主体 */}
      {loginStatus === 1 ? (
        <Layout style={{ height: '100%' }}>
          {/* 顶部 */}
          <THeader />
          <Layout>
            {/* 侧边栏 */}
            <Aside clickMenu={clickMenu} errorCb={asideErrorCb} />
            {/* 页面右边的主体内容区域 */}
            {renderContentMain()}
          </Layout>
        </Layout>
      ) : (
        // 登录流程出错（退回登录页提示？）
        renderErrorTip()
      )}
    </GlobalContext.Provider>
  );
}

export default Home;
