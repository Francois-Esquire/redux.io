(function (babelPolyfill,React,ReactDOM,warning,PropTypes,createHistory,invariant,createHistory$1,createHistory$2,pathToRegexp,PathUtils,hoistStatics,isPromise,io) {
'use strict';

var React__default = 'default' in React ? React['default'] : React;
ReactDOM = ReactDOM && ReactDOM.hasOwnProperty('default') ? ReactDOM['default'] : ReactDOM;
warning = warning && warning.hasOwnProperty('default') ? warning['default'] : warning;
PropTypes = PropTypes && PropTypes.hasOwnProperty('default') ? PropTypes['default'] : PropTypes;
createHistory = createHistory && createHistory.hasOwnProperty('default') ? createHistory['default'] : createHistory;
invariant = invariant && invariant.hasOwnProperty('default') ? invariant['default'] : invariant;
createHistory$1 = createHistory$1 && createHistory$1.hasOwnProperty('default') ? createHistory$1['default'] : createHistory$1;
createHistory$2 = createHistory$2 && createHistory$2.hasOwnProperty('default') ? createHistory$2['default'] : createHistory$2;
pathToRegexp = pathToRegexp && pathToRegexp.hasOwnProperty('default') ? pathToRegexp['default'] : pathToRegexp;
hoistStatics = hoistStatics && hoistStatics.hasOwnProperty('default') ? hoistStatics['default'] : hoistStatics;
isPromise = isPromise && isPromise.hasOwnProperty('default') ? isPromise['default'] : isPromise;
io = io && io.hasOwnProperty('default') ? io['default'] : io;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck$1(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$1(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$1(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * The public API for putting history on context.
 */

var Router$1 = function (_React$Component) {
  _inherits$1(Router, _React$Component);

  function Router() {
    var _temp, _this, _ret;

    _classCallCheck$1(this, Router);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn$1(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.state = {
      match: _this.computeMatch(_this.props.history.location.pathname)
    }, _temp), _possibleConstructorReturn$1(_this, _ret);
  }

  Router.prototype.getChildContext = function getChildContext() {
    return {
      router: _extends({}, this.context.router, {
        history: this.props.history,
        route: {
          location: this.props.history.location,
          match: this.state.match
        }
      })
    };
  };

  Router.prototype.computeMatch = function computeMatch(pathname) {
    return {
      path: '/',
      url: '/',
      params: {},
      isExact: pathname === '/'
    };
  };

  Router.prototype.componentWillMount = function componentWillMount() {
    var _this2 = this;

    var _props = this.props,
        children = _props.children,
        history = _props.history;


    invariant(children == null || React__default.Children.count(children) === 1, 'A <Router> may have only one child element');

    // Do this here so we can setState when a <Redirect> changes the
    // location in componentWillMount. This happens e.g. when doing
    // server rendering using a <StaticRouter>.
    this.unlisten = history.listen(function () {
      _this2.setState({
        match: _this2.computeMatch(history.location.pathname)
      });
    });
  };

  Router.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    warning(this.props.history === nextProps.history, 'You cannot change <Router history>');
  };

  Router.prototype.componentWillUnmount = function componentWillUnmount() {
    this.unlisten();
  };

  Router.prototype.render = function render() {
    var children = this.props.children;

    return children ? React__default.Children.only(children) : null;
  };

  return Router;
}(React__default.Component);

Router$1.propTypes = {
  history: PropTypes.object.isRequired,
  children: PropTypes.node
};
Router$1.contextTypes = {
  router: PropTypes.object
};
Router$1.childContextTypes = {
  router: PropTypes.object.isRequired
};

// Written in this round about way for babel-transform-imports

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * The public API for a <Router> that uses HTML5 history.
 */

var BrowserRouter = function (_React$Component) {
  _inherits(BrowserRouter, _React$Component);

  function BrowserRouter() {
    var _temp, _this, _ret;

    _classCallCheck(this, BrowserRouter);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.history = createHistory(_this.props), _temp), _possibleConstructorReturn(_this, _ret);
  }

  BrowserRouter.prototype.componentWillMount = function componentWillMount() {
    warning(!this.props.history, '<BrowserRouter> ignores the history prop. To use a custom history, ' + 'use `import { Router }` instead of `import { BrowserRouter as Router }`.');
  };

  BrowserRouter.prototype.render = function render() {
    return React__default.createElement(Router$1, { history: this.history, children: this.props.children });
  };

  return BrowserRouter;
}(React__default.Component);

BrowserRouter.propTypes = {
  basename: PropTypes.string,
  forceRefresh: PropTypes.bool,
  getUserConfirmation: PropTypes.func,
  keyLength: PropTypes.number,
  children: PropTypes.node
};

function _classCallCheck$2(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$2(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$2(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * The public API for a <Router> that uses window.location.hash.
 */

var HashRouter = function (_React$Component) {
  _inherits$2(HashRouter, _React$Component);

  function HashRouter() {
    var _temp, _this, _ret;

    _classCallCheck$2(this, HashRouter);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn$2(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.history = createHistory$1(_this.props), _temp), _possibleConstructorReturn$2(_this, _ret);
  }

  HashRouter.prototype.componentWillMount = function componentWillMount() {
    warning(!this.props.history, '<HashRouter> ignores the history prop. To use a custom history, ' + 'use `import { Router }` instead of `import { HashRouter as Router }`.');
  };

  HashRouter.prototype.render = function render() {
    return React__default.createElement(Router$1, { history: this.history, children: this.props.children });
  };

  return HashRouter;
}(React__default.Component);

HashRouter.propTypes = {
  basename: PropTypes.string,
  getUserConfirmation: PropTypes.func,
  hashType: PropTypes.oneOf(['hashbang', 'noslash', 'slash']),
  children: PropTypes.node
};

var _extends$1 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck$3(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$3(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$3(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var isModifiedEvent = function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
};

/**
 * The public API for rendering a history-aware <a>.
 */

var Link = function (_React$Component) {
  _inherits$3(Link, _React$Component);

  function Link() {
    var _temp, _this, _ret;

    _classCallCheck$3(this, Link);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn$3(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.handleClick = function (event) {
      if (_this.props.onClick) _this.props.onClick(event);

      if (!event.defaultPrevented && // onClick prevented default
      event.button === 0 && // ignore right clicks
      !_this.props.target && // let browser handle "target=_blank" etc.
      !isModifiedEvent(event) // ignore clicks with modifier keys
      ) {
          event.preventDefault();

          var history = _this.context.router.history;
          var _this$props = _this.props,
              replace = _this$props.replace,
              to = _this$props.to;


          if (replace) {
            history.replace(to);
          } else {
            history.push(to);
          }
        }
    }, _temp), _possibleConstructorReturn$3(_this, _ret);
  }

  Link.prototype.render = function render() {
    var _props = this.props,
        replace = _props.replace,
        to = _props.to,
        innerRef = _props.innerRef,
        props = _objectWithoutProperties(_props, ['replace', 'to', 'innerRef']); // eslint-disable-line no-unused-vars

    invariant(this.context.router, 'You should not use <Link> outside a <Router>');

    var href = this.context.router.history.createHref(typeof to === 'string' ? { pathname: to } : to);

    return React__default.createElement('a', _extends$1({}, props, { onClick: this.handleClick, href: href, ref: innerRef }));
  };

  return Link;
}(React__default.Component);

Link.propTypes = {
  onClick: PropTypes.func,
  target: PropTypes.string,
  replace: PropTypes.bool,
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  innerRef: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
};
Link.defaultProps = {
  replace: false
};
Link.contextTypes = {
  router: PropTypes.shape({
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
      replace: PropTypes.func.isRequired,
      createHref: PropTypes.func.isRequired
    }).isRequired
  }).isRequired
};

function _classCallCheck$4(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$4(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$4(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * The public API for a <Router> that stores location in memory.
 */

var MemoryRouter$1 = function (_React$Component) {
  _inherits$4(MemoryRouter, _React$Component);

  function MemoryRouter() {
    var _temp, _this, _ret;

    _classCallCheck$4(this, MemoryRouter);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn$4(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.history = createHistory$2(_this.props), _temp), _possibleConstructorReturn$4(_this, _ret);
  }

  MemoryRouter.prototype.componentWillMount = function componentWillMount() {
    warning(!this.props.history, '<MemoryRouter> ignores the history prop. To use a custom history, ' + 'use `import { Router }` instead of `import { MemoryRouter as Router }`.');
  };

  MemoryRouter.prototype.render = function render() {
    return React__default.createElement(Router$1, { history: this.history, children: this.props.children });
  };

  return MemoryRouter;
}(React__default.Component);

MemoryRouter$1.propTypes = {
  initialEntries: PropTypes.array,
  initialIndex: PropTypes.number,
  getUserConfirmation: PropTypes.func,
  keyLength: PropTypes.number,
  children: PropTypes.node
};

// Written in this round about way for babel-transform-imports

var patternCache = {};
var cacheLimit = 10000;
var cacheCount = 0;

var compilePath = function compilePath(pattern, options) {
  var cacheKey = '' + options.end + options.strict + options.sensitive;
  var cache = patternCache[cacheKey] || (patternCache[cacheKey] = {});

  if (cache[pattern]) return cache[pattern];

  var keys = [];
  var re = pathToRegexp(pattern, keys, options);
  var compiledPattern = { re: re, keys: keys };

  if (cacheCount < cacheLimit) {
    cache[pattern] = compiledPattern;
    cacheCount++;
  }

  return compiledPattern;
};

/**
 * Public API for matching a URL pathname to a path pattern.
 */
var matchPath = function matchPath(pathname) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (typeof options === 'string') options = { path: options };

  var _options = options,
      _options$path = _options.path,
      path = _options$path === undefined ? '/' : _options$path,
      _options$exact = _options.exact,
      exact = _options$exact === undefined ? false : _options$exact,
      _options$strict = _options.strict,
      strict = _options$strict === undefined ? false : _options$strict,
      _options$sensitive = _options.sensitive,
      sensitive = _options$sensitive === undefined ? false : _options$sensitive;

  var _compilePath = compilePath(path, { end: exact, strict: strict, sensitive: sensitive }),
      re = _compilePath.re,
      keys = _compilePath.keys;

  var match = re.exec(pathname);

  if (!match) return null;

  var url = match[0],
      values = match.slice(1);

  var isExact = pathname === url;

  if (exact && !isExact) return null;

  return {
    path: path, // the path pattern used to match
    url: path === '/' && url === '' ? '/' : url, // the matched portion of the URL
    isExact: isExact, // whether or not we matched exactly
    params: keys.reduce(function (memo, key, index) {
      memo[key.name] = values[index];
      return memo;
    }, {})
  };
};

var _extends$3 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck$5(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$5(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$5(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var isEmptyChildren = function isEmptyChildren(children) {
  return React__default.Children.count(children) === 0;
};

/**
 * The public API for matching a single path and rendering.
 */

var Route$1 = function (_React$Component) {
  _inherits$5(Route, _React$Component);

  function Route() {
    var _temp, _this, _ret;

    _classCallCheck$5(this, Route);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn$5(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.state = {
      match: _this.computeMatch(_this.props, _this.context.router)
    }, _temp), _possibleConstructorReturn$5(_this, _ret);
  }

  Route.prototype.getChildContext = function getChildContext() {
    return {
      router: _extends$3({}, this.context.router, {
        route: {
          location: this.props.location || this.context.router.route.location,
          match: this.state.match
        }
      })
    };
  };

  Route.prototype.computeMatch = function computeMatch(_ref, router) {
    var computedMatch = _ref.computedMatch,
        location = _ref.location,
        path = _ref.path,
        strict = _ref.strict,
        exact = _ref.exact,
        sensitive = _ref.sensitive;

    if (computedMatch) return computedMatch; // <Switch> already computed the match for us

    invariant(router, 'You should not use <Route> or withRouter() outside a <Router>');

    var route = router.route;

    var pathname = (location || route.location).pathname;

    return path ? matchPath(pathname, { path: path, strict: strict, exact: exact, sensitive: sensitive }) : route.match;
  };

  Route.prototype.componentWillMount = function componentWillMount() {
    warning(!(this.props.component && this.props.render), 'You should not use <Route component> and <Route render> in the same route; <Route render> will be ignored');

    warning(!(this.props.component && this.props.children && !isEmptyChildren(this.props.children)), 'You should not use <Route component> and <Route children> in the same route; <Route children> will be ignored');

    warning(!(this.props.render && this.props.children && !isEmptyChildren(this.props.children)), 'You should not use <Route render> and <Route children> in the same route; <Route children> will be ignored');
  };

  Route.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps, nextContext) {
    warning(!(nextProps.location && !this.props.location), '<Route> elements should not change from uncontrolled to controlled (or vice versa). You initially used no "location" prop and then provided one on a subsequent render.');

    warning(!(!nextProps.location && this.props.location), '<Route> elements should not change from controlled to uncontrolled (or vice versa). You provided a "location" prop initially but omitted it on a subsequent render.');

    this.setState({
      match: this.computeMatch(nextProps, nextContext.router)
    });
  };

  Route.prototype.render = function render() {
    var match = this.state.match;
    var _props = this.props,
        children = _props.children,
        component = _props.component,
        render = _props.render;
    var _context$router = this.context.router,
        history = _context$router.history,
        route = _context$router.route,
        staticContext = _context$router.staticContext;

    var location = this.props.location || route.location;
    var props = { match: match, location: location, history: history, staticContext: staticContext };

    return component ? // component prop gets first priority, only called if there's a match
    match ? React__default.createElement(component, props) : null : render ? // render prop is next, only called if there's a match
    match ? render(props) : null : children ? // children come last, always called
    typeof children === 'function' ? children(props) : !isEmptyChildren(children) ? React__default.Children.only(children) : null : null;
  };

  return Route;
}(React__default.Component);

Route$1.propTypes = {
  computedMatch: PropTypes.object, // private, from <Switch>
  path: PropTypes.string,
  exact: PropTypes.bool,
  strict: PropTypes.bool,
  sensitive: PropTypes.bool,
  component: PropTypes.func,
  render: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  location: PropTypes.object
};
Route$1.contextTypes = {
  router: PropTypes.shape({
    history: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired,
    staticContext: PropTypes.object
  })
};
Route$1.childContextTypes = {
  router: PropTypes.object.isRequired
};

// Written in this round about way for babel-transform-imports

var _extends$2 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _objectWithoutProperties$1(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

/**
 * A <Link> wrapper that knows if it's "active" or not.
 */
var NavLink = function NavLink(_ref) {
  var to = _ref.to,
      exact = _ref.exact,
      strict = _ref.strict,
      location = _ref.location,
      activeClassName = _ref.activeClassName,
      className = _ref.className,
      activeStyle = _ref.activeStyle,
      style = _ref.style,
      getIsActive = _ref.isActive,
      ariaCurrent = _ref.ariaCurrent,
      rest = _objectWithoutProperties$1(_ref, ['to', 'exact', 'strict', 'location', 'activeClassName', 'className', 'activeStyle', 'style', 'isActive', 'ariaCurrent']);

  return React__default.createElement(Route$1, {
    path: (typeof to === 'undefined' ? 'undefined' : _typeof(to)) === 'object' ? to.pathname : to,
    exact: exact,
    strict: strict,
    location: location,
    children: function children(_ref2) {
      var location = _ref2.location,
          match = _ref2.match;

      var isActive = !!(getIsActive ? getIsActive(match, location) : match);

      return React__default.createElement(Link, _extends$2({
        to: to,
        className: isActive ? [className, activeClassName].filter(function (i) {
          return i;
        }).join(' ') : className,
        style: isActive ? _extends$2({}, style, activeStyle) : style,
        'aria-current': isActive && ariaCurrent
      }, rest));
    }
  });
};

NavLink.propTypes = {
  to: Link.propTypes.to,
  exact: PropTypes.bool,
  strict: PropTypes.bool,
  location: PropTypes.object,
  activeClassName: PropTypes.string,
  className: PropTypes.string,
  activeStyle: PropTypes.object,
  style: PropTypes.object,
  isActive: PropTypes.func,
  ariaCurrent: PropTypes.oneOf(['page', 'step', 'location', 'true'])
};

NavLink.defaultProps = {
  activeClassName: 'active',
  ariaCurrent: 'true'
};

function _classCallCheck$6(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$6(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$6(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * The public API for prompting the user before navigating away
 * from a screen with a component.
 */

var Prompt$1 = function (_React$Component) {
  _inherits$6(Prompt, _React$Component);

  function Prompt() {
    _classCallCheck$6(this, Prompt);

    return _possibleConstructorReturn$6(this, _React$Component.apply(this, arguments));
  }

  Prompt.prototype.enable = function enable(message) {
    if (this.unblock) this.unblock();

    this.unblock = this.context.router.history.block(message);
  };

  Prompt.prototype.disable = function disable() {
    if (this.unblock) {
      this.unblock();
      this.unblock = null;
    }
  };

  Prompt.prototype.componentWillMount = function componentWillMount() {
    invariant(this.context.router, 'You should not use <Prompt> outside a <Router>');

    if (this.props.when) this.enable(this.props.message);
  };

  Prompt.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    if (nextProps.when) {
      if (!this.props.when || this.props.message !== nextProps.message) this.enable(nextProps.message);
    } else {
      this.disable();
    }
  };

  Prompt.prototype.componentWillUnmount = function componentWillUnmount() {
    this.disable();
  };

  Prompt.prototype.render = function render() {
    return null;
  };

  return Prompt;
}(React__default.Component);

Prompt$1.propTypes = {
  when: PropTypes.bool,
  message: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired
};
Prompt$1.defaultProps = {
  when: true
};
Prompt$1.contextTypes = {
  router: PropTypes.shape({
    history: PropTypes.shape({
      block: PropTypes.func.isRequired
    }).isRequired
  }).isRequired
};

// Written in this round about way for babel-transform-imports

function isAbsolute(pathname) {
  return pathname.charAt(0) === '/';
}

// About 1.5x faster than the two-arg version of Array#splice()
function spliceOne(list, index) {
  for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1) {
    list[i] = list[k];
  }

  list.pop();
}

// This implementation is based heavily on node's url.parse
function resolvePathname(to) {
  var from = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  var toParts = to && to.split('/') || [];
  var fromParts = from && from.split('/') || [];

  var isToAbs = to && isAbsolute(to);
  var isFromAbs = from && isAbsolute(from);
  var mustEndAbs = isToAbs || isFromAbs;

  if (to && isAbsolute(to)) {
    // to is absolute
    fromParts = toParts;
  } else if (toParts.length) {
    // to is relative, drop the filename
    fromParts.pop();
    fromParts = fromParts.concat(toParts);
  }

  if (!fromParts.length) return '/';

  var hasTrailingSlash = void 0;
  if (fromParts.length) {
    var last = fromParts[fromParts.length - 1];
    hasTrailingSlash = last === '.' || last === '..' || last === '';
  } else {
    hasTrailingSlash = false;
  }

  var up = 0;
  for (var i = fromParts.length; i >= 0; i--) {
    var part = fromParts[i];

    if (part === '.') {
      spliceOne(fromParts, i);
    } else if (part === '..') {
      spliceOne(fromParts, i);
      up++;
    } else if (up) {
      spliceOne(fromParts, i);
      up--;
    }
  }

  if (!mustEndAbs) for (; up--; up) {
    fromParts.unshift('..');
  }if (mustEndAbs && fromParts[0] !== '' && (!fromParts[0] || !isAbsolute(fromParts[0]))) fromParts.unshift('');

  var result = fromParts.join('/');

  if (hasTrailingSlash && result.substr(-1) !== '/') result += '/';

  return result;
}

var _typeof$2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function valueEqual(a, b) {
  if (a === b) return true;

  if (a == null || b == null) return false;

  if (Array.isArray(a)) {
    return Array.isArray(b) && a.length === b.length && a.every(function (item, index) {
      return valueEqual(item, b[index]);
    });
  }

  var aType = typeof a === 'undefined' ? 'undefined' : _typeof$2(a);
  var bType = typeof b === 'undefined' ? 'undefined' : _typeof$2(b);

  if (aType !== bType) return false;

  if (aType === 'object') {
    var aValue = a.valueOf();
    var bValue = b.valueOf();

    if (aValue !== a || bValue !== b) return valueEqual(aValue, bValue);

    var aKeys = Object.keys(a);
    var bKeys = Object.keys(b);

    if (aKeys.length !== bKeys.length) return false;

    return aKeys.every(function (key) {
      return valueEqual(a[key], b[key]);
    });
  }

  return false;
}

var parsePath$1 = function parsePath$$1(path) {
  var pathname = path || '/';
  var search = '';
  var hash = '';

  var hashIndex = pathname.indexOf('#');
  if (hashIndex !== -1) {
    hash = pathname.substr(hashIndex);
    pathname = pathname.substr(0, hashIndex);
  }

  var searchIndex = pathname.indexOf('?');
  if (searchIndex !== -1) {
    search = pathname.substr(searchIndex);
    pathname = pathname.substr(0, searchIndex);
  }

  return {
    pathname: pathname,
    search: search === '?' ? '' : search,
    hash: hash === '#' ? '' : hash
  };
};

var _extends$5 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var createLocation = function createLocation(path, state, key, currentLocation) {
  var location = void 0;
  if (typeof path === 'string') {
    // Two-arg form: push(path, state)
    location = parsePath$1(path);
    location.state = state;
  } else {
    // One-arg form: push(location)
    location = _extends$5({}, path);

    if (location.pathname === undefined) location.pathname = '';

    if (location.search) {
      if (location.search.charAt(0) !== '?') location.search = '?' + location.search;
    } else {
      location.search = '';
    }

    if (location.hash) {
      if (location.hash.charAt(0) !== '#') location.hash = '#' + location.hash;
    } else {
      location.hash = '';
    }

    if (state !== undefined && location.state === undefined) location.state = state;
  }

  try {
    location.pathname = decodeURI(location.pathname);
  } catch (e) {
    if (e instanceof URIError) {
      throw new URIError('Pathname "' + location.pathname + '" could not be decoded. ' + 'This is likely caused by an invalid percent-encoding.');
    } else {
      throw e;
    }
  }

  if (key) location.key = key;

  if (currentLocation) {
    // Resolve incomplete/relative pathname relative to current location.
    if (!location.pathname) {
      location.pathname = currentLocation.pathname;
    } else if (location.pathname.charAt(0) !== '/') {
      location.pathname = resolvePathname(location.pathname, currentLocation.pathname);
    }
  } else {
    // When there is no prior location and pathname is empty, set it to /
    if (!location.pathname) {
      location.pathname = '/';
    }
  }

  return location;
};

var locationsAreEqual = function locationsAreEqual(a, b) {
  return a.pathname === b.pathname && a.search === b.search && a.hash === b.hash && a.key === b.key && valueEqual(a.state, b.state);
};

// eslint-disable-line no-alert

/**
 * Returns true if the HTML5 history API is supported. Taken from Modernizr.
 *
 * https://github.com/Modernizr/Modernizr/blob/master/LICENSE
 * https://github.com/Modernizr/Modernizr/blob/master/feature-detects/history.js
 * changed to avoid false negatives for Windows Phones: https://github.com/reactjs/react-router/issues/586
 */


/**
 * Returns true if browser fires popstate on hash change.
 * IE10 and IE11 do not.
 */


/**
 * Returns false if using go(n) with hash history causes a full page reload.
 */


/**
 * Returns true if a given popstate event is an extraneous WebKit event.
 * Accounts for the fact that Chrome on iOS fires real popstate events
 * containing undefined state when pressing the back button.
 */

function _classCallCheck$7(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$7(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$7(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * The public API for updating the location programmatically
 * with a component.
 */

var Redirect$1 = function (_React$Component) {
  _inherits$7(Redirect, _React$Component);

  function Redirect() {
    _classCallCheck$7(this, Redirect);

    return _possibleConstructorReturn$7(this, _React$Component.apply(this, arguments));
  }

  Redirect.prototype.isStatic = function isStatic() {
    return this.context.router && this.context.router.staticContext;
  };

  Redirect.prototype.componentWillMount = function componentWillMount() {
    invariant(this.context.router, 'You should not use <Redirect> outside a <Router>');

    if (this.isStatic()) this.perform();
  };

  Redirect.prototype.componentDidMount = function componentDidMount() {
    if (!this.isStatic()) this.perform();
  };

  Redirect.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
    var prevTo = createLocation(prevProps.to);
    var nextTo = createLocation(this.props.to);

    if (locationsAreEqual(prevTo, nextTo)) {
      warning(false, 'You tried to redirect to the same route you\'re currently on: ' + ('"' + nextTo.pathname + nextTo.search + '"'));
      return;
    }

    this.perform();
  };

  Redirect.prototype.perform = function perform() {
    var history = this.context.router.history;
    var _props = this.props,
        push = _props.push,
        to = _props.to;


    if (push) {
      history.push(to);
    } else {
      history.replace(to);
    }
  };

  Redirect.prototype.render = function render() {
    return null;
  };

  return Redirect;
}(React__default.Component);

Redirect$1.propTypes = {
  push: PropTypes.bool,
  from: PropTypes.string,
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired
};
Redirect$1.defaultProps = {
  push: false
};
Redirect$1.contextTypes = {
  router: PropTypes.shape({
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
      replace: PropTypes.func.isRequired
    }).isRequired,
    staticContext: PropTypes.object
  }).isRequired
};

// Written in this round about way for babel-transform-imports

var _extends$8 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties$2(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck$8(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$8(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$8(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var normalizeLocation = function normalizeLocation(object) {
  var _object$pathname = object.pathname,
      pathname = _object$pathname === undefined ? '/' : _object$pathname,
      _object$search = object.search,
      search = _object$search === undefined ? '' : _object$search,
      _object$hash = object.hash,
      hash = _object$hash === undefined ? '' : _object$hash;


  return {
    pathname: pathname,
    search: search === '?' ? '' : search,
    hash: hash === '#' ? '' : hash
  };
};

var addBasename = function addBasename(basename, location) {
  if (!basename) return location;

  return _extends$8({}, location, {
    pathname: PathUtils.addLeadingSlash(basename) + location.pathname
  });
};

var stripBasename$1 = function stripBasename(basename, location) {
  if (!basename) return location;

  var base = PathUtils.addLeadingSlash(basename);

  if (location.pathname.indexOf(base) !== 0) return location;

  return _extends$8({}, location, {
    pathname: location.pathname.substr(base.length)
  });
};

var createLocation$1 = function createLocation(location) {
  return typeof location === 'string' ? PathUtils.parsePath(location) : normalizeLocation(location);
};

var createURL = function createURL(location) {
  return typeof location === 'string' ? location : PathUtils.createPath(location);
};

var staticHandler = function staticHandler(methodName) {
  return function () {
    invariant(false, 'You cannot %s with <StaticRouter>', methodName);
  };
};

var noop = function noop() {};

/**
 * The public top-level API for a "static" <Router>, so-called because it
 * can't actually change the current location. Instead, it just records
 * location changes in a context object. Useful mainly in testing and
 * server-rendering scenarios.
 */

var StaticRouter$1 = function (_React$Component) {
  _inherits$8(StaticRouter, _React$Component);

  function StaticRouter() {
    var _temp, _this, _ret;

    _classCallCheck$8(this, StaticRouter);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn$8(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.createHref = function (path) {
      return PathUtils.addLeadingSlash(_this.props.basename + createURL(path));
    }, _this.handlePush = function (location) {
      var _this$props = _this.props,
          basename = _this$props.basename,
          context = _this$props.context;

      context.action = 'PUSH';
      context.location = addBasename(basename, createLocation$1(location));
      context.url = createURL(context.location);
    }, _this.handleReplace = function (location) {
      var _this$props2 = _this.props,
          basename = _this$props2.basename,
          context = _this$props2.context;

      context.action = 'REPLACE';
      context.location = addBasename(basename, createLocation$1(location));
      context.url = createURL(context.location);
    }, _this.handleListen = function () {
      return noop;
    }, _this.handleBlock = function () {
      return noop;
    }, _temp), _possibleConstructorReturn$8(_this, _ret);
  }

  StaticRouter.prototype.getChildContext = function getChildContext() {
    return {
      router: {
        staticContext: this.props.context
      }
    };
  };

  StaticRouter.prototype.componentWillMount = function componentWillMount() {
    warning(!this.props.history, '<StaticRouter> ignores the history prop. To use a custom history, ' + 'use `import { Router }` instead of `import { StaticRouter as Router }`.');
  };

  StaticRouter.prototype.render = function render() {
    var _props = this.props,
        basename = _props.basename,
        context = _props.context,
        location = _props.location,
        props = _objectWithoutProperties$2(_props, ['basename', 'context', 'location']);

    var history = {
      createHref: this.createHref,
      action: 'POP',
      location: stripBasename$1(basename, createLocation$1(location)),
      push: this.handlePush,
      replace: this.handleReplace,
      go: staticHandler('go'),
      goBack: staticHandler('goBack'),
      goForward: staticHandler('goForward'),
      listen: this.handleListen,
      block: this.handleBlock
    };

    return React__default.createElement(Router$1, _extends$8({}, props, { history: history }));
  };

  return StaticRouter;
}(React__default.Component);

StaticRouter$1.propTypes = {
  basename: PropTypes.string,
  context: PropTypes.object.isRequired,
  location: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
};
StaticRouter$1.defaultProps = {
  basename: '',
  location: '/'
};
StaticRouter$1.childContextTypes = {
  router: PropTypes.object.isRequired
};

// Written in this round about way for babel-transform-imports

function _classCallCheck$9(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$9(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$9(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * The public API for rendering the first <Route> that matches.
 */

var Switch$1 = function (_React$Component) {
  _inherits$9(Switch, _React$Component);

  function Switch() {
    _classCallCheck$9(this, Switch);

    return _possibleConstructorReturn$9(this, _React$Component.apply(this, arguments));
  }

  Switch.prototype.componentWillMount = function componentWillMount() {
    invariant(this.context.router, 'You should not use <Switch> outside a <Router>');
  };

  Switch.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    warning(!(nextProps.location && !this.props.location), '<Switch> elements should not change from uncontrolled to controlled (or vice versa). You initially used no "location" prop and then provided one on a subsequent render.');

    warning(!(!nextProps.location && this.props.location), '<Switch> elements should not change from controlled to uncontrolled (or vice versa). You provided a "location" prop initially but omitted it on a subsequent render.');
  };

  Switch.prototype.render = function render() {
    var route = this.context.router.route;
    var children = this.props.children;

    var location = this.props.location || route.location;

    var match = void 0,
        child = void 0;
    React__default.Children.forEach(children, function (element) {
      if (!React__default.isValidElement(element)) return;

      var _element$props = element.props,
          pathProp = _element$props.path,
          exact = _element$props.exact,
          strict = _element$props.strict,
          sensitive = _element$props.sensitive,
          from = _element$props.from;

      var path = pathProp || from;

      if (match == null) {
        child = element;
        match = path ? matchPath(location.pathname, { path: path, exact: exact, strict: strict, sensitive: sensitive }) : route.match;
      }
    });

    return match ? React__default.cloneElement(child, { location: location, computedMatch: match }) : null;
  };

  return Switch;
}(React__default.Component);

Switch$1.contextTypes = {
  router: PropTypes.shape({
    route: PropTypes.object.isRequired
  }).isRequired
};
Switch$1.propTypes = {
  children: PropTypes.node,
  location: PropTypes.object
};

// Written in this round about way for babel-transform-imports

// Written in this round about way for babel-transform-imports

// Written in this round about way for babel-transform-imports

var subscriptionShape = PropTypes.shape({
  trySubscribe: PropTypes.func.isRequired,
  tryUnsubscribe: PropTypes.func.isRequired,
  notifyNestedSubs: PropTypes.func.isRequired,
  isSubscribed: PropTypes.func.isRequired
});

var storeShape = PropTypes.shape({
  subscribe: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  getState: PropTypes.func.isRequired
});

/**
 * Prints a warning in the console if it exists.
 *
 * @param {String} message The warning message.
 * @returns {void}
 */
function warning$1(message) {
  /* eslint-disable no-console */
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error(message);
  }
  /* eslint-enable no-console */
  try {
    // This error was thrown as a convenience so that if you enable
    // "break on all exceptions" in your console,
    // it would pause the execution at this line.
    throw new Error(message);
    /* eslint-disable no-empty */
  } catch (e) {}
  /* eslint-enable no-empty */
}

function _classCallCheck$10(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$10(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$10(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var didWarnAboutReceivingStore = false;
function warnAboutReceivingStore() {
  if (didWarnAboutReceivingStore) {
    return;
  }
  didWarnAboutReceivingStore = true;

  warning$1('<Provider> does not support changing `store` on the fly. ' + 'It is most likely that you see this error because you updated to ' + 'Redux 2.x and React Redux 2.x which no longer hot reload reducers ' + 'automatically. See https://github.com/reactjs/react-redux/releases/' + 'tag/v2.0.0 for the migration instructions.');
}

function createProvider() {
  var _Provider$childContex;

  var storeKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'store';
  var subKey = arguments[1];

  var subscriptionKey = subKey || storeKey + 'Subscription';

  var Provider = function (_Component) {
    _inherits$10(Provider, _Component);

    Provider.prototype.getChildContext = function getChildContext() {
      var _ref;

      return _ref = {}, _ref[storeKey] = this[storeKey], _ref[subscriptionKey] = null, _ref;
    };

    function Provider(props, context) {
      _classCallCheck$10(this, Provider);

      var _this = _possibleConstructorReturn$10(this, _Component.call(this, props, context));

      _this[storeKey] = props.store;
      return _this;
    }

    Provider.prototype.render = function render() {
      return React.Children.only(this.props.children);
    };

    return Provider;
  }(React.Component);

  if (process.env.NODE_ENV !== 'production') {
    Provider.prototype.componentWillReceiveProps = function (nextProps) {
      if (this[storeKey] !== nextProps.store) {
        warnAboutReceivingStore();
      }
    };
  }

  Provider.propTypes = {
    store: storeShape.isRequired,
    children: PropTypes.element.isRequired
  };
  Provider.childContextTypes = (_Provider$childContex = {}, _Provider$childContex[storeKey] = storeShape.isRequired, _Provider$childContex[subscriptionKey] = subscriptionShape, _Provider$childContex);

  return Provider;
}

var Provider = createProvider();

function _classCallCheck$12(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// encapsulates the subscription logic for connecting a component to the redux store, as
// well as nesting subscriptions of descendant components, so that we can ensure the
// ancestor components re-render before descendants

var CLEARED = null;
var nullListeners = {
  notify: function notify() {}
};

function createListenerCollection() {
  // the current/next pattern is copied from redux's createStore code.
  // TODO: refactor+expose that code to be reusable here?
  var current = [];
  var next = [];

  return {
    clear: function clear() {
      next = CLEARED;
      current = CLEARED;
    },
    notify: function notify() {
      var listeners = current = next;
      for (var i = 0; i < listeners.length; i++) {
        listeners[i]();
      }
    },
    get: function get() {
      return next;
    },
    subscribe: function subscribe(listener) {
      var isSubscribed = true;
      if (next === current) next = current.slice();
      next.push(listener);

      return function unsubscribe() {
        if (!isSubscribed || current === CLEARED) return;
        isSubscribed = false;

        if (next === current) next = current.slice();
        next.splice(next.indexOf(listener), 1);
      };
    }
  };
}

var Subscription = function () {
  function Subscription(store, parentSub, onStateChange) {
    _classCallCheck$12(this, Subscription);

    this.store = store;
    this.parentSub = parentSub;
    this.onStateChange = onStateChange;
    this.unsubscribe = null;
    this.listeners = nullListeners;
  }

  Subscription.prototype.addNestedSub = function addNestedSub(listener) {
    this.trySubscribe();
    return this.listeners.subscribe(listener);
  };

  Subscription.prototype.notifyNestedSubs = function notifyNestedSubs() {
    this.listeners.notify();
  };

  Subscription.prototype.isSubscribed = function isSubscribed() {
    return Boolean(this.unsubscribe);
  };

  Subscription.prototype.trySubscribe = function trySubscribe() {
    if (!this.unsubscribe) {
      this.unsubscribe = this.parentSub ? this.parentSub.addNestedSub(this.onStateChange) : this.store.subscribe(this.onStateChange);

      this.listeners = createListenerCollection();
    }
  };

  Subscription.prototype.tryUnsubscribe = function tryUnsubscribe() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
      this.listeners.clear();
      this.listeners = nullListeners;
    }
  };

  return Subscription;
}();

var _extends$10 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck$11(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$11(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$11(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _objectWithoutProperties$4(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var hotReloadingVersion = 0;
var dummyState = {};
function noop$1() {}
function makeSelectorStateful(sourceSelector, store) {
  // wrap the selector in an object that tracks its results between runs.
  var selector = {
    run: function runComponentSelector(props) {
      try {
        var nextProps = sourceSelector(store.getState(), props);
        if (nextProps !== selector.props || selector.error) {
          selector.shouldComponentUpdate = true;
          selector.props = nextProps;
          selector.error = null;
        }
      } catch (error) {
        selector.shouldComponentUpdate = true;
        selector.error = error;
      }
    }
  };

  return selector;
}

function connectAdvanced(
/*
  selectorFactory is a func that is responsible for returning the selector function used to
  compute new props from state, props, and dispatch. For example:
     export default connectAdvanced((dispatch, options) => (state, props) => ({
      thing: state.things[props.thingId],
      saveThing: fields => dispatch(actionCreators.saveThing(props.thingId, fields)),
    }))(YourComponent)
   Access to dispatch is provided to the factory so selectorFactories can bind actionCreators
  outside of their selector as an optimization. Options passed to connectAdvanced are passed to
  the selectorFactory, along with displayName and WrappedComponent, as the second argument.
   Note that selectorFactory is responsible for all caching/memoization of inbound and outbound
  props. Do not use connectAdvanced directly without memoizing results between calls to your
  selector, otherwise the Connect component will re-render on every state or props change.
*/
selectorFactory) {
  var _contextTypes, _childContextTypes;

  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$getDisplayName = _ref.getDisplayName,
      getDisplayName = _ref$getDisplayName === undefined ? function (name) {
    return 'ConnectAdvanced(' + name + ')';
  } : _ref$getDisplayName,
      _ref$methodName = _ref.methodName,
      methodName = _ref$methodName === undefined ? 'connectAdvanced' : _ref$methodName,
      _ref$renderCountProp = _ref.renderCountProp,
      renderCountProp = _ref$renderCountProp === undefined ? undefined : _ref$renderCountProp,
      _ref$shouldHandleStat = _ref.shouldHandleStateChanges,
      shouldHandleStateChanges = _ref$shouldHandleStat === undefined ? true : _ref$shouldHandleStat,
      _ref$storeKey = _ref.storeKey,
      storeKey = _ref$storeKey === undefined ? 'store' : _ref$storeKey,
      _ref$withRef = _ref.withRef,
      withRef = _ref$withRef === undefined ? false : _ref$withRef,
      connectOptions = _objectWithoutProperties$4(_ref, ['getDisplayName', 'methodName', 'renderCountProp', 'shouldHandleStateChanges', 'storeKey', 'withRef']);

  var subscriptionKey = storeKey + 'Subscription';
  var version = hotReloadingVersion++;

  var contextTypes = (_contextTypes = {}, _contextTypes[storeKey] = storeShape, _contextTypes[subscriptionKey] = subscriptionShape, _contextTypes);
  var childContextTypes = (_childContextTypes = {}, _childContextTypes[subscriptionKey] = subscriptionShape, _childContextTypes);

  return function wrapWithConnect(WrappedComponent) {
    invariant(typeof WrappedComponent == 'function', 'You must pass a component to the function returned by ' + ('connect. Instead received ' + JSON.stringify(WrappedComponent)));

    var wrappedComponentName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

    var displayName = getDisplayName(wrappedComponentName);

    var selectorFactoryOptions = _extends$10({}, connectOptions, {
      getDisplayName: getDisplayName,
      methodName: methodName,
      renderCountProp: renderCountProp,
      shouldHandleStateChanges: shouldHandleStateChanges,
      storeKey: storeKey,
      withRef: withRef,
      displayName: displayName,
      wrappedComponentName: wrappedComponentName,
      WrappedComponent: WrappedComponent
    });

    var Connect = function (_Component) {
      _inherits$11(Connect, _Component);

      function Connect(props, context) {
        _classCallCheck$11(this, Connect);

        var _this = _possibleConstructorReturn$11(this, _Component.call(this, props, context));

        _this.version = version;
        _this.state = {};
        _this.renderCount = 0;
        _this.store = props[storeKey] || context[storeKey];
        _this.propsMode = Boolean(props[storeKey]);
        _this.setWrappedInstance = _this.setWrappedInstance.bind(_this);

        invariant(_this.store, 'Could not find "' + storeKey + '" in either the context or props of ' + ('"' + displayName + '". Either wrap the root component in a <Provider>, ') + ('or explicitly pass "' + storeKey + '" as a prop to "' + displayName + '".'));

        _this.initSelector();
        _this.initSubscription();
        return _this;
      }

      Connect.prototype.getChildContext = function getChildContext() {
        var _ref2;

        // If this component received store from props, its subscription should be transparent
        // to any descendants receiving store+subscription from context; it passes along
        // subscription passed to it. Otherwise, it shadows the parent subscription, which allows
        // Connect to control ordering of notifications to flow top-down.
        var subscription = this.propsMode ? null : this.subscription;
        return _ref2 = {}, _ref2[subscriptionKey] = subscription || this.context[subscriptionKey], _ref2;
      };

      Connect.prototype.componentDidMount = function componentDidMount() {
        if (!shouldHandleStateChanges) return;

        // componentWillMount fires during server side rendering, but componentDidMount and
        // componentWillUnmount do not. Because of this, trySubscribe happens during ...didMount.
        // Otherwise, unsubscription would never take place during SSR, causing a memory leak.
        // To handle the case where a child component may have triggered a state change by
        // dispatching an action in its componentWillMount, we have to re-run the select and maybe
        // re-render.
        this.subscription.trySubscribe();
        this.selector.run(this.props);
        if (this.selector.shouldComponentUpdate) this.forceUpdate();
      };

      Connect.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
        this.selector.run(nextProps);
      };

      Connect.prototype.shouldComponentUpdate = function shouldComponentUpdate() {
        return this.selector.shouldComponentUpdate;
      };

      Connect.prototype.componentWillUnmount = function componentWillUnmount() {
        if (this.subscription) this.subscription.tryUnsubscribe();
        this.subscription = null;
        this.notifyNestedSubs = noop$1;
        this.store = null;
        this.selector.run = noop$1;
        this.selector.shouldComponentUpdate = false;
      };

      Connect.prototype.getWrappedInstance = function getWrappedInstance() {
        invariant(withRef, 'To access the wrapped instance, you need to specify ' + ('{ withRef: true } in the options argument of the ' + methodName + '() call.'));
        return this.wrappedInstance;
      };

      Connect.prototype.setWrappedInstance = function setWrappedInstance(ref) {
        this.wrappedInstance = ref;
      };

      Connect.prototype.initSelector = function initSelector() {
        var sourceSelector = selectorFactory(this.store.dispatch, selectorFactoryOptions);
        this.selector = makeSelectorStateful(sourceSelector, this.store);
        this.selector.run(this.props);
      };

      Connect.prototype.initSubscription = function initSubscription() {
        if (!shouldHandleStateChanges) return;

        // parentSub's source should match where store came from: props vs. context. A component
        // connected to the store via props shouldn't use subscription from context, or vice versa.
        var parentSub = (this.propsMode ? this.props : this.context)[subscriptionKey];
        this.subscription = new Subscription(this.store, parentSub, this.onStateChange.bind(this));

        // `notifyNestedSubs` is duplicated to handle the case where the component is  unmounted in
        // the middle of the notification loop, where `this.subscription` will then be null. An
        // extra null check every change can be avoided by copying the method onto `this` and then
        // replacing it with a no-op on unmount. This can probably be avoided if Subscription's
        // listeners logic is changed to not call listeners that have been unsubscribed in the
        // middle of the notification loop.
        this.notifyNestedSubs = this.subscription.notifyNestedSubs.bind(this.subscription);
      };

      Connect.prototype.onStateChange = function onStateChange() {
        this.selector.run(this.props);

        if (!this.selector.shouldComponentUpdate) {
          this.notifyNestedSubs();
        } else {
          this.componentDidUpdate = this.notifyNestedSubsOnComponentDidUpdate;
          this.setState(dummyState);
        }
      };

      Connect.prototype.notifyNestedSubsOnComponentDidUpdate = function notifyNestedSubsOnComponentDidUpdate() {
        // `componentDidUpdate` is conditionally implemented when `onStateChange` determines it
        // needs to notify nested subs. Once called, it unimplements itself until further state
        // changes occur. Doing it this way vs having a permanent `componentDidUpdate` that does
        // a boolean check every time avoids an extra method call most of the time, resulting
        // in some perf boost.
        this.componentDidUpdate = undefined;
        this.notifyNestedSubs();
      };

      Connect.prototype.isSubscribed = function isSubscribed() {
        return Boolean(this.subscription) && this.subscription.isSubscribed();
      };

      Connect.prototype.addExtraProps = function addExtraProps(props) {
        if (!withRef && !renderCountProp && !(this.propsMode && this.subscription)) return props;
        // make a shallow copy so that fields added don't leak to the original selector.
        // this is especially important for 'ref' since that's a reference back to the component
        // instance. a singleton memoized selector would then be holding a reference to the
        // instance, preventing the instance from being garbage collected, and that would be bad
        var withExtras = _extends$10({}, props);
        if (withRef) withExtras.ref = this.setWrappedInstance;
        if (renderCountProp) withExtras[renderCountProp] = this.renderCount++;
        if (this.propsMode && this.subscription) withExtras[subscriptionKey] = this.subscription;
        return withExtras;
      };

      Connect.prototype.render = function render() {
        var selector = this.selector;
        selector.shouldComponentUpdate = false;

        if (selector.error) {
          throw selector.error;
        } else {
          return React.createElement(WrappedComponent, this.addExtraProps(selector.props));
        }
      };

      return Connect;
    }(React.Component);

    Connect.WrappedComponent = WrappedComponent;
    Connect.displayName = displayName;
    Connect.childContextTypes = childContextTypes;
    Connect.contextTypes = contextTypes;
    Connect.propTypes = contextTypes;

    if (process.env.NODE_ENV !== 'production') {
      Connect.prototype.componentWillUpdate = function componentWillUpdate() {
        var _this2 = this;

        // We are hot reloading!
        if (this.version !== version) {
          this.version = version;
          this.initSelector();

          // If any connected descendants don't hot reload (and resubscribe in the process), their
          // listeners will be lost when we unsubscribe. Unfortunately, by copying over all
          // listeners, this does mean that the old versions of connected descendants will still be
          // notified of state changes; however, their onStateChange function is a no-op so this
          // isn't a huge deal.
          var oldListeners = [];

          if (this.subscription) {
            oldListeners = this.subscription.listeners.get();
            this.subscription.tryUnsubscribe();
          }
          this.initSubscription();
          if (shouldHandleStateChanges) {
            this.subscription.trySubscribe();
            oldListeners.forEach(function (listener) {
              return _this2.subscription.listeners.subscribe(listener);
            });
          }
        }
      };
    }

    return hoistStatics(Connect, WrappedComponent);
  };
}

var hasOwn = Object.prototype.hasOwnProperty;

function is(x, y) {
  if (x === y) {
    return x !== 0 || y !== 0 || 1 / x === 1 / y;
  } else {
    return x !== x && y !== y;
  }
}

function shallowEqual(objA, objB) {
  if (is(objA, objB)) return true;

  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    return false;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) return false;

  for (var i = 0; i < keysA.length; i++) {
    if (!hasOwn.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
      return false;
    }
  }

  return true;
}

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root$1 = freeGlobal || freeSelf || Function('return this')();

/** Built-in value references. */
var Symbol$1 = root$1.Symbol;

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$1 = objectProto$1.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto$1.toString;

/** Built-in value references. */
var symToStringTag$1 = Symbol$1 ? Symbol$1.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty$1.call(value, symToStringTag$1),
      tag = value[symToStringTag$1];

  try {
    value[symToStringTag$1] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$1] = tag;
    } else {
      delete value[symToStringTag$1];
    }
  }
  return result;
}

/** Used for built-in method references. */
var objectProto$2 = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$1 = objectProto$2.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString$1.call(value);
}

/** `Object#toString` result references. */
var nullTag = '[object Null]';
var undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol$1 ? Symbol$1.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag$1(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/** Built-in value references. */
var getPrototype = overArg(Object.getPrototypeOf, Object);

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

/** `Object#toString` result references. */
var objectTag = '[object Object]';

/** Used for built-in method references. */
var funcProto = Function.prototype;
var objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString.call(Object);

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!isObjectLike(value) || baseGetTag$1(value) != objectTag) {
    return false;
  }
  var proto = getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
    funcToString.call(Ctor) == objectCtorString;
}

function symbolObservablePonyfill(root) {
	var result;
	var Symbol = root.Symbol;

	if (typeof Symbol === 'function') {
		if (Symbol.observable) {
			result = Symbol.observable;
		} else {
			result = Symbol('observable');
			Symbol.observable = result;
		}
	} else {
		result = '@@observable';
	}

	return result;
}

/* global window */
var root$3;

if (typeof self !== 'undefined') {
  root$3 = self;
} else if (typeof window !== 'undefined') {
  root$3 = window;
} else if (typeof global !== 'undefined') {
  root$3 = global;
} else if (typeof module !== 'undefined') {
  root$3 = module;
} else {
  root$3 = Function('return this')();
}

var result = symbolObservablePonyfill(root$3);

/**
 * These are private action types reserved by Redux.
 * For any unknown actions, you must return the current state.
 * If the current state is undefined, you must return the initial state.
 * Do not reference these action types directly in your code.
 */
var ActionTypes = {
  INIT: '@@redux/INIT'

  /**
   * Creates a Redux store that holds the state tree.
   * The only way to change the data in the store is to call `dispatch()` on it.
   *
   * There should only be a single store in your app. To specify how different
   * parts of the state tree respond to actions, you may combine several reducers
   * into a single reducer function by using `combineReducers`.
   *
   * @param {Function} reducer A function that returns the next state tree, given
   * the current state tree and the action to handle.
   *
   * @param {any} [preloadedState] The initial state. You may optionally specify it
   * to hydrate the state from the server in universal apps, or to restore a
   * previously serialized user session.
   * If you use `combineReducers` to produce the root reducer function, this must be
   * an object with the same shape as `combineReducers` keys.
   *
   * @param {Function} [enhancer] The store enhancer. You may optionally specify it
   * to enhance the store with third-party capabilities such as middleware,
   * time travel, persistence, etc. The only store enhancer that ships with Redux
   * is `applyMiddleware()`.
   *
   * @returns {Store} A Redux store that lets you read the state, dispatch actions
   * and subscribe to changes.
   */
};function createStore(reducer, preloadedState, enhancer) {
  var _ref2;

  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState;
    preloadedState = undefined;
  }

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.');
    }

    return enhancer(createStore)(reducer, preloadedState);
  }

  if (typeof reducer !== 'function') {
    throw new Error('Expected the reducer to be a function.');
  }

  var currentReducer = reducer;
  var currentState = preloadedState;
  var currentListeners = [];
  var nextListeners = currentListeners;
  var isDispatching = false;

  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }

  /**
   * Reads the state tree managed by the store.
   *
   * @returns {any} The current state tree of your application.
   */
  function getState() {
    return currentState;
  }

  /**
   * Adds a change listener. It will be called any time an action is dispatched,
   * and some part of the state tree may potentially have changed. You may then
   * call `getState()` to read the current state tree inside the callback.
   *
   * You may call `dispatch()` from a change listener, with the following
   * caveats:
   *
   * 1. The subscriptions are snapshotted just before every `dispatch()` call.
   * If you subscribe or unsubscribe while the listeners are being invoked, this
   * will not have any effect on the `dispatch()` that is currently in progress.
   * However, the next `dispatch()` call, whether nested or not, will use a more
   * recent snapshot of the subscription list.
   *
   * 2. The listener should not expect to see all state changes, as the state
   * might have been updated multiple times during a nested `dispatch()` before
   * the listener is called. It is, however, guaranteed that all subscribers
   * registered before the `dispatch()` started will be called with the latest
   * state by the time it exits.
   *
   * @param {Function} listener A callback to be invoked on every dispatch.
   * @returns {Function} A function to remove this change listener.
   */
  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Expected listener to be a function.');
    }

    var isSubscribed = true;

    ensureCanMutateNextListeners();
    nextListeners.push(listener);

    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }

      isSubscribed = false;

      ensureCanMutateNextListeners();
      var index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
    };
  }

  /**
   * Dispatches an action. It is the only way to trigger a state change.
   *
   * The `reducer` function, used to create the store, will be called with the
   * current state tree and the given `action`. Its return value will
   * be considered the **next** state of the tree, and the change listeners
   * will be notified.
   *
   * The base implementation only supports plain object actions. If you want to
   * dispatch a Promise, an Observable, a thunk, or something else, you need to
   * wrap your store creating function into the corresponding middleware. For
   * example, see the documentation for the `redux-thunk` package. Even the
   * middleware will eventually dispatch plain object actions using this method.
   *
   * @param {Object} action A plain object representing “what changed”. It is
   * a good idea to keep actions serializable so you can record and replay user
   * sessions, or use the time travelling `redux-devtools`. An action must have
   * a `type` property which may not be `undefined`. It is a good idea to use
   * string constants for action types.
   *
   * @returns {Object} For convenience, the same action object you dispatched.
   *
   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
   * return something else (for example, a Promise you can await).
   */
  function dispatch(action) {
    if (!isPlainObject(action)) {
      throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
    }

    if (typeof action.type === 'undefined') {
      throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
    }

    if (isDispatching) {
      throw new Error('Reducers may not dispatch actions.');
    }

    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }

    var listeners = currentListeners = nextListeners;
    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i];
      listener();
    }

    return action;
  }

  /**
   * Replaces the reducer currently used by the store to calculate the state.
   *
   * You might need this if your app implements code splitting and you want to
   * load some of the reducers dynamically. You might also need this if you
   * implement a hot reloading mechanism for Redux.
   *
   * @param {Function} nextReducer The reducer for the store to use instead.
   * @returns {void}
   */
  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== 'function') {
      throw new Error('Expected the nextReducer to be a function.');
    }

    currentReducer = nextReducer;
    dispatch({ type: ActionTypes.INIT });
  }

  /**
   * Interoperability point for observable/reactive libraries.
   * @returns {observable} A minimal observable of state changes.
   * For more information, see the observable proposal:
   * https://github.com/tc39/proposal-observable
   */
  function observable() {
    var _ref;

    var outerSubscribe = subscribe;
    return _ref = {
      /**
       * The minimal observable subscription method.
       * @param {Object} observer Any object that can be used as an observer.
       * The observer object should have a `next` method.
       * @returns {subscription} An object with an `unsubscribe` method that can
       * be used to unsubscribe the observable from the store, and prevent further
       * emission of values from the observable.
       */
      subscribe: function subscribe(observer) {
        if (typeof observer !== 'object') {
          throw new TypeError('Expected the observer to be an object.');
        }

        function observeState() {
          if (observer.next) {
            observer.next(getState());
          }
        }

        observeState();
        var unsubscribe = outerSubscribe(observeState);
        return { unsubscribe: unsubscribe };
      }
    }, _ref[result] = function () {
      return this;
    }, _ref;
  }

  // When a store is created, an "INIT" action is dispatched so that every
  // reducer returns their initial state. This effectively populates
  // the initial state tree.
  dispatch({ type: ActionTypes.INIT });

  return _ref2 = {
    dispatch: dispatch,
    subscribe: subscribe,
    getState: getState,
    replaceReducer: replaceReducer
  }, _ref2[result] = observable, _ref2;
}

/**
 * Prints a warning in the console if it exists.
 *
 * @param {String} message The warning message.
 * @returns {void}
 */
function warning$2(message) {
  /* eslint-disable no-console */
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error(message);
  }
  /* eslint-enable no-console */
  try {
    // This error was thrown as a convenience so that if you enable
    // "break on all exceptions" in your console,
    // it would pause the execution at this line.
    throw new Error(message);
    /* eslint-disable no-empty */
  } catch (e) {}
  /* eslint-enable no-empty */
}

function getUndefinedStateErrorMessage(key, action) {
  var actionType = action && action.type;
  var actionName = actionType && '"' + actionType.toString() + '"' || 'an action';

  return 'Given action ' + actionName + ', reducer "' + key + '" returned undefined. ' + 'To ignore an action, you must explicitly return the previous state. ' + 'If you want this reducer to hold no value, you can return null instead of undefined.';
}

function getUnexpectedStateShapeWarningMessage(inputState, reducers, action, unexpectedKeyCache) {
  var reducerKeys = Object.keys(reducers);
  var argumentName = action && action.type === ActionTypes.INIT ? 'preloadedState argument passed to createStore' : 'previous state received by the reducer';

  if (reducerKeys.length === 0) {
    return 'Store does not have a valid reducer. Make sure the argument passed ' + 'to combineReducers is an object whose values are reducers.';
  }

  if (!isPlainObject(inputState)) {
    return 'The ' + argumentName + ' has unexpected type of "' + {}.toString.call(inputState).match(/\s([a-z|A-Z]+)/)[1] + '". Expected argument to be an object with the following ' + ('keys: "' + reducerKeys.join('", "') + '"');
  }

  var unexpectedKeys = Object.keys(inputState).filter(function (key) {
    return !reducers.hasOwnProperty(key) && !unexpectedKeyCache[key];
  });

  unexpectedKeys.forEach(function (key) {
    unexpectedKeyCache[key] = true;
  });

  if (unexpectedKeys.length > 0) {
    return 'Unexpected ' + (unexpectedKeys.length > 1 ? 'keys' : 'key') + ' ' + ('"' + unexpectedKeys.join('", "') + '" found in ' + argumentName + '. ') + 'Expected to find one of the known reducer keys instead: ' + ('"' + reducerKeys.join('", "') + '". Unexpected keys will be ignored.');
  }
}

function assertReducerShape(reducers) {
  Object.keys(reducers).forEach(function (key) {
    var reducer = reducers[key];
    var initialState = reducer(undefined, { type: ActionTypes.INIT });

    if (typeof initialState === 'undefined') {
      throw new Error('Reducer "' + key + '" returned undefined during initialization. ' + 'If the state passed to the reducer is undefined, you must ' + 'explicitly return the initial state. The initial state may ' + 'not be undefined. If you don\'t want to set a value for this reducer, ' + 'you can use null instead of undefined.');
    }

    var type = '@@redux/PROBE_UNKNOWN_ACTION_' + Math.random().toString(36).substring(7).split('').join('.');
    if (typeof reducer(undefined, { type: type }) === 'undefined') {
      throw new Error('Reducer "' + key + '" returned undefined when probed with a random type. ' + ('Don\'t try to handle ' + ActionTypes.INIT + ' or other actions in "redux/*" ') + 'namespace. They are considered private. Instead, you must return the ' + 'current state for any unknown actions, unless it is undefined, ' + 'in which case you must return the initial state, regardless of the ' + 'action type. The initial state may not be undefined, but can be null.');
    }
  });
}

/**
 * Turns an object whose values are different reducer functions, into a single
 * reducer function. It will call every child reducer, and gather their results
 * into a single state object, whose keys correspond to the keys of the passed
 * reducer functions.
 *
 * @param {Object} reducers An object whose values correspond to different
 * reducer functions that need to be combined into one. One handy way to obtain
 * it is to use ES6 `import * as reducers` syntax. The reducers may never return
 * undefined for any action. Instead, they should return their initial state
 * if the state passed to them was undefined, and the current state for any
 * unrecognized action.
 *
 * @returns {Function} A reducer function that invokes every reducer inside the
 * passed object, and builds a state object with the same shape.
 */
function combineReducers(reducers) {
  var reducerKeys = Object.keys(reducers);
  var finalReducers = {};
  for (var i = 0; i < reducerKeys.length; i++) {
    var key = reducerKeys[i];

    if (process.env.NODE_ENV !== 'production') {
      if (typeof reducers[key] === 'undefined') {
        warning$2('No reducer provided for key "' + key + '"');
      }
    }

    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key];
    }
  }
  var finalReducerKeys = Object.keys(finalReducers);

  var unexpectedKeyCache = void 0;
  if (process.env.NODE_ENV !== 'production') {
    unexpectedKeyCache = {};
  }

  var shapeAssertionError = void 0;
  try {
    assertReducerShape(finalReducers);
  } catch (e) {
    shapeAssertionError = e;
  }

  return function combination() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var action = arguments[1];

    if (shapeAssertionError) {
      throw shapeAssertionError;
    }

    if (process.env.NODE_ENV !== 'production') {
      var warningMessage = getUnexpectedStateShapeWarningMessage(state, finalReducers, action, unexpectedKeyCache);
      if (warningMessage) {
        warning$2(warningMessage);
      }
    }

    var hasChanged = false;
    var nextState = {};
    for (var _i = 0; _i < finalReducerKeys.length; _i++) {
      var _key = finalReducerKeys[_i];
      var reducer = finalReducers[_key];
      var previousStateForKey = state[_key];
      var nextStateForKey = reducer(previousStateForKey, action);
      if (typeof nextStateForKey === 'undefined') {
        var errorMessage = getUndefinedStateErrorMessage(_key, action);
        throw new Error(errorMessage);
      }
      nextState[_key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }
    return hasChanged ? nextState : state;
  };
}

