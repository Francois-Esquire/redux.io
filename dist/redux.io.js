'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));
var PropTypes = _interopDefault(require('prop-types'));
var reactRedux = require('react-redux');

var prefix = '@@io';

var CREATE = prefix + "/create";
var CONNECT = prefix + "/connect";
var DISCONNECT = prefix + "/disconnect";
var ON = prefix + "/on";
var OFF = prefix + "/off";
var ONCE = prefix + "/once";
var DEFAULTS = prefix + "/defaults";

function reducer(io, defaults) {
  if (io === undefined)
    { throw new Error(
      'Please make sure you are passing in socket.io to the reducer.'
    ); }

  var initialState = {
    io: io,
    defaults: defaults,
  };

  var regexp = new RegExp(("^" + prefix + "/"));

  return function socketReducer(state, action) {
    var obj;

    if ( state === void 0 ) state = initialState;
    if (regexp.test(action.type)) {
      var type = action.type;
      var nsp = action.nsp;
      var uri = action.uri;

      switch (type) {
        default:
          return state;
        case CREATE: {
          var options = action.options;

          var socket = io.connect(nsp, options);

          return Object.assign({}, state, ( obj = {}, obj[nsp] = socket, obj));
        }
        case CONNECT: {
          var manager = io.managers[uri.replace(nsp)];
          var socket$1 = manager.nsps[nsp];

          if (socket$1) { socket$1.open(); }

          break;
        }
        case DISCONNECT: {
          var manager$1 = io.managers[uri.replace(nsp)];
          var socket$2 = manager$1.nsps[nsp];

          if (socket$2 && socket$2.connected) { socket$2.close(); }

          break;
        }
        case ON:
        case OFF:
        case ONCE: {
          var manager$2 = io.managers[uri.replace(nsp)];
          var socket$3 = manager$2.nsps[nsp];

          if (socket$3) {
            var event = action.event;
            var callback = action.callback;
            switch (type) {
              default:
                break;
              case ON:
                socket$3.on(event, callback);
                break;
              case OFF:
                socket$3.off(event, callback);
                break;
              case ONCE:
                socket$3.once(event, callback);
                break;
            }
          }
          break;
        }
        case DEFAULTS: {
          var options$1 = action.options;

          Object.assign(state.defaults, options$1);

          break;
        }
      }

      return Object.assign({}, state);
    }
    return state;
  };
}

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var hoistNonReactStatics = createCommonjsModule(function (module, exports) {
/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
(function (global, factory) {
    module.exports = factory();
}(commonjsGlobal, (function () {
    
    var REACT_STATICS = {
        childContextTypes: true,
        contextTypes: true,
        defaultProps: true,
        displayName: true,
        getDefaultProps: true,
        getDerivedStateFromProps: true,
        mixins: true,
        propTypes: true,
        type: true
    };
    
    var KNOWN_STATICS = {
        name: true,
        length: true,
        prototype: true,
        caller: true,
        callee: true,
        arguments: true,
        arity: true
    };
    
    var defineProperty = Object.defineProperty;
    var getOwnPropertyNames = Object.getOwnPropertyNames;
    var getOwnPropertySymbols = Object.getOwnPropertySymbols;
    var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
    var getPrototypeOf = Object.getPrototypeOf;
    var objectPrototype = getPrototypeOf && getPrototypeOf(Object);
    
    return function hoistNonReactStatics(targetComponent, sourceComponent, blacklist) {
        if (typeof sourceComponent !== 'string') { // don't hoist over string (html) components
            
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
            
            for (var i = 0; i < keys.length; ++i) {
                var key = keys[i];
                if (!REACT_STATICS[key] && !KNOWN_STATICS[key] && (!blacklist || !blacklist[key])) {
                    var descriptor = getOwnPropertyDescriptor(sourceComponent, key);
                    try { // Avoid failures from read-only properties
                        defineProperty(targetComponent, key, descriptor);
                    } catch (e) {}
                }
            }
            
            return targetComponent;
        }
        
        return targetComponent;
    };
})));
});

function objectWithoutProperties (obj, exclude) { var target = {}; for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k) && exclude.indexOf(k) === -1) target[k] = obj[k]; return target; }

