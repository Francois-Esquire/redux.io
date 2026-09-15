import {
  CREATE,
  CONNECT,
  DISCONNECT,
  ON,
  OFF,
  ONCE,
  DEFAULTS,
} from './constants.js';
import type { UnknownAction, Reducer } from 'redux';
import type { Socket } from 'socket.io-client';
import type { SocketFactory, SocketOptions } from './types.js';

export interface LegacySocketState {
  io: SocketFactory;
  defaults: SocketOptions;
  [namespace: string]: Socket | SocketFactory | SocketOptions;
}
type SocketAction = UnknownAction & {
  nsp: string;
  options?: SocketOptions;
  event: string;
  callback?: (...args: any[]) => void;
};

export default function reducer(
  io: SocketFactory,
  defaults: SocketOptions = {},
): Reducer<LegacySocketState> {
  if (typeof io !== 'function') {
    throw new Error(
      'Please make sure you are passing in socket.io to the reducer.',
    );
  }

  const initialState = { io, defaults: { ...defaults } };

  return function socketReducer(
    state: LegacySocketState = initialState,
    incoming: UnknownAction,
  ) {
    const action = incoming as SocketAction;
    const { type, nsp } = action;
    switch (type) {
      case CREATE: {
        if (Object.hasOwn(state, nsp)) return state;
        const socket = io(nsp, { ...state.defaults, ...action.options });
        return { ...state, [nsp]: socket };
      }
      case DEFAULTS:
        return { ...state, defaults: { ...state.defaults, ...action.options } };
      case CONNECT:
      case DISCONNECT:
      case ON:
      case OFF:
      case ONCE: {
        const socket = (Object.hasOwn(state, nsp) ? state[nsp] : undefined) as
          Socket | undefined;
        if (!socket || nsp === 'io' || nsp === 'defaults') return state;
        if (type === CONNECT) socket.open();
        else if (type === DISCONNECT) socket.close();
        else {
          const method = { [ON]: 'on', [OFF]: 'off', [ONCE]: 'once' }[type] as
            'on' | 'off' | 'once';
          const emitter = socket as unknown as Record<
            typeof method,
            (event: string, callback?: (...args: any[]) => void) => void
          >;
          if (action.callback === undefined) emitter[method](action.event);
          else emitter[method](action.event, action.callback);
        }
        return state;
      }
      default:
        return state;
    }
  };
}
