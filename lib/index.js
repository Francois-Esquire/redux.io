import Reducer from './Reducer.js';
import CONSTANTS from './constants';

const [
  CONNECT,
  LISTEN,
  EVENT,
  EMIT,
  MUTE,
  OPEN,
  CLOSE,
  DESTROY,
  DISCONNECT,
  ACKNOWLEDGE,
  INITIALIZE,
  COMPRESS
] = CONSTANTS;

function configureSocketMiddleware(extensions) {
  function dispatcher(type, ns, o) {
    return dispatch => dispatch({ type, ns, ...o });
  }

  return function socketMiddleware(store, next, action) {
    const { type, ns, options, event = '', data = [], fn } = action;
    const socket = store.getState().socket;

    switch(type) {
      default : return next(action);
      case ACKNOWLEDGE:
      case EVENT: {
        return fn && fn(store.dispatch, socket.namespaces[ns], ...data);
      }
      case OPEN: { return socket.namespaces[ns].open(); }
      case CLOSE:
      case DISCONNECT: { return socket.namespaces[ns].close(); }
      case DESTROY: { socket.namespaces[ns].destroy(); return next(action); }
      case LISTEN: {
        if (socket.namespaces[ns] && event && fn) {
          socket.namespaces[ns].on(event, function() {
            return store.dispatch({ type: EVENT, ns, event, fn, data: [...arguments] });
          });
          return next(action);
        }
      }
      case EMIT: {
        const sock = socket.namespaces[ns];
        const args = fn && typeof fn === 'function' ? data.concat(function ack() {
          return store.dispatch({ type: ACKNOWLEDGE, ns, event, fn, data: [...arguments] });
        }) : data;
        if (event === 'message') return sock.send(...args);
        return sock.emit.apply(sock, [event, ...args]);
      }
      case CONNECT: {
        if (ns in socket) return socket.namespaces[ns].connect();

        const dispatch = (type, o = {}) => dispatcher(type, ns, o)(store.dispatch);

        const sock = socket.io.connect(ns, options);
        return dispatch(INITIALIZE, {
          ns,
          [ns]: {
            open: () => dispatch(OPEN),
            close: () => dispatch(CLOSE),
            destroy: () => dispatch(DESTROY),
            send: (data, fn) => dispatch(EMIT, { event: 'message', data, fn }),
            emit: (event, data, fn) => dispatch(EMIT, { event, data, fn }),
            on: (event, fn) => dispatch(LISTEN, { event, fn }),
          },
          socket: sock,
        });
      }
    }
  }
}

export { CONSTANTS };

export default function redux_io (io, extensions) {
  'use strict';

  if (!io) throw new Error('You must pass in a client.');

  const socketMiddleware = configureSocketMiddleware(extensions);

  function createNamespace(ns = '/', socket) {
    if (this.namespaces.indexOf(ns) < 0) {
      this.namespaces[ns] = socket;
    } return this;
  }

  function destroyNamespace(ns = '/') {
    delete this.namespaces[ns];
    delete this[ns];
    return this;
  }

  const test = type => /^@@io/.test(type);

  return {
    middleware: store => next => action => test(action.type) ?
      socketMiddleware(store, next, action) : next(action),
    reducer: function socketReducer (
      state = new Reducer(io, extensions),
      action
    ) {
      if (test(action.type)) {
        const { type, ns, socket, stats } = action;
        switch(type) {
          default: return state;
          case DESTROY: return destroyNamespace.call(state, ns).next();
          case INITIALIZE: return createNamespace.call(state, ns, socket).next({
            [ns]: { id: socket.id, ...action[ns] }
          });
        }
      } return state;
    },
  };
}
