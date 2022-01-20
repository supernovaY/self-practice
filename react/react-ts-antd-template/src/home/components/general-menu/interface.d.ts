export interface MenuItem {
  menuId?: string;
  path: string;
  icon?: string;
  menuName: string;
  subMenu?: Array<MenuItem>;
  [propName: string]: any;
}

export interface ClickCb {
  (key: any): void;
}

export interface MenuInfoInterface {
  menuList: Array<MenuItem>;
  clickCb?: ClickCb;
  [propName: string]: any;
}
