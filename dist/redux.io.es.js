import React from 'react';
import { connectAdvanced } from 'react-redux';
import hoistNonReactStatics from 'hoist-non-react-statics';

const CONSTANTS = [
  '@@io/CREATE',
  '@@io/DESTROY',
  '@@io/CONNECT',
  '@@io/LISTEN',
  '@@io/EVENT',
  '@@io/EMIT',
  '@@io/MUTE',
  '@@io/ONCE',
  '@@io/OPEN',
  '@@io/CLOSE',
  '@@io/DISCONNECT',
  '@@io/ACKNOWLEDGE',
  '@@io/COMPRESS',
  '@@io/STATUS'];

function reduxIo(io) {
  if (!io) { throw new Error('You must pass in a client.'); }

  // if io is not passed in, fallback to native websocket.
  // check if other instances of the namespace exist and only disconnect if the remaining one.

  const namespaces = new Map();

  function Reducer() {
    var this$1 = this;

    this.io = io;
    this.connections = 0;

    this.has = function (ns) { return namespaces.has(ns); };
    this.get = function (ns) { return namespaces.get(ns); };
    this.set = function (ns, manager) { return namespaces.set(ns, manager); };

    const next = function (state) { return Object.assign({}, this$1, state || {}); };

    const createNamespace = function (ns, socket, abstraction) {
      if ( ns === void 0 ) ns = '/';

      if (namespaces.has(ns)) { return this$1; }
      namespaces.set(ns, socket);
      this$1[ns] = abstraction;
      return next();
    };

    const destroyNamespace = function (ns) {
      if ( ns === void 0 ) ns = '/';

      if (namespaces.has(ns)) { namespaces.delete(ns); }
      delete this$1[ns];
      return next();
    };

    const updateStatus = function (ns, status) {
      if ( ns === void 0 ) ns = '/';

      this$1[ns].status = status;
      return next();
    };

    return function (action) {
      var type = action.type;
      var ns = action.ns;
      var socket = action.socket;
      var status = action.status;
      switch (type) {
        default: return this$1;
        case CONSTANTS[13]:
          return updateStatus(ns, status);
        case CONSTANTS[1]:
          return destroyNamespace(ns);
        case CONSTANTS[0]:
          return createNamespace(ns, socket, Object.assign({}, {id: socket.id}, action[ns]));
      }
    };
  }

  const reducer = new Reducer();
  const initialState = reducer();

  return function socketReducer(state, action) {
    if ( state === void 0 ) state = initialState;

    return /^@@io\//.test(action.type) ? reducer(action) : state;
  };
}

const reducer = reduxIo;

const socketEvents = [
  'connect',
  'connect_error', // error - object
  'connect_timeout', // timeout
  'error', // error - object
  'disconnect', // reason - string
  'reconnect', // attemptNumber - number
  'reconnect_attempt', // attemptNumber - number
  'reconnecting', // attemptNumber - number
  'reconnect_error', // error - object
  'reconnect_failed',
  'ping',
  'pong' // latency - ms
];

const socketEventProps = socketEvents
  .map(function (name) { return name.split('_').map(
    function (frag) { return `${frag[0].toUpperCase()}${frag.slice(1)}`; }).join(''); })
  .map(function (evt) { return `on${evt}`; });


