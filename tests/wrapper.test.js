import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { act, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import withSocket from '../lib/withSocket';
import reducer from '../lib/reducer';
import { createClient } from './helpers/socket';

function setup(config = {}) {
  const { client, sockets } = createClient();
  const store = configureStore({
    reducer: (state = { value: 0 }, action) =>
      action.type === 'increment' ? { value: state.value + 1 } : state,
  });
  let api;
  const View = props => {
    api = props.socket;
    return React.createElement(
      'div',
      { 'data-testid': props.name || 'status' },
      String(props.socket.connected),
      props.children,
    );
  };
  const Wrapper = withSocket('http://localhost', { autoConnect: false })(View, {
    io: client,
    ...config,
  });
  const tree = (props = {}) =>
    React.createElement(
      Provider,
      { store },
      React.createElement(Wrapper, props),
    );
  return {
    client,
    sockets,
    store,
    Wrapper,
    tree,
    get api() {
      return api;
    },
  };
}

describe('withSocket', () => {
  it('supports Redux Toolkit without nonserializable state or warnings', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const app = setup();
    render(app.tree());
    act(() => app.store.dispatch({ type: 'increment' }));
    expect(app.store.getState()).toEqual({ value: 1 });
    expect(error).not.toHaveBeenCalled();
    expect(app.api.io).toBe(app.client);
    expect(Object.isFrozen(app.api)).toBe(true);
    error.mockRestore();
  });

  it('updates connection metadata and forwards disconnect details', () => {
    const app = setup();
    const onConnect = vi.fn();
    const onDisconnect = vi.fn();
    render(app.tree({ onConnect, onDisconnect }));
    const socket = app.sockets[0];
    act(() => socket.receive('connect'));
    expect(screen.getByTestId('status').textContent).toBe('true');
    expect(app.api).toMatchObject({
      id: 'test-id',
      nsp: '/',
      uri: 'http://localhost',
      readyState: 'open',
      connected: true,
    });
    expect(onConnect).toHaveBeenCalledWith(
      app.store.dispatch,
      expect.objectContaining({ connected: true }),
    );
    act(() =>
      socket.receive('disconnect', 'transport close', {
        description: 'closed',
      }),
    );
    expect(screen.getByTestId('status').textContent).toBe('false');
    expect(app.api.id).toBeUndefined();
    expect(onDisconnect).toHaveBeenCalledWith(
      app.store.dispatch,
      expect.objectContaining({ connected: false }),
      'transport close',
      { description: 'closed' },
    );
  });

  it('uses the latest callback props without recreating a socket', () => {
    const app = setup();
    const first = vi.fn();
    const second = vi.fn();
    const view = render(app.tree({ onMessage: first }));
    view.rerender(app.tree({ onMessage: second }));
    act(() => app.sockets[0].receive('message', 'hello', 2));
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledWith('hello', 2);
    expect(app.client).toHaveBeenCalledOnce();
  });

  it('owns a socket per mounted instance', () => {
    const app = setup();
    const view = render(
      React.createElement(
        Provider,
        { store: app.store },
        React.createElement(app.Wrapper, {
          name: 'first',
          closeOnUnmount: true,
        }),
        React.createElement(app.Wrapper, {
          name: 'second',
          closeOnUnmount: true,
        }),
      ),
    );
    expect(app.client).toHaveBeenCalledTimes(2);
    act(() => app.sockets[0].receive('connect'));
    expect(screen.getByTestId('first').textContent).toBe('true');
    expect(screen.getByTestId('second').textContent).toBe('false');
    view.unmount();
    for (const socket of app.sockets)
      expect(socket.disconnect).toHaveBeenCalledOnce();
  });

  it('replaces and closes the old socket when the URL changes', () => {
    const app = setup();
    const view = render(app.tree({ url: '/first' }));
    view.rerender(app.tree({ url: '/second' }));
    expect(app.client.mock.calls.map(call => call[0])).toEqual([
      '/first',
      '/second',
    ]);
    expect(app.sockets[0].disconnect).toHaveBeenCalledOnce();
    expect(app.sockets[0].eventNames()).toEqual([]);
  });

  it('merges defaults with options derived from own props', () => {
    const app = setup({ defaults: { timeout: 100, autoConnect: false } });
    const options = vi.fn(props => ({
      auth: { token: props.token },
      timeout: 200,
    }));
    render(app.tree({ token: 'secret', options, children: 'child' }));
    expect(options).toHaveBeenCalledWith({ token: 'secret' });
    expect(app.client).toHaveBeenCalledWith('http://localhost', {
      timeout: 200,
      autoConnect: false,
      auth: { token: 'secret' },
    });
    expect(screen.getByTestId('status').textContent).toBe('falsechild');
  });

  it('forwards Socket and Manager events to their callbacks', () => {
    const app = setup();
    const callbacks = Object.fromEntries(
      [
        'onConnectError',
        'onError',
        'onReconnect',
        'onReconnectAttempt',
        'onReconnectError',
        'onReconnectFailed',
      ].map(name => [name, vi.fn()]),
    );
    render(app.tree(callbacks));
    const error = new Error('offline');
    act(() => app.sockets[0].receive('connect_error', error));
    expect(callbacks.onConnectError).toHaveBeenCalledWith(
      app.store.dispatch,
      expect.any(Object),
      error,
    );
    expect(callbacks.onError).toHaveBeenCalledWith(
      app.store.dispatch,
      expect.any(Object),
      error,
    );
    act(() => app.sockets[0].receive('error', error));
    for (const [event, name] of Object.entries({
      reconnect: 'onReconnect',
      reconnect_attempt: 'onReconnectAttempt',
      reconnect_error: 'onReconnectError',
      reconnect_failed: 'onReconnectFailed',
    })) {
      act(() => app.sockets[0].io.emit(event, 2));
      expect(callbacks[name]).toHaveBeenCalledWith(
        app.store.dispatch,
        expect.any(Object),
        2,
      );
    }
    expect(callbacks.onError).toHaveBeenCalledTimes(3);
  });

  it('supports bound, chainable operations and native buffering before connection', () => {
    const app = setup();
    render(app.tree());
    const callback = vi.fn();
    const { emit, send, open, close, connect, disconnect, compress } = app.api;
    emit('hello', 42, callback).send('next');
    send('message');
    open();
    close();
    connect();
    disconnect();
    compress(false);
    expect(app.sockets[0].emit.mock.calls).toEqual([
      ['hello', 42, callback],
      ['message', 'next'],
      ['message', 'message'],
    ]);
    expect(app.sockets[0].open).toHaveBeenCalledTimes(2);
    expect(app.sockets[0].close).toHaveBeenCalledTimes(2);
    expect(app.sockets[0].compress).toHaveBeenCalledWith(false);
  });

  it('gets and sets Manager options', () => {
    const app = setup();
    render(app.tree());
    for (const method of [
      'reconnection',
      'reconnectionAttempts',
      'reconnectionDelay',
      'reconnectionDelayMax',
      'timeout',
    ]) {
      expect(app.api[method]()).toBeDefined();
      expect(app.api[method](50).connected).toBe(false);
      expect(app.api[method]()).toBe(50);
    }
  });

  it('removes owned listeners without removing lifecycle or external listeners', () => {
    const app = setup();
    const view = render(app.tree());
    const callback = vi.fn();
    const once = vi.fn();
    const external = vi.fn();
    app.sockets[0].on('hello', external);
    app.api.on('hello', callback).once('hello', once);
    act(() => {
      app.sockets[0].receive('hello');
      app.sockets[0].receive('hello');
    });
    expect(callback).toHaveBeenCalledTimes(2);
    expect(once).toHaveBeenCalledOnce();
    app.api.off('hello', callback);
    act(() => app.sockets[0].receive('hello'));
    expect(callback).toHaveBeenCalledTimes(2);
    app.api.on('hello', callback).on('connect', callback).off('hello').off();
    expect(app.sockets[0].listenerCount('connect')).toBe(1);
    app.api.on('hello', callback);
    view.unmount();
    expect(app.sockets[0].listeners('hello')).toEqual([external]);
    expect(app.sockets[0].io.eventNames()).toEqual([]);
    expect(app.sockets[0].disconnect).not.toHaveBeenCalled();
  });

  it('flushes child mount operations even with autoConnect disabled', () => {
    const { client, sockets } = createClient();
    const callback = vi.fn();
    class Child extends React.Component {
      componentDidMount() {
        expect(this.props.socket.timeout()).toBeUndefined();
        this.props.socket
          .on('hello', callback)
          .timeout(50)
          .emit('queued', 1)
          .connect();
      }
      render() {
        return null;
      }
    }
    const Wrapper = withSocket({ autoConnect: false })(Child, { io: client });
    render(
      React.createElement(Wrapper, {
        store: configureStore({ reducer: () => ({}) }),
      }),
    );
    expect(client).toHaveBeenCalledWith(undefined, { autoConnect: false });
    expect(sockets[0].connect).toHaveBeenCalledOnce();
    expect(sockets[0].emit).toHaveBeenCalledWith('queued', 1);
    expect(sockets[0].io.timeout()).toBe(50);
    act(() => sockets[0].receive('hello'));
    expect(callback).toHaveBeenCalledOnce();
  });

  it.each([true, false])(
    'cleans up under Strict Mode with closeOnUnmount=%s',
    closeOnUnmount => {
      const app = setup();
      const callback = vi.fn();
      const onMount = vi.fn((dispatch, socket) => socket.on('hello', callback));
      const onDismount = vi.fn();
      const view = render(
        React.createElement(
          React.StrictMode,
          null,
          app.tree({ closeOnUnmount, onMount, onDismount }),
        ),
      );
      const socket = app.sockets.at(-1);
      expect(onMount).toHaveBeenCalledTimes(2);
      expect(socket.listenerCount('hello')).toBe(1);
      expect(socket.listenerCount('connect')).toBe(1);
      act(() => socket.receive('hello'));
      expect(callback).toHaveBeenCalledOnce();
      view.unmount();
      expect(onDismount).toHaveBeenCalledTimes(2);
      expect(socket.eventNames()).toEqual([]);
      expect(socket.io.eventNames()).toEqual([]);
    },
  );

  it('supports render props and a single child element', () => {
    const { client } = createClient();
    const store = configureStore({ reducer: () => ({}) });
    const Wrapper = withSocket()(undefined, { io: client });
    const view = render(
      React.createElement(Wrapper, { store }, ({ socket }) =>
        React.createElement('span', null, String(socket.connected)),
      ),
    );
    expect(view.container.textContent).toBe('false');
    const Child = ({ socket }) =>
      React.createElement('span', null, socket.readyState);
    view.rerender(
      React.createElement(Wrapper, { store }, React.createElement(Child)),
    );
    expect(view.container.textContent).toBe('opening');
  });

  it('hoists statics and exposes the wrapped instance through a ref', () => {
    const { client } = createClient();
    class Child extends React.Component {
      render() {
        return null;
      }
    }
    Child.answer = 42;
    const Wrapper = withSocket()(Child, {
      io: client,
      alias: 'Connected',
      withRef: true,
    });
    const reference = React.createRef();
    render(
      React.createElement(Wrapper, {
        ref: reference,
        store: configureStore({ reducer: () => ({}) }),
      }),
    );
    expect(Wrapper.answer).toBe(42);
    expect(Wrapper.displayName).toBe('Connected(Child)');
    expect(reference.current.getWrappedInstance()).toBeInstanceOf(Child);
  });

  it('supports the legacy reducer(io) configuration', () => {
    const { client } = createClient();
    const store = configureStore({
      reducer: { socket: reducer(client, { autoConnect: false }) },
      middleware: getDefault =>
        getDefault({ serializableCheck: { ignoredPaths: ['socket.io'] } }),
    });
    const Wrapper = withSocket('/legacy')(() => null);
    render(
      React.createElement(Provider, { store }, React.createElement(Wrapper)),
    );
    expect(client).toHaveBeenCalledWith('/legacy', { autoConnect: false });
  });

  it('supports a null URL with explicit options', () => {
    const { client } = createClient();
    const Wrapper = withSocket(null, { autoConnect: false })(() => null, {
      io: client,
    });
    render(
      React.createElement(Wrapper, {
        store: configureStore({ reducer: () => ({}) }),
      }),
    );
    expect(client).toHaveBeenCalledWith(null, { autoConnect: false });
  });

  it('cleans up even when the dismount callback throws', () => {
    const app = setup();
    const view = render(
      app.tree({
        closeOnUnmount: true,
        onMount: (dispatch, socket) => socket.on('hello', () => {}),
        onDismount: () => {
          throw new Error('dismount failed');
        },
      }),
    );
    expect(() => view.unmount()).toThrow('dismount failed');
    expect(app.sockets[0].eventNames()).toEqual([]);
    expect(app.sockets[0].io.eventNames()).toEqual([]);
    expect(app.sockets[0].disconnect).toHaveBeenCalledOnce();
  });

  it('reports missing client configuration even when cleanup is requested', () => {
    const Wrapper = withSocket()(() => null);
    expect(() =>
      render(
        React.createElement(Wrapper, {
          closeOnUnmount: true,
          store: configureStore({ reducer: () => ({}) }),
        }),
      ),
    ).toThrow('config.io');
  });
});
