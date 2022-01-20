//这里存放用户开发时自己用到的全局配置
import {env_fun} from './common';
import {localhost} from '@config/common';


//获取站点地址
export let getLocation = () => {
    return location.origin;
};

//本地圖片地址
export let baseImgUrl = `${getLocation()}/images`