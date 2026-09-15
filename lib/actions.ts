import {
  CREATE,
  MOUNT,
  DISMOUNT,
  CONNECT,
  DISCONNECT,
  SEND,
  ACK,
  ON,
  OFF,
  ONCE,
} from './constants.js';
import type { Dispatch } from 'redux';
import type { SocketOptions } from './types.js';

export function create(nsp: string, options?: SocketOptions) {
  return { type: CREATE, nsp, options };
}

export function mount(nsp: string, uri: string) {
  return { type: MOUNT, nsp, uri };
}

export function dismount(nsp: string, uri: string) {
  return { type: DISMOUNT, nsp, uri };
}

export function connect(nsp: string, uri: string) {
  return { type: CONNECT, nsp, uri };
}

export function disconnect(nsp: string, uri: string) {
  return { type: DISCONNECT, nsp, uri };
}

export function on(
  nsp: string,
  uri: string,
  event: string,
  callback: (...args: any[]) => void,
) {
  return { type: ON, nsp, uri, event, callback };
}

export function once(
  nsp: string,
  uri: string,
  event: string,
  callback: (...args: any[]) => void,
) {
  return { type: ONCE, nsp, uri, event, callback };
}

export function off(
  nsp: string,
  uri: string,
  event: string,
  callback?: (...args: any[]) => void,
) {
  return { type: OFF, nsp, uri, event, callback };
}

export function send(
  nsp: string,
  uri: string,
  event = 'message',
  ...args: any[]
) {
  return (dispatch: Dispatch) => {
    let ack;
    const payload = [...args];
    if (typeof args[args.length - 1] === 'function') {
      const callback = payload.pop();
      ack = function acknowledge(...data: unknown[]) {
        callback(dispatch, ...data);

        dispatch({ type: ACK, nsp, uri, event, args: data });
      };
    }

    return dispatch({ type: SEND, nsp, uri, event, args: payload, ack });
  };
}
