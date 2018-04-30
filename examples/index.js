'use strict';

var React = require('react');
var PropTypes = require('prop-types');
var reactRedux = require('react-redux');
require('redux');
var reactRouterDom = require('react-router-dom');
var fs = require('fs');
var url = require('url');
var stream = require('stream');
var server = require('react-dom/server');
var WebSocket$1 = require('ws');
var http = require('http');

function Home() {
  return (
    React.createElement( 'article', null,
      React.createElement( 'header', null,
        React.createElement( 'h1', null, "Click the links above to try an example" )
      )
    )
  );
}

function objectWithoutProperties (obj, exclude) { var target = {}; for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k) && exclude.indexOf(k) === -1) target[k] = obj[k]; return target; }

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
    var ref = state.socket;
    var io = ref.io;
    var defaults = ref.defaults; if ( defaults === void 0 ) defaults = {};

    var url$$1 = props.url;
    var options = props.options;
    var initialize = props.initialize;
    var onPing = props.onPing;
    var onPong = props.onPong;
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
    var rest = objectWithoutProperties( props, ["url", "options", "initialize", "onPing", "onPong", "onConnect", "onConnectError", "onConnectTimeout", "onError", "onDisconnect", "onReconnect", "onReconnectAttempt", "onReconnectError", "onReconnectFailed", "onReconnecting", "onMessage", "closeOnUnmount", "children"] );
    var ownProps = rest;

    const opts = options || factoryOpts.options;

    const _url = url$$1 || factoryOpts.url;

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

function withSocket(url$$1, options) {
  if (url$$1 && typeof url$$1 === 'object') {
    // eslint-disable-next-line no-param-reassign
    options = url$$1;
    // eslint-disable-next-line no-param-reassign
    url$$1 = undefined;
  }

  // console.log(url, options);

  return function withSocketConnection(WrappedComponent, config) {
    if ( config === void 0 ) config = {};

    var alias = config.alias; if ( alias === void 0 ) alias = 'WithSocket';
    var withRef = config.withRef; if ( withRef === void 0 ) withRef = false;

    const displayName =
      (WrappedComponent || {}).displayName ||
      (WrappedComponent || {}).name ||
      'Component';

    const factoryOpts = {
      url: url$$1,
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
            var ref$1 = queue.shift();
            var op = ref$1[0];
            var args = ref$1.slice(1);
            (ref = this)[op].apply(ref, args);
          }
        }
      }

      componentDidMount() {
        var ref = this.props;
        var io = ref.io;
        var url$$1 = ref.url;
        var options = ref.options;
        var initialize = ref.initialize;
        var dispatch = ref.dispatch;

        if (socket === undefined) { socket = io(url$$1, options); }

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
        var ref = this.props;
        var closeOnUnmount = ref.closeOnUnmount;

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
        var id = socket.id;
        var io = socket.io;
        var connected = socket.connected;
        var readyState = io.readyState;
        var namespace = io.uri;

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
        while ( len-- ) { args[ len ] = arguments[ len ]; }
        console.log('onMessage', args);
        if (this.props.onMessage) {
          (ref = this.props).onMessage.apply(ref, args);
        }
      }

      onConnect() {
        var ref = this.props;
        var dispatch = ref.dispatch;

        this.update(() => {
          if (this.props.onConnect) {
            this.props.onConnect(dispatch, this.socket);
          }
        });
      }

      onDisconnect(reason) {
        var ref = this.props;
        var dispatch = ref.dispatch;

        this.setState(() => {
          if (this.props.onDisconnect) {
            this.props.onDisconnect(dispatch, this.socket, reason);
          }
        });
      }

      onPing() {
        var ref = this.props;
        var dispatch = ref.dispatch;
        if (this.props.onPing) {
          this.props.onPing(dispatch, this.socket);
        }
      }

      onPong(latency) {
        var ref = this.props;
        var dispatch = ref.dispatch;
        if (this.props.onPong) {
          this.props.onPong(dispatch, this.socket, latency);
        }
      }

      onError(error) {
        var ref = this.props;
        var dispatch = ref.dispatch;
        if (this.props.onError) {
          this.props.onError(dispatch, this.socket, error);
        }
      }

      createInterface() {
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
        while ( len-- > 0 ) { args[ len ] = arguments[ len + 1 ]; }

        if (socket && socket.connected) { socket.emit.apply(socket, [ event ].concat( args )); }
        else { queue.push(['emit', event ].concat( args)); }
        return this;
      }

      send() {
        var ref;

        var args = [], len = arguments.length;
        while ( len-- ) { args[ len ] = arguments[ len ]; }
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
        var ref = this.props;
        var ownProps = ref.ownProps;

        const payload = Object.assign({}, ownProps, {socket: this.createInterface()});

        if (WrappedComponent) {
          if (withRef) { payload.ref = this.setWrappedInstance; }

          return React.createElement(WrappedComponent, payload);
        }

        var ref$1 = this.props;
        var children = ref$1.children;

        return typeof children === 'function'
          ? children(payload)
          : React.cloneElement(children, payload);
      }
    }

    const connection = reactRedux.connectAdvanced(socketConnection, factoryOpts);

    const SocketWrapper = connection(Socket);

    const WithSocket = WrappedComponent
      ? hoistNonReactStatics(SocketWrapper, WrappedComponent)
      : SocketWrapper;

    WithSocket.propTypes = propTypes;

    WithSocket.defaultProps = defaultProps;

    return WithSocket;
  };
}

