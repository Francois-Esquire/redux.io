import test from 'ava';

import socketIO from 'socket.io';

import { createStore, combineReducers, applyMiddleware } from 'redux';
import client from 'socket.io-client';

import reduxIO, { CONSTANTS, connect } from '../dist/redux.io.js';

const PORT = 8080;
const socketURL = `http://0.0.0.0:${PORT}`;

let io, store, conn;

const messages = [];

test.before('Server Setup', () => {
  io = socketIO().listen(PORT);

  io.sockets.on('connection', function (socket) {
    socket.emit('messages', { messages });

    socket.on('message', function () {
      const fn = arguments[arguments.length - 1];
      if (fn && typeof fn === 'function') fn({ message: 'hey' });

      // console.log('socket.on("message")', arguments);
    });

    socket.on('hey', function () {
      const fn = arguments[arguments.length - 1];
      if (fn && typeof fn === 'function') fn({ wassup: 'hey' });

      // console.log('socket.on("hey")', arguments);
      socket.emit('hey', 'I hear ya', 'from over there');
    });

    socket.on('hello', function () {
      const fn = arguments[arguments.length - 1];
      if (fn && typeof fn === 'function') fn({ wassup: 'hey' });
      // console.log('socket.on("hello")', arguments);
    });

    socket.on('disconnect', function() {
      console.log('socket.on("disconnect")', arguments);
    });
  });
});

test.before('Client Setup', () => {
  const socket = reduxIO(client, {});

  const logger = store => next => action => {
    console.info('dispatching', action)
    let result = next(action)
    return result
  };

  const reducers = combineReducers({
    socket: socket.reducer
  });

  store = createStore(
    reducers,
    applyMiddleware(logger, socket.middleware)
  );

  // console.log(store.getState().socket);

  conn = (ns, opts) =>
    store.dispatch(connect(ns, opts));
});

test('connect action', t => {
  t.deepEqual(connect(socketURL), {
    type: CONSTANTS[0],
    ns: socketURL,
    options: undefined,
  });
});

test.cb('socket:connect', t => {

  conn(socketURL);

  const socket = store.getState().socket;
  // console.log(socket);
  // console.log('hasListeners: ',socket.namespaces[socketURL].hasListeners());
  socket[socketURL].on('connect', () => {
    socket[socketURL].once('messages', (dispatch, socket, data) => {
      console.log('onMessages - data: (%s)', data);
      t.end();
    });

    socket[socketURL].send([], () => t.end());
    socket[socketURL].send([{ new: 'data' }], (dispatch, socket, data) => t.end());
    socket[socketURL].emit('hello', ['was gucci?', 1242354253, 'hey there']);
    socket[socketURL].emit('hello', [{ hey: 'there' }, 'how are you?'], () => t.end());
  });
});

test.cb('socket listening', t => {
  const socket = store.getState().socket;
  socket[socketURL].emit('hey', 'wassup');

  socket[socketURL].on('hey', function (dispatch, socket, hey, there) {
    return t.end();
  });
});

test.after.cb('socket:disconnect', t => {
  const socket = store.getState().socket;

  socket[socketURL].on('disconnect', () => {
    console.log('disconnecting');
    t.end();
  });

  socket[socketURL].close();
});

test.after('socket:destroy', t => {
  const socket = store.getState().socket;

  socket[socketURL].destroy();

  // console.log(socket.io.managers[socketURL]);
});
