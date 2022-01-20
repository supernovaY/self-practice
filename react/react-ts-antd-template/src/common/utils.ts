// 工具函数
const Utils = {
  // 从浏览器地址栏取问号后面的参数
  getParameter: function (param: any) {
    const reg = new RegExp('[&,?,&amp;]' + param + '=([^\\&]*)', 'i');
    const value = reg.exec(window.location.search);
    return value ? value[1] : '';
  },
  // 获取浏览器地址栏参数(获取查询字符串)，返回对象
  getQueryMap: function (queryString: any) {
    const paramObj = {};
    let oneQueryMatch;
    const regGlobal = /[?&][^?&]+=[^?&#]+/g;
    const regOne = /[?&]([^=?]+)=([^?&#]+)/;

    queryString = queryString || window.location.href;
    const paramList = queryString.match(regGlobal);

    if (!paramList) {
      return paramObj;
    }

    for (let i = 0, len = paramList.length; i < len; i++) {
      oneQueryMatch = paramList[i].match(regOne);
      if (oneQueryMatch === null) {
        continue;
      }
      paramObj[oneQueryMatch[1]] = oneQueryMatch[2];
    }
    return paramObj;
  },
  // cookie 操作
  getCookie: function (cookie_name: string) {
    const allcookies = document.cookie;
    let cookie_pos = allcookies.indexOf(cookie_name);
    let value = '';
    if (cookie_pos !== -1) {
      cookie_pos += cookie_name.length + 1;
      let cookie_end = allcookies.indexOf(';', cookie_pos);
      if (cookie_end === -1) {
        cookie_end = allcookies.length;
      }
      value = unescape(allcookies.substring(cookie_pos, cookie_end));
    }
    return value;
  },
  delCookie: function (name: string) {
    const exp = new Date();
    exp.setTime(exp.getTime() - 1);
    const expires = exp.toUTCString();
    const cval = Utils.getCookie(name);
    if (cval != null) document.cookie = `${name}=${cval};expires=${expires}`;
  },
  clearCookie: function () {
    const keys = document.cookie.match(/[^ =;]+(?==)/g);
    if (keys) {
      for (let i = keys.length; i--; ) {
        document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString();
      }
    }
  },
  // 获取随机字符串
  getRandomStr: function () {
    const timestamp = +new Date();
    const randomCount = Math.random().toString(16).slice(2);
    return `${timestamp}${randomCount}`;
  },
  // 触发自定义监听事件
  triggerEvent: (eventName: string, data: any) => {
    const cusEvent: any = document.createEvent('Event');
    cusEvent.initEvent(eventName, true, true);
    cusEvent.data = data;
    // cusEvent._args = [].slice.call(arguments).slice(1);
    document.dispatchEvent(cusEvent);
  },
};

export default Utils;