class ZombieLand extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      players: 0,
      infected: 0,
      infectious: false,
      x: 0,
      y: 0,
    };

    this.keyUp = this.keyUp.bind(this);
  }

  componentDidMount() {
    var ref = this.props;
    var socket = ref.socket;

    socket
      .on('count', players => this.setState({ players: players }))
      .on('infected', infected => this.setState({ infected: infected }))
      .on('infectious', infectious => this.setState({ infectious: infectious }))
      .connect();

    document.body.addEventListener('keydown', this.keyUp);
  }

  componentDidUpdate(_props, _state) {
    var ref = this.state;
    var x = ref.x;
    var y = ref.y;

    if (_state.x !== x || _state.y !== y) { this.move(); }
  }

  componentWillUnmount() {
    document.body.removeEventListener('keydown', this.keyUp);
  }

  move() {
    var ref = this.props;
    var socket = ref.socket;
    var ref$1 = this.state;
    var x = ref$1.x;
    var y = ref$1.y;

    socket.emit('position', x, y);
  }

  keyUp(event) {
    event.preventDefault();

    var keyCode = event.keyCode;

    var ref = this.state;
    var x = ref.x;
    var y = ref.y;

    switch (keyCode) {
      default:
        break;
      case 37: /* Arrow Left */
      case 39: /* Arrow Right */
      case 65: /* a */
      case 68: /* d */ {
        if ([39, 68].includes(keyCode)) {
          if (x + 1 <= 100) { this.setState({ x: x + 1 }); }
        } else if ([37, 65].includes(keyCode)) {
          if (x - 1 >= 0) { this.setState({ x: x - 1 }); }
        }
        break;
      }
      case 38: /* Arrow Up */
      case 40: /* Arrow Down */
      case 87: /* w */
      case 83: /* s */ {
        if ([40, 83].includes(keyCode)) {
          if (y + 1 <= 100) { this.setState({ y: y + 1 }); }
        } else if ([38, 87].includes(keyCode)) {
          if (y - 1 >= 0) { this.setState({ y: y - 1 }); }
        }
        break;
      }
    }
  }

  render() {
    var ref = this.props;
    var socket = ref.socket;
    var ref$1 = this.state;
    var x = ref$1.x;
    var y = ref$1.y;
    var players = ref$1.players;
    var infected = ref$1.infected;
    var infectious = ref$1.infectious;

    return socket.connected ? (
      React.createElement( 'section', null,
        React.createElement( 'header', null,
          React.createElement( 'h1', null, "Welcome To Zombie Land" ),

          React.createElement( 'p', null, "Players: ", players )
        ),

        React.createElement( 'code', null, "[PLACE GAME VIEW HERE]" ),

        React.createElement( 'p', null, "X: ", React.createElement( 'span', null, x ), ", Y: ", React.createElement( 'span', null, y )
        ),

        React.createElement( 'footer', null,
          React.createElement( 'p', null, "Infected Count: ", infected ),
          React.createElement( 'p', null, "Are You Infected?", ' ',
            infectious ? 'EAT BRAIN...' : 'Naaa You Still Good! RUN!'
          ),

          React.createElement( 'button', { type: "button", onClick: () => socket.disconnect() }, "I can", "'", "t take this anymore...")
        )
      )
    ) : (
      React.createElement( 'button', { type: "button", onClick: () => socket.connect() }, "Step Inside, But Tread Lightly..")
    );
  }
}

