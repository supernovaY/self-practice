'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = Index;

var _reactRouterDom = require('react-router-dom');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _history = require('../public/history');

var _history2 = _interopRequireDefault(_history);

var _ = require('../public/404');

var _2 = _interopRequireDefault(_);

var _no_auth = require('../public/no_auth');

var _no_auth2 = _interopRequireDefault(_no_auth);

var _esn = require('esn');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var prop = {
  data: [],
  NotFound: _2.default,
  NoAuth: _no_auth2.default,
  isLogin: true,
  compEnum: [],
  HomeComp: null,
  warpRoute: null,
  isNoRouter: "isShow",
  isRouterFun: function isRouterFun(bool) {
    return !bool;
  }
};

function Index(pro) {
  // Declare a new state variable, which we'll call "count"

  var props = _extends({}, prop, pro);

  var data = props.data,
      NotFound = props.NotFound,
      compEnum = props.compEnum,
      NoAuth = props.NoAuth,
      isLogin = props.isLogin,
      HomeComp = props.HomeComp,
      warpRoute = props.warpRoute,
      isNoRouter = props.isNoRouter,
      isRouterFun = props.isRouterFun;


  (0, _react.useEffect)(function () {
    // Update the document title using the browser API

    return function () {};
  }, []);

  var list = function list(routes) {
    var parentPath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";

    if (routes) {
      return routes.map(function (route, index) {
        var Comp = function Comp() {
          return _react2.default.createElement('span', null);
        };

        if ((0, _esn.isString)(route.component)) {
          Comp = route.component && compEnum.get(route.component) ? compEnum.get(route.component).component : function () {
            return _react2.default.createElement('span', null);
          };
        } else {
          Comp = route.component;
        }

        var bool = route.children && route.children.length > 0;

        var isExpend = true;
        if (bool) {
          isExpend = false;
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = route.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var i = _step.value;

              if (isRouterFun(i[isNoRouter])) {
                isExpend = true;
              }
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        }

        return _react2.default.createElement(_reactRouterDom.Route, {
          key: index,
          path: parentPath + route.path,
          exact: !bool,
          render: function render(props) {
            // ??????render ????????????
            if (bool && isExpend) {
              return _react2.default.createElement(
                _reactRouterDom.Switch,
                null,
                list(route.children, parentPath + route.path),
                _react2.default.createElement(_reactRouterDom.Route, { render: function render() {
                    return _react2.default.createElement(NotFound, null);
                  } })
              );
            } else {
              return _react2.default.createElement(Comp, props);
            }
          }
        });
      });
    } else {
      return null;
    }
  };

  var HomeCompWarp = _react2.default.createElement(
    _reactRouterDom.Switch,
    null,
    list(data),
    _react2.default.createElement(_reactRouterDom.Route, { render: function render() {
        return _react2.default.createElement(NotFound, null);
      } })
  );

  if (HomeComp) {
    HomeCompWarp = _react2.default.createElement(
      HomeComp,
      null,
      _react2.default.createElement(
        _reactRouterDom.Switch,
        null,
        list(data),
        _react2.default.createElement(_reactRouterDom.Route, { render: function render() {
            return _react2.default.createElement(NotFound, null);
          } })
      )
    );
  }

  return _react2.default.createElement(
    _reactRouterDom.Router,
    {
      history: _history2.default
    },
    _react2.default.createElement(
      _reactRouterDom.Switch,
      null,
      list(warpRoute),
      _react2.default.createElement(_reactRouterDom.Route, { exact: true, path: '/noneAuth', component: NoAuth }),
      isLogin ? HomeCompWarp : null
    )
  );
}