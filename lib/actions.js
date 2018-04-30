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
} from './constants';

export function create(nsp, options) {
  // if ns does not exist, connects to ns with options.
  // otherwise, connects to existing socket
  return { type: CREATE, nsp, options };
}

export function mount(nsp, uri) {
  return { type: MOUNT, nsp, uri };
}

export function dismount(nsp, uri) {
  return { type: DISMOUNT, nsp, uri };
}

export function connect(nsp, uri) {
  return { type: CONNECT, nsp, uri };
}

export function disconnect(nsp, uri) {
  return { type: DISCONNECT, nsp, uri };
}

export function on(nsp, uri, event, callback) {
  return { type: ON, nsp, uri, event, callback };
}

export function once(nsp, uri, event, callback) {
  return { type: ONCE, nsp, uri, event, callback };
}

export function off(nsp, uri, event, callback) {
  return { type: OFF, nsp, uri, event, callback };
}

export function send(nsp, uri, event = 'message', ...args) {
  let ack;

  // would require thunk
  return dispatch => {
    if (typeof args[args.length - 1] === 'function') {
      ack = function acknowledge(...data) {
        args[args.length - 1](dispatch, ...data);

        dispatch({ type: ACK, nsp, uri, event, args: data });
      };
    }

    return { type: SEND, nsp, uri, event, args, ack };
  };
}
