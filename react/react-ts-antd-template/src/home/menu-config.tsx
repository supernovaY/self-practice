/**
 * 侧边栏菜单的一些配置信息
 */
import React from 'react';
import {
  DesktopOutlined,
  SettingOutlined,
  AppstoreOutlined,
  AccountBookOutlined,
  AimOutlined,
  AlertOutlined,
  BarChartOutlined,
  BellOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  GoogleOutlined,
  GitlabOutlined,
  GithubOutlined,
} from '@ant-design/icons';

// 侧边栏菜单的 menuId 常量维护
const MenuCodes = {};

// 侧边栏菜单的 icon 配置: 接口的 icon 字段对应的图标英文名常量，或者菜单英文名（id）对应的icon...
const MenuIcons = {
  'index-01': (IconProps: any) => <DesktopOutlined {...IconProps} />,
  'index-02': (IconProps: any) => <SettingOutlined {...IconProps} />,
  'person-manage': (IconProps: any) => <AppstoreOutlined {...IconProps} />,
  'person-list': (IconProps: any) => <AccountBookOutlined {...IconProps} />,
  'person-move': (IconProps: any) => <AimOutlined {...IconProps} />,
  'big-data': (IconProps: any) => <AlertOutlined {...IconProps} />,
  'market-kpi': (IconProps: any) => <BarChartOutlined {...IconProps} />,
  'market-return-rate': (IconProps: any) => <BellOutlined {...IconProps} />,
  'market-lose-rate': (IconProps: any) => <CalendarOutlined {...IconProps} />,
  'work-record': (IconProps: any) => <GitlabOutlined {...IconProps} />,
};

export { MenuCodes, MenuIcons };
