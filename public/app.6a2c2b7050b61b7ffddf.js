webpackJsonp([1,2],{

/***/ 245:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(162);

var _react = __webpack_require__(10);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(163);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactRouter = __webpack_require__(106);

var _reactRouterRedux = __webpack_require__(82);

var _components = __webpack_require__(247);

var _components2 = _interopRequireDefault(_components);

var _store = __webpack_require__(248);

var _store2 = _interopRequireDefault(_store);

__webpack_require__(433);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var store = (0, _store2.default)(undefined, { history: _reactRouter.browserHistory });

var story = (0, _reactRouterRedux.syncHistoryWithStore)(_reactRouter.browserHistory, store);

_reactDom2.default.render(_react2.default.createElement(_components2.default, { store: store, history: story }), document.getElementById('app'));

/***/ }),

/***/ 246:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(10);

var _react2 = _interopRequireDefault(_react);

var _reactRouter = __webpack_require__(106);

var _reactRouterRedux = __webpack_require__(82);

var _reactRedux = __webpack_require__(164);

var _redux = __webpack_require__(83);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Application = function (_PureComponent) {
  _inherits(Application, _PureComponent);

  function Application(props) {
    _classCallCheck(this, Application);

    var _this = _possibleConstructorReturn(this, (Application.__proto__ || Object.getPrototypeOf(Application)).call(this, props));

    _this.state = {};
    return _this;
  }

  _createClass(Application, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var props = this.props,
          state = this.state;
      var children = props.children,
          _props$grandChildren = props.grandChildren,
          grandChildren = _props$grandChildren === undefined ? children.props.children : _props$grandChildren;


      return _react2.default.createElement(
        'main',
        { id: 'main', role: 'main', ref: function ref(m) {
            return m ? _this2.main = m : null;
          } },
        _react2.default.createElement(
          'header',
          { className: 'navigator', id: 'nav' },
          _react2.default.createElement(
            'h1',
            null,
            'redux.io'
          )
        ),
        _react2.default.createElement(
          'section',
          { className: 'main-content' },
          children ? _react2.default.cloneElement(props.children, {}) : null
        ),
        _react2.default.createElement(
          'footer',
          null,
          _react2.default.createElement(
            'h6',
            null,
            'redux.io'
          )
        )
      );
    }
  }]);

  return Application;
}(_react.PureComponent);

Application.propTypes = {
  children: _react.PropTypes.element,
  history: _react.PropTypes.object,
  location: _react.PropTypes.object,
  params: _react.PropTypes.object,
  route: _react.PropTypes.object,
  routes: _react.PropTypes.array,
  routeParams: _react.PropTypes.object,
  routing: _react.PropTypes.object,
  router: _react.PropTypes.object
};

Application.defaultProps = {};

var App = (0, _reactRedux.connect)(function mapStateToProps(state, ownProps) {
  return _extends({}, ownProps, state);
}, function mapDispatchToProps(dispatch) {
  return {
    router: (0, _redux.bindActionCreators)({
      push: _reactRouterRedux.push, replace: _reactRouterRedux.replace, go: _reactRouterRedux.go, goForward: _reactRouterRedux.goForward, goBack: _reactRouterRedux.goBack
    }, dispatch)
  };
}, function mergeProps(stateProps, dispatchers) {
  return _extends({}, Object.keys(dispatchers).reduce(function (a, b) {
    return a[b] ? _extends({}, a, _defineProperty({}, b, _extends({}, a[b], dispatchers[b]))) : _extends({}, a, _defineProperty({}, b, dispatchers[b]));
  }, _extends({}, stateProps)));
}, { pure: true, withRef: false })(Application);

var Home = function Home(props) {
  return _react2.default.createElement(
    'div',
    null,
    'welcome home'
  );
};

var Root = function Root(_ref) {
  var store = _ref.store,
      _ref$history = _ref.history,
      history = _ref$history === undefined ? _reactRouter.browserHistory : _ref$history;
  return _react2.default.createElement(
    _reactRedux.Provider,
    { store: store },
    _react2.default.createElement(
      _reactRouter.Router,
      { history: history, createElement: function createElement(Component, props) {
          return _react2.default.createElement(Component, props);
        } },
      _react2.default.createElement(
        _reactRouter.Route,
        { path: '/', component: App },
        _react2.default.createElement(_reactRouter.IndexRoute, { component: Home }),
        _react2.default.createElement(_reactRouter.Route, { path: ':room' })
      )
    )
  );
};

Root.propTypes = {
  store: _react.PropTypes.object.isRequired,
  history: _react.PropTypes.object.isRequired
};

exports.default = Root;

/***/ }),

/***/ 247:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Root = __webpack_require__(246);

var _Root2 = _interopRequireDefault(_Root);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _Root2.default;

/***/ }),

/***/ 248:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = configureStore;

var _reactRouterRedux = __webpack_require__(82);

var _redux = __webpack_require__(83);

var _reduxThunk = __webpack_require__(165);

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function root(state, action) {
  return state;
}

function configureStore(state, _ref) {
  var history = _ref.history,
      _ref$middleware = _ref.middleware,
      middleware = _ref$middleware === undefined ? {} : _ref$middleware;

  var reducers = (0, _redux.combineReducers)(_extends({}, root, { routing: _reactRouterRedux.routerReducer }));

  var createEnhancedStore = _redux.applyMiddleware.apply(undefined, [(0, _reactRouterRedux.routerMiddleware)(history)].concat(_toConsumableArray(middleware), [_reduxThunk2.default]))(_redux.createStore);

  return createEnhancedStore(reducers, state);
}

/***/ }),

/***/ 433:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 584:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(245);


/***/ })

},[584]);