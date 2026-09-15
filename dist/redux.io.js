'use strict';

var React = require('react');
var reactRedux = require('react-redux');

const prefix = '@@io';

const CREATE = `${prefix}/create`;
const CONNECT = `${prefix}/connect`;
const DISCONNECT = `${prefix}/disconnect`;
const ON = `${prefix}/on`;
const OFF = `${prefix}/off`;
const ONCE = `${prefix}/once`;
const DEFAULTS = `${prefix}/defaults`;

function reducer(io, defaults = {}) {
  if (typeof io !== 'function') {
    throw new Error(
      'Please make sure you are passing in socket.io to the reducer.',
    );
  }

  const initialState = { io, defaults: { ...defaults } };

  return function socketReducer(state = initialState, action) {
    const { type, nsp } = action;
    switch (type) {
      case CREATE: {
        if (Object.hasOwn(state, nsp)) return state;
        const socket = io(nsp, { ...state.defaults, ...action.options });
        return { ...state, [nsp]: socket };
      }
      case DEFAULTS:
        return { ...state, defaults: { ...state.defaults, ...action.options } };
      case CONNECT:
      case DISCONNECT:
      case ON:
      case OFF:
      case ONCE: {
        const socket = Object.hasOwn(state, nsp) ? state[nsp] : undefined;
        if (!socket || nsp === 'io' || nsp === 'defaults') return state;
        if (type === CONNECT) socket.open();
        else if (type === DISCONNECT) socket.close();
        else {
          const method = { [ON]: 'on', [OFF]: 'off', [ONCE]: 'once' }[type];
          if (action.callback === undefined) socket[method](action.event);
          else socket[method](action.event, action.callback);
        }
        return state;
      }
      default:
        return state;
    }
  };
}

function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default')
    ? x['default']
    : x;
}

var reactIs = { exports: {} };

var reactIs_production_min = {};

