import {
  CREATE,
  CONNECT,
  DISCONNECT,
  ON,
  OFF,
  ONCE,
  DEFAULTS,
} from './constants';

export default function reducer(io, defaults = {}) {
  if (typeof io !== 'function') {
    throw new Error(
      'Please make sure you are passing in socket.io to the reducer.',
    );
  }

  const initialState = { io, defaults: { ...defaults } };

  return function socketReducer(state = initialState, action) {
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
        const socket = Object.hasOwn(state, nsp) ? state[nsp] : undefined;
        if (!socket || nsp === 'io' || nsp === 'defaults') return state;
        if (type === CONNECT) socket.open();
        else if (type === DISCONNECT) socket.close();
        else {
          const method = { [ON]: 'on', [OFF]: 'off', [ONCE]: 'once' }[type];
          if (action.callback === undefined) socket[method](action.event);
          else socket[method](action.event, action.callback);
        }
        return state;
      }
      default:
        return state;
    }
  };
}
