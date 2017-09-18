import React from 'react';
import { connectAdvanced } from 'react-redux';
import hoistNonReactStatics from 'hoist-non-react-statics';
import pick from 'lodash.pick';

import { socketOptions, socketEvents, socketEventProps } from './constants';

// eslint-disable-next-line import/prefer-default-export
export function withSocket(uri, options) {
  if (typeof uri === 'object' || typeof uri === 'function') {
    options = uri;
    uri = undefined;
  }

  if (typeof options !== 'function') {
    options = function calculateOptions() { return options; };
  }

  return function withSocketConnection(WrappedComponent, config = {}) {
    const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
    const {
      alias = 'withSocket',
      withRef = false,
    } = config;

    class WithSocket extends React.PureComponent {
      constructor(props) {
        super(props);

        const {
          io,
          opts,
          events,
          socket,
          dispatch,
        } = props;

        this.opts = opts;

        this.events = {};

        Object.keys(events).forEach(key => this.addEvent(key, events[key]));

        function callback(cb) {
          return function ack(...data) {
            return cb(dispatch, ...data);
          };
        }

        this.state = {
          io,
          id: socket.id,
          namespace: socket.io.uri,
          readyState: socket.io.readyState,
          connected: socket.connected,
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
            console.log(...args);
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

        this.setWrappedInstance = this.setWrappedInstance.bind(this);
      }
      componentDidMount() {
        this.props.socket
          .on('connect', this.updateSocket)
          .on('reconnect', this.updateSocket)
          .on('disconnect', this.updateSocket);
      }
      componentWillReceiveProps(Props) {
        const { events } = Props;

        const remaining = pick(this.events, Object.keys(events));
        const additions = pick(events, Object.keys(this.events));

        Object.keys(remaining).forEach(key => remaining[key]());
        Object.keys(additions).forEach(key => this.addEvent(key, additions[key]));
      }
      componentWillUnmount() {
        const { socket, dispatch } = this.props;
        socket.close();
        Object.keys(this.events).forEach(key => this.events[key]());
        dispatch({ type: '@@io/dismount' });
      }
      getWrappedInstance() {
        return this.wrappedInstance;
      }
      setWrappedInstance(ref) {
        this.wrappedInstance = ref;
      }
      getComponentProps() {
        const {
          ownProps,
        } = this.props;

        const socket = Object.assign({}, this.state);

        const wrappedComponentProps = Object.assign({}, ownProps, { socket });

        if (withRef) wrappedComponentProps.ref = this.setWrappedInstance;

        return wrappedComponentProps;
      }
      addEvent(event, fn) {
        const { dispatch, socket } = this.props;
        const cb = function evt(...args) {
          return fn(dispatch, this.state, ...args);
        }.bind(this);

        socket.on(event, cb);
        this.events[event] = () => {
          socket.off(event, cb);
          delete this.events[event];
        };
      }
      updateSocket() {
        const { id, io, connected } = this.props.socket;
        const { readyState } = io;
        this.setState({
          id,
          readyState,
          connected,
        });
      }
      render() {
        const wrappedComponentProps = this.getComponentProps();

        return React.createElement(WrappedComponent, wrappedComponentProps);
      }
    }

    const componentConnector = connectAdvanced((dispatch) => {
      let io = null;
      let socket = null;
      let initialized = false;

      return (state, props) => {
        const opts = Object.assign(
          {}, state.socket.defaults, options(props), pick(props, socketOptions));

        const evts = pick(props, socketEventProps);
        const events = Object.keys(evts)
          .reduce((o, next) => Object.assign(o, {
            [socketEvents[socketEventProps.indexOf(next)]]: evts[next],
          }), {});

        const ownProps = Object.keys(props)
          .filter(key => !(key in opts || key in events))
          .reduce((o, next) => Object.assign(o, { [next]: props[next] }), {});

        if (initialized === false) {
          io = state.socket.io;

          if (uri in state.socket && opts.forceNew !== true) {
            socket = state.socket[uri];
          } else {
            socket = io(uri, opts);
            dispatch({ type: '@@io/create', ns: uri, socket });
          }

          initialized = true;
        }

        return {
          io,
          opts,
          events,
          socket,
          dispatch,
          ownProps,
        };
      };
    }, {
      methodName: alias,
      getDisplayName: () => `${alias}(${displayName})`,
    });

    return hoistNonReactStatics(componentConnector(WithSocket), WrappedComponent);

    // Object.assign(Connect.propTypes, WrappedComponent.propTypes, {
    //   path: PropTypes.string,
    //   query: PropTypes.object,
    //   forceNew: PropTypes.bool,
    //   multiplex: PropTypes.bool,
    //   transports: PropTypes.arrayOf(PropTypes.string),
    //   reconnection: PropTypes.bool,
    //   reconnectionAttempts: PropTypes.number,
    //   reconnectionDelay: PropTypes.number,
    //   reconnectionDelayMax: PropTypes.number,
    //   randomizationFactor: PropTypes.number,
    //   timeout: PropTypes.number,
    //   autoConnect: PropTypes.bool,
    //   parser: PropTypes.object,
    //   upgrade: PropTypes.bool,
    //   jsonp: PropTypes.bool,
    //   forceJSONP: PropTypes.bool,
    //   forceBase64: PropTypes.bool,
    //   enablesXDR: PropTypes.bool,
    //   timestampRequests: PropTypes.bool,
    //   timestampParam: PropTypes.string,
    //   policyPort: PropTypes.number,
    //   transportOptions: PropTypes.object,
    //   rememberUpgrade: PropTypes.bool,
    //   pfx: PropTypes.string,
    //   Key: PropTypes.string,
    //   passphrase: PropTypes.string,
    //   cert: PropTypes.string,
    // });
  };
}
