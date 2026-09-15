import React from 'react';
import { afterEach, beforeEach, expect, test } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { io, type Socket } from 'socket.io-client';
import type { AddressInfo } from 'node:net';
import { createDemoServer } from '../examples/server.js';
import { ReduxChat } from '../examples/ReduxChat.js';
import { ReactChat } from '../examples/ReactChat.js';
import { App } from '../examples/App.js';
import type {
  ClientEvents,
  ServerEvents,
  SendResult,
} from '../examples/events.js';

let server: ReturnType<typeof createDemoServer>;
let peer: Socket<ServerEvents, ClientEvents>;
let url: string;

beforeEach(async () => {
  server = createDemoServer();
  await new Promise<void>(resolve =>
    server.http.listen(0, '127.0.0.1', resolve),
  );
  url = `http://127.0.0.1:${(server.http.address() as AddressInfo).port}`;
  peer = io(url, { transports: ['websocket'], autoConnect: false });
});

afterEach(async () => {
  peer.disconnect();
  await new Promise<void>(resolve => server.io.close(() => resolve()));
});

test.each([
  ['Redux', ReduxChat],
  ['React', ReactChat],
] as const)(
  '%s client drives chat, acknowledgements and reconnection',
  async (_name, Client) => {
    const view = render(<Client url={url} />);
    await screen.findByRole('button', { name: 'Disconnect' });
    await act(async () => {
      await new Promise<void>(resolve =>
        peer.once('connect', resolve).connect(),
      );
    });
    await screen.findByText('Connected · 2 online');
    const broadcast = new Promise<string>(resolve =>
      peer.once('message', message => resolve(message.text)),
    );
    fireEvent.change(screen.getByLabelText('Message'), {
      target: { value: 'Hello from TypeScript' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Send' }));
    await screen.findByText('Delivered');
    expect(await broadcast).toBe('Hello from TypeScript');
    expect(screen.getByText('Hello from TypeScript')).toBeTruthy();
    expect(screen.getByLabelText<HTMLInputElement>('Message').value).toBe('');
    fireEvent.click(screen.getByRole('button', { name: 'Disconnect' }));
    expect(
      screen.getByRole<HTMLButtonElement>('button', { name: 'Send' }).disabled,
    ).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'Connect' }));
    await screen.findByRole('button', { name: 'Disconnect' });
    await waitFor(() =>
      expect(screen.getAllByText('Hello from TypeScript')).toHaveLength(1),
    );
    view.unmount();
    await waitFor(() => expect(server.io.engine.clientsCount).toBe(1));
  },
);

test('switching clients keeps one connection and replays the same history', async () => {
  const view = render(<App url={url} />);
  await screen.findByRole('button', { name: 'Disconnect' });
  fireEvent.change(screen.getByLabelText('Message'), {
    target: { value: 'Shared across clients' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Send' }));
  await screen.findByText('Delivered');
  for (const name of ['React only', 'Redux Toolkit', 'React only']) {
    fireEvent.click(screen.getByRole('button', { name: new RegExp(name) }));
    await screen.findByRole('button', { name: 'Disconnect' });
    await screen.findByText('Shared across clients');
    await waitFor(() => expect(server.io.engine.clientsCount).toBe(1));
  }
  view.unmount();
  await waitFor(() => expect(server.io.engine.clientsCount).toBe(0));
});

test('the server validates input and replays recent history', async () => {
  await new Promise<void>(resolve => peer.once('connect', resolve).connect());
  const send = (text: string) =>
    new Promise<SendResult>(resolve => peer.emit('chat:send', text, resolve));
  expect(await send('   ')).toEqual({
    ok: false,
    error: 'Enter between 1 and 500 characters.',
  });
  expect(await send('x'.repeat(501))).toMatchObject({ ok: false });
  expect(await send('  saved  ')).toMatchObject({ ok: true });
  peer.disconnect();
  const history = new Promise<string[]>(resolve =>
    peer.once('history', messages =>
      resolve(messages.map(message => message.text)),
    ),
  );
  peer.connect();
  expect(await history).toEqual(['saved']);
});
