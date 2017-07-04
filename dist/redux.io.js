(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.redux = global.redux || {}, global.redux.io = global.redux.io || {})));
}(this, (function (exports) { 'use strict';

var Reducer = function Reducer(io, extensions) {
  this.io = io;
  this.namespaces = [];
  this.errors = [];

  this.next = this.next.bind(this);
  this.createNamespace = this.createNamespace.bind(this);
  this.destroyNamespace = this.destroyNamespace.bind(this);

  this.connect = this.connect.bind(this);
  this.disconnect = this.disconnect.bind(this);
  this.open = this.open.bind(this);
  this.close = this.close.bind(this);
  this.send = this.send.bind(this);
  this.emit = this.emit.bind(this);
  return this;
};
// store utility and operations - chainable
Reducer.prototype.next = function next (state) {
  return Object.assign({}, this, state);
};
Reducer.prototype.createNamespace = function createNamespace (ns, socket) {
    if ( ns === void 0 ) ns = '/';

  if (this.namespaces.indexOf(ns) < 0) {
    this.namespaces[ns] = socket;
  } return this;
};
Reducer.prototype.destroyNamespace = function destroyNamespace (ns) {
    if ( ns === void 0 ) ns = '/';

  delete this.namespaces[ns];
  delete this[ns];
  return this;
};
// chainable socket.
Reducer.prototype.connect = function connect (ns, options) {
    if ( ns === void 0 ) ns= '/';

  var socket = this.namespaces.indexOf(ns) >= 0 ?
    this[ns].open() : this.namespaces[ns] = io.connect(ns);
  return socket;
};
Reducer.prototype.disconnect = function disconnect (ns) {
    if ( ns === void 0 ) ns = '/';

  var socket = this.namespaces[ns];
  socket && socket.disconnect();
  return socket;
};
Reducer.prototype.open = function open (ns) {
    if ( ns === void 0 ) ns ='/';

  var socket = this.namespaces[ns];
  socket && socket.open();
  return socket;
};
Reducer.prototype.close = function close (ns) {
    if ( ns === void 0 ) ns ='/';

  var socket = this.namespaces[ns];
  socket && socket.close();
  return socket;
};
Reducer.prototype.send = function send (ns) {
    var args = [], len = arguments.length - 1;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

    if ( ns === void 0 ) ns = '/';
  console.log(args);
  // const [ ...data, ack ] = args;
  var socket = this.namespaces[ns];
  socket && socket.send.apply(socket, args);
  return socket;
};
Reducer.prototype.emit = function emit (ns) {
    var args = [], len = arguments.length - 1;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

    if ( ns === void 0 ) ns = '/';
  console.log(args);
  // const [ message, ...data, ack ] = args;
  var socket = this.namespaces[ns];
  socket && socket.emit.apply(socket, args);
  return socket;
};

var CONSTANTS = [
  '@@io/CONNECT',
  '@@io/LISTEN',
  '@@io/EVENT',
  '@@io/EMIT',
  '@@io/OPEN',
  '@@io/CLOSE',
  '@@io/DESTROY',
  '@@io/DISCONNECT',
  '@@io/ACKNOWLEDGE',
  '@@io/INITIALIZED'
];

var CONNECT = CONSTANTS[0];
var LISTEN = CONSTANTS[1];
var EVENT = CONSTANTS[2];
var EMIT = CONSTANTS[3];
var OPEN = CONSTANTS[4];
var CLOSE = CONSTANTS[5];
var DESTROY = CONSTANTS[6];
var ACKNOWLEDGE = CONSTANTS[8];
var INITIALIZED = CONSTANTS[9];

function dispatcher(type, ns, o) {
  return function (dispatch) { return dispatch(Object.assign({}, {type: type, ns: ns}, o)); };
}

function configureSocketMiddleware(extensions) {
  function socketMiddleware(store, next, action) {
    var type = action.type;
    var ns = action.ns;
    var options = action.options;
    var event = action.event; if ( event === void 0 ) event = '';
    var data = action.data; if ( data === void 0 ) data = [];
    var fn = action.fn;
    var socket = store.getState().socket;

    switch(type) {
      default : return next(action);
      case OPEN: { return socket.namespaces[ns].open(); }
      case CLOSE: { return socket.namespaces[ns].close(); }
      case DESTROY: { socket.namespaces[ns].destroy(); return next(action); }
      case ACKNOWLEDGE: case EVENT: { return fn && fn.apply(void 0, [ store.dispatch, socket.namespaces[ns] ].concat( data )); }
      case CONNECT: {
        if (ns in socket) { return socket.namespaces[ns].connect(); }

        var dispatch = function (type, o) {
          if ( o === void 0 ) o = {};

          return dispatcher(type, ns, o)(store.dispatch);
        };

        return dispatch(INITIALIZED, ( obj = {
          ns: ns,
          socket: socket.io.connect(ns, options),
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
    }
  }
  return function (store) { return function (next) { return function (action) {
    return /^@@io/.test(action.type) ?
      socketMiddleware(store, next, action) : next(action);
  }; }; };
}

function redux_io (io, extensions) {
  if ( io === void 0 ) io = null;

  if (!io) { return new Error('You must pass in a client.'); }

  return {
    middleware: configureSocketMiddleware(extensions),
    reducer: function socketReducer (state, action) {
      if ( state === void 0 ) state = new Reducer(io, extensions);

      if (/^@@io/.test(action.type)) {
        var type = action.type;
        var ns = action.ns;
        var socket = action.socket;
        var stats = action.stats;
        switch(type) {
          default: return state;
          case DESTROY: return state.destroyNamespace.call(this, ns).next();
          case INITIALIZED: return state.createNamespace.call(this, ns, socket).next(( obj = {}, obj[ns] = action[ns], obj ));
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
