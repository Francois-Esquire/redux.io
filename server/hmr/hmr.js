'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory as history } from 'react-router';

import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { routerReducer as routing, routerMiddleware, syncHistoryWithStore } from 'react-router-redux';

import { AppContainer } from 'react-hot-loader';

import { createDevTools, persistState } from 'redux-devtools';
import Dispatch from 'redux-devtools-dispatch';
import LogMonitor from 'redux-devtools-log-monitor';
import MultipleMonitors from 'redux-devtools-multiple-monitors';
import DockMonitor from 'redux-devtools-dock-monitor';

import './../../src/styles/index.css';
import Root from './../../src/components/Root.jsx';

const logger = createLogger();

const DevTools = createDevTools(
  <DockMonitor toggleVisibilityKey='ctrl-h'
    changePositionKey='ctrl-q'
    defaultIsVisible={false}>
    <MultipleMonitors>
      <LogMonitor theme='tomorrow' />
      <Dispatch />
    </MultipleMonitors>
  </DockMonitor>
);

function root (state = {}, action) {
  return state;
}

const createEnhancedStore = compose(
  applyMiddleware(
    routerMiddleware(history),
    thunk,
    logger
  ),
  DevTools.instrument()
)(createStore);

const reducers = combineReducers({ root, routing });

const store = createEnhancedStore(
  reducers,
  __INITIAL_STATE__
);

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

  //   module.hot.accept('./../../src/store/reducers/index.js', id => {
  //     const nextRootReducer = require('./../../src/store/reducers/index.js').default;
  //     store.replaceReducer(combineReducers({ ...nextRootReducer, routing }));
  //   });
}

render(Root, store, story);