function bindActionCreator(actionCreator, dispatch) {
  return function () {
    return dispatch(actionCreator.apply(undefined, arguments));
  };
}

/**
 * Turns an object whose values are action creators, into an object with the
 * same keys, but with every function wrapped into a `dispatch` call so they
 * may be invoked directly. This is just a convenience method, as you can call
 * `store.dispatch(MyActionCreators.doSomething())` yourself just fine.
 *
 * For convenience, you can also pass a single function as the first argument,
 * and get a function in return.
 *
 * @param {Function|Object} actionCreators An object whose values are action
 * creator functions. One handy way to obtain it is to use ES6 `import * as`
 * syntax. You may also pass a single function.
 *
 * @param {Function} dispatch The `dispatch` function available on your Redux
 * store.
 *
 * @returns {Function|Object} The object mimicking the original object, but with
 * every action creator wrapped into the `dispatch` call. If you passed a
 * function as `actionCreators`, the return value will also be a single
 * function.
 */
function bindActionCreators(actionCreators, dispatch) {
  if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch);
  }

  if (typeof actionCreators !== 'object' || actionCreators === null) {
    throw new Error('bindActionCreators expected an object or a function, instead received ' + (actionCreators === null ? 'null' : typeof actionCreators) + '. ' + 'Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?');
  }

  var keys = Object.keys(actionCreators);
  var boundActionCreators = {};
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var actionCreator = actionCreators[key];
    if (typeof actionCreator === 'function') {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
    }
  }
  return boundActionCreators;
}

