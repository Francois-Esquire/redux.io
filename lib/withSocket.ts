import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { connect } from 'react-redux';
import type {
  EventsMap,
  SocketConnector,
  SocketConfig,
  SocketOptions,
} from './types.js';

type Callback = (...args: any[]) => void;
type RuntimeProps = Record<string, any>;
type RuntimeClient = Record<string, any>;
type UserListener = { event: string; callback: Callback; listener?: Callback };

const socketEvents = {
  connect: 'onConnect',
  disconnect: 'onDisconnect',
  connect_error: 'onConnectError',
  error: 'onError',
};
const managerEvents = {
  reconnect: 'onReconnect',
  reconnect_attempt: 'onReconnectAttempt',
  reconnect_error: 'onReconnectError',
  reconnect_failed: 'onReconnectFailed',
};
const managerMethods = [
  'reconnection',
  'reconnectionAttempts',
  'reconnectionDelay',
  'reconnectionDelayMax',
  'timeout',
];
const reservedProps = new Set([
  'url',
  'options',
  'children',
  'closeOnUnmount',
  'dispatch',
  'io',
  'defaults',
  'onMount',
  'onDismount',
  'onMessage',
  'onConnectTimeout',
  'onReconnecting',
  ...Object.values(socketEvents),
  ...Object.values(managerEvents),
]);

export default function withSocket<
  ListenEvents = EventsMap,
  EmitEvents = ListenEvents,
