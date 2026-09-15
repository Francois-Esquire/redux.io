import { useEffect, useReducer } from 'react';
import { useSocket } from 'redux.io/react';
import type { ClientEvents, ServerEvents, Message } from './events.js';
import { ChatView } from './ChatView.js';

type ChatAction =
  | { type: 'history'; messages: Message[] }
  | { type: 'message'; message: Message }
  | { type: 'presence'; online: number };
function reducer(
  state: { messages: Message[]; online: number },
  action: ChatAction,
) {
  switch (action.type) {
    case 'history':
      return { ...state, messages: action.messages };
    case 'message':
      return {
        ...state,
        messages: [...state.messages, action.message].slice(-100),
      };
    case 'presence':
      return { ...state, online: action.online };
  }
}

export function ReactChat({ url }: { url?: string }) {
  const { socket, connected, id, error } = useSocket<
    ServerEvents,
    ClientEvents
  >(url);
  const [{ messages, online }, dispatch] = useReducer(reducer, {
    messages: [],
    online: 0,
  });

  useEffect(() => {
    if (!socket) return;
    const history = (messages: Message[]) =>
      dispatch({ type: 'history', messages });
    const message = (message: Message) =>
      dispatch({ type: 'message', message });
    const presence = (online: number) => dispatch({ type: 'presence', online });
    socket
      .on('history', history)
      .on('message', message)
      .on('presence', presence);
    return () => {
      socket
        .off('history', history)
        .off('message', message)
        .off('presence', presence);
    };
  }, [socket]);

  return (
    <ChatView
      connected={connected}
      id={id}
      messages={messages}
      online={online}
      error={error?.message}
      onConnect={() => {
        socket?.connect();
      }}
      onDisconnect={() => {
        socket?.disconnect();
      }}
      onSend={(text, acknowledge) => {
        socket?.emit('chat:send', text, acknowledge);
      }}
    />
  );
}
