'use strict';

import { bindActionCreators } from 'redux';

const CONSTANTS = [
  'IO.INITIALIZE',
  'IO.TIMEOUT',
  'IO.ERROR',
  'IO.EVENT',
  'IO.MESSAGE',
  'IO.EMIT',
  'IO.SEND',
  'IO.RECONNECTING',
  'IO.ACKNOWLEDGED',
  'IO.INITIALIZED',
  'IO.CONNECTED',
  'IO.OPENED',
  'IO.CLOSED',
  'IO.RECONNECTED',
  'IO.RECONNECT_FAILED',
  'IO.RECONNECT_ATTEMPT',
  'IO.DISCONNECTED',
  'IO.DESTROYED'
],[
  INITIALIZE,
  TIMEOUT,
  ERROR,
  EVENT,
  MESSAGE,
  EMIT,
  SEND,
  RECONNECTING,
  ACKNOWLEDGED,
  INITIALIZED,
  CONNECTED,
  OPENED,
  CLOSED,
  RECONNECTED,
  RECONNECT_FAILED,
  RECONNECT_ATTEMPT,
  DISCONNECTED,
  DESTROYED
] = CONSTANTS;

function CREATE_SOCKET_ACTION (url, options, callback = () => undefined) {
  return (dispatch, getState) => {
    const state = getState().socket;
    if (url in state) return state[url].connect();

    const socket = io.connect(url, state.options);

    socket.on('connect', () => dispatcher(CONNECTED))
    .on('disconnect', () => dispatcher(DISCONNECTED))
    .on('reconnect', count => dispatcher(RECONNECTED, { count }))
    .on('reconnecting', count => dispatcher(RECONNECTING, { count }))
    .on('reconnect_attempt', () => dispatcher(RECONNECT_ATTEMPT))
    .on('reconnect_failed', () => dispatcher(RECONNECT_FAILED))
    .on('reconnect_error', error => dispatcher(ERROR, { error }))
    .on('error', error => dispatcher(ERROR, { error }))
    .on('connect_error', error => dispatcher(ERROR, { error }))
    .on('connect_timeout', () => dispatcher(TIMEOUT))
    .on('event', event => dispatcher(EVENT, { event }))
    .on('message', message => dispatcher(MESSAGE, { data: JSON.parse(message) }));

    callback(socket, dispatch);

    return dispatcher(INITIALIZED, {
      actions: {
        send (data, fn) {
          return dispatch(dispatch => socket.send(JSON.stringify(data), acknowledge(fn, 'message', dispatch)));
        },
        emit (event, data, fn) {
          return dispatch(dispatch => socket.emit(event, JSON.stringify(data), acknowledge(fn, event, dispatch)));
        },
        open() { return socket.open(); },
        close() { return socket.close(); },
        connect() { return socket.connect(); },
        disconnect() { return socket.disconnect(); },
        destroy() { return dispatcher(DESTROYED); }
      }
    });
    function dispatcher (type, o = {}) {
      const { connected, disconnected, id = null, nsp: ns } = socket;
      return dispatch({ type, ns, socket: {connected, disconnected, id, socket}, ...o });
    }
    function acknowledge (fn = data => console.log(data), event, dispatch) {
      return message => {
        const data = JSON.parse(message);
        dispatcher(ACKNOWLEDGED, { event });
        return fn(data);
      }
    }
  };
}

export const ACTIONS = {
  connect: CREATE_SOCKET_ACTION
};

export default function redux_io (io, options = { transports: ['websocket'] }) {
  return function socketReducer (state = {
    io, options, namespaces: [], rooms: [], errors: []
  }, action) {
    const { type, ns, socket, actions, count, error } = action;
    const nextState = (next = {}, nextNS = {}) => ({
      ...state, [ns]: {...(state[ns] || {}), ...socket, ...nextNS}, ...next
    });

    switch(type) {
      default: return state;
      case INITIALIZED: return nextState({ namespaces: [...state.namespaces, ns] }, {...actions, ns});
      case OPENED: return nextState();
      case CONNECTED: return nextState();
      case RECONNECTED: return nextState();
      case CLOSED: return nextState();
      case DISCONNECTED: return nextState();
      case DESTROYED: {
        delete state[ns];
        return nextState({ namespaces: state.namespaces.filter(nsp => nsp === ns ? false : true) });
      }
      case TIMEOUT: return nextState();
      case ERROR: return nextState({ errors: [...state.errors, error] });
    }
  };
}
