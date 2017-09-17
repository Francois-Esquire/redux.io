import React from 'react';
import { connectAdvanced } from 'react-redux';
import hoistNonReactStatics from 'hoist-non-react-statics';

import CONSTANTS, { socketOptions, socketEventProps } from './constants';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

/**
  *
  * @exports withSocket
  *
  * @param {String} uri
  * @param {Object|Function} options
  *
  * @see {@link https://github.com/socketio/socket.io-client/blob/master/docs/API.md#iourl-options|io([url][, options])}
  *
  */

function withSocket(uri, options) {
  if (typeof uri === 'object' || typeof uri === 'function') {
    options = uri;
    uri = undefined;
  }

  function withSocketConnection(WrappedComponent, config) {
    const displayName = getDisplayName(WrappedComponent);

    const {
      alias = 'withSocket',
      withRef = false,
    } = config;

    class WithSocket extends React.PureComponent {
      constructor(props) {
        super(props);

        const {
          socket,
        } = props;

        this.state = {
          id: socket.id,
          namespace: socket.io.uri,
          readyState: socket.io.readyState,
          protocol: '',
        };

        this.events = new Map();

        this.setWrappedInstance = this.setWrappedInstance.bind(this);
      }
      componentWillReceiveProps(Props) {
        const { events } = Props;

        Object.keys(events).forEach((key) => {
          if (socketEventProps.indexOf(key) >= 0) events.push(key);
          else if (socketOptions.indexOf(key) >= 0) opts.push(key);
        });
        // const events = propKeys.filter(key => this.events.has(key));
      }
      componentWillUnmount() {
        const { socket } = this.props;
        socket.close();
      }
      getWrappedInstance() {
        return this.wrappedInstance;
      }
      setWrappedInstance(ref) {
        this.wrappedInstance = ref;
      }
      getComponentProps() {
        const {
          abstraction,
          ownProps,
        } = this.props;

        const socket = Object.assign({}, abstraction, this.state);

        const wrappedComponentProps = Object.assign({}, ownProps, { socket });

        if (withRef) wrappedComponentProps.ref = this.setWrappedInstance;

        return wrappedComponentProps;
      }
      render() {
        const wrappedComponentProps = this.getComponentProps();

        return React.createElement(WrappedComponent, wrappedComponentProps);
      }
    }

    const componentConnector = connectAdvanced((dispatch) => {
      let io = null;
      let socket = null;
      let abstraction = null;
      let initialized = false;
      let calculatedOptions = null;

      function initializeSocket() {
        function callback(cb) {
          return function ack(...data) {
            return cb(dispatch, ...data);
          };
        }

        abstraction = {
          io,
          socket,
          open() {
            socket.open();
            return this;
          },
          close() {
            socket.close();
            return this;
          },
          connect() {
            return this.open();
          },
          disconnect() {
            return this.close();
          },
          on(event, cb) {
            const fn = typeof cb === 'function' ? callback(cb) : cb;
            socket.on(event, fn);
            return this;
          },
          once(event, cb) {
            const fn = typeof cb === 'function' ? callback(cb) : cb;
            socket.once(event, fn);
            return this;
          },
          off(event, cb) {
            socket.off(event, cb);
            return this;
          },
          emit(event, ...args) {
            const isAck = args.splice(-1, 1);

            const fn = typeof isAck === 'function' ? callback(isAck) : isAck;

            args.push(fn);

            socket.emit(event, ...args);

            return this;
          },
          send(...args) {
            return this.emit('message', ...args);
          },
          compress(opt) {
            socket.compress(opt);
            return this;
          },
          reconnection(value) {
            if (value !== undefined) {
              socket.io.reconnection(value);
              return this;
            } return socket.io.reconnection();
          },
          reconnectionAttempts(value) {
            if (value !== undefined) {
              socket.io.reconnectionAttempts(value);
              return this;
            } return socket.io.reconnectionAttempts();
          },
          reconnectionDelay(value) {
            if (value !== undefined) {
              socket.io.reconnectionDelay(value);
              return this;
            } return socket.io.reconnectionDelay();
          },
          reconnectionDelayMax(value) {
            if (value !== undefined) {
              socket.io.reconnectionDelayMax(value);
              return this;
            } return socket.io.reconnectionDelayMax();
          },
          timeout(value) {
            if (value !== undefined) {
              socket.io.timeout(value);
              return this;
            } return socket.io.timeout();
          },
        };

        initialized = true;

        dispatch({ type: CONSTANTS[0] });
      }

      function getOptions(ownProps) {
        const events = {};
        let opts = null;

        Object.keys(ownProps).forEach((key) => {
          if (socketEventProps.indexOf(key) >= 0) {
            if (!this.events.has(key)) events[key] = ownProps[key];
          }
        });

        if (typeof options !== 'function') opts = options;
        else opts = options(ownProps);

        return {
          opts: Object.assign({}, withSocket.defaults, opts),
          events,
        };
      }

      function updateOptions(opts) {
        Object.keys(opts).forEach((key) => {
          if (socket.io.opts[key] !== opts[key]) socket.io.opts[key] = opts[key];
        });
        calculatedOptions = opts;
      }

      function checkOptions(opts) {
        if (calculatedOptions !== opts) {
          // updateOptions

          // also check props for options
          updateOptions(opts);
        }
      }

      return (state, ownProps) => {
        const { opts, events } = getOptions(ownProps);

        if (initialized) {
          checkOptions(opts);
        } else {
          io = state.socket.io;

          if (state.socket.has(uri) && opts.forceNew !== true) {
            socket = state.socket.get(uri);
          } else {
            socket = io(uri, calculatedOptions = opts);
          }

          initializeSocket();
        }

        return {
          socket,
          events,
          abstraction,
          ownProps,
        };
      };
    }, {
      methodName: alias,
      getDisplayName: () => `${alias}(${displayName})`,
    });

    return hoistNonReactStatics(componentConnector(WithSocket), WrappedComponent);
  }

  return withSocketConnection;
}

export default withSocket;