var propTypes = {
  url: PropTypes.string,
  options: PropTypes.oneOfType([
    PropTypes.shape({
      path: PropTypes.string,
      query: PropTypes.object,
      forceNew: PropTypes.bool,
      multiplex: PropTypes.bool,
      transports: PropTypes.arrayOf(PropTypes.string),
      reconnection: PropTypes.bool,
      reconnectionAttempts: PropTypes.number,
      reconnectionDelay: PropTypes.number,
      reconnectionDelayMax: PropTypes.number,
      randomizationFactor: PropTypes.number,
      timeout: PropTypes.number,
      autoConnect: PropTypes.bool,
      parser: PropTypes.object,
      upgrade: PropTypes.bool,
      jsonp: PropTypes.bool,
      forceJSONP: PropTypes.bool,
      forceBase64: PropTypes.bool,
      enablesXDR: PropTypes.bool,
      timestampRequests: PropTypes.bool,
      timestampParam: PropTypes.string,
      policyPort: PropTypes.number,
      transportOptions: PropTypes.object,
      rememberUpgrade: PropTypes.bool,
      pfx: PropTypes.string,
      Key: PropTypes.string,
      passphrase: PropTypes.string,
      cert: PropTypes.string,
    }),
    PropTypes.func ]),
  onMount: PropTypes.func,
  onDismount: PropTypes.func,
  onConnect: PropTypes.func,
  onConnectError: PropTypes.func,
  onConnectTimeout: PropTypes.func,
  onError: PropTypes.func,
  onDisconnect: PropTypes.func,
  onReconnect: PropTypes.func,
  onReconnectAttempt: PropTypes.func,
  onReconnectError: PropTypes.func,
  onReconnectFailed: PropTypes.func,
  onReconnecting: PropTypes.func,
  onMessage: PropTypes.func,
  closeOnUnmount: PropTypes.bool,
};

var defaultProps = {
  url: undefined,
  options: undefined,
  onMount: undefined,
  onDismount: undefined,
  onConnect: undefined,
  onConnectError: undefined,
  onConnectTimeout: undefined,
  onError: undefined,
  onDisconnect: undefined,
  onReconnect: undefined,
  onReconnectAttempt: undefined,
  onReconnectError: undefined,
  onReconnectFailed: undefined,
  onReconnecting: undefined,
  onMessage: undefined,
  closeOnUnmount: false,
};

function socketConnection(dispatch, factoryOpts) {
  return function socketPayload(state, props) {
    var ref = state.socket;
    var io = ref.io;
    var defaults = ref.defaults; if ( defaults === void 0 ) defaults = {};

    var url = props.url;
    var options = props.options;
    var onMount = props.onMount;
    var onDismount = props.onDismount;
    var onConnect = props.onConnect;
    var onConnectError = props.onConnectError;
    var onConnectTimeout = props.onConnectTimeout;
    var onError = props.onError;
    var onDisconnect = props.onDisconnect;
    var onReconnect = props.onReconnect;
    var onReconnectAttempt = props.onReconnectAttempt;
    var onReconnectError = props.onReconnectError;
    var onReconnectFailed = props.onReconnectFailed;
    var onReconnecting = props.onReconnecting;
    var onMessage = props.onMessage;
    var closeOnUnmount = props.closeOnUnmount;
    var children = props.children;
    var rest = objectWithoutProperties( props, ["url", "options", "onMount", "onDismount", "onConnect", "onConnectError", "onConnectTimeout", "onError", "onDisconnect", "onReconnect", "onReconnectAttempt", "onReconnectError", "onReconnectFailed", "onReconnecting", "onMessage", "closeOnUnmount", "children"] );
    var ownProps = rest;

    var opts = options || factoryOpts.options;

    var _url = url || factoryOpts.url;

    var _options = Object.assign(
      {},
      defaults,
      typeof opts === 'function' ? opts(ownProps) : opts
    );

    return {
      ownProps: ownProps,
      dispatch: dispatch,
      onMount: onMount,
      onDismount: onDismount,
      onConnect: onConnect,
      onConnectError: onConnectError,
      onConnectTimeout: onConnectTimeout,
      onError: onError,
      onDisconnect: onDisconnect,
      onReconnect: onReconnect,
      onReconnectAttempt: onReconnectAttempt,
      onReconnectError: onReconnectError,
      onReconnectFailed: onReconnectFailed,
      onReconnecting: onReconnecting,
      onMessage: onMessage,
      closeOnUnmount: closeOnUnmount,
      children: children,
      io: io,
      url: _url,
      options: _options,
    };
  };
}

