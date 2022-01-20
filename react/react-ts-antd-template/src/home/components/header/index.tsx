import React from 'react';
import { Layout, Button } from 'antd';
import './index.less';
import { Constant } from '@/common';
const { Header } = Layout;

const THeader = () => {
  // 退出登录按钮
  const logout = () => {
    console.log('logout=======');
    sessionStorage.clear();
  };

  return (
    <Header className="t-header" style={{ textAlign: 'center', background: '#fff', borderBottom: '1px solid #ddd' }}>
      <div className="t-header-title">React-ts-antd PROJECT</div>
      <div className="t-header-logout">
        <Button htmlType="button" onClick={logout}>
          退出登录
        </Button>
      </div>
    </Header>
  );
};

export default THeader;
