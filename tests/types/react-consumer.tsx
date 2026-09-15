import React from 'react';
import {
  useSocket,
  type SocketOptions,
  type UseSocketResult,
} from 'redux.io/react';

interface Incoming {
  greeting: (text: string) => void;
}
interface Outgoing {
  save: (text: string, ack: (id: number) => void) => void;
}
const options: SocketOptions = { autoConnect: false };

export function View() {
  const state: UseSocketResult<Incoming, Outgoing> = useSocket<
    Incoming,
    Outgoing
  >('http://localhost:3000', options);
  state.socket?.on('greeting', text => text.toUpperCase());
  state.socket?.emit('save', 'hello', id => id.toFixed());
  return (
    <button disabled={state.connected} onClick={() => state.socket?.connect()}>
      {state.error?.message ?? state.id}
    </button>
  );
}
