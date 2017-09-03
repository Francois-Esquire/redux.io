import test from 'ava';
import socketIO from 'socket.io';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';

const PORT = 8080;

const messages = [];

test.before('Server Setup', () => {
  const io = socketIO().listen(PORT);

  io.sockets.on('connection', function (socket) {
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

  var chat = io.of('/chat');

  chat.on('connection', function (socket) {
    function createMessage(by, content, channel) {
      return {
        id: [0,0,0,0].map(n => `${Math.random()}`).join(':'),
        by,
        content,
        channel,
      };
    }

    socket.emit('messages', { messages });

    socket.on('message:send', function ({ whoami, content, channel }) {
      const fn = arguments[arguments.length - 1];
      const message = createMessage(whoami, content, channel);
      socket.to(channel).emit('message:new', { message });
      if (fn && typeof fn === 'function') fn({ message });
    });

    socket.on('typing:state', function (typing, whoami) {
      socket.broadcast.to(channel).emit('typing', { typing, user: whoami });
    });

    socket.on('channel', function (channel, whoami) {
      socket.join(channel);
      socket.to(channel).emit('channel:join', whoami);
      socket.emit('messages', {
        messages: messages.filter(m => m.channel === channel)
      });
    });
    socket.on('channel:change', function (next, channel, whoami) {
      socket.leave(channel);
      socket.to(channel).emit('channel:leave', whoami);
      socket.join(next);
      socket.to(next).emit('channel:join', whoami);
    });

    socket.on('disconnect', function() {
      console.log('socket.on("disconnect")', arguments);
    });
  });
});

const { default: reduxIo, connect: connectIo, CONSTANTS } = require('../dist/redux.io.js');
const client = require('socket.io-client');

const socketURL = `http://0.0.0.0:${PORT}`;
const chatURL = `${socketURL}/chat`;
const users = ['cindy', 'deja', 'alfred', 'genevieve', 'teddy'];
const topics = ['art', 'tech', 'poetry', 'node.js', 'socket.io', 'music'];
const clients = {};

test.before('Client Setup', () => {
  users.forEach(whoami => {
    const socket = reduxIo(client, {});

    const reducers = combineReducers({
      socket: socket.reducer,
      whoami: (state = whoami, action) => state,
      channel: (state = '/', action) => {
        switch (action.type) {
          default: return state;
          case 'channel': return action.channel;
        }
      },
      party: (state = [], action) => {
        switch (action.type) {
          default: return state;
          case 'party:reset': return [];
          case 'party:join': return state.concat(action.member);
          case 'party:leave': return state.filter(m => m !== action.member);
        }
      },
      typing: (state = [], action) => {
        switch (action.type) {
          default: return state;
          case 'typing:reset': return [];
          case 'typing:true': return state.concat(action.member);
          case 'typing:false': return state.filter(m => m !== action.member);
        }
      },
      messages: (state = [], action) => {
        switch (action.type) {
          default: return state;
          case 'message:add': return state.concat(action.message);
          case 'message:remove': return state.filter(m => m.id !== action.message.id);
          case 'message:replace': return action.messages;
        }
      },
    });

    const logger = store => next => action => {
      console.info('dispatching: ', action.type);
      console.log(action);
      return next(action);
    };

    const test = type => /^@@io/.test(type);
    const createReducer = reducer => (state, action) => {
      if (test(action.type)) console.log('dispatch called');
      return reducer(state, action);
      // test(action.type) ?
      //   Object.assign({}, state, { socket: state.socket(state, action) }) :
      //   Object.assign({}, { socket: state.socket() }, reducer(state, action));
    }
    const store = createStore(
      reducers,
      compose(
        (createStore) => (reducer, preloadedState, enhancer) => {
          console.log(reducer, preloadedState, enhancer);
          const store = createStore(createReducer(reducer), preloadedState, enhancer);
          return Object.assign({}, store, {
            dispatch: (action) => store.dispatch(action),
          });
        },
        applyMiddleware(logger, socket.middleware)
      )
    );

    function connect(ns, opts) {
      console.log(ns, opts);
      return store.dispatch(connectIo(ns, opts))
    }

    clients[whoami] = {
      store,
      connect,
      actions: {
        channel: (channel) => channel && store.dispatch({ type: 'channel', channel }),
        party: {
          reset: () => store.dispatch({ type: 'party:reset' }),
          join: (member) => store.dispatch({ type: 'party:join', member }),
          leave: (member) => store.dispatch({ type: 'party:leave', member }),
        },
        typing: {
          reset: () => store.dispatch({ type: 'typing:reset' }),
          yes: (member) => store.dispatch({ type: 'typing:true', member }),
          no: (member) => store.dispatch({ type: 'typing:false', member }),
        },
      },
    };
  });
});

test('connect:action', t => {
  t.deepEqual(connectIo(socketURL), {
    type: CONSTANTS[0],
    ns: socketURL,
    options: undefined,
  });
});

test.cb('socket:connect', t => {
  users.forEach((whoami, i) => {
    if (i > 0) return;
    const { store, connect } = clients[whoami];
    const { socket } = store.getState();

    connect(socketURL);

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
});

test.cb('socket:listening', t => {
  users.forEach((whoami, i) => {
    if (i !== 0) return;
    const { store, connect } = clients[whoami];
    const { socket } = store.getState();

    socket[socketURL].emit('hey', 'wassup');

    socket[socketURL].on('hey', function (dispatch, socket, hey, there) {
      return t.end();
    });
  });
});

test.after.cb('socket:disconnect', t => {
  users.forEach((whoami, i) => {
    if (i !== 0) return;
    const { store, connect } = clients[whoami];
    const { socket } = store.getState();

    socket[socketURL].on('disconnect', () => {
      console.log('disconnecting');
      t.end();
    });

    socket[socketURL].close();
  });
});

test.after('socket:destroy', t => {
  users.forEach((whoami, i) => {
    if (i !== 0) return;
    const { store, connect } = clients[whoami];
    const { socket } = store.getState();

    socket[socketURL].destroy();
  });
});
