'use strict';

import { routerReducer as routing, routerMiddleware } from 'react-router-redux';
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunk from 'redux-thunk';

function root (state, action) {
  return state;
}

export default function configureStore(state, { history, middleware = {} }) {
  const reducers = combineReducers({ ...root, routing });

  const createEnhancedStore = applyMiddleware(
    routerMiddleware(history), ...middleware, thunk
  )(createStore);

  return createEnhancedStore(
    reducers, state
  );
}
