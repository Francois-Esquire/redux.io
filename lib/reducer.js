import CONSTANTS from './constants';

export default class Reducer {
  constructor(io, extensions) {
    this.io = io;
    this.namespaces = [];

    const createNamespace = (ns = '/', socket, abstraction) => {
      if (this.namespaces.indexOf(ns) < 0) {
        this.namespaces[ns] = socket;
        this[ns] = abstraction;
      } return this;
    };

    const destroyNamespace = (ns = '/') => {
      delete this.namespaces[ns];
      delete this[ns];
      return this;
    };

    const next = state => Object.assign({}, this, state || {});

    return (action) => {
      const { type, ns, socket, stats } = action || {};
      switch(type) {
        default: return this;
        case CONSTANTS[8]: {
          destroyNamespace(ns);
          return next();
        }
        case CONSTANTS[11]: {
          createNamespace(ns, socket, { id: socket.id, ...action[ns] });
          return next();
        }
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
