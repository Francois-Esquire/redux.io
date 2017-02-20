'use strict';

import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory as history } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import Root from './components';
import configStore from './store';
import './styles/index.css';

const store = configStore((__INITIAL_STATE__), { history });

const story = syncHistoryWithStore(history, store);

ReactDOM.render(<Root store={store} history={story} />, document.getElementById('app'));
