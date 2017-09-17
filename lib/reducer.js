class Reducer {
  constructor(io, defaults = {}) {
    const initialState = {
      io,
      defaults,
    };

    return function reducer(state = initialState, action = {}) {
      if (/^@@io\//.test(action.type)) {
        const { type, ns, socket } = action;

        switch (type) {
          default: return state;
          case '@@io/create': {
            return Object.assign({}, state, { [ns]: socket });
          }
          case '@@io/dismount': {
            const socket = state[ns];
            if (socket.connected) socket.close();
            return Object.assign({}, state);
          }
        }
      } return state;
    };
  }
}

// eslint-disable-next-line import/prefer-default-export
export function reducer(io = null, options) {
  // eslint-disable-next-line no-param-reassign
  if (io === null) io = window.io;
  if (!io) throw new Error('You must pass in a client.');

  return new Reducer(io, options);
}
