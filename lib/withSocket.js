import React from 'react';
import { connectAdvanced } from 'react-redux';

const managerOptions = [
  'path',
  'query',
  'forceNew',
  'transports',
];

const socketEvents = [
  'connect',
  'connect_error',
  'connect_timeout',
  'error',
  'disconnect',
  'reconnect',
  'reconnect_attempt',
  'reconnecting',
  'reconnect_error',
  'reconnect_failed',
  'ping',
  'pong'
];

export default function withSocket(url, options, config) {
  const {
    alias = 'withSocket',
    withRef,
  } = config;

  return function withSocketConnection(Component) {

    class WithSocket extends React.PureComponent {
      constructor(props) {
        super(props);

        const io = props.socket.io;
        const socket = io.connect(url, options);

        const abstraction = {
          open() {},
          close() {},
          destroy() {},
          compress() {},
          send() {
            socket.send.apply(socket, arguments);
            return this;
          },
          emit() {
            socket.emit.apply(socket, arguments);
            return this;
          },
          on() {},
          once() {},
          off() {},
        };

        this.state = {
          id: socket.id,
          namespace: url,
          readyState: 0,
          protocol: '',
        };
      }
      componentWillUnmount() { /* disconnect socket */ }
      render() {
        const {
          ownProps,
        } = this.props;

        return (<Component {...ownProps} socket={this.state} />);
      }
    }

    return connectAdvanced((dispatch) => {

      const methods = {
        open: () => dispatch(OPEN),
        close: () => dispatch(CLOSE),
        destroy: () => dispatch(DESTROY),
        compress: (options) => dispatch(COMPRESS, { options }),
        send: (data, fn) => dispatch(EMIT, { event: 'message', data, fn }),
        emit: (event, data, fn) => dispatch(EMIT, { event, data, fn }),
        on: (event, fn) => dispatch(LISTEN, { event, fn }),
        once: (event, fn) => dispatch(ONCE, { event, fn }),
        off: (event, fn) => dispatch(MUTE, { event, fn }),
      };

      return ({ socket }, ownProps) => {

        return {
          socket,
          ownProps,
        };
      };
    }, {
      withRef,
      methodName: 'withSocket',
      getDisplayName: name => `${alias}(${name})`,
    })(WithSocket)
  };
}
