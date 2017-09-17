/* eslint import/no-extraneous-dependencies: 0 */
import { createStore, combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import io from 'socket.io-client';

import reducers from './reducers';

import { reducer as socketio } from 'redux.io';

const socket = socketio(io);

export default function configureStore(state) {
  const initialState = state || undefined;
  const rootReducer = combineReducers(Object.assign(reducers, { socket, form }));

  if (process.env.NODE_ENV !== 'production') {
    const enhancements = (
      typeof window === 'object' &&
      // eslint-disable-next-line no-underscore-dangle
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
      // eslint-disable-next-line no-underscore-dangle
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose
    )();

    const store = createStore(rootReducer, initialState, enhancements);

    if (module && module.hot) {
      module.hot.accept('./reducers', () => {
        const nextReducers = require('./reducers').default;
        const nextRootReducer = combineReducers(Object.assign(nextReducers, { socket, form }));

        store.replaceReducer(nextRootReducer);
      });
      module.hot.accept('redux.io', () => {
        const nextSocket = require('redux.io').reducer(io);
        const nextRootReducer = combineReducers(Object.assign(reducers, {
          socket: nextSocket, form,
        }));

        store.replaceReducer(nextRootReducer);
      });
    }

    return store;
  }

  return createStore(rootReducer, initialState);
}
