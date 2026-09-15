import React from 'react';
import { io } from 'socket.io-client';
import { configureStore } from '@reduxjs/toolkit';
import {
  withSocket,
  reducer,
  type SocketInterface,
  type SocketProps,
} from 'redux.io';

interface Incoming {
  greeting: (message: string) => void;
  message: (value: number) => void;
}
interface Outgoing {
  save: (value: number, acknowledge: (result: { id: string }) => void) => void;
  message: (text: string) => void;
}
declare const socket: SocketInterface<Incoming, Outgoing>;
socket.on('greeting', message => message.toUpperCase());
socket.once('message', value => value.toFixed());
socket.on('connect_error', error => error.message.toUpperCase());
socket
  .emit('save', 12, result => result.id.toUpperCase())
  .send('hello')
  .off('greeting');
const timeout: number | undefined = socket.timeout();
const reconnect: boolean | undefined = socket.reconnection();
socket
  .timeout(timeout ?? 1000)
  .reconnection(reconnect ?? true)
  .disconnect();

function View({
  socket: client,
  title,
}: SocketProps<Incoming, Outgoing> & { title: string }) {
  return (
    <div>
      {title}: {client.id}
    </div>
  );
}
const Connected = withSocket<Incoming, Outgoing>()(View, { io });
export const view = (
  <Connected
    title="Typed"
    options={props => ({ query: { title: props.title } })}
    onMount={(dispatch, client) => {
      client.on('greeting', message =>
        dispatch({ type: 'greeting', payload: message }),
      );
    }}
  />
);
const Render = withSocket<Incoming, Outgoing>()(null, { io });
export const renderProp = (
  <Render>{({ socket: client }) => <span>{client.connected}</span>}</Render>
);
export const store = configureStore({
  reducer: { socket: reducer(io) },
  middleware: getDefault => getDefault({ serializableCheck: false }),
});
