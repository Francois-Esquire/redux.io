'use strict';

import { routerReducer as routing, routerMiddleware } from 'react-router-redux';
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunk from 'redux-thunk';

import redux_io from './../redux.io';

export default function configureStore(state, { history, middleware = {} }) {
  const reducers = combineReducers({
    socket: redux_io(io), routing
  });

  const createEnhancedStore = applyMiddleware(
    routerMiddleware(history), ...middleware, thunk
  )(createStore);

  return createEnhancedStore(
    reducers, state
  );
}
