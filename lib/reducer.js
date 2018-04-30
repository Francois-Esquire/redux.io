import {
  prefix,
  CREATE,
  CONNECT,
  DISCONNECT,
  ON,
  OFF,
  ONCE,
  DEFAULTS,
} from './constants';

export default function reducer(io, defaults) {
  if (io === undefined)
    throw new Error(
      'Please make sure you are passing in socket.io to the reducer.',
    );

  const initialState = {
    io,
    defaults,
  };

  const regexp = new RegExp(`^${prefix}\/`);

  return function socketReducer(state = initialState, action) {
    if (regexp.test(action.type)) {
      const { type, nsp, uri } = action;

      switch (type) {
        default:
          return state;
        case CREATE: {
          const { options } = action;

          const socket = io.connect(nsp, options);

          return Object.assign({}, state, { [nsp]: socket });
        }
        case CONNECT: {
          const manager = io.managers[uri.replace(nsp)];
          const socket = manager.nsps[nsp];

          if (socket) socket.open();

          break;
        }
        case DISCONNECT: {
          const manager = io.managers[uri.replace(nsp)];
          const socket = manager.nsps[nsp];

          if (socket && socket.connected) socket.close();

          break;
        }
        case ON:
        case OFF:
        case ONCE: {
          const manager = io.managers[uri.replace(nsp)];
          const socket = manager.nsps[nsp];

          if (socket) {
            const { event, callback } = action;
            switch (type) {
              default:
                break;
              case ON:
                socket.on(event, callback);
                break;
              case OFF:
                socket.off(event, callback);
                break;
              case ONCE:
                socket.once(event, callback);
                break;
            }
          }
          break;
        }
        case DEFAULTS: {
          const { options } = action;

          Object.assign(state.defaults, options);

          break;
        }
      }

      return Object.assign({}, state);
    }
    return state;
  };
}