/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for
 * the resulting composite function.
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing the argument functions
 * from right to left. For example, compose(f, g, h) is identical to doing
 * (...args) => f(g(h(...args))).
 */

/*
* This is a dummy function to check if the function name has been altered by minification.
* If the function has been minified and NODE_ENV !== 'production', warn the user.
*/
function isCrushed() {}

if (process.env.NODE_ENV !== 'production' && typeof isCrushed.name === 'string' && isCrushed.name !== 'isCrushed') {
  warning$2('You are currently using minified code outside of NODE_ENV === \'production\'. ' + 'This means that you are running a slower development build of Redux. ' + 'You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify ' + 'or DefinePlugin for webpack (http://stackoverflow.com/questions/30030031) ' + 'to ensure you have the correct code for your production build.');
}

function verifyPlainObject(value, displayName, methodName) {
  if (!isPlainObject(value)) {
    warning$1(methodName + '() in ' + displayName + ' must return a plain object. Instead received ' + value + '.');
  }
}

function wrapMapToPropsConstant(getConstant) {
  return function initConstantSelector(dispatch, options) {
    var constant = getConstant(dispatch, options);

    function constantSelector() {
      return constant;
    }
    constantSelector.dependsOnOwnProps = false;
    return constantSelector;
  };
}

// dependsOnOwnProps is used by createMapToPropsProxy to determine whether to pass props as args
// to the mapToProps function being wrapped. It is also used by makePurePropsSelector to determine
// whether mapToProps needs to be invoked when props have changed.
// 
// A length of one signals that mapToProps does not depend on props from the parent component.
// A length of zero is assumed to mean mapToProps is getting args via arguments or ...args and
// therefore not reporting its length accurately..
function getDependsOnOwnProps(mapToProps) {
  return mapToProps.dependsOnOwnProps !== null && mapToProps.dependsOnOwnProps !== undefined ? Boolean(mapToProps.dependsOnOwnProps) : mapToProps.length !== 1;
}

// Used by whenMapStateToPropsIsFunction and whenMapDispatchToPropsIsFunction,
// this function wraps mapToProps in a proxy function which does several things:
// 
//  * Detects whether the mapToProps function being called depends on props, which
//    is used by selectorFactory to decide if it should reinvoke on props changes.
//    
//  * On first call, handles mapToProps if returns another function, and treats that
//    new function as the true mapToProps for subsequent calls.
//    
//  * On first call, verifies the first result is a plain object, in order to warn
//    the developer that their mapToProps function is not returning a valid result.
//    
function wrapMapToPropsFunc(mapToProps, methodName) {
  return function initProxySelector(dispatch, _ref) {
    var displayName = _ref.displayName;

    var proxy = function mapToPropsProxy(stateOrDispatch, ownProps) {
      return proxy.dependsOnOwnProps ? proxy.mapToProps(stateOrDispatch, ownProps) : proxy.mapToProps(stateOrDispatch);
    };

    // allow detectFactoryAndVerify to get ownProps
    proxy.dependsOnOwnProps = true;

    proxy.mapToProps = function detectFactoryAndVerify(stateOrDispatch, ownProps) {
      proxy.mapToProps = mapToProps;
      proxy.dependsOnOwnProps = getDependsOnOwnProps(mapToProps);
      var props = proxy(stateOrDispatch, ownProps);

      if (typeof props === 'function') {
        proxy.mapToProps = props;
        proxy.dependsOnOwnProps = getDependsOnOwnProps(props);
        props = proxy(stateOrDispatch, ownProps);
      }

      if (process.env.NODE_ENV !== 'production') verifyPlainObject(props, displayName, methodName);

      return props;
    };

    return proxy;
  };
}

function whenMapDispatchToPropsIsFunction(mapDispatchToProps) {
  return typeof mapDispatchToProps === 'function' ? wrapMapToPropsFunc(mapDispatchToProps, 'mapDispatchToProps') : undefined;
}

function whenMapDispatchToPropsIsMissing(mapDispatchToProps) {
  return !mapDispatchToProps ? wrapMapToPropsConstant(function (dispatch) {
    return { dispatch: dispatch };
  }) : undefined;
}

function whenMapDispatchToPropsIsObject(mapDispatchToProps) {
  return mapDispatchToProps && typeof mapDispatchToProps === 'object' ? wrapMapToPropsConstant(function (dispatch) {
    return bindActionCreators(mapDispatchToProps, dispatch);
  }) : undefined;
}

var defaultMapDispatchToPropsFactories = [whenMapDispatchToPropsIsFunction, whenMapDispatchToPropsIsMissing, whenMapDispatchToPropsIsObject];

function whenMapStateToPropsIsFunction(mapStateToProps) {
  return typeof mapStateToProps === 'function' ? wrapMapToPropsFunc(mapStateToProps, 'mapStateToProps') : undefined;
}

function whenMapStateToPropsIsMissing(mapStateToProps) {
  return !mapStateToProps ? wrapMapToPropsConstant(function () {
    return {};
  }) : undefined;
}

var defaultMapStateToPropsFactories = [whenMapStateToPropsIsFunction, whenMapStateToPropsIsMissing];

var _extends$13 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function defaultMergeProps(stateProps, dispatchProps, ownProps) {
  return _extends$13({}, ownProps, stateProps, dispatchProps);
}

function wrapMergePropsFunc(mergeProps) {
  return function initMergePropsProxy(dispatch, _ref) {
    var displayName = _ref.displayName,
        pure = _ref.pure,
        areMergedPropsEqual = _ref.areMergedPropsEqual;

    var hasRunOnce = false;
    var mergedProps = void 0;

    return function mergePropsProxy(stateProps, dispatchProps, ownProps) {
      var nextMergedProps = mergeProps(stateProps, dispatchProps, ownProps);

      if (hasRunOnce) {
        if (!pure || !areMergedPropsEqual(nextMergedProps, mergedProps)) mergedProps = nextMergedProps;
      } else {
        hasRunOnce = true;
        mergedProps = nextMergedProps;

        if (process.env.NODE_ENV !== 'production') verifyPlainObject(mergedProps, displayName, 'mergeProps');
      }

      return mergedProps;
    };
  };
}

function whenMergePropsIsFunction(mergeProps) {
  return typeof mergeProps === 'function' ? wrapMergePropsFunc(mergeProps) : undefined;
}

function whenMergePropsIsOmitted(mergeProps) {
  return !mergeProps ? function () {
    return defaultMergeProps;
  } : undefined;
}

var defaultMergePropsFactories = [whenMergePropsIsFunction, whenMergePropsIsOmitted];

function verify(selector, methodName, displayName) {
  if (!selector) {
    throw new Error('Unexpected value for ' + methodName + ' in ' + displayName + '.');
  } else if (methodName === 'mapStateToProps' || methodName === 'mapDispatchToProps') {
    if (!selector.hasOwnProperty('dependsOnOwnProps')) {
      warning$1('The selector for ' + methodName + ' of ' + displayName + ' did not specify a value for dependsOnOwnProps.');
    }
  }
}

function verifySubselectors(mapStateToProps, mapDispatchToProps, mergeProps, displayName) {
  verify(mapStateToProps, 'mapStateToProps', displayName);
  verify(mapDispatchToProps, 'mapDispatchToProps', displayName);
  verify(mergeProps, 'mergeProps', displayName);
}

