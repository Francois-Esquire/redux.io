(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.redux = global.redux || {}, global.redux.io = global.redux.io || {})));
}(this, (function (exports) { 'use strict';

var Reducer = function Reducer(io, extensions) {
  this.io = io;
  this.namespaces = [];

  this.next = this.next.bind(this);

  return this;
};
// store utility and operations - chainable
Reducer.prototype.next = function next (state) {
  return Object.assign({}, this, state || {});
};
Reducer.prototype.connect = function connect (ns, options) {
    if ( ns === void 0 ) ns= '/';

  var socket = this.namespaces.indexOf(ns) >= 0 ?
    this[ns].open() : this.namespaces[ns] = io.connect(ns);
  return socket;
};
Reducer.prototype.disconnect = function disconnect (ns) {
    if ( ns === void 0 ) ns = '/';

  var socket = this[ns];
  socket && socket.close();
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

var CONSTANTS = [
  '@@io/CONNECT',
  '@@io/LISTEN',
  '@@io/EVENT',
  '@@io/EMIT',
  '@@io/MUTE',
  '@@io/OPEN',
  '@@io/CLOSE',
  '@@io/DESTROY',
  '@@io/DISCONNECT',
  '@@io/ACKNOWLEDGE',
  '@@io/INITIALIZE',
  '@@io/COMPRESS'
];

var CONNECT = CONSTANTS[0];
var LISTEN = CONSTANTS[1];
var EVENT = CONSTANTS[2];
var EMIT = CONSTANTS[3];
var OPEN = CONSTANTS[5];
var CLOSE = CONSTANTS[6];
var DESTROY = CONSTANTS[7];
var DISCONNECT = CONSTANTS[8];
var ACKNOWLEDGE = CONSTANTS[9];
var INITIALIZE = CONSTANTS[10];
function configureSocketMiddleware(extensions) {
  function dispatcher(type, ns, o) {
    return function (dispatch) { return dispatch(Object.assign({}, {type: type, ns: ns}, o)); };
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
      case OPEN: { return socket.namespaces[ns].open(); }
      case CLOSE:
      case DISCONNECT: { return socket.namespaces[ns].close(); }
      case DESTROY: { socket.namespaces[ns].destroy(); return next(action); }
      case LISTEN: {
        if (socket.namespaces[ns] && event && fn) {
          socket.namespaces[ns].on(event, function() {
            var i = arguments.length, argsArray = Array(i);
            while ( i-- ) argsArray[i] = arguments[i];

            return store.dispatch({ type: EVENT, ns: ns, event: event, fn: fn, data: [].concat( argsArray ) });
          });
          return next(action);
        }
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
      case CONNECT: {
        if (ns in socket) { return socket.namespaces[ns].connect(); }

        var dispatch = function (type, o) {
          if ( o === void 0 ) o = {};

          return dispatcher(type, ns, o)(store.dispatch);
        };

        var sock$1 = socket.io.connect(ns, options);
        return dispatch(INITIALIZE, ( obj = {
          ns: ns,
          socket: sock$1,
        }, obj[ns] = {
            open: function () { return dispatch(OPEN); },
            close: function () { return dispatch(CLOSE); },
            destroy: function () { return dispatch(DESTROY); },
            send: function (data, fn) { return dispatch(EMIT, { event: 'message', data: data, fn: fn }); },
            emit: function (event, data, fn) { return dispatch(EMIT, { event: event, data: data, fn: fn }); },
            on: function (event, fn) { return dispatch(LISTEN, { event: event, fn: fn }); },
          }, obj ));
        var obj;
      }
    }
  }
}

function redux_io (io, extensions) {
  'use strict';

  if (!io) { throw new Error('You must pass in a client.'); }

  var socketMiddleware = configureSocketMiddleware(extensions);

  function createNamespace(ns, socket) {
    if ( ns === void 0 ) ns = '/';

    if (this.namespaces.indexOf(ns) < 0) {
      this.namespaces[ns] = socket;
    } return this;
  }

  function destroyNamespace(ns) {
    if ( ns === void 0 ) ns = '/';

    delete this.namespaces[ns];
    delete this[ns];
    return this;
  }

  var test = function (type) { return /^@@io/.test(type); };

  return {
    middleware: function (store) { return function (next) { return function (action) { return test(action.type) ?
      socketMiddleware(store, next, action) : next(action); }; }; },
    reducer: function socketReducer (
      state,
      action
    ) {
      if ( state === void 0 ) state = new Reducer(io, extensions);

      if (test(action.type)) {
        var type = action.type;
        var ns = action.ns;
        var socket = action.socket;
        var stats = action.stats;
        switch(type) {
          default: return state;
          case DESTROY: return destroyNamespace.call(state, ns).next();
          case INITIALIZE: return createNamespace.call(state, ns, socket).next(( obj = {}, obj[ns] = Object.assign({}, {id: socket.id}, action[ns]), obj ));
        var obj;
        }
      } return state;
    },
  };
}

exports.CONSTANTS = CONSTANTS;
exports['default'] = redux_io;

Object.defineProperty(exports, '__esModule', { value: true });

})));
