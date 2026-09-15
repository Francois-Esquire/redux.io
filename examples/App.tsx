import { lazy, Suspense, useState } from 'react';

const ReduxChat = lazy(() =>
  import('./ReduxChat.js').then(module => ({ default: module.ReduxChat })),
);
const ReactChat = lazy(() =>
  import('./ReactChat.js').then(module => ({ default: module.ReactChat })),
);

export function App({ url }: { url?: string }) {
  const [client, setClient] = useState<'redux' | 'react'>('redux');
  return (
    <main>
      <header className="masthead">
        <a href="/" className="brand">
          redux.io <span>MISSION CONTROL</span>
        </a>
        <span className="version">Deep-space relay / training simulation</span>
      </header>
      <section className="intro">
        <div className="orbital-art" aria-hidden="true">
          <div className="orbit" />
          <div className="planet" />
          <div className="satellite" />
          <span>SECTOR 04 / SIGNAL RELAY</span>
        </div>
        <p className="eyebrow">Mission briefing / Socket.IO flight school</p>
        <h1>
          Signal Station<span className="accent">.</span>
        </h1>
        <p>
          Two spacecraft. One shared frequency. Send a transmission across the
          void, then switch the technology behind your comms.
        </p>
      </section>
      <nav aria-label="Client implementation" className="client-menu">
        <button
          aria-pressed={client === 'redux'}
          onClick={() => setClient('redux')}
        >
          <span className="step">01</span>
          <span>
            Redux Toolkit<small>withSocket + a Redux store</small>
          </span>
        </button>
        <button
          aria-pressed={client === 'react'}
          onClick={() => setClient('react')}
        >
          <span className="step">02</span>
          <span>
            React only<small>useSocket + useReducer</small>
          </span>
        </button>
      </nav>
      <div className="workspace">
        <Suspense fallback={<p>Establishing the uplink…</p>}>
          {client === 'redux' ? (
            <ReduxChat url={url} />
          ) : (
            <ReactChat url={url} />
          )}
        </Suspense>
        <aside className="tutorial">
          <p className="eyebrow">Flight checklist / 4 objectives</p>
          <h2>Make contact.</h2>
          <ol>
            <li>
              <strong>Open a second tab.</strong>
              <p>
                Launch the other client layer. Both spacecraft join the same
                server.
              </p>
            </li>
            <li>
              <strong>Send “Do you copy?”</strong>
              <p>
                Watch it appear in both tabs. “Delivered” means the server
                acknowledged it.
              </p>
            </li>
            <li>
              <strong>Enter the comms blackout.</strong>
              <p>
                Disconnect one tab. Send from the other, then reconnect to
                recover the last 100 messages.
              </p>
            </li>
            <li>
              <strong>Change flight systems.</strong>
              <p>
                Change client layers. The old connection closes and the new
                client loads history.
              </p>
            </li>
          </ol>
          <div className="under-hood">
            <h3>
              {client === 'redux'
                ? 'Inside the Redux client'
                : 'Inside the React client'}
            </h3>
            <code>
              {client === 'redux'
                ? 'socket → action → store → UI'
                : 'socket → dispatch → reducer → UI'}
            </code>
            <p>
              {client === 'redux'
                ? 'withSocket owns the connection. Event handlers dispatch serializable Redux actions. useSelector reads messages.'
                : 'useSocket owns the connection. An effect subscribes to events and dispatches to a local React reducer. No Provider required.'}
            </p>
          </div>
        </aside>
      </div>
      <footer>
        Local demo only · in-memory history · no accounts · Socket.IO 4
      </footer>
    </main>
  );
}
