import { CONSTANTS } from './constants';

export function reduxIo(io, options) {
  if (!io) throw new Error('You must pass in a client.');

  // if io is not passed in, fallback to native websocket.
  // check if other instances of the namespace exist and only disconnect if the remaining one.

  const sockets = new Map();
  const namespaces = new Map();

  function Reducer() {
    this.io = io;
    this.defaults = options;
    this.connections = 0;

    this.has = ns => namespaces.has(ns);
    this.get = ns => namespaces.get(ns);

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

    return (action = {}) => {
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
