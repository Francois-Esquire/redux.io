import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import configureStore from './store';
import Application from './components/Application';

(function startup(store) {
  const appElement = document.getElementById('root');

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line import/no-extraneous-dependencies
    const { AppContainer } = require('react-hot-loader');

    let App = Application;

    const renderApp = () => render(<AppContainer>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </AppContainer>, appElement);

    if (module && module.hot) {
      module.hot.accept('./components/Application', () => {
        App = require('./components/Application').default;
        renderApp();
      });
    }

    renderApp();
  } else {
    render(<Provider store={store}>
      <BrowserRouter>
        <Application />
      </BrowserRouter>
    </Provider>, appElement);
  }
}(configureStore()));
