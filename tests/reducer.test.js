import { expect, it } from 'vitest';
import { io } from 'socket.io-client';
import reducer from '../lib/reducer';
import * as types from '../lib/constants';
import { createClient } from './helpers/socket';

it('requires a callable Socket.IO factory', () => {
  for (const value of [undefined, null, {}, 'io'])
    expect(() => reducer(value)).toThrow('socket.io');
});

it('preserves state identity for unrelated and unknown socket actions', () => {
  const { client } = createClient();
  const reduce = reducer(client);
  const state = reduce(undefined, { type: 'init' });
  expect(state).toEqual({ io: client, defaults: {} });
  for (const type of [
    'other',
    '@@io/unknown',
    types.CONNECT,
    types.DISCONNECT,
    types.ON,
    types.OFF,
    types.ONCE,
  ]) {
    expect(reduce(state, { type, nsp: '/missing' })).toBe(state);
  }
  expect(reduce(state, { type: types.CONNECT, nsp: 'io' })).toBe(state);
  expect(client).not.toHaveBeenCalled();
});

it('merges defaults immutably', () => {
  const { client } = createClient();
  const defaults = Object.freeze({ reconnection: false });
  const reduce = reducer(client, defaults);
  const state = Object.freeze(reduce(undefined, { type: 'init' }));
  Object.freeze(state.defaults);
  const next = reduce(state, {
    type: types.DEFAULTS,
    options: { timeout: 50 },
  });
  expect(next.defaults).toEqual({ reconnection: false, timeout: 50 });
  expect(state.defaults).toEqual({ reconnection: false });
});

it('removes all listeners for an event when OFF omits its callback', () => {
  const reduce = reducer(io, { autoConnect: false });
  const namespace = 'http://localhost/chat';
  const state = reduce(undefined, { type: types.CREATE, nsp: namespace });
  const socket = state[namespace];
  const first = () => {};
  const second = () => {};
  try {
    socket.on('hello', first).on('hello', second).on('other', first);
    expect(socket.listeners('hello')).toEqual([first, second]);
    expect(
      reduce(state, { type: types.OFF, nsp: namespace, event: 'hello' }),
    ).toBe(state);
    expect(socket.listeners('hello')).toEqual([]);
    expect(socket.listeners('other')).toEqual([first]);
  } finally {
    socket.removeAllListeners();
    socket.disconnect();
  }
});

it('creates once and operates on the returned socket using public methods', () => {
  const { client, sockets } = createClient();
  const reduce = reducer(client, { timeout: 50 });
  const state = reduce(undefined, {
    type: types.CREATE,
    nsp: '/chat',
    options: { timeout: 100 },
  });
  expect(client).toHaveBeenCalledWith('/chat', { timeout: 100 });
  expect(reduce(state, { type: types.CREATE, nsp: '/chat' })).toBe(state);
  expect(client).toHaveBeenCalledTimes(1);
  reduce(state, { type: types.CONNECT, nsp: '/chat' });
  expect(sockets[0].open).toHaveBeenCalledOnce();
  reduce(state, { type: types.DISCONNECT, nsp: '/chat' });
  expect(sockets[0].close).toHaveBeenCalledOnce();
  let calls = 0;
  const callback = () => {
    calls += 1;
  };
  reduce(state, { type: types.ON, nsp: '/chat', event: 'hello', callback });
  sockets[0].receive('hello');
  reduce(state, { type: types.OFF, nsp: '/chat', event: 'hello', callback });
  sockets[0].receive('hello');
  reduce(state, { type: types.ONCE, nsp: '/chat', event: 'hello', callback });
  sockets[0].receive('hello');
  sockets[0].receive('hello');
  expect(calls).toBe(2);
});
