'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory as history } from 'react-router';

import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { routerReducer as routing, routerMiddleware, syncHistoryWithStore } from 'react-router-redux';

import { AppContainer } from 'react-hot-loader';

import './../../src/styles/index.css';
import Root from './../../src/components/Root.jsx';
import redux_io from './../../src/redux.io';
import DevTools from './devtools.js';

const logger = createLogger();

const createEnhancedStore = compose(
  applyMiddleware(
    routerMiddleware(history),
    thunk,
    logger
  ),
  DevTools.instrument()
)(createStore);

const reducers = combineReducers({ socket: redux_io(io), routing });

const store = createEnhancedStore(reducers);

const appElement = document.getElementById('app');

const story = syncHistoryWithStore(history, store);

function render (App, store, history) {
  return ReactDOM.render(
    <AppContainer key={Math.random()}>
      <div>
        <App store={store} history={history} />
        <DevTools store={store} />
      </div>
    </AppContainer>,
    appElement
  );
}

if (module.hot) {
  module.hot.accept('./../../src/components/Root.jsx', () => {
    const nextRoot = require('./../../src/components/Root.jsx').default;
    render(nextRoot, store, story);
  });

  module.hot.accept('./../../src/redux.io/io', () => {
    const nextIO = require('./../../src/redux.io/io').default;
    const reducers = combineReducers({ socket: nextIO(io), routing });
    store.replaceReducer(reducers);
  });
}

render(Root, store, story);
