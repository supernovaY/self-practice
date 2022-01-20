import React, { useState, useEffect } from 'react';
import { Menu } from 'antd';
import { MenuItem, MenuInfoInterface } from './interface';

// 侧边栏菜单 icon 和 menuId 常量映射关系配置
import { MenuCodes, MenuIcons } from '../../menu-config';
import './index.less';

let globalOpenKeys: Array<string> = []; // 全局 展开状态的一级菜单 key 列表
let routes: Array<MenuItem> = []; // 所有二级菜单项，和没有二级菜单的一级菜单项 -> 可跳转页面的菜单项

function GeneralMenu(props: MenuInfoInterface): JSX.Element {
  const [menuList, setMenuList] = useState(props.menuList);
  const [selectedKeys, setSelectedKeys] = useState<string>('');
  const [openKeys, setOpenKeys] = useState<Array<string>>([]);

  // 初始化菜单，设置默认展开和默认选中项
  const initMenu = () => {
    const sessionKey = sessionStorage.getItem('currentMenuId') || '';
    const selectedOpenKey: string[] = [];
    routes = [];
    menuList.map((v: MenuItem) => {
      // 设置默认全部展开状态
      v.menuId && selectedOpenKey.push(v.menuId);
      // 记录全局变量 routes， 拿到所有可打开的页面的菜单项，方便后面取用对比 menuId
      if (v.subMenu && v.subMenu.length) {
        v.subMenu.map((item: MenuItem) => {
          // 三级菜单
          if (item.subMenu && item.subMenu.length) {
            // 设置默认全部展开状态
            item.menuId && selectedOpenKey.push(item.menuId);
            item.subMenu.map((vi: MenuItem) => {
              routes.push({
                ...vi,
              });
            });
          } else {
            routes.push({
              ...item,
            });
          }
        });
      } else {
        routes.push({
          ...v,
        });
      }
    });
    // 获取第一个菜单项
    let firstMenuItem: MenuItem | null = null;
    if (routes.length) {
      firstMenuItem = routes[0];
    }
    // 设置默认激活的菜单项 -> 根据sessionStorage存储的值（menuId） - 用于刷新页面时打开上次的页面
    let defaultItem: MenuItem | null = firstMenuItem;
    routes.map((v) => {
      if (v.menuId === sessionKey) {
        defaultItem = v;
      }
    });
    const selectedItemKey = defaultItem && defaultItem.menuId ? defaultItem.menuId : '';
    if (!globalOpenKeys.length) {
      globalOpenKeys = selectedOpenKey;
      setOpenKeys(selectedOpenKey);
    }
    setSelectedKeys(selectedItemKey);
    console.log('general-menu selectedItemKey:', selectedItemKey);
    // 告诉 home 跳转这个页面
    props.clickCb && props.clickCb(defaultItem || {});
    setMenuList(menuList);
  };

  useEffect(() => {
    initMenu();
  }, []);

  // 渲染菜单左边的 icon
  const renderMenuIcon = (item: MenuItem) => {
    // const { menuName, menuId, engName } = item;
    return MenuIcons[item.engName] ? MenuIcons[item.engName]() : '';
  };

  // 渲染路由链接
  const renderRouterLink = (item: MenuItem) => {
    const { path, menuName } = item;
    // 一律渲染静态菜单，在 home/index 做跳转操作
    return (
      <div className="sub-menu-label">
        {renderMenuIcon(item)}
        <span className="menu-name">{menuName}</span>
      </div>
    );
  };

  // 渲染菜单项
  const renderMenuItem = (item: MenuItem) => {
    const { menuId } = item;
    return <Menu.Item key={menuId}>{renderRouterLink(item)}</Menu.Item>;
  };

  // 渲染父级菜单
  const renderSubMenu = (item: MenuItem) => {
    const { menuId, menuName, subMenu = [] } = item;
    // console.log('=====renderSubMenu', item);
    return (
      <Menu.SubMenu
        key={menuId}
        title={
          <span className="sub-menu-label">
            {renderMenuIcon(item)}
            <span className="menu-name">{menuName}</span>
          </span>
        }>
        {subMenu && subMenu.length
          ? subMenu.map((it: MenuItem) => {
              return it.subMenu && it.subMenu.length > 0 ? renderSubMenu(it) : renderMenuItem(it);
            })
          : null}
      </Menu.SubMenu>
    );
  };

  return (
    <Menu
      // theme="light"
      theme="dark"
      className="general-menu-container"
      mode="inline"
      openKeys={openKeys}
      selectedKeys={[selectedKeys]}
      onOpenChange={(openKeys: any) => {
        // console.log('openKeys:', openKeys);
        setOpenKeys(openKeys);
        globalOpenKeys = openKeys;
      }}
      onClick={({ item, key, keyPath, domEvent }) => {
        const selectedItemKey: any = key;
        setSelectedKeys(selectedItemKey);
        let currentMenu: MenuItem | null = null;
        routes.map((v: MenuItem) => {
          if (v.menuId === selectedItemKey) {
            currentMenu = v;
          }
        });
        sessionStorage.setItem('currentMenuId', selectedItemKey);
        props.clickCb && props.clickCb(currentMenu || {});
      }}
      // style={{ borderRight: 0}}
    >
      {menuList.map((item: MenuItem) => {
        return item.subMenu && item.subMenu.length > 0 ? renderSubMenu(item) : renderMenuItem(item);
      })}
    </Menu>
  );
}

export default GeneralMenu;
