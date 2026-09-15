# redux.io

[![CI](https://github.com/Francois-Esquire/redux.io/actions/workflows/ci.yml/badge.svg?branch=main&event=push)](https://github.com/Francois-Esquire/redux.io/actions/workflows/ci.yml?query=branch%3Amain)
[![npm version](https://img.shields.io/npm/v/redux.io)](https://www.npmjs.com/package/redux.io)
[![Coverage requirement: 100%](https://img.shields.io/badge/coverage_gate-100%25-brightgreen)](vitest.config.mjs)
[![React 18 and 19](https://img.shields.io/badge/React-18%20%7C%2019-61dafb)](#migration-from-02x)
[![Socket.IO 4](https://img.shields.io/badge/Socket.IO-4-010101)](#api)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

React and Redux bindings for Socket.IO.

This modernization targets React 18/19, React Redux 9, Redux 5, and Socket.IO 4. The package keeps the `withSocket` API and adds client configuration outside Redux state for Redux Toolkit applications.

## Install

```sh
npm install redux.io socket.io-client react react-dom react-redux @reduxjs/toolkit
```

Development and CI require Node 22.22.2+, 24.15+, or 26+. Both native ESM and CommonJS imports are supported. A UMD build is available at `dist/redux.io.umd.js` for pages providing the `React` and `ReactRedux` globals.

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

## Development

```sh
npm ci
npm run hooks:install
npm test
npm run cov
npm run check
npm pack --dry-run
```

`npm run check` runs lint, formatting checks, strict TypeScript checks, tests with coverage thresholds, library and example builds, and tests of the npm tarball's CommonJS, ESM, and UMD entry points. Package tests also compile valid and invalid TypeScript consumers against the unpacked declarations. The integration tests start a real Socket.IO server on an OS-assigned localhost port and close every connection after each test.

CI checks Node 22, 24, and 26 with React 18 and 19. Library coverage thresholds are 100% for statements, branches, functions, and lines. `npm run watch:test` watches tests. `npm run watch:build` watches TypeScript compilation into `.build`; run `npm run build` to refresh packaged bundles.

Generated `dist`, `.build`, and `examples/dist` directories are ignored by Git. The npm tarball still includes compiled JavaScript and declarations in `dist`, plus the original TypeScript in `lib`. A clean checkout builds these artifacts before testing package imports.

The `prepack` hook builds ordinary npm packages. CI builds explicitly before packing with `--ignore-scripts`, so packing and publishing the tested artifact do not rerun the build.

Implementation references: [React Redux connect](https://react-redux.js.org/api/connect), [Socket.IO client API](https://socket.io/docs/v4/client-api/), [Socket.IO with React](https://socket.io/how-to/use-with-react), and [Redux side effects](https://redux.js.org/usage/side-effects-approaches).

### Git hooks

Run `npm run hooks:install` once per clone after installing dependencies. Husky runs `lint-staged` before commits to fix lint and formatting issues in staged TypeScript source, examples, tests, configuration, and release documentation. It preserves unstaged portions of partially staged files. Generated bundles are excluded.

Before a push, Husky runs `npm run check`, including the 100% coverage requirements and package smoke tests. CI runs the same checks independently. Hooks run installed local tools; they do not download dependencies.

Hook installation is explicit rather than an npm lifecycle hook. Installing or publishing the package does not configure Git hooks, and the isolated publish job needs no Husky installation.

### Changelog and versioning

[CHANGELOG.md](CHANGELOG.md) is generated from Conventional Commits by `npm run changelog`. The next release is `1.0.0`, which moves the old `0.2.x` API onto the supported framework versions. Detailed migration instructions live in this README.

For each subsequent release:

1. Commit changes using Conventional Commits: `fix(socket): handle disconnects`, `feat(api): add an option`, or `feat(api)!: change connection ownership`. Explain migration requirements in a `BREAKING CHANGE:` commit-body footer.
2. Choose a major version for incompatible API or supported-runtime changes, minor for compatible features, and patch for compatible fixes.
3. Run `npm version major --no-git-tag-version --ignore-scripts`, substituting `minor` or `patch` as appropriate. This updates the manifest and lockfile without creating a Git commit or tag.
4. Run `npm run changelog`, review the generated entry, and run `npm run check`.
5. Commit and push the release changes when approved. Create a matching `vX.Y.Z` GitHub release and use the generated changelog entry as its release notes. Publishing that release triggers the isolated npm workflow.

The generator groups features, fixes, and breaking changes and links entries to commits. It rebuilds the file from Git history, so repeated runs do not append duplicate releases. Do not edit generated entries by hand; correct the commit metadata or add migration detail here. Uncommitted changes cannot appear in the generated changelog, and generation does not publish a release or create commits or tags. Fetch the full history and release tags before generating notes in a new clone.

Version selection remains explicit; the changelog generator does not bump versions. The current 1.0.0 version is prepared locally and has not been released.

## Publishing

The `Publish to npm` workflow runs manually from GitHub Actions or when a GitHub release is published. Configure a repository Actions secret named `NPM_TOKEN` with permission to publish this package. Without it, the build completes and publication is skipped.

The workflow uses two jobs on separate runners:

1. **Build:** install dependencies, regenerate the changelog from full Git history, extract notes for the package version, run the full checks, and upload the built npm tarball and `release-notes.md`. This job never receives the npm token.
2. **Publish:** download and unpack that tarball on a fresh runner, then run `npm publish --ignore-scripts`. This job does not check out source, restore dependency caches, install dependencies, or run package lifecycle scripts. Only the npm publish step receives the npm token.

After npm publishing succeeds, a separate step uses GitHub's token to create a release at the built commit or replace the matching release's description with the generated notes. The npm token is not passed to that step. Manual runs can therefore publish both npm and GitHub releases; runs triggered by an existing release update its notes. If no npm token is configured, the documentation remains available in the workflow artifact without creating or updating a GitHub release.

Update the package version and lockfile before publishing. GitHub release tags must match `v` followed by the package version. Stable versions use npm's `latest` tag; prerelease versions and GitHub prereleases use `next`. npm rejects versions that have already been published.

The lifecycle-script boundary uses npm's documented [ignore-scripts option](https://docs.npmjs.com/cli/v11/using-npm/config/#ignore-scripts).

## License

MIT
