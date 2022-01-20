// 平台判断
const ua = navigator.userAgent.toUpperCase();
const Platform = {
  IS_LOCAL:
    window.location.hostname === 'localhost' || /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(window.location.hostname),
  IS_IE: ua.indexOf('MSIE ') > -1 || ua.indexOf('TRIDENT/') > -1,
};
export default Platform;
