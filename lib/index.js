import CONSTANTS from './constants';
import Reducer from './reducer';
import configureSocketMiddleware from './middleware';

const connect = (ns, options) => ({ type: CONSTANTS[0], ns, options });

export { CONSTANTS, connect };

export default function redux_io (io, extensions) {
  'use strict';

  if (!io) throw new Error('You must pass in a client.');

  const reducer = new Reducer(io, extensions);

  const middleware = configureSocketMiddleware(extensions);

  const test = type => /^@@io/.test(type);

  return {
    middleware: store => next => action => test(action.type) ?
      middleware(store, next, action) : next(action),
    reducer: (state = reducer(), action) => test(action.type) ?
      reducer(action) : state,
  };
}
