import React, { useState, useEffect, useRef, useContext } from 'react';
import { message, Modal } from 'antd';
import './index.less';
import { GlobalContext } from '@/global-context';

const PersonList: React.FC = (): JSX.Element => {
  const glbContext = useContext(GlobalContext);

  useEffect(() => {
    // TODO: 测试全局变量
    console.log('glbContext:', glbContext);
    console.log('global:', glbContext.globalValues);
    glbContext.updateGlobalData({
      ohuo: '111',
      test: 455,
    });
  }, []);
  return (
    <div className="person-list-page">
      <h2>人员列表</h2>
    </div>
  );
};

export default PersonList;
