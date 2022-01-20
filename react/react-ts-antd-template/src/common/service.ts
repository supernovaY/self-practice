// 接口封装
import Fetch from './fetch';
import Api from './api';
import Qs from 'qs';
import { QueryMenuList } from './interface';

class Service {
  /********************************** 公共接口 **********************************/
  // 查询菜单信息
  queryMenuList = (params: QueryMenuList) => {
    console.log('queryMenuList Qs.stringify(params):', Qs.stringify(params));
    return Fetch.post(Api.GET_MENU_LIST, params);
  };
}

export default new Service();
