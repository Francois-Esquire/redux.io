import test from 'ava';

import { createStore, combineReducers, bindActionCreators } from 'redux';
import socketIO from 'socket.io-client';

import { reducer as reduxIo } from '../lib/reducer';

let server;
let store;
let actions;

test.before(() => { server = require('socket.io')().listen(3000); });
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
      const socket = store.getState().socket.io.connect(`localhost:3000${ns}`);
      return { type: '@@io/create', ns, socket };
    },
    dismount(ns) {
      return { type: '@@io/dismount', ns };
    },
  }, (action) => {
    store.dispatch(action);
    switch (action.type) {
      default: return null;
      case '@@io/create': return action.socket;
    }
  });
});

test('connect to namespace', (t) => {
  const ns = '/chat';

  const socket = actions.connect(ns);

  const currentState = store.getState().socket;

  t.is(currentState[ns], socket);
});

test('dismount from namespace', (t) => {
  const ns = '/chat';

  actions.dismount(ns);

  const currentState = store.getState().socket;
  t.is(currentState[ns].connected, false);
});
