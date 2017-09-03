/* eslint import/no-extraneous-dependencies: 0 */
import { createStore, combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import io from 'socket.io-client';

import reducers from './reducers';

import { reducer as socketio } from '../../dist/redux.io.es';

const socket = socketio(io);

export default function configureStore(state) {
  const initialState = state || undefined;
  const rootReducer = combineReducers(Object.assign(reducers, { socket, form }));

  if (process.env.NODE_ENV !== 'production') {
    const store = createStore(rootReducer, initialState);

    if (module && module.hot) {
      module.hot.accept('./reducers', () => {
        const nextReducers = require('./reducers').default;
        const nextRootReducer = combineReducers(Object.assign(nextReducers, { socket, form }));

        store.replaceReducer(nextRootReducer);
      });
    }

    return store;
  }

  return createStore(rootReducer, initialState);
}
