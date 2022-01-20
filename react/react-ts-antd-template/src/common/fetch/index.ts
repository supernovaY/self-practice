/**
 * @description fetch 请求封装
 */
import Request from './request';
import Constant from '../constant';
// import Platform from '../platform';
import { message } from 'antd';
import { HttpResponse } from '../interface';

const Fetch = (url: string, config: any = {}) => {
  config.method = config.method || 'POST';
  return new Promise<HttpResponse>((resolve, reject) => {
    Request(url, config)
      .then((result) => {
        console.log('接口: ', url);
        let data: any = {};
        try {
          data = JSON.parse(result);
        } catch {
          data = result;
        }
        const status = data.status;
        const errMsg = data.errMsg;
        if (Constant.HTTP_STATUS.SUCCESS !== status) {
          message.error(errMsg || '系统异常，请稍候再试！');
        }
        resolve(data);
      })
      .catch((err) => {
        console.log('接口失败: ', err.status, url, err);
        message.error('系统异常，请稍候再试！');
        reject(err);
      });
  });
};

Fetch.post = (url: string, params: any = {}) => {
  return Fetch(url, {
    method: 'POST',
    body: params,
  });
};
Fetch.get = (url: string, params: any = {}) => {
  return Fetch(url, {
    method: 'GET',
    body: params,
  });
};
Fetch.put = (url: string, params: any = {}) => {
  return Fetch(url, {
    method: 'PUT',
    body: params,
  });
};
Fetch.upload = (url: string, params: any = {}) => {
  return Fetch(url, {
    method: 'POST',
    body: params,
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export default Fetch;
