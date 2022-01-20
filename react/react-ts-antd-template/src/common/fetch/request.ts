import Qs from 'qs';
import Utils from '../utils';

export enum ContentType {
  json = 'application/json',
  form = 'application/x-www-form-urlencoded',
  formData = 'multipart/form-data',
}

export enum HttpMethod {
  get = 'GET',
  post = 'POST',
  put = 'PUT',
  patch = 'PATCH',
  delete = 'DELETE',
}

export interface ReqConfig {
  body?: any;
  method?: string;
  headers?: Header;
  token?: string;
  'Content-Type'?: string;
  mode?: string;
}

export interface Header {
  'Content-Type'?: string;
  'X-Requested-With': string;
  token: string;
  authorization?: string;
  security?: string;
  [propName: string]: any;
}

// 处理结果
const parseRes = async (res: Response) => {
  const contentType = res.headers.get('Content-Type');
  // 判断返回的内容类型，做不同的处理
  if (contentType) {
    if (contentType.indexOf('json') > 1) {
      return await res.json();
    }
    if (contentType.indexOf('text') > 1) {
      return await res.text();
    }
    if (contentType.indexOf('form') > 1) {
      return await res.formData();
    }
    if (contentType.indexOf('video') > 1) {
      return await res.blob();
    }
  }
  return await res.text();
};

const handleRes = async (res: Response) => {
  const parsedRes = await parseRes(res);
  if (res.ok) {
    return parsedRes;
  }
  throw res;
};

const Fetch = async (reqUrl: string, config: ReqConfig) => {
  let promise: Response;
  let contentType: string;
  config['mode'] = 'cors';
  if (config.headers && config.headers['Content-Type'] !== undefined) {
    contentType = config.headers['Content-Type'];
  } else if (config.method === HttpMethod.post) {
    contentType = ContentType.json;
  } else {
    contentType = ContentType.json;
  }

  // credentials: 'include', // 解决低版本chrome不自动给fetch请求拼接cookie的问题，fetch默认omit不拼cookie
  const headers: Headers = new Headers({
    'Content-type': contentType,
  });
  if (!config.method || config.method === HttpMethod.get) {
    promise = await fetch(`${reqUrl}?${Qs.stringify(config.body)}`, {
      method: config.method,
      headers,
      credentials: 'include', // include, same-origin, 默认值是 omit
    });
  } else if (config.method === HttpMethod.post) {
    let configBody = config.body;
    switch (contentType) {
      case ContentType.json:
        configBody = JSON.stringify(configBody);
        break;
      case ContentType.form:
        configBody = Qs.stringify(configBody);
        break;
      case ContentType.formData:
        headers.delete('Content-Type');
        break;
      default:
        configBody = JSON.stringify(configBody);
    }
    promise = await fetch(reqUrl, {
      body: configBody,
      headers,
      method: HttpMethod.post,
      mode: 'cors',
      credentials: 'include',
    });
  } else if (config.method === HttpMethod.put) {
    promise = await fetch(`${reqUrl}/${config.body}`, {
      method: config.method,
      headers,
      credentials: 'include', // include, same-origin, 默认值是 omit
    });
  } else {
    promise = await fetch(reqUrl, {
      body: JSON.stringify(config.body),
      headers,
      method: config.method,
      credentials: 'include',
    });
  }
  return handleRes(promise);
};

export default Fetch;
