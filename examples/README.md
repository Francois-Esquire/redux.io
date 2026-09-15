# Signal Station

One chat room, two client layers. Switch between Redux Toolkit and React-only hooks without changing the server, events, or UI. Open two tabs and make them talk.

## Start the station

From the repository root:

```sh
npm ci
npm run examples:dev
```

Open **http://127.0.0.1:5173**. That is the only browser-facing address. The command builds the library, starts a localhost Socket.IO server on an available internal port, and starts Vite. Vite proxies `/socket.io`, including polling and WebSocket upgrades, and `/api/health` to that server. No second terminal, CORS override, or hard-coded client URL is needed. Ctrl+C stops both servers.

Port 5173 must be available. If startup fails, the internal server is closed too. Client edits reload through Vite. Restart the command after editing server code; restart or rebuild after editing the library.

## Mission 1: make contact

1. Keep the first tab on **Redux Toolkit**.
2. Open the same URL in another tab and choose **React only**.
3. Both tabs should show **Connected · 2 online**.
4. Send “Ground control, do you copy?” from the first tab.
5. Reply “Loud and clear” from the second.

Both tabs use the same `ChatView` component. “Delivered” appears only after the server acknowledges the message, not merely because a button was clicked.

The path of a signal:

```text
ChatView → chat:send(text, acknowledge)
         → server validates and trims the text
         → server broadcasts message to every connected client
         → server acknowledges { ok: true, id }
         → each client updates its state and renders ChatView
```

`events.ts` defines the contract. TypeScript checks event names and callback payloads; `server.ts` still validates incoming data because types do not protect a network boundary. Blank messages, non-string payloads, and messages over 500 characters are rejected.

## Mission 2: go off air

1. Disconnect the React-only tab. Its Send button becomes disabled.
2. The Redux tab should show one connected client.
3. Send “You missed this” from the Redux tab.
4. Reconnect the React-only tab. It loads history, including the missed signal.
5. Switch either tab between client layers. History stays, but its connection ID changes. The old client is unmounted and disconnected.

This is a local demo, not durable messaging. The server keeps only the latest 100 messages in memory; restarting it clears history. Messages are attributed to a connection ID, not an account, so an older signal may show as “Peer” after reconnecting.

## Mission 3: inspect the two clients

### Redux Toolkit: `ReduxChat.tsx`

```text
Socket.IO event → dispatch(slice action) → Redux store → useSelector → ChatView
```

`withSocket<ServerEvents, ClientEvents>()` injects the socket API. `onMount` registers event handlers that dispatch the actions in `store.ts`. Each Redux entry owns its `Provider` and store; Socket.IO objects stay out of the store. `closeOnUnmount` closes the connection when switching away.

### React only: `ReactChat.tsx`

```text
Socket.IO event → dispatch(local action) → useReducer → ChatView
```

`useSocket<ServerEvents, ClientEvents>()` comes from `redux.io/react`. It manages connection status with an internal React reducer. The client component uses a second local reducer for messages and presence. An effect registers listeners on the current socket and removes them during cleanup. There are no Redux imports in this client.

`App.tsx` lazy-loads the selected entry. Both entries adapt their state and send/connect/disconnect methods to `ChatViewProps`. Try changing a button in `ChatView.tsx`: both versions change without touching either state-management layer.

## Do we need a socket provider?

Not for this demo. Each entry calls its connection owner once and passes data and callbacks to the shared UI.

Socket.IO handles the transport, acknowledgements, and reconnection of a socket. It does not share a React hook result across your component tree. Each `useSocket` call creates its own connection. If several distant components need one shared socket, call the hook once in a React context provider and expose that result to consumers. That provider would own cleanup and connection status. No new library provider API is introduced here.

## Check the wiring

```sh
npm run test:example-server
npm run check
npx playwright install chromium
npm run test:browser
```

Stop a manually running demo before `test:browser`; browser tests start and stop their own server on port 5173.

- Server tests exercise validation, acknowledgements, broadcasts, presence, bounded history, origin rejection, and health responses.
- Proxy tests start the actual Vite setup, load both client modules, force a WebSocket-only client, upgrade a polling client to WebSocket, and verify shutdown.
- UI integration tests run both adapters and switch between them, checking that connections and listeners do not accumulate.
- Chromium tests send signals in both directions between two tabs, disconnect/reconnect, recover history, switch adapters, check browser errors, and inspect a mobile viewport. Screenshots and failure traces go into ignored `test-results`.

CI runs the server tests in the existing compatibility matrix and the Chromium checks in a separate job. The library keeps its 100% coverage gate; example tests are functional checks, not a claim of 100% example coverage.

## Files and deployment boundaries

`devServer.mts` starts both servers. `vite.config.mts` supplies the proxy defaults; the combined runner overrides their target with its internal port. `npm run examples:server` remains available for standalone server work on port 3000, paired with `npx vite --config examples/vite.config.mts` when separate processes are useful.

`npm run examples:build` writes static client assets to ignored `examples/dist`. It does not deploy a server or enable a production proxy. A production host must serve the assets and forward `/socket.io` to a running backend.

The demo binds to localhost and rejects browser socket connections from non-local origins. It has no authentication, persistence, or production rate limiting. Do not expose it publicly as a chat service.
