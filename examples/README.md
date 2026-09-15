# Typed live chat

This replaces the historical React 16 demos with a React 19, Redux Toolkit, and Socket.IO 4 application. It uses the root dependency lockfile and imports `redux.io` through its public package exports, not internal source paths.

From the repository root:

```sh
npm ci
npm run examples:server
```

In another terminal:

```sh
npm run examples:dev
```

Open http://127.0.0.1:5173 in two tabs. Send a message to see broadcasts and acknowledgements. Disconnect and reconnect to load the server's recent history. Stop both processes with Ctrl+C.

Vite proxies `/socket.io` to the local server on port 3000, including WebSocket upgrades. The server binds to localhost. This is a development demo, not an authenticated production chat service. History is in memory, limited to 100 messages, and disappears when the server restarts.

## Code

- `events.ts` defines shared client/server events and acknowledgement payloads.
- `server.ts` validates messages and broadcasts them through a typed Socket.IO server.
- `store.ts` keeps serializable messages and presence counts in Redux Toolkit.
- `App.tsx` injects a typed socket with `withSocket<ServerEvents, ClientEvents>()`. Lifecycle callbacks register listeners and dispatch Redux actions. `closeOnUnmount` cleans up the connection.

`npm run examples:dev` builds the library before starting Vite. After changing library code, rerun `npm run build`; example source edits reload automatically.

## Validation

`npm run check` includes strict TypeScript checking, a production Vite build, and real-server tests of the example UI, acknowledgements, broadcasts, history, disconnect/reconnect, and unmount cleanup. Package tests compile both ESM and CommonJS consumers against the unpacked npm tarball and reject invalid event names, payloads, callbacks, and component props.

`npm run examples:build` writes ignored static assets to `examples/dist`. It does not bundle the server or deploy either process. A production host would need to serve those assets and proxy `/socket.io` to the server.