function withSocket(url, options) {
  if (url && typeof url === 'object') {
    // eslint-disable-next-line no-param-reassign
    options = url;
    // eslint-disable-next-line no-param-reassign
    url = undefined;
  }

  return function withSocketConnection(WrappedComponent, config) {
    if ( config === void 0 ) config = {};

    var alias = config.alias; if ( alias === void 0 ) alias = 'WithSocket';
    var withRef = config.withRef; if ( withRef === void 0 ) withRef = false;

    var displayName =
      (WrappedComponent || {}).displayName ||
      (WrappedComponent || {}).name ||
      'Component';

    var factoryOpts = {
      url: url,
      options: options,
      withRef: withRef,
      methodName: alias,
      getDisplayName: function () { return (alias + "(" + displayName + ")"); },
    };

    var socket;

    var queue = [];

    var Socket = (function (superclass) {
      function Socket(props) {
        superclass.call(this, props);

        this.state = {
          id: undefined,
          uri: undefined,
          nsp: undefined,
          readyState: undefined,
          connected: false,
        };

        this.setWrappedInstance = this.setWrappedInstance.bind(this);
        this.onConnect = this.onConnect.bind(this);
        this.onDisconnect = this.onDisconnect.bind(this);
        this.onMessage = this.onMessage.bind(this);
        this.onError = this.onError.bind(this);

        Object.defineProperties(this, {
          socket: {
            get: function get() {
              return this.createInterface();
            },
          },
        });
      }

      if ( superclass ) Socket.__proto__ = superclass;
      Socket.prototype = Object.create( superclass && superclass.prototype );
      Socket.prototype.constructor = Socket;

      Socket.prototype.componentDidUpdate = function componentDidUpdate () {
        var this$1 = this;
        var ref$1;

        if (queue.length) {
          while (queue.length) {
            var ref = queue.shift();
            var op = ref[0];
            var args = ref.slice(1);
            (ref$1 = this$1)[op].apply(ref$1, args);
          }
        }
      };

      Socket.prototype.componentDidMount = function componentDidMount () {
        var ref = this.props;
        var url = ref.url;
        var options = ref.options;
        var io = ref.io;
        var onMount = ref.onMount;
        var dispatch = ref.dispatch;

        if (socket === undefined) { socket = io(url, options); }

        socket
          .on('message', this.onMessage)
          .on('connect', this.onConnect)
          .on('disconnect', this.onDisconnect)
          .on('connect_error', this.onError)
          .on('reconnect_error', this.onError)
          .on('error', this.onError);

        if (typeof onMount === 'function') { onMount(dispatch, this.socket); }
      };

      Socket.prototype.componentWillUnmount = function componentWillUnmount () {
        var ref = this.props;
        var dispatch = ref.dispatch;
        var closeOnUnmount = ref.closeOnUnmount;
        var onDismount = ref.onDismount;

        socket
          .off('message', this.onMessage)
          .off('connect', this.onConnect)
          .off('disconnect', this.onDisconnect)
          .off('connect_error', this.onError)
          .off('reconnect_error', this.onError)
          .off('error', this.onError);

        if (typeof onDismount === 'function') { onDismount(dispatch, this.socket); }

        if (closeOnUnmount) { socket.close(); }
      };

      Socket.prototype.getWrappedInstance = function getWrappedInstance () {
        return this.wrappedInstance;
      };

      Socket.prototype.setWrappedInstance = function setWrappedInstance (ref) {
        this.wrappedInstance = ref;
      };

      Socket.prototype.update = function update (cb) {
        var id = socket.id;
        var nsp = socket.nsp;
        var connected = socket.connected;
        var io = socket.io;
        var uri = io.uri;
        var readyState = io.readyState;

        this.setState(
          {
            id: id,
            uri: uri,
            nsp: nsp,
            readyState: readyState,
            connected: connected,
          },
          function () { return typeof cb === 'function' && cb(); }
        );
      };

      Socket.prototype.onMessage = function onMessage () {
        var ref;

        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];
        if (this.props.onMessage) {
          (ref = this.props).onMessage.apply(ref, args);
        }
      };

      Socket.prototype.onConnect = function onConnect () {
        var this$1 = this;

        var ref = this.props;
        var dispatch = ref.dispatch;

        this.update(function () {
          if (this$1.props.onConnect) {
            this$1.props.onConnect(dispatch, this$1.socket);
          }
        });
      };

      Socket.prototype.onDisconnect = function onDisconnect (reason) {
        var this$1 = this;

        var ref = this.props;
        var dispatch = ref.dispatch;

        this.setState(function () {
          if (this$1.props.onDisconnect) {
            this$1.props.onDisconnect(dispatch, this$1.socket, reason);
          }
        });
      };

      Socket.prototype.onError = function onError (error) {
        var ref = this.props;
        var dispatch = ref.dispatch;
        if (this.props.onError) {
          this.props.onError(dispatch, this.socket, error);
        }
      };

      Socket.prototype.createInterface = function createInterface () {
        var ref = this;
        var props = ref.props;
        var state = ref.state;
        var open = ref.open;
        var close = ref.close;
        var connect = ref.connect;
        var disconnect = ref.disconnect;
        var on = ref.on;
        var once = ref.once;
        var off = ref.off;
        var emit = ref.emit;
        var send = ref.send;
        var compress = ref.compress;
        var reconnection = ref.reconnection;
        var reconnectionAttempts = ref.reconnectionAttempts;
        var reconnectionDelay = ref.reconnectionDelay;
        var reconnectionDelayMax = ref.reconnectionDelayMax;
        var timeout = ref.timeout;

        var io = props.io;

        var _socket = Object.create(null);

        Object.assign(_socket, state, {
          open: open,
          close: close,
          connect: connect,
          disconnect: disconnect,
          on: on,
          once: once,
          off: off,
          emit: emit,
          send: send,
          compress: compress,
          reconnection: reconnection,
          reconnectionAttempts: reconnectionAttempts,
          reconnectionDelay: reconnectionDelay,
          reconnectionDelayMax: reconnectionDelayMax,
          timeout: timeout,
          io: io,
        });

        Object.freeze(_socket);

        return _socket;
      };

      Socket.prototype.open = function open () {
        if (socket) { socket.open(); }
        else { queue.push(['open']); }
        return this;
      };

      Socket.prototype.close = function close () {
        if (socket) { socket.close(); }
        else { queue.push(['close']); }
        return this;
      };

      Socket.prototype.connect = function connect () {
        if (socket) { socket.open(); }
        else { queue.push(['connect']); }
        return this;
      };

      Socket.prototype.disconnect = function disconnect () {
        if (socket) { socket.close(); }
        else { queue.push(['disconnect']); }
        return this;
      };

      Socket.prototype.on = function on (event, cb) {
        if (socket) { socket.on(event, cb); }
        else { queue.push(['on', event, cb]); }
        return this;
      };

      Socket.prototype.once = function once (event, cb) {
        if (socket) { socket.once(event, cb); }
        else { queue.push(['once', event, cb]); }
        return this;
      };

      Socket.prototype.off = function off (event, cb) {
        if (socket) { socket.off(event, cb); }
        else { queue.push(['off', event, cb]); }
        return this;
      };

      Socket.prototype.emit = function emit (event) {
        var args = [], len = arguments.length - 1;
        while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

        if (socket && socket.connected) { socket.emit.apply(socket, [ event ].concat( args )); }
        else { queue.push(['emit', event ].concat( args)); }
        return this;
      };

      Socket.prototype.send = function send () {
        var ref;

        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];
        return (ref = this).emit.apply(ref, [ 'message' ].concat( args ));
      };

      Socket.prototype.compress = function compress (value) {
        if (socket) { socket.compress(value); }
        else { queue.push(['compress', value]); }
        return this;
      };

      Socket.prototype.reconnection = function reconnection (value) {
        if (value !== undefined) {
          socket.io.reconnection(value);
          return this;
        }
        return socket.io.reconnection();
      };

      Socket.prototype.reconnectionAttempts = function reconnectionAttempts (value) {
        if (value !== undefined) {
          socket.io.reconnectionAttempts(value);
          return this;
        }
        return socket.io.reconnectionAttempts();
      };

      Socket.prototype.reconnectionDelay = function reconnectionDelay (value) {
        if (value !== undefined) {
          socket.io.reconnectionDelay(value);
          return this;
        }
        return socket.io.reconnectionDelay();
      };

      Socket.prototype.reconnectionDelayMax = function reconnectionDelayMax (value) {
        if (value !== undefined) {
          socket.io.reconnectionDelayMax(value);
          return this;
        }
        return socket.io.reconnectionDelayMax();
      };

      Socket.prototype.timeout = function timeout (value) {
        if (value !== undefined) {
          socket.io.timeout(value);
          return this;
        }
        return socket.io.timeout();
      };

      Socket.prototype.render = function render () {
        var ref = this.props;
        var ownProps = ref.ownProps;

        var payload = Object.assign({}, ownProps, {socket: this.createInterface()});

        if (WrappedComponent) {
          if (withRef) { payload.ref = this.setWrappedInstance; }

          return React.createElement(WrappedComponent, payload);
        }

        var ref$1 = this.props;
        var children = ref$1.children;

        return typeof children === 'function'
          ? children(payload)
          : React.cloneElement(children, payload);
      };

      return Socket;
    }(React.PureComponent));

    var connection = reactRedux.connectAdvanced(socketConnection, factoryOpts);

    var SocketWrapper = connection(Socket);

    var WithSocket = WrappedComponent
      ? hoistNonReactStatics(SocketWrapper, WrappedComponent)
      : SocketWrapper;

    WithSocket.propTypes = propTypes;

    WithSocket.defaultProps = defaultProps;

    return WithSocket;
  };
}

exports.reducer = reducer;
exports.withSocket = withSocket;
