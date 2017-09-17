'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));
var reactRedux = require('react-redux');
var hoistNonReactStatics = _interopDefault(require('hoist-non-react-statics'));
var pick = _interopDefault(require('lodash.pick'));

var Reducer = function Reducer(io, defaults) {
  if ( defaults === void 0 ) defaults = {};

  var initialState = {
    io: io,
    defaults: defaults,
  };

  return function reducer(state, action) {
    if ( state === void 0 ) state = initialState;
    if ( action === void 0 ) action = {};

    if (/^@@io\//.test(action.type)) {
      var type = action.type;
      var ns = action.ns;
      var socket = action.socket;

      switch (type) {
        default: return state;
        case '@@io/create': {
          return Object.assign({}, state, ( obj = {}, obj[ns] = socket, obj ));
          var obj;
        }
        case '@@io/dismount': {
          var socket$1 = state[ns];
          if (socket$1.connected) { socket$1.close(); }
          return Object.assign({}, state);
        }
      }
    } return state;
  };
};

// eslint-disable-next-line import/prefer-default-export
function reducer(io, options) {
  if ( io === void 0 ) io = null;

  // eslint-disable-next-line no-param-reassign
  if (io === null) { io = window.io; }
  if (!io) { throw new Error('You must pass in a client.'); }

  return new Reducer(io, options);
}

