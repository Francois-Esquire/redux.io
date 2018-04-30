(function (React,PropTypes,reactRedux,redux,reactRouterDom,ReactDOM) {
  'use strict';

  function objectWithoutProperties (obj, exclude) { var target = {}; for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k) && exclude.indexOf(k) === -1) target[k] = obj[k]; return target; }

  var prefix = '@@io';

  var CREATE = prefix + "/create";
  var CONNECT = prefix + "/connect";
  var DISCONNECT = prefix + "/disconnect";
  var ON = prefix + "/on";
  var OFF = prefix + "/off";
  var ONCE = prefix + "/once";
  var DEFAULTS = prefix + "/defaults";

  function reducer(io, defaults) {
    var initialState = {
      io: io,
      defaults: defaults,
    };

    var regexp = new RegExp(("^" + prefix + "/"));

    return function socketReducer(state, action) {
      if ( state === void 0 ) state = initialState;

      var obj;

      if (regexp.test(action.type)) {
        var type = action.type;
        var ns = action.ns;

        switch (type) {
          default:
            return state;
          case CREATE: {
            var options = action.options;

            var socket = io.connect(ns, options);

            return Object.assign({}, state, ( obj = {}, obj[ns] = socket, obj));
          }
          case CONNECT: {
            var socket$1 = state[ns];

            if (socket$1) { socket$1.open(); }

            break;
          }
          case DISCONNECT: {
            var socket$2 = state[ns];

            if (socket$2 && socket$2.connected) { socket$2.close(); }

            break;
          }
          case ON:
          case OFF:
          case ONCE: {
            var socket$3 = state[ns];

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

  var defaultProps = {
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

      var url = props.url;
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

      var opts = options || factoryOpts.options;

      var _url = url || factoryOpts.url;

      var _options = Object.assign(
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

        if ( superclass ) Socket.__proto__ = superclass;
        Socket.prototype = Object.create( superclass && superclass.prototype );
        Socket.prototype.constructor = Socket;

        Socket.prototype.componentDidUpdate = function componentDidUpdate () {
          var this$1 = this;

          var ref;

          if (queue.length) {
            console.log(queue);
            while (queue.length) {
              var ref$1 = queue.shift();
              var op = ref$1[0];
              var args = ref$1.slice(1);
              (ref = this$1)[op].apply(ref, args);
            }
          }
        };

        Socket.prototype.componentDidMount = function componentDidMount () {
          var ref = this.props;
          var io = ref.io;
          var url = ref.url;
          var options = ref.options;
          var initialize = ref.initialize;
          var dispatch = ref.dispatch;

          if (socket === undefined) { socket = io(url, options); }

          socket
            .on('message', this.onMessage)
            .on('connect', this.onConnect)
            .on('disconnect', this.onDisconnect)
            .on('connect_error', this.onError)
            .on('reconnect_error', this.onError)
            .on('error', this.onError);

          if (typeof initialize === 'function') { initialize(dispatch, this.socket); }
        };

        Socket.prototype.componentWillUnmount = function componentWillUnmount () {
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
        };

        Socket.prototype.getWrappedInstance = function getWrappedInstance () {
          return this.wrappedInstance;
        };

        Socket.prototype.setWrappedInstance = function setWrappedInstance (ref) {
          this.wrappedInstance = ref;
        };

        Socket.prototype.update = function update (cb) {
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
            function () { return typeof cb === 'function' && cb(); }
          );
        };

        Socket.prototype.onMessage = function onMessage () {
          var arguments$1 = arguments;

          var ref;

          var args = [], len = arguments.length;
          while ( len-- ) { args[ len ] = arguments$1[ len ]; }
          console.log('onMessage', args);
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

        Socket.prototype.onPing = function onPing () {
          var ref = this.props;
          var dispatch = ref.dispatch;
          if (this.props.onPing) {
            this.props.onPing(dispatch, this.socket);
          }
        };

        Socket.prototype.onPong = function onPong (latency) {
          var ref = this.props;
          var dispatch = ref.dispatch;
          if (this.props.onPong) {
            this.props.onPong(dispatch, this.socket, latency);
          }
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
          var arguments$1 = arguments;

          var args = [], len = arguments.length - 1;
          while ( len-- > 0 ) { args[ len ] = arguments$1[ len + 1 ]; }

          if (socket && socket.connected) { socket.emit.apply(socket, [ event ].concat( args )); }
          else { queue.push(['emit', event ].concat( args)); }
          return this;
        };

        Socket.prototype.send = function send () {
          var arguments$1 = arguments;

          var ref;

          var args = [], len = arguments.length;
          while ( len-- ) { args[ len ] = arguments$1[ len ]; }
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

  var combinedReducers = redux.combineReducers({
    socket: reducer(window.io),
  });

  var store = redux.createStore(combinedReducers);

  function Home() {
    return (
      React.createElement( 'article', null,
        React.createElement( 'header', null,
          React.createElement( 'h1', null, "Click the links above to try an example" )
        )
      )
    );
  }

  var ZombieLand = (function (superclass) {
    function ZombieLand(props) {
      superclass.call(this, props);

      this.state = {
        players: 0,
        infected: 0,
        infectious: false,
        x: 0,
        y: 0,
      };

      this.keyUp = this.keyUp.bind(this);
    }

    if ( superclass ) ZombieLand.__proto__ = superclass;
    ZombieLand.prototype = Object.create( superclass && superclass.prototype );
    ZombieLand.prototype.constructor = ZombieLand;

    ZombieLand.prototype.componentDidMount = function componentDidMount () {
      var this$1 = this;

      var ref = this.props;
      var socket = ref.socket;

      socket
        .on('count', function (players) { return this$1.setState({ players: players }); })
        .on('infected', function (infected) { return this$1.setState({ infected: infected }); })
        .on('infectious', function (infectious) { return this$1.setState({ infectious: infectious }); })
        .connect();

      document.body.addEventListener('keydown', this.keyUp);
    };

    ZombieLand.prototype.componentDidUpdate = function componentDidUpdate (_props, _state) {
      var ref = this.state;
      var x = ref.x;
      var y = ref.y;

      if (_state.x !== x || _state.y !== y) { this.move(); }
    };

    ZombieLand.prototype.componentWillUnmount = function componentWillUnmount () {
      document.body.removeEventListener('keydown', this.keyUp);
    };

    ZombieLand.prototype.move = function move () {
      var ref = this.props;
      var socket = ref.socket;
      var ref$1 = this.state;
      var x = ref$1.x;
      var y = ref$1.y;

      socket.emit('position', x, y);
    };

    ZombieLand.prototype.keyUp = function keyUp (event) {
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
    };

    ZombieLand.prototype.render = function render () {
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

            React.createElement( 'button', { type: "button", onClick: function () { return socket.disconnect(); } }, "I can", "'", "t take this anymore...")
          )
        )
      ) : (
        React.createElement( 'button', { type: "button", onClick: function () { return socket.connect(); } }, "Step Inside, But Tread Lightly..")
      );
    };

    return ZombieLand;
  }(React.PureComponent));

  var ManHunt = withSocket('/hunt', {
    autoConnect: false,
  })(ZombieLand);

  var Socket = (function (superclass) {
    function Socket(props) {
      superclass.call(this, props);

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

    if ( superclass ) Socket.__proto__ = superclass;
    Socket.prototype = Object.create( superclass && superclass.prototype );
    Socket.prototype.constructor = Socket;

    Socket.prototype.componentDidMount = function componentDidMount () {
      if (this.props.connectOnMount) { this.initialize(); }
    };

    Socket.prototype.componentWillUnmount = function componentWillUnmount () {
      if (this.state.socket) { this.close(); }
    };

    Socket.prototype.onOpen = function onOpen (event) {
      if (typeof this.props.onOpen === 'function')
        { this.props.onOpen(this.state.socket); }

      if (this.state.subscribers.length)
        { this.state.subscribers.forEach(
          function (ref) {
            var cb = ref.cb;
            var type = ref.type;

            return type === 'open' && cb(event);
          }
        ); }

      this.setState({ readyState: this.state.socket.readyState });
    };

    Socket.prototype.onClose = function onClose (event) {
      if (typeof this.props.onClose === 'function') { this.props.onClose(event); }

      if (this.state.subscribers.length)
        { this.state.subscribers.forEach(
          function (ref) {
            var cb = ref.cb;
            var type = ref.type;

            return type === 'close' && cb(event);
          }
        ); }

      this.setState({ readyState: this.state.socket.readyState, socket: null });
    };

    Socket.prototype.onMessage = function onMessage (event) {
      if (typeof this.props.onMessage === 'function') { this.props.onMessage(event); }

      if (this.state.subscribers.length)
        { this.state.subscribers.forEach(
          function (ref) {
            var cb = ref.cb;
            var type = ref.type;

            return type === 'message' && cb(event);
          }
        ); }
    };

    Socket.prototype.onError = function onError (event) {
      if (typeof this.props.onError === 'function') { this.props.onError(event); }

      if (this.state.subscribers.length)
        { this.state.subscribers.forEach(
          function (ref) {
            var cb = ref.cb;
            var type = ref.type;

            return type === 'error' && cb(event);
          }
        ); }
    };

    Socket.prototype.initialize = function initialize () {
      var ref = this.props;
      var url = ref.url;
      var protocols = ref.protocols;

      // check if websockets supported.
      var ws = new WebSocket(url, protocols);

      ws.onopen = this.onOpen;
      ws.onclose = this.onClose;
      ws.onmessage = this.onMessage;
      ws.onerror = this.onError;

      this.setState({ readyState: ws.readyState, socket: ws });
    };

    Socket.prototype.subscribe = function subscribe (cb, type) {
      var this$1 = this;
      if ( type === void 0 ) type = 'message';

      if (typeof cb !== 'function')
        { throw new Error('the callback passed to subscribe must be a function'); }

      var id = "" + (Math.random());

      this.setState(function (state) { return ({
        subscribers: state.subscribers.concat({ cb: cb, type: type, id: id }),
      }); });

      return function () { return !this$1.setState(function (state) { return ({
          subscribers: state.subscribers.filter(function (sub) { return sub.id !== id; }),
        }); }) && null; };
    };

    Socket.prototype.open = function open () {
      if (this.state.socket === null) { this.initialize(); }
    };

    Socket.prototype.close = function close () {
      if (this.state.socket) { this.state.socket.close(); }
      else { console.warn('Socket is already closed'); }
    };

    Socket.prototype.send = function send () {
      var ref;

      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];
      if (this.state.socket) { (ref = this.state.socket).send.apply(ref, args); }
      else { console.warn('Socket is already closed'); }
    };

    Socket.prototype.render = function render () {
      var ref = this;
      var children = ref.props.children;
      var ref_state = ref.state;
      var readyState = ref_state.readyState;
      var socket = ref_state.socket;
      var subscribe = ref.subscribe;
      var close = ref.close;
      var open = ref.open;
      var send = ref.send;

      var payload = {
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
    };

    return Socket;
  }(React.Component));

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

  var Connection = (function (superclass) {
    function Connection(props) {
      superclass.call(this, props);

      this.state = {
        messages: [],
        subscription: null,
        closed: true,
      };
    }

    if ( superclass ) Connection.__proto__ = superclass;
    Connection.prototype = Object.create( superclass && superclass.prototype );
    Connection.prototype.constructor = Connection;
    Connection.prototype.render = function render () {
      var this$1 = this;

      var ref = this;
      var ref_state = ref.state;
      var messages = ref_state.messages;
      var subscription = ref_state.subscription;
      var closed = ref_state.closed;
      return (
        React.createElement( Socket, {
          url: "ws://localhost:3000/example", onOpen: function () { return this$1.setState({ closed: false }); }, onClose: function () { return this$1.setState({ closed: true }); }, onMessage: function (event) {
            this$1.setState({
              messages: messages.concat(event),
            });
          }, onError: function (event) {
            console.log(event);
          } },
          function (socket) { return (
            React.createElement( 'div', null,
              React.createElement( 'ul', null,
                React.Children.toArray(
                  messages.map(
                    function (message) { return (message.data ? React.createElement( 'li', null, message.data ) : null); }
                  )
                )
              ),

              React.createElement( 'button', { type: "button", onClick: function () { return socket.send('Hey'); } }, "Say Hi"),

              React.createElement( 'button', { type: "button", onClick: function () { return socket.send('Error'); } }, "Send Error"),

              React.createElement( 'button', {
                type: "button", onClick: function () { return subscription
                    ? this$1.setState({ subscription: subscription() })
                    : this$1.setState({
                        subscription: socket.subscribe(function (event) { return this$1.setState({
                            messages: messages.concat(event),
                          }); }
                        ),
                      }); } },
                subscription ? 'Unsubscribe' : 'Subscribe'
              ),

              React.createElement( 'button', {
                type: "button", onClick: function () { return (closed ? socket.open() : socket.close()); } },
                closed ? 'Greet' : 'Say Bye'
              )
            )
          ); }
        )
      );
    };

    return Connection;
  }(React.Component));

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

  var Root = reactRouterDom.withRouter(RootLayer);

  var Application = (function (superclass) {
    function Application(props) {
      superclass.call(this, props);

      this.state = {
        error: null,
      };
    }

    if ( superclass ) Application.__proto__ = superclass;
    Application.prototype = Object.create( superclass && superclass.prototype );
    Application.prototype.constructor = Application;

    Application.prototype.componentDidCatch = function componentDidCatch (error, errorInfo) {
      this.setState({ error: error });
      console.error(error, errorInfo);
    };

    Application.prototype.render = function render () {
      var ref = this;
      var error = ref.state.error;

      return React.createElement( Root, null, error ? React.createElement( 'p', null, "there was an error: ", error ) : null );
    };

    return Application;
  }(React.PureComponent));

  var appElement = document.getElementById('app');

  ReactDOM.hydrate(
    React.createElement( reactRedux.Provider, { store: store },
      React.createElement( reactRouterDom.BrowserRouter, null,
        React.createElement( Application, null )
      )
    ),
    appElement
  );

}(vendor.React,vendor.PropTypes,vendor.ReactRedux,vendor.redux,vendor.ReactRouterDom,vendor.ReactDom));
