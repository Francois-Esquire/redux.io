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
  if (!io) throw new Error('You must pass in a client.');

  // if io is not passed in, fallback to native websocket.
  // check if other instances of the namespace exist and only disconnect if the remaining one.

  const sockets = new Map();
  const namespaces = new Map();

  function Reducer() {
    this.io = io;
    this.connections = 0;

    this.has = (ns) => namespaces.has(ns);
    this.get = (ns) => namespaces.get(ns);
    this.set = (ns, manager) => namespaces.set(ns, manager);

    const next = state => Object.assign({}, this, state || {});

    const createNamespace = (ns = '/', socket, abstraction) => {
      if (namespaces.has(ns)) return this;
      namespaces.set(ns, socket);
      this[ns] = abstraction;
      return next();
    };

    const destroyNamespace = (ns = '/') => {
      if (namespaces.has(ns)) namespaces.delete(ns);
      delete this[ns];
      return next();
    };

    const updateStatus = (ns = '/', status) => {
      this[ns].status = status;
      return next();
    };

    return (action) => {
      const { type, ns, socket, status } = action;
      switch (type) {
        default: return this;
        case CONSTANTS[13]:
          return updateStatus(ns, status);
        case CONSTANTS[1]:
          return destroyNamespace(ns);
        case CONSTANTS[0]:
          return createNamespace(ns, socket, { id: socket.id, ...action[ns] });
      }
    };
  }

  const reducer = new Reducer();
  const initialState = reducer();

  return function socketReducer(state = initialState, action) {
    return /^@@io\//.test(action.type) ? reducer(action) : state;
  };
}

const reducer = reduxIo;

export { reducer };


