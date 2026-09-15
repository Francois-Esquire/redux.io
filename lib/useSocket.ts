import { useEffect, useReducer } from 'react';
import {
  io,
  type Socket,
  type ManagerOptions,
  type SocketOptions as ClientOptions,
} from 'socket.io-client';

export type SocketOptions = Partial<ManagerOptions & ClientOptions>;
export type EventsMap = Record<string, (...args: any[]) => void>;

export interface UseSocketResult<
  ListenEvents extends Record<string, any> = EventsMap,
  EmitEvents extends Record<string, any> = ListenEvents,
> {
  socket: Socket<ListenEvents, EmitEvents> | null;
  connected: boolean;
  id: string | undefined;
  error: Error | null;
}

type Action<
  ListenEvents extends Record<string, any>,
  EmitEvents extends Record<string, any>,
> =
  | { type: 'ready'; socket: Socket<ListenEvents, EmitEvents> }
  | { type: 'connect'; id: string | undefined }
  | { type: 'disconnect' }
  | { type: 'error'; error: Error };

function reduceSocket<
  ListenEvents extends Record<string, any>,
  EmitEvents extends Record<string, any>,
>(
  state: UseSocketResult<ListenEvents, EmitEvents>,
  action: Action<ListenEvents, EmitEvents>,
): UseSocketResult<ListenEvents, EmitEvents> {
  switch (action.type) {
    case 'ready':
      return {
        socket: action.socket,
        connected: false,
        id: undefined,
        error: null,
      };
    case 'connect':
      return { ...state, connected: true, id: action.id, error: null };
    case 'disconnect':
      return { ...state, connected: false, id: undefined };
    case 'error':
      return { ...state, connected: false, id: undefined, error: action.error };
  }
}

export function useSocket<
  ListenEvents extends Record<string, any> = EventsMap,
  EmitEvents extends Record<string, any> = ListenEvents,
>(
  url?: string,
  options?: SocketOptions,
): UseSocketResult<ListenEvents, EmitEvents> {
  const [state, dispatch] = useReducer(reduceSocket<ListenEvents, EmitEvents>, {
    socket: null,
    connected: false,
    id: undefined,
    error: null,
  });

  useEffect(() => {
    const socket: Socket<ListenEvents, EmitEvents> = io(url, {
      ...options,
      autoConnect: false,
    });
    socket.on('connect', () => dispatch({ type: 'connect', id: socket.id }));
    socket.on('disconnect', () => dispatch({ type: 'disconnect' }));
    socket.on('connect_error', error => dispatch({ type: 'error', error }));
    dispatch({ type: 'ready', socket });
    if (options?.autoConnect !== false) socket.connect();

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, [url, options]);

  return state;
}
