import Reducer from './Reducer.js';
import CONSTANTS from './constants';

const [
  CONNECT,
  LISTEN,
  EVENT,
  EMIT,
  OPEN,
  CLOSE,
  DESTROY,
  DISCONNECT,
  ACKNOWLEDGE,
  INITIALIZED
] = CONSTANTS;

function dispatcher(type, ns, o) {
  return dispatch => dispatch({ type, ns, ...o });
}

function configureSocketMiddleware(extensions) {
  function socketMiddleware(store, next, action) {
    const { type, ns, options, event = '', data = [], fn } = action;
    const socket = store.getState().socket;

    switch(type) {
      default : return next(action);
      case OPEN: { return socket.namespaces[ns].open(); }
      case CLOSE: { return socket.namespaces[ns].close(); }
      case DESTROY: { socket.namespaces[ns].destroy(); return next(action); }
      case ACKNOWLEDGE: case EVENT: { return fn && fn(store.dispatch, socket.namespaces[ns], ...data); }
      case CONNECT: {
        if (ns in socket) return socket.namespaces[ns].connect();

        const dispatch = (type, o = {}) => dispatcher(type, ns, o)(store.dispatch);

        return dispatch(INITIALIZED, {
          ns,
          [ns]: {
            open: () => dispatch(OPEN),
            close: () => dispatch(CLOSE),
            destroy: () => dispatch(DESTROY),
            send: (data, fn) => dispatch(EMIT, { event: 'message', data, fn }),
            emit: (event, data, fn) => dispatch(EMIT, { event, data, fn }),
            on: (event, fn) => dispatch(LISTEN, { event, fn }),
          },
          socket: socket.io.connect(ns, options),
        });
      }
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
    }
  }
  return store => next => action => {
    return /^@@io/.test(action.type) ?
      socketMiddleware(store, next, action) : next(action);
  };
}

export { CONSTANTS };

export default function redux_io (io = null, extensions) {
  if (!io) return new Error('You must pass in a client.');

  return {
    middleware: configureSocketMiddleware(extensions),
    reducer: function socketReducer (state = new Reducer(io, extensions), action) {
      if (/^@@io/.test(action.type)) {
        const { type, ns, socket, stats } = action;
        switch(type) {
          default: return state;
          case DESTROY: return state.destroyNamespace.call(this, ns).next();
          case INITIALIZED: return state.createNamespace.call(this, ns, socket).next({
            [ns]: action[ns]
          });
        }
      } return state;
    },
  };
}