const socketOptions = [
  'path', // (String) name of the path that is captured on the server side (/socket.io)
  'query', // (Object): additional query parameters that are sent when connecting a namespace (then found in socket.handshake.query object on the server-side)
  'forceNew', // (Boolean) whether to reuse an existing connection
  'multiplex', // (Boolean) whether to reuse an existing connection
  'transports', // (Array): a list of transports to try (in order). Defaults to ['polling', 'websocket']. Engine always attempts to connect directly with the first one, provided the feature detection test for it passes.
  'reconnection', // (Boolean) whether to reconnect automatically (true)
  'reconnectionAttempts', // (Number) number of reconnection attempts before giving up (Infinity)
  'reconnectionDelay', // (Number) how long to initially wait before attempting a new reconnection (1000). Affected by +/- randomizationFactor, for example the default initial delay will be between 500 to 1500ms.
  'reconnectionDelayMax', // (Number) maximum amount of time to wait between reconnections (5000). Each attempt increases the reconnection delay by 2x along with a randomization as above
  'randomizationFactor', // (Number) (0.5), 0 <= randomizationFactor <= 1
  'timeout', // (Number) connection timeout before a connect_error and connect_timeout events are emitted (20000)
  'autoConnect', // (Boolean) by setting this false, you have to call manager.open whenever you decide it's appropriate
  'parser', // (Parser): the parser to use. Defaults to an instance of the Parser that ships with socket.io. See
  'upgrade', // (Boolean): defaults to true, whether the client should try to upgrade the transport from long-polling to something better.
  'forceJSONP', // (Boolean): forces JSONP for polling transport.
  'jsonp', // (Boolean): determines whether to use JSONP when necessary for polling. If disabled (by settings to false) an error will be emitted (saying "No transports available") if no other transports are available. If another transport is available for opening a connection (e.g. WebSocket) that transport will be used instead.
  'forceBase64', // (Boolean): forces base 64 encoding for polling transport even when XHR2 responseType is available and WebSocket even if the used standard supports binary.
  'enablesXDR', // (Boolean): enables XDomainRequest for IE8 to avoid loading bar flashing with click sound. default to false because XDomainRequest has a flaw of not sending cookie.
  'timestampRequests', // (Boolean): whether to add the timestamp with each transport request. Note: polling requests are always stamped unless this option is explicitly set to false (false)
  'timestampParam', // (String): timestamp parameter (t)
  'policyPort', // (Number): port the policy server listens on (843)
  'transportOptions', // (Object): hash of options, indexed by transport name, overriding the common options for the given transport
  'rememberUpgrade', // (Boolean): defaults to false. If true and if the previous websocket connection to the server succeeded, the connection attempt will bypass the normal upgrade process and will initially try websocket. A connection attempt following a transport error will use the normal upgrade process. It is recommended you turn this on only when using SSL/TLS connections, or if you know that your network does not block websockets.
  'pfx', // (String): Certificate, Private key and CA certificates to use for SSL. Can be used in Node.js client environment to manually specify certificate information.
  'key', // (String): Private key to use for SSL. Can be used in Node.js client environment to manually specify certificate information.
  'passphrase', // (String): A string of passphrase for the private key or pfx. Can be used in Node.js client environment to manually specify certificate information.
  'cert', // (String): Public x509 certificate to use. Can be used in Node.js client environment to manually specify certificate information.
  'ca', // (String|Array): An authority certificate or array of authority certificates to check the remote host against.. Can be used in Node.js client environment to manually specify certificate information.
  'ciphers', // (String): A string describing the ciphers to use or exclude. Consult the cipher format list for details on the format. Can be used in Node.js client environment to manually specify certificate information.
  'rejectUnauthorized', // (Boolean): If true, the server certificate is verified against the list of supplied CAs. An 'error' event is emitted if verification fails. Verification happens at the connection level, before the HTTP request is sent. Can be used in Node.js client environment to manually specify certificate information.
  'perMessageDeflate', // (Object|Boolean): parameters of the WebSocket permessage-deflate extension (see ws module api docs). Set to false to disable. (true)
  'threshold', // (Number): data is compressed only if the byte size is above this value. This option is ignored on the browser. (1024)
  'extraHeaders', // (Object): Headers that will be passed for each request to the server (via xhr-polling and via websockets). These values then can be used during handshake or for special proxies. Can only be used in Node.js client environment.
  'onlyBinaryUpgrades', // (Boolean): whether transport upgrades should be restricted to transports supporting binary data (false)
  'forceNode', // (Boolean): Uses NodeJS implementation for websockets - even if there is a native Browser-Websocket available, which is preferred by default over the NodeJS implementation. (This is useful when using hybrid platforms like nw.js or electron) (false, NodeJS only)
  'localAddress' // (String): the local IP address to connect to
];

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
  .map(name => name.split('_').map(
    frag => `${frag[0].toUpperCase()}${frag.slice(1)}`).join(''))
  .map(evt => `on${evt}`);


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

    const {
      alias = 'withSocket',
      withRef = false,
    } = config;

    class WithSocket extends React.PureComponent {
      constructor(props) {
        super(props);

        const {
          socket,
          manager,
        } = props;

        this.state = {
          id: socket.id,
          namespace: manager.uri,
          readyState: manager.readyState,
          protocol: '',
        };

        this.setWrappedInstance = this.setWrappedInstance.bind(this);
      }
      componentWillReceiveProps(Props) {

      }
      componentWillUnmount() {
        const { socket } = this.props;
        socket.close();
      }
      getWrappedInstance() {
        return this.wrappedInstance;
      }
      setWrappedInstance(ref) {
        this.wrappedInstance = ref;
      }
      getComponentProps() {
        const {
          abstraction,
          ownProps,
        } = this.props;

        const socket = Object.assign({}, abstraction, this.state);

        const wrappedComponentProps = Object.assign({}, ownProps, { socket });

        if (withRef) wrappedComponentProps.ref = this.setWrappedInstance;

        return wrappedComponentProps;
      }
      render() {
        const wrappedComponentProps = this.getComponentProps();

        return React.createElement(WrappedComponent, wrappedComponentProps);
      }
    }

    const componentConnector = connectAdvanced((dispatch) => {
      let io = null;
      let socket = null;
      let manager = null;
      let abstraction = null;
      let initialized = false;
      let calculatedOptions = null;

      function initializeSocket() {
        function callback(cb) {
          return function ack(...data) {
            return cb(dispatch, ...data);
          };
        }

        abstraction = {
          io,
          open() {
            socket.open();
            return this;
          },
          close() {
            socket.close();
            return this;
          },
          connect() {
            return this.open();
          },
          disconnect() {
            return this.close();
          },
          on(event, cb) {
            const fn = typeof cb === 'function' ? callback(cb) : cb;
            socket.on(event, fn);
            return this;
          },
          once(event, cb) {
            const fn = typeof cb === 'function' ? callback(cb) : cb;
            socket.once(event, fn);
            return this;
          },
          off(event, cb) {
            socket.off(event, cb);
            return this;
          },
          emit(event, ...args) {
            const isAck = args.splice(-1, 1);

            const fn = typeof isAck === 'function' ? callback(isAck) : isAck;

            args.push(fn);

            socket.emit(event, ...args);

            return this;
          },
          send(...args) {
            return this.emit('message', ...args);
          },
          compress(opt) {
            socket.compress(opt);
            return this;
          },
          reconnection(value) {
            if (value) {
              manager.reconnection(value);
              return this;
            } return manager.reconnection(value);
          },
          reconnectionAttempts(value) {
            if (value) {
              manager.reconnectionAttempts(value);
              return this;
            } return manager.reconnectionAttempts(value);
          },
          reconnectionDelay(value) {
            if (value) {
              manager.reconnectionDelay(value);
              return this;
            } return manager.reconnectionDelay(value);
          },
          reconnectionDelayMax(value) {
            if (value) {
              manager.reconnectionDelayMax(value);
              return this;
            } return manager.reconnectionDelayMax(value);
          },
          timeout(value) {
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

        if (typeof options !== 'function') opts = options;
        else opts = options(ownProps);

        return Object.assign({}, withSocket.defaults, opts);
      }

      return (state, ownProps) => {
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
          socket,
          manager,
          abstraction,
          ownProps,
        };
      };
    }, {
      methodName: alias,
      getDisplayName: () => `${alias}(${displayName})`,
    });

    return hoistNonReactStatics(componentConnector(WithSocket), WrappedComponent);
  }

  return withSocketConnection;
}

withSocket.defaults = {};

export default withSocket;
