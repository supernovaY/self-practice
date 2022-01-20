/**
 * 本地 Mock 和 联调的 代理配置
 */
const proxy = require('http-proxy-middleware');
const DOT_ENV = require('./read-env')();
module.exports = function (app) {
  app.use(
    proxy(['/api'], {
      target: !isNaN(DOT_ENV.PROXY_TARGET)
        ? `http://127.0.0.1:${DOT_ENV.PROXY_TARGET}`
        : `http://${DOT_ENV.PROXY_TARGET}`
    })
  );
};