/** @license React v16.13.1
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var hasRequiredReactIs_production_min;

function requireReactIs_production_min() {
  if (hasRequiredReactIs_production_min) return reactIs_production_min;
  hasRequiredReactIs_production_min = 1;
  var b = 'function' === typeof Symbol && Symbol.for,
    c = b ? Symbol.for('react.element') : 60103,
    d = b ? Symbol.for('react.portal') : 60106,
    e = b ? Symbol.for('react.fragment') : 60107,
    f = b ? Symbol.for('react.strict_mode') : 60108,
    g = b ? Symbol.for('react.profiler') : 60114,
    h = b ? Symbol.for('react.provider') : 60109,
    k = b ? Symbol.for('react.context') : 60110,
    l = b ? Symbol.for('react.async_mode') : 60111,
    m = b ? Symbol.for('react.concurrent_mode') : 60111,
    n = b ? Symbol.for('react.forward_ref') : 60112,
    p = b ? Symbol.for('react.suspense') : 60113,
    q = b ? Symbol.for('react.suspense_list') : 60120,
    r = b ? Symbol.for('react.memo') : 60115,
    t = b ? Symbol.for('react.lazy') : 60116,
    v = b ? Symbol.for('react.block') : 60121,
    w = b ? Symbol.for('react.fundamental') : 60117,
    x = b ? Symbol.for('react.responder') : 60118,
    y = b ? Symbol.for('react.scope') : 60119;
  function z(a) {
    if ('object' === typeof a && null !== a) {
      var u = a.$$typeof;
      switch (u) {
        case c:
          switch (((a = a.type), a)) {
            case l:
            case m:
            case e:
            case g:
            case f:
            case p:
              return a;
            default:
              switch (((a = a && a.$$typeof), a)) {
                case k:
                case n:
                case t:
                case r:
                case h:
                  return a;
                default:
                  return u;
              }
          }
        case d:
          return u;
      }
    }
  }
  function A(a) {
    return z(a) === m;
  }
  reactIs_production_min.AsyncMode = l;
  reactIs_production_min.ConcurrentMode = m;
  reactIs_production_min.ContextConsumer = k;
  reactIs_production_min.ContextProvider = h;
  reactIs_production_min.Element = c;
  reactIs_production_min.ForwardRef = n;
  reactIs_production_min.Fragment = e;
  reactIs_production_min.Lazy = t;
  reactIs_production_min.Memo = r;
  reactIs_production_min.Portal = d;
  reactIs_production_min.Profiler = g;
  reactIs_production_min.StrictMode = f;
  reactIs_production_min.Suspense = p;
  reactIs_production_min.isAsyncMode = function (a) {
    return A(a) || z(a) === l;
  };
  reactIs_production_min.isConcurrentMode = A;
  reactIs_production_min.isContextConsumer = function (a) {
    return z(a) === k;
  };
  reactIs_production_min.isContextProvider = function (a) {
    return z(a) === h;
  };
  reactIs_production_min.isElement = function (a) {
    return 'object' === typeof a && null !== a && a.$$typeof === c;
  };
  reactIs_production_min.isForwardRef = function (a) {
    return z(a) === n;
  };
  reactIs_production_min.isFragment = function (a) {
    return z(a) === e;
  };
  reactIs_production_min.isLazy = function (a) {
    return z(a) === t;
  };
  reactIs_production_min.isMemo = function (a) {
    return z(a) === r;
  };
  reactIs_production_min.isPortal = function (a) {
    return z(a) === d;
  };
  reactIs_production_min.isProfiler = function (a) {
    return z(a) === g;
  };
  reactIs_production_min.isStrictMode = function (a) {
    return z(a) === f;
  };
  reactIs_production_min.isSuspense = function (a) {
    return z(a) === p;
  };
  reactIs_production_min.isValidElementType = function (a) {
    return (
      'string' === typeof a ||
      'function' === typeof a ||
      a === e ||
      a === m ||
      a === g ||
      a === f ||
      a === p ||
      a === q ||
      ('object' === typeof a &&
        null !== a &&
        (a.$$typeof === t ||
          a.$$typeof === r ||
          a.$$typeof === h ||
          a.$$typeof === k ||
          a.$$typeof === n ||
          a.$$typeof === w ||
          a.$$typeof === x ||
          a.$$typeof === y ||
          a.$$typeof === v))
    );
  };
  reactIs_production_min.typeOf = z;
  return reactIs_production_min;
}

var hasRequiredReactIs;

function requireReactIs() {
  if (hasRequiredReactIs) return reactIs.exports;
  hasRequiredReactIs = 1;

  {
    reactIs.exports = requireReactIs_production_min();
  }
  return reactIs.exports;
}

var hoistNonReactStatics_cjs;
var hasRequiredHoistNonReactStatics_cjs;

function requireHoistNonReactStatics_cjs() {
  if (hasRequiredHoistNonReactStatics_cjs) return hoistNonReactStatics_cjs;
  hasRequiredHoistNonReactStatics_cjs = 1;

  var reactIs = requireReactIs();

  /**
   * Copyright 2015, Yahoo! Inc.
   * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
   */
  var REACT_STATICS = {
    childContextTypes: true,
    contextType: true,
    contextTypes: true,
    defaultProps: true,
    displayName: true,
    getDefaultProps: true,
    getDerivedStateFromError: true,
    getDerivedStateFromProps: true,
    mixins: true,
    propTypes: true,
    type: true,
  };
  var KNOWN_STATICS = {
    name: true,
    length: true,
    prototype: true,
    caller: true,
    callee: true,
    arguments: true,
    arity: true,
  };
  var FORWARD_REF_STATICS = {
    $$typeof: true,
    render: true,
    defaultProps: true,
    displayName: true,
    propTypes: true,
  };
  var MEMO_STATICS = {
    $$typeof: true,
    compare: true,
    defaultProps: true,
    displayName: true,
    propTypes: true,
    type: true,
  };
  var TYPE_STATICS = {};
  TYPE_STATICS[reactIs.ForwardRef] = FORWARD_REF_STATICS;
  TYPE_STATICS[reactIs.Memo] = MEMO_STATICS;

  function getStatics(component) {
    // React v16.11 and below
    if (reactIs.isMemo(component)) {
      return MEMO_STATICS;
    } // React v16.12 and above

    return TYPE_STATICS[component['$$typeof']] || REACT_STATICS;
  }

  var defineProperty = Object.defineProperty;
  var getOwnPropertyNames = Object.getOwnPropertyNames;
  var getOwnPropertySymbols = Object.getOwnPropertySymbols;
  var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
  var getPrototypeOf = Object.getPrototypeOf;
  var objectPrototype = Object.prototype;
  function hoistNonReactStatics(targetComponent, sourceComponent, blacklist) {
    if (typeof sourceComponent !== 'string') {
      // don't hoist over string (html) components
      if (objectPrototype) {
        var inheritedComponent = getPrototypeOf(sourceComponent);

        if (inheritedComponent && inheritedComponent !== objectPrototype) {
          hoistNonReactStatics(targetComponent, inheritedComponent, blacklist);
        }
      }

      var keys = getOwnPropertyNames(sourceComponent);

      if (getOwnPropertySymbols) {
        keys = keys.concat(getOwnPropertySymbols(sourceComponent));
      }

      var targetStatics = getStatics(targetComponent);
      var sourceStatics = getStatics(sourceComponent);

      for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];

        if (
          !KNOWN_STATICS[key] &&
          !(blacklist && blacklist[key]) &&
          !(sourceStatics && sourceStatics[key]) &&
          !(targetStatics && targetStatics[key])
        ) {
          var descriptor = getOwnPropertyDescriptor(sourceComponent, key);

          try {
            // Avoid failures from read-only properties
            defineProperty(targetComponent, key, descriptor);
          } catch (e) {}
        }
      }
    }

    return targetComponent;
  }

  hoistNonReactStatics_cjs = hoistNonReactStatics;
  return hoistNonReactStatics_cjs;
}