const ManHunt = withSocket('/hunt', {
  autoConnect: false,
})(ZombieLand);

class Socket extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      socket: null,
      readyState: 0,
      subscribers: [],
    };

    this.onOpen = this.onOpen.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onMessage = this.onMessage.bind(this);
    this.onError = this.onError.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
    this.send = this.send.bind(this);
  }

  componentDidMount() {
    if (this.props.connectOnMount) { this.initialize(); }
  }

  componentWillUnmount() {
    if (this.state.socket) { this.close(); }
  }

  onOpen(event) {
    if (typeof this.props.onOpen === 'function')
      { this.props.onOpen(this.state.socket); }

    if (this.state.subscribers.length)
      { this.state.subscribers.forEach(
        (ref) => {
          var cb = ref.cb;
          var type = ref.type;

          return type === 'open' && cb(event);
        }
      ); }

    this.setState({ readyState: this.state.socket.readyState });
  }

  onClose(event) {
    if (typeof this.props.onClose === 'function') { this.props.onClose(event); }

    if (this.state.subscribers.length)
      { this.state.subscribers.forEach(
        (ref) => {
          var cb = ref.cb;
          var type = ref.type;

          return type === 'close' && cb(event);
        }
      ); }

    this.setState({ readyState: this.state.socket.readyState, socket: null });
  }

  onMessage(event) {
    if (typeof this.props.onMessage === 'function') { this.props.onMessage(event); }

    if (this.state.subscribers.length)
      { this.state.subscribers.forEach(
        (ref) => {
          var cb = ref.cb;
          var type = ref.type;

          return type === 'message' && cb(event);
        }
      ); }
  }

  onError(event) {
    if (typeof this.props.onError === 'function') { this.props.onError(event); }

    if (this.state.subscribers.length)
      { this.state.subscribers.forEach(
        (ref) => {
          var cb = ref.cb;
          var type = ref.type;

          return type === 'error' && cb(event);
        }
      ); }
  }

  initialize() {
    var ref = this.props;
    var url$$1 = ref.url;
    var protocols = ref.protocols;

    // check if websockets supported.
    const ws = new WebSocket(url$$1, protocols);

    ws.onopen = this.onOpen;
    ws.onclose = this.onClose;
    ws.onmessage = this.onMessage;
    ws.onerror = this.onError;

    this.setState({ readyState: ws.readyState, socket: ws });
  }

  subscribe(cb, type) {
    if ( type === void 0 ) type = 'message';

    if (typeof cb !== 'function')
      { throw new Error('the callback passed to subscribe must be a function'); }

    const id = `${Math.random()}`;

    this.setState(state => ({
      subscribers: state.subscribers.concat({ cb: cb, type: type, id: id }),
    }));

    return () =>
      !this.setState(state => ({
        subscribers: state.subscribers.filter(sub => sub.id !== id),
      })) && null;
  }

  open() {
    if (this.state.socket === null) { this.initialize(); }
  }

  close() {
    if (this.state.socket) { this.state.socket.close(); }
    else { console.warn('Socket is already closed'); }
  }

  send() {
    var ref;

    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];
    if (this.state.socket) { (ref = this.state.socket).send.apply(ref, args); }
    else { console.warn('Socket is already closed'); }
  }

  render() {
    var ref = this;
    var children = ref.props.children;
    var ref_state = ref.state;
    var readyState = ref_state.readyState;
    var socket = ref_state.socket;
    var subscribe = ref.subscribe;
    var close = ref.close;
    var open = ref.open;
    var send = ref.send;

    const payload = {
      readyState: readyState,
      subscribe: subscribe,
      close: close,
      open: open,
      send: send,
      socket: socket,
    };

    return typeof children === 'function'
      ? children(payload)
      : React.cloneElement(children, payload);
  }
}

