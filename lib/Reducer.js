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
  }
  // store utility and operations - chainable
  next(state) {
    return Object.assign({}, this, state);
  }
  createNamespace(ns = '/', socket) {
    if (this.namespaces.indexOf(ns) < 0) {
      this.namespaces[ns] = socket;
    } return this;
  }
  destroyNamespace(ns = '/') {
    delete this.namespaces[ns];
    delete this[ns];
    return this;
  }
  // chainable socket.
  connect(ns= '/', options) {
    const socket = this.namespaces.indexOf(ns) >= 0 ?
      this[ns].open() : this.namespaces[ns] = io.connect(ns);
    return socket;
  }
  disconnect(ns = '/') {
    const socket = this.namespaces[ns];
    socket && socket.disconnect();
    return socket;
  }
  open(ns ='/') {
    const socket = this.namespaces[ns];
    socket && socket.open();
    return socket;
  }
  close(ns ='/') {
    const socket = this.namespaces[ns];
    socket && socket.close();
    return socket;
  }
  send(ns = '/', ...args) {
    console.log(args);
    // const [ ...data, ack ] = args;
    const socket = this.namespaces[ns];
    socket && socket.send(...args);
    return socket;
  }
  emit(ns = '/', ...args) {
    console.log(args);
    // const [ message, ...data, ack ] = args;
    const socket = this.namespaces[ns];
    socket && socket.emit(...args);
    return socket;
  }
}
