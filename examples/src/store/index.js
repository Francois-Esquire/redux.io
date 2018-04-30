import { createStore, combineReducers } from 'redux';

import { reducer as socket } from '../../../dist/redux.io.es';

const combinedReducers = combineReducers({
  socket: socket(window.io),
});

const store = createStore(combinedReducers);

export default store;
