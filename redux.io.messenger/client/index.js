/* eslint import/no-extraneous-dependencies: 0 */
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import configureStore from './store';
import Application from './components/Application';

const store = configureStore();

ReactDOM.render(<Provider store={store}>
  <BrowserRouter>
    <Application />
  </BrowserRouter>
</Provider>, document.getElementById('root'));
