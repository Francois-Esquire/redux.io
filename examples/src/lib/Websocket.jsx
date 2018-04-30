import React from 'react';
import PropTypes from 'prop-types';

export default class Socket extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      socket: null,
      readyState: 0,
      subscribers: [],
    };

    this.onOpen = this.onOpen.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onMessage = this.onMessage.bind(this);
    this.onError = this.onError.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
    this.send = this.send.bind(this);
  }

  componentDidMount() {
    if (this.props.connectOnMount) this.initialize();
  }

  componentWillUnmount() {
    if (this.state.socket) this.close();
  }

  onOpen(event) {
    if (typeof this.props.onOpen === 'function')
      this.props.onOpen(this.state.socket);

    if (this.state.subscribers.length)
      this.state.subscribers.forEach(
        ({ cb, type }) => type === 'open' && cb(event),
      );

    this.setState({ readyState: this.state.socket.readyState });
  }

  onClose(event) {
    if (typeof this.props.onClose === 'function') this.props.onClose(event);

    if (this.state.subscribers.length)
      this.state.subscribers.forEach(
        ({ cb, type }) => type === 'close' && cb(event),
      );

    this.setState({ readyState: this.state.socket.readyState, socket: null });
  }

  onMessage(event) {
    if (typeof this.props.onMessage === 'function') this.props.onMessage(event);

    if (this.state.subscribers.length)
      this.state.subscribers.forEach(
        ({ cb, type }) => type === 'message' && cb(event),
      );
  }

  onError(event) {
    if (typeof this.props.onError === 'function') this.props.onError(event);

    if (this.state.subscribers.length)
      this.state.subscribers.forEach(
        ({ cb, type }) => type === 'error' && cb(event),
      );
  }

  initialize() {
    const { url, protocols } = this.props;

    // check if websockets supported.
    const ws = new WebSocket(url, protocols);

    ws.onopen = this.onOpen;
    ws.onclose = this.onClose;
    ws.onmessage = this.onMessage;
    ws.onerror = this.onError;

    this.setState({ readyState: ws.readyState, socket: ws });
  }

  subscribe(cb, type = 'message') {
    if (typeof cb !== 'function')
      throw new Error('the callback passed to subscribe must be a function');

    const id = `${Math.random()}`;

    this.setState(state => ({
      subscribers: state.subscribers.concat({ cb, type, id }),
    }));

    return () =>
      !this.setState(state => ({
        subscribers: state.subscribers.filter(sub => sub.id !== id),
      })) && null;
  }

  open() {
    if (this.state.socket === null) this.initialize();
  }

  close() {
    if (this.state.socket) this.state.socket.close();
    else console.warn('Socket is already closed');
  }

  send(...args) {
    if (this.state.socket) this.state.socket.send(...args);
    else console.warn('Socket is already closed');
  }

  render() {
    const {
      props: { children },
      state: { readyState, socket },
      subscribe,
      close,
      open,
      send,
    } = this;

    const payload = {
      readyState,
      subscribe,
      close,
      open,
      send,
      socket,
    };

    return typeof children === 'function'
      ? children(payload)
      : React.cloneElement(children, payload);
  }
}

Socket.propTypes = {
  url: PropTypes.string.isRequired,
  protocols: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  onMessage: PropTypes.func,
  onError: PropTypes.func,
  connectOnMount: PropTypes.bool,
};

Socket.defaultProps = {
  protocols: undefined,
  onOpen: undefined,
  onClose: undefined,
  onMessage: undefined,
  onError: undefined,
  connectOnMount: true,
};
