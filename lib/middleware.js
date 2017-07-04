import CONSTANTS from './constants';

const [
  CONNECT,
  LISTEN,
  EVENT,
  EMIT,
  MUTE,
  ONCE,
  OPEN,
  CLOSE,
  DESTROY,
  DISCONNECT,
  ACKNOWLEDGE,
  CREATE,
  COMPRESS
] = CONSTANTS;

export default function configureSocketMiddleware(extensions) {
  function dispatcher(type, ns, o) {
    return (dispatch, socket) => dispatch({ type, ns, ...o });
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
      case EMIT: {
        const sock = socket.namespaces[ns];
        const args = fn && typeof fn === 'function' ? data.concat(function ack() {
          return store.dispatch({ type: ACKNOWLEDGE, ns, event, fn, data: [...arguments] });
        }) : data;
        if (event === 'message') return sock.send(...args);
        return sock.emit.apply(sock, [event, ...args]);
      }
      case ONCE:
      case LISTEN: {
        if (socket.namespaces[ns] && event && fn) {
          function callback() {
            return store.dispatch({ type: EVENT, ns, event, fn, data: [...arguments] });
          }
          if (type === ONCE) socket.namespaces[ns].once(event, callback);
          else socket.namespaces[ns].on(event, callback);
          return next(action);
        }
      }
      case OPEN: { return socket.namespaces[ns].open(); }
      case CONNECT: {
        if (socket.namespaces.indexOf(ns) >= 0) return socket.namespaces[ns].connect();

        const dispatch = (type, o = {}) => dispatcher(type, ns, o)(store.dispatch);

        return dispatch(CREATE, {
          ns,
          [ns]: {
            open: () => dispatch(OPEN),
            close: () => dispatch(CLOSE),
            destroy: () => dispatch(DESTROY),
            compress: (options) => dispatch(COMPRESS, { options }),
            send: (data, fn) => dispatch(EMIT, { event: 'message', data, fn }),
            emit: (event, data, fn) => dispatch(EMIT, { event, data, fn }),
            on: (event, fn) => dispatch(LISTEN, { event, fn }),
            once: (event, fn) => dispatch(ONCE, { event, fn }),
            off: (event, fn) => dispatch(MUTE, { event, fn }),
          },
          socket: socket.io.connect(ns, options),
        });
      }
      case CLOSE:
      case DISCONNECT: { return socket.namespaces[ns].close(); }
      case DESTROY: { socket.namespaces[ns].destroy(); return next(action); }
      case MUTE: { return socket.namespaces[ns].off(event, fn); }
      case COMPRESS: { return socket.namespaces[ns].compress(options); }
    }
  }
}
