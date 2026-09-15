import React, { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import { Server } from 'socket.io';
import { useSocket, type SocketOptions } from '../lib/react.js';

let http: ReturnType<typeof createServer>;
let server: Server;
let url: string;
const options: SocketOptions = {
  transports: ['websocket'],
  reconnectionDelay: 10,
  reconnectionDelayMax: 10,
};

beforeEach(async () => {
  http = createServer();
  server = new Server(http);
  server.on('connection', socket => {
    socket.on('echo', (value, ack) => ack(value));
  });
  await new Promise<void>(resolve => http.listen(0, '127.0.0.1', resolve));
  url = `http://127.0.0.1:${(http.address() as AddressInfo).port}`;
});

afterEach(async () => {
  await new Promise<void>(resolve => server.close(() => resolve()));
});

test('connects without a Provider, acknowledges events, reconnects and cleans up', async () => {
  const { result, unmount, rerender } = renderHook(
    () => useSocket(url, options),
    { wrapper: StrictMode },
  );
  await waitFor(() => expect(result.current.connected).toBe(true));
  const client = result.current.socket!;
  expect(result.current.id).toBe(client.id);
  expect(result.current.error).toBeNull();
  rerender();
  expect(result.current.socket).toBe(client);
  expect(await client.emitWithAck('echo', 'hello')).toBe('hello');
  act(() => client.disconnect());
  expect(result.current.connected).toBe(false);
  expect(result.current.id).toBeUndefined();
  act(() => {
    client.connect();
  });
  await waitFor(() => expect(result.current.connected).toBe(true));
  const previousId = client.id;
  await act(async () => {
    const disconnected = new Promise<void>(resolve =>
      client.once('disconnect', () => resolve()),
    );
    server.sockets.sockets.get(client.id!)!.conn.close();
    await disconnected;
  });
  await waitFor(() => {
    expect(result.current.connected).toBe(true);
    expect(result.current.id).not.toBe(previousId);
  });
  const listener = vi.fn();
  client.on('hello', listener);
  unmount();
  expect(client.connected).toBe(false);
  expect(client.listeners('hello')).toHaveLength(0);
  expect(client.listeners('connect')).toHaveLength(0);
  await waitFor(() => expect(server.engine.clientsCount).toBe(0));
});

test('supports manual connections and replaces sockets on URL or options changes', async () => {
  const manual: SocketOptions = { ...options, autoConnect: false };
  server.of('/next');
  const { result, rerender, unmount } = renderHook(
    ({ address, settings }) => useSocket(address, settings),
    { initialProps: { address: url, settings: manual } },
  );
  const first = result.current.socket!;
  expect(result.current.connected).toBe(false);
  expect(first.active).toBe(false);
  act(() => {
    first.connect();
  });
  await waitFor(() => expect(result.current.connected).toBe(true));
  rerender({ address: `${url}/next`, settings: manual });
  expect(first.connected).toBe(false);
  expect(result.current.socket).not.toBe(first);
  expect(result.current.connected).toBe(false);
  expect(result.current.id).toBeUndefined();
  const second = result.current.socket!;
  rerender({ address: `${url}/next`, settings: options });
  expect(result.current.socket).not.toBe(second);
  await waitFor(() => expect(result.current.connected).toBe(true));
  unmount();
});

test('exposes connection errors and clears them after recovery', async () => {
  server.use((socket, next) =>
    next(
      socket.handshake.auth.token === 'valid'
        ? undefined
        : new Error('Unauthorized'),
    ),
  );
  const { result, unmount } = renderHook(() => useSocket(url, options));
  await waitFor(() =>
    expect(result.current.error?.message).toBe('Unauthorized'),
  );
  expect(result.current.connected).toBe(false);
  act(() => {
    result.current.socket!.auth = { token: 'valid' };
    result.current.socket!.connect();
  });
  await waitFor(() => expect(result.current.connected).toBe(true));
  expect(result.current.error).toBeNull();
  unmount();
});

test('uses default options and has an inert server-rendered initial state', async () => {
  function View() {
    const state = useSocket();
    expect(state).toEqual({
      socket: null,
      connected: false,
      id: undefined,
      error: null,
    });
    return <span>offline</span>;
  }
  expect(renderToString(<View />)).toBe('<span>offline</span>');
  const { result, unmount } = renderHook(() => useSocket(url));
  await waitFor(() => expect(result.current.connected).toBe(true));
  unmount();
});