function _objectWithoutProperties$6(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function impureFinalPropsSelectorFactory(mapStateToProps, mapDispatchToProps, mergeProps, dispatch) {
  return function impureFinalPropsSelector(state, ownProps) {
    return mergeProps(mapStateToProps(state, ownProps), mapDispatchToProps(dispatch, ownProps), ownProps);
  };
}

function pureFinalPropsSelectorFactory(mapStateToProps, mapDispatchToProps, mergeProps, dispatch, _ref) {
  var areStatesEqual = _ref.areStatesEqual,
      areOwnPropsEqual = _ref.areOwnPropsEqual,
      areStatePropsEqual = _ref.areStatePropsEqual;

  var hasRunAtLeastOnce = false;
  var state = void 0;
  var ownProps = void 0;
  var stateProps = void 0;
  var dispatchProps = void 0;
  var mergedProps = void 0;

  function handleFirstCall(firstState, firstOwnProps) {
    state = firstState;
    ownProps = firstOwnProps;
    stateProps = mapStateToProps(state, ownProps);
    dispatchProps = mapDispatchToProps(dispatch, ownProps);
    mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
    hasRunAtLeastOnce = true;
    return mergedProps;
  }

  function handleNewPropsAndNewState() {
    stateProps = mapStateToProps(state, ownProps);

    if (mapDispatchToProps.dependsOnOwnProps) dispatchProps = mapDispatchToProps(dispatch, ownProps);

    mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
    return mergedProps;
  }

  function handleNewProps() {
    if (mapStateToProps.dependsOnOwnProps) stateProps = mapStateToProps(state, ownProps);

    if (mapDispatchToProps.dependsOnOwnProps) dispatchProps = mapDispatchToProps(dispatch, ownProps);

    mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
    return mergedProps;
  }

  function handleNewState() {
    var nextStateProps = mapStateToProps(state, ownProps);
    var statePropsChanged = !areStatePropsEqual(nextStateProps, stateProps);
    stateProps = nextStateProps;

    if (statePropsChanged) mergedProps = mergeProps(stateProps, dispatchProps, ownProps);

    return mergedProps;
  }

  function handleSubsequentCalls(nextState, nextOwnProps) {
    var propsChanged = !areOwnPropsEqual(nextOwnProps, ownProps);
    var stateChanged = !areStatesEqual(nextState, state);
    state = nextState;
    ownProps = nextOwnProps;

    if (propsChanged && stateChanged) return handleNewPropsAndNewState();
    if (propsChanged) return handleNewProps();
    if (stateChanged) return handleNewState();
    return mergedProps;
  }

  return function pureFinalPropsSelector(nextState, nextOwnProps) {
    return hasRunAtLeastOnce ? handleSubsequentCalls(nextState, nextOwnProps) : handleFirstCall(nextState, nextOwnProps);
  };
}

// TODO: Add more comments

// If pure is true, the selector returned by selectorFactory will memoize its results,
// allowing connectAdvanced's shouldComponentUpdate to return false if final
// props have not changed. If false, the selector will always return a new
// object and shouldComponentUpdate will always return true.

function finalPropsSelectorFactory(dispatch, _ref2) {
  var initMapStateToProps = _ref2.initMapStateToProps,
      initMapDispatchToProps = _ref2.initMapDispatchToProps,
      initMergeProps = _ref2.initMergeProps,
      options = _objectWithoutProperties$6(_ref2, ['initMapStateToProps', 'initMapDispatchToProps', 'initMergeProps']);

  var mapStateToProps = initMapStateToProps(dispatch, options);
  var mapDispatchToProps = initMapDispatchToProps(dispatch, options);
  var mergeProps = initMergeProps(dispatch, options);

  if (process.env.NODE_ENV !== 'production') {
    verifySubselectors(mapStateToProps, mapDispatchToProps, mergeProps, options.displayName);
  }

  var selectorFactory = options.pure ? pureFinalPropsSelectorFactory : impureFinalPropsSelectorFactory;

  return selectorFactory(mapStateToProps, mapDispatchToProps, mergeProps, dispatch, options);
}

var _extends$11 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties$5(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

/*
  connect is a facade over connectAdvanced. It turns its args into a compatible
  selectorFactory, which has the signature:

    (dispatch, options) => (nextState, nextOwnProps) => nextFinalProps
  
  connect passes its args to connectAdvanced as options, which will in turn pass them to
  selectorFactory each time a Connect component instance is instantiated or hot reloaded.

  selectorFactory returns a final props selector from its mapStateToProps,
  mapStateToPropsFactories, mapDispatchToProps, mapDispatchToPropsFactories, mergeProps,
  mergePropsFactories, and pure args.

  The resulting final props selector is called by the Connect component instance whenever
  it receives new props or store state.
 */

function match(arg, factories, name) {
  for (var i = factories.length - 1; i >= 0; i--) {
    var result = factories[i](arg);
    if (result) return result;
  }

  return function (dispatch, options) {
    throw new Error('Invalid value of type ' + typeof arg + ' for ' + name + ' argument when connecting component ' + options.wrappedComponentName + '.');
  };
}

function strictEqual(a, b) {
  return a === b;
}

// createConnect with default args builds the 'official' connect behavior. Calling it with
// different options opens up some testing and extensibility scenarios
function createConnect() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$connectHOC = _ref.connectHOC,
      connectHOC = _ref$connectHOC === undefined ? connectAdvanced : _ref$connectHOC,
      _ref$mapStateToPropsF = _ref.mapStateToPropsFactories,
      mapStateToPropsFactories = _ref$mapStateToPropsF === undefined ? defaultMapStateToPropsFactories : _ref$mapStateToPropsF,
      _ref$mapDispatchToPro = _ref.mapDispatchToPropsFactories,
      mapDispatchToPropsFactories = _ref$mapDispatchToPro === undefined ? defaultMapDispatchToPropsFactories : _ref$mapDispatchToPro,
      _ref$mergePropsFactor = _ref.mergePropsFactories,
      mergePropsFactories = _ref$mergePropsFactor === undefined ? defaultMergePropsFactories : _ref$mergePropsFactor,
      _ref$selectorFactory = _ref.selectorFactory,
      selectorFactory = _ref$selectorFactory === undefined ? finalPropsSelectorFactory : _ref$selectorFactory;

  return function connect(mapStateToProps, mapDispatchToProps, mergeProps) {
    var _ref2 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
        _ref2$pure = _ref2.pure,
        pure = _ref2$pure === undefined ? true : _ref2$pure,
        _ref2$areStatesEqual = _ref2.areStatesEqual,
        areStatesEqual = _ref2$areStatesEqual === undefined ? strictEqual : _ref2$areStatesEqual,
        _ref2$areOwnPropsEqua = _ref2.areOwnPropsEqual,
        areOwnPropsEqual = _ref2$areOwnPropsEqua === undefined ? shallowEqual : _ref2$areOwnPropsEqua,
        _ref2$areStatePropsEq = _ref2.areStatePropsEqual,
        areStatePropsEqual = _ref2$areStatePropsEq === undefined ? shallowEqual : _ref2$areStatePropsEq,
        _ref2$areMergedPropsE = _ref2.areMergedPropsEqual,
        areMergedPropsEqual = _ref2$areMergedPropsE === undefined ? shallowEqual : _ref2$areMergedPropsE,
        extraOptions = _objectWithoutProperties$5(_ref2, ['pure', 'areStatesEqual', 'areOwnPropsEqual', 'areStatePropsEqual', 'areMergedPropsEqual']);

    var initMapStateToProps = match(mapStateToProps, mapStateToPropsFactories, 'mapStateToProps');
    var initMapDispatchToProps = match(mapDispatchToProps, mapDispatchToPropsFactories, 'mapDispatchToProps');
    var initMergeProps = match(mergeProps, mergePropsFactories, 'mergeProps');

    return connectHOC(selectorFactory, _extends$11({
      // used in error messages
      methodName: 'connect',

      // used to compute Connect's displayName from the wrapped component's displayName.
      getDisplayName: function getDisplayName(name) {
        return 'Connect(' + name + ')';
      },

      // if mapStateToProps is falsy, the Connect component doesn't subscribe to store state changes
      shouldHandleStateChanges: Boolean(mapStateToProps),

      // passed through to selectorFactory
      initMapStateToProps: initMapStateToProps,
      initMapDispatchToProps: initMapDispatchToProps,
      initMergeProps: initMergeProps,
      pure: pure,
      areStatesEqual: areStatesEqual,
      areOwnPropsEqual: areOwnPropsEqual,
      areStatePropsEqual: areStatePropsEqual,
      areMergedPropsEqual: areMergedPropsEqual

    }, extraOptions));
  };
}

var connect = createConnect();

var prefix = '@@redux-form/';

var ARRAY_INSERT = prefix + 'ARRAY_INSERT';
var ARRAY_MOVE = prefix + 'ARRAY_MOVE';
var ARRAY_POP = prefix + 'ARRAY_POP';
var ARRAY_PUSH = prefix + 'ARRAY_PUSH';
var ARRAY_REMOVE = prefix + 'ARRAY_REMOVE';
var ARRAY_REMOVE_ALL = prefix + 'ARRAY_REMOVE_ALL';
var ARRAY_SHIFT = prefix + 'ARRAY_SHIFT';
var ARRAY_SPLICE = prefix + 'ARRAY_SPLICE';
var ARRAY_UNSHIFT = prefix + 'ARRAY_UNSHIFT';
var ARRAY_SWAP = prefix + 'ARRAY_SWAP';
var AUTOFILL = prefix + 'AUTOFILL';
var BLUR = prefix + 'BLUR';
var CHANGE = prefix + 'CHANGE';
var CLEAR_SUBMIT = prefix + 'CLEAR_SUBMIT';
var CLEAR_SUBMIT_ERRORS = prefix + 'CLEAR_SUBMIT_ERRORS';
var CLEAR_ASYNC_ERROR = prefix + 'CLEAR_ASYNC_ERROR';
var DESTROY = prefix + 'DESTROY';
var FOCUS = prefix + 'FOCUS';
var INITIALIZE = prefix + 'INITIALIZE';
var REGISTER_FIELD = prefix + 'REGISTER_FIELD';
var RESET = prefix + 'RESET';
var SET_SUBMIT_FAILED = prefix + 'SET_SUBMIT_FAILED';
var SET_SUBMIT_SUCCEEDED = prefix + 'SET_SUBMIT_SUCCEEDED';
var START_ASYNC_VALIDATION = prefix + 'START_ASYNC_VALIDATION';
var START_SUBMIT = prefix + 'START_SUBMIT';
var STOP_ASYNC_VALIDATION = prefix + 'STOP_ASYNC_VALIDATION';
var STOP_SUBMIT = prefix + 'STOP_SUBMIT';
var SUBMIT = prefix + 'SUBMIT';
var TOUCH = prefix + 'TOUCH';
var UNREGISTER_FIELD = prefix + 'UNREGISTER_FIELD';
var UNTOUCH = prefix + 'UNTOUCH';
var UPDATE_SYNC_ERRORS = prefix + 'UPDATE_SYNC_ERRORS';
var UPDATE_SYNC_WARNINGS = prefix + 'UPDATE_SYNC_WARNINGS';

var _extends$14 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var arrayInsert$1 = function arrayInsert(form, field, index, value) {
  return {
    type: ARRAY_INSERT,
    meta: { form: form, field: field, index: index },
    payload: value
  };
};

var arrayMove$1 = function arrayMove(form, field, from, to) {
  return {
    type: ARRAY_MOVE,
    meta: { form: form, field: field, from: from, to: to }
  };
};

var arrayPop$1 = function arrayPop(form, field) {
  return {
    type: ARRAY_POP,
    meta: { form: form, field: field }
  };
};

var arrayPush$1 = function arrayPush(form, field, value) {
  return {
    type: ARRAY_PUSH,
    meta: { form: form, field: field },
    payload: value
  };
};

var arrayRemove$1 = function arrayRemove(form, field, index) {
  return {
    type: ARRAY_REMOVE,
    meta: { form: form, field: field, index: index }
  };
};

var arrayRemoveAll$1 = function arrayRemoveAll(form, field) {
  return {
    type: ARRAY_REMOVE_ALL,
    meta: { form: form, field: field }
  };
};

var arrayShift$1 = function arrayShift(form, field) {
  return {
    type: ARRAY_SHIFT,
    meta: { form: form, field: field }
  };
};

var arraySplice$1 = function arraySplice(form, field, index, removeNum, value) {
  var action = {
    type: ARRAY_SPLICE,
    meta: { form: form, field: field, index: index, removeNum: removeNum }
  };
  if (value !== undefined) {
    action.payload = value;
  }
  return action;
};

var arraySwap$1 = function arraySwap(form, field, indexA, indexB) {
  if (indexA === indexB) {
    throw new Error('Swap indices cannot be equal');
  }
  if (indexA < 0 || indexB < 0) {
    throw new Error('Swap indices cannot be negative');
  }
  return { type: ARRAY_SWAP, meta: { form: form, field: field, indexA: indexA, indexB: indexB } };
};

var arrayUnshift$1 = function arrayUnshift(form, field, value) {
  return {
    type: ARRAY_UNSHIFT,
    meta: { form: form, field: field },
    payload: value
  };
};

var autofill$1 = function autofill(form, field, value) {
  return {
    type: AUTOFILL,
    meta: { form: form, field: field },
    payload: value
  };
};

var blur$1 = function blur(form, field, value, touch) {
  return {
    type: BLUR,
    meta: { form: form, field: field, touch: touch },
    payload: value
  };
};

var change$1 = function change(form, field, value, touch, persistentSubmitErrors) {
  return {
    type: CHANGE,
    meta: { form: form, field: field, touch: touch, persistentSubmitErrors: persistentSubmitErrors },
    payload: value
  };
};

var clearSubmit = function clearSubmit(form) {
  return {
    type: CLEAR_SUBMIT,
    meta: { form: form }
  };
};

var clearSubmitErrors$1 = function clearSubmitErrors(form) {
  return {
    type: CLEAR_SUBMIT_ERRORS,
    meta: { form: form }
  };
};

var clearAsyncError = function clearAsyncError(form, field) {
  return {
    type: CLEAR_ASYNC_ERROR,
    meta: { form: form, field: field }
  };
};

var destroy$1 = function destroy() {
  for (var _len = arguments.length, form = Array(_len), _key = 0; _key < _len; _key++) {
    form[_key] = arguments[_key];
  }

  return {
    type: DESTROY,
    meta: { form: form }
  };
};

var focus$1 = function focus(form, field) {
  return {
    type: FOCUS,
    meta: { form: form, field: field }
  };
};

var initialize$1 = function initialize(form, values, keepDirty) {
  var otherMeta = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  if (keepDirty instanceof Object) {
    otherMeta = keepDirty;
    keepDirty = false;
  }
  return {
    type: INITIALIZE,
    meta: _extends$14({ form: form, keepDirty: keepDirty }, otherMeta),
    payload: values
  };
};

var registerField$1 = function registerField(form, name, type) {
  return {
    type: REGISTER_FIELD,
    meta: { form: form },
    payload: { name: name, type: type }
  };
};

var reset$1 = function reset(form) {
  return {
    type: RESET,
    meta: { form: form }
  };
};

var startAsyncValidation$1 = function startAsyncValidation(form, field) {
  return {
    type: START_ASYNC_VALIDATION,
    meta: { form: form, field: field }
  };
};

var startSubmit$1 = function startSubmit(form) {
  return {
    type: START_SUBMIT,
    meta: { form: form }
  };
};

var stopAsyncValidation$1 = function stopAsyncValidation(form, errors) {
  return {
    type: STOP_ASYNC_VALIDATION,
    meta: { form: form },
    payload: errors,
    error: !!(errors && Object.keys(errors).length)
  };
};

var stopSubmit$1 = function stopSubmit(form, errors) {
  return {
    type: STOP_SUBMIT,
    meta: { form: form },
    payload: errors,
    error: !!(errors && Object.keys(errors).length)
  };
};

var submit$1 = function submit(form) {
  return {
    type: SUBMIT,
    meta: { form: form }
  };
};

var setSubmitFailed$1 = function setSubmitFailed(form) {
  for (var _len2 = arguments.length, fields = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    fields[_key2 - 1] = arguments[_key2];
  }

  return {
    type: SET_SUBMIT_FAILED,
    meta: { form: form, fields: fields },
    error: true
  };
};

var setSubmitSucceeded$1 = function setSubmitSucceeded(form) {
  for (var _len3 = arguments.length, fields = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    fields[_key3 - 1] = arguments[_key3];
  }

  return {
    type: SET_SUBMIT_SUCCEEDED,
    meta: { form: form, fields: fields },
    error: false
  };
};

var touch$1 = function touch(form) {
  for (var _len4 = arguments.length, fields = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
    fields[_key4 - 1] = arguments[_key4];
  }

  return {
    type: TOUCH,
    meta: { form: form, fields: fields }
  };
};

var unregisterField$1 = function unregisterField(form, name) {
  var destroyOnUnmount = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  return {
    type: UNREGISTER_FIELD,
    meta: { form: form },
    payload: { name: name, destroyOnUnmount: destroyOnUnmount }
  };
};

var untouch$1 = function untouch(form) {
  for (var _len5 = arguments.length, fields = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
    fields[_key5 - 1] = arguments[_key5];
  }

  return {
    type: UNTOUCH,
    meta: { form: form, fields: fields }
  };
};

var updateSyncErrors = function updateSyncErrors(form) {
  var syncErrors = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var error = arguments[2];
  return {
    type: UPDATE_SYNC_ERRORS,
    meta: { form: form },
    payload: { syncErrors: syncErrors, error: error }
  };
};

var updateSyncWarnings = function updateSyncWarnings(form) {
  var syncWarnings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var warning$$1 = arguments[2];
  return {
    type: UPDATE_SYNC_WARNINGS,
    meta: { form: form },
    payload: { syncWarnings: syncWarnings, warning: warning$$1 }
  };
};

var actions = {
  arrayInsert: arrayInsert$1,
  arrayMove: arrayMove$1,
  arrayPop: arrayPop$1,
  arrayPush: arrayPush$1,
  arrayRemove: arrayRemove$1,
  arrayRemoveAll: arrayRemoveAll$1,
  arrayShift: arrayShift$1,
  arraySplice: arraySplice$1,
  arraySwap: arraySwap$1,
  arrayUnshift: arrayUnshift$1,
  autofill: autofill$1,
  blur: blur$1,
  change: change$1,
  clearSubmit: clearSubmit,
  clearSubmitErrors: clearSubmitErrors$1,
  clearAsyncError: clearAsyncError,
  destroy: destroy$1,
  focus: focus$1,
  initialize: initialize$1,
  registerField: registerField$1,
  reset: reset$1,
  startAsyncValidation: startAsyncValidation$1,
  startSubmit: startSubmit$1,
  stopAsyncValidation: stopAsyncValidation$1,
  stopSubmit: stopSubmit$1,
  submit: submit$1,
  setSubmitFailed: setSubmitFailed$1,
  setSubmitSucceeded: setSubmitSucceeded$1,
  touch: touch$1,
  unregisterField: unregisterField$1,
  untouch: untouch$1,
  updateSyncErrors: updateSyncErrors,
  updateSyncWarnings: updateSyncWarnings
};

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$13(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$12(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$12(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Form = function (_Component) {
  _inherits$12(Form, _Component);

  function Form(props, context) {
    _classCallCheck$13(this, Form);

    var _this = _possibleConstructorReturn$12(this, (Form.__proto__ || Object.getPrototypeOf(Form)).call(this, props, context));

    if (!context._reduxForm) {
      throw new Error('Form must be inside a component decorated with reduxForm()');
    }
    return _this;
  }

  _createClass(Form, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.context._reduxForm.registerInnerOnSubmit(this.props.onSubmit);
    }
  }, {
    key: 'render',
    value: function render() {
      return React__default.createElement('form', this.props);
    }
  }]);

  return Form;
}(React.Component);

Form.propTypes = {
  onSubmit: PropTypes.func.isRequired
};
Form.contextTypes = {
  _reduxForm: PropTypes.object
};

var formatName$1 = function formatName(_ref, name) {
  var sectionPrefix = _ref._reduxForm.sectionPrefix;
  return sectionPrefix ? sectionPrefix + '.' + name : name;
};

var _extends$15 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass$1 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _objectWithoutProperties$7(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck$14(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$13(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$13(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FormSection = function (_Component) {
  _inherits$13(FormSection, _Component);

  function FormSection(props, context) {
    _classCallCheck$14(this, FormSection);

    var _this = _possibleConstructorReturn$13(this, (FormSection.__proto__ || Object.getPrototypeOf(FormSection)).call(this, props, context));

    if (!context._reduxForm) {
      throw new Error('FormSection must be inside a component decorated with reduxForm()');
    }
    return _this;
  }

  _createClass$1(FormSection, [{
    key: 'getChildContext',
    value: function getChildContext() {
      var context = this.context,
          name = this.props.name;

      return {
        _reduxForm: _extends$15({}, context._reduxForm, {
          sectionPrefix: formatName$1(context, name)
        })
      };
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          children = _props.children,
          name = _props.name,
          component = _props.component,
          rest = _objectWithoutProperties$7(_props, ['children', 'name', 'component']);

      if (React__default.isValidElement(children)) {
        return children;
      }

      return React.createElement(component, _extends$15({}, rest, {
        children: children
      }));
    }
  }]);

  return FormSection;
}(React.Component);

FormSection.propTypes = {
  name: PropTypes.string.isRequired,
  component: PropTypes.oneOfType([PropTypes.func, PropTypes.string])
};

FormSection.defaultProps = {
  component: 'div'
};

FormSection.childContextTypes = {
  _reduxForm: PropTypes.object.isRequired
};

FormSection.contextTypes = {
  _reduxForm: PropTypes.object
};

function _classCallCheck$16(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$15(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$15(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _extendableBuiltin(cls) {
  function ExtendableBuiltin() {
    cls.apply(this, arguments);
  }

  ExtendableBuiltin.prototype = Object.create(cls.prototype, {
    constructor: {
      value: cls,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });

  if (Object.setPrototypeOf) {
    Object.setPrototypeOf(ExtendableBuiltin, cls);
  } else {
    ExtendableBuiltin.__proto__ = cls;
  }

  return ExtendableBuiltin;
}

var ExtendableError = function (_extendableBuiltin2) {
  _inherits$15(ExtendableError, _extendableBuiltin2);

  function ExtendableError() {
    var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    _classCallCheck$16(this, ExtendableError);

    // extending Error is weird and does not propagate `message`
    var _this = _possibleConstructorReturn$15(this, (ExtendableError.__proto__ || Object.getPrototypeOf(ExtendableError)).call(this, message));

    Object.defineProperty(_this, 'message', {
      configurable: true,
      enumerable: false,
      value: message,
      writable: true
    });

    Object.defineProperty(_this, 'name', {
      configurable: true,
      enumerable: false,
      value: _this.constructor.name,
      writable: true
    });

    if (Error.hasOwnProperty('captureStackTrace')) {
      Error.captureStackTrace(_this, _this.constructor);
      return _possibleConstructorReturn$15(_this);
    }

    Object.defineProperty(_this, 'stack', {
      configurable: true,
      enumerable: false,
      value: new Error(message).stack,
      writable: true
    });
    return _this;
  }

  return ExtendableError;
}(_extendableBuiltin(Error));

function _classCallCheck$15(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$14(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$14(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SubmissionError = function (_ExtendableError) {
  _inherits$14(SubmissionError, _ExtendableError);

  function SubmissionError(errors) {
    _classCallCheck$15(this, SubmissionError);

    var _this = _possibleConstructorReturn$14(this, (SubmissionError.__proto__ || Object.getPrototypeOf(SubmissionError)).call(this, 'Submit Validation Failed'));

    _this.errors = errors;
    return _this;
  }

  return SubmissionError;
}(ExtendableError);

var any = PropTypes.any;
var bool = PropTypes.bool;
var func = PropTypes.func;
var shape = PropTypes.shape;
var string = PropTypes.string;
var oneOfType = PropTypes.oneOfType;
var object = PropTypes.object;


var formPropTypes = {
  // State:
  anyTouched: bool.isRequired, // true if any of the fields have been marked as touched
  asyncValidating: oneOfType([bool, string]).isRequired, // true if async validation is running, a string if a field triggered async validation
  dirty: bool.isRequired, // true if any values are different from initialValues
  error: any, // form-wide error from '_error' key in validation result
  form: string.isRequired, // the name of the form
  invalid: bool.isRequired, // true if there are any validation errors
  initialized: bool.isRequired, // true if the form has been initialized
  initialValues: object, // the initialValues object passed to reduxForm
  pristine: bool.isRequired, // true if the values are the same as initialValues
  pure: bool.isRequired, // if true, implements shouldComponentUpdate
  submitting: bool.isRequired, // true if the form is in the process of being submitted
  submitFailed: bool.isRequired, // true if the form was submitted and failed for any reason
  submitSucceeded: bool.isRequired, // true if the form was successfully submitted
  valid: bool.isRequired, // true if there are no validation errors
  warning: any, // form-wide warning from '_warning' key in validation result
  // Actions:
  array: shape({
    insert: func.isRequired, // function to insert a value into an array field
    move: func.isRequired, // function to move a value within an array field
    pop: func.isRequired, // function to pop a value off of an array field
    push: func.isRequired, // function to push a value onto an array field
    remove: func.isRequired, // function to remove a value from an array field
    removeAll: func.isRequired, // function to remove all the values from an array field
    shift: func.isRequired, // function to shift a value out of an array field
    splice: func.isRequired, // function to splice a value into an array field
    swap: func.isRequired, // function to swap values in an array field
    unshift: func.isRequired // function to unshift a value into an array field
  }),
  asyncValidate: func.isRequired, // function to trigger async validation
  autofill: func.isRequired, // action to set a value of a field and mark it as autofilled
  blur: func.isRequired, // action to mark a field as blurred
  change: func.isRequired, // action to change the value of a field
  clearAsyncError: func.isRequired, // action to clear the async error of a field
  destroy: func.isRequired, // action to destroy the form's data in Redux
  dispatch: func.isRequired, // the Redux dispatch action
  handleSubmit: func.isRequired, // function to submit the form
  initialize: func.isRequired, // action to initialize form data
  reset: func.isRequired, // action to reset the form data to previously initialized values
  touch: func.isRequired, // action to mark fields as touched
  submit: func.isRequired, // action to trigger a submission of the specified form
  untouch: func.isRequired, // action to mark fields as untouched

  // triggerSubmit
  triggerSubmit: bool, // if true, submits the form on componentWillReceiveProps
  clearSubmit: func.isRequired // called before a triggered submit, by default clears triggerSubmit
};

var fieldInputPropTypes = {
  checked: bool,
  name: string.isRequired,
  onBlur: func.isRequired,
  onChange: func.isRequired,
  onDragStart: func.isRequired,
  onDrop: func.isRequired,
  onFocus: func.isRequired,
  value: any
};

var fieldMetaPropTypes = {
  active: bool.isRequired,
  asyncValidating: bool.isRequired,
  autofilled: bool.isRequired,
  dirty: bool.isRequired,
  dispatch: func.isRequired,
  error: string,
  form: string.isRequired,
  invalid: bool.isRequired,
  pristine: bool.isRequired,
  submitting: bool.isRequired,
  submitFailed: bool.isRequired,
  touched: bool.isRequired,
  valid: bool.isRequired,
  visited: bool.isRequired,
  warning: string
};

var fieldPropTypes = {
  input: shape(fieldInputPropTypes).isRequired,
  meta: shape(fieldMetaPropTypes).isRequired
};

var _extends$18 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties$9(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var processProps = function processProps(type, props, _value) {
  var value = props.value;

  if (type === 'checkbox') {
    return _extends$18({}, props, {
      checked: !!value
    });
  }
  if (type === 'radio') {
    return _extends$18({}, props, {
      checked: value === _value,
      value: _value
    });
  }
  if (type === 'select-multiple') {
    return _extends$18({}, props, {
      value: value || []
    });
  }
  if (type === 'file') {
    return _extends$18({}, props, {
      value: value || undefined
    });
  }
  return props;
};

var createFieldProps = function createFieldProps(_ref2, name, _ref) {
  var getIn = _ref2.getIn,
      toJS = _ref2.toJS;

  var asyncError = _ref.asyncError,
      asyncValidating = _ref.asyncValidating,
      onBlur = _ref.onBlur,
      onChange = _ref.onChange,
      onDrop = _ref.onDrop,
      onDragStart = _ref.onDragStart,
      dirty = _ref.dirty,
      dispatch = _ref.dispatch,
      onFocus = _ref.onFocus,
      form = _ref.form,
      format = _ref.format,
      initial = _ref.initial,
      parse = _ref.parse,
      pristine = _ref.pristine,
      props = _ref.props,
      state = _ref.state,
      submitError = _ref.submitError,
      submitFailed = _ref.submitFailed,
      submitting = _ref.submitting,
      syncError = _ref.syncError,
      syncWarning = _ref.syncWarning,
      validate = _ref.validate,
      value = _ref.value,
      _value = _ref._value,
      warn = _ref.warn,
      custom = _objectWithoutProperties$9(_ref, ['asyncError', 'asyncValidating', 'onBlur', 'onChange', 'onDrop', 'onDragStart', 'dirty', 'dispatch', 'onFocus', 'form', 'format', 'initial', 'parse', 'pristine', 'props', 'state', 'submitError', 'submitFailed', 'submitting', 'syncError', 'syncWarning', 'validate', 'value', '_value', 'warn']);

  var error = syncError || asyncError || submitError;
  var warning$$1 = syncWarning;

  var formatFieldValue = function formatFieldValue(value, format) {
    if (format === null) {
      return value;
    }
    var defaultFormattedValue = value == null ? '' : value;
    return format ? format(value, name) : defaultFormattedValue;
  };

  var formattedFieldValue = formatFieldValue(value, format);

  return {
    input: processProps(custom.type, {
      name: name,
      onBlur: onBlur,
      onChange: onChange,
      onDragStart: onDragStart,
      onDrop: onDrop,
      onFocus: onFocus,
      value: formattedFieldValue
    }, _value),
    meta: _extends$18({}, toJS(state), {
      active: !!(state && getIn(state, 'active')),
      asyncValidating: asyncValidating,
      autofilled: !!(state && getIn(state, 'autofilled')),
      dirty: dirty,
      dispatch: dispatch,
      error: error,
      form: form,
      initial: initial,
      warning: warning$$1,
      invalid: !!error,
      pristine: pristine,
      submitting: !!submitting,
      submitFailed: !!submitFailed,
      touched: !!(state && getIn(state, 'touched')),
      valid: !error,
      visited: !!(state && getIn(state, 'visited'))
    }),
    custom: _extends$18({}, custom, props)
  };
};

var isEvent = function isEvent(candidate) {
  return !!(candidate && candidate.stopPropagation && candidate.preventDefault);
};

var getSelectedValues = function getSelectedValues(options) {
  var result = [];
  if (options) {
    for (var index = 0; index < options.length; index++) {
      var option = options[index];
      if (option.selected) {
        result.push(option.value);
      }
    }
  }
  return result;
};

var getValue = function getValue(event, isReactNative) {
  if (isEvent(event)) {
    if (!isReactNative && event.nativeEvent && event.nativeEvent.text !== undefined) {
      return event.nativeEvent.text;
    }
    if (isReactNative && event.nativeEvent !== undefined) {
      return event.nativeEvent.text;
    }
    var detypedEvent = event;
    var _detypedEvent$target = detypedEvent.target,
        type = _detypedEvent$target.type,
        value = _detypedEvent$target.value,
        checked = _detypedEvent$target.checked,
        files = _detypedEvent$target.files,
        dataTransfer = detypedEvent.dataTransfer;

    if (type === 'checkbox') {
      return checked || '';
    }
    if (type === 'file') {
      return files || dataTransfer && dataTransfer.files;
    }
    if (type === 'select-multiple') {
      return getSelectedValues(event.target.options);
    }
    return value;
  }
  return event;
};

var isReactNative = typeof window !== 'undefined' && window.navigator && window.navigator.product && window.navigator.product === 'ReactNative';

var onChangeValue = function onChangeValue(event, _ref) {
  var name = _ref.name,
      parse = _ref.parse,
      normalize = _ref.normalize;

  // read value from input
  var value = getValue(event, isReactNative);

  // parse value if we have a parser
  if (parse) {
    value = parse(value, name);
  }

  // normalize value
  if (normalize) {
    value = normalize(name, value);
  }

  return value;
};

var dataKey = 'text';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var splice = function splice(array, index, removeNum, value) {
  array = array || [];

  if (index < array.length) {
    if (value === undefined && !removeNum) {
      // inserting undefined
      var _copy2 = [].concat(_toConsumableArray(array));
      _copy2.splice(index, 0, true); // temporary placeholder
      _copy2[index] = undefined; // set to undefined
      return _copy2;
    }
    if (value != null) {
      var _copy3 = [].concat(_toConsumableArray(array));
      _copy3.splice(index, removeNum, value); // removing and adding
      return _copy3;
    }
    var _copy = [].concat(_toConsumableArray(array));
    _copy.splice(index, removeNum); // removing
    return _copy;
  }
  if (removeNum) {
    // trying to remove non-existant item: return original array
    return array;
  }
  // trying to add outside of range: just set value
  var copy = [].concat(_toConsumableArray(array));
  copy[index] = value;
  return copy;
};

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && baseGetTag$1(value) == symbolTag);
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject$1(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]';
var funcTag = '[object Function]';
var genTag = '[object GeneratorFunction]';
var proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction$1(value) {
  if (!isObject$1(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag$1(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

/** Used to detect overreaching core-js shims. */
var coreJsData = root$1['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/** Used for built-in method references. */
var funcProto$2 = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString$2 = funcProto$2.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString$2.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto$1 = Function.prototype;
var objectProto$3 = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString$1 = funcProto$1.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$2 = objectProto$3.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString$1.call(hasOwnProperty$2).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject$1(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction$1(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue$2(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue$2(object, key);
  return baseIsNative(value) ? value : undefined;
}

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto$4 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$3 = objectProto$4.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty$3.call(data, key) ? data[key] : undefined;
}

/** Used for built-in method references. */
var objectProto$5 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$4 = objectProto$5.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? (data[key] !== undefined) : hasOwnProperty$4.call(data, key);
}

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED$1 : value;
  return this;
}

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice$2 = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice$2.call(data, index, 1);
  }
  --this.size;
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/* Built-in method references that are verified to be native. */
var Map$1 = getNative(root$1, 'Map');

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map$1 || ListCache),
    'string': new Hash
  };
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `clear`, `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache);
  return memoized;
}

// Expose `MapCache`.
memoize.Cache = MapCache;

/** Used as the maximum memoize cache size. */
var MAX_MEMOIZE_SIZE = 500;

/**
 * A specialized version of `_.memoize` which clears the memoized function's
 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
 *
 * @private
 * @param {Function} func The function to have its output memoized.
 * @returns {Function} Returns the new memoized function.
 */
function memoizeCapped(func) {
  var result = memoize(func, function(key) {
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear();
    }
    return key;
  });

  var cache = result.cache;
  return result;
}

/** Used to match property names within property paths. */
var reLeadingDot = /^\./;
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoizeCapped(function(string) {
  var result = [];
  if (reLeadingDot.test(string)) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/** Used as references for various `Number` constants. */
var INFINITY$1 = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol$1 ? Symbol$1.prototype : undefined;
var symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isArray(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return arrayMap(value, baseToString) + '';
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY$1) ? '-0' : result;
}

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

/**
 * Converts `value` to a property path array.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Util
 * @param {*} value The value to convert.
 * @returns {Array} Returns the new property path array.
 * @example
 *
 * _.toPath('a.b.c');
 * // => ['a', 'b', 'c']
 *
 * _.toPath('a[0].b.c');
 * // => ['a', '0', 'b', 'c']
 */
function toPath$1(value) {
  if (isArray(value)) {
    return arrayMap(value, toKey);
  }
  return isSymbol(value) ? [value] : copyArray(stringToPath(toString(value)));
}

var getIn = function getIn(state, field) {
  if (!state) {
    return state;
  }

  var path = toPath$1(field);
  var length = path.length;
  if (!length) {
    return undefined;
  }

  var result = state;
  for (var i = 0; i < length && result; ++i) {
    result = result[path[i]];
  }

  return result;
};

var _extends$19 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var setInWithPath = function setInWithPath(state, value, path, pathIndex) {
  if (pathIndex >= path.length) {
    return value;
  }

  var first = path[pathIndex];
  var firstState = state && (Array.isArray(state) ? state[Number(first)] : state[first]);
  var next = setInWithPath(firstState, value, path, pathIndex + 1);

  if (!state) {
    if (isNaN(first)) {
      return _defineProperty({}, first, next);
    }
    var initialized = [];
    initialized[parseInt(first, 10)] = next;
    return initialized;
  }

  if (Array.isArray(state)) {
    var copy = [].concat(state);
    copy[parseInt(first, 10)] = next;
    return copy;
  }

  return _extends$19({}, state, _defineProperty({}, first, next));
};

var setIn = function setIn(state, field, value) {
  return setInWithPath(state, value, toPath$1(field), 0);
};

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
  this.size = 0;
}

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache) {
    var pairs = data.__data__;
    if (!Map$1 || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$2 = '__lodash_hash_undefined__';

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED$2);
  return this;
}

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values == null ? 0 : values.length;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$1 = 1;
var COMPARE_UNORDERED_FLAG = 2;

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG$1,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(array);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var index = -1,
      result = true,
      seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new SetCache : undefined;

  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!arraySome(other, function(othValue, othIndex) {
            if (!cacheHas(seen, othIndex) &&
                (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
              return seen.push(othIndex);
            }
          })) {
        result = false;
        break;
      }
    } else if (!(
          arrValue === othValue ||
            equalFunc(arrValue, othValue, bitmask, customizer, stack)
        )) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

/** Built-in value references. */
var Uint8Array = root$1.Uint8Array;

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$2 = 1;
var COMPARE_UNORDERED_FLAG$1 = 2;

/** `Object#toString` result references. */
var boolTag = '[object Boolean]';
var dateTag = '[object Date]';
var errorTag = '[object Error]';
var mapTag = '[object Map]';
var numberTag = '[object Number]';
var regexpTag = '[object RegExp]';
var setTag = '[object Set]';
var stringTag = '[object String]';
var symbolTag$1 = '[object Symbol]';

var arrayBufferTag = '[object ArrayBuffer]';
var dataViewTag = '[object DataView]';

/** Used to convert symbols to primitives and strings. */
var symbolProto$1 = Symbol$1 ? Symbol$1.prototype : undefined;
var symbolValueOf = symbolProto$1 ? symbolProto$1.valueOf : undefined;

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag:
      if ((object.byteLength != other.byteLength) ||
          (object.byteOffset != other.byteOffset)) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag:
      if ((object.byteLength != other.byteLength) ||
          !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
        return false;
      }
      return true;

    case boolTag:
    case dateTag:
    case numberTag:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq(+object, +other);

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == (other + '');

    case mapTag:
      var convert = mapToArray;

    case setTag:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG$2;
      convert || (convert = setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG$1;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack['delete'](object);
      return result;

    case symbolTag$1:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush$2(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush$2(result, symbolsFunc(object));
}

/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

/** Used for built-in method references. */
var objectProto$8 = Object.prototype;

/** Built-in value references. */
var propertyIsEnumerable = objectProto$8.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable.call(object, symbol);
  });
};

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/** `Object#toString` result references. */
var argsTag$1 = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments$1(value) {
  return isObjectLike(value) && baseGetTag$1(value) == argsTag$1;
}

/** Used for built-in method references. */
var objectProto$10 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$8 = objectProto$10.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable$1 = objectProto$10.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments$1(function() { return arguments; }()) ? baseIsArguments$1 : function(value) {
  return isObjectLike(value) && hasOwnProperty$8.call(value, 'callee') &&
    !propertyIsEnumerable$1.call(value, 'callee');
};

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root$1.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER$1 = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER$1;
}

/** `Object#toString` result references. */
var argsTag$2 = '[object Arguments]';
var arrayTag$1 = '[object Array]';
var boolTag$1 = '[object Boolean]';
var dateTag$1 = '[object Date]';
var errorTag$1 = '[object Error]';
var funcTag$1 = '[object Function]';
var mapTag$1 = '[object Map]';
var numberTag$1 = '[object Number]';
var objectTag$2 = '[object Object]';
var regexpTag$1 = '[object RegExp]';
var setTag$1 = '[object Set]';
var stringTag$1 = '[object String]';
var weakMapTag = '[object WeakMap]';

var arrayBufferTag$1 = '[object ArrayBuffer]';
var dataViewTag$1 = '[object DataView]';
var float32Tag = '[object Float32Array]';
var float64Tag = '[object Float64Array]';
var int8Tag = '[object Int8Array]';
var int16Tag = '[object Int16Array]';
var int32Tag = '[object Int32Array]';
var uint8Tag = '[object Uint8Array]';
var uint8ClampedTag = '[object Uint8ClampedArray]';
var uint16Tag = '[object Uint16Array]';
var uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag$2] = typedArrayTags[arrayTag$1] =
typedArrayTags[arrayBufferTag$1] = typedArrayTags[boolTag$1] =
typedArrayTags[dataViewTag$1] = typedArrayTags[dateTag$1] =
typedArrayTags[errorTag$1] = typedArrayTags[funcTag$1] =
typedArrayTags[mapTag$1] = typedArrayTags[numberTag$1] =
typedArrayTags[objectTag$2] = typedArrayTags[regexpTag$1] =
typedArrayTags[setTag$1] = typedArrayTags[stringTag$1] =
typedArrayTags[weakMapTag] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray$1(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[baseGetTag$1(value)];
}

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

/** Detect free variable `exports`. */
var freeExports$1 = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule$1 = freeExports$1 && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports$1 = freeModule$1 && freeModule$1.exports === freeExports$1;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports$1 && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray$1;

/** Used for built-in method references. */
var objectProto$9 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$7 = objectProto$9.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty$7.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

/** Used for built-in method references. */
var objectProto$12 = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$12;

  return value === proto;
}

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

/** Used for built-in method references. */
var objectProto$11 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$9 = objectProto$11.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty$9.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction$1(value);
}

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$3 = 1;

/** Used for built-in method references. */
var objectProto$7 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$6 = objectProto$7.hasOwnProperty;

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG$3,
      objProps = getAllKeys(object),
      objLength = objProps.length,
      othProps = getAllKeys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty$6.call(other, key))) {
      return false;
    }
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(object);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined
          ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
          : compared
        )) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

/* Built-in method references that are verified to be native. */
var DataView = getNative(root$1, 'DataView');

/* Built-in method references that are verified to be native. */
var Promise$1 = getNative(root$1, 'Promise');

/* Built-in method references that are verified to be native. */
var Set = getNative(root$1, 'Set');

/* Built-in method references that are verified to be native. */
var WeakMap = getNative(root$1, 'WeakMap');

/** `Object#toString` result references. */
var mapTag$2 = '[object Map]';
var objectTag$3 = '[object Object]';
var promiseTag = '[object Promise]';
var setTag$2 = '[object Set]';
var weakMapTag$1 = '[object WeakMap]';

var dataViewTag$2 = '[object DataView]';

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView);
var mapCtorString = toSource(Map$1);
var promiseCtorString = toSource(Promise$1);
var setCtorString = toSource(Set);
var weakMapCtorString = toSource(WeakMap);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag$1;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag$2) ||
    (Map$1 && getTag(new Map$1) != mapTag$2) ||
    (Promise$1 && getTag(Promise$1.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag$2) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag$1)) {
  getTag = function(value) {
    var result = baseGetTag$1(value),
        Ctor = result == objectTag$3 ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag$2;
        case mapCtorString: return mapTag$2;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag$2;
        case weakMapCtorString: return weakMapTag$1;
      }
    }
    return result;
  };
}

