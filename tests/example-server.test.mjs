import assert from 'node:assert/strict';
import { once } from 'node:events';
import { test } from 'node:test';
import { io } from 'socket.io-client';
import { createDemoServer } from '../examples/server.ts';
import { startDemo } from '../examples/devServer.mts';

async function connect(url, options = {}) {
  const socket = io(url, {
    transports: ['websocket'],
    reconnection: false,
    autoConnect: false,
    ...options,
  });
  const connected = new Promise((resolve, reject) => {
    socket.once('connect', resolve);
    socket.once('connect_error', reject);
  });
  socket.connect();
  try {
    await connected;
  } catch (error) {
    socket.disconnect();
    throw error;
  }
  return socket;
}

test(
  'the standalone server validates payloads, limits history, reports presence and rejects remote origins',
  { timeout: 15000 },
  async context => {
    const server = createDemoServer();
    context.after(() => new Promise(resolve => server.io.close(resolve)));
    server.http.listen(0, '127.0.0.1');
    await once(server.http, 'listening');
    const url = `http://127.0.0.1:${server.http.address().port}`;
    assert.equal((await fetch(`${url}/missing`)).status, 404);
    assert.deepEqual(await (await fetch(`${url}/api/health`)).json(), {
      status: 'ok',
      clients: 0,
      messages: 0,
    });
    await assert.rejects(
      connect(url, { extraHeaders: { Origin: 'https://remote.example' } }),
    );
    await assert.rejects(
      connect(url, { extraHeaders: { Origin: 'not-a-url' } }),
    );
    const first = await connect(url, {
      extraHeaders: { Origin: 'http://localhost:5173' },
    });
    context.after(() => first.disconnect());
    const presence = once(first, 'presence');
    const second = await connect(url);
    context.after(() => second.disconnect());
    assert.deepEqual(await presence, [2]);
    first.emit('chat:send', 'no acknowledgement');
    for (const text of [null, 42, {}, '', '   ', 'x'.repeat(501)]) {
      assert.deepEqual(
        await first.timeout(2000).emitWithAck('chat:send', text),
        { ok: false, error: 'Enter between 1 and 500 characters.' },
      );
    }
    const broadcast = once(second, 'message');
    const accepted = await first
      .timeout(2000)
      .emitWithAck('chat:send', '  valid signal  ');
    const [message] = await broadcast;
    assert.equal(message.text, 'valid signal');
    assert.equal(message.id, accepted.id);
    assert.equal(message.sender, first.id);
    assert.equal(accepted.ok, true);
    for (let index = 0; index < 101; index++) {
      await first.timeout(2000).emitWithAck('chat:send', `signal ${index}`);
    }
    second.disconnect();
    const history = once(second, 'history');
    second.connect();
    const [messages] = await history;
    assert.equal(messages.length, 100);
    assert.equal(messages[0].text, 'signal 1');
    assert.equal(messages.at(-1).text, 'signal 100');
    const departed = new Promise(resolve => {
      first.on('presence', count => {
        if (count === 1) resolve(count);
      });
    });
    second.disconnect();
    assert.equal(await departed, 1);
  },
);

test(
  'one dev command serves both clients and proxies polling, WebSocket upgrades and server health',
  { timeout: 30000 },
  async context => {
    const demo = await startDemo(0);
    context.after(demo.close);
    const url = `http://127.0.0.1:${demo.vite.httpServer.address().port}`;
    assert.match(await (await fetch(url)).text(), /main\.tsx/);
    assert.match(
      await (await fetch(`${url}/ReactChat.tsx`)).text(),
      /useSocket/,
    );
    assert.match(
      await (await fetch(`${url}/ReduxChat.tsx`)).text(),
      /withSocket/,
    );
    assert.deepEqual(await (await fetch(`${url}/api/health`)).json(), {
      status: 'ok',
      clients: 0,
      messages: 0,
    });
    const first = await connect(url);
    context.after(() => first.disconnect());
    assert.equal(first.io.engine.transport.name, 'websocket');
    const second = await connect(url, { transports: ['polling', 'websocket'] });
    context.after(() => second.disconnect());
    if (second.io.engine.transport.name !== 'websocket')
      await once(second.io.engine, 'upgrade');
    assert.equal(second.io.engine.transport.name, 'websocket');
    const broadcast = once(second, 'message');
    const accepted = await first
      .timeout(2000)
      .emitWithAck('chat:send', 'Through the Vite proxy');
    assert.equal(accepted.ok, true);
    assert.equal((await broadcast)[0].text, 'Through the Vite proxy');
    const health = await (await fetch(`${url}/api/health`)).json();
    assert.equal(health.clients, 2);
    await demo.close();
    assert.equal(demo.backend.io.engine.clientsCount, 0);
    assert.equal(demo.backend.http.listening, false);
    assert.equal(demo.vite.httpServer.listening, false);
  },
);