function getDisplayName(WrappedComponent) {
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
  if (typeof uri === 'object' || typeof uri === 'function') {
    options = uri;
    uri = undefined;
  }

  function withSocketConnection(WrappedComponent, config) {
    const displayName = getDisplayName(WrappedComponent);

    var alias = config.alias; if ( alias === void 0 ) alias = 'withSocket';
    var withRef = config.withRef; if ( withRef === void 0 ) withRef = false;

    var WithSocket = (function (superclass) {
      function WithSocket(props) {
        superclass.call(this, props);

        var socket = props.socket;
        var manager = props.manager;

        this.state = {
          id: socket.id,
          namespace: manager.uri,
          readyState: manager.readyState,
          protocol: '',
        };

        this.setWrappedInstance = this.setWrappedInstance.bind(this);
      }

      if ( superclass ) WithSocket.__proto__ = superclass;
      WithSocket.prototype = Object.create( superclass && superclass.prototype );
      WithSocket.prototype.constructor = WithSocket;
      WithSocket.prototype.componentWillReceiveProps = function componentWillReceiveProps (Props) {

      };
      WithSocket.prototype.componentWillUnmount = function componentWillUnmount () {
        var ref = this.props;
        var socket = ref.socket;
        socket.close();
      };
      WithSocket.prototype.getWrappedInstance = function getWrappedInstance () {
        return this.wrappedInstance;
      };
      WithSocket.prototype.setWrappedInstance = function setWrappedInstance (ref) {
        this.wrappedInstance = ref;
      };
      WithSocket.prototype.getComponentProps = function getComponentProps () {
        var ref = this.props;
        var abstraction = ref.abstraction;
        var ownProps = ref.ownProps;

        const socket = Object.assign({}, abstraction, this.state);

        const wrappedComponentProps = Object.assign({}, ownProps, { socket: socket });

        if (withRef) { wrappedComponentProps.ref = this.setWrappedInstance; }

        return wrappedComponentProps;
      };
      WithSocket.prototype.render = function render () {
        const wrappedComponentProps = this.getComponentProps();

        return React.createElement(WrappedComponent, wrappedComponentProps);
      };

      return WithSocket;
    }(React.PureComponent));

    const componentConnector = connectAdvanced(function (dispatch) {
      let io = null;
      let socket = null;
      let manager = null;
      let abstraction = null;
      let initialized = false;
      let calculatedOptions = null;

      function initializeSocket() {
        function callback(cb) {
          return function ack() {
            var data = [], len = arguments.length;
            while ( len-- ) data[ len ] = arguments[ len ];

            return cb.apply(void 0, [ dispatch ].concat( data ));
          };
        }

        abstraction = {
          io: io,
          open: function open() {
            socket.open();
            return this;
          },
          close: function close() {
            socket.close();
            return this;
          },
          connect: function connect() {
            return this.open();
          },
          disconnect: function disconnect() {
            return this.close();
          },
          on: function on(event, cb) {
            const fn = typeof cb === 'function' ? callback(cb) : cb;
            socket.on(event, fn);
            return this;
          },
          once: function once(event, cb) {
            const fn = typeof cb === 'function' ? callback(cb) : cb;
            socket.once(event, fn);
            return this;
          },
          off: function off(event, cb) {
            socket.off(event, cb);
            return this;
          },
          emit: function emit(event) {
            var args = [], len = arguments.length - 1;
            while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

            const isAck = args.splice(-1, 1);

            const fn = typeof isAck === 'function' ? callback(isAck) : isAck;

            args.push(fn);

            socket.emit.apply(socket, [ event ].concat( args ));

            return this;
          },
          send: function send() {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            return (ref = this).emit.apply(ref, [ 'message' ].concat( args ));
            var ref;
          },
          compress: function compress(opt) {
            socket.compress(opt);
            return this;
          },
          reconnection: function reconnection(value) {
            if (value) {
              manager.reconnection(value);
              return this;
            } return manager.reconnection(value);
          },
          reconnectionAttempts: function reconnectionAttempts(value) {
            if (value) {
              manager.reconnectionAttempts(value);
              return this;
            } return manager.reconnectionAttempts(value);
          },
          reconnectionDelay: function reconnectionDelay(value) {
            if (value) {
              manager.reconnectionDelay(value);
              return this;
            } return manager.reconnectionDelay(value);
          },
          reconnectionDelayMax: function reconnectionDelayMax(value) {
            if (value) {
              manager.reconnectionDelayMax(value);
              return this;
            } return manager.reconnectionDelayMax(value);
          },
          timeout: function timeout(value) {
            if (value) {
              manager.timeout(value);
              return this;
            } return manager.timeout(value);
          },
        };

        initialized = true;

        dispatch({ type: CONSTANTS[0] });
      }

      function checkOptions(opts) {
        if (calculatedOptions !== opts) {
          // updateOptions

          // also check props for options
          calculatedOptions = opts;
        }
      }

      function getOptions(ownProps) {
        let opts = null;

        if (typeof options !== 'function') { opts = options; }
        else { opts = options(ownProps); }

        return Object.assign({}, withSocket.defaults, opts);
      }

      return function (state, ownProps) {
        const opts = getOptions(ownProps);

        if (initialized) {
          checkOptions(opts);
        } else {
          io = state.socket.io;

          if (state.socket.has(uri) && opts.forceNew !== true) {
            socket = state.socket.get(uri);
          } else {
            socket = io(uri, calculatedOptions = opts);
          }

          manager = socket.io;

          initializeSocket();
        }

        return {
          socket: socket,
          manager: manager,
          abstraction: abstraction,
          ownProps: ownProps,
        };
      };
    }, {
      methodName: alias,
      getDisplayName: function () { return `${alias}(${displayName})`; },
    });

    return hoistNonReactStatics(componentConnector(WithSocket), WrappedComponent);
  }

  return withSocketConnection;
}

withSocket.defaults = {};

export { reducer };
export default withSocket;