var getTag$1 = getTag;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';
var arrayTag = '[object Array]';
var objectTag$1 = '[object Object]';

/** Used for built-in method references. */
var objectProto$6 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$5 = objectProto$6.hasOwnProperty;

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = objIsArr ? arrayTag : getTag$1(object),
      othTag = othIsArr ? arrayTag : getTag$1(other);

  objTag = objTag == argsTag ? objectTag$1 : objTag;
  othTag = othTag == argsTag ? objectTag$1 : othTag;

  var objIsObj = objTag == objectTag$1,
      othIsObj = othTag == objectTag$1,
      isSameTag = objTag == othTag;

  if (isSameTag && isBuffer(object)) {
    if (!isBuffer(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack);
    return (objIsArr || isTypedArray(object))
      ? equalArrays(object, other, bitmask, customizer, equalFunc, stack)
      : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
    var objIsWrapped = objIsObj && hasOwnProperty$5.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty$5.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new Stack);
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack);
  return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Unordered comparison
 *  2 - Partial comparison
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObjectLike(value) && !isObjectLike(other))) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}

/**
 * This method is like `_.isEqual` except that it accepts `customizer` which
 * is invoked to compare values. If `customizer` returns `undefined`, comparisons
 * are handled by the method instead. The `customizer` is invoked with up to
 * six arguments: (objValue, othValue [, index|key, object, other, stack]).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {Function} [customizer] The function to customize comparisons.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * function isGreeting(value) {
 *   return /^h(?:i|ello)$/.test(value);
 * }
 *
 * function customizer(objValue, othValue) {
 *   if (isGreeting(objValue) && isGreeting(othValue)) {
 *     return true;
 *   }
 * }
 *
 * var array = ['hello', 'goodbye'];
 * var other = ['hi', 'goodbye'];
 *
 * _.isEqualWith(array, other, customizer);
 * // => true
 */
function isEqualWith(value, other, customizer) {
  customizer = typeof customizer == 'function' ? customizer : undefined;
  var result = customizer ? customizer(value, other) : undefined;
  return result === undefined ? baseIsEqual(value, other, undefined, customizer) : !!result;
}

var customizer = function customizer(obj, other) {
  if (obj === other) return true;
  if ((obj == null || obj === '' || obj === false) && (other == null || other === '' || other === false)) {
    return !(obj === undefined && other === false || obj === false && other === undefined);
  }

  if (obj && other && obj._error !== other._error) return false;
  if (obj && other && obj._warning !== other._warning) return false;
};

var deepEqual = function deepEqual(a, b) {
  return isEqualWith(a, b, customizer);
};

var _extends$20 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty$1(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray$1(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function deleteInWithPath(state, first) {
  if (state === undefined || state === null || first === undefined || first === null) {
    return state;
  }

  for (var _len = arguments.length, rest = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    rest[_key - 2] = arguments[_key];
  }

  if (rest.length) {
    if (Array.isArray(state)) {
      if (isNaN(first)) {
        throw new Error('Must access array elements with a number, not "' + String(first) + '".');
      }
      var firstIndex = Number(first);
      if (firstIndex < state.length) {
        var result = deleteInWithPath.apply(undefined, [state && state[firstIndex]].concat(_toConsumableArray$1(rest)));
        if (result !== state[firstIndex]) {
          var copy = [].concat(_toConsumableArray$1(state));
          copy[firstIndex] = result;
          return copy;
        }
      }
      return state;
    }
    if (first in state) {
      var _result = deleteInWithPath.apply(undefined, [state && state[first]].concat(_toConsumableArray$1(rest)));
      return state[first] === _result ? state : _extends$20({}, state, _defineProperty$1({}, first, _result));
    }
    return state;
  }
  if (Array.isArray(state)) {
    if (isNaN(first)) {
      throw new Error('Cannot delete non-numerical index from an array. Given: "' + String(first));
    }
    var _firstIndex = Number(first);
    if (_firstIndex < state.length) {
      var _copy = [].concat(_toConsumableArray$1(state));
      _copy.splice(_firstIndex, 1);
      return _copy;
    }
    return state;
  }
  if (first in state) {
    var _copy2 = _extends$20({}, state);
    delete _copy2[first];
    return _copy2;
  }
  return state;
}

var deleteIn = function deleteIn(state, field) {
  return deleteInWithPath.apply(undefined, [state].concat(_toConsumableArray$1(toPath$1(field))));
};

function keys$2(value) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.map(function (i) {
      return i.name;
    });
  }

  return Object.keys(value);
}

var structure = {
  allowsArrayErrors: true,
  empty: {},
  emptyList: [],
  getIn: getIn,
  setIn: setIn,
  deepEqual: deepEqual,
  deleteIn: deleteIn,
  forEach: function forEach(items, callback) {
    return items.forEach(callback);
  },
  fromJS: function fromJS(value) {
    return value;
  },
  keys: keys$2,
  size: function size(array) {
    return array ? array.length : 0;
  },
  some: function some(items, callback) {
    return items.some(callback);
  },
  splice: splice,
  toJS: function toJS(value) {
    return value;
  }
};

