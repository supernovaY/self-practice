import React, { useState, useEffect } from 'react';
import GeneralMenu from '../general-menu';
import { Loading } from '@/components';
import { Constant, Utils, Fetch, Api, Service } from '@/common';
import { Layout } from 'antd';
import './index.less';

const { Sider } = Layout;

function Aside(props: any) {
  const [menuList, setMenuList] = useState([]);
  const [isError, setIsError] = useState(false);

  // 接口报错
  const requestErrorCb = () => {
    setIsError(true);
    props.errorCb && props.errorCb();
  };

  useEffect(() => {
    Loading.show();
    // 获取菜单栏数据
    Service.queryMenuList({
      userId: 'testUser',
    })
      .then((res) => {
        const status = res.status;
        if (Constant.HTTP_STATUS.SUCCESS === status) {
          setIsError(false);
          // menuId 要是字符串，antd渲染要求
          // const menu: any = res.data.map((v: any) => {
          //   return {}
          // });
          setMenuList(res.data);
        } else {
          setIsError(true);
        }
        Loading.hide();
      })
      .catch(() => {
        Loading.hide();
      });
  }, []);

  // 点击菜单的回调
  const clickMenuCallback = (menuItem: any) => {
    console.log('aside-menu clickMenuCallback:', menuItem);
    props.clickMenu && props.clickMenu(menuItem);
  };
  return !isError ? (
    <Sider collapsible className="side_container">
      <div className="project_title">React-ts-antd Project</div>
      {menuList.length > 0 ? <GeneralMenu menuList={menuList} clickCb={clickMenuCallback} /> : null}
    </Sider>
  ) : null;
}

export default Aside;
