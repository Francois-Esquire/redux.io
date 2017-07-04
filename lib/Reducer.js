const readyState = [
  'CONNECTING',
  'OPEN',
  'CLOSING',
  'CLOSED'
];

export default class Reducer {
  constructor(io, extensions) {
    this.io = io;
    this.namespaces = [];

    this.next = this.next.bind(this);

    return this;
  }
  // store utility and operations - chainable
  next(state) {
    return Object.assign({}, this, state || {});
  }
  connect(ns= '/', options) {
    const socket = this.namespaces.indexOf(ns) >= 0 ?
      this[ns].open() : this.namespaces[ns] = io.connect(ns);
    return socket;
  }
  disconnect(ns = '/') {
    const socket = this[ns];
    socket && socket.close();
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
}
