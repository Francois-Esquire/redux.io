import CONSTANTS from './constants';

export default class Reducer {
  constructor(io, extensions) {
    this.io = io;

    const next = state => Object.assign({}, this, state || {});

    const sockets = new Map();
    const namespaces = new Map();

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
      const { type, ns, socket, status } = action || {};
      switch(type) {
        default: return this;
        case CONSTANTS[13]:
          return updateStatus(ns, status);
        case CONSTANTS[8]:
          return destroyNamespace(ns);
        case CONSTANTS[11]:
          return createNamespace(ns, socket, { id: socket.id, ...action[ns] });
      }
    };
  }
  connect(ns= '/', options) {
    const socket = this[ns];
    socket && socket.open();
    return socket;
  }
  disconnect(ns = '/') {
    const socket = this[ns];
    socket && socket.close();
    return socket;
  }
  destroy(ns = '/', event, fn) {
    const socket = this[ns];
    socket && socket.destroy(event, fn);
    return socket;
  }
  send(ns = '/', data, fn) {
    const socket = this[ns];
    socket && socket.send(data, fn);
    return socket;
  }
  emit(ns = '/', event, data, fn) {
    const socket = this[ns];
    socket && socket.emit(event, data, fn);
    return socket;
  }
  on(ns = '/', event, fn) {
    const socket = this[ns];
    socket && socket.on(event, fn);
    return socket;
  }
  once(ns = '/', event, fn) {
    const socket = this[ns];
    socket && socket.once(event, fn);
    return socket;
  }
  off(ns = '/', event, fn) {
    const socket = this[ns];
    socket && socket.off(event, fn);
    return socket;
  }
}
