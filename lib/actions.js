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
  return dispatch => {
    let ack;
    const payload = [...args];
    if (typeof args[args.length - 1] === 'function') {
      const callback = payload.pop();
      ack = function acknowledge(...data) {
        callback(dispatch, ...data);

        dispatch({ type: ACK, nsp, uri, event, args: data });
      };
    }

    return dispatch({ type: SEND, nsp, uri, event, args: payload, ack });
  };
}