Socket.propTypes = {
  url: PropTypes.string.isRequired,
  protocols: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string) ]),
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  onMessage: PropTypes.func,
  onError: PropTypes.func,
  connectOnMount: PropTypes.bool,
};

Socket.defaultProps = {
  protocols: undefined,
  onOpen: undefined,
  onClose: undefined,
  onMessage: undefined,
  onError: undefined,
  connectOnMount: true,
};

class Connection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      subscription: null,
      closed: true,
    };
  }
  render() {
    var ref = this;
    var ref_state = ref.state;
    var messages = ref_state.messages;
    var subscription = ref_state.subscription;
    var closed = ref_state.closed;
    return (
      React.createElement( Socket, {
        url: "ws://localhost:3000/example", onOpen: () => this.setState({ closed: false }), onClose: () => this.setState({ closed: true }), onMessage: event => {
          this.setState({
            messages: messages.concat(event),
          });
        }, onError: event => {
          console.log(event);
        } },
        socket => (
          React.createElement( 'div', null,
            React.createElement( 'ul', null,
              React.Children.toArray(
                messages.map(
                  message => (message.data ? React.createElement( 'li', null, message.data ) : null)
                )
              )
            ),

            React.createElement( 'button', { type: "button", onClick: () => socket.send('Hey') }, "Say Hi"),

            React.createElement( 'button', { type: "button", onClick: () => socket.send('Error') }, "Send Error"),

            React.createElement( 'button', {
              type: "button", onClick: () =>
                subscription
                  ? this.setState({ subscription: subscription() })
                  : this.setState({
                      subscription: socket.subscribe(event =>
                        this.setState({
                          messages: messages.concat(event),
                        })
                      ),
                    }) },
              subscription ? 'Unsubscribe' : 'Subscribe'
            ),

            React.createElement( 'button', {
              type: "button", onClick: () => (closed ? socket.open() : socket.close()) },
              closed ? 'Greet' : 'Say Bye'
            )
          )
        )
      )
    );
  }
}

function RootLayer(ref) {
  var children = ref.children;

  return (
    React.createElement( React.Fragment, null,
      children,
      React.createElement( 'main', null,
        React.createElement( 'header', null,
          React.createElement( 'h1', null, "redux.io" ),

          React.createElement( 'nav', null,
            React.createElement( reactRouterDom.NavLink, { to: "/" }, "Home"),
            React.createElement( reactRouterDom.NavLink, { to: "/zombies" }, "Zombies")
          )
        ),

        React.createElement( reactRouterDom.Switch, null,
          React.createElement( reactRouterDom.Route, { exact: true, path: "/", component: Home }),
          React.createElement( reactRouterDom.Route, { path: "/zombies", component: ManHunt }),
          React.createElement( reactRouterDom.Route, { path: "/websocket", component: Connection })
        )
      )
    )
  );
}

const Root = reactRouterDom.withRouter(RootLayer);

class Application extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
    };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error: error });
    console.error(error, errorInfo);
  }

  render() {
    var ref = this;
    var error = ref.state.error;

    return React.createElement( Root, null, error ? React.createElement( 'p', null, "there was an error: ", error ) : null );
  }
}

const title = 'redux.io examples';

const publicDir = `${process.cwd()}/public`;

