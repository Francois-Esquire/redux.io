import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import store from '../store';

import Application from '../components/Application';

const appElement = document.getElementById('app');

ReactDOM.hydrate(
  <Provider store={store}>
    <BrowserRouter>
      <Application />
    </BrowserRouter>
  </Provider>,
  appElement,
);
