import React from 'react';
import PropTypes from 'prop-types';
import { connectAdvanced } from 'react-redux';
import 'redux';

const prefix = '@@io';

const CREATE = `${prefix}/create`;
const CONNECT = `${prefix}/connect`;
const DISCONNECT = `${prefix}/disconnect`;
const ON = `${prefix}/on`;
const OFF = `${prefix}/off`;
const ONCE = `${prefix}/once`;
const DEFAULTS = `${prefix}/defaults`;

function reducer(io, defaults) {
  const initialState = {
    io: io,
    defaults: defaults,
  };

  const regexp = new RegExp(`^${prefix}\/`);

  return function socketReducer(state = initialState, action) {
    var obj;

    if (regexp.test(action.type)) {
      const { type, ns } = action;

      switch (type) {
        default:
          return state;
        case CREATE: {
          const { options } = action;

          const socket = io.connect(ns, options);

          return Object.assign({}, state, ( obj = {}, obj[ns] = socket, obj));
        }
        case CONNECT: {
          const socket = state[ns];

          if (socket) { socket.open(); }

          break;
        }
        case DISCONNECT: {
          const socket = state[ns];

          if (socket && socket.connected) { socket.close(); }

          break;
        }
        case ON:
        case OFF:
        case ONCE: {
          const socket = state[ns];

          if (socket) {
            const { event, callback } = action;
            switch (type) {
              default:
                break;
              case ON:
                socket.on(event, callback);
                break;
              case OFF:
                socket.off(event, callback);
                break;
              case ONCE:
                socket.once(event, callback);
                break;
            }
          }
          break;
        }
        case DEFAULTS: {
          const { options } = action;

          Object.assign(state.defaults, options);

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

const propTypes = {
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
  initialize: PropTypes.func,
  onPing: PropTypes.func,
  onPong: PropTypes.func,
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

const defaultProps = {
  url: undefined,
  options: undefined,
  initialize: undefined,
  onPing: undefined,
  onPong: undefined,
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
  // const actions = bindActionCreators(actionCreators, dispatch);

  return function socketPayload(state, props) {
    const { io, defaults = {} } = state.socket;

    const {
      url,
      options,
      initialize,
      onPing,
      onPong,
      onConnect,
      onConnectError,
      onConnectTimeout,
      onError,
      onDisconnect,
      onReconnect,
      onReconnectAttempt,
      onReconnectError,
      onReconnectFailed,
      onReconnecting,
      onMessage,
      closeOnUnmount,
      children,
      ...ownProps
    } = props;

    const opts = options || factoryOpts.options;

    const _url = url || factoryOpts.url;

    const _options = Object.assign(
      {},
      defaults,
      typeof opts === 'function' ? opts(ownProps) : opts
    );

    return {
      // actions,
      ownProps: ownProps,
      dispatch: dispatch,
      initialize: initialize,
      onPing: onPing,
      onPong: onPong,
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

  // console.log(url, options);

  return function withSocketConnection(WrappedComponent, config = {}) {
    const { alias = 'WithSocket', withRef = false } = config;

    const displayName =
      (WrappedComponent || {}).displayName ||
      (WrappedComponent || {}).name ||
      'Component';

    const factoryOpts = {
      url: url,
      options: options,
      withRef: withRef,
      methodName: alias,
      getDisplayName: () => `${alias}(${displayName})`,
    };

    let socket;

    const queue = [];

    class Socket extends React.PureComponent {
      constructor(props) {
        super(props);

        this.state = {
          id: undefined,
          namespace: undefined,
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

      componentDidUpdate() {
        var ref;

        if (queue.length) {
          console.log(queue);
          while (queue.length) {
            const [op, ...args] = queue.shift();
            (ref = this)[op].apply(ref, args);
          }
        }
      }

      componentDidMount() {
        const { io, url, options, initialize, dispatch } = this.props;

        if (socket === undefined) { socket = io(url, options); }

        socket
          .on('message', this.onMessage)
          .on('connect', this.onConnect)
          .on('disconnect', this.onDisconnect)
          .on('connect_error', this.onError)
          .on('reconnect_error', this.onError)
          .on('error', this.onError);

        if (typeof initialize === 'function') { initialize(dispatch, this.socket); }
      }

      componentWillUnmount() {
        const { closeOnUnmount } = this.props;

        socket
          .off('message', this.onMessage)
          .off('connect', this.onConnect)
          .off('disconnect', this.onDisconnect)
          .off('connect_error', this.onError)
          .off('reconnect_error', this.onError)
          .off('error', this.onError);

        if (closeOnUnmount) { socket.close(); }
      }

      getWrappedInstance() {
        return this.wrappedInstance;
      }

      setWrappedInstance(ref) {
        this.wrappedInstance = ref;
      }

      update(cb) {
        const { id, io, connected } = socket;
        const { readyState, uri: namespace } = io;

        this.setState(
          {
            id: id,
            readyState: readyState,
            connected: connected,
            namespace: namespace,
          },
          () => typeof cb === 'function' && cb()
        );
      }

      onMessage() {
        var ref;

        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];
        console.log('onMessage', args);
        if (this.props.onMessage) {
          (ref = this.props).onMessage.apply(ref, args);
        }
      }

      onConnect() {
        const { dispatch } = this.props;

        this.update(() => {
          if (this.props.onConnect) {
            this.props.onConnect(dispatch, this.socket);
          }
        });
      }

      onDisconnect(reason) {
        const { dispatch } = this.props;

        this.setState(() => {
          if (this.props.onDisconnect) {
            this.props.onDisconnect(dispatch, this.socket, reason);
          }
        });
      }

      onPing() {
        const { dispatch } = this.props;
        if (this.props.onPing) {
          this.props.onPing(dispatch, this.socket);
        }
      }

      onPong(latency) {
        const { dispatch } = this.props;
        if (this.props.onPong) {
          this.props.onPong(dispatch, this.socket, latency);
        }
      }

      onError(error) {
        const { dispatch } = this.props;
        if (this.props.onError) {
          this.props.onError(dispatch, this.socket, error);
        }
      }

      createInterface() {
        const {
          props,
          state,
          open,
          close,
          connect,
          disconnect,
          on,
          once,
          off,
          emit,
          send,
          compress,
          reconnection,
          reconnectionAttempts,
          reconnectionDelay,
          reconnectionDelayMax,
          timeout,
        } = this;

        const { io } = props;

        const _socket = Object.create(null);

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
      }

      open() {
        if (socket) { socket.open(); }
        else { queue.push(['open']); }
        return this;
      }

      close() {
        if (socket) { socket.close(); }
        else { queue.push(['close']); }
        return this;
      }

      connect() {
        if (socket) { socket.open(); }
        else { queue.push(['connect']); }
        return this;
      }

      disconnect() {
        if (socket) { socket.close(); }
        else { queue.push(['disconnect']); }
        return this;
      }

      on(event, cb) {
        if (socket) { socket.on(event, cb); }
        else { queue.push(['on', event, cb]); }
        return this;
      }

      once(event, cb) {
        if (socket) { socket.once(event, cb); }
        else { queue.push(['once', event, cb]); }
        return this;
      }

      off(event, cb) {
        if (socket) { socket.off(event, cb); }
        else { queue.push(['off', event, cb]); }
        return this;
      }

      emit(event) {
        var args = [], len = arguments.length - 1;
        while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

        if (socket && socket.connected) { socket.emit.apply(socket, [ event ].concat( args )); }
        else { queue.push(['emit', event ].concat( args)); }
        return this;
      }

      send() {
        var ref;

        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];
        return (ref = this).emit.apply(ref, [ 'message' ].concat( args ));
      }

      compress(value) {
        if (socket) { socket.compress(value); }
        else { queue.push(['compress', value]); }
        return this;
      }

      reconnection(value) {
        if (value !== undefined) {
          socket.io.reconnection(value);
          return this;
        }
        return socket.io.reconnection();
      }

      reconnectionAttempts(value) {
        if (value !== undefined) {
          socket.io.reconnectionAttempts(value);
          return this;
        }
        return socket.io.reconnectionAttempts();
      }

      reconnectionDelay(value) {
        if (value !== undefined) {
          socket.io.reconnectionDelay(value);
          return this;
        }
        return socket.io.reconnectionDelay();
      }

      reconnectionDelayMax(value) {
        if (value !== undefined) {
          socket.io.reconnectionDelayMax(value);
          return this;
        }
        return socket.io.reconnectionDelayMax();
      }

      timeout(value) {
        if (value !== undefined) {
          socket.io.timeout(value);
          return this;
        }
        return socket.io.timeout();
      }

      render() {
        const { ownProps } = this.props;

        const payload = Object.assign({}, ownProps, {socket: this.createInterface()});

        if (WrappedComponent) {
          if (withRef) { payload.ref = this.setWrappedInstance; }

          return React.createElement(WrappedComponent, payload);
        }

        const { children } = this.props;

        return typeof children === 'function'
          ? children(payload)
          : React.cloneElement(children, payload);
      }
    }

    const connection = connectAdvanced(socketConnection, factoryOpts);

    const SocketWrapper = connection(Socket);

    const WithSocket = WrappedComponent
      ? hoistNonReactStatics(SocketWrapper, WrappedComponent)
      : SocketWrapper;

    WithSocket.propTypes = propTypes;

    WithSocket.defaultProps = defaultProps;

    return WithSocket;
  };
}

export { reducer, withSocket };
