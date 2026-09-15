import { useState, type FormEvent } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import {
  withSocket,
  type SocketProps,
  type SocketLifecycleProps,
} from 'redux.io';
import type { ClientEvents, ServerEvents } from './events.js';
import {
  historyReceived,
  messageReceived,
  presenceReceived,
  type DemoState,
} from './store.js';

function Chat({ socket }: SocketProps<ServerEvents, ClientEvents>) {
  const { messages, online } = useSelector((state: DemoState) => state.chat);
  const [text, setText] = useState('');
  const [status, setStatus] = useState('');

  function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('Sending…');
    socket.emit('chat:send', text, result => {
      setStatus(result.ok ? 'Delivered' : result.error);
      if (result.ok) setText('');
    });
  }

  return (
    <main>
      <h1>redux.io live chat</h1>
      <p>
        React + Redux Toolkit + Socket.IO, with typed events and
        acknowledgements.
      </p>
      <p role="status">
        {socket.connected ? 'Connected' : 'Disconnected'} · {online} online
      </p>
      <button
        onClick={() =>
          socket.connected ? socket.disconnect() : socket.connect()
        }
      >
        {socket.connected ? 'Disconnect' : 'Connect'}
      </button>
      <ol aria-label="Messages">
        {messages.map(message => (
          <li key={message.id}>
            <strong>{message.sender === socket.id ? 'You' : 'Peer'}:</strong>{' '}
            {message.text}
          </li>
        ))}
      </ol>
      <form onSubmit={send}>
        <label htmlFor="message">Message</label>
        <input
          id="message"
          value={text}
          onChange={event => setText(event.target.value)}
          maxLength={500}
          required
        />
        <button type="submit" disabled={!socket.connected}>
          Send
        </button>
      </form>
      <p aria-live="polite">{status}</p>
      <p>
        Open another tab to test broadcasts. Socket objects stay outside Redux
        state.
      </p>
    </main>
  );
}

const ConnectedChat = withSocket<ServerEvents, ClientEvents>()(Chat, { io });
const onMount: SocketLifecycleProps<ServerEvents, ClientEvents>['onMount'] = (
  dispatch,
  socket,
) => {
  socket
    .on('history', messages => dispatch(historyReceived(messages)))
    .on('message', message => dispatch(messageReceived(message)))
    .on('presence', count => dispatch(presenceReceived(count)));
};

export function App({ url }: { url?: string }) {
  const [error, setError] = useState('');
  return (
    <>
      {error && <p role="alert">{error}</p>}
      <ConnectedChat
        url={url}
        closeOnUnmount
        onMount={onMount}
        onConnect={() => setError('')}
        onConnectError={(_dispatch, _socket, failure) =>
          setError(failure.message)
        }
      />
    </>
  );
}
