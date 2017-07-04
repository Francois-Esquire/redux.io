(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.redux = global.redux || {}, global.redux.io = global.redux.io || {})));
}(this, (function (exports) { 'use strict';

var CONSTANTS = [
  '@@io/CONNECT',
  '@@io/LISTEN',
  '@@io/EVENT',
  '@@io/EMIT',
  '@@io/MUTE',
  '@@io/ONCE',
  '@@io/OPEN',
  '@@io/CLOSE',
  '@@io/DESTROY',
  '@@io/DISCONNECT',
  '@@io/ACKNOWLEDGE',
  '@@io/CREATE',
  '@@io/COMPRESS'
];

var Reducer = function Reducer(io, extensions) {
  var this$1 = this;

  this.io = io;
  this.namespaces = [];

  var createNamespace = function (ns, socket, abstraction) {
    if ( ns === void 0 ) ns = '/';

    if (this$1.namespaces.indexOf(ns) < 0) {
      this$1.namespaces[ns] = socket;
      this$1[ns] = abstraction;
    } return this$1;
  };

  var destroyNamespace = function (ns) {
    if ( ns === void 0 ) ns = '/';

    delete this$1.namespaces[ns];
    delete this$1[ns];
    return this$1;
  };

  var next = function (state) { return Object.assign({}, this$1, state || {}); };

  return function (action) {
    var ref = action || {};
    var type = ref.type;
    var ns = ref.ns;
    var socket = ref.socket;
    var stats = ref.stats;
    switch(type) {
      default: return this$1;
      case CONSTANTS[8]: {
        destroyNamespace(ns);
        return next();
      }
      case CONSTANTS[11]: {
        createNamespace(ns, socket, Object.assign({}, {id: socket.id}, action[ns]));
        return next();
      }
    }
  };
};
Reducer.prototype.connect = function connect (ns, options) {
    if ( ns === void 0 ) ns= '/';

  var socket = this[ns];
  socket && socket.open();
  return socket;
};
Reducer.prototype.disconnect = function disconnect (ns) {
    if ( ns === void 0 ) ns = '/';

  var socket = this[ns];
  socket && socket.close();
  return socket;
};
Reducer.prototype.destroy = function destroy (ns, event, fn) {
    if ( ns === void 0 ) ns = '/';

  var socket = this[ns];
  socket && socket.destroy(event, fn);
  return socket;
};
Reducer.prototype.send = function send (ns, data, fn) {
    if ( ns === void 0 ) ns = '/';

  var socket = this[ns];
  socket && socket.send(data, fn);
  return socket;
};
Reducer.prototype.emit = function emit (ns, event, data, fn) {
    if ( ns === void 0 ) ns = '/';

  var socket = this[ns];
  socket && socket.emit(event, data, fn);
  return socket;
};
Reducer.prototype.on = function on (ns, event, fn) {
    if ( ns === void 0 ) ns = '/';

  var socket = this[ns];
  socket && socket.on(event, fn);
  return socket;
};
Reducer.prototype.once = function once (ns, event, fn) {
    if ( ns === void 0 ) ns = '/';

  var socket = this[ns];
  socket && socket.once(event, fn);
  return socket;
};
Reducer.prototype.off = function off (ns, event, fn) {
    if ( ns === void 0 ) ns = '/';

  var socket = this[ns];
  socket && socket.off(event, fn);
  return socket;
};

var CONNECT = CONSTANTS[0];
var LISTEN = CONSTANTS[1];
var EVENT = CONSTANTS[2];
var EMIT = CONSTANTS[3];
var MUTE = CONSTANTS[4];
var ONCE = CONSTANTS[5];
var OPEN = CONSTANTS[6];
var CLOSE = CONSTANTS[7];
var DESTROY = CONSTANTS[8];
var DISCONNECT = CONSTANTS[9];
var ACKNOWLEDGE = CONSTANTS[10];
var CREATE = CONSTANTS[11];
var COMPRESS = CONSTANTS[12];

function configureSocketMiddleware(extensions) {
  function dispatcher(type, ns, o) {
    return function (dispatch, socket) { return dispatch(Object.assign({}, {type: type, ns: ns}, o)); };
  }

  return function socketMiddleware(store, next, action) {
    var type = action.type;
    var ns = action.ns;
    var options = action.options;
    var event = action.event; if ( event === void 0 ) event = '';
    var data = action.data; if ( data === void 0 ) data = [];
    var fn = action.fn;
    var socket = store.getState().socket;

    switch(type) {
      default : return next(action);
      case ACKNOWLEDGE:
      case EVENT: {
        return fn && fn.apply(void 0, [ store.dispatch, socket.namespaces[ns] ].concat( data ));
      }
      case EMIT: {
        var sock = socket.namespaces[ns];
        var args = fn && typeof fn === 'function' ? data.concat(function ack() {
          var i = arguments.length, argsArray = Array(i);
          while ( i-- ) argsArray[i] = arguments[i];

          return store.dispatch({ type: ACKNOWLEDGE, ns: ns, event: event, fn: fn, data: [].concat( argsArray ) });
        }) : data;
        if (event === 'message') { return sock.send.apply(sock, args); }
        return sock.emit.apply(sock, [event ].concat( args));
      }
      case ONCE:
      case LISTEN: {
        if (socket.namespaces[ns] && event && fn) {
          function callback() {
            var i = arguments.length, argsArray = Array(i);
            while ( i-- ) argsArray[i] = arguments[i];

            return store.dispatch({ type: EVENT, ns: ns, event: event, fn: fn, data: [].concat( argsArray ) });
          }
          if (type === ONCE) { socket.namespaces[ns].once(event, callback); }
          else { socket.namespaces[ns].on(event, callback); }
          return next(action);
        }
      }
      case OPEN: { return socket.namespaces[ns].open(); }
      case CONNECT: {
        if (socket.namespaces.indexOf(ns) >= 0) { return socket.namespaces[ns].connect(); }

        var dispatch = function (type, o) {
          if ( o === void 0 ) o = {};

          return dispatcher(type, ns, o)(store.dispatch);
        };

        return dispatch(CREATE, ( obj = {
          ns: ns,
          socket: socket.io.connect(ns, options),
        }, obj[ns] = {
            open: function () { return dispatch(OPEN); },
            close: function () { return dispatch(CLOSE); },
            destroy: function () { return dispatch(DESTROY); },
            compress: function (options) { return dispatch(COMPRESS, { options: options }); },
            send: function (data, fn) { return dispatch(EMIT, { event: 'message', data: data, fn: fn }); },
            emit: function (event, data, fn) { return dispatch(EMIT, { event: event, data: data, fn: fn }); },
            on: function (event, fn) { return dispatch(LISTEN, { event: event, fn: fn }); },
            once: function (event, fn) { return dispatch(ONCE, { event: event, fn: fn }); },
            off: function (event, fn) { return dispatch(MUTE, { event: event, fn: fn }); },
          }, obj ));
        var obj;
      }
      case CLOSE:
      case DISCONNECT: { return socket.namespaces[ns].close(); }
      case DESTROY: { socket.namespaces[ns].destroy(); return next(action); }
      case MUTE: { return socket.namespaces[ns].off(event, fn); }
      case COMPRESS: { return socket.namespaces[ns].compress(options); }
    }
  }
}

var connect = function (ns, options) { return ({ type: CONSTANTS[0], ns: ns, options: options }); };

function redux_io (io, extensions) {
  'use strict';

  if (!io) { throw new Error('You must pass in a client.'); }

  var reducer = new Reducer(io, extensions);

  var middleware = configureSocketMiddleware(extensions);

  var test = function (type) { return /^@@io/.test(type); };

  return {
    middleware: function (store) { return function (next) { return function (action) { return test(action.type) ?
      middleware(store, next, action) : next(action); }; }; },
    reducer: function (state, action) {
      if ( state === void 0 ) state = reducer();

      return test(action.type) ?
      reducer(action) : state;
  },
  };
}

exports.CONSTANTS = CONSTANTS;
exports.connect = connect;
exports['default'] = redux_io;

Object.defineProperty(exports, '__esModule', { value: true });

})));