const assets = new Map([
  ['/vendor.js', `${publicDir}/vendor.js`],
  ['/bundle.js', `${publicDir}/bundle.js`] ]);

const scripts = Array.from(assets.keys());

function render(request, response) {
  var ref = url.parse(request.url);
  var pathname = ref.pathname;

  if (assets.has(pathname)) {
    response.setHeader('Content-Type', 'text/javascript');
    fs.createReadStream(assets.get(pathname)).pipe(response);
    return;
  }

  response.setHeader('Content-Type', 'text/html');

  const htmlStream = new stream.Transform({
    transform: function transform(chunk, enc, cb) {
      cb(undefined, chunk);
    },
  });

  htmlStream.on('end', () =>
    response.end(
      `</div>${scripts
        .map(src => `<script src="${src}"></script>`)
        .join('')}</body></html>`,
      200
    )
  );

  htmlStream.write(
    `<!DOCTYPE html><html><head><title>${title}</title><script src="/socket.io/socket.io.js"></script></head><body><div id="app">`
  );

  server.renderToNodeStream(
    React.createElement( reactRouterDom.StaticRouter, { path: pathname, context: {} },
      React.createElement( Application, null )
    )
  ).pipe(htmlStream);

  htmlStream.pipe(response);
}

function zombieLand(io) {
  const hunt = io.of('/hunt');

  const players = new Map();
  const positions = new Map();
  const infected = new Set();

  hunt.on('connect', socket => {
    players.set(socket.id, [0, 0]);

    hunt.emit('count', players.size);

    socket
      .on('position', (x, y) => {
        const coords = [x, y];

        console.log('coords: ', coords);

        const infectious = infected.has(socket.id);

        if (positions.has(coords)) {
          const position = positions.get(coords);

          if (infectious) {
            const victims = (position || []).filter(
              id => infected.has(id) === false
            );

            victims.forEach(id => {
              infected.add(id);
              hunt.to(id).emit('infectious', true);
            });

            if (victims.length) { hunt.emit('infected', infected.size); }
          } else {
            const vermin = (position || []).filter(id => infected.has(id));

            if (vermin.length) {
              infected.add(socket.id);

              socket.emit('infectious', true);
              hunt.emit('infected', infected.size);
            }
          }

          position.push(socket.id);

          positions.set(coords, position);
        } else { positions.set(coords, [socket.id]); }

        const current = players.get(socket.id);
        const position = positions.get(current);

        positions.set(
          current,
          (position || []).filter(id => id !== socket.id)
        );

        players.set(socket.id, coords);
      })
      .on('disconnect', () => {
        const current = players.get(socket.id);
        const position = positions.get(current);

        if (position) {
          position.splice(position.indexOf(socket.id), 1);

          positions.set(current, position);
        }

        infected.delete(socket.id);

        players.delete(socket.id);

        hunt.emit('count', players.size);
      });
  });

  return hunt;
}

function createIo(server$$1, options) {
  if ( options === void 0 ) options = {};

  const io = require('socket.io')(server$$1);

  if (options.hunt) { zombieLand(io); }
}

const wss = new WebSocket$1.Server({ noServer: true });

wss.on('connection', ws => {
  ws.on('message', message => {
    if (message === 'Error')
      { ws.send(new Error('Error'), error => console.log(error)); }
    else {
      console.log('received: %s', message);

      ws.send('I read you');
    }
  });

  ws.send('something');
});

const port = process.env.PORT || 3000;

const server$1 = http.createServer(render);

server$1.on('upgrade', (request, socket, head) => {
  var ref = url.parse(request.url);
  var pathname = ref.pathname;

  if (pathname === '/example') {
    wss.handleUpgrade(request, socket, head, ws => {
      wss.emit('connection', ws);
    });
  } else {
    socket.destroy();
  }
});

server$1.listen(port, error => {
  if (error) { console.error(error); }
  else {
    console.log('server listening on port %s', port);

    createIo(server$1, { hunt: true });
  }
});