var _extends$17 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass$3 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof$4 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _objectWithoutProperties$8(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck$18(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$17(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$17(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var propsToNotUpdateFor = ['_reduxForm'];

var isObject = function isObject(entity) {
  return entity && (typeof entity === 'undefined' ? 'undefined' : _typeof$4(entity)) === 'object';
};

var isFunction = function isFunction(entity) {
  return entity && typeof entity === 'function';
};

var eventPreventDefault = function eventPreventDefault(event) {
  if (isObject(event) && isFunction(event.preventDefault)) {
    event.preventDefault();
  }
};

var eventDataTransferGetData = function eventDataTransferGetData(event, key) {
  if (isObject(event) && isObject(event.dataTransfer) && isFunction(event.dataTransfer.getData)) {
    return event.dataTransfer.getData(key);
  }
};

var eventDataTransferSetData = function eventDataTransferSetData(event, key, value) {
  if (isObject(event) && isObject(event.dataTransfer) && isFunction(event.dataTransfer.setData)) {
    event.dataTransfer.setData(key, value);
  }
};

var createConnectedField = function createConnectedField(structure$$1) {
  var deepEqual = structure$$1.deepEqual,
      getIn = structure$$1.getIn;

  var getSyncError = function getSyncError(syncErrors, name) {
    var error = structure.getIn(syncErrors, name);
    // Because the error for this field might not be at a level in the error structure where
    // it can be set directly, it might need to be unwrapped from the _error property
    return error && error._error ? error._error : error;
  };

  var getSyncWarning = function getSyncWarning(syncWarnings, name) {
    var warning$$1 = getIn(syncWarnings, name);
    // Because the warning for this field might not be at a level in the warning structure where
    // it can be set directly, it might need to be unwrapped from the _warning property
    return warning$$1 && warning$$1._warning ? warning$$1._warning : warning$$1;
  };

  var ConnectedField = function (_Component) {
    _inherits$17(ConnectedField, _Component);

    function ConnectedField() {
      var _ref;

      var _temp, _this, _ret;

      _classCallCheck$18(this, ConnectedField);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = _possibleConstructorReturn$17(this, (_ref = ConnectedField.__proto__ || Object.getPrototypeOf(ConnectedField)).call.apply(_ref, [this].concat(args))), _this), _this.saveRef = function (ref) {
        return _this.ref = ref;
      }, _this.isPristine = function () {
        return _this.props.pristine;
      }, _this.getValue = function () {
        return _this.props.value;
      }, _this.handleChange = function (event) {
        var _this$props = _this.props,
            name = _this$props.name,
            dispatch = _this$props.dispatch,
            parse = _this$props.parse,
            normalize = _this$props.normalize,
            onChange = _this$props.onChange,
            _reduxForm = _this$props._reduxForm,
            previousValue = _this$props.value;

        var newValue = onChangeValue(event, { name: name, parse: parse, normalize: normalize });

        var defaultPrevented = false;
        if (onChange) {
          onChange(_extends$17({}, event, {
            preventDefault: function preventDefault() {
              defaultPrevented = true;
              return eventPreventDefault(event);
            }
          }), newValue, previousValue);
        }
        if (!defaultPrevented) {
          // dispatch change action
          dispatch(_reduxForm.change(name, newValue));
        }
      }, _this.handleFocus = function (event) {
        var _this$props2 = _this.props,
            name = _this$props2.name,
            dispatch = _this$props2.dispatch,
            onFocus = _this$props2.onFocus,
            _reduxForm = _this$props2._reduxForm;


        var defaultPrevented = false;
        if (onFocus) {
          onFocus(_extends$17({}, event, {
            preventDefault: function preventDefault() {
              defaultPrevented = true;
              return eventPreventDefault(event);
            }
          }));
        }

        if (!defaultPrevented) {
          dispatch(_reduxForm.focus(name));
        }
      }, _this.handleBlur = function (event) {
        var _this$props3 = _this.props,
            name = _this$props3.name,
            dispatch = _this$props3.dispatch,
            parse = _this$props3.parse,
            normalize = _this$props3.normalize,
            onBlur = _this$props3.onBlur,
            _reduxForm = _this$props3._reduxForm,
            _value = _this$props3._value,
            previousValue = _this$props3.value;

        var newValue = onChangeValue(event, { name: name, parse: parse, normalize: normalize });

        // for checkbox and radio, if the value property of checkbox or radio equals
        // the value passed by blur event, then fire blur action with previousValue.
        if (newValue === _value && _value !== undefined) {
          newValue = previousValue;
        }

        var defaultPrevented = false;
        if (onBlur) {
          onBlur(_extends$17({}, event, {
            preventDefault: function preventDefault() {
              defaultPrevented = true;
              return eventPreventDefault(event);
            }
          }), newValue, previousValue);
        }

        if (!defaultPrevented) {
          // dispatch blur action
          dispatch(_reduxForm.blur(name, newValue));

          // call post-blur callback
          if (_reduxForm.asyncValidate) {
            _reduxForm.asyncValidate(name, newValue);
          }
        }
      }, _this.handleDragStart = function (event) {
        var _this$props4 = _this.props,
            onDragStart = _this$props4.onDragStart,
            value = _this$props4.value;

        eventDataTransferSetData(event, dataKey, value == null ? '' : value);

        if (onDragStart) {
          onDragStart(event);
        }
      }, _this.handleDrop = function (event) {
        var _this$props5 = _this.props,
            name = _this$props5.name,
            dispatch = _this$props5.dispatch,
            onDrop = _this$props5.onDrop,
            _reduxForm = _this$props5._reduxForm,
            previousValue = _this$props5.value;

        var newValue = eventDataTransferGetData(event, dataKey);

        var defaultPrevented = false;
        if (onDrop) {
          onDrop(_extends$17({}, event, {
            preventDefault: function preventDefault() {
              defaultPrevented = true;
              return eventPreventDefault(event);
            }
          }), newValue, previousValue);
        }

        if (!defaultPrevented) {
          // dispatch change action
          dispatch(_reduxForm.change(name, newValue));
          eventPreventDefault(event);
        }
      }, _temp), _possibleConstructorReturn$17(_this, _ret);
    }

    _createClass$3(ConnectedField, [{
      key: 'shouldComponentUpdate',
      value: function shouldComponentUpdate(nextProps) {
        var _this2 = this;

        var nextPropsKeys = Object.keys(nextProps);
        var thisPropsKeys = Object.keys(this.props);
        return nextPropsKeys.length !== thisPropsKeys.length || nextPropsKeys.some(function (prop) {
          return !~propsToNotUpdateFor.indexOf(prop) && !deepEqual(_this2.props[prop], nextProps[prop]);
        });
      }
    }, {
      key: 'getRenderedComponent',
      value: function getRenderedComponent() {
        return this.ref;
      }
    }, {
      key: 'render',
      value: function render() {
        var _props = this.props,
            component = _props.component,
            withRef = _props.withRef,
            name = _props.name,
            _reduxForm = _props._reduxForm,
            normalize = _props.normalize,
            onBlur = _props.onBlur,
            onChange = _props.onChange,
            onFocus = _props.onFocus,
            onDragStart = _props.onDragStart,
            onDrop = _props.onDrop,
            rest = _objectWithoutProperties$8(_props, ['component', 'withRef', 'name', '_reduxForm', 'normalize', 'onBlur', 'onChange', 'onFocus', 'onDragStart', 'onDrop']);

        var _createFieldProps = createFieldProps(structure$$1, name, _extends$17({}, rest, {
          form: _reduxForm.form,
          onBlur: this.handleBlur,
          onChange: this.handleChange,
          onDrop: this.handleDrop,
          onDragStart: this.handleDragStart,
          onFocus: this.handleFocus
        })),
            custom = _createFieldProps.custom,
            props = _objectWithoutProperties$8(_createFieldProps, ['custom']);

        if (withRef) {
          custom.ref = this.saveRef;
        }
        if (typeof component === 'string') {
          var input = props.input; // eslint-disable-line no-unused-vars
          // flatten input into other props

          return React.createElement(component, _extends$17({}, input, custom));
        } else {
          return React.createElement(component, _extends$17({}, props, custom));
        }
      }
    }]);

    return ConnectedField;
  }(React.Component);

  ConnectedField.propTypes = {
    component: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
    props: PropTypes.object
  };

  var connector = connect(function (state, ownProps) {
    var name = ownProps.name,
        _ownProps$_reduxForm = ownProps._reduxForm,
        initialValues = _ownProps$_reduxForm.initialValues,
        getFormState = _ownProps$_reduxForm.getFormState;

    var formState = getFormState(state);
    var initialState = getIn(formState, 'initial.' + name);
    var initial = initialState !== undefined ? initialState : initialValues && getIn(initialValues, name);
    var value = getIn(formState, 'values.' + name);
    var submitting = getIn(formState, 'submitting');
    var syncError = getSyncError(getIn(formState, 'syncErrors'), name);
    var syncWarning = getSyncWarning(getIn(formState, 'syncWarnings'), name);
    var pristine = deepEqual(value, initial);
    return {
      asyncError: getIn(formState, 'asyncErrors.' + name),
      asyncValidating: getIn(formState, 'asyncValidating') === name,
      dirty: !pristine,
      pristine: pristine,
      state: getIn(formState, 'fields.' + name),
      submitError: getIn(formState, 'submitErrors.' + name),
      submitFailed: getIn(formState, 'submitFailed'),
      submitting: submitting,
      syncError: syncError,
      syncWarning: syncWarning,
      initial: initial,
      value: value,
      _value: ownProps.value // save value passed in (for checkboxes)
    };
  }, undefined, undefined, { withRef: true });
  return connector(ConnectedField);
};

var customizer$1 = function customizer(objectValue, otherValue, indexOrkey, object, other, stack) {
  // https://lodash.com/docs/4.17.4#isEqualWith
  if (stack) {
    // Shallow compares
    // For 1st level, stack === undefined.
    //   -> Do nothing (and implicitly return undefined so that it goes to compare 2nd level)
    // For 2nd level and up, stack !== undefined.
    //   -> Compare by === operator
    return objectValue === otherValue;
  }
};

var shallowCompare = function shallowCompare(instance, nextProps, nextState) {
  return !isEqualWith(instance.props, nextProps, customizer$1) || !isEqualWith(instance.state, nextState, customizer$1);
};

var _extends$16 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass$2 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$17(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$16(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$16(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var createField = function createField(structure$$1) {
  var ConnectedField = createConnectedField(structure$$1);

  var setIn = structure$$1.setIn;

  var Field = function (_Component) {
    _inherits$16(Field, _Component);

    function Field(props, context) {
      _classCallCheck$17(this, Field);

      var _this = _possibleConstructorReturn$16(this, (Field.__proto__ || Object.getPrototypeOf(Field)).call(this, props, context));

      _this.saveRef = function (ref) {
        return _this.ref = ref;
      };

      _this.normalize = function (name, value) {
        var normalize = _this.props.normalize;

        if (!normalize) {
          return value;
        }
        var previousValues = _this.context._reduxForm.getValues();
        var previousValue = _this.value;
        var nextValues = setIn(previousValues, name, value);
        return normalize(value, previousValue, nextValues, previousValues);
      };

      if (!context._reduxForm) {
        throw new Error('Field must be inside a component decorated with reduxForm()');
      }
      return _this;
    }

    _createClass$2(Field, [{
      key: 'shouldComponentUpdate',
      value: function shouldComponentUpdate(nextProps) {
        return shallowCompare(this, nextProps);
      }
    }, {
      key: 'componentWillMount',
      value: function componentWillMount() {
        var _this2 = this;

        this.context._reduxForm.register(this.name, 'Field', function () {
          return _this2.props.validate;
        }, function () {
          return _this2.props.warn;
        });
      }
    }, {
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
        if (this.props.name !== nextProps.name ||
        // use deepEqual here because they could be a function or an array of functions
        !structure.deepEqual(this.props.validate, nextProps.validate) || !structure.deepEqual(this.props.warn, nextProps.warn)) {
          // unregister old name
          this.context._reduxForm.unregister(this.name);
          // register new name
          this.context._reduxForm.register(formatName$1(this.context, nextProps.name), 'Field', function () {
            return nextProps.validate;
          }, function () {
            return nextProps.warn;
          });
        }
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        this.context._reduxForm.unregister(this.name);
      }
    }, {
      key: 'getRenderedComponent',
      value: function getRenderedComponent() {
        invariant(this.props.withRef, 'If you want to access getRenderedComponent(), ' + 'you must specify a withRef prop to Field');
        return this.ref.getWrappedInstance().getRenderedComponent();
      }
    }, {
      key: 'render',
      value: function render() {
        return React.createElement(ConnectedField, _extends$16({}, this.props, {
          name: this.name,
          normalize: this.normalize,
          _reduxForm: this.context._reduxForm,
          ref: this.saveRef
        }));
      }
    }, {
      key: 'name',
      get: function get() {
        return formatName$1(this.context, this.props.name);
      }
    }, {
      key: 'dirty',
      get: function get() {
        return !this.pristine;
      }
    }, {
      key: 'pristine',
      get: function get() {
        return this.ref.getWrappedInstance().isPristine();
      }
    }, {
      key: 'value',
      get: function get() {
        return this.ref && this.ref.getWrappedInstance().getValue();
      }
    }]);

    return Field;
  }(React.Component);

  Field.propTypes = {
    name: PropTypes.string.isRequired,
    component: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
    format: PropTypes.func,
    normalize: PropTypes.func,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onDragStart: PropTypes.func,
    onDrop: PropTypes.func,
    parse: PropTypes.func,
    props: PropTypes.object,
    validate: PropTypes.oneOfType([PropTypes.func, PropTypes.arrayOf(PropTypes.func)]),
    warn: PropTypes.oneOfType([PropTypes.func, PropTypes.arrayOf(PropTypes.func)]),
    withRef: PropTypes.bool
  };
  Field.contextTypes = {
    _reduxForm: PropTypes.object
  };

  return Field;
};

createField(structure);

var _extends$22 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass$5 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _objectWithoutProperties$10(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck$20(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$19(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$19(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var propsToNotUpdateFor$1 = ['_reduxForm'];

var createConnectedFields = function createConnectedFields(structure$$1) {
  var deepEqual = structure$$1.deepEqual,
      getIn = structure$$1.getIn,
      size = structure$$1.size;


  var getSyncError = function getSyncError(syncErrors, name) {
    // Because the error for this field might not be at a level in the error structure where
    // it can be set directly, it might need to be unwrapped from the _error property
    return structure.getIn(syncErrors, name + '._error') || structure.getIn(syncErrors, name);
  };

  var getSyncWarning = function getSyncWarning(syncWarnings, name) {
    var warning$$1 = getIn(syncWarnings, name);
    // Because the warning for this field might not be at a level in the warning structure where
    // it can be set directly, it might need to be unwrapped from the _warning property
    return warning$$1 && warning$$1._warning ? warning$$1._warning : warning$$1;
  };

  var ConnectedFields = function (_Component) {
    _inherits$19(ConnectedFields, _Component);

    function ConnectedFields(props) {
      _classCallCheck$20(this, ConnectedFields);

      var _this = _possibleConstructorReturn$19(this, (ConnectedFields.__proto__ || Object.getPrototypeOf(ConnectedFields)).call(this, props));

      _this.onChangeFns = {};
      _this.onFocusFns = {};
      _this.onBlurFns = {};

      _this.prepareEventHandlers = function (_ref) {
        var names = _ref.names;
        return names.forEach(function (name) {
          _this.onChangeFns[name] = function (event) {
            return _this.handleChange(name, event);
          };
          _this.onFocusFns[name] = function () {
            return _this.handleFocus(name);
          };
          _this.onBlurFns[name] = function (event) {
            return _this.handleBlur(name, event);
          };
        });
      };

      _this.handleChange = function (name, event) {
        var _this$props = _this.props,
            dispatch = _this$props.dispatch,
            parse = _this$props.parse,
            _reduxForm = _this$props._reduxForm;

        var value = onChangeValue(event, { name: name, parse: parse });

        dispatch(_reduxForm.change(name, value));
      };

      _this.handleFocus = function (name) {
        var _this$props2 = _this.props,
            dispatch = _this$props2.dispatch,
            _reduxForm = _this$props2._reduxForm;

        dispatch(_reduxForm.focus(name));
      };

      _this.handleBlur = function (name, event) {
        var _this$props3 = _this.props,
            dispatch = _this$props3.dispatch,
            parse = _this$props3.parse,
            _reduxForm = _this$props3._reduxForm;

        var value = onChangeValue(event, { name: name, parse: parse });

        // dispatch blur action
        dispatch(_reduxForm.blur(name, value));

        // call post-blur callback
        if (_reduxForm.asyncValidate) {
          _reduxForm.asyncValidate(name, value);
        }
      };

      _this.prepareEventHandlers(props);
      return _this;
    }

    _createClass$5(ConnectedFields, [{
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
        var _this2 = this;

        if (this.props.names !== nextProps.names && (size(this.props.names) !== size(nextProps.names) || nextProps.names.some(function (nextName) {
          return !_this2.props._fields[nextName];
        }))) {
          // names has changed. The cached event handlers need to be updated
          this.prepareEventHandlers(nextProps);
        }
      }
    }, {
      key: 'shouldComponentUpdate',
      value: function shouldComponentUpdate(nextProps) {
        var _this3 = this;

        var nextPropsKeys = Object.keys(nextProps);
        var thisPropsKeys = Object.keys(this.props);
        return nextPropsKeys.length !== thisPropsKeys.length || nextPropsKeys.some(function (prop) {
          return !~propsToNotUpdateFor$1.indexOf(prop) && !deepEqual(_this3.props[prop], nextProps[prop]);
        });
      }
    }, {
      key: 'isDirty',
      value: function isDirty() {
        var _fields = this.props._fields;

        return Object.keys(_fields).some(function (name) {
          return _fields[name].dirty;
        });
      }
    }, {
      key: 'getValues',
      value: function getValues() {
        var _fields = this.props._fields;

        return Object.keys(_fields).reduce(function (accumulator, name) {
          return structure.setIn(accumulator, name, _fields[name].value);
        }, {});
      }
    }, {
      key: 'getRenderedComponent',
      value: function getRenderedComponent() {
        return this.refs.renderedComponent;
      }
    }, {
      key: 'render',
      value: function render() {
        var _this4 = this;

        var _props = this.props,
            component = _props.component,
            withRef = _props.withRef,
            _fields = _props._fields,
            _reduxForm = _props._reduxForm,
            rest = _objectWithoutProperties$10(_props, ['component', 'withRef', '_fields', '_reduxForm']);

        var sectionPrefix = _reduxForm.sectionPrefix,
            form = _reduxForm.form;

        var _Object$keys$reduce = Object.keys(_fields).reduce(function (accumulator, name) {
          var connectedProps = _fields[name];

          var _createFieldProps = createFieldProps(structure$$1, name, _extends$22({}, connectedProps, rest, {
            form: form,
            onBlur: _this4.onBlurFns[name],
            onChange: _this4.onChangeFns[name],
            onFocus: _this4.onFocusFns[name]
          })),
              custom = _createFieldProps.custom,
              fieldProps = _objectWithoutProperties$10(_createFieldProps, ['custom']);

          accumulator.custom = custom;
          var fieldName = sectionPrefix ? name.replace(sectionPrefix + '.', '') : name;
          return structure.setIn(accumulator, fieldName, fieldProps);
        }, {}),
            custom = _Object$keys$reduce.custom,
            props = _objectWithoutProperties$10(_Object$keys$reduce, ['custom']);

        if (withRef) {
          props.ref = 'renderedComponent';
        }

        return React.createElement(component, _extends$22({}, props, custom));
      }
    }]);

    return ConnectedFields;
  }(React.Component);

  ConnectedFields.propTypes = {
    component: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
    _fields: PropTypes.object.isRequired,
    props: PropTypes.object
  };

  var connector = connect(function (state, ownProps) {
    var names = ownProps.names,
        _ownProps$_reduxForm = ownProps._reduxForm,
        initialValues = _ownProps$_reduxForm.initialValues,
        getFormState = _ownProps$_reduxForm.getFormState;

    var formState = getFormState(state);
    return {
      _fields: names.reduce(function (accumulator, name) {
        var initialState = getIn(formState, 'initial.' + name);
        var initial = initialState !== undefined ? initialState : initialValues && getIn(initialValues, name);
        var value = getIn(formState, 'values.' + name);
        var syncError = getSyncError(getIn(formState, 'syncErrors'), name);
        var syncWarning = getSyncWarning(getIn(formState, 'syncWarnings'), name);
        var submitting = getIn(formState, 'submitting');
        var pristine = value === initial;
        accumulator[name] = {
          asyncError: getIn(formState, 'asyncErrors.' + name),
          asyncValidating: getIn(formState, 'asyncValidating') === name,
          dirty: !pristine,
          initial: initial,
          pristine: pristine,
          state: getIn(formState, 'fields.' + name),
          submitError: getIn(formState, 'submitErrors.' + name),
          submitFailed: getIn(formState, 'submitFailed'),
          submitting: submitting,
          syncError: syncError,
          syncWarning: syncWarning,
          value: value,
          _value: ownProps.value // save value passed in (for checkboxes)
        };
        return accumulator;
      }, {})
    };
  }, undefined, undefined, { withRef: true });
  return connector(ConnectedFields);
};

var _extends$21 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass$4 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$19(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$18(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$18(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var validateNameProp = function validateNameProp(prop) {
  if (!prop) {
    return new Error('No "names" prop was specified <Fields/>');
  }
  if (!Array.isArray(prop) && !prop._isFieldArray) {
    return new Error('Invalid prop "names" supplied to <Fields/>. Must be either an array of strings or the fields array generated by FieldArray.');
  }
};

var createFields = function createFields(structure$$1) {
  var ConnectedFields = createConnectedFields(structure$$1);

  var Fields = function (_Component) {
    _inherits$18(Fields, _Component);

    function Fields(props, context) {
      _classCallCheck$19(this, Fields);

      var _this = _possibleConstructorReturn$18(this, (Fields.__proto__ || Object.getPrototypeOf(Fields)).call(this, props, context));

      if (!context._reduxForm) {
        throw new Error('Fields must be inside a component decorated with reduxForm()');
      }
      return _this;
    }

    _createClass$4(Fields, [{
      key: 'shouldComponentUpdate',
      value: function shouldComponentUpdate(nextProps) {
        return shallowCompare(this, nextProps);
      }
    }, {
      key: 'componentWillMount',
      value: function componentWillMount() {
        var error = validateNameProp(this.props.names);
        if (error) {
          throw error;
        }
        var context = this.context;
        var register = context._reduxForm.register;

        this.names.forEach(function (name) {
          return register(name, 'Field');
        });
      }
    }, {
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
        if (!structure.deepEqual(this.props.names, nextProps.names)) {
          var context = this.context;
          var _context$_reduxForm = context._reduxForm,
              register = _context$_reduxForm.register,
              unregister = _context$_reduxForm.unregister;
          // unregister old name

          this.props.names.forEach(function (name) {
            return unregister(formatName$1(context, name));
          });
          // register new name
          nextProps.names.forEach(function (name) {
            return register(formatName$1(context, name), 'Field');
          });
        }
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        var context = this.context;
        var unregister = context._reduxForm.unregister;

        this.props.names.forEach(function (name) {
          return unregister(formatName$1(context, name));
        });
      }
    }, {
      key: 'getRenderedComponent',
      value: function getRenderedComponent() {
        invariant(this.props.withRef, 'If you want to access getRenderedComponent(), ' + 'you must specify a withRef prop to Fields');
        return this.refs.connected.getWrappedInstance().getRenderedComponent();
      }
    }, {
      key: 'render',
      value: function render() {
        var context = this.context;

        return React.createElement(ConnectedFields, _extends$21({}, this.props, {
          names: this.props.names.map(function (name) {
            return formatName$1(context, name);
          }),
          _reduxForm: this.context._reduxForm,
          ref: 'connected'
        }));
      }
    }, {
      key: 'names',
      get: function get() {
        var context = this.context;

        return this.props.names.map(function (name) {
          return formatName$1(context, name);
        });
      }
    }, {
      key: 'dirty',
      get: function get() {
        return this.refs.connected.getWrappedInstance().isDirty();
      }
    }, {
      key: 'pristine',
      get: function get() {
        return !this.dirty;
      }
    }, {
      key: 'values',
      get: function get() {
        return this.refs.connected && this.refs.connected.getWrappedInstance().getValues();
      }
    }]);

    return Fields;
  }(React.Component);

  Fields.propTypes = {
    names: function names(props, propName) {
      return validateNameProp(props[propName]);
    },
    component: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
    format: PropTypes.func,
    parse: PropTypes.func,
    props: PropTypes.object,
    withRef: PropTypes.bool
  };
  Fields.contextTypes = {
    _reduxForm: PropTypes.object
  };

  return Fields;
};

createFields(structure);

var defineProperty = (function() {
  try {
    var func = getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

/**
 * The base implementation of `assignValue` and `assignMergeValue` without
 * value checks.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function baseAssignValue(object, key, value) {
  if (key == '__proto__' && defineProperty) {
    defineProperty(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

/**
 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1,
        iterable = Object(object),
        props = keysFunc(object),
        length = props.length;

    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

/**
 * The base implementation of `baseForOwn` which iterates over `object`
 * properties returned by `keysFunc` and invokes `iteratee` for each property.
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = createBaseFor();

/**
 * The base implementation of `_.forOwn` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
  return object && baseFor(object, iteratee, keys);
}

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$4 = 1;
var COMPARE_UNORDERED_FLAG$2 = 2;

/**
 * The base implementation of `_.isMatch` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @param {Object} source The object of property values to match.
 * @param {Array} matchData The property names, values, and compare flags to match.
 * @param {Function} [customizer] The function to customize comparisons.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 */
function baseIsMatch(object, source, matchData, customizer) {
  var index = matchData.length,
      length = index,
      noCustomizer = !customizer;

  if (object == null) {
    return !length;
  }
  object = Object(object);
  while (index--) {
    var data = matchData[index];
    if ((noCustomizer && data[2])
          ? data[1] !== object[data[0]]
          : !(data[0] in object)
        ) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    var key = data[0],
        objValue = object[key],
        srcValue = data[1];

    if (noCustomizer && data[2]) {
      if (objValue === undefined && !(key in object)) {
        return false;
      }
    } else {
      var stack = new Stack;
      if (customizer) {
        var result = customizer(objValue, srcValue, key, object, source, stack);
      }
      if (!(result === undefined
            ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG$4 | COMPARE_UNORDERED_FLAG$2, customizer, stack)
            : result
          )) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` if suitable for strict
 *  equality comparisons, else `false`.
 */
function isStrictComparable(value) {
  return value === value && !isObject$1(value);
}

/**
 * Gets the property names, values, and compare flags of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the match data of `object`.
 */
function getMatchData(object) {
  var result = keys(object),
      length = result.length;

  while (length--) {
    var key = result[length],
        value = object[key];

    result[length] = [key, value, isStrictComparable(value)];
  }
  return result;
}

/**
 * A specialized version of `matchesProperty` for source values suitable
 * for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function matchesStrictComparable(key, srcValue) {
  return function(object) {
    if (object == null) {
      return false;
    }
    return object[key] === srcValue &&
      (srcValue !== undefined || (key in Object(object)));
  };
}

/**
 * The base implementation of `_.matches` which doesn't clone `source`.
 *
 * @private
 * @param {Object} source The object of property values to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatches(source) {
  var matchData = getMatchData(source);
  if (matchData.length == 1 && matchData[0][2]) {
    return matchesStrictComparable(matchData[0][0], matchData[0][1]);
  }
  return function(object) {
    return object === source || baseIsMatch(object, source, matchData);
  };
}

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
var reIsPlainProp = /^\w*$/;

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {Object} [object] The object to query keys on.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value, object) {
  if (isArray(value)) {
    return value;
  }
  return isKey(value, object) ? [value] : stringToPath(toString(value));
}

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = castPath(path, object);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

/**
 * The base implementation of `_.hasIn` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHasIn(object, key) {
  return object != null && key in Object(object);
}

/**
 * Checks if `path` exists on `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @param {Function} hasFunc The function to check properties.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 */
function hasPath(object, path, hasFunc) {
  path = castPath(path, object);

  var index = -1,
      length = path.length,
      result = false;

  while (++index < length) {
    var key = toKey(path[index]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result || ++index != length) {
    return result;
  }
  length = object == null ? 0 : object.length;
  return !!length && isLength(length) && isIndex(key, length) &&
    (isArray(object) || isArguments(object));
}

/**
 * Checks if `path` is a direct or inherited property of `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.hasIn(object, 'a');
 * // => true
 *
 * _.hasIn(object, 'a.b');
 * // => true
 *
 * _.hasIn(object, ['a', 'b']);
 * // => true
 *
 * _.hasIn(object, 'b');
 * // => false
 */
function hasIn(object, path) {
  return object != null && hasPath(object, path, baseHasIn);
}

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$5 = 1;
var COMPARE_UNORDERED_FLAG$3 = 2;

/**
 * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
 *
 * @private
 * @param {string} path The path of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatchesProperty(path, srcValue) {
  if (isKey(path) && isStrictComparable(srcValue)) {
    return matchesStrictComparable(toKey(path), srcValue);
  }
  return function(object) {
    var objValue = get(object, path);
    return (objValue === undefined && objValue === srcValue)
      ? hasIn(object, path)
      : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG$5 | COMPARE_UNORDERED_FLAG$3);
  };
}

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

/**
 * A specialized version of `baseProperty` which supports deep paths.
 *
 * @private
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyDeep(path) {
  return function(object) {
    return baseGet(object, path);
  };
}

/**
 * Creates a function that returns the value at `path` of a given object.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 * @example
 *
 * var objects = [
 *   { 'a': { 'b': 2 } },
 *   { 'a': { 'b': 1 } }
 * ];
 *
 * _.map(objects, _.property('a.b'));
 * // => [2, 1]
 *
 * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
 * // => [1, 2]
 */
function property(path) {
  return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
}

/**
 * The base implementation of `_.iteratee`.
 *
 * @private
 * @param {*} [value=_.identity] The value to convert to an iteratee.
 * @returns {Function} Returns the iteratee.
 */
function baseIteratee(value) {
  // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
  // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
  if (typeof value == 'function') {
    return value;
  }
  if (value == null) {
    return identity;
  }
  if (typeof value == 'object') {
    return isArray(value)
      ? baseMatchesProperty(value[0], value[1])
      : baseMatches(value);
  }
  return property(value);
}

/**
 * Creates an object with the same keys as `object` and values generated
 * by running each own enumerable string keyed property of `object` thru
 * `iteratee`. The iteratee is invoked with three arguments:
 * (value, key, object).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Object
 * @param {Object} object The object to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Object} Returns the new mapped object.
 * @see _.mapKeys
 * @example
 *
 * var users = {
 *   'fred':    { 'user': 'fred',    'age': 40 },
 *   'pebbles': { 'user': 'pebbles', 'age': 1 }
 * };
 *
 * _.mapValues(users, function(o) { return o.age; });
 * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
 *
 * // The `_.property` iteratee shorthand.
 * _.mapValues(users, 'age');
 * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
 */
function mapValues(object, iteratee) {
  var result = {};
  iteratee = baseIteratee(iteratee, 3);

  baseForOwn(object, function(value, key, object) {
    baseAssignValue(result, key, iteratee(value, key, object));
  });
  return result;
}

var _extends$24 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties$12(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var createFieldArrayProps = function createFieldArrayProps(_ref2, name, form, sectionPrefix, getValue, _ref) {
  var getIn = _ref2.getIn;

  var arrayInsert = _ref.arrayInsert,
      arrayMove = _ref.arrayMove,
      arrayPop = _ref.arrayPop,
      arrayPush = _ref.arrayPush,
      arrayRemove = _ref.arrayRemove,
      arrayRemoveAll = _ref.arrayRemoveAll,
      arrayShift = _ref.arrayShift,
      arraySplice = _ref.arraySplice,
      arraySwap = _ref.arraySwap,
      arrayUnshift = _ref.arrayUnshift,
      asyncError = _ref.asyncError,
      dirty = _ref.dirty,
      length = _ref.length,
      pristine = _ref.pristine,
      submitError = _ref.submitError,
      state = _ref.state,
      submitFailed = _ref.submitFailed,
      submitting = _ref.submitting,
      syncError = _ref.syncError,
      syncWarning = _ref.syncWarning,
      value = _ref.value,
      props = _ref.props,
      rest = _objectWithoutProperties$12(_ref, ['arrayInsert', 'arrayMove', 'arrayPop', 'arrayPush', 'arrayRemove', 'arrayRemoveAll', 'arrayShift', 'arraySplice', 'arraySwap', 'arrayUnshift', 'asyncError', 'dirty', 'length', 'pristine', 'submitError', 'state', 'submitFailed', 'submitting', 'syncError', 'syncWarning', 'value', 'props']);

  var error = syncError || asyncError || submitError;
  var warning$$1 = syncWarning;
  var fieldName = sectionPrefix ? name.replace(sectionPrefix + '.', '') : name;
  var finalProps = _extends$24({
    fields: {
      _isFieldArray: true,
      forEach: function forEach(callback) {
        return (value || []).forEach(function (item, index) {
          return callback(fieldName + '[' + index + ']', index, finalProps.fields);
        });
      },
      get: getValue,
      getAll: function getAll() {
        return value;
      },
      insert: arrayInsert,
      length: length,
      map: function map(callback) {
        return (value || []).map(function (item, index) {
          return callback(fieldName + '[' + index + ']', index, finalProps.fields);
        });
      },
      move: arrayMove,
      name: name,
      pop: function pop() {
        arrayPop();
        return getIn(value, String(length - 1));
      },
      push: arrayPush,
      reduce: function reduce(callback, initial) {
        return (value || []).reduce(function (accumulator, item, index) {
          return callback(accumulator, fieldName + '[' + index + ']', index, finalProps.fields);
        }, initial);
      },
      remove: arrayRemove,
      removeAll: arrayRemoveAll,
      shift: function shift() {
        arrayShift();
        return getIn(value, '0');
      },
      swap: arraySwap,
      unshift: arrayUnshift
    },
    meta: {
      dirty: dirty,
      error: error,
      form: form,
      warning: warning$$1,
      invalid: !!error,
      pristine: pristine,
      submitting: submitting,
      submitFailed: submitFailed,
      valid: !error
    }
  }, props, rest);
  return finalProps;
};

var _createClass$7 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _objectWithoutProperties$11(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck$22(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$21(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$21(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var propsToNotUpdateFor$2 = ['_reduxForm', 'value'];

var createConnectedFieldArray = function createConnectedFieldArray(structure$$1) {
  var deepEqual = structure$$1.deepEqual,
      getIn = structure$$1.getIn,
      size = structure$$1.size;

  var getSyncError = function getSyncError(syncErrors, name) {
    // For an array, the error can _ONLY_ be under _error.
    // This is why this getSyncError is not the same as the
    // one in Field.
    return structure.getIn(syncErrors, name + '._error');
  };

  var getSyncWarning = function getSyncWarning(syncWarnings, name) {
    // For an array, the warning can _ONLY_ be under _warning.
    // This is why this getSyncError is not the same as the
    // one in Field.
    return getIn(syncWarnings, name + '._warning');
  };

  var ConnectedFieldArray = function (_Component) {
    _inherits$21(ConnectedFieldArray, _Component);

    function ConnectedFieldArray() {
      var _ref;

      var _temp, _this, _ret;

      _classCallCheck$22(this, ConnectedFieldArray);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = _possibleConstructorReturn$21(this, (_ref = ConnectedFieldArray.__proto__ || Object.getPrototypeOf(ConnectedFieldArray)).call.apply(_ref, [this].concat(args))), _this), _this.saveRef = function (ref) {
        return _this.ref = ref;
      }, _this.getValue = function (index) {
        return _this.props.value && getIn(_this.props.value, String(index));
      }, _temp), _possibleConstructorReturn$21(_this, _ret);
    }

    _createClass$7(ConnectedFieldArray, [{
      key: 'shouldComponentUpdate',
      value: function shouldComponentUpdate(nextProps) {
        var _this2 = this;

        // Update if the elements of the value array was updated.
        var thisValue = this.props.value;
        var nextValue = nextProps.value;

        if (thisValue && nextValue) {
          if (thisValue.length !== nextValue.length || nextProps.rerenderOnEveryChange && thisValue.some(function (val, index) {
            return !deepEqual(val, nextValue[index]);
          })) {
            return true;
          }
        }

        var nextPropsKeys = Object.keys(nextProps);
        var thisPropsKeys = Object.keys(this.props);
        return nextPropsKeys.length !== thisPropsKeys.length || nextPropsKeys.some(function (prop) {
          // useful to debug rerenders
          // if (!plain.deepEqual(this.props[ prop ], nextProps[ prop ])) {
          //   console.info(prop, 'changed', this.props[ prop ], '==>', nextProps[ prop ])
          // }
          return !~propsToNotUpdateFor$2.indexOf(prop) && !deepEqual(_this2.props[prop], nextProps[prop]);
        });
      }
    }, {
      key: 'getRenderedComponent',
      value: function getRenderedComponent() {
        return this.ref;
      }
    }, {
      key: 'render',
      value: function render() {
        var _props = this.props,
            component = _props.component,
            withRef = _props.withRef,
            name = _props.name,
            _reduxForm = _props._reduxForm,
            validate = _props.validate,
            warn = _props.warn,
            rerenderOnEveryChange = _props.rerenderOnEveryChange,
            rest = _objectWithoutProperties$11(_props, ['component', 'withRef', 'name', '_reduxForm', 'validate', 'warn', 'rerenderOnEveryChange']);

        var props = createFieldArrayProps(structure$$1, name, _reduxForm.form, _reduxForm.sectionPrefix, this.getValue, rest);
        if (withRef) {
          props.ref = this.saveRef;
        }
        return React.createElement(component, props);
      }
    }, {
      key: 'dirty',
      get: function get() {
        return this.props.dirty;
      }
    }, {
      key: 'pristine',
      get: function get() {
        return this.props.pristine;
      }
    }, {
      key: 'value',
      get: function get() {
        return this.props.value;
      }
    }]);

    return ConnectedFieldArray;
  }(React.Component);

  ConnectedFieldArray.propTypes = {
    component: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
    props: PropTypes.object,
    rerenderOnEveryChange: PropTypes.bool
  };

  ConnectedFieldArray.defaultProps = {
    rerenderOnEveryChange: false
  };

  ConnectedFieldArray.contextTypes = {
    _reduxForm: PropTypes.object
  };

  var connector = connect(function (state, ownProps) {
    var name = ownProps.name,
        _ownProps$_reduxForm = ownProps._reduxForm,
        initialValues = _ownProps$_reduxForm.initialValues,
        getFormState = _ownProps$_reduxForm.getFormState;

    var formState = getFormState(state);
    var initial = getIn(formState, 'initial.' + name) || initialValues && getIn(initialValues, name);
    var value = getIn(formState, 'values.' + name);
    var submitting = getIn(formState, 'submitting');
    var syncError = getSyncError(getIn(formState, 'syncErrors'), name);
    var syncWarning = getSyncWarning(getIn(formState, 'syncWarnings'), name);
    var pristine = deepEqual(value, initial);
    return {
      asyncError: getIn(formState, 'asyncErrors.' + name + '._error'),
      dirty: !pristine,
      pristine: pristine,
      state: getIn(formState, 'fields.' + name),
      submitError: getIn(formState, 'submitErrors.' + name + '._error'),
      submitFailed: getIn(formState, 'submitFailed'),
      submitting: submitting,
      syncError: syncError,
      syncWarning: syncWarning,
      value: value,
      length: size(value)
    };
  }, function (dispatch, ownProps) {
    var name = ownProps.name,
        _reduxForm = ownProps._reduxForm;
    var arrayInsert = _reduxForm.arrayInsert,
        arrayMove = _reduxForm.arrayMove,
        arrayPop = _reduxForm.arrayPop,
        arrayPush = _reduxForm.arrayPush,
        arrayRemove = _reduxForm.arrayRemove,
        arrayRemoveAll = _reduxForm.arrayRemoveAll,
        arrayShift = _reduxForm.arrayShift,
        arraySplice = _reduxForm.arraySplice,
        arraySwap = _reduxForm.arraySwap,
        arrayUnshift = _reduxForm.arrayUnshift;

    return mapValues({
      arrayInsert: arrayInsert,
      arrayMove: arrayMove,
      arrayPop: arrayPop,
      arrayPush: arrayPush,
      arrayRemove: arrayRemove,
      arrayRemoveAll: arrayRemoveAll,
      arrayShift: arrayShift,
      arraySplice: arraySplice,
      arraySwap: arraySwap,
      arrayUnshift: arrayUnshift
    }, function (actionCreator) {
      return bindActionCreators(actionCreator.bind(null, name), dispatch);
    });
  }, undefined, { withRef: true });
  return connector(ConnectedFieldArray);
};

var _extends$23 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass$6 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$21(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$20(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$20(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _defineProperty$2(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var toArray = function toArray(value) {
  return Array.isArray(value) ? value : [value];
};

var wrapError = function wrapError(fn, key) {
  return fn && function () {
    var validators = toArray(fn);
    for (var i = 0; i < validators.length; i++) {
      var result = validators[i].apply(validators, arguments);
      if (result) {
        return _defineProperty$2({}, key, result);
      }
    }
  };
};

var createFieldArray = function createFieldArray(structure) {
  var ConnectedFieldArray = createConnectedFieldArray(structure);

  var FieldArray = function (_Component) {
    _inherits$20(FieldArray, _Component);

    function FieldArray(props, context) {
      _classCallCheck$21(this, FieldArray);

      var _this = _possibleConstructorReturn$20(this, (FieldArray.__proto__ || Object.getPrototypeOf(FieldArray)).call(this, props, context));

      _this.saveRef = function (ref) {
        return _this.ref = ref;
      };

      if (!context._reduxForm) {
        throw new Error('FieldArray must be inside a component decorated with reduxForm()');
      }
      return _this;
    }

    _createClass$6(FieldArray, [{
      key: 'componentWillMount',
      value: function componentWillMount() {
        var _this2 = this;

        this.context._reduxForm.register(this.name, 'FieldArray', function () {
          return wrapError(_this2.props.validate, '_error');
        }, function () {
          return wrapError(_this2.props.warn, '_warning');
        });
      }
    }, {
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
        if (this.props.name !== nextProps.name) {
          // unregister old name
          this.context._reduxForm.unregister(this.name);
          // register new name
          this.context._reduxForm.register(formatName$1(this.context, nextProps.name), 'FieldArray');
        }
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        this.context._reduxForm.unregister(this.name);
      }
    }, {
      key: 'getRenderedComponent',
      value: function getRenderedComponent() {
        invariant(this.props.withRef, 'If you want to access getRenderedComponent(), ' + 'you must specify a withRef prop to FieldArray');
        return this.ref.getWrappedInstance().getRenderedComponent();
      }
    }, {
      key: 'render',
      value: function render() {
        return React.createElement(ConnectedFieldArray, _extends$23({}, this.props, {
          name: this.name,
          _reduxForm: this.context._reduxForm,
          ref: this.saveRef
        }));
      }
    }, {
      key: 'name',
      get: function get() {
        return formatName$1(this.context, this.props.name);
      }
    }, {
      key: 'dirty',
      get: function get() {
        return this.ref.getWrappedInstance().dirty;
      }
    }, {
      key: 'pristine',
      get: function get() {
        return this.ref.getWrappedInstance().pristine;
      }
    }, {
      key: 'value',
      get: function get() {
        return this.ref.getWrappedInstance().value;
      }
    }]);

    return FieldArray;
  }(React.Component);

  FieldArray.propTypes = {
    name: PropTypes.string.isRequired,
    component: PropTypes.func.isRequired,
    props: PropTypes.object,
    validate: PropTypes.oneOfType([PropTypes.func, PropTypes.arrayOf(PropTypes.func)]),
    warn: PropTypes.oneOfType([PropTypes.func, PropTypes.arrayOf(PropTypes.func)]),
    withRef: PropTypes.bool
  };
  FieldArray.contextTypes = {
    _reduxForm: PropTypes.object
  };

  return FieldArray;
};

createFieldArray(structure);

var _extends$25 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass$8 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _objectWithoutProperties$13(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck$23(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$22(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$22(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _toConsumableArray$2(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var createValues$1 = function createValues(_ref) {
  var getIn = _ref.getIn;
  return function (firstArg) {
    for (var _len = arguments.length, rest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      rest[_key - 1] = arguments[_key];
    }

    var valuesMap = void 0;

    if (typeof firstArg === 'string') {
      valuesMap = [firstArg].concat(_toConsumableArray$2(rest)).map(function (k) {
        return {
          prop: k,
          path: k
        };
      });
    } else {
      var config = firstArg;
      valuesMap = Object.keys(config).map(function (k) {
        return {
          prop: k,
          path: config[k]
        };
      });
    }
    if (!valuesMap.length) {
      throw new Error('formValues(): You must specify values to get as formValues(name1, name2, ...) or formValues({propName1: propPath1, ...})');
    }

    // create a class that reads current form name and creates a selector
    // return
    return function (Component$$1) {
      var FormValues = function (_React$Component) {
        _inherits$22(FormValues, _React$Component);

        function FormValues(props, context) {
          _classCallCheck$23(this, FormValues);

          var _this = _possibleConstructorReturn$22(this, (FormValues.__proto__ || Object.getPrototypeOf(FormValues)).call(this, props, context));

          if (!context._reduxForm) {
            throw new Error('formValues() must be used inside a React tree decorated with reduxForm()');
          }
          var formValuesSelector = function formValuesSelector(_, _ref2) {
            var getValues = _this.context._reduxForm.getValues;

            var props = {};
            var values = getValues();
            valuesMap.forEach(function (_ref3) {
              var prop = _ref3.prop,
                  path = _ref3.path;
              return props[prop] = getIn(values, formatName$1(_this.context, path));
            });
            return props;
          };
          _this.Component = connect(formValuesSelector, function () {
            return {};
          } // ignore dispatch
          )(function (_ref4) {
            var sectionPrefix = _ref4.sectionPrefix,
                otherProps = _objectWithoutProperties$13(_ref4, ['sectionPrefix']);

            return React__default.createElement(Component$$1, otherProps);
          });
          return _this;
        }

        _createClass$8(FormValues, [{
          key: 'render',
          value: function render() {
            return React__default.createElement(this.Component, _extends$25({
              // so that the connected component updates props when sectionPrefix has changed
              sectionPrefix: this.context._reduxForm.sectionPrefix
            }, this.props));
          }
        }]);

        return FormValues;
      }(React__default.Component);

      FormValues.contextTypes = {
        _reduxForm: PropTypes.object
      };
      return FormValues;
    };
  };
};

createValues$1(structure);

/**
 * This function is like `assignValue` except that it doesn't assign
 * `undefined` values.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignMergeValue(object, key, value) {
  if ((value !== undefined && !eq(object[key], value)) ||
      (value === undefined && !(key in object))) {
    baseAssignValue(object, key, value);
  }
}

/** Detect free variable `exports`. */
var freeExports$2 = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule$2 = freeExports$2 && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports$2 = freeModule$2 && freeModule$2.exports === freeExports$2;

/** Built-in value references. */
var Buffer$1 = moduleExports$2 ? root$1.Buffer : undefined;
var allocUnsafe = Buffer$1 ? Buffer$1.allocUnsafe : undefined;

/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var length = buffer.length,
      result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

  buffer.copy(result);
  return result;
}

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
  return result;
}

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

/** Built-in value references. */
var objectCreate = Object.create;

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} proto The object to inherit from.
 * @returns {Object} Returns the new object.
 */
var baseCreate = (function() {
  function object() {}
  return function(proto) {
    if (!isObject$1(proto)) {
      return {};
    }
    if (objectCreate) {
      return objectCreate(proto);
    }
    object.prototype = proto;
    var result = new object;
    object.prototype = undefined;
    return result;
  };
}());

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  return (typeof object.constructor == 'function' && !isPrototype(object))
    ? baseCreate(getPrototype(object))
    : {};
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

/** Used for built-in method references. */
var objectProto$13 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$10 = objectProto$13.hasOwnProperty;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty$10.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    baseAssignValue(object, key, value);
  }
}

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

    if (newValue === undefined) {
      newValue = source[key];
    }
    if (isNew) {
      baseAssignValue(object, key, newValue);
    } else {
      assignValue(object, key, newValue);
    }
  }
  return object;
}

/**
 * This function is like
 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * except that it includes inherited enumerable properties.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function nativeKeysIn(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}

/** Used for built-in method references. */
var objectProto$14 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$11 = objectProto$14.hasOwnProperty;

/**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeysIn(object) {
  if (!isObject$1(object)) {
    return nativeKeysIn(object);
  }
  var isProto = isPrototype(object),
      result = [];

  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty$11.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
}

/**
 * Converts `value` to a plain object flattening inherited enumerable string
 * keyed properties of `value` to own properties of the plain object.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {Object} Returns the converted plain object.
 * @example
 *
 * function Foo() {
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.assign({ 'a': 1 }, new Foo);
 * // => { 'a': 1, 'b': 2 }
 *
 * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
 * // => { 'a': 1, 'b': 2, 'c': 3 }
 */
function toPlainObject(value) {
  return copyObject(value, keysIn(value));
}

/**
 * A specialized version of `baseMerge` for arrays and objects which performs
 * deep merges and tracks traversed objects enabling objects with circular
 * references to be merged.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {string} key The key of the value to merge.
 * @param {number} srcIndex The index of `source`.
 * @param {Function} mergeFunc The function to merge values.
 * @param {Function} [customizer] The function to customize assigned values.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 */
function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
  var objValue = object[key],
      srcValue = source[key],
      stacked = stack.get(srcValue);

  if (stacked) {
    assignMergeValue(object, key, stacked);
    return;
  }
  var newValue = customizer
    ? customizer(objValue, srcValue, (key + ''), object, source, stack)
    : undefined;

  var isCommon = newValue === undefined;

  if (isCommon) {
    var isArr = isArray(srcValue),
        isBuff = !isArr && isBuffer(srcValue),
        isTyped = !isArr && !isBuff && isTypedArray(srcValue);

    newValue = srcValue;
    if (isArr || isBuff || isTyped) {
      if (isArray(objValue)) {
        newValue = objValue;
      }
      else if (isArrayLikeObject(objValue)) {
        newValue = copyArray(objValue);
      }
      else if (isBuff) {
        isCommon = false;
        newValue = cloneBuffer(srcValue, true);
      }
      else if (isTyped) {
        isCommon = false;
        newValue = cloneTypedArray(srcValue, true);
      }
      else {
        newValue = [];
      }
    }
    else if (isPlainObject(srcValue) || isArguments(srcValue)) {
      newValue = objValue;
      if (isArguments(objValue)) {
        newValue = toPlainObject(objValue);
      }
      else if (!isObject$1(objValue) || (srcIndex && isFunction$1(objValue))) {
        newValue = initCloneObject(srcValue);
      }
    }
    else {
      isCommon = false;
    }
  }
  if (isCommon) {
    // Recursively merge objects and arrays (susceptible to call stack limits).
    stack.set(srcValue, newValue);
    mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
    stack['delete'](srcValue);
  }
  assignMergeValue(object, key, newValue);
}

/**
 * The base implementation of `_.merge` without support for multiple sources.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {number} srcIndex The index of `source`.
 * @param {Function} [customizer] The function to customize merged values.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 */
function baseMerge(object, source, srcIndex, customizer, stack) {
  if (object === source) {
    return;
  }
  baseFor(source, function(srcValue, key) {
    if (isObject$1(srcValue)) {
      stack || (stack = new Stack);
      baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
    }
    else {
      var newValue = customizer
        ? customizer(object[key], srcValue, (key + ''), object, source, stack)
        : undefined;

      if (newValue === undefined) {
        newValue = srcValue;
      }
      assignMergeValue(object, key, newValue);
    }
  }, keysIn);
}

/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * A specialized version of `baseRest` which transforms the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @param {Function} transform The rest array transform.
 * @returns {Function} Returns the new function.
 */
function overRest(func, start, transform) {
  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform(array);
    return apply(func, this, otherArgs);
  };
}

/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new constant function.
 * @example
 *
 * var objects = _.times(2, _.constant({ 'a': 1 }));
 *
 * console.log(objects);
 * // => [{ 'a': 1 }, { 'a': 1 }]
 *
 * console.log(objects[0] === objects[1]);
 * // => true
 */
function constant(value) {
  return function() {
    return value;
  };
}

/**
 * The base implementation of `setToString` without support for hot loop shorting.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var baseSetToString = !defineProperty ? identity : function(func, string) {
  return defineProperty(func, 'toString', {
    'configurable': true,
    'enumerable': false,
    'value': constant(string),
    'writable': true
  });
};

/** Used to detect hot functions by number of calls within a span of milliseconds. */
var HOT_COUNT = 800;
var HOT_SPAN = 16;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeNow = Date.now;

/**
 * Creates a function that'll short out and invoke `identity` instead
 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
 * milliseconds.
 *
 * @private
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new shortable function.
 */
function shortOut(func) {
  var count = 0,
      lastCalled = 0;

  return function() {
    var stamp = nativeNow(),
        remaining = HOT_SPAN - (stamp - lastCalled);

    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(undefined, arguments);
  };
}

/**
 * Sets the `toString` method of `func` to return `string`.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var setToString = shortOut(baseSetToString);

/**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 */
function baseRest(func, start) {
  return setToString(overRest(func, start, identity), func + '');
}

/**
 * Checks if the given arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
 *  else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject$1(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
        ? (isArrayLike(object) && isIndex(index, object.length))
        : (type == 'string' && index in object)
      ) {
    return eq(object[index], value);
  }
  return false;
}

/**
 * Creates a function like `_.assign`.
 *
 * @private
 * @param {Function} assigner The function to assign values.
 * @returns {Function} Returns the new assigner function.
 */
function createAssigner(assigner) {
  return baseRest(function(object, sources) {
    var index = -1,
        length = sources.length,
        customizer = length > 1 ? sources[length - 1] : undefined,
        guard = length > 2 ? sources[2] : undefined;

    customizer = (assigner.length > 3 && typeof customizer == 'function')
      ? (length--, customizer)
      : undefined;

    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? undefined : customizer;
      length = 1;
    }
    object = Object(object);
    while (++index < length) {
      var source = sources[index];
      if (source) {
        assigner(object, source, index, customizer);
      }
    }
    return object;
  });
}

/**
 * This method is like `_.assign` except that it recursively merges own and
 * inherited enumerable string keyed properties of source objects into the
 * destination object. Source properties that resolve to `undefined` are
 * skipped if a destination value exists. Array and plain object properties
 * are merged recursively. Other objects and value types are overridden by
 * assignment. Source objects are applied from left to right. Subsequent
 * sources overwrite property assignments of previous sources.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 0.5.0
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @example
 *
 * var object = {
 *   'a': [{ 'b': 2 }, { 'd': 4 }]
 * };
 *
 * var other = {
 *   'a': [{ 'c': 3 }, { 'e': 5 }]
 * };
 *
 * _.merge(object, other);
 * // => { 'a': [{ 'b': 2, 'c': 3 }, { 'd': 4, 'e': 5 }] }
 */
var merge = createAssigner(function(object, source, srcIndex) {
  baseMerge(object, source, srcIndex);
});

function _toConsumableArray$3(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _objectWithoutProperties$14(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

// extract field-specific actions

var formActions = _objectWithoutProperties$14(actions, ['arrayInsert', 'arrayMove', 'arrayPop', 'arrayPush', 'arrayRemove', 'arrayRemoveAll', 'arrayShift', 'arraySplice', 'arraySwap', 'arrayUnshift', 'blur', 'change', 'focus']);

var propsToNotUpdateFor$3 = [].concat(_toConsumableArray$3(Object.keys(actions)), ['array', 'asyncErrors', 'initialValues', 'syncErrors', 'syncWarnings', 'values', 'registeredFields']);

function createDeleteInWithCleanUp(_ref) {
  var deepEqual = _ref.deepEqual,
      empty = _ref.empty,
      getIn = _ref.getIn,
      deleteIn = _ref.deleteIn,
      setIn = _ref.setIn;

  var deleteInWithCleanUp = function deleteInWithCleanUp(state, path) {
    if (path[path.length - 1] === ']') {
      // array path
      var pathTokens = toPath$1(path);
      pathTokens.pop();
      var parent = getIn(state, pathTokens.join('.'));
      return parent ? setIn(state, path) : state;
    }

    var result = state;
    if (getIn(state, path) !== undefined) {
      result = deleteIn(state, path);
    }

    var dotIndex = path.lastIndexOf('.');
    if (dotIndex > 0) {
      var parentPath = path.substring(0, dotIndex);
      if (parentPath[parentPath.length - 1] !== ']') {
        var _parent = getIn(result, parentPath);
        if (deepEqual(_parent, empty)) {
          return deleteInWithCleanUp(result, parentPath);
        }
      }
    }
    return result;
  };

  return deleteInWithCleanUp;
}

function _defineProperty$4(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties$15(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var isReduxFormAction = function isReduxFormAction(action) {
  return action && action.type && action.type.length > prefix.length && action.type.substring(0, prefix.length) === prefix;
};

function createReducer(structure$$1) {
  var _behaviors;

  var deepEqual = structure$$1.deepEqual,
      empty = structure$$1.empty,
      forEach = structure$$1.forEach,
      getIn = structure$$1.getIn,
      setIn = structure$$1.setIn,
      deleteIn = structure$$1.deleteIn,
      fromJS = structure$$1.fromJS,
      keys = structure$$1.keys,
      size = structure$$1.size,
      some = structure$$1.some,
      splice = structure$$1.splice;

  var deleteInWithCleanUp = createDeleteInWithCleanUp(structure$$1);
  var plainDeleteInWithCleanUp = createDeleteInWithCleanUp(structure);
  var doSplice = function doSplice(state, key, field, index, removeNum, value, force) {
    var existing = getIn(state, key + '.' + field);
    return existing || force ? setIn(state, key + '.' + field, splice(existing, index, removeNum, value)) : state;
  };
  var doPlainSplice = function doPlainSplice(state, key, field, index, removeNum, value, force) {
    var slice = getIn(state, key);
    var existing = structure.getIn(slice, field);
    return existing || force ? setIn(state, key, structure.setIn(slice, field, structure.splice(existing, index, removeNum, value))) : state;
  };
  var rootKeys = ['values', 'fields', 'submitErrors', 'asyncErrors'];
  var arraySplice = function arraySplice(state, field, index, removeNum, value) {
    var result = state;
    var nonValuesValue = value != null ? empty : undefined;
    result = doSplice(result, 'values', field, index, removeNum, value, true);
    result = doSplice(result, 'fields', field, index, removeNum, nonValuesValue);
    result = doPlainSplice(result, 'syncErrors', field, index, removeNum, undefined);
    result = doPlainSplice(result, 'syncWarnings', field, index, removeNum, undefined);
    result = doSplice(result, 'submitErrors', field, index, removeNum, undefined);
    result = doSplice(result, 'asyncErrors', field, index, removeNum, undefined);
    return result;
  };

  var behaviors = (_behaviors = {}, _defineProperty$4(_behaviors, ARRAY_INSERT, function (state, _ref) {
    var _ref$meta = _ref.meta,
        field = _ref$meta.field,
        index = _ref$meta.index,
        payload = _ref.payload;

    return arraySplice(state, field, index, 0, payload);
  }), _defineProperty$4(_behaviors, ARRAY_MOVE, function (state, _ref2) {
    var _ref2$meta = _ref2.meta,
        field = _ref2$meta.field,
        from = _ref2$meta.from,
        to = _ref2$meta.to;

    var array = getIn(state, 'values.' + field);
    var length = array ? size(array) : 0;
    var result = state;
    if (length) {
      rootKeys.forEach(function (key) {
        var path = key + '.' + field;
        if (getIn(result, path)) {
          var value = getIn(result, path + '[' + from + ']');
          result = setIn(result, path, splice(getIn(result, path), from, 1)); // remove
          result = setIn(result, path, splice(getIn(result, path), to, 0, value)); // insert
        }
      });
    }
    return result;
  }), _defineProperty$4(_behaviors, ARRAY_POP, function (state, _ref3) {
    var field = _ref3.meta.field;

    var array = getIn(state, 'values.' + field);
    var length = array ? size(array) : 0;
    return length ? arraySplice(state, field, length - 1, 1) : state;
  }), _defineProperty$4(_behaviors, ARRAY_PUSH, function (state, _ref4) {
    var field = _ref4.meta.field,
        payload = _ref4.payload;

    var array = getIn(state, 'values.' + field);
    var length = array ? size(array) : 0;
    return arraySplice(state, field, length, 0, payload);
  }), _defineProperty$4(_behaviors, ARRAY_REMOVE, function (state, _ref5) {
    var _ref5$meta = _ref5.meta,
        field = _ref5$meta.field,
        index = _ref5$meta.index;

    return arraySplice(state, field, index, 1);
  }), _defineProperty$4(_behaviors, ARRAY_REMOVE_ALL, function (state, _ref6) {
    var field = _ref6.meta.field;

    var array = getIn(state, 'values.' + field);
    var length = array ? size(array) : 0;
    return length ? arraySplice(state, field, 0, length) : state;
  }), _defineProperty$4(_behaviors, ARRAY_SHIFT, function (state, _ref7) {
    var field = _ref7.meta.field;

    return arraySplice(state, field, 0, 1);
  }), _defineProperty$4(_behaviors, ARRAY_SPLICE, function (state, _ref8) {
    var _ref8$meta = _ref8.meta,
        field = _ref8$meta.field,
        index = _ref8$meta.index,
        removeNum = _ref8$meta.removeNum,
        payload = _ref8.payload;

    return arraySplice(state, field, index, removeNum, payload);
  }), _defineProperty$4(_behaviors, ARRAY_SWAP, function (state, _ref9) {
    var _ref9$meta = _ref9.meta,
        field = _ref9$meta.field,
        indexA = _ref9$meta.indexA,
        indexB = _ref9$meta.indexB;

    var result = state;
    rootKeys.forEach(function (key) {
      var valueA = getIn(result, key + '.' + field + '[' + indexA + ']');
      var valueB = getIn(result, key + '.' + field + '[' + indexB + ']');
      if (valueA !== undefined || valueB !== undefined) {
        result = setIn(result, key + '.' + field + '[' + indexA + ']', valueB);
        result = setIn(result, key + '.' + field + '[' + indexB + ']', valueA);
      }
    });
    return result;
  }), _defineProperty$4(_behaviors, ARRAY_UNSHIFT, function (state, _ref10) {
    var field = _ref10.meta.field,
        payload = _ref10.payload;

    return arraySplice(state, field, 0, 0, payload);
  }), _defineProperty$4(_behaviors, AUTOFILL, function (state, _ref11) {
    var field = _ref11.meta.field,
        payload = _ref11.payload;

    var result = state;
    result = deleteInWithCleanUp(result, 'asyncErrors.' + field);
    result = deleteInWithCleanUp(result, 'submitErrors.' + field);
    result = setIn(result, 'fields.' + field + '.autofilled', true);
    result = setIn(result, 'values.' + field, payload);
    return result;
  }), _defineProperty$4(_behaviors, BLUR, function (state, _ref12) {
    var _ref12$meta = _ref12.meta,
        field = _ref12$meta.field,
        touch = _ref12$meta.touch,
        payload = _ref12.payload;

    var result = state;
    var initial = getIn(result, 'initial.' + field);
    if (initial === undefined && payload === '') {
      result = deleteInWithCleanUp(result, 'values.' + field);
    } else if (payload !== undefined) {
      result = setIn(result, 'values.' + field, payload);
    }
    if (field === getIn(result, 'active')) {
      result = deleteIn(result, 'active');
    }
    result = deleteIn(result, 'fields.' + field + '.active');
    if (touch) {
      result = setIn(result, 'fields.' + field + '.touched', true);
      result = setIn(result, 'anyTouched', true);
    }
    return result;
  }), _defineProperty$4(_behaviors, CHANGE, function (state, _ref13) {
    var _ref13$meta = _ref13.meta,
        field = _ref13$meta.field,
        touch = _ref13$meta.touch,
        persistentSubmitErrors = _ref13$meta.persistentSubmitErrors,
        payload = _ref13.payload;

    var result = state;
    var initial = getIn(result, 'initial.' + field);
    if (initial === undefined && payload === '') {
      result = deleteInWithCleanUp(result, 'values.' + field);
    } else if (payload !== undefined) {
      result = setIn(result, 'values.' + field, payload);
    }
    result = deleteInWithCleanUp(result, 'asyncErrors.' + field);
    if (!persistentSubmitErrors) {
      result = deleteInWithCleanUp(result, 'submitErrors.' + field);
    }
    result = deleteInWithCleanUp(result, 'fields.' + field + '.autofilled');
    if (touch) {
      result = setIn(result, 'fields.' + field + '.touched', true);
      result = setIn(result, 'anyTouched', true);
    }
    return result;
  }), _defineProperty$4(_behaviors, CLEAR_SUBMIT, function (state) {
    return deleteIn(state, 'triggerSubmit');
  }), _defineProperty$4(_behaviors, CLEAR_SUBMIT_ERRORS, function (state) {
    var result = state;
    result = deleteInWithCleanUp(result, 'submitErrors');
    result = deleteIn(result, 'error');
    return result;
  }), _defineProperty$4(_behaviors, CLEAR_ASYNC_ERROR, function (state, _ref14) {
    var field = _ref14.meta.field;

    return deleteIn(state, 'asyncErrors.' + field);
  }), _defineProperty$4(_behaviors, FOCUS, function (state, _ref15) {
    var field = _ref15.meta.field;

    var result = state;
    var previouslyActive = getIn(state, 'active');
    result = deleteIn(result, 'fields.' + previouslyActive + '.active');
    result = setIn(result, 'fields.' + field + '.visited', true);
    result = setIn(result, 'fields.' + field + '.active', true);
    result = setIn(result, 'active', field);
    return result;
  }), _defineProperty$4(_behaviors, INITIALIZE, function (state, _ref16) {
    var payload = _ref16.payload,
        _ref16$meta = _ref16.meta,
        keepDirty = _ref16$meta.keepDirty,
        keepSubmitSucceeded = _ref16$meta.keepSubmitSucceeded;

    var mapData = fromJS(payload);
    var result = empty; // clean all field state

    // persist old warnings, they will get recalculated if the new form values are different from the old values
    var warning$$1 = getIn(state, 'warning');
    if (warning$$1) {
      result = setIn(result, 'warning', warning$$1);
    }
    var syncWarnings = getIn(state, 'syncWarnings');
    if (syncWarnings) {
      result = setIn(result, 'syncWarnings', syncWarnings);
    }

    // persist old errors, they will get recalculated if the new form values are different from the old values
    var error = getIn(state, 'error');
    if (error) {
      result = setIn(result, 'error', error);
    }
    var syncErrors = getIn(state, 'syncErrors');
    if (syncErrors) {
      result = setIn(result, 'syncErrors', syncErrors);
    }

    var registeredFields = getIn(state, 'registeredFields');
    if (registeredFields) {
      result = setIn(result, 'registeredFields', registeredFields);
    }

    var previousValues = getIn(state, 'values');
    var previousInitialValues = getIn(state, 'initial');
    var newInitialValues = mapData;

    var newValues = previousValues;

    if (keepDirty && registeredFields) {
      if (!deepEqual(newInitialValues, previousInitialValues)) {
        //
        // Keep the value of dirty fields while updating the value of
        // pristine fields. This way, apps can reinitialize forms while
        // avoiding stomping on user edits.
        //
        // Note 1: The initialize action replaces all initial values
        // regardless of keepDirty.
        //
        // Note 2: When a field is dirty, keepDirty is enabled, and the field
        // value is the same as the new initial value for the field, the
        // initialize action causes the field to become pristine. That effect
        // is what we want.
        //
        forEach(keys(registeredFields), function (name) {
          var previousInitialValue = getIn(previousInitialValues, name);
          var previousValue = getIn(previousValues, name);

          if (deepEqual(previousValue, previousInitialValue)) {
            // Overwrite the old pristine value with the new pristine value
            var newInitialValue = getIn(newInitialValues, name);

            // This check prevents any 'setIn' call that would create useless
            // nested objects, since the path to the new field value would
            // evaluate to the same (especially for undefined values)
            if (getIn(newValues, name) !== newInitialValue) {
              newValues = setIn(newValues, name, newInitialValue);
            }
          }
        });

        forEach(keys(newInitialValues), function (name) {
          var previousInitialValue = getIn(previousInitialValues, name);
          if (typeof previousInitialValue === 'undefined') {
            // Add new values at the root level.
            var newInitialValue = getIn(newInitialValues, name);
            newValues = setIn(newValues, name, newInitialValue);
          }
        });
      }
    } else {
      newValues = newInitialValues;
    }

    if (keepSubmitSucceeded && getIn(state, 'submitSucceeded')) {
      result = setIn(result, 'submitSucceeded', true);
    }
    result = setIn(result, 'values', newValues);
    result = setIn(result, 'initial', newInitialValues);
    return result;
  }), _defineProperty$4(_behaviors, REGISTER_FIELD, function (state, _ref17) {
    var _ref17$payload = _ref17.payload,
        name = _ref17$payload.name,
        type = _ref17$payload.type;

    var key = 'registeredFields[\'' + name + '\']';
    var field = getIn(state, key);
    if (field) {
      var count = getIn(field, 'count') + 1;
      field = setIn(field, 'count', count);
    } else {
      field = fromJS({ name: name, type: type, count: 1 });
    }
    return setIn(state, key, field);
  }), _defineProperty$4(_behaviors, RESET, function (state) {
    var result = empty;
    var registeredFields = getIn(state, 'registeredFields');
    if (registeredFields) {
      result = setIn(result, 'registeredFields', registeredFields);
    }
    var values = getIn(state, 'initial');
    if (values) {
      result = setIn(result, 'values', values);
      result = setIn(result, 'initial', values);
    }
    return result;
  }), _defineProperty$4(_behaviors, SUBMIT, function (state) {
    return setIn(state, 'triggerSubmit', true);
  }), _defineProperty$4(_behaviors, START_ASYNC_VALIDATION, function (state, _ref18) {
    var field = _ref18.meta.field;

    return setIn(state, 'asyncValidating', field || true);
  }), _defineProperty$4(_behaviors, START_SUBMIT, function (state) {
    return setIn(state, 'submitting', true);
  }), _defineProperty$4(_behaviors, STOP_ASYNC_VALIDATION, function (state, _ref19) {
    var payload = _ref19.payload;

    var result = state;
    result = deleteIn(result, 'asyncValidating');
    if (payload && Object.keys(payload).length) {
      var _error = payload._error,
          fieldErrors = _objectWithoutProperties$15(payload, ['_error']);

      if (_error) {
        result = setIn(result, 'error', _error);
      }
      if (Object.keys(fieldErrors).length) {
        result = setIn(result, 'asyncErrors', fromJS(fieldErrors));
      }
    } else {
      result = deleteIn(result, 'error');
    }
    return result;
  }), _defineProperty$4(_behaviors, STOP_SUBMIT, function (state, _ref20) {
    var payload = _ref20.payload;

    var result = state;
    result = deleteIn(result, 'submitting');
    result = deleteIn(result, 'submitFailed');
    result = deleteIn(result, 'submitSucceeded');
    if (payload && Object.keys(payload).length) {
      var _error = payload._error,
          fieldErrors = _objectWithoutProperties$15(payload, ['_error']);

      if (_error) {
        result = setIn(result, 'error', _error);
      } else {
        result = deleteIn(result, 'error');
      }
      if (Object.keys(fieldErrors).length) {
        result = setIn(result, 'submitErrors', fromJS(fieldErrors));
      } else {
        result = deleteIn(result, 'submitErrors');
      }
      result = setIn(result, 'submitFailed', true);
    } else {
      result = setIn(result, 'submitSucceeded', true);
      result = deleteIn(result, 'error');
      result = deleteIn(result, 'submitErrors');
    }
    return result;
  }), _defineProperty$4(_behaviors, SET_SUBMIT_FAILED, function (state, _ref21) {
    var fields = _ref21.meta.fields;

    var result = state;
    result = setIn(result, 'submitFailed', true);
    result = deleteIn(result, 'submitSucceeded');
    result = deleteIn(result, 'submitting');
    fields.forEach(function (field) {
      return result = setIn(result, 'fields.' + field + '.touched', true);
    });
    if (fields.length) {
      result = setIn(result, 'anyTouched', true);
    }
    return result;
  }), _defineProperty$4(_behaviors, SET_SUBMIT_SUCCEEDED, function (state) {
    var result = state;
    result = deleteIn(result, 'submitFailed');
    result = setIn(result, 'submitSucceeded', true);
    return result;
  }), _defineProperty$4(_behaviors, TOUCH, function (state, _ref22) {
    var fields = _ref22.meta.fields;

    var result = state;
    fields.forEach(function (field) {
      return result = setIn(result, 'fields.' + field + '.touched', true);
    });
    result = setIn(result, 'anyTouched', true);
    return result;
  }), _defineProperty$4(_behaviors, UNREGISTER_FIELD, function (state, _ref23) {
    var _ref23$payload = _ref23.payload,
        name = _ref23$payload.name,
        destroyOnUnmount = _ref23$payload.destroyOnUnmount;

    var result = state;
    var key = 'registeredFields[\'' + name + '\']';
    var field = getIn(result, key);
    if (!field) {
      return result;
    }

    var count = getIn(field, 'count') - 1;
    if (count <= 0 && destroyOnUnmount) {
      // Note: Cannot use deleteWithCleanUp here because of the flat nature of registeredFields
      result = deleteIn(result, key);
      if (deepEqual(getIn(result, 'registeredFields'), empty)) {
        result = deleteIn(result, 'registeredFields');
      }
      var syncErrors = getIn(result, 'syncErrors');
      if (syncErrors) {
        syncErrors = plainDeleteInWithCleanUp(syncErrors, name);
        if (structure.deepEqual(syncErrors, structure.empty)) {
          result = deleteIn(result, 'syncErrors');
        } else {
          result = setIn(result, 'syncErrors', syncErrors);
        }
      }
      var syncWarnings = getIn(result, 'syncWarnings');
      if (syncWarnings) {
        syncWarnings = plainDeleteInWithCleanUp(syncWarnings, name);
        if (structure.deepEqual(syncWarnings, structure.empty)) {
          result = deleteIn(result, 'syncWarnings');
        } else {
          result = setIn(result, 'syncWarnings', syncWarnings);
        }
      }
      result = deleteInWithCleanUp(result, 'submitErrors.' + name);
      result = deleteInWithCleanUp(result, 'asyncErrors.' + name);
    } else {
      field = setIn(field, 'count', count);
      result = setIn(result, key, field);
    }
    return result;
  }), _defineProperty$4(_behaviors, UNTOUCH, function (state, _ref24) {
    var fields = _ref24.meta.fields;

    var result = state;
    fields.forEach(function (field) {
      return result = deleteIn(result, 'fields.' + field + '.touched');
    });
    var anyTouched = some(keys(getIn(result, 'registeredFields')), function (key) {
      return getIn(result, 'fields.' + key + '.touched');
    });
    result = anyTouched ? setIn(result, 'anyTouched', true) : deleteIn(result, 'anyTouched');
    return result;
  }), _defineProperty$4(_behaviors, UPDATE_SYNC_ERRORS, function (state, _ref25) {
    var _ref25$payload = _ref25.payload,
        syncErrors = _ref25$payload.syncErrors,
        error = _ref25$payload.error;

    var result = state;
    if (error) {
      result = setIn(result, 'error', error);
      result = setIn(result, 'syncError', true);
    } else {
      result = deleteIn(result, 'error');
      result = deleteIn(result, 'syncError');
    }
    if (Object.keys(syncErrors).length) {
      result = setIn(result, 'syncErrors', syncErrors);
    } else {
      result = deleteIn(result, 'syncErrors');
    }
    return result;
  }), _defineProperty$4(_behaviors, UPDATE_SYNC_WARNINGS, function (state, _ref26) {
    var _ref26$payload = _ref26.payload,
        syncWarnings = _ref26$payload.syncWarnings,
        warning$$1 = _ref26$payload.warning;

    var result = state;
    if (warning$$1) {
      result = setIn(result, 'warning', warning$$1);
    } else {
      result = deleteIn(result, 'warning');
    }
    if (Object.keys(syncWarnings).length) {
      result = setIn(result, 'syncWarnings', syncWarnings);
    } else {
      result = deleteIn(result, 'syncWarnings');
    }
    return result;
  }), _behaviors);

  var reducer = function reducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : empty;
    var action = arguments[1];

    var behavior = behaviors[action.type];
    return behavior ? behavior(state, action) : state;
  };

  var byForm = function byForm(reducer) {
    return function () {
      var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : empty;
      var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { type: 'NONE' };

      var form = action && action.meta && action.meta.form;
      if (!form || !isReduxFormAction(action)) {
        return state;
      }
      if (action.type === DESTROY && action.meta && action.meta.form) {
        return action.meta.form.reduce(function (result, form) {
          return deleteInWithCleanUp(result, form);
        }, state);
      }
      var formState = getIn(state, form);
      var result = reducer(formState, action);
      return result === formState ? state : setIn(state, form, result);
    };
  };

  /**
   * Adds additional functionality to the reducer
   */
  function decorate(target) {
    target.plugin = function plugin(reducers) {
      var _this = this;

      // use 'function' keyword to enable 'this'
      return decorate(function () {
        var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : empty;
        var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { type: 'NONE' };
        return Object.keys(reducers).reduce(function (accumulator, key) {
          var previousState = getIn(accumulator, key);
          var nextState = reducers[key](previousState, action, getIn(state, key));
          return nextState === previousState ? accumulator : setIn(accumulator, key, nextState);
        }, _this(state, action));
      });
    };

    return target;
  }

  return decorate(byForm(reducer));
}

var form = createReducer(structure);

var reducers = {
  user: function user() {
    var state = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    arguments[1];

    return state;
  }
};

var CONSTANTS = ['@@io/CREATE', '@@io/DESTROY', '@@io/CONNECT', '@@io/LISTEN', '@@io/EVENT', '@@io/EMIT', '@@io/MUTE', '@@io/ONCE', '@@io/OPEN', '@@io/CLOSE', '@@io/DISCONNECT', '@@io/ACKNOWLEDGE', '@@io/COMPRESS', '@@io/STATUS'];

function reduxIo(io$$1) {
  if (!io$$1) throw new Error('You must pass in a client.');

  // if io is not passed in, fallback to native websocket.
  // check if other instances of the namespace exist and only disconnect if the remaining one.

  var namespaces = new Map();

  var reducer = new function () {
    var this$1 = this;

    this.io = io$$1, this.connections = 0, this.has = function (ns) {
      return namespaces.has(ns);
    }, this.get = function (ns) {
      return namespaces.get(ns);
    }, this.set = function (ns, manager) {
      return namespaces.set(ns, manager);
    };


    var next = function (state) {
      return Object.assign({}, this$1, state || {});
    };

    var createNamespace = function (ns, socket, abstraction) {
      return (ns === void 0 && (ns = '/'), namespaces.has(ns)) ? this$1 : (namespaces.set(ns, socket), this$1[ns] = abstraction, next());
    };

    var destroyNamespace = function (ns) {
      return ns === void 0 && (ns = '/'), namespaces.has(ns) && namespaces.delete(ns), delete this$1[ns], next();
    };

    var updateStatus = function (ns, status) {
      return ns === void 0 && (ns = '/'), this$1[ns].status = status, next();
    };

    return function (action) {
      var type = action.type;
      var ns = action.ns;
      var socket = action.socket;
      var status = action.status;
      return type === CONSTANTS[13] ? updateStatus(ns, status) : type === CONSTANTS[1] ? destroyNamespace(ns) : type === CONSTANTS[0] ? createNamespace(ns, socket, Object.assign({}, { id: socket.id }, action[ns])) : this$1;
    };
  }();
  var initialState = reducer();

  return function (state, action) {

    return state === void 0 && (state = initialState), /^@@io\//.test(action.type) ? reducer(action) : state;
  };
}

var reducer = reduxIo;

var socketEvents = ['connect', 'connect_error', // error - object
'connect_timeout', // timeout
'error', // error - object
'disconnect', // reason - string
'reconnect', // attemptNumber - number
'reconnect_attempt', // attemptNumber - number
'reconnecting', // attemptNumber - number
'reconnect_error', // error - object
'reconnect_failed', 'ping', 'pong' // latency - ms
];

var socketEventProps = socketEvents.map(function (name) {
  return name.split('_').map(function (frag) {
    return '' + String(frag[0].toUpperCase()) + String(frag.slice(1));
  }).join('');
}).map(function (evt) {
  return 'on' + String(evt);
});

function getDisplayName$2(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

/**
  *
  * @exports withSocket
  *
  * @param {String} uri
  * @param {Object|Function} options
  *
  * @see {@link https://github.com/socketio/socket.io-client/blob/master/docs/API.md#iourl-options|io([url][, options])}
  *
  */

function withSocket(uri, options) {

  return ((typeof uri == 'undefined' ? 'undefined' : babelHelpers.typeof(uri)) == 'object' || typeof uri == 'function') && (options = uri, uri = void 0), function (WrappedComponent, config) {
    var displayName = getDisplayName$2(WrappedComponent);

    var alias = config.alias;alias === void 0 && (alias = 'withSocket');

    var withRef = config.withRef;withRef === void 0 && (withRef = !1);


    var WithSocket = function (superclass) {
      function WithSocket(props) {
        superclass.call(this, props);


        var socket = props.socket;
        var manager = props.manager;

        this.state = {
          id: socket.id,
          namespace: manager.uri,
          readyState: manager.readyState,
          protocol: ''
        }, this.setWrappedInstance = this.setWrappedInstance.bind(this);
      }

      return superclass && (WithSocket.__proto__ = superclass), WithSocket.prototype = Object.create(superclass && superclass.prototype), WithSocket.prototype.constructor = WithSocket, WithSocket.prototype.componentWillReceiveProps = function () {}, WithSocket.prototype.componentWillUnmount = function () {
        var ref = this.props;
        var socket = ref.socket;
        socket.close();
      }, WithSocket.prototype.getWrappedInstance = function () {
        return this.wrappedInstance;
      }, WithSocket.prototype.setWrappedInstance = function (ref) {
        this.wrappedInstance = ref;
      }, WithSocket.prototype.getComponentProps = function () {
        var ref = this.props;
        var abstraction = ref.abstraction;
        var ownProps = ref.ownProps;

        var socket = Object.assign({}, abstraction, this.state);

        var wrappedComponentProps = Object.assign({}, ownProps, { socket: socket });

        return withRef && (wrappedComponentProps.ref = this.setWrappedInstance), wrappedComponentProps;
      }, WithSocket.prototype.render = function () {
        var wrappedComponentProps = this.getComponentProps();

        return React__default.createElement(WrappedComponent, wrappedComponentProps);
      }, WithSocket;
    }(React__default.PureComponent);

    var componentConnector = connectAdvanced(function (dispatch) {

      function initializeSocket() {
        function callback(cb) {
          return function () {
            for (var data = [], len = arguments.length; len--;) data[len] = arguments[len];

            return cb.apply(void 0, [dispatch].concat(data));
          };
        }

        abstraction = {
          io: io$$1,
          open: function () {
            return socket.open(), this;
          },
          close: function () {
            return socket.close(), this;
          },
          connect: function () {
            return this.open();
          },
          disconnect: function () {
            return this.close();
          },
          on: function (event, cb) {
            var fn = typeof cb == 'function' ? callback(cb) : cb;

            return socket.on(event, fn), this;
          },
          once: function (event, cb) {
            var fn = typeof cb == 'function' ? callback(cb) : cb;

            return socket.once(event, fn), this;
          },
          off: function (event, cb) {
            return socket.off(event, cb), this;
          },
          emit: function (event) {
            for (var args = [], len = arguments.length - 1; len-- > 0;) args[len] = arguments[len + 1];

            var isAck = args.splice(-1, 1);

            var fn = typeof isAck == 'function' ? callback(isAck) : isAck;

            return args.push(fn), socket.emit.apply(socket, [event].concat(args)), this;
          },
          send: function () {
            for (var args = [], len = arguments.length; len--;) args[len] = arguments[len];

            return (ref = this).emit.apply(ref, ['message'].concat(args));
            var ref;
          },
          compress: function (opt) {
            return socket.compress(opt), this;
          },
          reconnection: function (value) {
            return value ? (manager.reconnection(value), this) : manager.reconnection(value);
          },
          reconnectionAttempts: function (value) {
            return value ? (manager.reconnectionAttempts(value), this) : manager.reconnectionAttempts(value);
          },
          reconnectionDelay: function (value) {
            return value ? (manager.reconnectionDelay(value), this) : manager.reconnectionDelay(value);
          },
          reconnectionDelayMax: function (value) {
            return value ? (manager.reconnectionDelayMax(value), this) : manager.reconnectionDelayMax(value);
          },
          timeout: function (value) {
            return value ? (manager.timeout(value), this) : manager.timeout(value);
          }
        }, initialized = !0, dispatch({ type: CONSTANTS[0] });
      }

      function checkOptions(opts) {
        calculatedOptions !== opts && (calculatedOptions = opts);
      }

      function getOptions(ownProps) {
        var opts = null;

        return opts = typeof options == 'function' ? options(ownProps) : options, Object.assign({}, withSocket.defaults, opts);
      }

      var io$$1 = null;
      var socket = null;
      var manager = null;
      var abstraction = null;
      var initialized = !1;
      var calculatedOptions = null;return function (state, ownProps) {
        var opts = getOptions(ownProps);

        return initialized ? checkOptions(opts) : (io$$1 = state.socket.io, socket = state.socket.has(uri) && opts.forceNew !== !0 ? state.socket.get(uri) : io$$1(uri, calculatedOptions = opts), manager = socket.io, initializeSocket()), {
          socket: socket,
          manager: manager,
          abstraction: abstraction,
          ownProps: ownProps
        };
      };
    }, {
      methodName: alias,
      getDisplayName: function () {
        return String(alias) + '(' + String(displayName) + ')';
      }
    });

    return hoistStatics(componentConnector(WithSocket), WrappedComponent);
  };
}

withSocket.defaults = {};

/* eslint import/no-extraneous-dependencies: 0 */
var socket = reducer(io);

function configureStore(state) {
  var _this = this;

  var initialState = state || void 0;
  var rootReducer = combineReducers(Object.assign(reducers, { socket: socket, form: form }));

  if (process.env.NODE_ENV !== 'production') {
    var store = createStore(rootReducer, initialState);

    return module && module.hot && module.hot.accept('./reducers', function () {
      babelHelpers.newArrowCheck(this, _this);

      var nextReducers = require('./reducers').default;
      var nextRootReducer = combineReducers(Object.assign(nextReducers, { socket: socket, form: form }));

      store.replaceReducer(nextRootReducer);
    }.bind(this)), store;
  }

  return createStore(rootReducer, initialState);
}

var _this = undefined;

var Login$1 = function (_ref) {
  var onSubmit = _ref.onSubmit,
      onChange = _ref.onChange,
      handle = _ref.handle;

  return babelHelpers.newArrowCheck(this, _this), React__default.createElement(
    'div',
    null,
    React__default.createElement(
      'h1',
      null,
      'Hey there!'
    ),
    React__default.createElement(
      'p',
      null,
      'To start, please provide a handle to start chatting.'
    ),
    React__default.createElement(
      'form',
      { id: 'identity', onSubmit: onSubmit },
      React__default.createElement('input', {
        id: 'whoami',
        type: 'text',
        value: handle,
        onChange: onChange }),
      React__default.createElement(
        'button',
        { type: 'submit' },
        'Send'
      )
    )
  );
}.bind(undefined);

Login$1.propTypes = {
  onSubmit: PropTypes.func,
  onChange: PropTypes.func,
  handle: PropTypes.string
};

var _this$1 = undefined;

var Composer = function (_ref) {
  var onSubmit = _ref.onSubmit,
      onChange = _ref.onChange,
      content = _ref.content;

  return babelHelpers.newArrowCheck(this, _this$1), React__default.createElement(
    'form',
    { id: 'message', onSubmit: onSubmit },
    React__default.createElement('textarea', {
      id: 'content',
      value: content,
      onBlur: function () {
        return babelHelpers.newArrowCheck(this, _this$1), this.onTyping(!1);
      }.bind(this),
      onFocus: function () {
        return babelHelpers.newArrowCheck(this, _this$1), this.onTyping(!0);
      }.bind(this),
      onChange: onChange }),
    React__default.createElement(
      'button',
      { type: 'submit' },
      'Send'
    )
  );
}.bind(undefined);

Composer.propTypes = {
  onSubmit: PropTypes.func,
  onChange: PropTypes.func,
  content: PropTypes.string
};


var Messages = function (props) {
  return babelHelpers.newArrowCheck(this, _this$1), props.messages.map(function (msg) {
    return babelHelpers.newArrowCheck(this, _this$1), React__default.createElement(
      'li',
      { key: msg.id },
      msg.content
    );
  }.bind(this));
}.bind(undefined);

Messages.propTypes = {
  messages: PropTypes.array
};


var Messenger = function (_ref2) {
  var onSubmit = _ref2.onSubmit,
      onChange = _ref2.onChange,
      content = _ref2.content;

  return babelHelpers.newArrowCheck(this, _this$1), React__default.createElement(
    'div',
    null,
    React__default.createElement(
      'ul',
      null,
      [React__default.createElement(Messages, { messages: messages }), React__default.createElement(
        'li',
        null,
        'Typing: ',
        typing.join(', ') || 'no one.'
      )]
    ),
    React__default.createElement(Composer, {
      content: content,
      onChange: onChange,
      onSubmit: onSubmit })
  );
}.bind(undefined);

Messenger.propTypes = {
  onSubmit: PropTypes.func,
  onChange: PropTypes.func,
  content: PropTypes.string
};

var _this3 = undefined;

var ChatClient = function (_React$PureComponent) {
  function ChatClient(props) {
    babelHelpers.classCallCheck(this, ChatClient);

    var _this = babelHelpers.possibleConstructorReturn(this, (ChatClient.__proto__ || Object.getPrototypeOf(ChatClient)).call(this, props));

    var whoami = localStorage === void 0 ? '' : localStorage.getItem('whoami');

    return _this.onChange = _this.onChange.bind(_this), _this.state = {
      messages: [],
      party: [],
      typing: [],
      channel: props.channel || '',
      content: '',
      whoami: whoami,
      handle: !!whoami,
      connected: !1
    }, _this.sendMessage = _this.sendMessage.bind(_this), _this.onTyping = _this.onTyping.bind(_this), _this.onSubmit = _this.onSubmit.bind(_this), _this.onChange = _this.onChange.bind(_this), _this;
  }

  return babelHelpers.inherits(ChatClient, _React$PureComponent), babelHelpers.createClass(ChatClient, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.props.socket;
      this.state.channel;

      // socket
      //   .on('connect', (dispatch) =>
      //     this.setState({ connected: true }, () => socket.emit('channel', channel)))
      //   .on('disconnect', (dispatch) =>
      //     this.setState({ connected: false }))
      //   .on('channel:join', (dispatch, whoami) =>
      //   this.setState(state => ({ party: state.party.concat(whoami) }))
      //   .on('channel:leave', (dispatch, whoami) =>
      //     this.setState(state => { party: state.party.filter(m => m !== whoami) }))
      //   .on('messages', (dispatch, messages) =>
      //     this.setState({ messages }))
      //   .on('messages:new', (dispatch) =>
      //     this.setState(state => ({ messages: state.messages.concat(data.message) })))
      // .on('typing', (dispatch, { typing, whoami }) =>
      //   this.setState(state => {
      //     if (this.state.typing.indexOf(whoami) >= 0) {
      //       if (!typing) return { typing: state.typing.filter(who => who !== whoami) };
      //     } else if (typing) return { typing: state.typing.concat(whoami) };
      //   }));
    }
  }, {
    key: 'sendMessage',
    value: function sendMessage() {
      var _state = this.state,
          content = _state.content,
          whoami = _state.whoami,
          channel = _state.channel;
      this.props.socket.emit('message:send', { whoami: whoami, content: content, channel: channel });
    }
  }, {
    key: 'onTyping',
    value: function onTyping(typing) {
      this.props.socket.emit('typing:state', typing, this.state.whoami);
    }
  }, {
    key: 'onChange',
    value: function onChange(event) {
      var _event$target = event.target,
          id = _event$target.id,
          value = _event$target.value;

      return this.setState(babelHelpers.defineProperty({}, id, value));
    }
  }, {
    key: 'onSubmit',
    value: function onSubmit(event) {
      var _this2 = this;

      switch (event.preventDefault(), event.target.id) {
        default:
          this.sendMessage();

        case 'identity':
          return this.setState({ handle: !0 }, function () {
            return babelHelpers.newArrowCheck(this, _this2), localStorage && localStorage.setItem('whoami', this.state.whoami);
          }.bind(this));
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _state2 = this.state,
          whoami = _state2.whoami,
          handle = _state2.handle,
          content = _state2.content,
          messages = _state2.messages,
          typing = _state2.typing,
          party = _state2.party,
          channel = _state2.channel;


      return React__default.createElement(
        'main',
        { id: 'view' },
        whoami && handle ? React__default.createElement(Messenger, {
          channel: channel,
          party: party,
          typing: typing,
          messages: messages,
          content: content,
          onChange: this.onChange,
          onSubmit: this.onSubmit }) : React__default.createElement(Login, {
          handle: whoami,
          onChange: this.onChange,
          onSubmit: this.onSubmit })
      );
    }
  }]), ChatClient;
}(React__default.PureComponent);

var Chat = withSocket('/chat', function (props) {
  return babelHelpers.newArrowCheck(this, _this3), {
    autoConnect: !!props.user,
    transports: props.transports
  };
}.bind(undefined))(ChatClient);

Chat.propTypes = {
  socket: PropTypes.shape({
    io: PropTypes.shape({
      connect: PropTypes.func
    }),
    namespaces: PropTypes.array
  })
};

var Application = function (_React$PureComponent) {
  function Application(props) {
    babelHelpers.classCallCheck(this, Application);

    var _this = babelHelpers.possibleConstructorReturn(this, (Application.__proto__ || Object.getPrototypeOf(Application)).call(this, props));

    return _this.onDisconnect = _this.onDisconnect.bind(_this), _this.onConnect = _this.onConnect.bind(_this), _this.onDisconnect = _this.onDisconnect.bind(_this), _this;
  }

  return babelHelpers.inherits(Application, _React$PureComponent), babelHelpers.createClass(Application, [{
    key: 'onConnect',
    value: function onConnect() {}
  }, {
    key: 'onDisconnect',
    value: function onDisconnect() {}
  }, {
    key: 'render',
    value: function render() {
      return React__default.createElement(
        'main',
        { id: 'view' },
        React__default.createElement(Chat, {
          transports: ['polling', 'websocket'],
          onConnect: this.onConnect,
          onDisconnect: this.onDisconnect })
      );
    }
  }]), Application;
}(React__default.PureComponent);

/* eslint import/no-extraneous-dependencies: 0 */
var store = configureStore();

ReactDOM.render(React__default.createElement(
  Provider,
  { store: store },
  React__default.createElement(
    BrowserRouter,
    null,
    React__default.createElement(Application, null)
  )
), document.getElementById('root'));

}(null,React,ReactDOM,warning,PropTypes,createHistory,invariant,createHistory$1,createHistory$2,pathToRegexp,PathUtils,hoistStatics,isPromise,io));