var socketOptions = [
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

var socketEvents = [
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

var socketEventProps = socketEvents
  .map(function (name) { return name.split('_').map(
    function (frag) { return `${frag[0].toUpperCase()}${frag.slice(1)}`; }).join(''); })
  .map(function (evt) { return `on${evt}`; });

// eslint-disable-next-line import/prefer-default-export
function withSocket(uri, options) {
  if (typeof uri === 'object' || typeof uri === 'function') {
    options = uri;
    uri = undefined;
  }

  if (typeof options !== 'function') { options = function calculateOptions() { return options; }; }

  return function withSocketConnection(WrappedComponent, config) {
    if ( config === void 0 ) config = {};

    var displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
    var alias = config.alias; if ( alias === void 0 ) alias = 'withSocket';
    var withRef = config.withRef; if ( withRef === void 0 ) withRef = false;

    var WithSocket = (function (superclass) {
      function WithSocket(props) {
        var this$1 = this;

        superclass.call(this, props);

        var io = props.io;
        var opts = props.opts;
        var events = props.events;
        var socket = props.socket;
        var dispatch = props.dispatch;

        this.opts = opts;

        this.events = {};

        Object.keys(events).forEach(function (key) { return this$1.addEvent(key, events[key]); });

        function callback(cb) {
          return function ack() {
            var data = [], len = arguments.length;
            while ( len-- ) data[ len ] = arguments[ len ];

            return cb.apply(void 0, [ dispatch ].concat( data ));
          };
        }
        socket
          .on('connect', function () { return this$1.setState({ connected: true }); })
          .on('disconnect', function () { return this$1.setState({ connected: false }); });

        this.state = {
          io: io,
          id: socket.id,
          namespace: socket.io.uri,
          readyState: socket.io.readyState,
          connected: socket.connected,
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
            var fn = typeof cb === 'function' ? callback(cb) : cb;
            socket.on(event, fn);
            return this;
          },
          once: function once(event, cb) {
            var fn = typeof cb === 'function' ? callback(cb) : cb;
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

            var isAck = args.splice(-1, 1);

            var fn = typeof isAck === 'function' ? callback(isAck) : isAck;

            args.push(fn);
            console.log.apply(console, args);
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
            if (value !== undefined) {
              socket.io.reconnection(value);
              return this;
            } return socket.io.reconnection();
          },
          reconnectionAttempts: function reconnectionAttempts(value) {
            if (value !== undefined) {
              socket.io.reconnectionAttempts(value);
              return this;
            } return socket.io.reconnectionAttempts();
          },
          reconnectionDelay: function reconnectionDelay(value) {
            if (value !== undefined) {
              socket.io.reconnectionDelay(value);
              return this;
            } return socket.io.reconnectionDelay();
          },
          reconnectionDelayMax: function reconnectionDelayMax(value) {
            if (value !== undefined) {
              socket.io.reconnectionDelayMax(value);
              return this;
            } return socket.io.reconnectionDelayMax();
          },
          timeout: function timeout(value) {
            if (value !== undefined) {
              socket.io.timeout(value);
              return this;
            } return socket.io.timeout();
          },
        };

        this.setWrappedInstance = this.setWrappedInstance.bind(this);
      }

      if ( superclass ) WithSocket.__proto__ = superclass;
      WithSocket.prototype = Object.create( superclass && superclass.prototype );
      WithSocket.prototype.constructor = WithSocket;
      WithSocket.prototype.componentDidMount = function componentDidMount () {
        var this$1 = this;

        var ref = this.props;
        var socket = ref.socket;
        socket
          .on('connect', function () { return this$1.updateSocket(socket); })
          .on('disconnect', function () { return this$1.updateSocket(socket); });
      };
      WithSocket.prototype.componentWillReceiveProps = function componentWillReceiveProps (Props) {
        var this$1 = this;

        var events = Props.events;

        var remaining = pick(this.events, Object.keys(events));
        var additions = pick(events, Object.keys(this.events));

        Object.keys(remaining).forEach(function (key) { return remaining[key](); });
        Object.keys(additions).forEach(function (key) { return this$1.addEvent(key, additions[key]); });
      };
      WithSocket.prototype.componentWillUnmount = function componentWillUnmount () {
        var this$1 = this;

        var ref = this.props;
        var socket = ref.socket;
        var dispatch = ref.dispatch;
        socket.close();
        Object.keys(this.events).forEach(function (key) { return this$1.events[key](); });
        dispatch({ type: '@@io/dismount' });
      };
      WithSocket.prototype.getWrappedInstance = function getWrappedInstance () {
        return this.wrappedInstance;
      };
      WithSocket.prototype.setWrappedInstance = function setWrappedInstance (ref) {
        this.wrappedInstance = ref;
      };
      WithSocket.prototype.getComponentProps = function getComponentProps () {
        var ref = this.props;
        var ownProps = ref.ownProps;

        var socket = Object.assign({}, this.state);

        var wrappedComponentProps = Object.assign({}, ownProps, { socket: socket });

        if (withRef) { wrappedComponentProps.ref = this.setWrappedInstance; }

        return wrappedComponentProps;
      };
      WithSocket.prototype.addEvent = function addEvent (event, fn) {
        var this$1 = this;

        var ref = this.props;
        var dispatch = ref.dispatch;
        var socket = ref.socket;
        var cb = function evt() {
          var args = [], len = arguments.length;
          while ( len-- ) args[ len ] = arguments[ len ];

          return fn.apply(void 0, [ dispatch, this.state ].concat( args ));
        }.bind(this);

        socket.on(event, cb);
        this.events[event] = function () {
          socket.off(event, cb);
          delete this$1.events[event];
        };
      };
      WithSocket.prototype.updateSocket = function updateSocket (socket) {
        var id = socket.id;
        var io = socket.io;
        var connected = socket.connected;
        var readyState = io.readyState;
        this.setState({
          id: id,
          readyState: readyState,
          connected: connected,
        });
      };
      WithSocket.prototype.render = function render () {
        var wrappedComponentProps = this.getComponentProps();
        // console.log(wrappedComponentProps);
        return React.createElement(WrappedComponent, wrappedComponentProps);
      };

      return WithSocket;
    }(React.PureComponent));

    var componentConnector = reactRedux.connectAdvanced(function (dispatch) {
      var io = null;
      var socket = null;
      var initialized = false;

      return function (state, props) {
        var opts = Object.assign(
          {}, state.socket.defaults, options(props), pick(props, socketOptions));

        var evts = pick(props, socketEventProps);
        var events = Object.keys(evts)
          .reduce(function (o, next) { return Object.assign(o, ( obj = {}, obj[socketEvents[socketEventProps.indexOf(next)]] = evts[next], obj ))
            var obj; }, {});

        var ownProps = Object.keys(props)
          .filter(function (key) { return !(key in opts || key in events); })
          .reduce(function (o, next) { return Object.assign(o, ( obj = {}, obj[next] = props[next], obj ))
            var obj; }, {});

        // console.log('calculateOptions: ', opts);
        // console.log('gatherEvents: ', events);
        // console.log('props: ', ownProps);

        if (initialized === false) {
          io = state.socket.io;

          if (uri in state.socket && opts.forceNew !== true) {
            socket = state.socket[uri];
          } else {
            socket = io(uri, opts);
            dispatch({ type: '@@io/create', ns: uri, socket: socket });
          }

          initialized = true;
        }

        return {
          io: io,
          opts: opts,
          events: events,
          socket: socket,
          dispatch: dispatch,
          ownProps: ownProps,
        };
      };
    }, {
      methodName: alias,
      getDisplayName: function () { return `${alias}(${displayName})`; },
    });

    return hoistNonReactStatics(componentConnector(WithSocket), WrappedComponent);

    // Object.assign(Connect.propTypes, WrappedComponent.propTypes, {
    //   path: PropTypes.string,
    //   query: PropTypes.object,
    //   forceNew: PropTypes.bool,
    //   multiplex: PropTypes.bool,
    //   transports: PropTypes.arrayOf(PropTypes.string),
    //   reconnection: PropTypes.bool,
    //   reconnectionAttempts: PropTypes.number,
    //   reconnectionDelay: PropTypes.number,
    //   reconnectionDelayMax: PropTypes.number,
    //   randomizationFactor: PropTypes.number,
    //   timeout: PropTypes.number,
    //   autoConnect: PropTypes.bool,
    //   parser: PropTypes.object,
    //   upgrade: PropTypes.bool,
    //   jsonp: PropTypes.bool,
    //   forceJSONP: PropTypes.bool,
    //   forceBase64: PropTypes.bool,
    //   enablesXDR: PropTypes.bool,
    //   timestampRequests: PropTypes.bool,
    //   timestampParam: PropTypes.string,
    //   policyPort: PropTypes.number,
    //   transportOptions: PropTypes.object,
    //   rememberUpgrade: PropTypes.bool,
    //   pfx: PropTypes.string,
    //   Key: PropTypes.string,
    //   passphrase: PropTypes.string,
    //   cert: PropTypes.string,
    // });
  };
}

exports.reducer = reducer;
exports.connect = withSocket;