>(
  url?: string | SocketOptions | null,
  options?: SocketOptions | ((props: Record<string, any>) => SocketOptions),
): SocketConnector<ListenEvents, EmitEvents>;
export default function withSocket(
  url?: string | SocketOptions | null,
  options?: SocketOptions | ((props: RuntimeProps) => SocketOptions),
): any {
  const optionsOnly = url !== null && typeof url === 'object';
  const factoryUrl = optionsOnly ? undefined : url;
  const factoryOptions = optionsOnly ? url : options;

  return function withSocketConnection(
    WrappedComponent?: React.ComponentType<any> | null,
    config: SocketConfig = {},
  ) {
    const { alias = 'WithSocket', withRef = false } = config;

    class Socket extends React.PureComponent<
      RuntimeProps,
      Record<string, any>
    > {
      static displayName: string;
      client: RuntimeClient | null;
      retainedClient?: RuntimeClient | null;
      queue: [string, any[]][];
      listeners: [RuntimeClient, string, Callback][];
      userListeners: UserListener[];
      api: Record<string, (...args: any[]) => any>;
      wrappedInstance: unknown;
      setWrappedInstance: (instance: unknown) => void;

      constructor(props: RuntimeProps) {
        super(props);
        this.state = {
          id: undefined,
          uri: undefined,
          nsp: undefined,
          readyState: undefined,
          connected: false,
        };
        this.client = null;
        this.queue = [];
        this.listeners = [];
        this.userListeners = [];
        this.api = {};
        for (const method of [
          'open',
          'close',
          'connect',
          'disconnect',
          'on',
          'once',
          'off',
          'emit',
          'send',
          'compress',
        ]) {
          this.api[method] = (...args: any[]) => {
            this.perform(method, args);
            return this.socket;
          };
        }
        for (const method of managerMethods) {
          this.api[method] = value => {
            if (value === undefined) return this.client?.io[method]();
            this.perform(method, [value]);
            return this.socket;
          };
        }
        this.setWrappedInstance = instance => {
          this.wrappedInstance = instance;
        };
      }

      get socket() {
        return Object.freeze({
          ...(this.client ? this.snapshot() : this.state),
          ...this.api,
          io: this.props.io,
        });
      }

      getWrappedInstance() {
        return this.wrappedInstance;
      }

      componentDidMount() {
        this.start();
      }

      componentDidUpdate(previous: RuntimeProps) {
        if (previous.io !== this.props.io || previous.url !== this.props.url) {
          this.stop(true);
          this.start();
        }
      }

      componentWillUnmount() {
        this.stop(this.props.closeOnUnmount ?? false);
      }

      ownProps() {
        return Object.fromEntries(
          Object.entries(this.props).filter(([key]) => !reservedProps.has(key)),
        );
      }

      snapshot() {
        const { id, nsp, connected, io } = this.client!;
        return {
          id,
          nsp,
          connected,
          uri: io.uri,
          readyState: connected
            ? 'open'
            : this.client!.active
              ? 'opening'
              : 'closed',
        };
      }

      notify(name: string, args: any[] = []) {
        const callback = this.props[name];
        if (typeof callback === 'function')
          callback(this.props.dispatch, this.socket, ...args);
      }

      listen(target: RuntimeClient, event: string, callback: Callback) {
        target.on(event, callback);
        this.listeners.push([target, event, callback]);
      }

      start() {
        const { io, defaults } = this.props;
        if (typeof io !== 'function') {
          throw new Error(
            'Pass the Socket.IO client as config.io or register reducer(io) at state.socket.',
          );
        }
        const selected = this.props.options ?? factoryOptions;
        const settings = {
          ...defaults,
          ...(typeof selected === 'function'
            ? selected(this.ownProps())
            : selected),
        };
        this.client =
          this.retainedClient || io(this.props.url ?? factoryUrl, settings);
        this.retainedClient = null;
        for (const [event, name] of Object.entries(socketEvents)) {
          this.listen(this.client!, event, (...args) => {
            this.setState(this.snapshot());
            this.notify(name, args);
            if (event === 'connect_error') this.notify('onError', args);
          });
        }
        this.listen(this.client!, 'message', (...args) =>
          this.props.onMessage?.(...args),
        );
        for (const [event, name] of Object.entries(managerEvents)) {
          this.listen(this.client!.io, event, (...args) => {
            this.notify(name, args);
            if (event === 'reconnect_error') this.notify('onError', args);
          });
        }
        const pending = this.queue.splice(0);
        for (const [method, args] of pending) this.perform(method, args);
        if (settings.autoConnect !== false && !this.client!.connected)
          this.client!.connect();
        this.setState(this.snapshot());
        this.notify('onMount');
      }

      stop(close: boolean) {
        if (!this.client) {
          this.queue = [];
          return;
        }
        try {
          this.notify('onDismount');
        } finally {
          for (const [target, event, callback] of this.listeners)
            target.off(event, callback);
          this.listeners = [];
          for (const { event, listener } of this.userListeners)
            this.client.off(event, listener);
          this.userListeners = [];
          if (close) this.client.disconnect();
          else this.retainedClient = this.client;
          this.client = null;
          this.queue = [];
        }
      }

      perform(method: string, args: any[]) {
        if (!this.client) {
          this.queue.push([method, args]);
          return;
        }
        if (method === 'on' || method === 'once') {
          const [event, callback] = args;
          const entry: UserListener = { event, callback };
          entry.listener = (...data) => {
            if (method === 'once') {
              this.client!.off(event, entry.listener);
              this.userListeners = this.userListeners.filter(
                item => item !== entry,
              );
            }
            callback(...data);
          };
          this.userListeners.push(entry);
          this.client.on(event, entry.listener);
        } else if (method === 'off') {
          const [event, callback] = args;
          this.userListeners = this.userListeners.filter(entry => {
            if (
              (event === undefined || entry.event === event) &&
              (callback === undefined || entry.callback === callback)
            ) {
              this.client!.off(entry.event, entry.listener);
              return false;
            }
            return true;
          });
        } else if (managerMethods.includes(method)) {
          this.client.io[method](...args);
        } else if (method === 'send') {
          this.client.emit('message', ...args);
        } else {
          this.client[method](...args);
        }
      }

      render() {
        const payload: RuntimeProps = {
          ...this.ownProps(),
          socket: this.socket,
        };
        if (WrappedComponent) {
          payload.children = this.props.children;
          if (withRef) payload.ref = this.setWrappedInstance;
          return React.createElement(WrappedComponent, payload);
        }
        return typeof this.props.children === 'function'
          ? this.props.children(payload)
          : React.cloneElement(
              React.Children.only(this.props.children),
              payload,
            );
      }
    }

    const displayName =
      WrappedComponent?.displayName || WrappedComponent?.name || 'Component';
    Socket.displayName = `${alias}(${displayName})`;
    const SocketWrapper = connect(
      (state: {
        socket?: { io?: SocketConfig['io']; defaults?: SocketOptions };
      }) => ({
        io: config.io ?? state.socket?.io,
        defaults: config.defaults ?? state.socket?.defaults,
      }),
      null,
      null,
      { forwardRef: withRef },
    )(Socket);
    SocketWrapper.displayName = Socket.displayName;
    return WrappedComponent
      ? hoistNonReactStatics(SocketWrapper, WrappedComponent)
      : SocketWrapper;
  };
}
