import { createStore, combineReducers } from 'redux';

import reducer from '../../lib/reducer';

export default function setupStore(io) {
  const rootReducer = combineReducers({
    socket: reducer(io),
  });

  return createStore(rootReducer);
}
