import { createServer } from 'node:http';
import React from 'react';
import { Server } from 'socket.io';
import { io } from 'socket.io-client';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { withSocket } from '../lib';

let server;
let url;
let peers;
let clients;

beforeEach(async () => {
  const httpServer = createServer();
  server = new Server(httpServer);
  peers = [];
  clients = [];
  server.of('/chat').on('connection', socket => {
    peers.push(socket);
    socket.on('echo', (payload, acknowledge) =>
      acknowledge({ received: payload }),
    );
    socket.on('message', payload => socket.emit('message', payload));
  });
  await new Promise((resolve, reject) => {
    httpServer.once('error', reject);
    httpServer.listen(0, '127.0.0.1', resolve);
  });
  url = 'http://127.0.0.1:' + httpServer.address().port;
});

afterEach(async () => {
  cleanup();
  for (const client of clients) client.disconnect();
  if (server) await new Promise(resolve => server.close(resolve));
});

function mountSocket(props = {}, options = {}, namespace = '/chat') {
  let api;
  const store = configureStore({
    reducer: (state = { messages: [] }, action) =>
      action.type === 'message'
        ? { messages: [...state.messages, action.payload] }
        : state,
  });
  const client = (address, settings) => {
    const socket = io(address, settings);
    clients.push(socket);
    return socket;
  };
  const Wrapper = withSocket(url + namespace, {
    transports: ['websocket'],
    forceNew: true,
    reconnectionDelay: 10,
    reconnectionDelayMax: 10,
    randomizationFactor: 0,
    ...options,
  })(
    function Status({ socket }) {
      api = socket;
      return React.createElement(
        'span',
        { 'data-testid': 'connection' },
        String(socket.connected),
      );
    },
    { io: client },
  );
  const view = render(
    React.createElement(
      Provider,
      { store },
      React.createElement(Wrapper, { closeOnUnmount: true, ...props }),
    ),
  );
  return {
    store,
    view,
    get api() {
      return api;
    },
  };
}

it('exchanges payloads and acknowledgements with a Socket.IO 4 server', async () => {
  const acknowledgement = vi.fn();
  let dispatch;
  const app = mountSocket({
    onMount: storeDispatch => {
      dispatch = storeDispatch;
    },
    onMessage: payload => dispatch({ type: 'message', payload }),
  });
  await waitFor(() =>
    expect(screen.getByTestId('connection').textContent).toBe('true'),
  );
  expect(app.api.nsp).toBe('/chat');
  expect(app.api.id).toBe(peers[0].id);
  act(() => app.api.emit('echo', { value: 42 }, acknowledgement).send('hello'));
  await waitFor(() =>
    expect(acknowledgement).toHaveBeenCalledWith({ received: { value: 42 } }),
  );
  await waitFor(() => expect(app.store.getState().messages).toEqual(['hello']));
  app.view.unmount();
  await waitFor(() => expect(peers[0].connected).toBe(false));
});

it('buffers an emission until an explicit connection and supports manual reconnect', async () => {
  const acknowledgement = vi.fn();
  const app = mountSocket(
    {
      onMount: (dispatch, socket) =>
        socket.emit('echo', 'buffered', acknowledgement),
    },
    { autoConnect: false },
  );
  expect(app.api.connected).toBe(false);
  expect(peers).toHaveLength(0);
  act(() => app.api.connect());
  await waitFor(() =>
    expect(acknowledgement).toHaveBeenCalledWith({ received: 'buffered' }),
  );
  await waitFor(() => expect(app.api.connected).toBe(true));
  act(() => app.api.disconnect());
  await waitFor(() => expect(app.api.connected).toBe(false));
  expect(app.api.id).toBeUndefined();
  act(() => app.api.connect());
  await waitFor(() => expect(app.api.connected).toBe(true));
  expect(acknowledgement).toHaveBeenCalledOnce();
});

it('reconnects after transport loss without duplicating listeners', async () => {
  const onConnect = vi.fn();
  const onReconnect = vi.fn();
  const onDisconnect = vi.fn();
  const onMessage = vi.fn();
  const app = mountSocket({ onConnect, onReconnect, onDisconnect, onMessage });
  await waitFor(() => expect(onConnect).toHaveBeenCalledOnce());
  const originalId = app.api.id;
  await act(async () => {
    peers[0].conn.close();
  });
  await waitFor(() => expect(onConnect).toHaveBeenCalledTimes(2));
  expect(onDisconnect).toHaveBeenCalledOnce();
  expect(onReconnect).toHaveBeenCalledOnce();
  expect(app.api.id).not.toBe(originalId);
  peers.at(-1).emit('message', 'after reconnect');
  await waitFor(() =>
    expect(onMessage).toHaveBeenCalledExactlyOnceWith('after reconnect'),
  );
});

it('reports namespace authentication failures', async () => {
  server.of('/private').use((socket, next) => next(new Error('Access denied')));
  const onConnectError = vi.fn();
  const onError = vi.fn();
  const app = mountSocket({ onConnectError, onError }, {}, '/private');
  await waitFor(() => expect(onConnectError).toHaveBeenCalledOnce());
  expect(onConnectError.mock.calls[0][2].message).toBe('Access denied');
  expect(onError).toHaveBeenCalledOnce();
  expect(app.api.connected).toBe(false);
});
