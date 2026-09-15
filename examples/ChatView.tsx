import { useState, type FormEvent } from 'react';
import type { Message, SendResult } from './events.js';

export interface ChatViewProps {
  connected: boolean;
  id?: string;
  messages: Message[];
  online: number;
  error?: string;
  onConnect: () => void;
  onDisconnect: () => void;
  onSend: (text: string, acknowledge: (result: SendResult) => void) => void;
}

export function ChatView({
  connected,
  id,
  messages,
  online,
  error,
  onConnect,
  onDisconnect,
  onSend,
}: ChatViewProps) {
  const [text, setText] = useState('');
  const [status, setStatus] = useState('');

  function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('Sending…');
    onSend(text, result => {
      setStatus(result.ok ? 'Delivered' : result.error);
      if (result.ok) setText('');
    });
  }

  return (
    <section className="station" aria-label="Live chat">
      <header className="station-header">
        <div>
          <p className="eyebrow">Comms deck / shared frequency 01</p>
          <h2>Mission uplink</h2>
        </div>
        <span
          className={connected ? 'connection online' : 'connection'}
          role="status"
        >
          {connected ? 'Connected' : 'Disconnected'} · {connected ? online : 0}{' '}
          online
        </span>
      </header>
      <div className="connection-tools">
        <span className="client-id">
          {id ? `Craft ID: ${id}` : 'Uplink offline. Awaiting connection.'}
        </span>
        <button
          className="secondary"
          onClick={connected ? onDisconnect : onConnect}
        >
          {connected ? 'Disconnect' : 'Connect'}
        </button>
      </div>
      {error && <p role="alert">{error}</p>}
      <ol
        className="messages"
        aria-label="Messages"
        aria-live="polite"
        aria-relevant="additions"
      >
        {messages.length === 0 && (
          <li className="empty">
            Deep space is quiet. Send your first transmission.
          </li>
        )}
        {messages.map(message => (
          <li
            key={message.id}
            className={message.sender === id ? 'message yours' : 'message'}
          >
            <span className="sender">
              {message.sender === id ? 'You' : 'Peer'}
            </span>
            <span>{message.text}</span>
          </li>
        ))}
      </ol>
      <form onSubmit={send}>
        <label htmlFor="message">Message</label>
        <div className="compose">
          <input
            id="message"
            placeholder="Ground control, do you copy?"
            value={text}
            onChange={event => setText(event.target.value)}
            maxLength={500}
            required
          />
          <button type="submit" disabled={!connected}>
            Send
          </button>
        </div>
        <div className="compose-footer">
          <span>{text.length}/500 characters</span>
          <span aria-live="polite">{status}</span>
        </div>
      </form>
    </section>
  );
}