var hoistNonReactStatics_cjsExports = requireHoistNonReactStatics_cjs();
var hoistNonReactStatics = /*@__PURE__*/ getDefaultExportFromCjs(
  hoistNonReactStatics_cjsExports,
);

const socketEvents = {
  connect: 'onConnect',
  disconnect: 'onDisconnect',
  connect_error: 'onConnectError',
  error: 'onError',
};
const managerEvents = {
  reconnect: 'onReconnect',
  reconnect_attempt: 'onReconnectAttempt',
  reconnect_error: 'onReconnectError',
  reconnect_failed: 'onReconnectFailed',
};
const managerMethods = [
  'reconnection',
  'reconnectionAttempts',
  'reconnectionDelay',
  'reconnectionDelayMax',
  'timeout',
];
const reservedProps = new Set([
  'url',
  'options',
  'children',
  'closeOnUnmount',
  'dispatch',
  'io',
  'defaults',
  'onMount',
  'onDismount',
  'onMessage',
  'onConnectTimeout',
  'onReconnecting',
  ...Object.values(socketEvents),
  ...Object.values(managerEvents),
]);

function withSocket(url, options) {
  const optionsOnly = url !== null && typeof url === 'object';
  const factoryUrl = optionsOnly ? undefined : url;
  const factoryOptions = optionsOnly ? url : options;

  return function withSocketConnection(WrappedComponent, config = {}) {
    const { alias = 'WithSocket', withRef = false } = config;

    class Socket extends React.PureComponent {
      constructor(props) {
        super(props);
        this.state = {
          id: undefined,
          uri: undefined,
          nsp: undefined,
          readyState: undefined,
          connected: false,
        };
        this.client = null;
        this.queue = [];
        this.listeners = [];
        this.userListeners = [];
        this.api = {};
        for (const method of [
          'open',
          'close',
          'connect',
          'disconnect',
          'on',
          'once',
          'off',
          'emit',
          'send',
          'compress',
        ]) {
          this.api[method] = (...args) => {
            this.perform(method, args);
            return this.socket;
          };
        }
        for (const method of managerMethods) {
          this.api[method] = value => {
            if (value === undefined) return this.client?.io[method]();
            this.perform(method, [value]);
            return this.socket;
          };
        }
        this.setWrappedInstance = instance => {
          this.wrappedInstance = instance;
        };
      }

      get socket() {
        return Object.freeze({
          ...(this.client ? this.snapshot() : this.state),
          ...this.api,
          io: this.props.io,
        });
      }

      getWrappedInstance() {
        return this.wrappedInstance;
      }

      componentDidMount() {
        this.start();
      }

      componentDidUpdate(previous) {
        if (previous.io !== this.props.io || previous.url !== this.props.url) {
          this.stop(true);
          this.start();
        }
      }

      componentWillUnmount() {
        this.stop(this.props.closeOnUnmount ?? false);
      }

      ownProps() {
        return Object.fromEntries(
          Object.entries(this.props).filter(([key]) => !reservedProps.has(key)),
        );
      }

      snapshot() {
        const { id, nsp, connected, io } = this.client;
        return {
          id,
          nsp,
          connected,
          uri: io.uri,
          readyState: connected
            ? 'open'
            : this.client.active
              ? 'opening'
              : 'closed',
        };
      }

      notify(name, args = []) {
        const callback = this.props[name];
        if (typeof callback === 'function')
          callback(this.props.dispatch, this.socket, ...args);
      }

      listen(target, event, callback) {
        target.on(event, callback);
        this.listeners.push([target, event, callback]);
      }

      start() {
        const { io, defaults } = this.props;
        if (typeof io !== 'function') {
          throw new Error(
            'Pass the Socket.IO client as config.io or register reducer(io) at state.socket.',
          );
        }
        const selected = this.props.options ?? factoryOptions;
        const settings = {
          ...defaults,
          ...(typeof selected === 'function'
            ? selected(this.ownProps())
            : selected),
        };
        this.client =
          this.retainedClient || io(this.props.url ?? factoryUrl, settings);
        this.retainedClient = null;
        for (const [event, name] of Object.entries(socketEvents)) {
          this.listen(this.client, event, (...args) => {
            this.setState(this.snapshot());
            this.notify(name, args);
            if (event === 'connect_error') this.notify('onError', args);
          });
        }
        this.listen(this.client, 'message', (...args) =>
          this.props.onMessage?.(...args),
        );
        for (const [event, name] of Object.entries(managerEvents)) {
          this.listen(this.client.io, event, (...args) => {
            this.notify(name, args);
            if (event === 'reconnect_error') this.notify('onError', args);
          });
        }
        const pending = this.queue.splice(0);
        for (const [method, args] of pending) this.perform(method, args);
        if (settings.autoConnect !== false && !this.client.connected)
          this.client.connect();
        this.setState(this.snapshot());
        this.notify('onMount');
      }

      stop(close) {
        if (!this.client) {
          this.queue = [];
          return;
        }
        try {
          this.notify('onDismount');
        } finally {
          for (const [target, event, callback] of this.listeners)
            target.off(event, callback);
          this.listeners = [];
          for (const { event, listener } of this.userListeners)
            this.client.off(event, listener);
          this.userListeners = [];
          if (close) this.client.disconnect();
          else this.retainedClient = this.client;
          this.client = null;
          this.queue = [];
        }
      }

      perform(method, args) {
        if (!this.client) {
          this.queue.push([method, args]);
          return;
        }
        if (method === 'on' || method === 'once') {
          const [event, callback] = args;
          const entry = { event, callback };
          entry.listener = (...data) => {
            if (method === 'once') {
              this.client.off(event, entry.listener);
              this.userListeners = this.userListeners.filter(
                item => item !== entry,
              );
            }
            callback(...data);
          };
          this.userListeners.push(entry);
          this.client.on(event, entry.listener);
        } else if (method === 'off') {
          const [event, callback] = args;
          this.userListeners = this.userListeners.filter(entry => {
            if (
              (event === undefined || entry.event === event) &&
              (callback === undefined || entry.callback === callback)
            ) {
              this.client.off(entry.event, entry.listener);
              return false;
            }
            return true;
          });
        } else if (managerMethods.includes(method)) {
          this.client.io[method](...args);
        } else if (method === 'send') {
          this.client.emit('message', ...args);
        } else {
          this.client[method](...args);
        }
      }

      render() {
        const payload = { ...this.ownProps(), socket: this.socket };
        if (WrappedComponent) {
          payload.children = this.props.children;
          if (withRef) payload.ref = this.setWrappedInstance;
          return React.createElement(WrappedComponent, payload);
        }
        return typeof this.props.children === 'function'
          ? this.props.children(payload)
          : React.cloneElement(
              React.Children.only(this.props.children),
              payload,
            );
      }
    }

    const displayName =
      WrappedComponent?.displayName || WrappedComponent?.name || 'Component';
    Socket.displayName = `${alias}(${displayName})`;
    const SocketWrapper = reactRedux.connect(
      state => ({
        io: config.io ?? state.socket?.io,
        defaults: config.defaults ?? state.socket?.defaults,
      }),
      null,
      null,
      { forwardRef: withRef },
    )(Socket);
    SocketWrapper.displayName = Socket.displayName;
    return WrappedComponent
      ? hoistNonReactStatics(SocketWrapper, WrappedComponent)
      : SocketWrapper;
  };
}

exports.reducer = reducer;
exports.withSocket = withSocket;
