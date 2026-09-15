import type React from 'react';
import type { Dispatch } from 'redux';
import type {
  ManagerOptions,
  SocketOptions as ClientOptions,
  Socket,
} from 'socket.io-client';

export type EventsMap = Record<string, (...args: any[]) => void>;
export type SocketOptions = Partial<ManagerOptions & ClientOptions>;
export type SocketFactory = (url?: string, options?: SocketOptions) => Socket;
type EventArgs<Events, Event extends keyof Events> = Events[Event] extends (
  ...args: infer Args
) => unknown
  ? Args
  : never;
type Listener<Events, Event extends keyof Events> = (
  ...args: EventArgs<Events, Event>
) => void;
type ReceiveEvents<Events> = Events & {
  connect: () => void;
  disconnect: (reason: string, details?: unknown) => void;
  connect_error: (error: Error) => void;
};

export interface SocketInterface<
  ListenEvents = EventsMap,
  EmitEvents = ListenEvents,
> {
  readonly id: string | undefined;
  readonly uri: string | undefined;
  readonly nsp: string | undefined;
  readonly connected: boolean;
  readonly readyState: 'open' | 'opening' | 'closed' | undefined;
  readonly io: SocketFactory;
  open(): this;
  close(): this;
  connect(): this;
  disconnect(): this;
  compress(value: boolean): this;
  on<Event extends keyof ReceiveEvents<ListenEvents> & string>(
    event: Event,
    callback: Listener<ReceiveEvents<ListenEvents>, Event>,
  ): this;
  once<Event extends keyof ReceiveEvents<ListenEvents> & string>(
    event: Event,
    callback: Listener<ReceiveEvents<ListenEvents>, Event>,
  ): this;
  off<Event extends keyof ReceiveEvents<ListenEvents> & string>(
    event?: Event,
    callback?: Listener<ReceiveEvents<ListenEvents>, Event>,
  ): this;
  emit<Event extends keyof EmitEvents & string>(
    event: Event,
    ...args: EventArgs<EmitEvents, Event>
  ): this;
  send(
    ...args: 'message' extends keyof EmitEvents
      ? EventArgs<EmitEvents, 'message'>
      : never
  ): this;
  reconnection(): boolean | undefined;
  reconnection(value: boolean): this;
  reconnectionAttempts(): number | undefined;
  reconnectionAttempts(value: number): this;
  reconnectionDelay(): number | undefined;
  reconnectionDelay(value: number): this;
  reconnectionDelayMax(): number | undefined;
  reconnectionDelayMax(value: number): this;
  timeout(): number | undefined;
  timeout(value: number): this;
}

export interface SocketProps<
  ListenEvents = EventsMap,
  EmitEvents = ListenEvents,
> {
  socket: SocketInterface<ListenEvents, EmitEvents>;
}
type Lifecycle<ListenEvents, EmitEvents, Args extends unknown[] = []> = (
  dispatch: Dispatch,
  socket: SocketInterface<ListenEvents, EmitEvents>,
  ...args: Args
) => void;
export interface SocketLifecycleProps<
  ListenEvents = EventsMap,
  EmitEvents = ListenEvents,
> {
  url?: string;
  closeOnUnmount?: boolean;
  onMount?: Lifecycle<ListenEvents, EmitEvents>;
  onDismount?: Lifecycle<ListenEvents, EmitEvents>;
  onConnect?: Lifecycle<ListenEvents, EmitEvents>;
  onDisconnect?: Lifecycle<
    ListenEvents,
    EmitEvents,
    [reason: string, details?: unknown]
  >;
  onConnectError?: Lifecycle<ListenEvents, EmitEvents, [error: Error]>;
  onError?: Lifecycle<ListenEvents, EmitEvents, [error: Error]>;
  onReconnect?: Lifecycle<ListenEvents, EmitEvents, [attempt: number]>;
  onReconnectAttempt?: Lifecycle<ListenEvents, EmitEvents, [attempt: number]>;
  onReconnectError?: Lifecycle<ListenEvents, EmitEvents, [error: Error]>;
  onReconnectFailed?: Lifecycle<ListenEvents, EmitEvents>;
  onMessage?: 'message' extends keyof ListenEvents
    ? Listener<ListenEvents, 'message'>
    : never;
}
export interface SocketConfig {
  io?: SocketFactory;
  defaults?: SocketOptions;
  alias?: string;
  withRef?: boolean;
}
export interface SocketWrapperRef<
  ListenEvents = EventsMap,
  EmitEvents = ListenEvents,
> {
  readonly socket: SocketInterface<ListenEvents, EmitEvents>;
  getWrappedInstance(): unknown;
}
type OptionsFor<Props> = SocketOptions | ((props: Props) => SocketOptions);
export interface SocketConnector<ListenEvents, EmitEvents> {
  <Props extends SocketProps<ListenEvents, EmitEvents>>(
    component: React.ComponentType<Props>,
    config?: SocketConfig,
  ): React.ComponentType<
    Omit<Props, 'socket'> &
      SocketLifecycleProps<ListenEvents, EmitEvents> & {
        options?: OptionsFor<Omit<Props, 'socket'>>;
        ref?: React.Ref<SocketWrapperRef<ListenEvents, EmitEvents>>;
      }
  >;
  (
    component?: null,
    config?: SocketConfig,
  ): React.ComponentType<
    SocketLifecycleProps<ListenEvents, EmitEvents> & {
      options?: SocketOptions;
      children:
        | React.ReactElement
        | ((props: SocketProps<ListenEvents, EmitEvents>) => React.ReactNode);
      ref?: React.Ref<SocketWrapperRef<ListenEvents, EmitEvents>>;
    }
  >;
}
