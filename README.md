# redux.io

[![CI](https://github.com/Francois-Esquire/redux.io/actions/workflows/ci.yml/badge.svg?branch=main&event=push)](https://github.com/Francois-Esquire/redux.io/actions/workflows/ci.yml?query=branch%3Amain)
[![npm version](https://img.shields.io/npm/v/redux.io)](https://www.npmjs.com/package/redux.io)
[![Coverage requirement: 100%](https://img.shields.io/badge/coverage_gate-100%25-brightgreen)](vitest.config.mjs)
[![React 18 and 19](https://img.shields.io/badge/React-18%20%7C%2019-61dafb)](#migration-from-02x)
[![Socket.IO 4](https://img.shields.io/badge/Socket.IO-4-010101)](#api)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

React and Redux bindings for Socket.IO.

This modernization targets React 18/19 and Socket.IO 4. Use `redux.io/react` for a React-only hook, or the package root for the existing `withSocket` API with React Redux 9 and Redux 5.

## Install

For the React-only hook:

```sh
npm install redux.io socket.io-client react react-dom
```

For the existing Redux bindings:

```sh
npm install redux.io socket.io-client react react-dom react-redux @reduxjs/toolkit
```

Development and CI require Node 22.22.2+, 24.15+, or 26+. Both native ESM and CommonJS imports are supported. A UMD build is available at `dist/redux.io.umd.js` for pages providing the `React` and `ReactRedux` globals.

## React-only hook

Want to try both APIs first? Run `npm run examples:dev` from this repository and open http://127.0.0.1:5173. [Signal Station](examples/README.md) has a client menu and a two-tab tutorial, using the same chat UI with Redux Toolkit or React-only hooks. That one command starts Vite and the proxied socket server.

```tsx
import { useEffect, useState } from 'react';
import { useSocket } from 'redux.io/react';

interface ServerEvents {
  message: (message: { text: string }) => void;
}
interface ClientEvents {
  'chat:send': (text: string, ack: (result: { ok: boolean }) => void) => void;
}

function Chat() {
  const { socket, connected, error } = useSocket<ServerEvents, ClientEvents>();
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!socket) return;
    const receive = (incoming: { text: string }) => setMessage(incoming.text);
    socket.on('message', receive);
    return () => {
      socket.off('message', receive);
    };
  }, [socket]);

  return (
    <>
      <p>{error?.message ?? message}</p>
      <button
        disabled={!connected}
        onClick={() =>
          socket?.emit('chat:send', 'Hello', result => console.log(result.ok))
        }
      >
        Send
      </button>
    </>
  );
}
```

`useSocket<ListenEvents, EmitEvents>(url?, options?)` returns `{ socket, connected, id, error }`. No Redux store or `Provider` is needed. The React entry point and its declarations do not import Redux. Redux and React Redux are optional peers, but remain required when importing the original package root.

- `socket` is a typed native Socket.IO client, initially `null`, including during server rendering. It becomes available after mounting.
- Each hook owns its connection. Effects create it and disconnect it on unmount; `useReducer` handles state transitions without side effects.
- Connections start automatically unless `autoConnect: false`. Use `socket?.connect()` and `socket?.disconnect()` for manual control.
- A successful connection clears `error`. Disconnecting clears `id` and sets `connected` to false. Socket.IO manages automatic reconnection according to its options.
- Changing `url` or the **options object identity** replaces the connection. Define constant options outside the component or use `useMemo`; do not pass a new inline options object every render.
- Register application listeners in an effect depending on `socket`, and remove those listeners in its cleanup. Hook cleanup removes all listeners from its owned socket. Development Strict Mode may create, clean up, and recreate a connection.

The `redux.io/react` entry has separate ESM, CommonJS, and declaration builds. `redux.io/react/source` exposes its TypeScript source. It does not change the existing Redux or UMD API. The React entry exports `UseSocketResult`, `SocketOptions`, and `EventsMap` types.

See [React's reducer rules](https://react.dev/reference/react/useReducer) and [Socket.IO's React lifecycle guidance](https://socket.io/how-to/use-with-react).

## Redux Toolkit example

Pass the Socket.IO factory through the wrapper configuration. Socket instances stay inside the wrapper, and the Redux store contains application data.

```jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { io } from 'socket.io-client';
import { withSocket } from 'redux.io';

const messages = createSlice({
  name: 'messages',
  initialState: [],
  reducers: {
    received(state, action) {
      state.push(action.payload);
    },
  },
});

const store = configureStore({ reducer: { messages: messages.reducer } });

function Chat({ socket }) {
  return (
    <button
      disabled={!socket.connected}
      onClick={() => socket.emit('chat', 'Hello!', reply => console.log(reply))}
    >
      {socket.connected ? 'Send message' : 'Connecting…'}
    </button>
  );
}

const ConnectedChat = withSocket('http://localhost:3000', {
  auth: { token: 'replace-with-your-token' },
})(Chat, { io });

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <ConnectedChat
      closeOnUnmount
      onMount={(dispatch, socket) => {
        socket.on('chat', message =>
          dispatch(messages.actions.received(message)),
        );
      }}
    />
  </Provider>,
);
```

The server must accept the configured origin and authentication. Socket.IO is a protocol layered over WebSocket or HTTP polling; this wrapper does not connect to a plain WebSocket server.

## TypeScript

The library is written in TypeScript. The package includes declarations for both ESM and CommonJS; no separate `@types/redux.io` package is needed. Install React's types in TypeScript applications with `npm install -D @types/react`.

```tsx
import { io } from 'socket.io-client';
import { withSocket, type SocketProps } from 'redux.io';

interface ServerEvents {
  greeting: (message: string) => void;
}

interface ClientEvents {
  save: (text: string, ack: (result: { id: string }) => void) => void;
}

function Editor({
  socket,
  title,
}: SocketProps<ServerEvents, ClientEvents> & { title: string }) {
  return (
    <button
      onClick={() =>
        socket.emit('save', title, result => console.log(result.id))
      }
    >
      {title}
    </button>
  );
}

const ConnectedEditor = withSocket<ServerEvents, ClientEvents>()(Editor, {
  io,
});
```

Render `<ConnectedEditor title="Draft" />` inside a Redux `Provider`. The wrapper injects `socket`; callers supply the remaining component props. Event names, payloads, listener parameters, and acknowledgement callbacks are checked against the two event maps. Omitting the maps keeps events permissive for existing JavaScript integrations. Types do not validate network input; validate payloads on the server.

`SocketInterface`, `SocketProps`, `SocketOptions`, `SocketFactory`, `SocketConfig`, `SocketLifecycleProps`, `SocketConnector`, `SocketWrapperRef`, and `LegacySocketState` are exported types. `redux.io/source` exposes the original TypeScript entry point for bundlers and source tooling; ordinary applications should import `redux.io` to use compiled JavaScript.

## API

### `withSocket(url?, options?)(Component?, config?)`

The options-only form, `withSocket(options)`, uses the current origin. Options can be an object or a function of the wrapped component's own props.

| Configuration | Behavior                                                                                              |
| ------------- | ----------------------------------------------------------------------------------------------------- |
| `io`          | Socket.IO client factory. Recommended for new applications.                                           |
| `defaults`    | Base Socket.IO options, overridden by the selected options.                                           |
| `alias`       | Wrapper display-name prefix. Defaults to `WithSocket`.                                                |
| `withRef`     | Forward a React ref to the wrapper, whose `getWrappedInstance()` returns the wrapped component's ref. |

Wrapper props `url` and `options` override the corresponding factory arguments. Options are resolved on mount; changing them requires a new React `key`. Changing `url` closes the old socket and creates a new one. Define the wrapped component outside render so normal React updates do not remount it.

Each mounted wrapper owns its Socket instance, listeners, and pending operations. Socket.IO can still share its underlying Manager across namespaces according to its own `multiplex` rules.

`closeOnUnmount` defaults to `false` for compatibility. Set it to `true` for component-owned connections, as in the example. When it is false, the connection remains open after unmount; the caller owns its lifetime and should disconnect it before unmount when it is no longer needed. Listeners registered through the wrapper are removed in either case.

The injected, frozen `socket` interface provides:

- Metadata: `id`, `uri`, `nsp`, `connected`, and derived `readyState`, which is `open`, `opening`, or `closed` after mount. `io` is the configured client factory.
- Chainable methods: `open`, `connect`, `close`, `disconnect`, `on`, `once`, `off`, `emit`, `send`, and `compress`. Methods can be destructured without losing their receiver.
- Manager getters/setters: `reconnection`, `reconnectionAttempts`, `reconnectionDelay`, `reconnectionDelayMax`, and `timeout`. No argument reads the value; an argument updates it and returns the interface. Getters return `undefined` before mount. `timeout` configures the Manager's connection timeout, not Socket.IO's per-emission acknowledgement timeout.

Operations from a child's mount lifecycle wait until the wrapper creates its socket. Once created, Socket.IO handles buffering emissions while disconnected, including acknowledgements. `autoConnect: false` requires an explicit `socket.connect()`.

`off(event, callback)` removes matching listeners registered through this wrapper. Omitting the callback removes its listeners for that event; `off()` removes all its user listeners. Internal connection handlers and externally registered listeners are preserved.

### Lifecycle props

| Prop                                | Arguments                                                  |
| ----------------------------------- | ---------------------------------------------------------- |
| `onMount`, `onDismount`             | `dispatch, socket`                                         |
| `onConnect`                         | `dispatch, socket`                                         |
| `onDisconnect`                      | `dispatch, socket, reason, details`                        |
| `onConnectError`, `onError`         | `dispatch, socket, error`                                  |
| `onReconnect`, `onReconnectAttempt` | `dispatch, socket, attempt`                                |
| `onReconnectError`                  | `dispatch, socket, error`                                  |
| `onReconnectFailed`                 | `dispatch, socket`                                         |
| `onMessage`                         | The received message arguments, without a dispatch prefix. |

Reconnection events come from the Socket.IO Manager. Connection and reconnection errors also reach `onError`. Register custom listeners in `onMount`, so reconnecting does not add duplicate listeners. React Strict Mode runs an extra mount/cleanup cycle in development, so lifecycle callbacks must tolerate it.

Without a component, use a render function or one child element:

```jsx
const Connection = withSocket('http://localhost:3000')(undefined, { io });

<Connection closeOnUnmount>
  {({ socket }) => <span>{socket.connected ? 'Online' : 'Offline'}</span>}
</Connection>;
```

### Legacy `reducer(io, defaults?)`

Existing applications may continue registering the factory at `state.socket`:

```js
import { combineReducers, legacy_createStore as createStore } from 'redux';
import { io } from 'socket.io-client';
import { reducer } from 'redux.io';

const store = createStore(combineReducers({ socket: reducer(io) }));
```

Wrappers without `config.io` read this configuration. This legacy reducer stores a nonserializable factory and its historical internal socket actions perform side effects. Use `config.io` for new applications and keep received data in ordinary application reducers. The unfinished internal action creators are not public package exports.

## Migration from 0.2.x

- Upgrade the React, Redux, and Socket.IO peer dependencies to the versions listed above. React 15/16, React Redux 4/5, and Socket.IO 2 are outside the supported range.
- Prefer `import { io } from 'socket.io-client'`, then pass `{ io }` as wrapper configuration. Remove the legacy socket reducer when no wrappers depend on it.
- Socket instances are now isolated per wrapper instance. Code that relied on accidental sharing must explicitly manage connection ownership.
- Use `onConnectError` for connection failures and `onReconnectAttempt` for reconnection attempts. Socket.IO 4 does not emit the old `connect_timeout` or `reconnecting` events.
- Use the package root for runtime imports. TypeScript source is available through `redux.io/source` for tooling that compiles dependencies.
- The runnable [example application](examples/README.md) uses React, Redux Toolkit, and Socket.IO 4 with shared TypeScript events.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for local setup, testing, Git hooks, Conventional Commits, and the release and trusted-publishing process.

## License

MIT
