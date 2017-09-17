import test from 'ava';
import { shallow, mount, render } from 'enzyme';

import React from 'react';
import { createStore, combineReducers, bindActionCreators } from 'redux';
import socketIO from 'socket.io-client';

import { reducer as reduxIo } from '../lib/reducer';
import { withSocket } from '../lib/withSocket';

let server;
let store;
let actions;

test.before(() => { server = require('socket.io')().listen(3002); });
test.after(() => server && server.close());
test.before(() => {
  const reducer = combineReducers({
    socket: reduxIo(socketIO, {
      transports: ['websocket', 'polling'],
    }),
  });

  store = createStore(reducer);

  actions = bindActionCreators({
    connect(ns) {
      return { type: '@@io/create', ns };
    },
  }, (action) => {
    store.dispatch(action);
    return store.getState().socket.io.connect(`localhost:3002${action.ns}`);
  });
});

test('Ping Button', (t) => {
  const ns = '/flow';

  const PingButton = (props) => {
    const { socket } = props;
    console.log(props);
    return (<button onClick={() => socket.emit('ping')}>Ping</button>);
  };

  const Ping = withSocket(`http://localhost:3002${ns}`, () => ({}))(PingButton, { alias: 'Ping' });

  const wrapper = render((<Ping
    store={store}
    path="/"
    autoConnect
    reconnection
    onSubmit={event => console.log(event)}
    onPong={(dispatch, socket, latency) => console.log(latency)}
    onConnect={(dispatch, socket) => {
      console.log('connected');
      socket.emit('ping');
    }} />));

  // console.log(wrapper.props(), wrapper.instance().state);
  console.log(wrapper.text());
  t.is(wrapper.text(), wrapper.text());
});

test.todo('wrapped component testing');
