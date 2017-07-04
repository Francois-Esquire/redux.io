import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import { Provider, connect } from 'react-redux';
import { createStore, combineReducers, applyMiddleware, bindActionCreators } from 'redux';
import io from 'socket.io-client';

import Application from './components/Application';

import reduxIO, { connect as connectSocket } from '../dist/redux.io';

const socket = reduxIO(io);

const store = createStore(combineReducers({
  socket: socket.reducer,
}), applyMiddleware(socket.middleware));

const RealTimeMessenger = connect(
    (state, ownProps) => Object.assign({}, state, ownProps),
    dispatch => bindActionCreators({
      connect: connectSocket
    }, dispatch))(props => (<Route
      path="/:channel"
      render={routeProps => {
        const { socket, connect } = props;
        return (<Application
          socket={socket}
          connect={connect}
          channel={routeProps.match.params.channel} />);
      }}/>));

ReactDOM.render(<Provider store={store}>
  <BrowserRouter>
    <RealTimeMessenger />
  </BrowserRouter>
</Provider>, document.getElementById('root'));
