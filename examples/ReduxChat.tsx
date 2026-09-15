import { useState } from 'react';
import { Provider, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import {
  withSocket,
  type SocketProps,
  type SocketLifecycleProps,
} from 'redux.io';
import type { ClientEvents, ServerEvents } from './events.js';
import { ChatView } from './ChatView.js';
import {
  createDemoStore,
  historyReceived,
  messageReceived,
  presenceReceived,
  type DemoState,
} from './store.js';

function Chat({
  socket,
  error,
}: SocketProps<ServerEvents, ClientEvents> & { error: string }) {
  const { messages, online } = useSelector((state: DemoState) => state.chat);
  return (
    <ChatView
      connected={socket.connected}
      id={socket.id}
      messages={messages}
      online={online}
      error={error}
      onConnect={() => {
        socket.connect();
      }}
      onDisconnect={() => {
        socket.disconnect();
      }}
      onSend={(text, acknowledge) => {
        socket.emit('chat:send', text, acknowledge);
      }}
    />
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

export function ReduxChat({ url }: { url?: string }) {
  const [store] = useState(createDemoStore);
  const [error, setError] = useState('');
  return (
    <Provider store={store}>
      <ConnectedChat
        url={url}
        closeOnUnmount
        error={error}
        onMount={onMount}
        onConnect={() => setError('')}
        onConnectError={(_dispatch, _socket, failure) =>
          setError(failure.message)
        }
      />
    </Provider>
  );
}
