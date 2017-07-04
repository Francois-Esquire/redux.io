import test from 'ava';

import socketIO from 'socket.io';

import { createStore, combineReducers, applyMiddleware } from 'redux';
import client from 'socket.io-client';

import reduxIO, { CONSTANTS } from '../dist/redux.io.js';

const PORT = 8080;
const socketURL = `http://0.0.0.0:${PORT}`;

let io, store, connect;

test.before('Server Setup', () => {
  io = socketIO().listen(PORT);

  io.sockets.on('connection', function (socket) {
    socket.use((packet, next) => {
      // uniform distribution of event, data and ack.
      // let data;
      // const event = packet[0];
      // const fn = packet[packet.length - 1];
      // if (fn && typeof fn === 'function') {
      //   data = packet.splice(1, packet.length - 2);
      //   packet = [event, data, fn];
      // } else {
      //   data = packet.splice(1, packet.length - 1);
      //   packet = [event, data, undefined];
      // }
      // console.log(packet);
      return next();
    });

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

  connect = (ns, opts) =>
    store.dispatch({ type: CONSTANTS[0], ns, options: opts || {} });
});

// test(t => {
//   const defs = Object.keys(DEFS);
//   const keys = Object.keys(CONSTANTS).map(
//     k => CONSTANTS.indexOf(k.replace(/_/, '.')) >= 0
//   );
//
//   t.pass();
// });

test.cb('socket connection', t => {
  connect(socketURL);

  const socket = store.getState().socket;

  socket[socketURL].on('connect', () => {
    socket[socketURL].send([], () => t.end());
    socket[socketURL].send([{ new: 'data' }], (dispatch, data) => t.end());
    socket[socketURL].emit('hello', ['was gucci?', 1242354253, 'hey there']);
    socket[socketURL].emit('hello', [{ hey: 'there' }, 'how are you?'], () => t.end());
  });
});

test.cb('socket listening', t => {
  const socket = store.getState().socket;
  socket[socketURL].emit('hey', 'wassup');

  socket[socketURL].on('hey', function (dispatch, socket, hey, there) {
    console.log(arguments);
    console.log('hey fired, ', hey, there);
    return t.end();
  });
});

test.after.cb('socket disconnect', t => {
  const socket = store.getState().socket;

  socket[socketURL].on('disconnect', () => {
    console.log('disconnecting');
    t.end();
  });

  socket[socketURL].close();
});
